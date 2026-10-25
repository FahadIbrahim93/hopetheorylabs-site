# Design rules — the site must not look AI-generated

Feel references: linear.app, vercel.com, stripe.com, rauno.me. Calm, elegant, enterprise-grade. Content always wins over effects.

## Banned

- Purple/blue gradients.
- Glassmorphism (anywhere as a style).
- Stock 3D blobs or external 3D libraries. A bespoke inline-SVG wireframe intelligence core is allowed because it is the supplied brand visual.
- Emoji in the UI.
- Generic 3-feature icon grids; identical rounded cards in rows.
- Centered-everything layouts.
- The default shadcn/Tailwind look.
- Buzzword copy ("Unlock the power of AI", "revolutionary", "seamless", etc.).
- Fake stats, logos, reviews, testimonials, credentials.

## Do

- Editorial, asymmetric 12-column grid with generous whitespace (e.g. heading spans 7 columns, body starts at column 8).
- Strong type hierarchy: huge, tight-tracked Space Grotesk headings (-0.03em), Inter body, small uppercase JetBrains Mono section labels (`01 / HOW IT WORKS`).
- Restrained palette: ink, paper, teal as one sparing accent (see BRAND.md).
- 1px hairline rules between sections instead of boxes and shadows.
- 8px spacing scale. Crisp 2px teal focus rings with offset.
- Real product shots only: Rollers Republic concept screenshots in simple device frames, labelled "Concept". Never fake them; if missing, ask in the issue.
- Polished 404 (same grid, short human line, links Home and WhatsApp). Custom "HT" monogram favicon.

## Motion

- Few, purposeful animations. Easing `cubic-bezier(0.16, 1, 0.3, 1)` (`[0.16, 1, 0.3, 1]`), durations 400–700ms.
- ONE signature interaction: the custom intelligence core's slow radar/orbit motion and subtle pointer response. The particle field remains low-contrast and non-interactive.
- Magnetic CTA (max 4px) and card tilt (max 3°, no glow) are optional, desktop-only; drop them if they look showy.
- Scroll reveals: fade + 12px rise, once per element.
- Framer Motion only via `LazyMotion` + `domAnimation` + `m` components.
- `prefers-reduced-motion`: no particle motion, no tilt or magnetic pull, reveals instant.

## Performance budget

- First-load JS < 120 KB gzipped; particle field < 8 KB, no libraries; total first load < 500 KB.
- LCP is the H1 text; CLS < 0.1 (reserve space for the phone mockup).
- No tracking, analytics, cookies or external scripts.
