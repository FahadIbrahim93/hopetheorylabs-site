# Final QA results — 25 Oct 2026

This record separates source-level checks from browser/CI checks. Do not treat unmeasured items as passing.

## Source-level review

- [x] One H1 in the home hero is present in `components/Hero.tsx`; 404 has its own H1 in `app/not-found.tsx`.
- [x] Skip link is present in `components/PageShell.tsx`.
- [x] Global 2px `:focus-visible` outline is defined in `app/globals.css`.
- [x] Header menu summary and shared WhatsApp CTA use a minimum 44px height/width target.
- [x] Reduced-motion rules disable CSS reveal/CTA/timeline motion; the canvas checks `prefers-reduced-motion`.
- [x] Rollers Republic copy and the speed slider's illustrative-only label are maintained in the content/components; do not add numeric claims.
- [x] SEO metadata, Open Graph image, robots.txt and sitemap.xml are included by Step 6.
- [x] Branded 404 and HT icon are included by Step 8.
- [x] No analytics, tracking scripts or cookie banner were introduced in these steps.

## Still requires CI / preview access — not claimed as passed

- [ ] `npm run lint`, `npm run typecheck`, `npm run build` on the final merged chain.
- [ ] Lighthouse mobile scores of 90+ in Performance, Accessibility, Best Practices and SEO on the Vercel preview.
- [ ] First-load JavaScript gzip size under 120 KB and total first-load page weight under 500 KB, measured from a production build.
- [ ] CLS below 0.1 and confirmation that the H1 is the LCP element.
- [ ] Visual inspection at 360px, 768px, 1280px and 1920px; keyboard-only and screen-reader spot checks; browser console review.
- [ ] Verify EN/Bangla toggle persistence and review the Bangla translation with Fahad/Tamim before launch.
- [ ] Confirm the Vercel preview is green for the final merged chain.

## Status

This is a source-level checklist, not a claim of complete release QA. The repository connector can edit and inspect source files but did not provide a browser session or local Node build in this workflow. Run the unchecked items on the final preview before approving production promotion.
