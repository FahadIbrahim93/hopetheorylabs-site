import { useContent } from "./LanguageProvider";
export function ShiftSection() {
  const { story } = useContent();
  return <section id="shift" className="story-section border-b border-paper/10" aria-labelledby="shift-heading">
    <div className="story-inner"><div className="story-copy">
      <p className="eyebrow">{story.shiftEyebrow}</p>
      <h2 id="shift-heading">{story.shiftHeading}</h2>
      <p>{story.shiftText}</p>
      <a className="text-link" href="#services">{story.shiftCta} <span aria-hidden="true">›</span></a>
    </div></div>
  </section>;
}
