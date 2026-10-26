import type { WorkCaseStudy } from "@/content/types";

import { useContent } from "./LanguageProvider";

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
              {item.link && (
                <p>
                  <a className="text-link" href={item.link.href} target="_blank" rel="noopener noreferrer">
                    {item.link.label} <span aria-hidden="true">›</span>
                  </a>
                </p>
              )}
            </div>
            {item.phoneDemo && <PhoneDemo {...item.phoneDemo} />}
          </li>
        ))}
      </ol>
    </section>
  );
}
