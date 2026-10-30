# Hope Theory Labs — Website

One-page marketing site for **Hope Theory Labs** (Dhaka). Primary conversion: start a WhatsApp conversation.

## Live site

**Production:** https://hopetheorylabs.vercel.app

Deploys automatically when changes merge to **`main`** (Vercel project `hopetheorylabs`, static export from `out/`). Custom domain is configured in the Vercel dashboard when ready.

Current release: full-viewport **WebGL intelligence experience**, website package pricing in content, and a **floating site assistant** (FAQ + optional free-tier models + lead capture).

## Stack

Next.js App Router · TypeScript · Tailwind v4 · Three.js + React Three Fiber (`components/experience/`) · static export (`output: "export"`). Optional server: root `api/chat.ts` and `api/lead.ts` (Vercel Functions).

## Run locally

Node 20+.

```bash
npm install
npm run dev          # http://localhost:3000
npm run lint
npm run typecheck
npm run build        # output in out/
npm test             # assistant KB + API offline checks
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
| [AGENTS.md](AGENTS.md) | Agent workflow |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Human and agent contribution flow |

## Architecture

- `app/page.tsx` → page shell: sections, copy from `content/*.ts`.
- `components/experience/`: WebGL narrative after `window` `load`; SVG/canvas fallback when needed.
- `components/assistant/`: gold bubble (first-load) + lazy panel; knowledge from `lib/assistant/kb.ts` bound to `content/en.ts`.
- `api/chat.ts` / `api/lead.ts`: Groq → Gemini → FAQ; lead save (Supabase / Resend optional).

Security headers and caching: `vercel.json`.

## Repository hygiene

- Feature work: branch from `main` (`issue-<n>` or short descriptive name), PR into `main`, `Closes #n` when applicable.
- Do **not** push directly to `main` or self-merge without review (see AGENTS.md).
- Prefer deleting merged/superseded remote branches. Keep `main` as the only long-lived branch.

## Vercel

- Framework: Next.js; build `npm run build`; output `out/`.
- Preview on every PR; production on merge to `main`.
- Optional secrets: `GROQ_API_KEY`, `GEMINI_API_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `LEAD_NOTIFY_EMAIL`, `NEXT_PUBLIC_CALCOM_URL`.
