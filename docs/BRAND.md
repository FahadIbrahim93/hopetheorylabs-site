# Brand

These are the locked colour and type tokens for the Hope Theory Labs site. They were confirmed in writing on 16 November 2026 (issue #48). Do not migrate the palette.

The brand identity built on this palette (direction "Instrument", November 2026) adds the H-T-L monogram, the brand kit in `brand/` and the rules below. The full brand book is `brand/guidelines/HTL-Brand-Guidelines.pdf`; the kit index is `brand/README.md`.

The live page and `docs/DESIGN_RULES.md` already follow this system. Where an older note in this file disagreed, this page is now the source of truth for colour and typography. Layout and page sequence remain in `docs/SPEC.md`.

## Colour

- **Page background:** near-black `#07090C`. Body text on that ground is off-white `#EEF0F2`. Muted labels and secondary copy use `#A3ACB8`, and must stay at or above `#8B95A3` (the 4.5:1 floor). Hairlines use `#2A323D`. Control and input borders use `#6B7685` (3:1 or better on the page, the input ground and navy; it replaced `#5B6675`, which measured 2.96:1 on navy).
- **Navy `#0F1B2D`:** cards, panels, pricing surfaces, and the browser theme colour only. It is not the page background.
- **Gold `#B8892F`:** the single accent — buttons, highlights, particles, focus rings and active states. On the near-black page it passes WCAG AA for text.
- **Dark gold `#8A6420`:** gold text and links on light (paper) backgrounds, exposed in CSS as `--color-gold-dark`. Never use `#B8892F` for text on light surfaces.
- **Paper `#F8F6F1`:** light surfaces, and text on navy.
- **Slate `#475569`:** secondary text on light backgrounds.
- **No teal.** Do not reintroduce teal, cyan or mint (`#14B8A6`, `#2DD4BF`, `#7FD6C2`, `#0F766E`, or Tailwind `teal-*`). Before merging, `rg -i "teal|14b8a6|2dd4bf|7fd6c2|0f766e"` must return nothing in `app/`, `components/` and `content/`.
- One accent only. If a design starts pulling in a second accent, stop and simplify. The warmer highlight `#FFBD61` is a legacy exception, not a second brand colour.
- Do not introduce metallic silver or champagne. The only master mark is the H-T-L monogram (see Identity); the chrome "Concept 4" render, the "HTC" name and `htc-monogram-flat.svg` are retired.

## Typography

The fonts actually loaded on the site, and the pair to use going forward:

- **Headings:** Newsreader (editorial serif), including the hero heading.
- **Body and UI:** Instrument Sans.
- **Mono labels:** the system monospace stack (`ui-monospace`, SFMono-Regular, Menlo, Consolas) — no mono webfont.
- **Bangla:** the site copy is English-only. The language toggle and its webfont were removed until the copy is translated and reviewed; do not add a Bangla webfont without the copy. The chat assistant still replies in Bangla when a visitor writes in Bangla.

Do not load or document Inter or Space Grotesk. Load the weights the CSS actually uses, rather than relying on a synthetic bold.

## Architecture terms (neutral, reviewable)

- "retro" — housing and facade style that includes vintage, wholesale, old Dhaka, and aged or used surfaces. Applied to buildings and surroundings only. Never people, clothing, or products.
- "dark-sky" — navy `#0F1B2D`, used as a surface aid for cards, panels and photography backdrops. Never the page background, never black text on dark backgrounds, never pure black.
- "soft-gray" — a paper-grey scale (`#E5E7EB` / `#B0B3BB` / `#6B7080`) used in photography references. It is not the muted text token on the site; use `#A3ACB8` there.

## Photography

Urban housing, office and facade context. Present texture, memory, and worn beauty. No people.

## Identity

- **Monogram:** an H-T-L ligature on a 120-unit grid, one 16-unit stroke, 90° corners, with a 16 × 16 gold tip at the end of the L. The geometry is in `components/BrandMark.tsx` and `brand/_source/brandlib.py`; never redraw it by hand.
- **Files:** `brand/logo/` holds the monogram, horizontal and stacked lockups and wordmark in `light` (on the page and navy), `dark` (on paper and white) and one-colour `mono-black` / `mono-white` versions, as SVG with PNG exports. The wordmark is Instrument Sans SemiBold, all caps, tracked +0.22em, converted to outlines.
- **Site:** the header shows the monogram with the caps wordmark (`.site-wordmark`). Favicons are `app/icon.svg` (32 px cut), `app/favicon.ico` (pixel-fitted 16 px cut), `app/apple-icon.png`; the manifest icons are in `public/icons/`. The Open Graph image is `public/og.png`.
- **Clear space:** two strokes (27% of the mark's height) on every side. **Minimum size:** 24 px / 8 mm for the monogram; use the favicon cuts below 24 px. Horizontal lockup at least 160 px / 35 mm wide.
- **Never:** bevel, chrome, glow, gradient, outline, rotate, stretch or recolour the mark; never move the gold tip or use a second accent in it.
- **Status labels:** every project, demo and case study is labelled Concept, In progress or Shipped.

## Rebuilding the brand kit

`python3 brand/_source/build_assets.py`, `build_print.py` and `build_tokens.py` regenerate every logo, icon, social, GitHub, print and token file from one source. They need Python 3 with `fonttools`, `uharfbuzz` and `Pillow`, `rsvg-convert` and `qpdf`, and the OFL font files named in `brand/_source/brandlib.py` (set `HTL_FONTS` to their folder). Commit the regenerated files with the script change.
