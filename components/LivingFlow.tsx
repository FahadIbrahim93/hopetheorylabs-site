import { SectionMarker } from "./SectionMarker";
import { useContent } from "./LanguageProvider";

export function LivingFlow() {
  const { story } = useContent();
  return (
    <section id="flow" className="flow-section flow-section-html border-b border-paper/10" aria-labelledby="flow-heading">
      <SectionMarker index="004" />
      <div className="flow-inner flow-inner-html">
        <div className="flow-copy scene-copy">
          <p className="eyebrow">{story.flowEyebrow}</p>
          <h2 id="flow-heading">{story.flowHeading}</h2>
        </div>
        <div className="flow-pills">
          {story.flowItems.map((item, i) => (
            <div className="flow-pill" key={item.title}>
              <span className="flow-index">0{i + 1}</span>
              <b>{item.title}</b>
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
