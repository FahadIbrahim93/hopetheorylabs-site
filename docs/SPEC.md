# Website Build Spec — hopetheorylabs.vercel.app (v2)

> Canonical copy of the Notion spec (https://app.notion.com/p/40270e6cd20a81ce8843e0752c850174), copied 23 Oct 2026. If they differ, this file wins for agents; Fahad updates both.

> 
**v2 · 23 Oct 2026.** Decided by Fahad: websites first, AI services shown as early access. v2 adds the "Labs" design direction (Next.js + Tailwind + Framer Motion) and Anti-AI-look rules. Copy source of truth: Brand & Positioning System, section 4 ([link](https://cursor.com/canvas/store-7b995066-df27-4571-ae33-a8187d5f5eff/ce03719b-727f-478d-bccc-4707e85b11e9)). Gaps filled from the Website Plan ([link](https://cursor.com/canvas/store-7b995066-df27-4571-ae33-a8187d5f5eff/444cbf23-c77b-4e2f-9d89-1b5d0d75e7dd)).


## Goal

A shop owner taps WhatsApp. One page, mobile-first, deployed free on Vercel. Buy [hopetheorylabs.com](http://hopetheorylabs.com) only after the first client pays.

## Rules

- No invented metrics, logos, reviews or testimonials. No degree or education claims.
- Rollers Republic is always labelled a concept, never client work.
- Sthappo stays off the page until delivered and the client approves.
- Voice: "we", humble, plain, short sentences. No deadlines, pressure or "AI magic". Don't mix Bangla and English mid-sentence.

## Design Direction

Fahad's brief: very cool, uniquely aesthetic interactive visuals, yet elegant, professional, enterprise-grade, relatable, on brand, great UI/UX.

### Concept: "Labs"

- A calm Deep Ink #0F1B2D canvas with a subtle animated Hope Teal #14B8A6 grid or particle field that gently reacts to the cursor (and to touch on mobile).
- Lightweight `<canvas>` 2D (or a small WebGL shader) with a static SVG/CSS gradient fallback for no-JS, low-power devices and reduced motion.
- Polish at the level of Linear, Vercel or Stripe: restrained, slow, low-opacity motion. Never gimmicky; content always wins over effects.

### Hero

- Big Space Grotesk headline with a staggered word-by-word reveal.
- The supplied Hope Theory Labs intelligence-core visual: a custom wireframe sphere, radar sweep, orbit rings, signal routes and eight connected source nodes (Websites, CRM, Databases, Files, Apps, APIs, Systems, People). Rebuild it as inline SVG + CSS inside a reusable React component; no 3D library or external asset.
- Keep the WhatsApp ordering journey clear in the page copy and conversion path. The intelligence core is a brand illustration, not a claim that these integrations are already deployed for clients.

### Interactions

- Scroll-triggered reveals (fade + small rise), once per element.
- Optional, subtle: magnetic pull on the main CTA (max 4px; off on touch and reduced motion).
- Micro-interaction on the WhatsApp CTA: the arrow/icon nudges and a small chat bubble draws in on hover/focus.
- Optional, very subtle: card tilt (max 3°) without glow. Drop it if it looks showy.
- One signature interaction only: the intelligence core's slow radar/orbit motion and subtle pointer response. Keep the existing particle field low-contrast and non-interactive so it supports rather than competes with the core.
- Interactive 3-step "How it works" timeline: steps highlight on scroll and on click/tap; keyboard accessible.
- Before/after speed slider comparing a slow page load vs a fast one, clearly labelled "Illustrative only". No numbers or stats.

### Made for Bangladesh

- Bangla/English toggle (Hind Siliguri for Bangla), remembered in localStorage; `lang` attribute switches. Bangla copy needs Fahad/Tamim review before going live.
- Local examples in visuals and the How it works illustrations: shops, cafés, clinics.
- Prices in ৳ (৳25,000, founding ৳15,000).
- Sticky WhatsApp button, bottom-right, safe-area aware.

### Standards

- Next.js (App Router) + Tailwind CSS + Framer Motion, on the Vercel free tier. Static export (`output: "export"`) is fine.
- Lighthouse 90+ on mobile (Performance, Accessibility, Best Practices, SEO).
- WCAG AA. #0F766E for text links on light backgrounds; navy text on teal buttons.
- `prefers-reduced-motion` respected everywhere: no particles motion, no tilt or magnetic pull, reveals become instant.
- Semantic HTML, SEO and Open Graph meta (below). No tracking, no cookies, no analytics scripts.
- No fake reviews or metrics.

### Performance budget

- First-load JS under 120 KB gzipped for the page; particle field under 8 KB. The intelligence core uses inline SVG and CSS only; no 3D libraries or external runtime.
- Particle field lazy-loaded with `next/dynamic` (`ssr: false`) after first paint and only when the hero is visible; paused when off-screen or the tab is hidden; capped at \~60 particles on mobile, device-pixel-ratio capped at 2.
- Framer Motion via `LazyMotion` + `domAnimation` and `m` components.
- Fonts via `next/font/google` (self-hosted, subset, `display: swap`); only weights used.
- LCP element is the headline text, not a visual asset. CLS under 0.1; reserve the intelligence core's aspect ratio before hydration. Images as optimised SVG/WebP with fixed sizes.
- Total page weight under 500 KB on first load.

### Component list

- `Header` (wordmark, nav, WhatsApp button, mobile menu)
- `LanguageToggle` (EN / বাংলা)
- `LabsBackground` (canvas particle/grid field + static fallback)
- `Hero` with `WordReveal` and `IntelligenceCore` (wireframe/radar visual)
- `MagneticButton` (CTA wrapper)
- `HowItWorksTimeline` (3 interactive steps)
- `FeatureGrid` + `TiltCard` (What you get)
- `SpeedSlider` (before/after, "Illustrative only")
- `WorkCard` (Rollers Republic concept)
- `Pricing`
- `EarlyAccessAI`
- `About`
- `Contact`
- `Footer`
- `StickyWhatsApp`
- `Reveal` (scroll reveal wrapper) and `useReducedMotion` hook
- `content/en.ts` + `content/bn.ts` (all copy in one place)

## Anti-AI-look rules

The site must not look AI-generated. Feel references: [linear.app](https://linear.app), [vercel.com](https://vercel.com), [stripe.com](https://stripe.com), [rauno.me](https://rauno.me).

### Banned

- Purple/blue gradients; glassmorphism everywhere; stock 3D blobs.
- Generic 3-feature icon grids; emoji; identical rounded cards in rows.
- Centered-everything layouts; the default shadcn/Tailwind look.
- "Unlock the power of AI" style copy and any buzzwords.

### Do

- Editorial, asymmetric 12-column grid with generous whitespace (e.g. headings span 7 columns, body offset to start at column 8).
- Strong type hierarchy: huge, tight-tracked Space Grotesk headings (letter-spacing about -0.03em), Inter body, small uppercase mono labels like "01 / HOW IT WORKS" (JetBrains Mono).
- Restrained palette: navy #0F1B2D, off-white #F8FAFC, teal #14B8A6 as one sparing accent.
- Thin 1px hairline rules to separate sections instead of boxes and shadows.
- Real product shots: Rollers Republic concept screenshots in device frames, labelled "Concept".

### Motion

- Few, purposeful animations. Easing cubic-bezier(0.16, 1, 0.3, 1), durations 400–700ms.
- ONE signature interaction: the custom intelligence core’s slow radar/orbit motion and subtle pointer response.

### Details

- Custom "HT" monogram favicon; consistent 8px spacing scale; crisp 2px teal focus rings with offset.
- A polished 404 page (same grid, short human line, link home and to WhatsApp).
- Micro-interaction on the WhatsApp CTA.
- Copy: plain, specific, human, "we" voice, no buzzwords.

## Section-by-section layout (final copy)

### 0. Header (sticky)

- Left: wordmark "hope theory labs" (lowercase, teal dot).
- Right links: How it works · Work · Pricing · Contact. Language toggle. Button: WhatsApp.

### 1. Hero

- H1: **Fast websites for Bangladeshi businesses.**
- Sub: Mobile-first sites with WhatsApp ordering built in. We'll build a free concept of yours first.
- Primary button: **Message us on WhatsApp** → [https://wa.me/8801718463471?text=Hi%20Hope%20Theory%20Labs%2C%20I%27d%20like%20a%20free%20website%20concept](https://wa.me/8801718463471?text=Hi%20Hope%20Theory%20Labs%2C%20I%27d%20like%20a%20free%20website%20concept).
- Secondary link: See pricing (#pricing).
- Visual: custom inline-SVG intelligence core with wireframe geometry, radar sweep and eight connected source nodes.

### 2. How it works (#how)

1. We build a free working concept with your products.
2. You try it on your phone.
3. If you like it, we set it up on your domain.

### 3. What you get

Four items: Fast on mobile · Orders straight to your WhatsApp · Cash on delivery · Easy to update. Followed by the speed slider ("Illustrative only").

### 4. Work (#work)

- Card: **Rollers Republic (concept)** — a free concept built on the shop's real catalog. Link: [https://rollers-republic-pitch.vercel.app](https://rollers-republic-pitch.vercel.app). Tag: Concept.
- (Add Sthappo once delivered and approved. Do not add a placeholder.)

### 5. Pricing (#pricing)

- **Websites from ৳25,000.**
- Founding clients: **৳15,000**, in exchange for a short review and permission to show your site.
- Always show ৳25,000 first. No countdowns or deadlines.
- Button: Ask about a free concept (WhatsApp).

### 6. Coming soon: AI (early access)

- AI audits · Forward-deployed AI engineering.
- Line: "Ask us if you're curious." Link: WhatsApp. Tag: Early access. No prices.

### 7. About

We're a small team in Dhaka: Fahad Ibrahim and Tamim Abir. We keep things simple and honest.

### 8. Contact (#contact)

- WhatsApp 01718463471 ([https://wa.me/8801718463471](https://wa.me/8801718463471)) · [hopetheorybd@gmail.com](mailto:hopetheorybd@gmail.com)
- "Reply whenever suits you."

### 9. Footer

© 2026 Hope Theory Labs · Dhaka, Bangladesh · from the Hope Theory family.

### Sticky WhatsApp button

Bottom-right on all screens (respects safe-area insets), hidden when the Contact section is in view.

## Colours

| Role | Hex | Use |
| --- | --- | --- |
| Deep Ink | #0F1B2D | Main canvas, dark sections, text on teal buttons |
| Hope Teal | #14B8A6 | Buttons, highlights, particles/glow (never body text on white) |
| Teal dark | #0F766E | Links and teal text on light backgrounds |
| Paper | #F8FAFC | Light sections and text on navy (proposal) |
| Slate | #475569 | Secondary text on light (proposal) |

## Fonts (free Google Fonts, from the Brand Page)

- Headings: Space Grotesk (600/700). Body: Inter (400/600). Bangla: Hind Siliguri (400/600).
- Load with `next/font/google`, subset, `display: swap`.

## SEO meta

- Title: Hope Theory Labs — Fast websites for Bangladeshi businesses
- Description: Mobile-first websites with WhatsApp ordering and cash on delivery, built in Dhaka. We build a free concept of your site first. From ৳25,000.
- `lang` set per language, canonical [https://hopetheorylabs.vercel.app/](https://hopetheorylabs.vercel.app/), Open Graph + Twitter card (og-image 1200×630 in navy/teal), theme-color #0F1B2D, favicon "HT" monogram.
- JSON-LD `ProfessionalService`: name, url, email, telephone +8801718463471, areaServed Bangladesh, address Dhaka. No ratings or reviews.
- robots.txt + sitemap.xml. Later: Google Business Profile.

## Accessibility

- Contrast: navy text on teal buttons; Paper/white text on navy; #0F766E for links on light. Never plain teal text on white.
- One H1, logical headings, semantic landmarks (header, nav, main, footer), skip link.
- Visible focus outlines, tap targets ≥ 44px, alt text, descriptive link text.
- Decorative canvas and mockup animation are `aria-hidden`; slider and timeline fully keyboard operable with labels.
- Respect `prefers-reduced-motion`; all content readable without JS (static export renders full HTML).

## Freebuff prompt (paste as-is)

```txt
You are building the one-page website for "Hope Theory Labs", a small web studio in Dhaka. Work step by step. Finish each STEP, run `npm run build` to check it compiles, then move to the next. Do not skip steps. Do not add anything not described here.

HARD RULES
- Use ONLY the copy given below. Never invent metrics, stats, client logos, reviews, testimonials, awards or credentials.
- "Rollers Republic" is always labelled "Concept". The speed slider is labelled "Illustrative only" and shows no numbers.
- No tracking, analytics, cookies or external scripts. No countdowns or urgency copy.
- Respect prefers-reduced-motion everywhere (no particle motion, no tilt, no magnetic pull, reveals instant).

ANTI-AI-LOOK RULES (the site must NOT look AI-generated; feel like linear.app, vercel.com, stripe.com, rauno.me)
- BANNED: purple/blue gradients, glassmorphism, stock 3D blobs, emoji, generic 3-feature icon grids, identical rounded cards in rows, centered-everything layouts, default shadcn/Tailwind look, buzzword copy like "Unlock the power of AI".
- DO: editorial asymmetric 12-column grid with generous whitespace; huge tight-tracked Space Grotesk headings (letter-spacing -0.03em); Inter body; small uppercase JetBrains Mono labels like "01 / HOW IT WORKS" above each section; palette only ink, paper #F8FAFC and teal as one sparing accent; 1px hairline rules between sections instead of boxes and shadows; 8px spacing scale; crisp 2px teal focus rings.
- MOTION: few, purposeful; easing cubic-bezier(0.16,1,0.3,1), 400-700ms. ONE signature interaction: the custom intelligence core’s slow radar/orbit motion and subtle pointer response. Magnetic CTA and card tilt are optional and very subtle, or left out.
- REAL SHOTS: Rollers Republic concept screenshots (put files in public/work/, ask me for them if missing; do not fake them) inside simple device frames, labelled "Concept".

STACK
Next.js (latest, App Router, TypeScript) + Tailwind CSS + Framer Motion. Static export: in next.config set output: "export" and images: { unoptimized: true }. Deploy target: Vercel free tier.

BRAND
Colours: ink #0F1B2D (main background, text on teal), teal #14B8A6 (buttons, highlights, particles), tealDark #0F766E (links on light backgrounds), paper #F8FAFC, slate #475569. Never use #14B8A6 as body text on light backgrounds.
Fonts via next/font/google: Space Grotesk 600/700 (headings), Inter 400/600 (body), Hind Siliguri 400/600 (Bangla).
Feel: calm, elegant, enterprise-grade (Linear / Vercel / Stripe polish). Slow, subtle, low-opacity motion.

STEP 1 - Setup
- npx create-next-app@latest hopetheorylabs --ts --tailwind --app --eslint --no-src-dir
- npm i framer-motion
- Add brand colours and fonts to Tailwind config and app/layout.tsx. Set output: "export".
- Create content/en.ts and content/bn.ts exporting the same object shape with all copy (bn values: put the English text for now and add a TODO comment "Bangla to be reviewed by Fahad/Tamim").

STEP 2 - Layout and static sections (no animation yet)
Build these components in components/, render them in app/page.tsx in this order, using semantic HTML (header, nav, main, section with ids, footer) and a skip link:
1. Header: lowercase wordmark "hope theory labs" with a teal dot; links "How it works" (#how), "Work" (#work), "Pricing" (#pricing), "Contact" (#contact); a LanguageToggle (EN / বাংলা); button "WhatsApp". Mobile menu.
2. Hero: H1 "Fast websites for Bangladeshi businesses." Sub "Mobile-first sites with WhatsApp ordering built in. We'll build a free concept of yours first." Primary button "Message us on WhatsApp" -> https://wa.me/8801718463471?text=Hi%20Hope%20Theory%20Labs%2C%20I%27d%20like%20a%20free%20website%20concept . Secondary link "See pricing" -> #pricing. Right side: responsive IntelligenceCore SVG with reserved aspect ratio.
3. HowItWorksTimeline (#how): "1. We build a free working concept with your products." "2. You try it on your phone." "3. If you like it, we set it up on your domain."
4. FeatureGrid "What you get": Fast on mobile / Orders straight to your WhatsApp / Cash on delivery / Easy to update. Use simple examples of shops, cafés, clinics in small illustrations or labels.
5. SpeedSlider placeholder with the label "Illustrative only".
6. WorkCard (#work): "Rollers Republic" with tag "Concept", text "A free concept built on the shop's real catalog.", link https://rollers-republic-pitch.vercel.app
7. Pricing (#pricing): "Websites from ৳25,000." then "Founding clients: ৳15,000, in exchange for a short review and permission to show your site." Button "Ask about a free concept" -> WhatsApp link.
8. EarlyAccessAI: heading "Coming soon", items "AI audits" and "Forward-deployed AI engineering", tag "Early access", text "Ask us if you're curious." linking to WhatsApp. No prices.
9. About: "We're a small team in Dhaka: Fahad Ibrahim and Tamim Abir. We keep things simple and honest."
10. Contact (#contact): "WhatsApp 01718463471" -> https://wa.me/8801718463471 , "hopetheorybd@gmail.com" -> mailto:hopetheorybd@gmail.com , text "Reply whenever suits you."
11. Footer: "© 2026 Hope Theory Labs · Dhaka, Bangladesh · from the Hope Theory family."
12. StickyWhatsApp: round button bottom-right, safe-area aware, aria-label "Message us on WhatsApp", hidden when #contact is in view.
All copy must come from content/en.ts or content/bn.ts.

STEP 3 - Language toggle
- LanguageToggle switches between en and bn content, saves choice in localStorage, sets document.documentElement.lang, and uses Hind Siliguri when bn is active.

STEP 4 - Labs background
- components/LabsBackground.tsx: a 2D <canvas> behind the hero drawing a faint teal grid of dots/particles (opacity 0.15-0.4) that drift slowly and gently move away from / glow near the cursor or touch point.
- Load it with next/dynamic and ssr: false. Start only after first paint and when the hero is visible (IntersectionObserver). Pause on visibilitychange hidden or when off-screen. Max 60 particles on mobile, 140 on desktop, devicePixelRatio capped at 2. Keep it under 8 KB, no libraries.
- Static fallback: a CSS radial gradient + faint grid pattern (always rendered underneath). With reduced motion, render one static frame only. Mark canvas aria-hidden.

STEP 5 - Motion
- Wrap the app in Framer Motion LazyMotion with domAnimation and use m components.
- WordReveal: H1 words fade/rise in with a 60ms stagger.
- Reveal: scroll-triggered fade + 12px rise, once per element.
- Use easing [0.16, 1, 0.3, 1] and 400-700ms durations for every animation.
- MagneticButton (optional): main CTA moves up to 4px toward the pointer (desktop only).
- TiltCard (optional): tilt up to 3 degrees, no glow (desktop only).
- WhatsApp CTA micro-interaction: icon nudges right and a tiny chat bubble draws in on hover/focus.
- HowItWorksTimeline: active step highlights on scroll and on click/tap; buttons are keyboard accessible with aria-current.
- PhoneMockup: looped animation in HTML/CSS: a generic product list -> tap "Add to cart" -> cart count 1 -> tap "Order on WhatsApp" -> WhatsApp-style chat bubble with "Hi! I'd like to order: 1 x Sample item. Cash on delivery." Use generic sample products only. aria-hidden, with a visually hidden text description.
- SpeedSlider: draggable and keyboard (range input) before/after comparison of a page skeleton loading slowly vs quickly. Label "Illustrative only". No numbers.
- All motion off or instant under prefers-reduced-motion (use useReducedMotion).

STEP 6 - SEO and meta
- In app/layout.tsx metadata: title "Hope Theory Labs — Fast websites for Bangladeshi businesses"; description "Mobile-first websites with WhatsApp ordering and cash on delivery, built in Dhaka. We build a free concept of your site first. From ৳25,000."; canonical https://hopetheorylabs.vercel.app/ ; Open Graph and Twitter card; themeColor #0F1B2D.
- public/og.png placeholder (1200x630, ink background, teal wordmark), app/icon.svg "HT" monogram (rounded ink square, teal accent), public/robots.txt, public/sitemap.xml.
- JSON-LD ProfessionalService: name, url, email hopetheorybd@gmail.com, telephone +8801718463471, areaServed Bangladesh, address Dhaka. NO ratings or reviews.

STEP 7 - Accessibility and performance check
- WCAG AA contrast, visible focus rings, tap targets >= 44px, one H1, alt text, descriptive links.
- First-load JS under 120 KB gzipped. No layout shift (reserve space for mockup). LCP is the H1 text.
- Run `npm run build` and fix all errors and warnings. Tell me how to run Lighthouse in Chrome DevTools (mobile) and aim for 90+ in every category.

STEP 8 - 404 and favicon
- app/not-found.tsx: same grid and type, mono label "404 / NOT FOUND", line "This page doesn't exist. Let's get you back.", links Home and WhatsApp.
- Custom "HT" monogram app/icon.svg (not a generic icon).

STEP 9 - Final QA checklist (all must pass before handoff; report each as pass/fail)
- [ ] Copy matches content files exactly; no invented stats, logos, reviews, credentials.
- [ ] Rollers Republic labelled "Concept"; speed slider labelled "Illustrative only" with no numbers.
- [ ] No purple/blue gradients, glassmorphism, emoji, 3D blobs, generic icon grids, identical card rows, centered-everything sections.
- [ ] Asymmetric grid, mono section labels, hairline rules, teal used sparingly.
- [ ] Only one signature interaction (intelligence core); all easing cubic-bezier(0.16,1,0.3,1) at 400-700ms.
- [ ] prefers-reduced-motion: no motion; page fully readable with JS disabled.
- [ ] Keyboard: skip link, visible focus on every control, timeline and slider operable.
- [ ] WCAG AA contrast; #0F766E for links on light backgrounds.
- [ ] All WhatsApp links open https://wa.me/8801718463471; email link works.
- [ ] EN/Bangla toggle works and persists; lang attribute updates.
- [ ] Lighthouse mobile 90+ in all four categories; first-load JS under 120 KB gzipped; CLS under 0.1.
- [ ] No tracking, analytics or cookies; no console errors.
- [ ] 404 page, favicon, OG image, robots.txt, sitemap.xml present.
- [ ] Looks good at 360px, 768px, 1280px and 1920px widths.

STEP 10 - Deploy
- Write README.md: npm install, npm run dev, npm run build (creates out/). Deploy: push to GitHub, import the repo in Vercel, framework Next.js, default settings.
- List every file you created.
```
