# Brand

These are the locked colour and type tokens for the Hope Theory Labs site. They were confirmed in writing on 16 November 2026 (issue #48). Do not migrate the palette.

Fahad approved the "Instrument" identity in November 2026, so the earlier rule against a new master mark no longer applies. The identity adds the H-T-L monogram, the brand kit in `brand/` and the rules below. The palette itself is unchanged. The full brand book is `brand/guidelines/HTL-Brand-Guidelines.pdf`; the kit index is `brand/README.md`.

The live page and `docs/DESIGN_RULES.md` already follow this system. Where an older note in this file disagreed, this page is now the source of truth for colour and typography. Layout and page sequence remain in `docs/SPEC.md`.

## Colour

- **Page background:** near-black `#07090C`. Body text on that ground is off-white `#EEF0F2`. Muted labels and secondary copy use `#A3ACB8`, and must stay at or above `#8B95A3` (the 4.5:1 floor). Hairlines use `#2A323D`. Control and input borders use `#6B7685` (3:1 or better on the page, the input ground, Deep Ink and the panel; it replaced `#5B6675`, which measured 2.96:1 on navy).
- **Panel `#1A1511`:** commercial cards, pricing surfaces and the website packages — a warm obsidian that sits under the brass accent without adding a second accent. Introduced on 20 November 2026 at Fahad's request, replacing navy on cards. It is not the page background, and its hairlines use `#332A21`.
- **Deep Ink `#0F1B2D`:** the brand tile (app icon, avatar, favicon) and the browser theme colour. It is no longer used for cards or pricing surfaces.
- **Gold `#B8892F`:** the single accent — buttons, highlights, particles, focus rings and active states. On the near-black page it passes WCAG AA for text.
- **Dark gold `#8A6420`:** gold text and links on light (paper) backgrounds, exposed in CSS as `--color-gold-dark`. Never use `#B8892F` for text on light surfaces.
- **Paper `#F8F6F1`:** light surfaces, and text on Deep Ink and the panel.
- **Slate `#475569`:** secondary text on light backgrounds.
- **No teal.** Do not reintroduce teal, cyan or mint (`#14B8A6`, `#2DD4BF`, `#7FD6C2`, `#0F766E`, or Tailwind `teal-*`). Before merging, `rg -i "teal|14b8a6|2dd4bf|7fd6c2|0f766e"` must return nothing in `app/`, `components/` and `content/`.
- One accent only. If a design starts pulling in a second accent, stop and simplify. The warmer highlight `#FFBD61` is a legacy exception, not a second brand colour.
- Do not introduce metallic silver or champagne. The H-T-L monogram is the one master mark (see Identity). Concept 4 (the chrome render), the "HTC" name and `htc-monogram-flat.svg` are retired and must not come back.

## Typography

The fonts actually loaded on the site, and the pair to use going forward:

- **Headings:** Newsreader (editorial serif), including the hero heading.
- **Body and UI:** Instrument Sans.
- **Mono labels:** the system monospace stack (`ui-monospace`, SFMono-Regular, Menlo, Consolas) — no mono webfont.
- **Bangla:** the site copy is English-only. The language toggle and its webfont were removed until the copy is translated and reviewed; do not add a Bangla webfont without the copy. The chat assistant still replies in Bangla when a visitor writes in Bangla.

Do not load or document Inter or Space Grotesk. Load the weights the CSS actually uses, rather than relying on a synthetic bold.

## Imagery and illustration

Follow the canonical [Instrument imagery rules](../brand/guidelines/src/07-imagery.md) and [iconography rules](../brand/guidelines/src/06-iconography.md). Favor actual software screenshots, properly labeled concept mockups, documentary working environments in Dhaka and precise system diagrams. Never present generated imagery, staged visuals, or architectural references as real completed client projects or owned premises. Record image usage rights; consent-cleared people photography requires separate approval.

## Identity

- **Monogram:** an H-T-L ligature on a 120-unit grid, one 16-unit stroke, 90° corners, with a 16 × 16 gold tip at the end of the L. The geometry is in `components/BrandMark.tsx` and `brand/_source/brandlib.py`; never redraw it by hand.
- **Files:** `brand/logo/` holds the monogram, horizontal and stacked lockups and wordmark in `light` (on the page and navy), `dark` (on paper and white) and one-colour `mono-black` / `mono-white` versions, as SVG with PNG exports. The wordmark is Instrument Sans SemiBold, all caps, tracked +0.22em, converted to outlines.
- **Site:** the header shows the monogram with the caps wordmark (`.site-wordmark`). Favicons are `app/icon.svg` (32 px cut), `app/favicon.ico` (pixel-fitted 16 px cut), `app/apple-icon.png`; the manifest icons are in `public/icons/`. The Open Graph image is `public/og.png`.
- **Clear space:** two strokes (27% of the mark's height) on every side. **Minimum size:** 24 px / 8 mm for the monogram; use the favicon cuts below 24 px. Horizontal lockup at least 160 px / 35 mm wide.
- **Never:** bevel, chrome, glow, gradient, outline, rotate, stretch or recolour the mark; never move the gold tip or use a second accent in it.
- **Concept 4 is retired.** It was the earlier chrome-and-bevel direction. Do not use its render, its mockups or the HTC name anywhere on the site or in new material. If a person asks for it, point them to this page.
- **Status labels:** every project, demo and case study is labelled Concept, In progress or Shipped.

## Voice and positioning

- Hope Theory Labs is an AI-first studio. Lead with the AI Audit, then forward-deployed AI engineering. Custom software, web and mobile, enterprise systems and managed engineering are supporting services.
- The AI Audit and all engineering work are quoted per scope after a short discovery call. Never publish a fee, a range, or a founding or introductory rate for them. The website packages are the only public prices. They live on `/services` as the separate, supporting product, beside the services they support. `/pricing` covers only the AI work, quoted per scope, and carries one link to the packages.
- The footer links the company X account, https://x.com/HopeTheoryLabs. Add other social links only once the handle is confirmed.
- No tagline is set on the site. The working line in the brand book is not locked; leave it off until Fahad decides.
- Do not say "clients worldwide", and do not invent clients, numbers or testimonials. ServeAI is pre-production, never live, and Rollers Republic is a Concept.

## Rebuilding the brand kit

`python3 brand/_source/build_assets.py`, `build_print.py` and `build_tokens.py` regenerate every logo, icon, social, GitHub, print and token file from one source. They need Python 3 with `fonttools`, `uharfbuzz` and `Pillow`, `rsvg-convert` and `qpdf`, and the OFL font files named in `brand/_source/brandlib.py` (set `HTL_FONTS` to their folder). Commit the regenerated files with the script change.
