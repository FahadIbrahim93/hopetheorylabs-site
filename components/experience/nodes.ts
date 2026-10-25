/*
  The eight source nodes of the living flow. Shared by the WebGL scene (line
  and dot colours) and the HTML labels (CSS colour variable), so this module
  must stay free of three.js imports.
*/

export const NODE_COUNT = 8;

/** Left column (0-3) and right column (4-7), top to bottom. */
export const NODE_COLORS = [
  "#FF9A3C",
  "#4F8CFF",
  "#B07CFF",
  "#44D6A0",
  "#FFB347",
  "#4FB8FF",
  "#C48CFF",
  "#5EE6B0",
] as const;

/** Flow layout in scene units: columns at ±NODE_X, rows at NODE_Y. */
export const NODE_X = 5.2;
export const NODE_Y = [3.2, 1.1, -1.1, -3.2] as const;

export function nodeSide(index: number): -1 | 1 {
  return index < 4 ? -1 : 1;
}
