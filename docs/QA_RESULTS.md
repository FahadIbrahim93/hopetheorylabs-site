# QA results — WebGL intelligence experience

This checklist records what was actually run and observed on the branch `cursor/webgl-intelligence-experience-d142`. Items that were not run are marked as such. Do not mark a gate as passed without evidence from the current branch or preview.

## Source-level review

- [x] The home page has one H1 with the supplied two-line "Your data. Connected. / Your business. Smarter." message; the hero CTAs "Message us on WhatsApp" and "Watch it assemble" are unchanged.
- [x] The supplied section sequence is represented: hero, Stage I, Stage II, living flow, four-step process, services, Rollers Republic concept, about, contact and footer.
- [x] Copy and labels are held in `content/en.ts` and `content/bn.ts` (new: `hero.coreNodeDetails`, `story.flowText`, `story.flowHint`); Bangla remains explicitly pending review and reuses the English node details until translated.
- [x] The intelligence core is a real WebGL scene (`components/experience/`): Three.js + React Three Fiber, hand-written GLSL (particle lattice, filaments, draw-on edges, signal packets, radar sweep, glow billboards), `MeshStandardMaterial` nodes under point/directional lighting, perspective camera orbit and pointer parallax. No GSAP, drei, post-processing or CDN scripts.
- [x] The inline-SVG core still renders in the static HTML, is the fallback when WebGL is unavailable or fails (`?experience=fallback` forces it), and the 2D particle canvas is only mounted in fallback mode, so there is one animation loop in WebGL mode.
- [x] Rollers Republic remains labelled "Concept"; the phone mockup is illustrative and does not claim a live integration.
- [x] No analytics, tracking, cookie banners, fake metrics, testimonials, logos or credential claims were introduced. The eight source nodes are described as kinds of data, not as any client's integration.
- [x] Scroll is never hijacked: no pinning, no snapping, no scroll-jacking; the scene is a pure function of scroll progress, so reversing scroll restores the state and anchor jumps land on the right keyframe.

## Automated checks — run locally on this branch

- [x] `npm run lint` — passed (ESLint 9 with React Compiler rules).
- [x] `npm run typecheck` — passed.
- [x] `npm run build` — passed (static export). Initial JS referenced by `index.html`: ~219 KB gzipped (main: ~215 KB). The Three.js/R3F chunk (~250 KB gzipped) is lazy-loaded after `load` and is not referenced by the initial HTML.

## Browser checks — headless Chrome (SwiftShader software GL), run locally

Harness: puppeteer-core against the static `out/` build. Software rendering, so frame rates below are not representative of real GPUs; they only show the loop runs and nothing throws.

- [x] Desktop 1440×900: mode `webgl`, zero console errors/warnings, WebGL 2 context created, all shaders compiled (a shader link error would trigger the fallback path).
- [x] Mobile 390×844 (touch, DPR 2): mode `webgl`, zero console errors/warnings.
- [x] Scrolling to every section anchor in order, then rapid back-and-forth scrolling (6 jumps between top and 6000px), then returning to the constellation: scene composes into each section's slot; no errors.
- [x] Resize 1440×900 → 1024×768 while live: canvas resizes, composition re-measures, no errors.
- [x] Living-platform legend: pointer hover highlights the node and its edge; click sets `aria-pressed="true"` and the detail text; keyboard Tab moves focus and updates the detail (`aria-live="polite"`).
- [x] How it works: clicking step 4 (Act) switches the scene to the two-way signal state (observed in screenshot).
- [x] `?experience=fallback`: mode `fallback`, no WebGL canvas, SVG core + 2D particle canvas, all interactions still work, zero errors.
- [x] `prefers-reduced-motion: reduce`: mode `webgl` with demand rendering — 0 frames rendered over a 2 s idle, 1 frame after a scroll, 0 after pointer movement (parallax is disabled under reduced motion).
- [x] Screenshots reviewed at every section on desktop and mobile after each tuning pass (hero, Stage I, Stage II, flow, how, services, work, about, contact, legend hover, Act step, resized).

## Not yet verified

- [ ] Real-GPU performance on phones and laptops (tiers, runtime downgrade, actual fps). `window.__htlExperience` exposes `tier`, `dpr`, `avgFrameMs`, `downgrades`, `frames`, `progress` for this.
- [ ] Vercel preview inspection and mobile Lighthouse (Performance, Accessibility, Best Practices, SEO).
- [ ] Safari/iOS and Firefox (only Chromium was available in the test environment).
- [ ] 360px, 768px and 1920px widths (1440, 1024 and 390 were checked).
- [ ] Review Bangla copy with Fahad/Tamim before launch, including the eight new source descriptions.

## Source limitation

The HTML supplied on 25 October 2026 ended in the middle of its Three.js shader, and the complete shader was never committed to this repository (all commits and branches were searched). The WebGL scene on this branch is a deliberate reconstruction of the described behavior; it is not recovered source.

## Release status

Not production-ready until the "Not yet verified" gates above are checked on the preview. Production promotion remains on hold until Fahad explicitly approves.
