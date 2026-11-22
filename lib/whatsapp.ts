/*
  One place for every WhatsApp link on the site.

  A bare https://wa.me/<number> opens the chat with an empty compose box, so
  every link is built here with a ?text= message instead. The text is passed
  through encodeURIComponent, which percent-encodes UTF-8 bytes, so Bangla and
  other non-ASCII characters a visitor types survive the round trip.
  Messages stay in English; only the visitor's own words are passed through.
*/
export const WHATSAPP_NUMBER = "8801718463471";
export const WHATSAPP_BASE = `https://wa.me/${WHATSAPP_NUMBER}`;

/** Default opening line for any button that has no form answers to carry. */
export const WHATSAPP_DEFAULT_MESSAGE = "Hi Hope Theory Labs, I'd like to discuss a project.";

/** Longest free-text answer carried into a link, so URLs stay well under limits. */
const MAX_FIELD = 700;

/** Collapse whitespace and cap length; the visitor's wording is otherwise untouched. */
function tidy(value: string | null | undefined, max = MAX_FIELD): string {
  const flat = String(value ?? "").replace(/\s+/g, " ").trim();
  return flat.length > max ? `${flat.slice(0, max - 1).trimEnd()}…` : flat;
}

/** "Work: X" style part that ends in exactly one full stop (or the visitor's own ! or ?). */
function sentence(label: string, value: string): string {
  return /[.!?…。।]$/.test(value) ? `${label}${value}` : `${label}${value}.`;
}

/**
 * encodeURIComponent leaves ! ' ( ) * . alone. They are legal, but a trailing
 * "." or ")" is easily mistaken for sentence punctuation when the link is pasted
 * into chat text or an email, so we encode them too. The decoded text is identical.
 */
function encodeText(text: string): string {
  return encodeURIComponent(text).replace(/[!'()*.]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`);
}

/** https://wa.me/<number>?text=<encoded message>. Falls back to the default message. */
export function whatsappUrl(message?: string | null): string {
  const text = String(message ?? "").trim() || WHATSAPP_DEFAULT_MESSAGE;
  return `${WHATSAPP_BASE}?text=${encodeText(text)}`;
}

/** The link every plain "Message us on WhatsApp" button or link uses. */
export const whatsappDefaultUrl = whatsappUrl(WHATSAPP_DEFAULT_MESSAGE);

/** A link that names a service or pricing tier. */
export function whatsappTopicUrl(topic: string): string {
  return whatsappUrl(`Hi Hope Theory Labs, I'm interested in ${topic}.`);
}

export interface ContactAnswers {
  name?: string | null;
  /** What kind of work (select). */
  kind?: string | null;
  /** What should it achieve (free text). */
  goal?: string | null;
  /** When to start (select). */
  timing?: string | null;
}

/**
 * "Hi Hope Theory Labs, I'm {name}. Work: {kind}. Goal: {goal}. Start: {timing}."
 * Empty parts are left out cleanly, with no dangling labels or doubled full stops.
 */
export function buildContactMessage({ name, kind, goal, timing }: ContactAnswers): string {
  const who = tidy(name, 120);
  const parts = [who ? `Hi Hope Theory Labs, I'm ${who}${/[.!?]$/.test(who) ? "" : "."}` : "Hi Hope Theory Labs."];
  const work = tidy(kind, 160);
  const aim = tidy(goal);
  const start = tidy(timing, 160);
  if (work) parts.push(sentence("Work: ", work));
  if (aim) parts.push(sentence("Goal: ", aim));
  if (start) parts.push(sentence("Start: ", start));
  return parts.join(" ");
}

/** Read the message back out of a wa.me link (used by tests and the assistant). */
export function whatsappMessageFrom(href: string): string | null {
  const url = new URL(href);
  return url.searchParams.get("text");
}
