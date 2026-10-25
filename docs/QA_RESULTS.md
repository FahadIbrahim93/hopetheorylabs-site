# QA results — supplied HTML port

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
- [x] Metadata reflects the supplied concept, including the dark theme color and current business description.
- [x] No analytics, tracking, cookie banners, fake metrics or testimonials were introduced.

## Automated checks — this branch, 26 October 2026

- [x] `npm run lint`, `npm run typecheck` and `npm run build` passed locally on this branch before the pull request. GitHub Actions has not been rechecked yet.
- [ ] Vercel preview is created by the pull request. It was not available when these notes were written.

## Browser checks — headless Chrome on this branch

- [x] Desktop 1440×900 and mobile 390×844: hero, method, flow, steps, services, work and contact. Under 800px only Contact stays in the nav, the flow pills and ticker are hidden, and work stacks.
- [x] Step 03 sets the connect sentence and is the only `aria-current` step. HUD reads Scattered, Mapping, Flowing, Integrating, then Intelligent.
- [x] Contact form opens `https://wa.me/8801718463471` with the typed name and need. The floating WhatsApp control is removed from the tab order while Contact is in view.
- [x] `prefers-reduced-motion: reduce` leaves the hero line in place with no entrance animation. The 404 page renders a home link and the WhatsApp link.
- [x] No console errors during that headless pass.
- [ ] Not a full keyboard audit, and not checked at 360, 768, 1280 or 1920.
- [ ] Lighthouse mobile scores were not measured on this pass.
- [ ] Bangla is not on the page. `content/bn.ts` is unused until someone reviews it.

## Source limitation

The HTML supplied on 25 October 2026 ended in the middle of its Three.js shader, at the token `vec3`. `components/home/HomeMotion.tsx` finishes that field from the uniforms that did arrive. It is not a verbatim copy of the missing lines.

## Release status

The locked homepage is in place on this branch. Production promotion still waits for Fahad. Lighthouse and the wider viewport pass are still open.
