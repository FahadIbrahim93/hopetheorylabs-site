import { en as content } from "@/content/en";

import { PhoneMockup } from "./PhoneMockup";
import { WhatsAppCta } from "./WhatsAppCta";

/*
  Hero: heading spans ~7 of 12 columns, mockup sits at column 8.
  No animation yet — word-reveal comes with Step 5.
*/
export function Hero() {
  return (
    <section className="border-b border-paper/10" aria-labelledby="hero-heading">
      <div className="mx-auto grid max-w-6xl grid-cols-12 gap-8 px-6 pb-20 pt-16 md:px-8 md:pb-28 md:pt-24">
        <div className="col-span-12 md:col-span-7">
          <h1
            id="hero-heading"
            className="font-heading text-5xl leading-[1.05] tracking-[-0.03em] text-paper md:text-7xl"
          >
            {content.hero.heading}
          </h1>
          <p className="mt-8 max-w-md text-lg leading-relaxed text-paper/70">
            {content.hero.subheading}
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-6">
            <WhatsAppCta href={content.hero.whatsappLink}>
              {content.hero.primaryCta}
            </WhatsAppCta>
            <a
              href={content.hero.pricingHref}
              className="text-sm font-semibold text-teal underline-offset-4 hover:underline"
            >
              {content.hero.secondaryCta}
            </a>
          </div>
        </div>

        <div className="col-span-12 flex md:col-span-5 md:col-start-8 md:justify-end">
          <span className="sr-only">{content.hero.mockupDescription}</span>
          <PhoneMockup />
        </div>
      </div>
    </section>
  );
}
