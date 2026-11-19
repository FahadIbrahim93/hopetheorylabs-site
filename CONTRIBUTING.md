# Contributing

Humans and coding agents follow the same flow. Agents: also read [AGENTS.md](AGENTS.md).

1. Read `docs/SPEC.md`, `docs/BRAND.md`, `docs/DESIGN_RULES.md`, `docs/QA.md`.
2. Pick one issue from the **Hope Theory Labs Website** project (Ready column first). Comment that you're taking it; move it to **In progress**.
3. Branch: `git checkout -b issue-<n> main`.
4. Build only what the issue asks. Keep PRs small.
5. Check locally: `npm run lint && npm run typecheck && npm run build`.
6. Open a PR to `main` with `Closes #<n>` and the template checklist filled in. Move the issue to **Review**.
7. CI must pass: `lint-typecheck-build` (required) and `a11y-playwright-axe`. Vercel posts a preview URL; run Lighthouse (mobile) on it for UI changes.
8. Fahad reviews and merges. Nobody pushes to `main` directly without review.
9. After merge, delete the feature branch **only after verifying the PR merged and the branch has no post-merge commits**. Configure automatic deletion of merged pull-request head branches under GitHub Settings → General → Pull Requests. Never delete `main` or unique unmerged drafts.

**Production:** Merges to `main` deploy to https://hopetheorylabs.vercel.app via Vercel. Custom domain or promotion settings are changed only in the Vercel dashboard with Fahad's approval. See [docs/QA_RESULTS.md](docs/QA_RESULTS.md) for the latest verified release.

## Branch hygiene

- Use one focused branch per work item and do not reuse it for unrelated work.
- A squash-merged branch can report Git divergence even though the PR merged. Cross-check the **merged PR and exact last head SHA** before deleting; do not treat an ahead count as proof of unique unpublished work.
- Record any retained draft branches in issue #67 until their contents are decided.
- Do not close owner-decision or manual-QA issues merely because a related automated test passed.

## Board statuses

Backlog → Ready → In progress → Review → Done.

## Labels

- `priority:high|med|low`
- `area:setup`, `area:layout`, `area:i18n`, `area:motion`, `area:seo`, `area:a11y`, `area:perf`, `area:qa`, `area:docs`, `area:deploy`
- `good-first-task`, `bug`, `task`
