/*
  Shared shape for content/en.ts and content/bn.ts.
  Copy content is defined in docs/SPEC.md ("Section-by-section layout") — the
  single source of truth. No other copy may be invented.
*/

export interface NavLink {
  label: string;
  href: string;
}

export interface SiteContent {
  header: {
    wordmark: string;
    nav: NavLink[];
    whatsapp: string;
    menu: string;
    skip: string;
    language: string;
  };
  hero: {
    heading: string;
    subheading: string;
    primaryCta: string;
    whatsappLink: string;
    secondaryCta: string;
    pricingHref: string;
    mockupDescription: string;
  };
  howItWorks: {
    heading: string;
    steps: string[];
  };
  whatYouGet: {
    heading: string;
    items: string[];
  };
  speedSlider: {
    label: string;
    before: string;
    after: string;
  };
  work: {
    heading: string;
    title: string;
    tag: string;
    description: string;
    link: string;
  };
  pricing: {
    heading: string;
    base: string;
    founding: string;
    cta: string;
  };
  earlyAccess: {
    heading: string;
    tag: string;
    items: string[];
    text: string;
  };
  about: {
    heading: string;
    text: string;
  };
  contact: {
    heading: string;
    phone: string;
    phoneHref: string;
    email: string;
    note: string;
  };
  footer: {
    text: string;
  };
}

export const whatsappOrderLink =
  "https://wa.me/8801718463471?text=Hi%20Hope%20Theory%20Labs%2C%20I%27d%20like%20a%20free%20website%20concept";
export const whatsappLink = "https://wa.me/8801718463471";
