"use client";

import { SectionMarker } from "./SectionMarker";
import { WhatsAppCta } from "./WhatsAppCta";
import { useContent } from "./ContentProvider";

/*
  Client body of /services. It lives outside app/services/page.tsx so that
  route can stay a server component and export per-route metadata (issue #47).
*/
export function ServicesPageContent() {
  const content = useContent();
  const { services } = content;

  return (
    <section id="services" className="services-section services-page border-b border-body/10" aria-labelledby="services-heading">
      <SectionMarker index="services" />
      <div className="services-page-inner scene-copy">
        <p className="eyebrow">{services.eyebrow}</p>
        <h1 id="services-heading">{services.heading}</h1>
        <p className="services-intro-text">{services.intro}</p>

        <ol className="services-detail-list" role="list">
          {services.pillars.map((pillar, index) => (
            <li key={pillar.slug} id={pillar.slug} className="services-detail">
              <p className="services-pillar-index" aria-hidden="true">0{index + 1}</p>
              <h2>{pillar.title}</h2>
              <p className="services-detail-summary">{pillar.summary}</p>
              <dl className="services-detail-grid">
                <div>
                  <dt>{services.labels.problem}</dt>
                  <dd>{pillar.problem}</dd>
                </div>
                <div>
                  <dt>{services.labels.outputs}</dt>
                  <dd>
                    <ul role="list">
                      {pillar.outputs.map((output) => <li key={output}>{output}</li>)}
                    </ul>
                  </dd>
                </div>
                <div>
                  <dt>{services.labels.fit}</dt>
                  <dd>{pillar.fit}</dd>
                </div>
                <div>
                  <dt>{services.labels.engagement}</dt>
                  <dd>{pillar.engagement}</dd>
                </div>
              </dl>
            </li>
          ))}
        </ol>

        <p className="services-lane-note">{services.customNote}</p>
        <WhatsAppCta href={services.whatsappLink} className="services-ai-cta">
          {services.whatsappCta}
        </WhatsAppCta>

        <div id="services-website" className="services-lane services-packages">
          <h2 className="services-lane-label">{services.packages.label}</h2>
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
    </section>
  );
}
