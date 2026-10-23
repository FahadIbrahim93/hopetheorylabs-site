/*
  Monospace section label per docs/DESIGN_RULES.md, e.g. "01 / How it works"
  (uppercased by styling only — the wording itself lives in the content files).
  Colour is passed via className so light sections can use teal-dark.
*/
export function SectionLabel({
  index,
  label,
  className = "",
}: {
  index: string;
  label: string;
  className?: string;
}) {
  return (
    <p className={`font-mono text-[11px] uppercase tracking-[0.2em] ${className}`}>
      {index} / {label}
    </p>
  );
}
