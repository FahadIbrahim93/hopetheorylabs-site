# Hope Theory Labs — Website

Marketing site for **Hope Theory Labs** (Dhaka): forward-deployed engineering, custom web/mobile software, AI integration and enterprise systems. The AI Audit is an optional engagement. The main conversion is a prefilled WhatsApp project enquiry. No personal founder identity is published on the website.

Routes: `/`, `/about`, `/services`, `/pricing`, `/contact`. Agents: start with [AGENTS.md](AGENTS.md), then [docs/STATUS.md](docs/STATUS.md) and [docs/ROADMAP.md](docs/ROADMAP.md).

## Live site

**Production:** https://hopetheorylabs.vercel.app

Deploys automatically when changes merge to **`main`** (Vercel project `hopetheorylabs`, Next.js hybrid deployment (prerendered pages and App Router functions)). Custom domain is configured in the Vercel dashboard when ready.

Current release (20 Nov 2026): AI-first copy and the "Instrument" brand, a full-viewport **WebGL scene** with an SVG fallback, website package pricing (the AI Audit has no published price), and a **floating site assistant** (FAQ, optional free-tier models, lead capture). PR #70 updated the brand book and sixth service icon and added repeatable live-site visual QA.

## Stack

Next.js App Router · TypeScript · Tailwind v4 · Three.js + React Three Fiber (`components/experience/`) · hybrid Next.js deployment with App Router handlers in `app/api/chat/route.ts` and `app/api/lead/route.ts`.

## Run locally

Node 20+.

```bash
npm install
npm run dev          # http://localhost:3000
npm run lint
npm run typecheck
npm run build        # production .next/ build
npm test             # design tokens, assistant KB, API and WhatsApp link checks
npm run test:e2e     # Playwright layout and axe tests
npx serve out        # optional static preview
```

Environment variables are optional; see [`.env.example`](.env.example) and [docs/ASSISTANT.md](docs/ASSISTANT.md).

**QA overrides:** `?experience=fallback|low|mid|high`  
**Diagnostics (WebGL):** `window.__htlExperience` in the browser console.

## Documentation

| File | Purpose |
| --- | --- |
| [docs/SPEC.md](docs/SPEC.md) | Canonical product rules (wins on conflict) |
| [docs/BRAND.md](docs/BRAND.md) | Brand colours and type |
| [docs/DESIGN_RULES.md](docs/DESIGN_RULES.md) | Visual and motion rules |
| [docs/QA.md](docs/QA.md) | Release checklist |
| [docs/QA_RESULTS.md](docs/QA_RESULTS.md) | Recorded results / Lighthouse notes |
| [docs/ASSISTANT.md](docs/ASSISTANT.md) | Floating assistant architecture and verify steps |
| [docs/ASSETS.md](docs/ASSETS.md) | Asset notes |
| [docs/STATUS.md](docs/STATUS.md) | What is live, open work, known gaps |
| [docs/ROADMAP.md](docs/ROADMAP.md) | Remaining work in priority order |
| [brand/README.md](brand/README.md) | Instrument brand kit |
| [AGENTS.md](AGENTS.md) | Agent rules, setup and CI |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Human and agent contribution flow |

## Architecture

- `app/` routes → page shells; all copy comes from `content/en.ts`.
- `lib/whatsapp.ts`: every WhatsApp link, built with a `?text=` message.
- `components/experience/`: WebGL narrative after `window` `load`; SVG/canvas fallback when needed.
- `components/assistant/`: gold bubble (first-load) + lazy panel; knowledge from `lib/assistant/kb.ts` bound to `content/en.ts`.
- `app/api/chat/route.ts` / `app/api/lead/route.ts`: Groq → Gemini → FAQ; lead save (Supabase / Resend optional).

Security headers and caching: `vercel.json`.

## Repository hygiene

- Feature work: branch from `main` (`issue-<n>` or short descriptive name), PR into `main`, `Closes #n` when applicable.
- Do **not** push directly to `main`, and do not merge without direct repository-owner approval. A merge to `main` deploys production (see AGENTS.md).
- `main` is the only long-lived branch. After a reviewed merge, verify the merged PR and branch head, then delete the remote feature branch. Enable automatic deletion of merged PR branches in GitHub Settings → General → Pull Requests. Historic cleanup and owner approval: [issue #67](https://github.com/FahadIbrahim93/hopetheorylabs-site/issues/67).

## Vercel

- Framework: Next.js; build `npm run build`; Next.js project preset; no custom static output directory.
- Preview on every PR; production on merge to `main`.
- Optional secrets: `GROQ_API_KEY`, `GEMINI_API_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `LEAD_NOTIFY_EMAIL`, `NEXT_PUBLIC_CALCOM_URL`.
