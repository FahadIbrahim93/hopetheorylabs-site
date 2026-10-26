/*
 * Shared content contract for the English and Bangla site copy.
 * Keep all user-facing copy in content/en.ts and content/bn.ts.
 */
export interface NavLink { label: string; href: string }
export interface SiteContent {
  header: { wordmark: string; nav: NavLink[]; whatsapp: string; menu: string; skip: string; language: string };
  hero: {
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
    websiteLane: {
      label: string;
      items: { title: string; description: string }[];
      note: string;
    };
    aiLane: {
      label: string;
      tag: string;
      items: { title: string; description: string }[];
      note: string;
      whatsappCta: string;
      whatsappLink: string;
    };
  };
  whatYouGet: { heading: string; items: string[] };
  speedSlider: { label: string; before: string; after: string; aria: string };
  pricing: { heading: string; base: string; founding: string; cta: string };
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
  footer: { text: string; ticker: string[] };
}
export const whatsappOrderLink = "https://wa.me/8801718463471?text=Hi%20Hope%20Theory%20Labs%2C%20I%27d%20like%20a%20free%20website%20concept";
export const whatsappAiLink =
  "https://wa.me/8801718463471?text=Hi%20Hope%20Theory%20Labs%2C%20I%27d%20like%20to%20talk%20about%20AI%20integrations%20or%20transformation.";
export const whatsappLink = "https://wa.me/8801718463471";
