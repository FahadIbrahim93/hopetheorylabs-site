import { useContent } from "./LanguageProvider";

import { SectionLabel } from "./SectionLabel";
import { SpeedSlider } from "./SpeedSlider";

/*
  "What you get" — an editorial numbered list on hairline rules, offset
  columns on desktop. Deliberately not a generic icon-card grid
  (docs/DESIGN_RULES.md). Local shop/café/clinic illustrations come later
  (Step 5), so nothing is invented here.
*/
export function FeatureGrid() {
  const content = useContent();
  return (
    <section className="border-b border-paper/10" aria-labelledby="what-heading">
      <div className="mx-auto grid max-w-6xl grid-cols-12 gap-8 px-6 py-20 md:px-8 md:py-24">
        <div className="col-span-12 md:col-span-4">
          <SectionLabel index="02" label={content.whatYouGet.heading} className="text-teal" />
          <h2
            id="what-heading"
            className="mt-6 font-heading text-4xl tracking-[-0.03em] text-paper md:text-5xl"
          >
            {content.whatYouGet.heading}
          </h2>
        </div>
        <div className="col-span-12 md:col-span-7 md:col-start-6">
          <ul className="grid gap-x-16 md:grid-cols-2">
            {content.whatYouGet.items.map((item, index) => (
              <li
                key={item}
                className={`border-t border-paper/10 py-8 ${index % 2 === 1 ? "md:mt-16" : ""}`}
              >
                <p className="font-mono text-xs text-teal">0{index + 1}</p>
                <p className="mt-4 font-heading text-2xl tracking-[-0.03em] text-paper">
                  {item}
                </p>
              </li>
            ))}
          </ul>
          <SpeedSlider />
        </div>
      </div>
    </section>
  );
}
