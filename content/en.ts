import type { SiteContent } from "./types";
import { whatsappAiLink, whatsappLink, whatsappOrderLink } from "./types";

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
    eyebrow: "Websites you can ship · Intelligence you can grow into",
    heading: "Your data. Connected. / Your business. Smarter.",
    subheading:
      "We build fast, mobile-first sites with WhatsApp ordering for Dhaka businesses today. The connected intelligence in this experience is where we take you next — AI transformation is early access, by conversation.",
    primaryCta: "Message us on WhatsApp", whatsappLink: whatsappOrderLink,
    secondaryCta: "Watch it assemble", secondaryHref: "#method",
    coreDescription: "An animated intelligence core connects websites, CRM, databases, files, apps, APIs, systems and people.",
    coreNodes: ["Productivity", "CRM", "Databases", "Files", "Apps", "APIs", "Systems", "People"],
    coreNodeDetails: [
      "Calendars, docs, tasks and notes, in one place.",
      "Customer history, deals and follow-ups, in one record.",
      "Your tables and spreadsheets, kept in sync.",
      "Contracts, invoices and documents, searchable.",
      "The tools your team uses every day.",
      "Live connections to your suppliers and services.",
      "Accounting, inventory and day-to-day operations.",
      "Your team, with the right access and context.",
    ],
    coreCaption: "Connected intelligence · Hope Theory Labs",
  },
  story: {
    methodEyebrow: "Stage I", methodHeading: "The digital self.",
    methodText: "Before a company can think, it has to be legible. We rebuild your site, brand, systems and records into one clean, professional presence.",
    shiftEyebrow: "Stage II", shiftHeading: "The shift to intelligence.",
    shiftText:
      "Stage II is the long game: one record across email, chat, spreadsheets and your storefront, with an assistant on top. Most clients start with Stage I; we only open Stage II with businesses that already have a clear digital self.",
    shiftCta: "Compare both paths",
    flowEyebrow: "The living platform", flowHeading: "Everything you run, in one living flow.",
    flowText: "Eight kinds of source feed one connected record. Signals travel from each source into the core, and answers travel back out to the people and tools that need them.",
    flowHint: "Select a source to trace its connection.",
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
    eyebrow: "What we build",
    heading: "Two paths. Start where you are.",
    intro:
      "Need orders on WhatsApp this month? Start with a website. Curious about agents and connected data? That’s a separate conversation — we’ll tell you honestly if we’re the right fit.",
    websiteLane: {
      label: "Start here · Available now",
      items: [
        {
          title: "Websites",
          description:
            "Fast, mobile-first sites with WhatsApp ordering and cash on delivery. From ৳25,000 — founding clients ৳15,000 with a short review and permission to show the site.",
        },
      ],
      note: "We build a free concept first. You try it on your phone; if you like it, we set it up on your domain.",
    },
    aiLane: {
      label: "Roadmap · Early access",
      tag: "Early access",
      items: [
        {
          title: "AI integrations",
          description: "Agents and automations wired into the tools you already run — scoped after we understand your stack.",
        },
        {
          title: "AI transformation",
          description: "Digital self first, then one living intelligence across your data sources. Founding partners only while we refine the offer.",
        },
      ],
      note: "No public pricing yet. We don’t sell AI retainers from this page — message us with the workflow you want to fix.",
      whatsappCta: "Ask about AI on WhatsApp",
      whatsappLink: whatsappAiLink,
    },
  },
  whatYouGet: {
    heading: "What you get",
    items: ["Fast on mobile", "Orders straight to your WhatsApp", "Cash on delivery", "Easy to update"],
  },
  speedSlider: {
    label: "Illustrative only", before: "Before", after: "After",
    aria: "Compare page load speed — before and after",
  },
  pricing: {
    heading: "Pricing", base: "Websites from ৳25,000.",
    founding: "Founding clients: ৳15,000, in exchange for a short review and permission to show your site.",
    cta: "Ask about a free concept",
  },
  earlyAccess: {
    heading: "Coming soon", tag: "Early access",
    items: ["AI audits", "Forward-deployed AI engineering"],
    text: "Ask us if you’re curious.",
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
    eyebrow: "About", heading: "A solo studio in Dhaka.",
    text: "I’m Fahad Ibrahim, the founder of Hope Theory Labs. I keep things simple and honest, and I work with you directly.",
  },
  contact: {
    eyebrow: "Contact", heading: "Begin the conversation.",
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
