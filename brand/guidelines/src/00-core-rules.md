# Core rules

Hope Theory Labs is a founder-led AI and software engineering company in Dhaka. The brand direction is **Instrument**: engineering as a precision instrument, calm, exact and built to last. Every surface should feel measured, not decorated.

## Core rules

- Use **one accent**. Brass (`accent`, `accent-fill`) marks the single most important thing in a view: the main button, the active step, the logo tip. If two things are gold, one of them is wrong.
- Build dark first. The **Night** theme is the default for the site, decks and social posts. Use the **Paper** theme for documents, proposals, print and long reading.
- Put text on `surface-page`, `surface-panel` or `surface-raised` only, in `ink` or `ink-muted`. Deep Ink (`htl-deep-ink`) is for panels, never the page ground.
- Never set Brass (`htl-brass`) as text on Paper. Use `accent`, which switches to `htl-brass-deep` in the Paper theme.
- Text on a Brass fill is always `on-accent` (Night), never white.
- Use borders, not shadows. Hairlines are `line`; control borders are `line-control`. Only menus and dialogs get `shadow-overlay`.
- Corners are crisp: `radius-md` for controls, `radius-lg` for panels, `radius-none` for the logo, images and the signal square.
- Every interactive element gets a solid 2px `focus-ring` with a 2px `focus-offset`. Touch targets are at least 44px.

## Type in one line

Headlines in **Newsreader** (`display-*`, `heading-*`), everything else in **Instrument Sans** (`lead`, `body`, `ui`), system labels in **JetBrains Mono** (`label`, `code`). Bangla uses **Noto Serif Bengali** for headings and **Hind Siliguri** for text (`bn-*` styles). Never more than these families in one layout.

## The logo

Use the files in **Logos**. The monogram is an H-T-L ligature with a Brass tip on the L. Use `htl-monogram-light.svg` and the `-light` lockups on Night and Deep Ink; use the `-dark` files on Paper and white. Use `htl-favicon-16.svg` at 16px and `htl-favicon.svg` at 32px and up. Never redraw, recolour, outline, bevel or add glow to the mark. The full specification is in the Logo section.

## Signature details

- **Section markers**: `HTL / 001` in `label`, `ink-muted`, above section headings. Use the `SectionMarker` component.
- **Status labels**: every project, demo and case study is marked Concept, In progress or Shipped. Use the `StatusLabel` component and never omit it.
- **State readout**: Scattered → Structured → Alive tells the company story. Use `StateReadout` in heroes and decks.
- **Calibration ticks**: fine tick rules for dividers, progress and charts, drawn in `line` with one tick in `accent`.

## Voice in one line

Clear, evidence-led, technically capable and direct. Plain English, no hype, no invented numbers. Prices are written `৳10,000`. The company is "Hope Theory Labs", then "HTL"; all caps only in the wordmark.

## Components

The components live in `components/bundle.js` as `window.HTL` and need React 18 on the page. Load the stylesheet `components/bundle.css` after the tokens. Fonts load from Google Fonts (see Typography).
