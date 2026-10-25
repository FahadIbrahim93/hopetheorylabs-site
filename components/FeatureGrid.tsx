import { experienceActions } from "./experience/store";
import { useContent } from "./LanguageProvider";
export function FeatureGrid() {
  const content = useContent();
  return <section id="services" className="services-section border-b border-paper/10" aria-labelledby="services-heading">
    <div className="services-inner">
      <div className="services-intro"><p className="eyebrow">{content.services.eyebrow}</p><h2 id="services-heading">{content.services.heading}</h2><div className="scene-slot services-visual" data-scene-anchor="services" aria-hidden="true" /></div>
      <div className="service-list">{content.services.items.map((item, index) => <article className="service-row" key={item.title} onPointerEnter={() => experienceActions.setServiceFocus(index)} onPointerLeave={() => experienceActions.setServiceFocus(-1)}>
        <span className="service-index">0{index + 1}</span><h3>{item.title}</h3><p>{item.description}</p>{index === 2 && <span className="tag">{content.services.earlyAccessTag}</span>}
      </article>)}</div>
      <p className="founding-note">{content.services.founding}</p>
    </div>
  </section>;
}
