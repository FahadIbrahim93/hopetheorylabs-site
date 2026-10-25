import type { SiteContent } from "./types";
import { whatsappLink, whatsappOrderLink } from "./types";

export const en: SiteContent = {
  header: {
    wordmark: "Hope Theory Labs",
    nav: [
      { label: "Approach", href: "#method" },
      { label: "Services", href: "#services" },
      { label: "Work", href: "#work" },
      { label: "Contact", href: "#contact" },
    ],
    whatsapp: "WhatsApp", menu: "Menu", skip: "Skip to content", language: "Site language",
  },
  hero: {
    eyebrow: "The intelligent business platform",
    heading: "Your data. Connected. Your business. Smarter.",
    subheading: "We bring together your data, tools and workflows — and turn them into a living, breathing intelligence.",
    primaryCta: "Message us on WhatsApp", whatsappLink: whatsappOrderLink,
    secondaryCta: "Watch it assemble", secondaryHref: "#method",
    coreDescription: "An animated intelligence core connects websites, CRM, databases, files, apps, APIs, systems and people.",
    coreNodes: ["Websites", "CRM", "Databases", "Files", "Apps", "APIs", "Systems", "People"],
    coreCaption: "Connected intelligence · Hope Theory Labs",
  },
  story: {
    methodEyebrow: "Stage I", methodHeading: "The digital self.",
    methodText: "Before a company can think, it has to be legible. We rebuild your site, brand, systems and records into one clean, professional presence.",
    shiftEyebrow: "Stage II", shiftHeading: "The shift to intelligence.",
    shiftText: "It’s not just about tools. It’s about creating a unified intelligence from your data, systems and people.",
    shiftCta: "Learn more",
    flowEyebrow: "The living platform", flowHeading: "Everything you run, in one living flow.",
    flowItems: [
      { title: "Connect", text: "Your data sources" },
      { title: "Automate", text: "Your workflows" },
      { title: "Scale", text: "Your growth" },
    ],
  },
  howItWorks: {
    eyebrow: "How it works", heading: "Four steps, in plain order.",
    steps: [
      { label: "Map", description: "We list every place your business keeps information: email, chat, spreadsheets, accounting, your storefront." },
      { label: "Digital self", description: "We build the website and clean records that represent you properly, online and inside your own systems." },
      { label: "Connect", description: "We pull those sources into one record, so there is one place to ask and one version of the truth." },
      { label: "Act", description: "We add an assistant on top that answers questions across it and handles routine work, with your team approving what matters." },
    ],
  },
  services: {
    eyebrow: "What we build", heading: "Three disciplines, one outcome.",
    items: [
      { title: "Websites", description: "Fast, mobile-first sites with WhatsApp ordering and cash on delivery. From ৳25,000." },
      { title: "AI integrations", description: "Agents and automations wired into the tools you already run." },
      { title: "AI transformation", description: "A digital self first, then one living intelligence across every data source." },
    ],
    founding: "Founding clients pay ৳15,000, in exchange for a short review and permission to show the site. AI work is by conversation: ask us if you’re curious.",
    earlyAccessTag: "Early access",
  },
  work: {
    eyebrow: "Work", heading: "We build a free concept first.",
    title: "Rollers Republic", tag: "Concept",
    description: "Rollers Republic is a concept we built on the shop’s real catalog. You try it on your phone. If you like it, we set it up on your domain.",
    link: "https://rollers-republic-pitch.vercel.app", linkLabel: "View the concept",
    phoneItems: ["Cold coffee", "Club sandwich", "Brownie"], phoneCta: "Order on WhatsApp",
    phoneMessage: "Hi! I’d like to order: 1 × Cold coffee. Cash on delivery.",
  },
  about: {
    eyebrow: "About", heading: "A small team in Dhaka.",
    text: "We’re Fahad Ibrahim and Tamim Abir. We keep things simple and honest.",
  },
  contact: {
    eyebrow: "Contact", heading: "Begin the conversion.",
    note: "Tell us about your business and we’ll reply on WhatsApp whenever suits you.",
    nameLabel: "Your name", needLabel: "What do you need?", submit: "Send on WhatsApp",
    phone: "WhatsApp 01718463471", phoneHref: whatsappLink, email: "hopetheorybd@gmail.com",
    whatsappCta: "Message us on WhatsApp",
  },
  footer: {
    text: "© 2026 Hope Theory Labs · Dhaka, Bangladesh · from the Hope Theory family. No cookies, no analytics.",
    ticker: ["Email", "CRM", "Billing", "Docs", "Chat", "Storefront", "Support"],
  },
};
export default en;
