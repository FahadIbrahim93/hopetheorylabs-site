import { SectionMarker } from "./SectionMarker";
import { useContent } from "./ContentProvider";
import { WorkCaseView } from "./WorkCaseView";

export function WorkSection() {
  const { work } = useContent();

  return (
    <section
      id="work"
      className="work-section work-section-proof border-b border-body/10"
      aria-labelledby="work-heading"
    >
      <SectionMarker index="007" />
      <div className="work-proof-intro scene-copy">
        <p className="eyebrow">{work.eyebrow}</p>
        <h2 id="work-heading">{work.heading}</h2>
        <p>{work.intro}</p>
        <p className="work-honesty-note">{work.honestyNote}</p>
      </div>
      <ol className="work-case-list">
        {work.cases.map((item) => (
          <li key={item.slug} className="work-case-wrap" id={`work-${item.slug}`}>
            <WorkCaseView
              item={item}
              headingLevel="h3"
              problemLabel={work.labels.problem}
              demonstratesLabel={work.labels.demonstrates}
              pageHref={`/work/${item.slug}`}
              pageLabel={work.readCta}
            />
          </li>
        ))}
      </ol>
    </section>
  );
}
