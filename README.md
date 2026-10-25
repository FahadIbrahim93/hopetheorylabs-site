# Hope Theory Labs — Website

A one-page, mobile-first website for **Hope Theory Labs**, a web studio in Dhaka. The primary conversion is a shop owner starting a WhatsApp conversation.

**Preview target:** https://hopetheorylabs.vercel.app  
**Production:** on hold until Fahad explicitly approves promotion.

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
- The animated hero field is a lightweight 2D canvas with a static fallback. Respect reduced-motion preferences.
- The Rollers Republic work item is a concept, not client work. Do not add Sthappo until delivered and approved.
- No invented metrics, testimonials, logos, credentials, analytics, tracking or cookies.

## Vercel setup and deployment

1. Connect this GitHub repository to the Vercel project named `hopetheorylabs`.
2. Use the **Next.js** framework preset and default build settings; `next.config.ts` configures static export and the build emits `out/`.
3. Keep preview deployments enabled for pull requests so changes can be reviewed before merge.
4. Run `npm run lint`, `npm run typecheck` and `npm run build` and complete the browser/Lighthouse checklist in `docs/QA.md` against the final preview.
5. **Do not promote to production until Fahad approves.** No production deployment is performed by this repository workflow.

## Contribution flow

Work one issue per branch named `issue-<number>`, open a pull request that references the issue, and wait for review. Stacked PRs must be merged in dependency order. Never push directly to `main` or merge your own PR.
