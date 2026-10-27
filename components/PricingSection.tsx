import { SectionMarker } from "./SectionMarker";
import { WhatsAppCta } from "./WhatsAppCta";
import { useContent } from "./LanguageProvider";

export function PricingSection() {
  const { pricing } = useContent();

  return (
    <section id="pricing" className="pricing-section border-b border-paper/10" aria-labelledby="pricing-heading">
      <SectionMarker index="006B" />
      <div className="pricing-inner">
        <p className="eyebrow">{pricing.eyebrow}</p>
        <h2 id="pricing-heading">{pricing.heading}</h2>
        <p className="pricing-intro">{pricing.intro}</p>

        <ul className="pricing-tiers" role="list">
          {pricing.tiers.map((tier) => {
            const id = `tier-${tier.name.toLowerCase()}`;
            return (
              <li key={tier.name} className={`pricing-card${tier.badge ? " is-featured" : ""}`} aria-labelledby={id}>
                {tier.badge ? <p className="pricing-badge">{tier.badge}</p> : null}
                <h3 id={id} className="pricing-name">{tier.name}</h3>
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
          <p className="pricing-founding">{pricing.founding}</p>
          <p>{pricing.payment}</p>
          <h3 className="pricing-subhead">{pricing.addOnsHeading}</h3>
          <ul className="pricing-addons" role="list">
            {pricing.addOns.map((a) => <li key={a.label}><span>{a.label}</span><b>{a.price}</b></li>)}
          </ul>
        </div>

        <h3 className="pricing-subhead pricing-ai-heading">{pricing.aiHeading}</h3>
        <ul className="pricing-ai" role="list">
          {pricing.aiCards.map((card) => (
            <li key={card.title} className="pricing-card pricing-card-ai">
              <p className="pricing-badge pricing-badge-quiet">{card.tag}</p>
              <h4 className="pricing-name">{card.title}</h4>
              <p className="pricing-price pricing-price-ask">{card.price}</p>
              <p className="pricing-for">{card.description}</p>
              <WhatsAppCta href={card.whatsappLink} className="pricing-cta">{card.cta}</WhatsAppCta>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
