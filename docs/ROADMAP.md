# Roadmap — 23 November 2026

**Source of truth:** [Evidence-backed launch-readiness audit](LAUNCH_READINESS_AUDIT_2026-11-23.md) and [#90 launch epic](https://github.com/FahadIbrahim93/hopetheorylabs-site/issues/90). This roadmap tracks **remaining** work, not automatically authorized production work. Read [STATUS.md](STATUS.md), the live issue/PR state, and `main` before choosing a task.

**Priority principle:** make production customer contact demonstrably reliable before declaring the site ready; then validate claims, complete real-device QA, publish reproducible engineering proof, and polish the external presence. Keep the approved hero and Instrument system.

## Now — production/contact blockers (P0)

| Order | Work | Dependency / acceptance | Owner |
| --- | --- | --- | --- |
| 1 | [#74](https://github.com/FahadIbrahim93/hopetheorylabs-site/issues/74) Anonymous production/API health preflight | Exact production SHA, five site routes as real HTML and `/api/chat` / `/api/lead` as 200 expected JSON; distinguish Vercel READY from verified reachability | Engineering, read-only |
| 2 | [#75](https://github.com/FahadIbrahim93/hopetheorylabs-site/issues/75) Enquiry pipeline correctness and delivery | After #74; offline failure-path tests, truthful save/notify status, owner-approved **single synthetic** end-to-end submission or owner-approved verified WhatsApp-only fallback | Engineering + owner |
| 3 | [#80](https://github.com/FahadIbrahim93/hopetheorylabs-site/issues/80) Reconcile historical API 500 report | [#81](https://github.com/FahadIbrahim93/hopetheorylabs-site/pull/81) **merged** the Next route-handler fix; close or re-scope after #74 production verification, not based on source alone | Engineering reviewer |

## Next — truth, safety, release-quality (P1)

| Order | Work | Dependency / acceptance | Owner |
| --- | --- | --- | --- |
| 4 | [#87](https://github.com/FahadIbrahim93/hopetheorylabs-site/issues/87) Audit distributed brand/print PDF identities and regenerate if needed | Public identity policy [#43](https://github.com/FahadIbrahim93/hopetheorylabs-site/issues/43); review actual assets, generators, rendered PDF and publishing surfaces | Brand + owner |
| 5 | Copy/architecture accuracy: remove current “static export” case claim, stale `npx serve out` instructions; correct docs drift | Coordinate with [draft PR #89](https://github.com/FahadIbrahim93/hopetheorylabs-site/pull/89) because it edits case pages/copy. Dedicated small PR, no unreviewed brand/offer changes | Engineering/copy |
| 6 | Review **supporting** FDE hero copy and conversion hierarchy; make AI Audit optional and website packages visibly separate | Preserve exact headline, brand, pricing and no-public-founder rules in canonical [SPEC.md](SPEC.md) | Owner + UX |
| 7 | [#66](https://github.com/FahadIbrahim93/hopetheorylabs-site/issues/66) New production route-by-route responsive, WebGL, cross-browser and accessibility sign-off | Real phone/GPU, Safari/Firefox, keyboard/screen reader, 360–1920 px, latest-build Lighthouse ≥90 in each category, CLS <0.1 | Engineering + manual reviewer |
| 8 | [#67](https://github.com/FahadIbrahim93/hopetheorylabs-site/issues/67) Owner-only CI, alerting, Vercel and repository controls | Check required gates, security alerts, env names/targets, deployment protection and rollback; never print or share values | Owner |

## Prove the business — before elite enterprise marketing claims (P1)

| Order | Work | Dependency / acceptance | Owner |
| --- | --- | --- | --- |
| 9 | Review and complete [draft #89](https://github.com/FahadIbrahim93/hopetheorylabs-site/pull/89): `/work` and case detail pages | Branch CI plus honest Concept/Shipped status, links and accessibility. Draft is **not shipped** | Reviewer + owner |
| 10 | [#76](https://github.com/FahadIbrahim93/hopetheorylabs-site/issues/76) HTL Workflow Lab internal engineering proof | Synthetic invoices → extraction/validation → mock cross-check → human approval → auditable result; test/evaluation artifacts; no invented real client | Engineering |
| 11 | Validate two lead journeys (bespoke FDE/AI/software vs fixed-price websites); add real, consented case evidence **only when available** | Human buyer validation; no analytics/tracking without separately approved privacy design | Product + owner |

## Later — polish and optional work (P2)

- Branded domain and company-domain email: owner chooses and approves any purchase/DNS changes; verify HTTPS, canonical, sitemap, SPF/DKIM/DMARC and deliverability before launch.
- [#68](https://github.com/FahadIbrahim93/hopetheorylabs-site/issues/68) Optional Bangla site: only after reviewed Bangla copy, font/visual accessibility QA; do not present as a current launch blocker.
- [#42](https://github.com/FahadIbrahim93/hopetheorylabs-site/issues/42) Historical positioning epic: reconcile after [#43](https://github.com/FahadIbrahim93/hopetheorylabs-site/issues/43) verified production/collateral completion; do not reopen shipped design.
- [#77](https://github.com/FahadIbrahim93/hopetheorylabs-site/issues/77) 23 Nov–4 Dec sprint remains a timeboxed coordination record. [#90](https://github.com/FahadIbrahim93/hopetheorylabs-site/issues/90) is the quality umbrella, **not a duplicate implementation backlog**.

## Completed implementation (not selectable unfinished work)

- [PR #81](https://github.com/FahadIbrahim93/hopetheorylabs-site/pull/81) — Next route-handler migration **merged** (production endpoints must still be verified).
- [PR #85](https://github.com/FahadIbrahim93/hopetheorylabs-site/pull/85) — approved FDE hero update **merged**.
- [PR #88](https://github.com/FahadIbrahim93/hopetheorylabs-site/pull/88) — broad engineering positioning, public rendered identity guard and separated lead/chat rate limits **merged and observed as Vercel READY** at `d52aa33`. Not equivalent to complete lead e2e acceptance.
- [PR #70](https://github.com/FahadIbrahim93/hopetheorylabs-site/pull/70) — brand/book icon fixes and repeatable live QA merged; [#64](https://github.com/FahadIbrahim93/hopetheorylabs-site/issues/64) and [#65](https://github.com/FahadIbrahim93/hopetheorylabs-site/issues/65) resolved.
- Recorded [20 Nov five-page Lighthouse](https://github.com/FahadIbrahim93/hopetheorylabs-site/actions/runs/44640447740): homepage 92/100/100/100 and secondary routes 100/100/100/100. Historical evidence only; manual sign-off still pending #66.

## Issue/PR workflow

Each implementation task must have a focused issue, separate PR, tests, evidence, risk/rollback note and owner approval before merge. Do **not** merge the audit-only PR as permission to start risky tasks. Update [QA_RESULTS.md](QA_RESULTS.md), [STATUS.md](STATUS.md), and evidence after actual production verification, not from assumptions.
