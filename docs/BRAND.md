The locked homepage in `docs/SPEC.md` overrides this file where they disagree. That page uses background `#07090C`, Instrument Sans, Newsreader, and JetBrains Mono, with the gold accent `#B8892F` (plus the warm highlight `#FFBD61`). Teal is retired — see Color.

## Architecture terms (neutral, reviewable)

- "retro" — housing and facade style that includes vintage, wholesale, old Dhaka, and aged/used surfaces. Applied to buildings and surroundings only. Never people, clothing, or products.
- "dark-sky" — ink background (#0F1B2D). It is a visual aid for photographing the surfaces above against. Never black text on dark backgrounds, never pure black.
- "soft-gray" — the paper palette (#E5E7EB / #B0B3BB / #6B7080) used for all secondary and muted text.

## Color

- Navy (ink): #0F1B2D — brand dark, theme colour, dark sections
- Gold: #B8892F — the single accent: buttons, highlights, particles, focus rings, active states. On the near-black site background it passes WCAG AA for text.
- Dark gold: #8A6420 — gold text and links on light (paper) backgrounds. Never use #B8892F for text on light.
- Paper: #F8F6F1 — light surfaces, text on navy
- Slate: #475569 — secondary text on light backgrounds
- **No teal.** Do not reintroduce teal/cyan/mint (#14B8A6, #2DD4BF, #7FD6C2, #0F766E or Tailwind `teal-*`). Before merging, `rg -i "teal|14b8a6|2dd4bf|7fd6c2|0f766e"` must return nothing in app/, components/ and content/.
- Small muted labels on the near-black background must be at least #8B95A3 (≥4.5:1); #56616E and #65707E fail Lighthouse color-contrast.
- One accent color only. If the design starts pulling in a second accent, stop and simplify.

## Typography

- Headings: Space Grotesk 600/700
- Body: Inter 400/600
- Mono labels: system monospace stack (ui-monospace, SFMono-Regular, Menlo, Consolas) — no mono webfont
- Bangla: Hind Siliguri 400/600

## Photography

Urban housing/office/facade context. Present texture, memory, and worn beauty. No people.
