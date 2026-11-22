"use client";

import { SectionMarker } from "./SectionMarker";
import { useContent } from "./ContentProvider";

export function WorkIndex() {
  const { work } = useContent();

  return (
    <section
      id="work"
      className="work-section work-section-proof work-page border-b border-body/10"
      aria-labelledby="work-index-heading"
    >
      <SectionMarker index="007" />
      <div className="work-page-inner scene-copy">
        <p className="eyebrow">{work.eyebrow}</p>
        <h1 id="work-index-heading">{work.heading}</h1>
        <p className="work-index-intro">{work.intro}</p>
        <p className="work-honesty-note">{work.honestyNote}</p>
        <ol className="work-index-list">
          {work.cases.map((item) => (
            <li key={item.slug} className="work-index-item">
              <div className="work-case-meta">
                <span className="tag">{item.tag}</span>
                <span className="work-case-discipline">{item.discipline}</span>
              </div>
              <h2 className="work-index-title">
                <a href={`/work/${item.slug}`}>{item.title}</a>
              </h2>
              <p>{item.summary}</p>
              <a className="text-link" href={`/work/${item.slug}`}>
                {work.readCta} <span aria-hidden="true">›</span>
              </a>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
