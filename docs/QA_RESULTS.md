# QA results

**Production URL:** https://hopetheorylabs.vercel.app  
**Main branch commit (WebGL release):** `f47ab2f` — merge of PR #27 (26 Oct 2025, 05:24 AM Dhaka).  
**Architecture:** `PageShell` + lazy `components/experience/` (Three.js / R3F HTML concept port).

## Automated checks — 26 Oct 2026 (Asia/Dhaka)

- [x] `npm run lint` on `main`
- [x] `npm run typecheck` on `main`
- [x] `npm run build` (static export → `out/`)
- [x] `vercel.json` security headers on live site (CSP, HSTS, `X-Frame-Options`, etc.)

## Production smoke — 26 Oct 2026 (Asia/Dhaka)

- [x] `GET https://hopetheorylabs.vercel.app` → **200**, HTML title and meta present
- [x] Theme color `#07090C`, canonical URL set

## Lighthouse — mobile, **production** URL

Tool: Lighthouse (CLI), mobile emulation, headless Chrome, 26 Oct 2026 (Asia/Dhaka).

| Category | Score |
| --- | --- |
| Performance | **81** |
| Accessibility | **96** |
| Best Practices | **100** |
| SEO | **100** |

Metrics: LCP **2.3 s** · CLS **0** (production CDN run).

**Note:** Local static serve of `out/` previously reported Performance **82** and CLS **0.276** (WebGL layer fade-in on cold local serve). Production measurement did not reproduce CLS; Performance remains below the original **90+** goal because of the Three/R3F bundle loaded after `load`.

## Lighthouse — mobile, local `out/` (reference)

| Category | Score |
| --- | --- |
| Performance | **82** |
| Accessibility | **96** |
| Best Practices | **100** |
| SEO | **100** |

CLS **0.276** on that run — see note above.

## Interaction gauntlet — headless Chrome, local `out/` @ :4173

Script: ad-hoc `/tmp/htl-test/gauntlet.mjs` (not in repo). All checks passed, zero console errors:

- [x] Flow section: labels focusable, narrative `pp ≥ 0.55`
- [x] Tap burst on canvas
- [x] How-it-works step click (centre burst)
- [x] Drag rotate on canvas
- [x] `prefers-reduced-motion: reduce` — idle frame budget respected

## Release gates — status

| Gate | Status |
| --- | --- |
| WebGL experience on `main` | **Shipped** (PR #27) |
| SEO / 404 / favicon | **Present** on `main` |
| Lighthouse Perf 90+ mobile | **Not met** (81 prod / 82 local) — track under perf follow-up |
| Bangla copy review | **Outstanding** (`content/bn.ts` TODO) |
| Real-device Safari/Firefox | **Not verified** in automation |
| Custom domain beyond `*.vercel.app` | **Not configured** in this repo |

## Diagnostics

In browser console (WebGL mode): `window.__htlExperience` — `{ tier, dpr, avgFrameMs, downgrades, frames, progress: { t, pp, scrollY } }`.

QA overrides: `?experience=fallback|low|mid|high`.

## Sign-off

| Role | Name | Date | Notes |
| --- | --- | --- | --- |
| Engineering (automated + smoke) | Cloud agent | 26 Oct 2026 | Production link verified |
| Product / Fahad | — | — | Approve custom domain and Bangla before broad marketing |
