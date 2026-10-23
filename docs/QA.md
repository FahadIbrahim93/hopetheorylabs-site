# QA — the bar every PR must meet

## Hard gates

- **CI green**: `npm run lint`, `npm run typecheck`, `npm run build` all pass.
- **Lighthouse mobile 90+** in Performance, Accessibility, Best Practices and SEO (Chrome DevTools → Lighthouse → Mobile, on the Vercel preview URL). Paste the four scores in the PR.
- **WCAG AA**: contrast (see BRAND.md pairs; `#0F766E` for links on light, never `#14B8A6` text on light), one H1, semantic landmarks, skip link, visible 2px focus rings, tap targets ≥ 44px, alt text, descriptive link text, slider and timeline keyboard operable.
- **Reduced motion**: with `prefers-reduced-motion: reduce` (DevTools → Rendering → Emulate CSS media feature) there is no particle motion, tilt or magnetic pull, and reveals are instant. Page fully readable with JS disabled.

## Final checklist (from SPEC Step 9)

- [ ] Copy matches content files exactly; no invented stats, logos, reviews, credentials.
- [ ] Rollers Republic labelled "Concept"; speed slider labelled "Illustrative only" with no numbers.
- [ ] No purple/blue gradients, glassmorphism, emoji, 3D blobs, generic icon grids, identical card rows, centered-everything sections.
- [ ] Asymmetric grid, mono section labels, hairline rules, teal used sparingly.
- [ ] Only one signature interaction (hero grid); all easing cubic-bezier(0.16,1,0.3,1) at 400–700ms.
- [ ] prefers-reduced-motion: no motion; page fully readable with JS disabled.
- [ ] Keyboard: skip link, visible focus on every control, timeline and slider operable.
- [ ] WCAG AA contrast; #0F766E for links on light backgrounds.
- [ ] All WhatsApp links open https://wa.me/8801718463471; email link works.
- [ ] EN/Bangla toggle works and persists; lang attribute updates.
- [ ] Lighthouse mobile 90+ in all four categories; first-load JS under 120 KB gzipped; CLS under 0.1.
- [ ] No tracking, analytics or cookies; no console errors.
- [ ] 404 page, favicon, OG image, robots.txt, sitemap.xml present.
- [ ] Looks good at 360px, 768px, 1280px and 1920px widths.
