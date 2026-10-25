import { useContent } from "./LanguageProvider";

export function MethodSection() {
  const { story } = useContent();
  return (
    <section id="method" className="story-section border-b border-paper/10" aria-labelledby="method-heading">
      <div className="story-inner story-inner-html">
        <div className="story-copy scene-copy">
          <p className="eyebrow">{story.methodEyebrow}</p>
          <h2 id="method-heading">{story.methodHeading}</h2>
          <p>{story.methodText}</p>
        </div>
      </div>
    </section>
  );
}
