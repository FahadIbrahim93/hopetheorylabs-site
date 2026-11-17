"use client";

import { SectionMarker } from "./SectionMarker";
import { useContent } from "./ContentProvider";

export function About({ headingLevel = 2 }: { headingLevel?: 1 | 2 }) {
  const content = useContent();
  const Heading = (headingLevel === 1 ? "h1" : "h2") as "h1" | "h2";
  return (
    <section id="about" className="about-section about-section-html border-b border-body/10" aria-labelledby="about-heading">
      <SectionMarker index="008" />
      <div className="about-inner scene-copy">
        <p className="eyebrow">{content.about.eyebrow}</p>
        <Heading id="about-heading">{content.about.heading}</Heading>
        <p>{content.about.text}</p>
        <ul className="about-founder" role="list">
          <li>
            <b>{content.about.founder.name}</b>
            <span>{content.about.founder.role}</span>
          </li>
        </ul>
      </div>
    </section>
  );
}
