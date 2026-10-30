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
export interface SiteContent {
  header: { wordmark: string; nav: NavLink[]; whatsapp: string; menu: string; skip: string; language: string };
  hero: {
    eyebrow: string; heading: string; subheading: string; primaryCta: string;
    whatsappLink: string; secondaryCta: string; secondaryHref: string;
    coreDescription: string; coreNodes: string[]; coreCaption: string;
  };
  story: {
    methodEyebrow: string; methodHeading: string; methodText: string;
    shiftEyebrow: string; shiftHeading: string; shiftText: string; shiftCta: string;
    flowEyebrow: string; flowHeading: string; flowItems: { title: string; text: string }[];
  };
  howItWorks: { eyebrow: string; heading: string; steps: { label: string; description: string }[] };
  services: {
    eyebrow: string; heading: string;
    items: { title: string; description: string }[];
    founding: string; earlyAccessTag: string;
  };
  whatYouGet: { heading: string; items: string[] };
  speedSlider: { label: string; before: string; after: string; aria: string };
  pricing: {
    eyebrow: string; heading: string; base: string; terms: string;
    tiers: { name: string; price: string }[];
    cta: string;
  };
  earlyAccess: { heading: string; tag: string; items: string[]; text: string };
  work: {
    eyebrow: string; heading: string; title: string; tag: string; description: string;
    link: string; linkLabel: string; phoneItems: string[]; phoneCta: string; phoneMessage: string;
  };
  about: { eyebrow: string; heading: string; text: string };
  contact: {
    eyebrow: string; heading: string; note: string; nameLabel: string; needLabel: string;
    submit: string; phone: string; phoneHref: string; email: string; whatsappCta: string;
  };
  assistant: AssistantCopy;
  footer: { text: string; ticker: string[] };
}
export const whatsappOrderLink = "https://wa.me/8801718463471?text=Hi%20Hope%20Theory%20Labs%2C%20I%27d%20like%20a%20free%20website%20concept";
export const whatsappLink = "https://wa.me/8801718463471";
