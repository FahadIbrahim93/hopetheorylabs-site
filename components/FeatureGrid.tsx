import { WhatsAppCta } from "./WhatsAppCta";
import { useContent } from "./LanguageProvider";

export function FeatureGrid() {
  const content = useContent();
  const { services } = content;

  return (
    <section
      id="services"
      className="services-section services-section-html border-b border-paper/10"
      aria-labelledby="services-heading"
    >
      <div className="services-inner services-inner-html">
        <div className="services-intro scene-copy">
          <p className="eyebrow">{services.eyebrow}</p>
          <h2 id="services-heading">{services.heading}</h2>
          <p className="services-intro-text">{services.intro}</p>
          <div className="services-lanes">
            <div id="services-website" className="services-lane">
              <p className="services-lane-label">{services.websiteLane.label}</p>
              {services.websiteLane.items.map((item) => (
                <div key={item.title} className="services-lane-item">
                  <b>{item.title}</b>
                  <span>{item.description}</span>
                </div>
              ))}
              <p className="services-lane-note">{services.websiteLane.note}</p>
            </div>
            <div id="services-ai" className="services-lane services-lane-ai">
              <p className="services-lane-label">
                {services.aiLane.label}{" "}
                <em className="tag">{services.aiLane.tag}</em>
              </p>
              {services.aiLane.items.map((item) => (
                <div key={item.title} className="services-lane-item">
                  <b>{item.title}</b>
                  <span>{item.description}</span>
                </div>
              ))}
              <p className="services-lane-note">{services.aiLane.note}</p>
              <WhatsAppCta href={services.aiLane.whatsappLink} className="services-ai-cta">
                {services.aiLane.whatsappCta}
              </WhatsAppCta>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
