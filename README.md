# Hope Theory Labs — Website

A one-page, mobile-first website for **Hope Theory Labs**, a web studio in Dhaka. The primary conversion is a shop owner starting a WhatsApp conversation.

**Production URL:** https://hopetheorylabs.vercel.app (Vercel project `hopetheorylabs`, deployed automatically from `main`)  
**Previews:** every pull request gets its own Vercel preview URL. Previews are behind Vercel Deployment Protection, so they ask for a Vercel login.

## Stack

Next.js App Router · TypeScript · Tailwind CSS · CSS-first motion · static export.

## Run locally

Requires Node.js 20+.

```bash
npm install
npm run dev        # http://localhost:3000
npm run lint
npm run typecheck
npm run build      # static export is written to out/
```

## Build and design source of truth

Read these before changing the site. If documents conflict, `docs/SPEC.md` wins.

| File | Purpose |
| --- | --- |
| [docs/SPEC.md](docs/SPEC.md) | Canonical copy, sections, architecture and build plan |
| [docs/BRAND.md](docs/BRAND.md) | Colour palette, fonts and voice |
| [docs/DESIGN_RULES.md](docs/DESIGN_RULES.md) | Visual principles, banned patterns and motion rules |
| [docs/QA.md](docs/QA.md) | Accessibility, performance and release gates |
| [docs/QA_RESULTS.md](docs/QA_RESULTS.md) | Source-level QA notes and outstanding external checks |
| [AGENTS.md](AGENTS.md) | Agent workflow and hard rules |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Branch, PR and review workflow |

## Architecture notes

- The page is composed from reusable components under `components/`.
- All visible site copy belongs in `content/en.ts` and `content/bn.ts`; review Bangla translations with Fahad/Tamim before launch.
- The homepage follows the locked HTML design: editorial two-line hero, scroll-linked particle field, stage sections, interactive four-step process, services, animated Rollers Republic phone mockup, contact-to-WhatsApp form, state HUD, and ticker. Motion respects reduced-motion preferences. The pasted shader was truncated at `vec3`, so the field is completed in `components/home/HomeMotion.tsx` without a CDN.
- The Rollers Republic work item is a concept, not client work. Do not add Sthappo until delivered and approved.
- No invented metrics, testimonials, logos, credentials, analytics, tracking or cookies.

## Vercel setup and deployment

The GitHub repository is connected to the Vercel project `hopetheorylabs` (framework preset **Next.js**, Node 24). `next.config.ts` configures static export, so the build emits `out/` and Vercel serves it as static files.

- **Preview:** pushing a branch or opening a pull request creates a preview deployment. Nobody deploys by hand.
- **Production:** merging to `main` deploys `https://hopetheorylabs.vercel.app`. Merging is the production approval step and belongs to Fahad.
- `vercel.json` sets the security headers (CSP without external scripts, HSTS, frame denial, referrer and permissions policies) and long-lived caching for hashed assets. There are no environment variables, serverless functions or databases.
- Before merging: `npm run lint`, `npm run typecheck`, `npm run build`, then the browser and Lighthouse checklist in `docs/QA.md`. Current results are in `docs/QA_RESULTS.md`.
- To make previews public, turn off Deployment Protection in the Vercel project settings. Agents must not change Vercel settings.

## Contribution flow

Work one issue per branch named `issue-<number>`, open a pull request that references the issue, and wait for review. Stacked PRs must be merged in dependency order. Never push directly to `main` or merge your own PR.
