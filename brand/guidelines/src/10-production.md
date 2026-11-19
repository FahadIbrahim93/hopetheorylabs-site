# Production status and open items

## Ready to use now

| Item | Where |
|---|---|
| Tokens (colour, type, spacing, radius, motion, layout) | `tokens.json` here; `brand/tokens/tokens.json` and `tokens.css` in the website repository |
| Logos: monograms, lockups, wordmark, app icon, favicons (SVG + PNG) | Logos here; `brand/logo/` in the repository |
| Six service-pillar icons, including AI Audit | Icons here; `brand/icons/` |
| Website: header lockup, favicons, app icons, web manifest, Open Graph image | `components/BrandMark.tsx`, `app/icon.svg`, `app/favicon.ico`, `app/apple-icon.png`, `app/manifest.ts`, `public/og.png` |
| Social: avatar, X header, LinkedIn and Facebook covers, two post templates | `brand/social/` (SVG sources, PNG exports in `png/`) |
| GitHub: organisation avatar, repository social preview, README banner | `brand/github/` |
| Business cards (front, named back, blank back, proof with crop marks) | `brand/business-card/` |
| Email signature (HTML and plain text) | `brand/email-signature/`; the logo is served from the website at `/brand/htl-signature-logo.png` |
| Brand guidelines PDF | `brand/guidelines/HTL-Brand-Guidelines.pdf` |

Everything in `brand/` is rebuilt from one source by the scripts in `brand/_source/`. Text in every SVG is converted to outlines, so no font needs to be installed to open or print them.

## External Claude Design handoff — not verified

The original three creative directions, scored comparison, founder selection record, presentation/pitch template, proposal template and company profile were referenced in the design engagement but **are not included as files in this repository**. Verify them directly in the original Claude Design project or its exports before calling them delivered or approved. The GitHub implementation proves only the Instrument direction and the assets listed above.

## Needs a vector application (Figma, Illustrator or Inkscape)

1. Optical correction of the monogram joins and wordmark kerning at large sizes (see Logo). The wordmark already uses the font's own kerning.
2. A layered master logo file (`.fig` or `.ai`) and PDF/EPS exports from it.
3. Pantone and CMYK matches for Brass and Deep Ink, proofed on paper before the first print run.
4. Embroidery and engraving cuts, if needed.

## Needs a person

- Trademark search for the monogram and name in Bangladesh and target markets.
- Native-speaker review of all Bangla copy.
- Founder decision on the tagline.
- Uploading the GitHub social preview (repository Settings › General › Social preview) and organisation avatar, and the social profile images: these can only be set by an account owner.
- Print vendor proof of the business cards.

## Retired

- The chrome Concept 4 render and its bevelled wordmark.
- The "HTC" name and the `htc-monogram-flat.svg` working file.
- The typed "HT" favicon and the teal Open Graph image.
- Teal, champagne, metallic silver and particle-network backgrounds.
