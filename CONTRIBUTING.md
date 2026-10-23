# Contributing

Humans and coding agents follow the same flow. Agents: also read [AGENTS.md](AGENTS.md).

1. Read `docs/SPEC.md`, `docs/BRAND.md`, `docs/DESIGN_RULES.md`, `docs/QA.md`.
2. Pick one issue from the **Hope Theory Labs Website** project (Ready column first). Comment that you're taking it; move it to **In progress**.
3. Branch: `git checkout -b issue-<n> main`.
4. Build only what the issue asks. Keep PRs small.
5. Check locally: `npm run lint && npm run typecheck && npm run build`.
6. Open a PR to `main` with `Closes #<n>` and the template checklist filled in. Move the issue to **Review**.
7. CI (lint, typecheck, build) must pass. Vercel posts a preview URL; run Lighthouse (mobile) on it for UI changes.
8. Fahad reviews and merges. Nobody pushes to `main` directly. Production deploys are on hold until Fahad approves.

## Board statuses

Backlog → Ready → In progress → Review → Done.

## Labels

- `priority:high|med|low`
- `area:setup`, `area:layout`, `area:i18n`, `area:motion`, `area:seo`, `area:a11y`, `area:perf`, `area:qa`, `area:docs`, `area:deploy`
- `good-first-task`, `bug`, `task`
