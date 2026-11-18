# Hope Theory Labs brand kit

Direction: **Instrument** — engineering as a precision instrument: calm, exact and built to last. The rules are in `docs/BRAND.md` (short) and `guidelines/HTL-Brand-Guidelines.pdf` (full brand book; source in `guidelines/src/`).

| Folder | What is in it |
| --- | --- |
| `logo/` | H-T-L monogram, horizontal and stacked lockups and wordmark: `light` (on dark grounds), `dark` (on paper and white), `mono-black`, `mono-white`. App icon, favicon cuts, maskable icon. PNG exports in `logo/png/`. |
| `icons/` | The five service-pillar icons (24 px grid, 1.5 px stroke, ink `#07090C`). |
| `tokens/` | `tokens.json` (source of truth) and `tokens.css` (Night theme on `:root`, Paper theme on `[data-theme="paper"]`). |
| `social/` | Avatar, X header, LinkedIn and Facebook covers, Open Graph image and two post templates. SVG sources; upload-ready PNGs in `social/png/`. |
| `github/` | Organisation avatar, repository social preview (1280 × 640) and README banner. |
| `business-card/` | Print PDFs, 3.5 × 2 in with 0.125 in bleed: front, a named back, a blank back, and a proof with crop marks. |
| `email-signature/` | `signature.html` (paste into Gmail) and `signature.txt`. Its logo is served from `public/brand/htl-signature-logo.png`. |
| `guidelines/` | The brand guidelines PDF and its markdown source. |
| `_source/` | The scripts that build every file above. |

## Using the files

- Pick the `light` files for Night (`#07090C`) and Deep Ink (`#0F1B2D`) grounds, the `dark` files for Paper (`#F8F6F1`) and white.
- Every SVG has its text converted to outlines, so it opens and prints the same everywhere without fonts.
- **GitHub:** upload `github/png/htl-github-social-preview-1280x640.png` in the repository's Settings › General › Social preview, and `github/png/htl-github-org-avatar-500.png` as the account or organisation avatar. The README banner is optional.
- **Social:** upload `social/png/htl-avatar-1080.png` as the profile picture everywhere, and the matching cover for each platform.
- **Print:** send the `*-print.pdf` files. They are RGB: ask the printer to convert to CMYK and to proof Brass `#B8892F` and Deep Ink `#0F1B2D` on paper before the full run.
- **Email signature:** open `email-signature/signature.html` in a browser, copy the block between the rules and paste it into the signature box. The logo appears once this branch is deployed.

## Rebuilding

From the repository root, with Python 3 (`fonttools`, `uharfbuzz`, `Pillow`, `markdown`), `rsvg-convert`, `qpdf`, Google Chrome, and the OFL font files Instrument Sans, Newsreader and JetBrains Mono from github.com/google/fonts in a folder named by `HTL_FONTS` (file names in `_source/brandlib.py`):

```sh
python3 brand/_source/build_tokens.py
HTL_FONTS=/path/to/fonts python3 brand/_source/build_assets.py
HTL_FONTS=/path/to/fonts python3 brand/_source/build_print.py
python3 brand/_source/build_guidelines.py
```

`build_assets.py` also writes the site's `app/icon.svg`, `app/favicon.ico`, `app/apple-icon.png`, `public/icons/`, `public/og.png` and `public/brand/htl-signature-logo.png`. Commit regenerated files with the change that caused them.

## Not done here

- A layered master logo file and Pantone/CMYK matches: finish these in a vector application (see the guidelines, Logo › Finish in a vector application).
- A trademark search for the monogram and name.
- Native-speaker review of any Bangla copy.
