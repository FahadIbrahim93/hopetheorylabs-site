# Status — 27 November 2026

- [#92](https://github.com/FahadIbrahim93/hopetheorylabs-site/pull/92) and [#89](https://github.com/FahadIbrahim93/hopetheorylabs-site/pull/89) merged. Vercel reported production READY at `42d8575bb03423cf8a9b539c4f6e60e1ad9e9503`. Signed-out GETs returned 200 for home, about, services, pricing, contact, the portfolio index, all three case pages, and both API health routes. The health responses identified the chat and lead services.
- One synthetic enquiry reached the production database on 25 November and was removed after verification. Email alerts were inactive at that check. See [production evidence](PRODUCTION_CHECK_2026-11-25.md) and [lead operations](LEAD_OPERATIONS.md). The 27 November check sent GET requests only.
- [#93](https://github.com/FahadIbrahim93/hopetheorylabs-site/pull/93) updates the company-only brand kit. Its first PDF check failed because the CI renderer omitted Bengali glyphs. Review the latest PR checks before merging.
- Remaining launch work includes inbox delivery, real-device QA and the internal [Workflow Lab prototype](FLAGSHIP_DEMO_WORKFLOW_LAB.md). The 1 January 2027 soft launch is a target.

## 23 November baseline

Point-in-time report. **Vercel READY, GitHub CI green and a merged code fix do not establish functioning public API delivery or human QA.** Recheck the latest `main` and exact production deployment before making release claims.

## Current deploy and changes confirmed

- Public address: https://hopetheorylabs.vercel.app ; Vercel project `hopetheorylabs` (Next.js hybrid App Router). The latest inspected production deployment was **READY** for commit `d52aa330fb762e553aec2ec7473cdb50bc5bb60d` with [PR #88](https://github.com/FahadIbrahim93/hopetheorylabs-site/pull/88) deployed; [CI on this commit passed](https://github.com/FahadIbrahim93/hopetheorylabs-site/actions/runs/45065142451). Exact public signed-out route/API responses on that deployment are **not confirmed by this record**.
- [#81](https://github.com/FahadIbrahim93/hopetheorylabs-site/pull/81) **merged 21 Nov**: replaced legacy root Vercel `api/*.ts` (documented HTTP 500 on 20 Nov) with bundled Next `app/api/chat/route.ts` and `app/api/lead/route.ts` handlers; `next.config.ts` no longer uses static `output:export`. [#80](https://github.com/FahadIbrahim93/hopetheorylabs-site/issues/80) remains open pending evidence-backed reconciliation.
- [#85](https://github.com/FahadIbrahim93/hopetheorylabs-site/pull/85) **merged 23 Nov**: approved FDE hero headline and supporting copy.
- [#88](https://github.com/FahadIbrahim93/hopetheorylabs-site/pull/88) **merged 23 Nov**: broad engineering positioning, rendered site/assistant founder-profile privacy policy and separate rate-limit namespaces. Production deployment reports READY, but new API/synthetic-lead acceptance is not recorded.
- [#86](https://github.com/FahadIbrahim93/hopetheorylabs-site/pull/86) was superseded by #88 and closed without merge.
- [#89](https://github.com/FahadIbrahim93/hopetheorylabs-site/pull/89) is an **open draft** for dedicated portfolio index/detail pages; do not represent its work as shipped. It also leaves a known stale “static export” case description for separate follow-up.
- Public business copy presents forward-deployed engineering, custom web/mobile software, AI integration and enterprise systems. AI Audit is optional; managed engineering and package websites are supporting/separate offers. Preserve Instrument brand, exact approved hero and website prices.
- No personal founder profile is approved for the current website/assistant. Historic current print/brand outputs and public Git history still require [#87](https://github.com/FahadIbrahim93/hopetheorylabs-site/issues/87) audit. Do not publish private identities in issue comments or assets.

## Open production and business risks — prioritize

| Priority | Status | Owner issue / evidence |
| --- | --- | --- |
| **P0 — Public routes and APIs** | **Not independently reverified after #81/#88.** Previous production API HTTP 500 is a historical fact, *not a verified current defect.* | [#74](https://github.com/FahadIbrahim93/hopetheorylabs-site/issues/74), historical [#80](https://github.com/FahadIbrahim93/hopetheorylabs-site/issues/80) |
| **P0 — Lead delivery** | Code now reports failed save+email as failure, but real destination and assistant-to-lead behavior remain unverified; WhatsApp contact is a distinct route. | [#75](https://github.com/FahadIbrahim93/hopetheorylabs-site/issues/75) |
| **P1 — Public AI engineering proof** | Public examples are a storefront Concept, Shipped game and Shipped own website; no verified client AI/FDE/enterprise outcome is publicly documented. | [#76](https://github.com/FahadIbrahim93/hopetheorylabs-site/issues/76); draft [#89](https://github.com/FahadIbrahim93/hopetheorylabs-site/pull/89) |
| **P1 — Brand privacy/consent** | Website identity policy implemented in #88, but generated print/PDF assets and lead data notices need review. | [#87](https://github.com/FahadIbrahim93/hopetheorylabs-site/issues/87), [#75](https://github.com/FahadIbrahim93/hopetheorylabs-site/issues/75) |
| **P1 — Human visual/accessibility/real devices** | Historical Chromium and Lighthouse pass, not latest human test signoff. Real WebGL GPU, keyboard/screen reader, Safari/Firefox remain unverified. | [#66](https://github.com/FahadIbrahim93/hopetheorylabs-site/issues/66) |
| **P1 — Documentation/copy drift** | Some current case study and README text says “static export”/`npx serve out` despite hybrid runtime; content fix requires separate focused PR, coordinate with draft #89. | [#90 audit](https://github.com/FahadIbrahim93/hopetheorylabs-site/issues/90) |
| **P1 — Security/config** | Required-check/alerts/secret-target owner settings and live protection/access need review. Do not equate absent alerts with security. | [#67](https://github.com/FahadIbrahim93/hopetheorylabs-site/issues/67) |
| **P2 — Brand presence and localization** | Custom domain/email are owner choices; Bangla website not approved until native reviewed content exists. | [#90](https://github.com/FahadIbrahim93/hopetheorylabs-site/issues/90), optional [#68](https://github.com/FahadIbrahim93/hopetheorylabs-site/issues/68) |

## Historical recorded QA — do not imply retested on 23 Nov

- [20 Nov five-page Lighthouse](https://github.com/FahadIbrahim93/hopetheorylabs-site/actions/runs/44640447740): homepage mobile **92 Performance, 100 Accessibility, 100 Best Practices, 100 SEO**, LCP 1,158 ms, CLS 0.000. `/services`, `/pricing`, `/about` and `/contact` recorded **100/100/100/100** each. Metrics predate recent production changes; new measurements needed.
- [20 Nov responsive Chromium + axe](https://github.com/FahadIbrahim93/hopetheorylabs-site/actions/runs/44615009731): 360/390/768/1440/1920 px tested with no detected horizontal overflow, JS errors or axe violations in that run. Tests do not prove full screen-reader accessibility or actual GPU motion quality.
- Full evidence, dated baselines and limitations: [QA_RESULTS.md](QA_RESULTS.md).

## Project and governance

- **Launch-quality epic:** [#90](https://github.com/FahadIbrahim93/hopetheorylabs-site/issues/90); detailed [audit/10-10 plan](LAUNCH_READINESS_AUDIT_2026-11-23.md); ordered implementation [ROADMAP.md](ROADMAP.md); focused sprint coordination [#77](https://github.com/FahadIbrahim93/hopetheorylabs-site/issues/77).
- Repo default is `main`; merges deploy to Vercel production. **Owner approval is required** before merges, synthetic production submissions, branch deletion, account/security settings and DNS changes.
- English-only public website; chat may respond in Bangla. No approved public Bangla website toggle.
- Public pricing: Starter ৳10,000 / Counter ৳25,000 / Showroom ৳45,000. Engineering and AI audits are quoted per scope; do not publish invented range, offer or customer outcomes.
- Branch history and settings housekeeping: [#67](https://github.com/FahadIbrahim93/hopetheorylabs-site/issues/67). Do not treat historic branch counts as current without recounting.
- Historical repositioning coordination: [#42](https://github.com/FahadIbrahim93/hopetheorylabs-site/issues/42) / [#43](https://github.com/FahadIbrahim93/hopetheorylabs-site/issues/43). Rendered copy shipped; collateral audit still open.
