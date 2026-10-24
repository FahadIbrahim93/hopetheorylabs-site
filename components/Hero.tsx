import dynamic from "next/dynamic";

import { useContent } from "./LanguageProvider";

import { PhoneMockup } from "./PhoneMockup";
import { WhatsAppCta } from "./WhatsAppCta";
import { WordReveal } from "./WordReveal";

/*
  Hero: heading spans ~7 of 12 columns, mockup sits at column 8.
  The labs background (issue #4) loads client-side only, after first paint;
  the static gradient + dot-grid fallback underneath is always rendered so
  no-JS and reduced motion still get the look.
*/
const LabsBackground = dynamic(() => import("./LabsBackground"), { ssr: false });

export function Hero() {
  const content = useContent();
  return (
    <section className="relative overflow-hidden border-b border-paper/10" aria-labelledby="hero-heading">
      {/* Static fallback layer — always present (SPEC: no-JS fallback). */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(20,184,166,0.08),transparent_60%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(var(--color-teal)_1px,transparent_1px)] opacity-[0.1] [background-position:center] [background-size:24px_24px]"
      />
      <LabsBackground />
      <div className="relative mx-auto grid max-w-6xl grid-cols-12 gap-8 px-6 pb-20 pt-16 md:px-8 md:pb-28 md:pt-24">
        <div className="col-span-12 md:col-span-7">
          <h1
            id="hero-heading"
            aria-label={content.hero.heading}
            className="font-heading text-5xl leading-[1.05] tracking-[-0.03em] text-paper md:text-7xl"
          >
            <WordReveal text={content.hero.heading} />
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
