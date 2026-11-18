"use client";

import { SectionMarker } from "./SectionMarker";
import { WhatsAppCta } from "./WhatsAppCta";
import { useContent } from "./ContentProvider";

export function PricingSection({ headingLevel = 2 }: { headingLevel?: 1 | 2 }) {
  const { pricing } = useContent();
  // On /pricing the section heading is the page h1, so everything below it steps up one level.
  const Heading = (headingLevel === 1 ? "h1" : "h2") as "h1" | "h2";
  const SubHeading = (headingLevel === 1 ? "h2" : "h3") as "h2" | "h3";
  const CardHeading = (headingLevel === 1 ? "h3" : "h4") as "h3" | "h4";

  return (
    <section id="pricing" className="pricing-section border-b border-body/10" aria-labelledby="pricing-heading">
      <SectionMarker index="006B" />
      <div className="pricing-inner">
        <p className="eyebrow">{pricing.eyebrow}</p>
        <Heading id="pricing-heading">{pricing.heading}</Heading>
        <p className="pricing-intro">{pricing.intro}</p>

        <p className="pricing-packages-label">{pricing.packagesLabel}</p>
        <ul className="pricing-tiers" role="list">
          {pricing.tiers.map((tier) => {
            const id = `tier-${tier.name.toLowerCase()}`;
            return (
              <li key={tier.name} className={`pricing-card${tier.badge ? " is-featured" : ""}`} aria-labelledby={id}>
                {tier.badge ? <p className="pricing-badge">{tier.badge}</p> : null}
                <SubHeading id={id} className="pricing-name">{tier.name}</SubHeading>
                <p className="pricing-subtitle">{tier.subtitle}</p>
                <p className="pricing-price">{tier.price}</p>
                <ul className="pricing-features" role="list">
                  {tier.features.map((f) => <li key={f}>{f}</li>)}
                </ul>
                <p className="pricing-delivery">{tier.delivery}</p>
                <p className="pricing-for">{tier.forWho}</p>
                <WhatsAppCta href={tier.whatsappLink} className="pricing-cta">{tier.cta}</WhatsAppCta>
              </li>
            );
          })}
        </ul>

        <div className="pricing-terms">
          <p>{pricing.payment}</p>
          <SubHeading className="pricing-subhead">{pricing.addOnsHeading}</SubHeading>
          <ul className="pricing-addons" role="list">
            {pricing.addOns.map((a) => <li key={a.label}><span>{a.label}</span><b>{a.price}</b></li>)}
          </ul>
        </div>

        <SubHeading className="pricing-subhead pricing-ai-heading">{pricing.aiHeading}</SubHeading>
        <ul className="pricing-ai" role="list">
          {pricing.aiCards.map((card) => (
            <li key={card.title} className="pricing-card pricing-card-ai">
              <p className="pricing-badge pricing-badge-quiet">{card.tag}</p>
              <CardHeading className="pricing-name">{card.title}</CardHeading>
              <p className="pricing-price pricing-price-ask">{card.price}</p>
              <p className="pricing-for">{card.description}</p>
              <WhatsAppCta href={card.whatsappLink} className="pricing-cta">{card.cta}</WhatsAppCta>
            </li>
          ))}
        </ul>
        <p className="pricing-lane-note">{pricing.customNote}</p>
      </div>
    </section>
  );
}
