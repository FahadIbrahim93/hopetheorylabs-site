# Brand

These are the locked colour and type tokens for the Hope Theory Labs site. They were confirmed in writing on 16 November 2026 (issue #48). Do not migrate the palette.

The live page and `docs/DESIGN_RULES.md` already follow this system. Where an older note in this file disagreed, this page is now the source of truth for colour and typography. Layout and page sequence remain in `docs/SPEC.md`.

## Colour

- **Page background:** near-black `#07090C`. Body text on that ground is off-white `#EEF0F2`. Muted labels and secondary copy use `#A3ACB8`, and must stay at or above `#8B95A3` (the 4.5:1 floor). Hairlines use `#2A323D`.
- **Navy `#0F1B2D`:** cards, panels, pricing surfaces, and the browser theme colour only. It is not the page background.
- **Gold `#B8892F`:** the single accent — buttons, highlights, particles, focus rings and active states. On the near-black page it passes WCAG AA for text.
- **Dark gold `#8A6420`:** gold text and links on light (paper) backgrounds, exposed in CSS as `--color-gold-dark`. Never use `#B8892F` for text on light surfaces.
- **Paper `#F8F6F1`:** light surfaces, and text on navy.
- **Slate `#475569`:** secondary text on light backgrounds.
- **No teal.** Do not reintroduce teal, cyan or mint (`#14B8A6`, `#2DD4BF`, `#7FD6C2`, `#0F766E`, or Tailwind `teal-*`). Before merging, `rg -i "teal|14b8a6|2dd4bf|7fd6c2|0f766e"` must return nothing in `app/`, `components/` and `content/`.
- One accent only. If a design starts pulling in a second accent, stop and simplify. The warmer highlight `#FFBD61` is a legacy exception, not a second brand colour.
- Do not introduce metallic silver, champagne, or a new master mark as a substitute for this system.

## Typography

The fonts actually loaded on the site, and the pair to use going forward:

- **Headings:** Newsreader (editorial serif), including the hero heading.
- **Body and UI:** Instrument Sans.
- **Mono labels:** the system monospace stack (`ui-monospace`, SFMono-Regular, Menlo, Consolas) — no mono webfont.
- **Bangla:** Hind Siliguri 400/600.

Do not load or document Inter or Space Grotesk. Load the weights the CSS actually uses, rather than relying on a synthetic bold.

## Architecture terms (neutral, reviewable)

- "retro" — housing and facade style that includes vintage, wholesale, old Dhaka, and aged or used surfaces. Applied to buildings and surroundings only. Never people, clothing, or products.
- "dark-sky" — navy `#0F1B2D`, used as a surface aid for cards, panels and photography backdrops. Never the page background, never black text on dark backgrounds, never pure black.
- "soft-gray" — a paper-grey scale (`#E5E7EB` / `#B0B3BB` / `#6B7080`) used in photography references. It is not the muted text token on the site; use `#A3ACB8` there.

## Photography

Urban housing, office and facade context. Present texture, memory, and worn beauty. No people.
