import { SectionMarker } from "./SectionMarker";
import { WhatsAppCta } from "./WhatsAppCta";
import { useContent } from "./ContentProvider";

/* Homepage overview of the six service pillars; full detail lives on /services. */
export function FeatureGrid() {
  const content = useContent();
  const { services } = content;

  return (
    <section
      id="services"
      className="services-section services-section-html border-b border-body/10"
      aria-labelledby="services-heading"
    >
      <SectionMarker index="006" />
      <div className="services-inner services-inner-html">
        <div className="services-intro scene-copy">
          <p className="eyebrow">{services.eyebrow}</p>
          <h2 id="services-heading">{services.heading}</h2>
          <p className="services-intro-text">{services.intro}</p>
          <ol className="services-pillars" role="list">
            {services.pillars.map((pillar, index) => (
              <li key={pillar.slug} className="services-pillar">
                <span className="services-pillar-index" aria-hidden="true">0{index + 1}</span>
                <b>
                  {pillar.title}
                </b>
                <span>{pillar.summary}</span>
              </li>
            ))}
          </ol>
          <p className="services-lane-note">{services.customNote}</p>
          <div className="services-actions">
            <WhatsAppCta href={services.whatsappLink} className="services-ai-cta">
              {services.whatsappCta}
            </WhatsAppCta>
            <a className="text-link" href={services.detailsCta.href}>
              {services.detailsCta.label} <span aria-hidden="true">›</span>
            </a>
          </div>
          <div id="services-website" className="services-lane services-packages">
            <p className="services-lane-label">{services.packages.label}</p>
            <div className="services-lane-item">
              <b>{services.packages.title}</b>
              <span>{services.packages.description}</span>
            </div>
            <p className="services-lane-note">{services.packages.note}</p>
            <a className="text-link" href={services.packages.cta.href}>
              {services.packages.cta.label} <span aria-hidden="true">›</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
