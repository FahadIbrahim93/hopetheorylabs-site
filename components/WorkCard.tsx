import { useContent } from "./LanguageProvider";

export function WorkCard() {
  const content = useContent();
  return (
    <section id="work" className="work-section border-b border-paper/10" aria-labelledby="work-heading">
      <div className="work-copy scene-copy">
        <p className="eyebrow">{content.work.eyebrow}</p>
        <h2 id="work-heading">{content.work.heading}</h2>
        <p>{content.work.description}</p>
        <span className="tag">{content.work.tag}</span>
        <p>
          <a className="text-link" href={content.work.link} target="_blank" rel="noopener noreferrer">
            {content.work.linkLabel} <span aria-hidden="true">›</span>
          </a>
        </p>
      </div>
      <div className="phone-mockup" role="img" aria-label={`Illustrative phone mockup: ${content.work.phoneItems.join(", ")} and an order on WhatsApp`}>
        <div className="phone-top">
          <span>09:41</span>
          <span>● ● ▰</span>
        </div>
        <div className="phone-store-name">
          Rollers Republic <span>MENU</span>
        </div>
        {content.work.phoneItems.map((item) => (
          <div className="phone-product" key={item}>
            <span>{item}</span>
            <b>ADD</b>
          </div>
        ))}
        <div className="phone-order">{content.work.phoneCta}</div>
        <div className="phone-message">{content.work.phoneMessage}</div>
        <div className="phone-home" />
      </div>
    </section>
  );
}
