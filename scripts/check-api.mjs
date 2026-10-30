#!/usr/bin/env node
/*
 * Endpoint guard for the two Vercel Functions in `api/`.
 *
 * They are plain `Request → Response` handlers, so they run here as-is: the
 * test compiles them with the project's TypeScript and calls them directly,
 * with no server, no keys and no network. That covers the path a visitor gets
 * when nothing is configured (the scripted FAQ), the validation the enquiry
 * form depends on, both rate limits, and the price guard that stops a model
 * from quoting a figure the site does not publish.
 *
 * Run with `npm test` or `npm run check:api`.
 */
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const out = mkdtempSync(join(tmpdir(), "htl-api-"));

const failures = [];
function check(label, condition, detail) {
  if (condition) {
    console.log(`  ok  ${label}`);
  } else {
    failures.push(detail ? `${label} — ${detail}` : label);
    console.log(`  FAIL ${label}${detail ? ` — ${detail}` : ""}`);
  }
}

const realFetch = globalThis.fetch;
const realLog = console.log;

function compile() {
  execFileSync(
    process.execPath,
    [
      join(root, "node_modules", "typescript", "bin", "tsc"),
      "api/chat.ts",
      "api/lead.ts",
      "--outDir",
      out,
      "--module",
      "commonjs",
      "--target",
      "es2022",
      "--moduleResolution",
      "node",
      "--esModuleInterop",
      "--skipLibCheck",
    ],
    { cwd: root, stdio: "pipe" },
  );
}

/** POST a body to a handler from a given address, as Vercel would. */
async function call(handler, body, { ip = "203.0.113.1", method = "POST" } = {}) {
  const request = new Request("https://hopetheorylabs.com/api/test", {
    method,
    headers: { "content-type": "application/json", "x-forwarded-for": ip },
    body: method === "POST" ? JSON.stringify(body) : undefined,
  });
  const response = await handler(request);
  const text = await response.text();
  let json = null;
  try {
    json = JSON.parse(text);
  } catch {
    json = null;
  }
  return { status: response.status, json, text, headers: response.headers };
}

/** Swap the provider transport for one canned answer, so the chain can run. */
function stubFetch(respond) {
  globalThis.fetch = async () => respond();
}

const groq = (content) =>
  new Response(JSON.stringify({ choices: [{ message: { content } }] }), {
    status: 200,
    headers: { "content-type": "application/json" },
  });

const gemini = (content) =>
  new Response(
    JSON.stringify({ candidates: [{ content: { parts: [{ text: content }] } }] }),
    { status: 200, headers: { "content-type": "application/json" } },
  );

const failing = () => new Response("upstream down", { status: 503 });

try {
  compile();

  const require = createRequire(import.meta.url);
  const chat = require(join(out, "api", "chat.js"));
  const lead = require(join(out, "api", "lead.js"));
  const { en } = require(join(out, "content", "en.js"));

  /* ---------- chat: the contract the widget relies on ---------- */

  const chatGet = await call(chat.POST, null, { method: "GET" });
  check("chat: GET is rejected", (await chat.GET()).status === 405);
  check("chat: answers are never cached", chatGet.headers.get("cache-control")?.includes("no-store") === true);

  const noBody = await chat.POST(
    new Request("https://hopetheorylabs.com/api/chat", { method: "POST", body: "not json" }),
  );
  check("chat: malformed body is a 400", noBody.status === 400);
  check(
    "chat: missing messages is a 400",
    (await call(chat.POST, {})).status === 400,
  );
  check(
    "chat: a trailing assistant turn is a 400",
    (await call(chat.POST, { messages: [{ role: "assistant", content: "hello" }] })).status === 400,
  );

  const tooLong = await call(chat.POST, {
    messages: [{ role: "user", content: "a".repeat(1001) }],
  }, { ip: "203.0.113.2" });
  check(
    "chat: over-long message is refused with the site's own copy",
    tooLong.status === 400 && tooLong.json?.message === en.assistant.tooLong,
    `${tooLong.status} ${tooLong.json?.error}`,
  );

  /* With no keys, the scripted FAQ must still answer — the brief's floor. */
  const price = await call(chat.POST, {
    messages: [{ role: "user", content: "how much does a website cost?" }],
  }, { ip: "203.0.113.3" });
  const priceReply = price.json?.reply ?? "";
  check("chat: the scripted FAQ answers a price question", price.status === 200 && String(price.json?.source).startsWith("faq:"), price.json?.source);
  check(
    "chat: the answer carries the whole approved ladder",
    ["৳10,000", "৳25,000", "৳45,000"].every((value) => priceReply.includes(value)),
    priceReply.slice(0, 80),
  );
  check("chat: English is the default language", price.json?.lang === "en");

  const bangla = await call(chat.POST, {
    messages: [{ role: "user", content: "ওয়েবসাইটের দাম কত?" }],
  }, { ip: "203.0.113.4" });
  check("chat: Bangla input is answered in Bangla", bangla.json?.lang === "bn", bangla.json?.lang);
  check("chat: Bangla input still gets a reply", Boolean(bangla.json?.reply));

  const emptyish = await call(chat.POST, {
    messages: [{ role: "user", content: "   " }],
  }, { ip: "203.0.113.5" });
  check("chat: a whitespace-only turn is refused", emptyish.status === 400);

  /* ---------- chat: the provider chain, with the transport stubbed ---------- */

  process.env.GROQ_API_KEY = "test-key";
  stubFetch(() => groq("**A shop site starts at ৳10,000.**\n\n- counter from ৳25,000"));
  const viaGroq = await call(chat.POST, {
    messages: [{ role: "user", content: "price for a shop?" }],
  }, { ip: "203.0.113.6" });
  check("chat: Groq is tried first when a key exists", viaGroq.json?.source === "groq", viaGroq.json?.source);
  check(
    "chat: markdown is stripped from a model answer",
    !/[*-]/.test(viaGroq.json?.reply.replace(/[৳,]/g, "")),
    viaGroq.json?.reply,
  );

  process.env.GROQ_API_KEY = "test-key";
  stubFetch(() => groq("Our launch offer is ৳7,500 for everything."));
  const guarded = await call(chat.POST, {
    messages: [{ role: "user", content: "any discount?" }],
  }, { ip: "203.0.113.7" });
  check("chat: an invented price is caught", guarded.json?.source === "guard", guarded.json?.source);
  check("chat: an invented price never reaches the visitor", !String(guarded.json?.reply).includes("7,500"), guarded.json?.reply);
  check("chat: the guard hands off to WhatsApp", String(guarded.json?.reply).includes("wa.me/8801718463471"), guarded.json?.reply);

  delete process.env.GROQ_API_KEY;
  process.env.GEMINI_API_KEY = "test-key";
  stubFetch(() => gemini("A counter site is ৳25,000."));
  const viaGemini = await call(chat.POST, {
    messages: [{ role: "user", content: "counter price" }],
  }, { ip: "203.0.113.8" });
  check("chat: Gemini takes over when Groq has no key", viaGemini.json?.source === "gemini", viaGemini.json?.source);
  check("chat: a real figure passes the guard", viaGemini.json?.reply.includes("৳25,000"), viaGemini.json?.reply);

  process.env.GROQ_API_KEY = "test-key";
  stubFetch(() => failing());
  const bothDown = await call(chat.POST, {
    messages: [{ role: "user", content: "how much for a website?" }],
  }, { ip: "203.0.113.9" });
  check("chat: a failing provider falls back to the FAQ", String(bothDown.json?.source).startsWith("faq:"), bothDown.json?.source);
  check("chat: the fallback answer is still complete", String(bothDown.json?.reply).includes("৳10,000"));
  delete process.env.GROQ_API_KEY;
  delete process.env.GEMINI_API_KEY;

  /* ---------- chat: twenty messages per ten minutes, per address ---------- */

  let lastChat = null;
  for (let i = 0; i < 21; i++) {
    lastChat = await call(chat.POST, {
      messages: [{ role: "user", content: "services?" }],
    }, { ip: "198.51.100.7" });
  }
  check("chat: the twenty-first message in the window is limited", lastChat.status === 429, String(lastChat.status));
  check(
    "chat: the limit message is written, not a raw error",
    lastChat.json?.message === en.assistant.rateLimited && lastChat.json?.reply === en.assistant.rateLimited,
  );
  const otherVisitor = await call(chat.POST, {
    messages: [{ role: "user", content: "services?" }],
  }, { ip: "198.51.100.8" });
  check("chat: the limit is per address", otherVisitor.status === 200, String(otherVisitor.status));

  /* ---------- lead: validation, honeypot, handoff ---------- */

  check("lead: GET is rejected", (await lead.GET()).status === 405);

  const bot = await call(lead.POST, {
    website: "http://spam.example",
    name: "Bot",
    contact: "bot@example.com",
    need: "seo services",
  }, { ip: "203.0.113.20" });
  check(
    "lead: the honeypot answers as if it worked",
    bot.status === 200 && bot.json?.ok === true && bot.json?.saved === false,
    JSON.stringify(bot.json),
  );

  const empty = await call(lead.POST, { name: "", contact: "", need: "" }, { ip: "203.0.113.21" });
  check("lead: empty fields are refused", empty.status === 400 && empty.json?.error === "missing_fields");

  const badContact = await call(lead.POST, { name: "Rahim", contact: "not-a-contact", need: "a shop site" }, { ip: "203.0.113.22" });
  check("lead: an unusable contact is refused", badContact.status === 400 && badContact.json?.error === "bad_contact");

  const good = await call(lead.POST, {
    name: "Rahim",
    contact: "01612345678",
    need: "A shop site with cash on delivery",
    package: "Counter",
    lang: "bn",
  }, { ip: "203.0.113.23" });
  check("lead: a valid enquiry is accepted", good.status === 200 && good.json?.ok === true, JSON.stringify(good.json));
  check("lead: nothing is claimed saved without Supabase", good.json?.saved === false && good.json?.notified === false);
  const wa = String(good.json?.whatsapp ?? "");
  const decoded = decodeURIComponent(wa.split("text=")[1] ?? "");
  check("lead: the WhatsApp handoff is prefilled", wa.startsWith("https://wa.me/8801718463471?text="), wa.slice(0, 60));
  check(
    "lead: the handoff carries name, need and contact",
    ["Rahim", "A shop site with cash on delivery", "01612345678"].every((part) => decoded.includes(part)),
    decoded,
  );

  const email = await call(lead.POST, {
    name: "Nadia",
    contact: "nadia@example.com",
    need: "A showroom site",
  }, { ip: "203.0.113.24" });
  check("lead: an email address is accepted too", email.status === 200 && email.json?.ok === true);

  const huge = await call(lead.POST, {
    name: "R".repeat(200),
    contact: "01612345678",
    need: "N".repeat(900),
  }, { ip: "203.0.113.25" });
  check("lead: over-long fields are trimmed, not rejected", huge.status === 200 && decodeURIComponent(String(huge.json?.whatsapp).split("text=")[1]).length < 900);

  let lastLead = null;
  for (let i = 0; i < 6; i++) {
    lastLead = await call(lead.POST, { name: "Rahim", contact: "01612345678", need: "site" }, { ip: "198.51.100.30" });
  }
  check("lead: the sixth enquiry in the window is limited", lastLead.status === 429, String(lastLead.status));
  check("lead: the limited visitor still gets the handoff", String(lastLead.json?.whatsapp).startsWith("https://wa.me/"), String(lastLead.json?.whatsapp).slice(0, 40));

  /* ---------- the logs must not carry the visitor ---------- */

  const logged = [];
  console.log = (...parts) => logged.push(parts.join(" "));
  await call(lead.POST, { name: "Samira", contact: "01712345678", need: "a portfolio" }, { ip: "203.0.113.40" });
  await call(chat.POST, { messages: [{ role: "user", content: "hello there" }] }, { ip: "203.0.113.41" });
  console.log = realLog;

  const serialised = logged.join("\n");
  check("logs: every line is structured JSON", logged.every((line) => { try { JSON.parse(line); return true; } catch { return false; } }), logged.slice(0, 2).join(" | "));
  check(
    "logs: no name, number or message body is written",
    !serialised.includes("Samira") && !serialised.includes("01712345678") && !serialised.includes("hello there"),
    serialised.slice(0, 120),
  );
} finally {
  globalThis.fetch = realFetch;
  console.log = realLog;
  delete process.env.GROQ_API_KEY;
  delete process.env.GEMINI_API_KEY;
  rmSync(out, { recursive: true, force: true });
}

console.log(`\n${failures.length ? "FAILED" : "The endpoints behave."}\n`);
if (failures.length) {
  console.log("Failed:\n" + failures.map((name) => " - " + name).join("\n"));
  process.exit(1);
}
