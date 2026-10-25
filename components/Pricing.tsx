import { useContent } from "./LanguageProvider";

import { SectionLabel } from "./SectionLabel";
import { WhatsAppCta } from "./WhatsAppCta";

/*
  The one light (paper) section on the ink page — editorial rhythm and the
  correct use of slate/tealDark per docs/BRAND.md. Always shows ৳25,000
  before the founding offer; no countdowns, no deadlines (SPEC rules).
*/
export function Pricing() {
  const content = useContent();
  return (
    <section id="pricing" className="bg-paper text-ink" aria-labelledby="pricing-heading">
      <div className="mx-auto grid max-w-6xl grid-cols-12 gap-8 px-6 py-20 md:px-8 md:py-24">
        <div className="col-span-12 md:col-span-4">
          <SectionLabel index="04" label={content.pricing.heading} className="text-teal-dark" />
          <h2
            id="pricing-heading"
            className="mt-6 font-heading text-4xl tracking-[-0.03em] md:text-5xl"
          >
            {content.pricing.base}
          </h2>
        </div>
        <div className="col-span-12 md:col-span-7 md:col-start-6">
          <p className="max-w-xl text-lg leading-relaxed text-slate">
            {content.pricing.founding}
          </p>
          <div className="mt-10">
            <WhatsAppCta href={content.hero.whatsappLink}>{content.pricing.cta}</WhatsAppCta>
          </div>
        </div>
      </div>
    </section>
  );
}
