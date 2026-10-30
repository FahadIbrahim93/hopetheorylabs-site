# Hope Theory Labs — Canonical Website Specification

**Design source:** Fahad's supplied standalone HTML concept, pasted into ChatGPT on 25 October 2026. This document supersedes the previous section copy and layout where they conflict. The implementation must preserve the supplied page's visual identity and content while using this repository's production stack.

## Goal

Build the supplied Hope Theory Labs website as a responsive, accessible one-page Next.js site. Do not embed the source HTML as an iframe or leave it as a static HTML file. Translate it into reusable React components, typed content, and project CSS.

## Stack and implementation constraints

- Next.js App Router, TypeScript, Tailwind CSS, static export, Vercel.
- Keep all user-facing copy in `content/en.ts` and `content/bn.ts`. Bangla copy remains a TODO for Fahad/Tamim review; the schema must match. The locked homepage is English only and does not show a language toggle.
- Use `next/font/google` for Instrument Sans (body), Newsreader (editorial section headings), and JetBrains Mono (eyebrows/HUD). Do not load fonts or WebGL from a CDN.
- No analytics, cookies, tracking, invented testimonials, fake metrics, or unapproved client claims.
- The homepage is the HTML locked on 26 October 2026. Match its structure, copy, colors, type, and motion. The pasted vertex shader ends mid-line at `vec3`. Complete that particle morph in `components/home/HomeMotion.tsx` from the uniforms and attributes that were present. Do not claim the missing shader lines were copied verbatim, and do not load Three.js from a CDN.

## Visual system

- Background: near-black `#07090C`; primary text `#EEF0F2`; muted text `#A3ACB8`; hairline `#2A323D`; accent teal `#7FD6C2`; accent amber `#FFBD61`.
- Use Instrument Sans for the body and UI, Newsreader for large editorial section headings, JetBrains Mono for small uppercase labels and status text.
- Oversized tight-tracked two-line hero headline, asymmetrical layouts, generous whitespace, hairline dividers, no generic rounded-card grid.
- Fixed transparent-to-black header with wordmark and compact navigation, with a scrim that keeps copy legible as it scrolls under the wordmark. Respect mobile safe-area insets.
- The hero visual is the full-viewport particle field from the locked page. Points begin scattered, gather into a sphere, then settle into slow orbits as the page scrolls. Eight source labels sit in that field: Productivity, CRM, Databases, Files, Apps, APIs, Systems, and People, plus the H mark. The labels are fixed to the viewport while the hero is in view and clear as it leaves, so they never sit over later sections.
- A small fixed HUD displays a changing system state and progress line. A floating WhatsApp button remains visible except while the contact section is in view. On screens 800px and below, the header keeps only Contact, and the flow pills and ticker hide, as in the locked CSS.
- Keep the site calm and cinematic, not flashy. Honor `prefers-reduced-motion` throughout.

## Page sequence and approved copy

1. **Header** — “Hope Theory Labs”; Approach, Services, Work, Contact. Below 800px only Contact stays visible, matching the locked CSS. There is no language toggle.
2. **Hero** — eyebrow “The intelligent business platform”; headline “Your data. Connected. / Your business. Smarter.”; subheading “We bring together your data, tools and workflows — and turn them into a living, breathing intelligence.” Main CTA “Message us on WhatsApp” to the existing WhatsApp concept link. Secondary CTA “Watch it assemble” scrolls to Stage I.
3. **Stage I / The digital self** — “Before a company can think, it has to be legible. We rebuild your site, brand, systems and records into one clean, professional presence.”
4. **Stage II / The shift to intelligence** — “It’s not just about tools. It’s about creating a unified intelligence from your data, systems and people.” Link to Services.
5. **The living platform** — “Everything you run, in one living flow.” Three labels: Connect / Your data sources; Automate / Your workflows; Scale / Your growth.
6. **How it works** — four interactive, accessible steps:
   - Map: “We list every place your business keeps information: email, chat, spreadsheets, accounting, your storefront.”
   - Digital self: “We build the website and clean records that represent you properly, online and inside your own systems.”
   - Connect: “We pull those sources into one record, so there is one place to ask and one version of the truth.”
   - Act: “We add an assistant on top that answers questions across it and handles routine work, with your team approving what matters.”
7. **Services** — “Three disciplines, one outcome.”
   - Websites: “Fast, mobile-first sites with WhatsApp ordering and cash on delivery.”
   - AI integrations: “Agents and automations wired into the tools you already run.”
   - AI transformation: “A digital self first, then one living intelligence across every data source.” Tag “Early access”.
   - Packages, approved 30 October 2026, inside Services rather than as a new page beat: eyebrow “Packages”, heading “Three sizes of site.”, “Websites from ৳10,000.”, then a hairline price list — Starter ৳10,000, Counter ৳25,000, Showroom ৳45,000 — terms “Half to begin, a quarter midway, a quarter at handover. The domain is billed at cost, and an optional care plan covers the site after launch.”, the founding offer below it, and the link “Ask about a free concept” to WhatsApp. Prices live in `content/en.ts` and reach the assistant from the same block; no per-tier inclusions are claimed until Fahad supplies them.
   - Founding offer: “Founding clients pay ৳15,000, in exchange for a short review and permission to show the site. AI work is by conversation: ask us if you’re curious.”
8. **Work** — “We build a free concept first.” Rollers Republic is explicitly a concept built on the shop's real catalog. Link to `https://rollers-republic-pitch.vercel.app`. Recreate the phone mockup with product rows, animated “Order on WhatsApp” button, and message bubble. Do not imply it is a live integration.
9. **About** — “A small team in Dhaka.” “We’re Fahad Ibrahim and Tamim Abir. We keep things simple and honest.”
10. **Contact** — “Begin the conversion.” “Tell us about your business and we’ll reply on WhatsApp whenever suits you.” Name and needs fields; submit opens a prefilled WhatsApp message. Also show WhatsApp 01718463471 and hopetheorybd@gmail.com.
11. **Footer** — “© 2026 Hope Theory Labs · Dhaka, Bangladesh · from the Hope Theory family. No cookies, no analytics.” Animated outline ticker repeats Email, CRM, Billing, Docs, Chat, Storefront, Support.

## Functional behavior

- Navigation uses native section anchors with smooth scrolling only when reduced motion is not requested.
- Scroll reveals occur once, with no-JS fallback visibility.
- The “How it works” control updates the active step on click/tap and as steps enter the viewport; keyboard accessible.
- Contact form validates no backend data; it creates a WhatsApp URL from entered name and need, then opens WhatsApp in a new tab.
- Floating WhatsApp action hides when the Contact section is in view.
- Language selection persists using the existing provider. Bangla translations must be reviewed before launch.
- The phone mockup cycles between its CTA and WhatsApp message. Under reduced motion, both states remain readable and visible.
- Do not claim a customer has connected the eight data sources; those are illustrative brand visuals.

## Accessibility and performance

- Semantic landmarks, one H1, skip link, visible focus ring, descriptive links, keyboard-operable controls and minimum 44px targets.
- Decorative canvas and SVG visual are hidden from assistive technology, with an adjacent accessible description.
- Honor safe-area insets and test 360, 768, 1280 and 1920px viewports.
- No external script CDNs. Fonts use `next/font`.
- Keep the first-load budget conservative; preserve the canvas pause-on-offscreen behavior and reduced-motion static frame.
- Do not state build, Lighthouse, visual, or browser QA passes until actually run and observed.

## Release gates

Before merge: run `npm run lint`, `npm run typecheck`, and `npm run build`; inspect the Vercel preview; check keyboard and reduced-motion behavior; verify WhatsApp links, email, the phone mockup, and the responsive layout; run mobile Lighthouse. The locked page has no language toggle. Production deployment remains on hold until Fahad explicitly approves.
