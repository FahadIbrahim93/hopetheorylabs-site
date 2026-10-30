/*
 * POST /api/lead — saves an enquiry and notifies Fahad.
 *
 * Supabase and Resend are optional. On any failure the response still includes
 * a prefilled WhatsApp link so the visitor can finish by hand.
 */
import { en } from "../content/en";
import { WHATSAPP } from "../lib/assistant/kb";
import {
  clientKey,
  emailLead,
  jsonResponse,
  logEvent,
  overLimit,
  readJson,
  saveLead,
} from "../lib/assistant/server";

export const maxDuration = 20;

const WINDOW_MS = 10 * 60 * 1000;
const LEAD_LIMIT = 5;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^\+?[\d][\d\s()\-]{6,19}$/;

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function whatsappPrefill(name: string, contact: string, need: string): string {
  const message = `Hi Hope Theory Labs, I'm ${name}. ${need} Contact: ${contact}`;
  return `${WHATSAPP}?text=${encodeURIComponent(message)}`;
}

export function GET(): Response {
  return jsonResponse({ ok: true, service: "lead" }, 200);
}

export async function POST(request: Request): Promise<Response> {
  try {
    const body = await readJson(request);
    if (!body) return jsonResponse({ error: "bad_request" }, 400);

    if (text(body.website).length > 0) {
      logEvent("lead.honeypot", {});
      return jsonResponse({ ok: true, saved: false, notified: false }, 200);
    }

    const name = text(body.name).slice(0, 80);
    const contact = text(body.contact).slice(0, 120);
    const need = text(body.need).slice(0, 600);
    const packageName = text(body.package).slice(0, 60);
    const lang = body.lang === "bn" ? "bn" : "en";

    if (!name || !contact || !need) {
      return jsonResponse({ error: "missing_fields", message: en.assistant.enquiry.required }, 400);
    }
    if (!EMAIL.test(contact) && !PHONE.test(contact)) {
      return jsonResponse({ error: "bad_contact", message: en.assistant.enquiry.required }, 400);
    }

    const whatsapp = whatsappPrefill(name, contact, need);

    let limited = false;
    try {
      limited = await overLimit(clientKey(request), LEAD_LIMIT, WINDOW_MS);
    } catch {
      limited = false;
    }
    if (limited) {
      logEvent("lead.limited", {});
      return jsonResponse(
        { ok: false, error: "rate_limited", saved: false, notified: false, whatsapp },
        429,
      );
    }

    const lead = { name, contact, need, packageName: packageName || undefined, lang };
    const saved = await saveLead(lead);
    const notified = await emailLead(lead);

    logEvent("lead.ok", { saved, notified, lang });
    return jsonResponse({ ok: true, saved, notified, whatsapp }, 200);
  } catch {
    logEvent("lead.crash", { status: 1 });
    return jsonResponse(
      {
        ok: false,
        error: "server_error",
        saved: false,
        notified: false,
        whatsapp: WHATSAPP,
      },
      200,
    );
  }
}
