# Hope Theory Labs — Website

One-page marketing site for **Hope Theory Labs** (Dhaka). Primary conversion: start a WhatsApp conversation.

## Live site

**Production:** https://hopetheorylabs.vercel.app  

Deploys automatically when changes merge to **`main`** (Vercel project `hopetheorylabs`, static export from `out/`). Custom domain setup is outside this repo — configure in the Vercel dashboard when ready.

Current release: full-viewport **WebGL intelligence experience** (PR #27) with SVG/canvas fallback.

## Stack

Next.js App Router · TypeScript · Tailwind v4 · Three.js + React Three Fiber (`components/experience/`) · Framer Motion LazyMotion · static export (`output: "export"`).

## Run locally

Node 20+.

```bash
npm install
npm run dev          # http://localhost:3000
npm run lint
npm run typecheck
npm run build        # output in out/
npx serve out        # optional static preview
```

**QA overrides:** `?experience=fallback|low|mid|high`  
**Diagnostics (WebGL):** `window.__htlExperience` in the browser console.

## Documentation

| File | Purpose |
| --- | --- |
| [docs/SPEC.md](docs/SPEC.md) | Copy, sections, WebGL architecture |
| [docs/BRAND.md](docs/BRAND.md) | Colours and fonts (legacy terms; DESIGN_RULES wins for the shipped page) |
| [docs/DESIGN_RULES.md](docs/DESIGN_RULES.md) | Visual and motion rules for the live experience |
| [docs/QA.md](docs/QA.md) | Release checklist |
| [docs/QA_RESULTS.md](docs/QA_RESULTS.md) | Recorded test results and production Lighthouse |
| [AGENTS.md](AGENTS.md) | Agent workflow |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Human and agent contribution flow |

## Architecture

- `app/page.tsx` → `PageShell`: section components, copy from `content/*.ts`.
- `components/experience/`: loaded after `window` `load`; scroll → narrative `pp`; particle morph, core, rings, flow graph, burst/drag; DOM overlays (labels, HUD, intro, cursor).
- **Fallback:** inline SVG core + light 2D particles; no Three chunk (`?experience=fallback` or no WebGL).

The supplied HTML shader is **ported** via npm `three` (not CDN). Security headers and caching: `vercel.json`.

## Repository hygiene

- Feature work: branch `issue-<n>` or `cursor/<description>-d142`, PR to `main`, `Closes #n` when applicable.
- Do **not** push directly to `main` or self-merge without review (see AGENTS.md).
- Stale stacked PRs from the pre–WebGL issue chain (#17–#23) were superseded by PR #27; close them if still open.

## Vercel

- Framework: Next.js; build command `npm run build`; output directory `out/`.
- Preview URL on every PR; production alias on merge to `main`.
