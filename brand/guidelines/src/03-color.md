# Color

## The palette

| Name | Hex | Role |
|---|---|---|
| Night | `#07090C` | Page ground in the Night theme; ink in the Paper theme |
| Deep Ink | `#0F1B2D` | Panels, cards, the app-icon tile |
| Brass Gold | `#B8892F` | The single accent, as a fill or on dark grounds |
| Brass Deep | `#8A6420` | The accent as text on light grounds |
| Paper | `#F8F6F1` | Page ground in the Paper theme; documents and print |
| Slate | `#475569` | Secondary text on light grounds |

## Proportions

Roughly **70% ground** (Night or Paper), **20% Deep Ink panels and text**, **under 5% Brass**. Brass is a signal: if you can see it from across the room, there is too much.

## Using the tokens

Always build with the semantic tokens (`surface-*`, `ink`, `ink-muted`, `line`, `line-control`, `accent`, `accent-fill`, `on-accent`, `focus-ring`, `danger`), not the brand hexes. The semantic tokens switch correctly between the Night and Paper themes.

## Accessibility

All text pairs meet WCAG 2.2 AA (4.5:1) in both themes. Measured values:

| Pair | Night | Paper |
|---|---|---|
| `ink` on `surface-page` | 17.5:1 | 18.5:1 |
| `ink` on `surface-panel` | 15.1:1 | 19.9:1 |
| `ink` on `surface-raised` | 13.3:1 | 16.6:1 |
| `ink-muted` on `surface-page` | 8.7:1 | 7.0:1 |
| `ink-muted` on `surface-panel` | 7.5:1 | 7.6:1 |
| `accent` on `surface-page` | 6.3:1 | 5.0:1 |
| `accent` on `surface-raised` | 4.8:1 | 4.7:1 |
| `on-accent` on `accent-fill` | 6.3:1 | 6.3:1 |
| `line-control` on `surface-panel` | 3.8:1 | 4.0:1 |
| `line-control` on `surface-page` | 4.3:1 | 3.7:1 |
| `danger` on `surface-page` | 7.9:1 | 6.0:1 |
| `danger` on `surface-raised` | 6.1:1 | 5.6:1 |

Rules:

- Never put Brass `#B8892F` text on Paper or white (2.9:1). Use `accent`.
- Errors always come with words, not colour alone.
- Status is shown by a word and a shape (see `StatusLabel`), never by colour alone.

## Changes from the site's current tokens

- `line-control` moves from `#5B6675` to `#6B7685` on dark, because `#5B6675` measured 2.96:1 on Deep Ink panels, just under the 3:1 minimum for control borders.
- The legacy highlight `#FFBD61` is not part of the system. Replace it with `accent`.

## Retired colours

Signal Teal `#317F86`, Bright Teal `#57E0D0`, Champagne `#C7A66D`, old Deep Ink `#09131C`, and metallic silver. Don't use them anywhere.

## Print

Pantone and CMYK values must be matched on a printed swatch before the first print run (see Logo → Finish in a vector application). Until then, print from the hex values on uncoated white or warm-white stock close to Paper.
