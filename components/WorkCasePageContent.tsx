"use client";

import Link from "next/link";
import { SectionMarker } from "./SectionMarker";
import { useContent } from "./ContentProvider";
import { WorkCaseView } from "./WorkCaseView";

export function WorkCasePageContent({ slug }: { slug: string }) {
  const { work } = useContent();
  const item = work.cases.find((entry) => entry.slug === slug);
  if (!item) return null;

  return (
    <article
      className="work-section work-section-proof work-page border-b border-body/10"
      aria-labelledby="work-case-heading"
    >
      <SectionMarker index="007" />
      <div className="work-page-inner scene-copy">
        <p className="eyebrow">{work.eyebrow}</p>
        <p className="work-back-row">
          <Link className="text-link" href="/work">
            {work.back} <span aria-hidden="true">‹</span>
          </Link>
        </p>
        <WorkCaseView
          item={item}
          headingLevel="h1"
          headingId="work-case-heading"
          problemLabel={work.labels.problem}
          demonstratesLabel={work.labels.demonstrates}
        />
        {item.tag === "Concept" && <p className="work-honesty-note">{work.honestyNote}</p>}
      </div>
    </article>
  );
}
