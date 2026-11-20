"use client";

import { SectionMarker } from "./SectionMarker";
import { WhatsAppCta } from "./WhatsAppCta";
import { useContent } from "./ContentProvider";

/*
  The AI engagement section. Website packages no longer live here: they are
  published on /services beside the services they support, and /pricing keeps
  one pointer link to that section.
*/
export function PricingSection({ headingLevel = 2, packagesLink = false }: { headingLevel?: 1 | 2; packagesLink?: boolean }) {
  const { pricing, services } = useContent();
  // On /pricing the section heading is the page h1, so everything below it steps up one level.
  const Heading = (headingLevel === 1 ? "h1" : "h2") as "h1" | "h2";
  const SubHeading = (headingLevel === 1 ? "h2" : "h3") as "h2" | "h3";

  return (
    <section id="pricing" className="pricing-section border-b border-body/10" aria-labelledby="pricing-heading">
      <SectionMarker index="006B" />
      <div className="pricing-inner">
        <p className="eyebrow">{pricing.eyebrow}</p>
        <Heading id="pricing-heading">{pricing.heading}</Heading>
        <p className="pricing-intro">{pricing.intro}</p>

        <ul className="pricing-ai" role="list">
          {pricing.aiCards.map((card) => (
            <li key={card.title} className="pricing-card pricing-card-ai">
              <p className="pricing-badge pricing-badge-quiet">{card.tag}</p>
              <SubHeading className="pricing-name">{card.title}</SubHeading>
              <p className="pricing-price pricing-price-ask">{card.price}</p>
              <p className="pricing-for">{card.description}</p>
              <WhatsAppCta href={card.whatsappLink} className="pricing-cta">{card.cta}</WhatsAppCta>
            </li>
          ))}
        </ul>
        <p className="pricing-lane-note">{pricing.customNote}</p>

        {packagesLink ? (
          <p className="pricing-packages-link">
            {pricing.packagesNote}{" "}
            <a className="text-link" href={services.packages.cta.href}>
              {services.packages.cta.label} <span aria-hidden="true">›</span>
            </a>
          </p>
        ) : null}
      </div>
    </section>
  );
}
