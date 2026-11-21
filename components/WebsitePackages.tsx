"use client";

import { WhatsAppCta } from "./WhatsAppCta";
import { useContent } from "./ContentProvider";

/*
  The published Starter / Counter / Showroom packages. They moved from
  /pricing to /services so the products sit beside the services they support;
  /pricing keeps a single "See website packages" link to this section.
*/
export function WebsitePackages() {
  const { pricing, services } = useContent();

  return (
    <section id="services-website" className="services-packages-full" aria-labelledby="packages-heading">
      <p className="eyebrow">{services.packages.label}</p>
      <h2 id="packages-heading" className="services-packages-title">{pricing.packagesHeading}</h2>
      <p className="services-packages-lead">{pricing.packagesIntro}</p>
      <p className="services-lane-note services-packages-note">{services.packages.note}</p>

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
        <p>{pricing.payment}</p>
        <h3 className="pricing-subhead">{pricing.addOnsHeading}</h3>
        <ul className="pricing-addons" role="list">
          {pricing.addOns.map((a) => <li key={a.label}><span>{a.label}</span><b>{a.price}</b></li>)}
        </ul>
      </div>
    </section>
  );
}
