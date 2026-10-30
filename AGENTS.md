# Agent rules — hopetheorylabs-site

You are a coding agent building the Hope Theory Labs website. Everything you need is in this repo.

## Before you write code

1. Read the single source of truth, in this order: `docs/SPEC.md`, `docs/BRAND.md`, `docs/DESIGN_RULES.md`, `docs/QA.md`. If they conflict, SPEC.md wins; flag the conflict in your PR.
2. If the change touches the floating assistant, also read `docs/ASSISTANT.md` and keep answers bound to `content/en.ts` (price guard must stay).
3. Prefer **one** focused change per PR. If a board issue exists, comment that you are taking it.

## How you work

- Branch from `main` named `issue-<n>` or a short descriptive name (e.g. `docs/final-polish`).
- Do only what the task asks. Meet every acceptance criterion.
- Run `npm run lint && npm run typecheck && npm run build` before pushing. If you change the assistant or `api/*`, also run `npm test`.
- Open a PR that links the issue when applicable (`Closes #<n>`), fill in the PR template checklist, and include the Vercel preview URL and Lighthouse mobile scores when UI changed.
- **Never touch `main` directly**: no direct pushes, no force-pushes, no merging your own PR.

## Hard rules

- Follow `docs/DESIGN_RULES.md` (anti-AI-look bans and dos, motion and performance budget).
- Use only the copy in SPEC.md / `content/*.ts`. **No fake stats, metrics, logos, reviews, testimonials, or degree/education claims** about Fahad or anyone.
- Rollers Republic is always "Concept". Sthappo is not added. AI services are "Early access" with no prices unless SPEC and content already list them.
- **No new paid services**, no tracking/analytics/cookies, no external scripts. Free tiers only.
- Don't deploy to production or change Vercel settings. Preview deploys come from PRs automatically.
- Missing assets (e.g. Rollers Republic screenshots): don't fake them. Ask in the issue and leave a clear TODO.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
