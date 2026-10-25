# QA results — WebGL intelligence experience (HTML port)

Recorded on branch `cursor/webgl-intelligence-experience-d142` after porting the supplied standalone HTML Three.js scene into `components/experience/`.

## Automated checks

- [x] `npm run lint` — passed.
- [x] `npm run typecheck` — passed.
- [x] `npm run build` — passed (static export).

## Headless browser (puppeteer-core, SwiftShader GL, static `out/` on port 4173)

- [x] Desktop 1440×900: mode `webgl`, zero console errors.
- [x] Mobile 390×844: mode `webgl`, zero console errors.
- [x] `?experience=fallback`: mode `fallback`, zero console errors.

## Not verified in this pass

- [ ] Real-GPU fps and runtime tier downgrade on hardware.
- [ ] Vercel preview Lighthouse mobile scores.
- [ ] Safari / Firefox manual pass.

Diagnostics: `window.__htlExperience` exposes `tier`, `dpr`, `avgFrameMs`, `downgrades`, `frames`, `progress` (includes `pp` scroll narrative).
