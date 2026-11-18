# Typography

## Families

| Role | Family | Weights | Licence |
|---|---|---|---|
| Display and headings | Newsreader | 500, 600 | SIL Open Font License |
| Text and interface | Instrument Sans | 400, 500, 600 | SIL Open Font License |
| Labels, code, data | JetBrains Mono | 400, 500 | SIL Open Font License |
| Bangla headings | Noto Serif Bengali | 500, 600 | SIL Open Font License |
| Bangla text and interface | Hind Siliguri | 400, 500, 600 | SIL Open Font License |

All five are free for commercial use, including in the logo, apps, PDFs and print. They are on Google Fonts. Self-host the woff2 files on the website for speed and privacy.

Google Fonts link for the full set:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,500;6..72,600&family=Instrument+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500&family=Noto+Serif+Bengali:wght@500;600&family=Hind+Siliguri:wght@400;500;600&display=swap" rel="stylesheet">
```

The website deliberately loads only Newsreader and Instrument Sans; its mono labels use the system monospace stack and it loads no Bangla font until Bangla copy is reviewed (see `docs/BRAND.md` in the repository). Decks, documents, social and print use JetBrains Mono.

## Scale

| Style | Family | Size / line height | Use |
|---|---|---|---|
| `display-xl` | Newsreader 500 | 72 / 76 | Hero heading, desktop |
| `display-l` | Newsreader 500 | 56 / 60 | Hero on mobile, slide titles |
| `heading-1` | Newsreader 500 | 44 / 50 | Section headings |
| `heading-2` | Newsreader 500 | 32 / 38 | Sub-sections |
| `heading-3` | Newsreader 500 | 24 / 30 | Small headings, quotes |
| `lead` | Instrument Sans 400 | 20 / 30 | Intro paragraphs |
| `body` | Instrument Sans 400 | 17 / 27 | Reading text |
| `body-sm` | Instrument Sans 400 | 15 / 23 | Dense panels, tables |
| `ui` | Instrument Sans 500 | 14 / 20 | Buttons, labels, nav |
| `ui-strong` | Instrument Sans 600 | 14 / 20 | Prices, table headers |
| `caption` | Instrument Sans 400 | 13 / 18 | Captions, helper text |
| `label` | JetBrains Mono 500 | 12 / 16, +0.1em, caps | Section markers, eyebrows |
| `code` | JetBrains Mono 400 | 14 / 22 | Code, logs, IDs |

On screens under 768px, step every display and heading style down one size (`display-xl` becomes `display-l`, and so on). Body text stays at 17px.

## Bangla

| Style | Family | Size / line height |
|---|---|---|
| `bn-display` | Noto Serif Bengali 600 | 40 / 56 |
| `bn-heading` | Noto Serif Bengali 600 | 28 / 40 |
| `bn-body` | Hind Siliguri 400 | 17 / 30 |
| `bn-ui` | Hind Siliguri 500 | 15 / 24 |

- Bangla needs more line height than English, about 1.4× for headings and 1.75× for text, because of its marks above and below the letters.
- Mark Bangla text with `lang="bn"` so screen readers and line breaking work.
- In mixed pages, set each language in its own block. Don't mix Bangla and English inside one heading.
- Write numerals in the script of the sentence. Prices use the taka sign with no space: `৳10,000`.
- Bangla copy must be written or reviewed by a native speaker before it is published.

## Rules

- Headlines are sentence case. Never set Newsreader in all caps.
- One `display-*` style per page.
- Keep reading lines under 68 characters (`measure`).
- Use real weights. Never let the browser fake a bold.
- Tabular figures (`font-variant-numeric: tabular-nums`) for prices and tables.
- Mono `label` text is always uppercase and short (under 40 characters).
- Print: body 10.5–11pt Instrument Sans, headings Newsreader, minimum 8pt for captions.
