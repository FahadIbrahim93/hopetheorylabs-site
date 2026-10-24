/*
  Word-by-word reveal for the H1 (issue #5): 60ms stagger, fade + rise.
  CSS-driven on purpose — the words animate even with JavaScript disabled,
  and prefers-reduced-motion renders them instantly. The timing token and
  keyframe live in globals.css.
  The H1 keeps its text for assistive tech via aria-label; the split spans
  are decoration.
*/
export function WordReveal({ text }: { text: string }) {
  return (
    <span aria-hidden="true">
      {text.split(" ").map((word, index, words) => (
        <span
          key={index}
          className="word inline-block"
          style={{ "--word-i": index } as React.CSSProperties}
        >
          {word}
          {index < words.length - 1 ? "\u00A0" : ""}
        </span>
      ))}
    </span>
  );
}
