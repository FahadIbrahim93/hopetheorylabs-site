# QA results — WebGL experience (HTML port)

Branch: `cursor/webgl-intelligence-experience-d142` (merged with `main` at commit after `4324472`). Architecture: `PageShell` + `components/experience/` (replaces the locked `HomeMotion` homepage on `main` when this PR merges).

## Automated checks — 26 Oct 2026 (Asia/Dhaka)

- [x] `npm run lint`
- [x] `npm run typecheck`
- [x] `npm run build` (static export → `out/`)
- [x] `vercel.json` security headers retained from `main`

## Lighthouse — mobile, static `out/` (gzip via local serve)

Tool: Lighthouse 13.x, mobile emulation, simulated throttling, headless Chrome + SwiftShader WebGL.

| Category | Score |
| --- | --- |
| Performance | **82** |
| Accessibility | **96** |
| Best Practices | **100** |
| SEO | **100** |

Metrics: LCP **2.7 s** · CLS **0.276** (WebGL layer crossfade and late canvas attach; investigate reserving space or delaying opacity if this blocks release) · TBT ~110 ms on an earlier run.

Note: `main`'s locked homepage reached Performance **97** with a smaller JS surface (no Three/R3F chunk). This branch trades some Lighthouse performance for the full HTML shader port; the Three/R3F bundle loads after `load`.

## Interaction gauntlet — headless Chrome, `out/` @ :4173

Script: `/tmp/htl-test/gauntlet.mjs` (not in repo). All checks passed, zero console errors:

- [x] Flow section: labels `tabIndex=0`, narrative `pp ≥ 0.55`
- [x] Tap burst on canvas (empty area)
- [x] How-it-works step click (centre burst)
- [x] Drag rotate on canvas (no errors)
- [x] `prefers-reduced-motion: reduce` — ≤2 frames over 1.5 s idle after toggle

Also run: `node run.mjs desktop|mobile` in `/tmp/htl-test/` (SwiftShader).

## Not verified

- [ ] Real-GPU fps and runtime tier downgrade
- [ ] Safari / Firefox / physical devices
- [ ] Vercel preview Lighthouse (may differ from local; previews may be deployment-protected)
- [ ] Bangla copy review

## Diagnostics

`window.__htlExperience`: `{ tier, dpr, avgFrameMs, downgrades, frames, progress: { t, pp, scrollY } }`
