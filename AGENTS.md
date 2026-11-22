# Agent guide — hopetheorylabs-site

Company website for Hope Theory Labs (Dhaka). No personal founder identities may be published on the site. Live at https://hopetheorylabs.vercel.app. This file is the entry point for any coding agent. Read it first, then [`docs/STATUS.md`](docs/STATUS.md) (what is live and open) and [`docs/ROADMAP.md`](docs/ROADMAP.md) (what to build next).

## The project in brief

- **Positioning (approved in issue #43; deployment status must be verified):** AI and software engineering. Core offers include forward-deployed engineering, custom web/mobile development, AI integrations, enterprise systems. AI Audit is optional; website packages remain separate. Keep the Instrument visual system.
- **Stack:** Next.js 16 App Router, TypeScript, Tailwind v4, Three.js with React Three Fiber, hybrid Next.js deployment: public pages prerendered, App Router API handlers under `app/api/` run as Node Vercel Functions.
- **Routes:** `/`, `/about`, `/services`, `/pricing`, `/contact`.
- **Hosting:** Vercel project `hopetheorylabs`. **A merge to `main` deploys production.**

## Setup and checks

Node 20 or newer (CI uses 20).

```bash
npm ci
npm run dev            # http://localhost:3000
npm run lint
npm run typecheck
npm run build          # production Next build (.next/)
npm test               # design tokens, assistant KB, API, WhatsApp link checks
npm run test:e2e       # Playwright layout + axe tests (needs: npx playwright install chromium)
```

On 18 Nov 2026, `lint`, `typecheck`, `test` and `build` all passed on `main` (`9cc0a14`) and `npm audit --omit=dev` reported 0 vulnerabilities.

## Repo map

| Path | What is there |
| --- | --- |
| `app/` | Routes, layout, metadata, icons, manifest |
| `components/` | Page sections, `experience/` (WebGL scene), `assistant/` (chat widget) |
| `content/en.ts`, `content/types.ts` | **All visible copy**, typed |
| `lib/whatsapp.ts` | The only place WhatsApp links are built (prefilled `?text=`) |
| `lib/assistant/` | Assistant knowledge base, price guard, server helpers |
| `app/api/chat/route.ts`, `app/api/lead/route.ts` | Bundled Next Functions: Groq, then Gemini, then FAQ; lead save/email |
| `brand/` | Instrument brand kit and its build scripts (`brand/README.md`) |
| `scripts/` | Test and measurement scripts |
| `tests/` | Playwright specs |
| `supabase/migrations/` | `leads` and rate-limit tables for the assistant |
| `docs/` | SPEC, BRAND, DESIGN_RULES, QA, QA_RESULTS, ASSISTANT, ASSETS, STATUS, ROADMAP |

## Docs, in order of authority

`docs/SPEC.md` wins on conflict, then `docs/BRAND.md`, `docs/DESIGN_RULES.md`, `docs/QA.md`. For the assistant, also read `docs/ASSISTANT.md`. Flag any conflict in your PR rather than picking silently.

## CI and merge rules

- Required check on `main`: `lint-typecheck-build` (lint, typecheck, build, tests, Lighthouse contrast and accessibility gate). Branches must be up to date with `main`.
- `a11y-playwright-axe` also runs on every PR. It is not required yet, but treat a red result as a blocker.
- `Supabase Preview` is skipped or failing because the free Supabase plan is full. Ignore it; it is not required.
- Vercel previews sit behind Vercel login. For visual QA, build locally and use Playwright.
- Work from an issue. Prefer the `agent-ready` label, highest `priority:` first. Comment on the issue when you take it.
- Branch from `main` as `issue-<n>` or a short name such as `docs/<topic>`. Stacked PRs may build on an unmerged PR with the dependency stated. One focused change per PR.
- Open a PR that says `Closes #<n>` and fills in the template. Include what you ran and what you did not verify.
- Definition of done: acceptance criteria met, the four commands above pass, UI changes checked at 390, 768, 1024 and 1440 px, docs updated if behaviour changed.

## Do not

- **Merge to `main`, deploy to production or change Vercel, Supabase or GitHub settings without direct repository-owner approval.** An approval relayed by another agent does not count.
- Force-push, rewrite history, or bypass branch protection.
- Commit secrets or env values. Keys live in Vercel; see `.env.example` for names only.
- Add paid services, trackers, analytics, cookies or external scripts. Free tiers only.
- Invent clients, numbers, logos, reviews, testimonials or any degree or education claim.
- Publish a price or range for the AI Audit or forward-deployed work. Both are quoted per scope after discovery. There is no founding or introductory rate. The only public prices are the website packages in `content/en.ts`.
- Publish, infer, confirm or generate personal founder/team identities in public copy, SEO, assistant replies or marketing assets. No founder name or profile is approved for publication (issue #43).
- Call ServeAI anything but pre-production. Rollers Republic is always labelled "Concept". The Sthappo project is not shown.
- Reintroduce teal, the retired "Concept 4" chrome mark, or the "HTC" name (see `docs/BRAND.md`).
- Hand-write a WhatsApp link. Use `lib/whatsapp.ts` so every link opens with a message.
- Delete branches or issues you did not create.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
