# Layout, spacing and shape

## Grid

| Breakpoint | Width | Columns | Gutter | Page margin |
|---|---|---|---|---|
| Mobile | under 768px | 4 | 24px | 24px (`space-5`) |
| Tablet | 768–1199px | 6 | 24px | 48px (`space-7`) |
| Desktop | 1200px and up | 12 | 24px | 96px (`space-9`) |

Content never grows wider than `container-max` (1280px). Reading text never runs wider than `measure` (68 characters).

## Composition

- **Asymmetric, editorial grids.** A typical section: a mono `SectionMarker` across the top, a heading over 7 or 8 columns, supporting text in the remaining 4 or 5, aligned to the heading's baseline.
- **Wide whitespace.** Section padding is `space-9` (96px) on tablet and `space-10` (128px) on large desktop; the site's `clamp(72px, 8vw, 112px)` rule is a valid fluid version.
- **One thing leads per section.** A heading, an image or a number, never all three at the same size.
- **Rules divide; boxes hold.** Separate sections with a `line` hairline, not a background change. Use Deep Ink panels (`surface-panel`) for content that is a unit: a pricing tier, a case study, a form.

## Spacing

The scale is a 4px base: `space-1` (4) through `space-10` (128).

- Inside components: `space-1` to `space-4`.
- Between related blocks: `space-5` to `space-6`.
- Between a heading block and its content: `space-7`.
- Between unrelated blocks: `space-8` and above.

## Shape

- The system is **square at heart**. The logo, the signal square, images and section rules have no radius.
- Controls (buttons, inputs, menus): `radius-md` (4px).
- Panels and media frames: `radius-lg` (8px).
- Status labels and tags: `radius-sm` (2px).
- No pills, no circles except where a control needs one (radio buttons, avatars).
- Borders are 1px `line` or `line-control`. No double borders, no coloured left-border cards.

## Documents (Paper theme)

- A4 portrait for proposals and company profiles. Margins 20mm, 12-column grid with 5mm gutters.
- Running header: `label` style section marker on the left, wordmark on the right.
- Running footer: page number, document status (Concept / Draft / Final) and date in `label`.
- Slides: 16:9, 1920 × 1080, 96px margins, 12-column grid.
