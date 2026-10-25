/*
  Scroll narrative ported from the supplied concept page. Progress `pp` is
  damped toward a piecewise-linear map of scroll position against section
  tops; `up = min(pp * 5, 2)` drives the particle morph (scatter -> globe ->
  galaxy). Flow visibility `uF` and global dim `uD` follow the same curves.
*/

export const PROGRESS_ANCHORS = [
  "top",
  "method",
  "shift",
  "flow",
  "how",
  "services",
  "work",
  "about",
  "contact",
] as const;

/** Target progress at each anchor (0 .. 1). */
export const PROGRESS_AT_ANCHOR = [0, 0.2, 0.4, 0.6, 0.68, 0.8, 0.87, 0.93, 1] as const;

export function smoothstep(x: number, edge0: number, edge1: number) {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

/** Raw scroll progress from section tops (no damping). */
export function stageProgress(scrollY: number, tops: number[]): number {
  if (tops.length < 2) return 0;
  const last = tops.length - 1;
  if (scrollY <= tops[0]) return PROGRESS_AT_ANCHOR[0];
  if (scrollY >= tops[last]) return PROGRESS_AT_ANCHOR[last];
  for (let k = 1; k < tops.length; k++) {
    if (scrollY <= tops[k] || k === last) {
      const span = Math.max(1, tops[k] - tops[k - 1]);
      const f = Math.min(1, Math.max(0, (scrollY - tops[k - 1]) / span));
      return PROGRESS_AT_ANCHOR[k - 1] + (PROGRESS_AT_ANCHOR[k] - PROGRESS_AT_ANCHOR[k - 1]) * f;
    }
  }
  return 1;
}

export function flowMix(pp: number) {
  return smoothstep(pp, 0.5, 0.6) * (1 - smoothstep(pp, 0.63, 0.68));
}

export function sceneDim(pp: number, intro: number) {
  const uF = flowMix(pp);
  return (1 - 0.65 * uF) * (1 - 0.5 * smoothstep(pp, 0.68, 0.8)) * smoothstep(intro, 0, 0.6);
}

export function hudIndex(up: number) {
  if (up < 0.5) return 0;
  if (up < 1.5) return 1;
  return 2;
}

export const HUD_NAMES = ["Scattered", "Structured", "Alive"] as const;
