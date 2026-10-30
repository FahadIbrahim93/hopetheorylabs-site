/*
 * POST /api/chat — the assistant's model endpoint.
 *
 * Provider chain: Groq free tier → Google Gemini free tier → the scripted FAQ
 * matcher in `lib/assistant/kb.ts`. The last step needs no key at all, so the
 * chat keeps answering with nothing configured.
 *
 * Web-standard (Request → Response) handler so the same file runs as a Vercel
 * Function without pulling in @vercel/node.
 */
import { en } from "../content/en";
import {
  HANDOFF_REPLY,
  buildSystemPrompt,
  hasBangla,
  matchFaq,
  unknownPrice,
} from "../lib/assistant/kb";
import { clientKey, jsonResponse, logEvent, overLimit, readJson } from "../lib/assistant/server";

export const config = { maxDuration: 30 };

const MAX_CHARS = 1000;
const MAX_TURNS = 12;
const WINDOW_MS = 10 * 60 * 1000;
const MESSAGE_LIMIT = 20;

interface Turn {
  role: "user" | "assistant";
  content: string;
}

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function sanitize(reply: string): string {
  return reply
    .replace(/\*\*|__|`/g, "")
    .replace(/^#{1,6}\s*/gm, "")
    .replace(/^\s*[-*•]\s+/gm, "")
    .replace(/\s{3,}/g, " ")
    .trim()
    .slice(0, 1200);
}

async function askGroq(turns: Turn[], system: string): Promise<string | null> {
  const key = process.env.GROQ_API_KEY;
  if (!key) return null;
  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { authorization: `Bearer ${key}`, "content-type": "application/json" },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        temperature: 0.3,
        max_tokens: 320,
        messages: [{ role: "system", content: system }, ...turns],
      }),
      signal: AbortSignal.timeout(12000),
    });
    if (!response.ok) {
      logEvent("chat.provider", { provider: "groq", status: response.status });
      return null;
    }
    const data = (await response.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const reply = text(data.choices?.[0]?.message?.content);
    return reply || null;
  } catch {
    logEvent("chat.provider", { provider: "groq", status: 0 });
    return null;
  }
}

async function askGemini(turns: Turn[], system: string): Promise<string | null> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${encodeURIComponent(key)}`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: system }] },
          contents: turns.map((turn) => ({
            role: turn.role === "assistant" ? "model" : "user",
            parts: [{ text: turn.content }],
          })),
          generationConfig: { temperature: 0.3, maxOutputTokens: 320 },
        }),
        signal: AbortSignal.timeout(12000),
      },
    );
    if (!response.ok) {
      logEvent("chat.provider", { provider: "gemini", status: response.status });
      return null;
    }
    const data = (await response.json()) as {
      candidates?: { content?: { parts?: { text?: string }[] } }[];
    };
    const reply = text(data.candidates?.[0]?.content?.parts?.[0]?.text);
    return reply || null;
  } catch {
    logEvent("chat.provider", { provider: "gemini", status: 0 });
    return null;
  }
}

export function GET(): Response {
  return jsonResponse({ error: "method_not_allowed" }, 405);
}

export async function POST(request: Request): Promise<Response> {
  const body = await readJson(request);
  if (!body || !Array.isArray(body.messages)) {
    return jsonResponse({ error: "bad_request" }, 400);
  }

  const turns: Turn[] = [];
  for (const item of body.messages.slice(-MAX_TURNS)) {
    if (!item || typeof item !== "object") continue;
    const role = (item as { role?: unknown }).role;
    const content = text((item as { content?: unknown }).content);
    if (role !== "user" && role !== "assistant") continue;
    if (!content) continue;
    if (role === "user" && content.length > MAX_CHARS) {
      return jsonResponse({ error: "too_long", message: en.assistant.tooLong }, 400);
    }
    turns.push({ role, content });
  }

  const last = turns[turns.length - 1];
  if (!last || last.role !== "user") {
    return jsonResponse({ error: "bad_request" }, 400);
  }

  const limited = await overLimit(clientKey(request), MESSAGE_LIMIT, WINDOW_MS);
  if (limited) {
    logEvent("chat.limited", { turns: turns.length });
    return jsonResponse(
      { error: "rate_limited", message: en.assistant.rateLimited, reply: en.assistant.rateLimited },
      429,
    );
  }

  const system = buildSystemPrompt();
  const lang = hasBangla(last.content) ? "bn" : "en";

  let reply = await askGroq(turns, system);
  let source = "groq";
  if (!reply) {
    reply = await askGemini(turns, system);
    source = "gemini";
  }
  if (!reply) {
    const fallback = matchFaq(last.content);
    reply = fallback.reply;
    source = `faq:${fallback.id}`;
  }

  const invented = unknownPrice(reply);
  if (invented) {
    logEvent("chat.price_guard", { source });
    reply = HANDOFF_REPLY;
    source = "guard";
  }

  const clean = sanitize(reply);
  if (!clean) {
    return jsonResponse({ reply: HANDOFF_REPLY, source: "handoff", lang }, 200);
  }

  logEvent("chat.ok", { source, lang, turns: turns.length });
  return jsonResponse({ reply: clean, source, lang }, 200);
}
