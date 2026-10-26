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

## Launch gates — status

| Gate | Status |
| --- | --- |
| Lighthouse mobile 90+ (all four) | **Met** locally (97 / 100 / 100 / 100) — confirm on preview |
| CLS &lt; 0.1 | **Met** (0) |
| Bangla toggle | **Hidden** (`header.banglaEnabled: false`) until copy review |
| Case studies | **Structured** in `content/en.ts` → `work.cases[]` (Concept / Shipped labels) |
| Real-device Safari/Firefox | **Not verified** in automation |
| Custom domain | **Not configured** in repo |

## Sign-off

| Role | Name | Date | Notes |
| --- | --- | --- | --- |
| Engineering (automated) | Cloud agent | 26 Oct 2026 | Perf + proof structure on `cursor/positioning-copy-split-0b4e` |
| Product / Fahad | — | — | Enable `banglaEnabled` after Bangla review; approve custom domain |
