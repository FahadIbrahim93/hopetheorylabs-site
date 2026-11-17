/*
 * Shared content contract for the English and Bangla site copy.
 * Keep all user-facing copy in content/en.ts and content/bn.ts.
 */
export interface NavLink { label: string; href: string }

export interface AssistantCopy {
  title: string; open: string; close: string; intro: string;
  inputLabel: string; placeholder: string; send: string; sending: string;
  privacy: string; handoff: string; handoffCta: string; error: string;
  rateLimited: string; tooLong: string; chips: string[]; booking: string;
  enquiry: {
    name: string; contact: string; need: string; summary: string;
    sendWhatsApp: string; email: string; save: string; saving: string;
    saved: string; saveFailed: string; required: string; emailSubject: string; back: string;
  };
}

export type WorkCaseTag = "Concept" | "Shipped" | "In progress";

export interface WorkCaseStudy {
  slug: string;
  title: string;
  tag: WorkCaseTag;
  discipline: "Website" | "Browser game" | "AI integration" | "AI transformation";
  summary: string;
  /** Factual deliverables only — no invented metrics or client logos. */
  deliverables: string[];
  link?: { href: string; label: string };
  secondaryLink?: { href: string; label: string };
  gamePreview?: {
    imageSrc: string;
    imageAlt: string;
    playHref: string;
    playLabel: string;
  };
  phoneDemo?: {
    storeName: string;
    items: string[];
    cta: string;
    message: string;
  };
}

/** One of the five service pillars (issue #44). Plain descriptions only: no fees, client names or metrics. */
export interface ServicePillar {
  slug: string;
  title: string;
  summary: string;
  problem: string;
  outputs: string[];
  fit: string;
  engagement: string;
}

export interface Founder {
  name: string;
  role: string;
}

export interface PricingTier {
  name: string;
  subtitle: string;
  price: string;
  badge?: string;
  features: string[];
  delivery: string;
  forWho: string;
  cta: string;
  whatsappLink: string;
}

export interface SiteContent {
  header: {
    wordmark: string;
    /** Absolute or root-relative hrefs so links work from every route. */
    homeHref: string;
    nav: NavLink[];
    cta: NavLink;
    whatsapp: string;
    menu: string;
    skip: string;
    language: string;
    /** When false, the Bangla toggle is hidden until copy is reviewed (docs/QA.md). */
    banglaEnabled: boolean;
  };
  hero: {
    /** Split on " / " into two lines. */
    eyebrow: string; heading: string; tagline: string; subheading: string; primaryCta: string;
    whatsappLink: string; secondaryCta: string; secondaryHref: string;
    coreDescription: string; coreNodes: string[]; coreNodeDetails: string[]; coreCaption: string;
  };
  story: {
    methodEyebrow: string; methodHeading: string; methodText: string;
    shiftEyebrow: string; shiftHeading: string; shiftText: string; shiftCta: string;
    flowEyebrow: string; flowHeading: string; flowText: string; flowHint: string;
    flowItems: { title: string; text: string }[];
  };
  howItWorks: { eyebrow: string; heading: string; steps: { label: string; description: string }[] };
  services: {
    eyebrow: string;
    heading: string;
    intro: string;
    pillars: ServicePillar[];
    labels: { problem: string; outputs: string; fit: string; engagement: string };
    detailsCta: NavLink;
    /** How custom (non-package) work is priced. No figures. */
    customNote: string;
    whatsappCta: string;
    whatsappLink: string;
    /** Published website packages: a separate, secondary offer. */
    packages: { label: string; title: string; description: string; note: string; cta: NavLink };
  };
  whatYouGet: { heading: string; items: string[] };
  speedSlider: { label: string; before: string; after: string; aria: string };
  pricing: {
    eyebrow: string;
    heading: string;
    intro: string;
    tiers: PricingTier[];
    founding: string;
    payment: string;
    addOnsHeading: string;
    addOns: { label: string; price: string }[];
    aiHeading: string;
    aiCards: { title: string; tag: string; price: string; description: string; cta: string; whatsappLink: string }[];
  };
  work: {
    eyebrow: string;
    heading: string;
    intro: string;
    honestyNote: string;
    cases: WorkCaseStudy[];
  };
  about: { eyebrow: string; heading: string; text: string; founder: Founder };
  contact: {
    eyebrow: string; heading: string; note: string; nameLabel: string; needLabel: string;
    submit: string; phone: string; phoneHref: string; email: string; whatsappCta: string;
  };
  assistant: AssistantCopy;
  footer: { text: string; ticker: string[]; nav: NavLink[]; navLabel: string };
  studio: {
    introWordmark: string;
    railLabel: string;
  };
}
export const whatsappLink = "https://wa.me/8801718463471";
export const whatsappProjectLink =
  "https://wa.me/8801718463471?text=Hi%20Hope%20Theory%20Labs%2C%20I%27d%20like%20to%20discuss%20a%20project.";
/** WhatsApp link with prefilled text naming a pricing tier or service. */
export const whatsappFor = (topic: string) =>
  `https://wa.me/8801718463471?text=${encodeURIComponent(`Hi Hope Theory Labs, I'm interested in ${topic}.`)}`;
