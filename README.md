# hopetheorylabs-site

The one-page website for **Hope Theory Labs**, a small web studio in Dhaka. Goal: a shop owner taps WhatsApp.
Live target: https://hopetheorylabs.vercel.app (Vercel free tier). Production deploys are on hold until Fahad approves.

Stack: Next.js (App Router, TypeScript) · Tailwind CSS · Framer Motion. Static export.

> **Status:** scaffold only. The site is built issue by issue from the project board "Hope Theory Labs Website".

## Run it

Requires Node.js 20+.

```bash
npm install
npm run dev        # http://localhost:3000
npm run lint
npm run typecheck
npm run build      # once Step 1 sets output: "export", the static site lands in out/
```

## Single source of truth (read before coding)

| File | What |
| --- | --- |
| [docs/SPEC.md](docs/SPEC.md) | Full build spec: copy, sections, components, 10 build steps (canonical) |
| [docs/BRAND.md](docs/BRAND.md) | Colours, fonts, voice |
| [docs/DESIGN_RULES.md](docs/DESIGN_RULES.md) | Anti-AI-look bans and dos, motion rules |
| [docs/QA.md](docs/QA.md) | Quality bar every PR must meet |
| [AGENTS.md](AGENTS.md) | How coding agents pick up and ship work |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Branch, PR and review flow |

## Deploy

The repo is connected to Vercel project `hopetheorylabs`. Every PR gets a preview deploy. Nothing is promoted to production without Fahad's OK.
