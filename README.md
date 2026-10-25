# Hope Theory Labs — Website

One-page site for **Hope Theory Labs** (Dhaka). Primary conversion: WhatsApp conversation.

**Production:** https://hopetheorylabs.vercel.app (updates when `main` merges)  
**Preview (WebGL port):** Vercel PR deployment on branch `cursor/webgl-intelligence-experience-d142`

## Stack

Next.js App Router · TypeScript · Tailwind v4 · **Three.js + React Three Fiber** (HTML concept port in `components/experience/`) · Framer Motion LazyMotion · static export.

## Run locally

Node 20+.

```bash
npm install
npm run dev          # http://localhost:3000
npm run lint
npm run typecheck
npm run build        # output in out/
```

QA overrides: `?experience=fallback|low|mid|high`  
Diagnostics (WebGL): `window.__htlExperience` in the console.

## Documentation

| File | Purpose |
| --- | --- |
| [docs/SPEC.md](docs/SPEC.md) | Copy, sections, WebGL architecture |
| [docs/BRAND.md](docs/BRAND.md) | Colours and fonts |
| [docs/DESIGN_RULES.md](docs/DESIGN_RULES.md) | Visual and motion rules |
| [docs/QA.md](docs/QA.md) | Release gates |
| [docs/QA_RESULTS.md](docs/QA_RESULTS.md) | Recorded test results |
| [AGENTS.md](AGENTS.md) | Agent workflow |

## Architecture (WebGL branch)

- `app/page.tsx` → `PageShell` (client): sections as React components, copy from `content/*.ts`.
- `components/experience/`: lazy-loaded after `load`; scroll tracking → `pp`; `SceneRig` runs particle morph, core, rings, flow graph, burst/drag; DOM overlays for flow labels, HUD, intro, cursor.
- Fallback: inline SVG core + light 2D particles; no WebGL chunk.

The supplied HTML shader is **ported** via npm Three (not CDN). `components/home/HomeMotion.tsx` on `main` is replaced by this stack when the PR merges.

## Vercel

- Project `hopetheorylabs`, static `out/`.
- `vercel.json` sets security headers and static caching.
- Do not promote production without Fahad's approval.

## Contributing

One issue per branch `issue-<n>`, PR with `Closes #n`, no direct pushes to `main`.
