import dynamic from "next/dynamic";
import { useContent } from "./LanguageProvider";
import { IntelligenceCore } from "./IntelligenceCore";
import { WhatsAppCta } from "./WhatsAppCta";
import { WordReveal } from "./WordReveal";

const LabsBackground = dynamic(() => import("./LabsBackground"), { ssr: false });
export function Hero() {
  const content = useContent();
  const words = content.hero.heading.split(". ");
  return <section id="top" className="hero-section" aria-labelledby="hero-heading">
    <div aria-hidden="true" className="hero-fallback" />
    <LabsBackground />
    <div className="hero-grid">
      <div className="hero-copy">
        <p className="eyebrow">{content.hero.eyebrow}</p>
        <h1 id="hero-heading" aria-label={content.hero.heading}>
          <span><WordReveal text={words[0] + "."} /></span>
          <span className="accent-line"><WordReveal text={words.slice(1).join(". ")} /></span>
        </h1>
        <p className="hero-subheading">{content.hero.subheading}</p>
        <div className="hero-actions">
          <WhatsAppCta href={content.hero.whatsappLink}>{content.hero.primaryCta}</WhatsAppCta>
          <a className="text-link" href={content.hero.secondaryHref}>{content.hero.secondaryCta} <span aria-hidden="true">›</span></a>
        </div>
      </div>
      <div className="hero-visual">
        <span className="sr-only">{content.hero.coreDescription}</span>
        <IntelligenceCore />
      </div>
    </div>
    <div className="hero-index" aria-hidden="true"><span>HTL / 001</span><span>Dhaka · Bangladesh</span></div>
  </section>;
}
