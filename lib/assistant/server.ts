/*
 * Server helpers for the two Vercel Functions in `api/`.
 *
 * No SDKs and no node: built-ins — Supabase/Resend via fetch only, so the
 * function bootstraps on both Node and Edge-style runtimes.
 */
import { en } from "../../content/en";

export function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store, max-age=0",
    },
  });
}

export async function readJson(request: Request): Promise<Record<string, unknown> | null> {
  try {
    const data: unknown = await request.json();
    if (!data || typeof data !== "object" || Array.isArray(data)) return null;
    return data as Record<string, unknown>;
  } catch {
    return null;
  }
}

/** Stable non-cryptographic fingerprint of the client IP (rate limit only). */
function fingerprint(input: string): string {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(16).padStart(8, "0");
}

export function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for") ?? "";
  const ip = forwarded.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
  return fingerprint(`hope-theory-labs:${ip}`);
}

const LOCAL = new Map<string, number[]>();

function recordLocal(key: string, windowMs: number): number {
  const now = Date.now();
  const hits = (LOCAL.get(key) ?? []).filter((at) => now - at < windowMs);
  hits.push(now);
  LOCAL.set(key, hits);
  if (LOCAL.size > 5000) {
    for (const [other, times] of LOCAL) {
      const last = times[times.length - 1];
      if (!last || now - last >= windowMs) LOCAL.delete(other);
    }
  }
  return hits.length;
}

function supabase(): { url: string; key: string } | null {
  const url = process.env.SUPABASE_URL?.replace(/\/+$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return url && key ? { url, key } : null;
}

function supabaseHeaders(key: string): Record<string, string> {
  return {
    apikey: key,
    authorization: `Bearer ${key}`,
    "content-type": "application/json",
  };
}

async function countRows(table: string, filter: string): Promise<number | null> {
  const client = supabase();
  if (!client) return null;
  try {
    const response = await fetch(`${client.url}/rest/v1/${table}?${filter}&select=id`, {
      headers: { ...supabaseHeaders(client.key), prefer: "count=exact", range: "0-0" },
      signal: AbortSignal.timeout(6000),
    });
    if (!response.ok) return null;
    const range = response.headers.get("content-range") ?? "";
    const total = Number(range.split("/")[1]);
    return Number.isFinite(total) ? total : null;
  } catch {
    return null;
  }
}

async function insertRow(table: string, row: Record<string, unknown>): Promise<boolean> {
  const client = supabase();
  if (!client) return false;
  try {
    const response = await fetch(`${client.url}/rest/v1/${table}`, {
      method: "POST",
      headers: { ...supabaseHeaders(client.key), prefer: "return=minimal" },
      body: JSON.stringify(row),
      signal: AbortSignal.timeout(6000),
    });
    return response.ok;
  } catch {
    return false;
  }
}

/** Soft distributed limit: local bucket first; when Supabase is set, record then count. */
export async function overLimit(key: string, limit: number, windowMs: number): Promise<boolean> {
  try {
    if (recordLocal(key, windowMs) > limit) return true;
    const client = supabase();
    if (!client) return false;
    await insertRow("rate_limit_hits", { key });
    const since = new Date(Date.now() - windowMs).toISOString();
    const shared = await countRows("rate_limit_hits", `key=eq.${key}&created_at=gte.${since}`);
    return shared !== null && shared > limit;
  } catch {
    return false;
  }
}

export interface Lead {
  name: string;
  contact: string;
  need: string;
  packageName?: string;
  lang?: string;
}

export async function saveLead(lead: Lead): Promise<boolean> {
  try {
    return await insertRow("leads", {
      name: lead.name,
      contact: lead.contact,
      need: lead.need,
      package: lead.packageName ?? null,
      lang: lead.lang ?? "en",
    });
  } catch {
    return false;
  }
}

export async function emailLead(lead: Lead): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_NOTIFY_EMAIL || en.contact.email;
  if (!apiKey || !to) return false;
  const lines = [
    `Name: ${lead.name}`,
    `Contact: ${lead.contact}`,
    `Needs: ${lead.need}`,
  ];
  if (lead.packageName) lines.push(`Interested in: ${lead.packageName}`);
  if (lead.lang) lines.push(`Language: ${lead.lang}`);
  lines.push("", "Sent from the website assistant.");
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { authorization: `Bearer ${apiKey}`, "content-type": "application/json" },
      body: JSON.stringify({
        from: "onboarding@resend.dev",
        to: [to],
        subject: `New website enquiry — ${lead.name}`,
        text: lines.join("\n"),
      }),
      signal: AbortSignal.timeout(8000),
    });
    return response.ok;
  } catch {
    return false;
  }
}

export function logEvent(event: string, fields: Record<string, string | number | boolean | null>): void {
  try {
    console.log(JSON.stringify({ event, ...fields }));
  } catch {
    /* ignore */
  }
}
