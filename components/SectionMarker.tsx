/** Editorial index marker (HTL / 00n) — decorative, studio serial style. */
export function SectionMarker({ index, ariaHidden = true }: { index: string; ariaHidden?: boolean }) {
  return (
    <p className="section-marker" aria-hidden={ariaHidden}>
      HTL / {index}
    </p>
  );
}
