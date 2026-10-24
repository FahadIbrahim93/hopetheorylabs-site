import { useContent } from "./LanguageProvider";

import { SectionLabel } from "./SectionLabel";

/*
  Static 3-step timeline (ol). Scroll/click highlighting and aria-current
  arrive with Step 5; the markup is already the interactive-ready list.
*/
export function HowItWorksTimeline() {
  const content = useContent();
  return (
    <section id="how" className="border-b border-paper/10" aria-labelledby="how-heading">
      <div className="mx-auto grid max-w-6xl grid-cols-12 gap-8 px-6 py-20 md:px-8 md:py-24">
        <div className="col-span-12 md:col-span-4">
          <SectionLabel index="01" label={content.howItWorks.heading} className="text-teal" />
          <h2
            id="how-heading"
            className="mt-6 font-heading text-4xl tracking-[-0.03em] text-paper md:text-5xl"
          >
            {content.howItWorks.heading}
          </h2>
        </div>
        <div className="col-span-12 md:col-span-7 md:col-start-6">
          <ol className="border-y border-paper/10 divide-y divide-paper/10">
            {content.howItWorks.steps.map((step, index) => (
              <li key={step} className="grid grid-cols-12 items-baseline gap-4 py-8">
                <span className="col-span-2 font-mono text-sm text-teal md:col-span-1">
                  0{index + 1}
                </span>
                <span className="col-span-10 text-lg text-paper md:col-span-11 md:text-xl">
                  {step}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
