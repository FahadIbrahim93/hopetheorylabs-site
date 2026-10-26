"use client";

import dynamic from "next/dynamic";

import { useExperienceMode } from "./experience/mode";
import { useContent } from "./LanguageProvider";
import { IntelligenceCore } from "./IntelligenceCore";
import { WhatsAppCta } from "./WhatsAppCta";
import { WordReveal } from "./WordReveal";

const LabsBackground = dynamic(() => import("./LabsBackground"), { ssr: false });

export function Hero() {
  const content = useContent();
  const mode = useExperienceMode();
  const words = content.hero.heading.split(" / ");

  return (
    <section id="top" className="hero-section" aria-labelledby="hero-heading">
      <div aria-hidden="true" className="hero-fallback" />
      {mode === "fallback" && <LabsBackground />}
      <div className="hero-grid hero-grid-html">
        <div className="hero-copy scene-copy">
          <p className="eyebrow">{content.hero.eyebrow}</p>
          <h1 id="hero-heading" aria-label={content.hero.heading.replace(" / ", " ")}>
            <span>
              <WordReveal text={words[0]} />
            </span>
            <span className="accent-line">
              <WordReveal text={words[1]} />
            </span>
          </h1>
          <p className="hero-subheading">{content.hero.subheading}</p>
          <div className="hero-actions">
            <WhatsAppCta href={content.hero.whatsappLink} className="magnetic-cta">
              {content.hero.primaryCta}
            </WhatsAppCta>
            <a className="text-link" href={content.hero.secondaryHref}>
              {content.hero.secondaryCta} <span aria-hidden="true">›</span>
            </a>
          </div>
        </div>
        {/*
          Server-rendered so the static core reserves its space up front (no CLS on
          phones, which always get the fallback). CSS shows it on <=800px unless
          WebGL is live, and on larger screens only once the page falls back.
        */}
        {mode !== "webgl" && (
          <div className="hero-visual hero-visual-static">
            <span className="sr-only">{content.hero.coreDescription}</span>
            <IntelligenceCore />
          </div>
        )}
      </div>
      <div className="hero-index" aria-hidden="true">
        <span>HTL / 001</span>
        <span>Dhaka · Bangladesh</span>
      </div>
    </section>
  );
}
