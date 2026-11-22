# Status — 23 November 2026

This is a point-in-time summary, not a substitute for checking live GitHub Actions and Vercel before deploying.

## Deployed site

- Production: https://hopetheorylabs.vercel.app
- Branch: `main` runs the hybrid Next.js App Router architecture; PR #81 (API route migration) was merged. Marketing pages are prerendered and chat/lead handlers are Next.js API routes. Current signed-out production responses are **not reverified** here; issue #74 tracks public reachability and API smoke tests.
- Hero copy on `main` was updated through merged PR #85. The broader company positioning and public-founder privacy changes are under review in PR #88; do not describe them as deployed until the merge and signed-out production QA are verified.
- Identity: Instrument brand, H-T-L logo and social assets in `brand/`. AI Audit and custom engineering fees are quoted per scope. Published Starter / Counter / Showroom web packages remain separate.
- Public contact: `hopetheorylabs@gmail.com`, company X account `@HopeTheoryLabs`; WhatsApp links have prefilled text.
- English-only public site. The assistant can respond in Bangla. No approved Bangla site translation exists.
- Assistant model/lead-save functionality depends on Vercel secrets; do not infer those settings from the repository.

## Pending reviewed work

- [PR #85](https://github.com/FahadIbrahim93/hopetheorylabs-site/pull/85): merged 23 Nov (squash `5b437b6`) after GitHub CI passed; production visibility needs independent confirmation.
- [PR #86](https://github.com/FahadIbrahim93/hopetheorylabs-site/pull/86): obsolete stacked draft, closed without merging after the #85 squash merge.
- [PR #88](https://github.com/FahadIbrahim93/hopetheorylabs-site/pull/88): clean, reviewable follow-up to #85 for broad engineering positioning, public founder-profile removal and distinct chat/lead rate limits. CI and production sign-off are release gates.
- Generated brand-book PDF, historic named print assets and historical public revisions require a separate privacy/source audit; their presence is not remedied by a site-content PR.

## Verified releases and checks

| Date | Change / evidence | Outcome |
|---|---|---|
| 18 Nov | [PR #61](https://github.com/FahadIbrahim93/hopetheorylabs-site/pull/61): Instrument + AI-first messaging | Merged |
| 18 Nov | [PR #62](https://github.com/FahadIbrahim93/hopetheorylabs-site/pull/62): Next.js 16.4.6 security update | Merged |
| 18 Nov | [PR #63](https://github.com/FahadIbrahim93/hopetheorylabs-site/pull/63): side rail and WhatsApp links | Merged |
| 19 Nov | [PR #70](https://github.com/FahadIbrahim93/hopetheorylabs-site/pull/70): brand-book corrections, sixth icon, live QA | Merged |
| 20 Nov | [Live browser QA](https://github.com/FahadIbrahim93/hopetheorylabs-site/actions/runs/44615009731) | 360, 390, 768, 1440, 1920px pass; no detected axe violations or horizontal overflow |
| 20 Nov | Mobile Lighthouse, production | Performance 95, Accessibility 100, Best Practices 100, SEO 100; LCP ~1.14s, CLS 0 |

Detailed evidence and known limits: [QA_RESULTS.md](QA_RESULTS.md). Automated checks do not replace human visual, real-device WebGL, cross-browser and screen-reader testing.

## Remaining tracking

| Issue | Status |
|---|---|
| [#43](https://github.com/FahadIbrahim93/hopetheorylabs-site/issues/43) | Positioning and site/assistant privacy implementation in PR #88; full brand-asset review pending in #87 |
| [#42](https://github.com/FahadIbrahim93/hopetheorylabs-site/issues/42) | Historical repositioning epic; close after #43 release verification and brand/privacy gate |
| [#66](https://github.com/FahadIbrahim93/hopetheorylabs-site/issues/66) | Manual cross-device / screen-reader / WebGL QA and additional per-route mobile Lighthouse evidence pending |
| [#67](https://github.com/FahadIbrahim93/hopetheorylabs-site/issues/67) | Owner-only GitHub / Vercel settings, branch housekeeping, social uploads |
| [#68](https://github.com/FahadIbrahim93/hopetheorylabs-site/issues/68) | Optional future Bangla localization; no commitment until reviewed copy exists |

Issues [#64](https://github.com/FahadIbrahim93/hopetheorylabs-site/issues/64) and [#65](https://github.com/FahadIbrahim93/hopetheorylabs-site/issues/65) were resolved by PR #70.

## Branch hygiene snapshot

As audited before this documentation PR, GitHub had **23 branches including `main`**: 14 were ancestors of `main`, five matched the head commits of already merged PRs (some squash-merged), and three were unmerged historical work that should be preserved pending review.

- **Do not delete:** `main`, `issue-42-positioning-draft`, `issue-43-positioning` or `fix/visual-token-drift-50` without explicit resolution of their unique content.
- The full reviewed removal list, branch heads and owner-only action instructions are tracked in issue #67. GitHub's automatically-delete-head-branches setting can prevent future accumulation.

## Known account/setup limits

A November 18 audit recorded GitHub security alerts and the a11y required-check setting as incomplete, and the Supabase Preview integration as not usable under the current free-plan quota. These owner settings need re-verification in GitHub/Vercel. Do not assert a security clean bill merely because alerts are disabled.
