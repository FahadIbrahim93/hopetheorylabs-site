# Hope Theory Labs — Website

Marketing site for **Hope Theory Labs** (Dhaka). It presents a full-service AI and software engineering studio: forward-deployed engineering, custom web and mobile, AI integration, enterprise systems, optional AI Audit discovery, and website packages as a separate offer. The main conversion is a WhatsApp conversation that opens with a prefilled message.

Routes: `/`, `/about`, `/services`, `/pricing`, `/work`, `/work/[slug]`, `/contact`. Agents: start with [AGENTS.md](AGENTS.md), then [docs/STATUS.md](docs/STATUS.md) and [docs/ROADMAP.md](docs/ROADMAP.md).

## Live site

**Production:** https://hopetheorylabs.vercel.app

Deploys automatically when changes merge to **main** (Vercel project `hopetheorylabs`, Next.js hybrid deployment (prerendered pages and App Router functions)). Custom domain is configured in the Vercel dashboard when ready.

Current release (22 Nov 2026): broader engineering positioning (no public founder profiles), Instrument brand, full-viewport **WebGL scene** with SVG fallback, website package pricing (AI and bespoke work quoted per scope), and a **floating site assistant** (FAQ, optional free-tier models, lead capture).

## Stack

Next.js App Router · TypeScript · Tailwind v4 · Three.js + React Three Fiber (`components/experience/`) · hybrid Next.js deployment with App Router handlers in `app/api/chat/route.ts` and `app/api/lead/route.ts`.

## Local development

```bash
npm ci
npm run dev        # http://localhost:3000
npm run lint
npm run typecheck
npm run build
npm test
npm run test:e2e   # needs: npx playwright install chromium
```

Copy `.env.example` to `.env.local` only when exercising the assistant or lead APIs locally. Production secrets stay in Vercel.

## Brand

Source of truth: [docs/BRAND.md](docs/BRAND.md) and [brand/](brand/). Public site colours and type must match the Instrument tokens; do not reintroduce retired teal or HTC marks.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) and [AGENTS.md](AGENTS.md). Do not merge to `main` without the owner's explicit OK.
