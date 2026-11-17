/*
 * The assistant's knowledge base.
 *
 * Every fact is derived from `content/en.ts` at import time, so the assistant
 * cannot drift from the approved site copy. Do not add price, client or
 * credential text here: anything the site does not say, the assistant must not
 * say either. `npm test` fails if this file starts carrying its own ৳ figures.
 */
import { en } from "../../content/en";
import { whatsappLink } from "../../content/types";

export const EMAIL = en.contact.email;
export const WHATSAPP = whatsappLink;
export const WHATSAPP_DISPLAY = en.contact.phone.replace(/^WhatsApp\s+/, "");

// Assistant copy for the repositioned studio (issue #47). Every fact is read
// from content/en.ts, so the assistant cannot drift from the published copy.
const website = en.services.packages;
const pillars = en.services.pillars;
const forwardDeployed = pillars.find((item) => item.slug === "forward-deployed-engineering");

/** The approved package ladder, read straight from the pricing block. */
export const PACKAGES = `${en.pricing.tiers
  .map((tier) => `${tier.name} ${tier.price}`)
  .join(", ")}. ${en.pricing.payment} ${en.pricing.founding}`;

export const FACTS = {
  studio: `${en.about.heading} ${en.about.text} ${en.about.founder.name}: ${en.about.founder.role}.`,
  website: `${website.title}: ${website.description} ${website.note}`,
  services: pillars.map((item) => `${item.title}: ${item.summary}`).join(" "),
  customQuote: en.services.customNote,
  forwardDeployed: forwardDeployed ? `${forwardDeployed.summary} ${forwardDeployed.engagement}` : "",
  discovery: `${en.howItWorks.steps[0]?.label ?? "Discover"}: ${en.howItWorks.steps[0]?.description ?? ""} ${en.services.customNote}`,
  fit: pillars.map((item) => `${item.title}: ${item.fit}`).join(" "),
  founding: en.pricing.founding,
  pricing: en.pricing.intro,
  packages: PACKAGES,
  whatYouGet: en.whatYouGet.items.join(", "),
  steps: en.howItWorks.steps
    .map((step, index) => `${index + 1}. ${step.label}: ${step.description}`)
    .join(" "),
  concept: `${en.work.heading} ${en.work.intro}`,
  stages: `${en.story.methodText} ${en.story.shiftText}`,
  flow: en.story.flowItems.map((item) => `${item.title}: ${item.text}`).join("; "),
  contact: `WhatsApp ${WHATSAPP_DISPLAY}, email ${EMAIL}`,
} as const;

export const FACTS_LINES: readonly string[] = [
  `Studio: ${FACTS.studio}`,
  `Websites: ${FACTS.website}`,
  `What a website includes: ${FACTS.whatYouGet}`,
  `Price: ${FACTS.pricing}`,
  `Packages: ${FACTS.packages}`,
  `Founding offer: ${FACTS.founding}`,
  `Services: ${FACTS.services}`,
  `Forward-deployed engineering: ${FACTS.forwardDeployed}`,
  `Who each service fits: ${FACTS.fit}`,
  `Custom work pricing: ${FACTS.customQuote}`,
  `How work starts: ${FACTS.discovery}`,
  `How we work: ${FACTS.steps}`,
  `Free concept: ${FACTS.concept}`,
  `The approach: ${FACTS.stages}`,
  `The living platform: ${FACTS.flow}`,
  `Contact: ${FACTS.contact}`,
];

const PRICE_PATTERNS: readonly RegExp[] = [
  /৳\s?[\d,]+/g,
  /[\d][\d,]{2,}\s*(?:taka|tk|bdt)\b/gi,
  /\b(?:taka|tk|bdt)\s*[\d][\d,]{2,}/gi,
];

interface PriceHit {
  raw: string;
  digits: string;
}

function priceHits(text: string): PriceHit[] {
  const hits: PriceHit[] = [];
  for (const pattern of PRICE_PATTERNS) {
    for (const match of text.matchAll(pattern)) {
      const digits = match[0].replace(/[^\d]/g, "");
      if (digits) hits.push({ raw: match[0].trim(), digits });
    }
  }
  return hits;
}

export const ALLOWED_PRICES: ReadonlySet<string> = new Set(
  FACTS_LINES.flatMap((line) => priceHits(line)).map((hit) => hit.digits),
);

export function unknownPrice(text: string): string | null {
  for (const hit of priceHits(text)) {
    if (!ALLOWED_PRICES.has(hit.digits)) return hit.raw;
  }
  return null;
}

export function hasBangla(text: string): boolean {
  return /[\u0980-\u09FF]/.test(text);
}

export const HANDOFF_REPLY = `${en.assistant.handoff} ${WHATSAPP}`;

type Rule = { id: string; test: RegExp; reply: string };

const RULES: Rule[] = [
  {
    id: "contact",
    test: /whatsapp|phone|number|e-?mail|contact|reach you|talk to|নম্বর|যোগাযোগ|ইমেইল|ফোন|হোয়াটসঅ্যাপ/i,
    reply: `You can reach us on WhatsApp at ${WHATSAPP_DISPLAY}, or email ${EMAIL}.`,
  },
  {
    id: "price",
    test: /price|pricing|cost|budget|how much|৳|taka|price list|quote|charge|package|tier|starter|counter|showroom|care plan|দাম|খরচ|কত|টাকা|বাজেট|প্যাকেজ/i,
    reply: `${en.pricing.intro} ${PACKAGES}`.trim(),
  },
  // Discovery sits after price on purpose: "how much for a small business site?"
  // must get the published packages, not the scoping answer.
  {
    id: "discovery",
    test: /forward[- ]deployed|discovery|scope|scoping|proposal|custom quote|how long|enterprise|\bsme\b|small business|startup|larger (?:compan|organi)|who (?:is|are) (?:this|you) for|এন্টারপ্রাইজ|স্কোপ|ডিসকভারি/i,
    reply: `${FACTS.forwardDeployed} ${FACTS.discovery}`,
  },
  {
    id: "concept",
    test: /free|concept|demo|mock-?up|sample|trial|ফ্রি|ফ্রী|কনসেপ্ট|ডেমো/i,
    reply: `${en.work.heading} ${en.work.intro}`,
  },
  {
    id: "ai",
    test: /\bai\b|automation|automate|agent|assistant|chatbot|integration|transformation|অটোমেশন|এআই|ইন্টিগ্রেশন/i,
    reply: `${FACTS.services} ${FACTS.customQuote}`,
  },
  {
    id: "process",
    test: /how (does|do) (it|you) work|process|steps|what happens|\bstart\b|getting started|timeline|how long|কীভাবে|কিভাবে|কতদিন|সময়|প্রসেস/i,
    reply: `${en.howItWorks.heading} ${en.howItWorks.steps.map((step) => step.label).join(" → ")}. ${en.howItWorks.steps.map((step) => step.description).join(" ")} Timing depends on scope, so we confirm it with you on WhatsApp.`,
  },
  {
    id: "team",
    test: /who are you|who is|team|about you|founder|company|কে|টিম|কোম্পানি|সম্পর্কে/i,
    reply: FACTS.studio,
  },
  {
    id: "website",
    test: /website|site|web page|shop|store|ecommerce|order|ওয়েবসাইট|সাইট|দোকান/i,
    reply: `${FACTS.website} ${FACTS.whatYouGet}.`,
  },
];

export function matchFaq(message: string): { id: string; reply: string } {
  for (const rule of RULES) {
    if (rule.test.test(message)) return { id: rule.id, reply: rule.reply };
  }
  return { id: "handoff", reply: HANDOFF_REPLY };
}

export function buildSystemPrompt(): string {
  return [
    "You are the assistant on the Hope Theory Labs website: a founder-led AI engineering and custom software studio in Dhaka, Bangladesh.",
    "Facts you may use, and the only facts you may use:",
    ...FACTS_LINES.map((line) => `- ${line}`),
    "Rules:",
    "- Answer only from the facts above. If the answer is not there, say you don't have it and give the WhatsApp link.",
    "- Reply in the visitor's language: Bangla if they write Bengali script or ask in Bangla, otherwise English.",
    "- At most 90 words, plain sentences, no markdown, no bullet characters, no emoji.",
    "- Never invent prices, packages, discounts, timelines, clients, reviews, statistics or credentials.",
    "- Never say a call, meeting or booking is confirmed or created. Enquiries and bookings continue on WhatsApp.",
    "- Forward-deployed work is scoped per project. It is not a resident team and never a published fee.",
    "- Published website packages are a separate offer. Do not present them as the company's only service.",
    "- Do not name anyone except the team members in the facts.",
    `- WhatsApp: ${WHATSAPP}. Email: ${EMAIL}.`,
  ].join("\n");
}
