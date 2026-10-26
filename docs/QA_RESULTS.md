# QA results

**Production URL:** https://hopetheorylabs.vercel.app  
**Architecture:** Next.js static export · WebGL on capable desktops · SVG core on mobile / fallback.

## Automated checks — 26 Oct 2026 (Asia/Dhaka)

- [x] `npm run lint` on release branch
- [x] `npm run typecheck` on release branch
- [x] `npm run build` (static export → `out/`)
- [x] `vercel.json` security headers on live site (CSP, HSTS, `X-Frame-Options`, etc.)

## Performance — local static `out/` @ :4173

Tooling: `npm run perf:first-load`, `node scripts/run-lighthouse-mobile.mjs` (Lighthouse CLI, mobile emulation, headless Chrome), 26 Oct 2026 (Asia/Dhaka).

| Check | Result |
| --- | --- |
| Lighthouse Performance | **97** |
| Lighthouse Accessibility | **100** |
| Lighthouse Best Practices | **100** |
| Lighthouse SEO | **100** |
| CLS | **0** |
| LCP | **2.4 s** |
| Critical-path JS (head) | Run `npm run perf:first-load` on CI artifact / after build |
| All scripts in index.html | ~186 KB gzip (includes lazy route + Experience chunks referenced in HTML) |

**Notes:** Mobile Lighthouse uses constrained-device rules (no WebGL fetch on ≤800px). Intelligence core SVG is server-rendered in static HTML for stable LCP/CLS. Re-run on **Vercel preview** after merge for production-parity scores.

## Manual checklist (docs/QA.md) — 26 Oct 2026

### Visual and brand

- [x] Gold/navy/paper palette; studio grid atmosphere (no teal particle field — superseded by gold `StudioAtmosphere`)
- [x] `rg -i "teal|14b8a6|2dd4bf|7fd6c2|0f766e" app components content` — no matches on release branch
- [x] Rollers Republic **Concept**; speed slider **Illustrative only**
- [x] EMBERFALL case study **Shipped** with self-hosted preview image (`public/work/emberfall-hero.png`); play link opens external game (no iframe — CSP)

### Copy and conversion

- [x] Visible strings from `content/en.ts` / `content/bn.ts`
- [x] WhatsApp `https://wa.me/8801718463471`; email `hopetheorybd@gmail.com`

### Motion and WebGL

- [x] `?experience=fallback` documented in QA.md
- [x] Reduced-motion path in experience code
- [ ] Full manual pass: flow burst, HUD scroll narrative (automated agent — spot-check on preview)

### Accessibility

- [x] Lighthouse Accessibility **100** (local mobile)
- [ ] Keyboard pass on all eight flow nodes (manual)

### i18n

- [x] `header.banglaEnabled: false` — toggle hidden
- [ ] Bangla review by Fahad before enable

### SEO and meta

- [x] Present in repo (`robots.txt`, `sitemap.xml`, `og.png`, JSON-LD, `not-found`, `icon.svg`) — verify on preview after deploy

### Performance breakpoints

- [ ] Spot-check **360 / 768 / 1280 / 1920** px on Vercel preview (Chromium automated partial only)
- [ ] Safari / Firefox real devices — **not verified**

## Launch gates — status

| Gate | Status |
| --- | --- |
| Lighthouse mobile 90+ (all four) | **Met** locally (97 / 100 / 100 / 100) — confirm on preview after Emberfall merge |
| CLS &lt; 0.1 | **Met** (0) |
| Bangla toggle | **Hidden** until copy review |
| Case studies | Rollers (Concept), **EMBERFALL (Shipped)**, HTL site (Shipped) |
| Studio atmosphere | **On main** (`StudioAtmosphere`, narrative rail, section markers) |
| Stale step issues #4–#10 | **Closed** as shipped/superseded (see issue comments) |
| Custom domain | **Held** — not configured in repo |

## Sign-off

| Role | Name | Date | Notes |
| --- | --- | --- | --- |
| Engineering (automated) | Cloud agent | 26 Oct 2026 | Emberfall showcase + QA doc expansion |
| Product / Fahad | — | — | Enable `banglaEnabled` after Bangla review; custom domain when ready |
