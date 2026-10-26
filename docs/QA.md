# QA — Hope Theory Labs website

Use this checklist on the **production** URL (`https://hopetheorylabs.vercel.app`) or the latest Vercel preview before calling a release done. Record scores and pass/fail in [QA_RESULTS.md](QA_RESULTS.md).

## Visual and brand (docs/DESIGN_RULES.md)

- [ ] Background `#07090C`, off-white `#EEF0F2`, muted `#A3ACB8`, hairline `#2A323D`, teal `#7FD6C2`, amber `#FFBD61`
- [ ] Instrument Sans (UI/body), Newsreader (headings), JetBrains Mono (labels); Hind Siliguri when Bangla is active
- [ ] Editorial type, asymmetric layout, hairline rules, small uppercase labels — no centered-everything sections
- [ ] One persistent full-viewport WebGL scene (or SVG/canvas fallback); copy in a single legible column
- [ ] Rollers Republic labelled **Concept**; speed slider **Illustrative only** with no numbers
- [ ] No purple/blue gradients, glassmorphism, emoji, stock 3D blobs, generic icon grids, fake stats, reviews, logos or credentials

## Copy and conversion

- [ ] All visible strings from `content/en.ts` / `content/bn.ts` only
- [ ] WhatsApp links use `https://wa.me/8801718463471`; email `hopetheorybd@gmail.com` where shown
- [ ] Primary CTA path to WhatsApp is obvious (hero, contact, floating button hides over contact)

## Motion and WebGL

- [ ] Scroll drives narrative progress (HUD: Scattered / Structured / Alive); no scroll hijacking or pinning
- [ ] Flow section: eight node labels keyboard-focusable; tap/click triggers burst where designed
- [ ] `?experience=fallback` shows static core without WebGL chunk errors
- [ ] `prefers-reduced-motion`: no continuous WebGL loop; intro/cursor suppressed; content readable
- [ ] Page readable with JavaScript disabled (static HTML from export)

## Accessibility

- [ ] One H1; skip link; landmarks; body text ≥15px; contrast ≥4.5:1 (WCAG AA)
- [ ] Visible 2px focus ring on interactive controls; touch targets ≥44px on mobile nav
- [ ] Timeline/steps operable by keyboard with clear focus; `aria-current` where applicable

## i18n

- [ ] EN / বাংলা toggle switches copy, sets `html lang`, persists in `localStorage`
- [ ] Bangla copy flagged for Fahad/Tamim review before marketing launch

## SEO and meta

- [ ] Canonical, Open Graph, Twitter card, `theme-color` `#07090C`
- [ ] `public/robots.txt`, `public/sitemap.xml`, `public/og.png` (1200×630)
- [ ] JSON-LD `ProfessionalService` without ratings or reviews
- [ ] Branded `app/not-found.tsx` and `app/icon.svg`

## Performance (mobile Lighthouse)

Target from original step issues: **90+** in all four categories when feasible.

- [ ] Performance, Accessibility, Best Practices, SEO scores recorded
- [ ] CLS ideally **< 0.1** (fixed WebGL layer should not shift document flow)
- [ ] LCP is hero text or other above-the-fold copy
- [ ] No console errors on load and basic interaction
- [ ] Spot-check widths: **360**, **768**, **1280**, **1920** px

## Build and deploy

- [ ] `npm run lint`, `npm run typecheck`, `npm run build` pass
- [ ] Static export in `out/`; `vercel.json` security headers present
- [ ] Production deploy on `main` matches expected commit (Vercel dashboard)

## Final checklist (sign-off)

- [ ] Reviewer name and date in QA_RESULTS.md
- [ ] Known gaps filed as GitHub issues (not hidden)
- [ ] Fahad approves production promotion / custom domain if changing from default Vercel URL
