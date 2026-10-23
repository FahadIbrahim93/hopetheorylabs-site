import type { SiteContent } from "./types";
import { whatsappLink, whatsappOrderLink } from "./types";

// All copy below is verbatim from docs/SPEC.md ("Section-by-section layout").
export const en: SiteContent = {
  header: {
    nav: [
      { label: "How it works", href: "#how" },
      { label: "Work", href: "#work" },
      { label: "Pricing", href: "#pricing" },
      { label: "Contact", href: "#contact" },
    ],
    whatsapp: "WhatsApp",
  },
  hero: {
    heading: "Fast websites for Bangladeshi businesses.",
    subheading:
      "Mobile-first sites with WhatsApp ordering built in. We'll build a free concept of yours first.",
    primaryCta: "Message us on WhatsApp",
    whatsappLink: whatsappOrderLink,
    secondaryCta: "See pricing",
    pricingHref: "#pricing",
  },
  howItWorks: {
    steps: [
      "We build a free working concept with your products.",
      "You try it on your phone.",
      "If you like it, we set it up on your domain.",
    ],
  },
  whatYouGet: {
    items: [
      "Fast on mobile",
      "Orders straight to your WhatsApp",
      "Cash on delivery",
      "Easy to update",
    ],
  },
  speedSlider: {
    label: "Illustrative only",
  },
  work: {
    title: "Rollers Republic",
    tag: "Concept",
    description: "A free concept built on the shop's real catalog.",
    link: "https://rollers-republic-pitch.vercel.app",
  },
  pricing: {
    base: "Websites from ৳25,000.",
    founding:
      "Founding clients: ৳15,000, in exchange for a short review and permission to show your site.",
    cta: "Ask about a free concept",
  },
  earlyAccess: {
    heading: "Coming soon",
    tag: "Early access",
    items: ["AI audits", "Forward-deployed AI engineering"],
    text: "Ask us if you're curious.",
  },
  about: {
    text: "We're a small team in Dhaka: Fahad Ibrahim and Tamim Abir. We keep things simple and honest.",
  },
  contact: {
    phone: "WhatsApp 01718463471",
    phoneHref: whatsappLink,
    email: "hopetheorybd@gmail.com",
    note: "Reply whenever suits you.",
  },
  footer: {
    text: "© 2026 Hope Theory Labs · Dhaka, Bangladesh · from the Hope Theory family.",
  },
};

export default en;
