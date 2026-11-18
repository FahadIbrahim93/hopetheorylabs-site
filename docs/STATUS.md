# Status — 18 November 2026

Snapshot of `main` at `9cc0a14`. Written from the code, git history, CI runs and the live site on this date.

## What is live

https://hopetheorylabs.vercel.app serves `main`. The home page and `/about`, `/services`, `/pricing` and `/contact` all return 200.

- AI-first copy: the hero reads "Find where AI pays off. Then we build it with you." The AI Audit leads, then forward-deployed AI engineering. Web and software are supporting work.
- Instrument brand: H-T-L monogram in the header, new icons, manifest and Open Graph image, and the brand kit in `brand/`.
- The pricing page opens with the AI Audit and forward-deployed work ("quoted per scope after discovery", no audit price). The website packages (Starter ৳10,000, Counter ৳25,000, Showroom ৳45,000) sit below as a separate offer.
- Footer links to https://x.com/HopeTheoryLabs. Contact email is hopetheorylabs@gmail.com. Every WhatsApp link opens with a prefilled message, and the contact form fills in the visitor's answers.
- Floating site assistant with a scripted FAQ. Live AI replies and lead capture only work if the Vercel env vars are set; that is not verifiable from the repo (see #67).

## Recent work

| PR | Date | What |
| --- | --- | --- |
| [#63](https://github.com/FahadIbrahim93/hopetheorylabs-site/pull/63) | 18 Nov | Side rail no longer overlaps the hero labels at wide widths; WhatsApp prefill |
| [#61](https://github.com/FahadIbrahim93/hopetheorylabs-site/pull/61) | 18 Nov | Instrument identity and AI-first copy |
| [#62](https://github.com/FahadIbrahim93/hopetheorylabs-site/pull/62) | 18 Nov | Next.js 16.4.6 (security advisory) |
| [#60](https://github.com/FahadIbrahim93/hopetheorylabs-site/pull/60) | 17 Nov | CI accessibility gate |
| [#59](https://github.com/FahadIbrahim93/hopetheorylabs-site/pull/59), [#53](https://github.com/FahadIbrahim93/hopetheorylabs-site/pull/53) | 17 Nov | Design tokens renamed; contrast, intro flash and section rhythm |
| [#51](https://github.com/FahadIbrahim93/hopetheorylabs-site/pull/51), [#52](https://github.com/FahadIbrahim93/hopetheorylabs-site/pull/52) | 16 Nov | Repositioned homepage, nav, services and founder; locked colour roles and fonts |

## Open pull requests

None, apart from this docs PR.

## Checks

- On 18 Nov 2026: `npm run lint`, `typecheck`, `test` and `build` pass locally. CI on `main` is green. `npm audit --omit=dev` reports 0 vulnerabilities.
- Required check: `lint-typecheck-build`. `a11y-playwright-axe` runs but is not required.
- GitHub Dependabot alerts are disabled on this repo, so GitHub shows no advisories either way (#67).
- `Supabase Preview` is skipped because the free Supabase plan is full. Not required.

## Known gaps

- The brand book PDF still carries the old positioning on pages 2, 4, 16, 21 and 22 ([#64](https://github.com/FahadIbrahim93/hopetheorylabs-site/issues/64)).
- The brand kit has five service icons and the site lists six services; there is no AI Audit icon ([#65](https://github.com/FahadIbrahim93/hopetheorylabs-site/issues/65)).
- `docs/QA_RESULTS.md` dates from 26 Oct 2026, before the rebrand ([#66](https://github.com/FahadIbrahim93/hopetheorylabs-site/issues/66)).
- Twenty remote branches are left besides `main`: 14 fully merged, and 6 squash-merged or superseded that need a diff check first. Deleting them needs Fahad's OK ([#67](https://github.com/FahadIbrahim93/hopetheorylabs-site/issues/67)).
- The site is English only; the Bangla toggle was removed in #56.

## Security alerts

None known. Next.js is at 16.4.6.

## Issue board

[#42](https://github.com/FahadIbrahim93/hopetheorylabs-site/issues/42) (epic) and [#43](https://github.com/FahadIbrahim93/hopetheorylabs-site/issues/43) (founder sign-off) are still open and wait on Fahad. #44 is closed.
