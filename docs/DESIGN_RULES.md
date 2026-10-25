# Design Rules — Hope Theory Labs

The supplied Hope Theory Labs HTML concept is the primary visual reference. Preserve its identity when changing implementation.

## Visual language

- Near-black `#07090C`, off-white `#EEF0F2`, muted `#A3ACB8`, hairline `#2A323D`, teal `#7FD6C2`, amber `#FFBD61`.
- Instrument Sans for body/UI; Newsreader for editorial headings; JetBrains Mono for technical labels; Hind Siliguri for Bangla.
- Oversized editorial type, asymmetric grids, wide whitespace, fine rules and small uppercase labels.
- Narrative: digital self → intelligence shift → living flow → how it works → services → work concept → about → contact.
- The central visual is one **persistent full-viewport WebGL scene** behind the page (particle morph scatter → globe → galaxy, fresnel core, orbit rings, flow constellation). Copy sits in a single column with text-shadow for legibility; the scene shifts composition on desktop (offset right) and mobile (raised). Nothing else should compete with the core for motion.
- Scroll drives damped progress `pp` (HUD: Scattered / Structured / Alive). No scroll hijacking, pinning or snapping.
- Depth must be real (WebGL geometry, shaders, perspective, parallax), not fake with CSS blur alone. Flow nodes use the HTML colour set (orange, blues, purples, greens); core uses teal/gold fresnel, not rainbow neon.
- Retain the phone mockup animation and the fixed system-state HUD. Floating WhatsApp hides over Contact.
- Rollers Republic must always be labelled “Concept”. Never invent performance claims, reviews, client logos, credentials or deployed integrations.

## Motion and accessibility

- Slow, purposeful motion. Easing `cubic-bezier(0.16, 1, 0.3, 1)`, mostly 400–900 ms for DOM transitions.
- `prefers-reduced-motion`: WebGL uses demand rendering (no continuous loop); intro overlay and custom cursor are hidden; phone mockup states stay visible.
- Semantic sections, one H1, skip link, 2px visible focus ring, 44px minimum touch targets.
- **Three.js + React Three Fiber** with hand-written GLSL from the supplied HTML port. No CDN Three.js, no GSAP/Lottie, no post-processing stacks. Inline-SVG `IntelligenceCore` + optional 2D particles remain the **fallback** when WebGL fails (`?experience=fallback`).
- WebGL loads after `window` `load`, never blocks first paint; dispose GPU resources on unmount; one frame loop; runtime tier downgrade (particle draw range + DPR) before dropping frames.
- No analytics, tracking, cookies, fake metrics, purple/blue gradients, stock 3D blobs, glassmorphism, emoji, generic card grids or urgency copy.
- All visible text in `content/en.ts` and `content/bn.ts`. Bangla requires Fahad/Tamim review before launch.
