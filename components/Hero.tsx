import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

import { useExperienceMode } from "./experience/Experience";
import { useContent } from "./LanguageProvider";
import { IntelligenceCore } from "./IntelligenceCore";
import { WhatsAppCta } from "./WhatsAppCta";
import { WordReveal } from "./WordReveal";

const LabsBackground = dynamic(() => import("./LabsBackground"), { ssr: false });

/*
  The hero reserves a fixed-aspect slot for the intelligence core. The inline
  SVG core renders in that slot immediately (static HTML, no JS needed) and
  crossfades out once the WebGL scene has drawn its first frames; if WebGL is
  unavailable or fails, the SVG stays and the light 2D particle field returns.
*/
export function Hero() {
  const content = useContent();
  const mode = useExperienceMode();
  const [retired, setRetired] = useState(false);
  const words = content.hero.heading.split(" / ");

  useEffect(() => {
    if (mode !== "webgl") return;
    const id = window.setTimeout(() => setRetired(true), 1100);
    return () => window.clearTimeout(id);
  }, [mode]);

  const showStaticCore = mode !== "webgl" || !retired;

  return <section id="top" className="hero-section" aria-labelledby="hero-heading">
    <div aria-hidden="true" className="hero-fallback" />
    {mode === "fallback" && <LabsBackground />}
    <div className="hero-grid">
      <div className="hero-copy">
        <p className="eyebrow">{content.hero.eyebrow}</p>
        <h1 id="hero-heading" aria-label={content.hero.heading.replace(" / ", " ")}>
          <span><WordReveal text={words[0]} /></span>
          <span className="accent-line"><WordReveal text={words[1]} /></span>
        </h1>
        <p className="hero-subheading">{content.hero.subheading}</p>
        <div className="hero-actions">
          <WhatsAppCta href={content.hero.whatsappLink}>{content.hero.primaryCta}</WhatsAppCta>
          <a className="text-link" href={content.hero.secondaryHref}>{content.hero.secondaryCta} <span aria-hidden="true">›</span></a>
        </div>
      </div>
      <div className="hero-visual">
        <span className="sr-only">{content.hero.coreDescription}</span>
        <div className="scene-slot hero-core-slot" data-scene-anchor="hero">
          {showStaticCore && <IntelligenceCore retired={mode === "webgl"} />}
        </div>
      </div>
    </div>
    <div className="hero-index" aria-hidden="true"><span>HTL / 001</span><span>Dhaka · Bangladesh</span></div>
  </section>;
}
