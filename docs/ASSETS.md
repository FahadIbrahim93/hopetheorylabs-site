# Assets and immersive layers

Hope Theory Labs does **not** load third-party scripts, CDNs, or stock “AI” illustration packs. Everything below is self-hosted or procedural.

| Layer | Source | License / notes |
| --- | --- | --- |
| Film grain | Inline SVG `feTurbulence` in `app/globals.css` (`body::after`) | Procedural; no external file |
| Vignette | CSS radial gradient (`html::after`) | Procedural |
| Technical grid | `.studio-grid` in `components/StudioAtmosphere.tsx` + CSS | Procedural |
| Hero particles | `components/LabsBackground.tsx` | Custom 2D canvas |
| Intelligence core (fallback) | `components/IntelligenceCore.tsx` | Custom inline SVG |
| WebGL scene | `components/experience/` (Three.js via npm) | Custom GLSL port |
| Fonts | Google Fonts via `next/font` | [OFL](https://scripts.sil.org/OFL) (Instrument Sans, Newsreader, Hind Siliguri) |
| OG image | `public/og.png` (built by `brand/_source/build_assets.py`) | Project-owned |
| Logo, favicons, app and manifest icons | `brand/logo/`, `app/icon.svg`, `app/favicon.ico`, `app/apple-icon.png`, `public/icons/` | Project-owned (H-T-L monogram, docs/BRAND.md) |
| Email signature logo | `public/brand/htl-signature-logo.png` | Project-owned; hot-linked only from email signatures |
| Brand kit fonts (build time only) | Instrument Sans, Newsreader, JetBrains Mono from github.com/google/fonts | OFL; text is converted to outlines, no font files are committed |
| EMBERFALL work preview | `public/work/emberfall-hero.png` | From [emberfall press kit](https://github.com/FahadIbrahim93/emberfall) (MIT game); copied for CSP-safe showcase |

## Adding new assets

1. Prefer **procedural CSS/SVG/canvas** over downloaded textures.
2. If you import a file, use **CC0 / explicit commercial-use** license only; record author + URL here.
3. Never add hotlinked CDN images or animation runtimes (Lottie, GSAP from CDN, etc.) — see `docs/DESIGN_RULES.md` and `vercel.json` CSP.
