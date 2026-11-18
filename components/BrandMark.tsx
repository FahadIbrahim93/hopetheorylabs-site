/*
  The Hope Theory Labs monogram: an H-T-L ligature on a 120-unit grid with a
  gold tip on the L (docs/BRAND.md, Identity). Strokes use currentColor so the
  mark follows the text colour; the tip is always the gold accent (set through
  `style`, because var() is not valid in an SVG fill attribute).
  Decorative by default: the link or heading around it carries the name.
*/
const STROKES: ReadonlyArray<readonly [number, number, number, number]> = [
  [0, 16, 16, 88],
  [0, 52, 60, 16],
  [44, 0, 16, 120],
  [28, 0, 48, 16],
  [76, 40, 16, 80],
  [76, 104, 28, 16],
];

export function BrandMark({ size = 26, className }: { size?: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {STROKES.map(([x, y, width, height]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width={width} height={height} fill="currentColor" />
      ))}
      <rect x={104} y={104} width={16} height={16} style={{ fill: "var(--color-gold)" }} />
    </svg>
  );
}
