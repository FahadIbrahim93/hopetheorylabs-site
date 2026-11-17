# Hope Theory Labs — Canonical Website Specification

**Design source:** Fahad's supplied standalone HTML concept (25 October 2026). This document supersedes older layout notes where they conflict. The live stack is **Next.js components + R3F**, not the locked inline HTML page on `main` (that path is superseded by this PR's architecture).

## Goal

One responsive, accessible marketing site. Do not iframe the source HTML. Copy, sections and the WebGL behaviour match the reference page.

## Stack and implementation constraints

- Next.js App Router, TypeScript, Tailwind CSS v4, Framer Motion LazyMotion, static export, Vercel.
- Copy in `content/en.ts`.
- Fonts via `next/font/google`: Instrument Sans and Newsreader (mono labels use the system monospace stack).
- No analytics, cookies, tracking, fake metrics or testimonials.
- **WebGL:** npm `three` + `@react-three/fiber`, shaders ported from the complete inline script in the supplied HTML (particle morph, fresnel core, rings, flow edges/dots, burst, drag-rotate, stars). No CDN scripts.
- One fixed canvas (`components/experience/`). Scroll → damped `pp` → morph and HUD. Copy in single column; scene group offset matches HTML (`gx0` / mobile `gy0`). No scroll hijacking.
- Progressive enhancement: SVG `IntelligenceCore` + `LabsBackground` when WebGL unavailable (`detectWebGL`, shader error, context loss, `?experience=fallback`).
- Reduced motion: `frameloop="demand"`, burst/drag/intro/cursor disabled or static.
- Quality tiers: 18000 / 9000 / 6000 particles; `?experience=low|mid|high` for QA.
- Security headers via `vercel.json` (from main): CSP, HSTS, etc.

## Visual system

- Palette and typography as in `docs/BRAND.md`.
- Hero (issue #44, pending founder sign-off in #43): eyebrow “AI engineering · Custom software · Based in Dhaka, working with clients worldwide”, H1 “We engineer software / that makes businesses smarter.”, and the exact tagline “Your data. Connected. Your business. Smarter.” as the supporting line directly under the H1. Copy source: `docs/POSITIONING.md` (branch `issue-43-positioning`).
- Eight flow sources: **Productivity, CRM, Databases, Files, Apps, APIs, Systems, People** with captions in `hero.coreNodeDetails` (kinds of data, not client integrations).
- Intro overlay (brand + line), grain + vignette, custom cursor (mouse only), magnetic hero CTA, header blur on scroll.
- HUD states: **Scattered → Structured → Alive** (not the old per-section IO labels in WebGL mode).

## Page sequence

Header (Services · Approach · Work · About · Contact + “Discuss a project”; root-relative links so they work from every route), hero, Stage I/II as an **optional** maturity path (never a gate before AI or forward-deployed work), living flow (centred heading + three pills), how we work (five steps: Discover, Scope, Prototype, Deploy, Improve + live description), services (five pillars: forward-deployed engineering, custom web and mobile software, AI integration and automation, enterprise systems and data, managed engineering; website packages shown as a separate, secondary offer), website packages, work (Rollers Republic **Concept**), about (solo founder Fahad Ibrahim, role only), contact + ticker, footer (Pricing lives here, not in the primary nav), floating WhatsApp.

`/services` explains each pillar as problem → what we deliver → who it fits → how we engage. Custom work is “quoted after discovery”; no invented fees or ranges.

## Functional behaviour

- Native anchor navigation; smooth scroll when motion allowed.
- How-it-works: step buttons update copy and trigger a centre **burst** in the scene (when motion allowed).
- Flow section: eight `.flow-node` labels (focusable when flow active) show captions; monogram **H** at core.
- Contact form → prefilled WhatsApp URL only.
- Floating WhatsApp hidden when Contact is in view.

## Accessibility

- Flow labels: `tabIndex` 0 only when `uF > 0.6`; captions `aria-live="polite"`.
- Decorative: canvas layer, intro, cursor, HUD (`aria-hidden`).
- Skip link, focus rings, 44px targets.

## Release gates

`npm run lint`, `typecheck`, `build`; preview QA including mobile Lighthouse, keyboard, reduced motion, fallback; merge only after review. Production promotion remains Fahad's call.
