import type { WorkCaseStudy } from "@/content/types";

import { SectionMarker } from "./SectionMarker";
import { useContent } from "./LanguageProvider";

function GamePreview({
  imageSrc,
  imageAlt,
  playHref,
  playLabel,
}: NonNullable<WorkCaseStudy["gamePreview"]>) {
  return (
    <div className="game-preview" role="group" aria-label={imageAlt}>
      <div className="game-preview-bezel">
        <img className="game-preview-shot" src={imageSrc} alt={imageAlt} width={640} height={360} loading="lazy" decoding="async" />
        <div className="game-preview-scan" aria-hidden="true" />
      </div>
      <a className="game-preview-cta" href={playHref} target="_blank" rel="noopener noreferrer">
        {playLabel} <span aria-hidden="true">›</span>
      </a>
    </div>
  );
}

function PhoneDemo({
  storeName,
  items,
  cta,
  message,
}: NonNullable<WorkCaseStudy["phoneDemo"]>) {
  return (
    <div
      className="phone-mockup"
      role="img"
      aria-label={`Illustrative phone mockup for ${storeName}: ${items.join(", ")}`}
    >
      <div className="phone-top">
        <span>09:41</span>
        <span>● ● ▰</span>
      </div>
      <div className="phone-store-name">
        {storeName} <span>MENU</span>
      </div>
      {items.map((item) => (
        <div className="phone-product" key={item}>
          <span>{item}</span>
          <b>ADD</b>
        </div>
      ))}
      <div className="phone-order">{cta}</div>
      <div className="phone-message">{message}</div>
      <div className="phone-home" />
    </div>
  );
}

export function WorkSection() {
  const { work } = useContent();

  return (
    <section id="work" className="work-section work-section-proof border-b border-paper/10" aria-labelledby="work-heading">
      <SectionMarker index="007" />
      <div className="work-proof-intro scene-copy">
        <p className="eyebrow">{work.eyebrow}</p>
        <h2 id="work-heading">{work.heading}</h2>
        <p>{work.intro}</p>
        <p className="work-honesty-note">{work.honestyNote}</p>
      </div>
      <ol className="work-case-list">
        {work.cases.map((item) => (
          <li key={item.slug} className="work-case" id={`work-${item.slug}`}>
            <div className="work-case-copy scene-copy">
              <div className="work-case-meta">
                <span className="tag">{item.tag}</span>
                <span className="work-case-discipline">{item.discipline}</span>
              </div>
              <h3 className="work-case-title">{item.title}</h3>
              <p>{item.summary}</p>
              <ul className="work-deliverables">
                {item.deliverables.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
              {(item.link || item.secondaryLink) && (
                <p className="work-case-links">
                  {item.link && (
                    <a className="text-link" href={item.link.href} target="_blank" rel="noopener noreferrer">
                      {item.link.label} <span aria-hidden="true">›</span>
                    </a>
                  )}
                  {item.link && item.secondaryLink && <span className="work-link-sep" aria-hidden="true"> · </span>}
                  {item.secondaryLink && (
                    <a className="text-link" href={item.secondaryLink.href} target="_blank" rel="noopener noreferrer">
                      {item.secondaryLink.label} <span aria-hidden="true">›</span>
                    </a>
                  )}
                </p>
              )}
            </div>
            {item.gamePreview && <GamePreview {...item.gamePreview} />}
            {item.phoneDemo && <PhoneDemo {...item.phoneDemo} />}
          </li>
        ))}
      </ol>
    </section>
  );
}
