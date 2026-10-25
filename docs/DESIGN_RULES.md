# Design Rules — Hope Theory Labs

The supplied Hope Theory Labs HTML concept is the primary visual reference. Preserve its identity when changing implementation.

## Visual language
- Near-black #07090C, off-white #EEF0F2, muted #A3ACB8, hairline #2A323D, teal #7FD6C2, amber #FFBD61.
- Instrument Sans for body/UI; Newsreader for editorial headings; JetBrains Mono for technical labels; Hind Siliguri for Bangla.
- Oversized editorial type, asymmetric grids, wide whitespace, fine rules and small uppercase labels.
- Keep the original narrative: digital self → intelligence shift → living flow → how it works → services → work concept → about → contact.
- The central visual is the custom wireframe/radar intelligence core. The 2D particle field supports it; it is not a competing interaction.
- Retain the phone mockup animation and the fixed system-state HUD. Floating WhatsApp disappears over Contact.
- Rollers Republic must always be labelled “Concept”. Never invent performance claims, reviews, client logos, credentials or deployed integrations.

## Motion and accessibility
- Slow, purposeful motion only. Use easing cubic-bezier(0.16,1,0.3,1) and mostly 400–900ms transitions.
- Respect prefers-reduced-motion: no continuous animation or tilt; content remains visible and controls remain usable.
- Semantic sections, one H1, skip link, 2px visible focus ring, 44px minimum touch targets, accessible names and keyboard navigation.
- Use CSS/SVG for the wireframe core; do not add Three.js, WebGL frameworks, external animation libraries or CDN scripts.
- No analytics, tracking, cookies, fake metrics, purple/blue gradients, stock 3D blobs, glassmorphism, emoji, generic card grids or urgency copy.
- All visible text belongs in content/en.ts and content/bn.ts. Bangla must be reviewed by Fahad/Tamim before launch.
