# QA results — supplied HTML port

This checklist records source review separately from automated and browser QA. Do not mark a gate as passed without evidence from the current branch or preview.

## Source-level review

- [x] The home page has one H1 with the supplied two-line “Your data. Connected. / Your business. Smarter.” message.
- [x] The supplied section sequence is represented: hero, Stage I, Stage II, living flow, four-step process, services, Rollers Republic concept, about, contact and footer.
- [x] Copy and labels are held in `content/en.ts` and `content/bn.ts`; Bangla remains explicitly pending review.
- [x] Hero visual uses the reusable inline-SVG intelligence core, including wireframe sphere, orbit/radar motion, signal routes and eight source nodes.
- [x] The particle field remains a lightweight canvas; no Three.js or external CDN scripts were added.
- [x] Rollers Republic remains labelled “Concept”; the phone mockup is illustrative and does not claim a live integration.
- [x] Contact form builds a WhatsApp message from the name and need fields; WhatsApp and email contact options are present.
- [x] The fixed status HUD and floating WhatsApp control are implemented; the floating action hides while Contact is in view.
- [x] Reduced-motion CSS covers scroll reveals, the core, phone mockup and ticker; keyboard focus styling and a skip link remain.
- [x] Metadata reflects the supplied concept, including the dark theme color and current business description.
- [x] No analytics, tracking, cookie banners, fake metrics or testimonials were introduced.

## Automated checks — pending current branch

- [ ] `npm run lint`
- [ ] `npm run typecheck`
- [ ] `npm run build`
- [ ] Confirm the Vercel preview succeeds.

## Browser / release gates — not yet verified

- [ ] Inspect at 360px, 768px, 1280px and 1920px widths.
- [ ] Check keyboard navigation, form submission, mobile menu, language persistence and browser console.
- [ ] Check reduced-motion behavior and that all copy remains visible.
- [ ] Run mobile Lighthouse for Performance, Accessibility, Best Practices and SEO; target 90+ in each.
- [ ] Measure first-load JavaScript, page weight and CLS from a production build.
- [ ] Review Bangla copy with Fahad/Tamim before launch.

## Source limitation

The HTML supplied on 25 October 2026 ended in the middle of its Three.js shader. The visual behavior was reconstructed in the existing Next.js stack using SVG/CSS and the lightweight canvas rather than copying the missing shader verbatim.

## Release status

Not production-ready until the automated checks and browser/release gates above are verified. Production promotion remains on hold until Fahad explicitly approves.
