/*
 * Shared content contract for the site copy.
 * Keep all user-facing copy in content/en.ts.
 */
import { whatsappDefaultUrl, whatsappTopicUrl, whatsappUrl } from "../lib/whatsapp";
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

export type WorkCaseTag = "Concept" | "Shipped" | "In progress" | "Internal";

export interface WorkCaseStudy {
  slug: string;
  title: string;
  tag: WorkCaseTag;
  discipline: "Website" | "Browser game" | "AI integration" | "AI transformation";
  summary: string;
  /** Issue #46: the problem and what the build demonstrates, in plain words. */
  problem?: string;
  demonstrates?: string;
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

/** One of the six service pillars (issue #44). Plain descriptions only: no fees, client names or metrics. */
export interface ServicePillar {
  slug: string;
  /** "lead" services come first; "supporting" services back them up. */
  lane: "lead" | "supporting";
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
  };
  hero: {
    /** Split on " / " into two lines. */
    eyebrow: string; heading: string; subheading: string; primaryCta: string;
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
    laneLabels: { lead: string; supporting: string };
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
    packagesHeading: string;
    packagesIntro: string;
    customNote: string;
    /** One-line pointer from /pricing to the packages on /services. */
    packagesNote: string;
    tiers: PricingTier[];
    payment: string;
    addOnsHeading: string;
    addOns: { label: string; price: string }[];
    aiCards: { title: string; tag: string; price: string; description: string; cta: string; whatsappLink: string }[];
  };
  work: {
    eyebrow: string;
    heading: string;
    intro: string;
    honestyNote: string;
    labels: { problem: string; demonstrates: string };
    cases: WorkCaseStudy[];
  };
  about: { eyebrow: string; heading: string; text: string; founder: Founder };
  contact: {
    eyebrow: string;
    heading: string;
    note: string;
    nameLabel: string;
    typeLabel: string;
    typeOptions: string[];
    objectiveLabel: string;
    timeframeLabel: string;
    timeframeOptions: string[];
    submit: string; nameError: string; objectiveError: string; phone: string; phoneHref: string; email: string; whatsappCta: string;
  };
  assistant: AssistantCopy;
  footer: { text: string; ticker: string[]; nav: NavLink[]; navLabel: string; social: { label: string; href: string; aria: string } };
  studio: {
    introWordmark: string;
    railLabel: string;
  };
}
/*
  Every WhatsApp link carries a prefilled message (see lib/whatsapp.ts). A bare
  wa.me link opens an empty chat, so `whatsappLink` is the default-message link.
*/
export const whatsappLink = whatsappDefaultUrl;
export const whatsappProjectLink = whatsappUrl("Hi Hope Theory Labs, I'd like to discuss a project.");
/** WhatsApp link with prefilled text naming a pricing tier or service. */
export const whatsappFor = whatsappTopicUrl;
