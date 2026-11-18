# Logo

## The idea

The monogram is an **H-T-L ligature**: the H and T share one stem, and the L hangs from the same baseline. It keeps the orthogonal, shared-stem idea of the earlier working mark but fixes its main problem: the old crossbar closed the last letter into a C, so it read "HTC". The **Brass tip** at the end of the L is the signal: the last mile, the point where software runs in production.

## Construction (120 × 120 unit grid)

One stroke weight, **16 units**, everywhere. All corners are 90°. All shapes are rectangles.

| Part | x | y | width | height |
|---|---|---|---|---|
| H left stem | 0 | 16 | 16 | 88 |
| H crossbar | 0 | 52 | 60 | 16 |
| Shared stem (H right, T) | 44 | 0 | 16 | 120 |
| T bar | 28 | 0 | 48 | 16 |
| L stem | 76 | 40 | 16 | 80 |
| L foot | 76 | 104 | 28 | 16 |
| Brass tip | 104 | 104 | 16 | 16 |

The tip is always the same size as the stroke: one 16 × 16 square.

## Files

| File | Use on | Ink |
|---|---|---|
| `htl-monogram-light.svg` | Night, Deep Ink, photos with dark areas | `#EEF0F2` + Brass `#B8892F` tip |
| `htl-monogram-dark.svg` | Paper, white | `#07090C` + Brass Deep `#8A6420` tip |
| `htl-monogram-mono-black.svg` | One-colour print, fax, stamps, engraving | `#000000` only |
| `htl-monogram-mono-white.svg` | One-colour reversed print, embroidery | `#FFFFFF` only |
| `htl-lockup-horizontal-light/dark.svg` | Website header, slides, email signature | as above |
| `htl-lockup-stacked-light/dark.svg` | Covers, business-card fronts, square spaces | as above |
| `htl-wordmark-light/dark.svg` | Very wide, short spaces; footers | as above |
| `htl-app-icon.svg` | App icons, social avatars, GitHub org avatar | Light mark on Deep Ink tile |
| `htl-favicon.svg` | Favicon at 32px and up | Pixel-fitted on a 24-unit grid |
| `htl-favicon-16.svg` | Favicon at 16px | Pixel-fitted on a 12-unit grid |

The wordmark is **Instrument Sans SemiBold (600)**, all caps, tracked **+0.22em**, shaped with the font's own kerning and converted to outlines. It never needs the font installed. The same files, with PNG exports, are in the website repository under `brand/logo/`; the geometry lives in `brand/_source/brandlib.py` and `components/BrandMark.tsx`.

## Lockups

- **Horizontal:** mark 120 units tall; gap 48 units; wordmark cap height 44 units, centred on the mark.
- **Stacked:** mark centred; gap 36 units; wordmark cap height 22 units.
- Never rebuild a lockup by hand. Use the files.

## Clear space and minimum size

- Clear space on every side = **2 strokes** (32 units at 120, which is 27% of the mark's height). Nothing else enters it, including page edges.
- Monogram: at least **24px** on screen and **8mm** in print. Below 24px use the favicon files.
- Horizontal lockup: at least **160px** wide on screen, **35mm** in print. Below that, use the monogram alone.
- Wordmark: at least **120px** wide.

## Colour

- On Night or Deep Ink: the light files. On Paper or white: the dark files.
- On photos: place the mark on a calm area with at least 4.5:1 contrast to its ink, or on a Deep Ink panel.
- The tip is the only Brass in the logo. In one-colour work, the tip takes the same ink as the mark.

## Don'ts

- Don't add bevels, chrome, gradients, glows, shadows or outlines.
- Don't stretch, slant or rotate the mark.
- Don't move or recolour the tip, or use teal or any other accent.
- Don't put the mark inside a circle or any shape except the app-icon tile.
- Don't set the wordmark in live text where the SVG can be used. When live text is unavoidable, use the `wordmark` type style.

## The chrome Concept 4

The chrome, bevelled HTL render is **retired as a logo**. It was a raster mockup: it couldn't be printed in one colour, it disappeared at small sizes and its wordmark face was unlicensed. It also spelled HTC. Don't use it in new material.

## Finish in a vector application

These SVGs are geometrically exact and ready for screens. Before print production or trademark filing, finish these steps in Figma, Illustrator or Inkscape:

1. **Optical check of the joins.** Where the T bar meets the shared stem, and the crossbar meets both stems, judge whether the joins look heavier than the strokes at large sizes. Thin the junctions by 1–2 units if they do.
2. **Wordmark kerning.** The wordmark uses the font's kerning plus +0.22em tracking. Check the pairs "TH", "RY" and "LA" by eye at 200% size for large signage.
3. **Print colour specs.** Match Brass `#B8892F` and Deep Ink `#0F1B2D` to Pantone and CMYK values on a printed swatch, not on screen. Record the chosen values in the Color section.
4. **Embroidery and engraving cuts.** For stitching or laser etching, check the 16-unit stroke against the minimum the vendor needs and make a heavier cut if required.
5. **Master files.** Save a master `.ai` or `.fig` with named layers and export PDF, EPS and PNG sets (`@1x`, `@2x`, `@3x`) from it.
6. **Trademark search.** Have a search done in Bangladesh and in each target export market before registering.
