/*
  Non-interactive placeholder for Step 3, which adds the real toggle
  (EN / বাংলা, localStorage, document lang switch, Hind Siliguri swap).
  TODO(issue #2 → Step 3): make interactive.
*/
export function LanguageToggle() {
  return (
    <span
      className="select-none font-mono text-xs uppercase tracking-widest text-paper/40"
      aria-hidden="true"
    >
      <span className="text-paper/80">EN</span>
      <span className="mx-1">/</span>
      <span className="font-bangla normal-case">বাংলা</span>
    </span>
  );
}
