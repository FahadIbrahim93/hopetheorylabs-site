import { useContent } from "./LanguageProvider";

export function FeatureGrid() {
  const content = useContent();
  return (
    <section id="services" className="services-section services-section-html border-b border-paper/10" aria-labelledby="services-heading">
      <div className="services-inner services-inner-html">
        <div className="services-intro scene-copy">
          <p className="eyebrow">{content.services.eyebrow}</p>
          <h2 id="services-heading">{content.services.heading}</h2>
          <div className="services-cols">
            {content.services.items.map((item, index) => (
              <div key={item.title}>
                <b>{item.title}</b>
                <span>{item.description}</span>
                {index === 2 && <em className="tag">{content.services.earlyAccessTag}</em>}
              </div>
            ))}
          </div>
          <p className="founding-note">{content.services.founding}</p>
        </div>
      </div>
    </section>
  );
}
