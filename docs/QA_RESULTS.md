# QA results — locked homepage

This checklist records source review separately from automated and browser QA. Do not mark a gate as passed without evidence from the current branch or preview.

## Source-level review

- [x] The home page has one H1 with the supplied two-line “Your data. Connected. / Your business. Smarter.” message.
- [x] The supplied section sequence is represented: hero, Stage I, Stage II, living flow, four-step process, services, Rollers Republic concept, about, contact and footer.
- [x] Copy and labels are held in `content/en.ts` and `content/bn.ts`; Bangla remains explicitly pending review.
- [x] Hero visual is the locked scroll-driven particle field (scatter, then a sphere, then a right-side cluster). The eight source labels are Productivity, CRM, Databases, Files, Apps, APIs, Systems and People.
- [x] The field is WebGL2 in `components/home/HomeMotion.tsx`. No Three.js package and no external CDN scripts. The production HTML contains neither Google Fonts nor cdnjs.
- [x] Rollers Republic remains labelled “Concept”; the phone mockup is illustrative and does not claim a live integration.
- [x] Contact form builds a WhatsApp message from the name and need fields; WhatsApp and email contact options are present.
- [x] The fixed status HUD and floating WhatsApp control are implemented; the floating action hides while Contact is in view.
- [x] Reduced-motion CSS covers scroll reveals, the core, phone mockup and ticker; keyboard focus styling and a skip link remain.
- [x] Metadata: title, description, canonical, Open Graph and Twitter card point at `https://hopetheorylabs.vercel.app`; `public/og.png` is a real 1200×630 image in the locked theme. JSON-LD `LocalBusiness` carries the same URL and image.
- [x] No analytics, tracking, cookie banners, fake metrics or testimonials were introduced.

## Automated checks — this branch, 26 October 2026

- [x] `npm run lint`, `npm run typecheck` and `npm run build` pass locally on this branch.
- [x] Vercel preview deployments are created automatically for this branch (project `hopetheorylabs`). They are behind Vercel Deployment Protection, so they require a Vercel login to view.

## Lighthouse — mobile, production build, this branch

Measured with Lighthouse 13.5.0 (mobile emulation, simulated throttling, headless Chrome 156 with software WebGL) against the static export in `out/` served with gzip, which is how Vercel serves it.

| Category | Score |
| --- | --- |
| Performance | 97 |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 100 |

Metrics: First Contentful Paint 0.8 s · Largest Contentful Paint 2.5 s · Total Blocking Time 90 ms · Cumulative Layout Shift 0 · Speed Index 0.9 s.

Weight on first load (gzip): JavaScript 178 KB across nine chunks (about 174 KB is the Next.js/React runtime, about 4 KB is the site's own `HomeMotion`), CSS 5.8 KB, HTML 7 KB. `docs/QA.md` asks for under 120 KB of JavaScript; that is not reachable with the Next.js App Router runtime and is recorded here as a known gap rather than hidden. The WebGL field only starts after the `load` event on an idle callback, caps device pixel ratio at 1.5 on narrow screens, and renders at 30 fps below 800px so it does not compete with first paint.

## Browser checks — headless Chrome on this branch

- [x] Desktop 1440×900 and mobile 390×844: hero, method, flow, steps, services, work and contact. Under 800px only Contact stays in the nav, the flow pills and ticker are hidden, and work stacks.
- [x] Viewport sweep at 360×780, 390×844, 768×1024, 1280×800 and 1920×1080: no horizontal overflow at any width. Below 400px the node labels shrink so the two-row strip under the header has clear gaps between all eight labels.
- [x] Keyboard: Tab order is Skip to content → Approach → Services → Work → Contact → Message us on WhatsApp → Watch it assemble → Learn more → steps 01–04 → View the concept → contact form fields. Every stop shows the 2px focus outline.
- [x] Step 03 sets the connect sentence and is the only `aria-current` step. HUD reads Scattered, Mapping, Flowing, Integrating, then Intelligent.
- [x] Contact form opens `https://wa.me/8801718463471` with the typed name and need. The floating WhatsApp control is removed from the tab order while Contact is in view.
- [x] `prefers-reduced-motion: reduce` leaves the hero line in place with no entrance animation. The 404 page renders a home link and the WhatsApp link.
- [x] No console errors during those passes.
- [ ] Bangla is not on the page. `content/bn.ts` is unused until someone reviews it.
- [ ] Not tested on a physical phone or in Safari. The headless pass uses Chrome only.

## Headers

`vercel.json` adds `Content-Security-Policy` (self only, no external scripts, WhatsApp allowed as a form action), `Strict-Transport-Security`, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy` and `Permissions-Policy`, plus one-year immutable caching for `/_next/static/*`. Confirmed on the Vercel preview deployment for commit `6eadfe7`: the response carries all six headers and is served brotli-compressed. Previews also carry Vercel's own `x-robots-tag: noindex`, which production does not.

## Source limitation

The HTML supplied on 25 October 2026 ended in the middle of its Three.js shader, at the token `vec3`. `components/home/HomeMotion.tsx` finishes that field from the uniforms that did arrive. It is not a verbatim copy of the missing lines.

## Release status

The locked homepage is complete on this branch and passes the gates above. Production (`https://hopetheorylabs.vercel.app`) is deployed automatically from `main`, so it goes live when this branch is merged. That merge, and any change to Vercel Deployment Protection, is Fahad's decision.
