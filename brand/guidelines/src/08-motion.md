# Motion and interaction

## Principles

- **Slow and purposeful.** Things settle; they don't bounce.
- **One thing moves at a time.** Nothing competes with the main motion on screen.
- **Motion explains.** Use it to show a state change or a connection, never as decoration.

## Timing

| Token | Value | Use |
|---|---|---|
| `duration-fast` | 160ms | Hover colours, pressed states |
| `duration-ui` | 400ms | Menus, tabs, icon nudges |
| `duration-reveal` | 600ms | Section rise-in, word reveal |
| `duration-slow` | 900ms | Hero-scale transitions only |
| `ease-signature` | cubic-bezier(0.16, 1, 0.3, 1) | Default for everything |
| `ease-exit` | cubic-bezier(0.7, 0, 0.84, 0) | Elements leaving |

## Patterns

- **Section reveal:** a 10px rise over `duration-reveal`. Never fade text in from invisible; it must be readable the moment it enters the screen.
- **Word reveal:** hero headings rise word by word with a 60ms stagger.
- **Button hover:** fill changes to `accent-fill-hover` over `duration-fast`; an arrow icon nudges 3px right over `duration-ui`.
- **Signal square:** when a state completes (a step reaches Shipped, a form sends), the Brass square appears with a short scale from 0.6 to 1 over `duration-ui`. This is the brand's one "moment".
- **Calibration ticks:** in progress indicators, ticks fill left to right in `accent`.
- **State readout:** the Scattered → Structured → Alive indicator updates as the page scrolls, with no scroll hijacking, pinning or snapping.

## Reduced motion

When `prefers-reduced-motion: reduce` is set:

- Remove rises, staggers and scaling. Change state instantly.
- The WebGL scene renders on demand only, with no continuous loop.
- Keep every piece of content visible and in its final state.

## Interaction states

- **Hover:** colour change only, never a size jump.
- **Focus:** 2px solid `focus-ring` with a 2px `focus-offset`. Never remove it.
- **Pressed:** `accent-fill-hover` for primary; `surface-raised` for others.
- **Disabled:** 40% opacity and `cursor: not-allowed`, plus a reason in text where possible.
- **Touch targets:** at least 44 × 44px.
