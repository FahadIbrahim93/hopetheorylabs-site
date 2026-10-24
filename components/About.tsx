import { useContent } from "./LanguageProvider";

import { SectionLabel } from "./SectionLabel";

/*
  About — the factual line from SPEC only: no bios, roles, credentials,
  degrees, or photos (brand fact guardrails).
*/
export function About() {
  const content = useContent();
  return (
    <section className="border-b border-paper/10" aria-labelledby="about-heading">
      <div className="mx-auto grid max-w-6xl grid-cols-12 gap-8 px-6 py-20 md:px-8 md:py-24">
        <div className="col-span-12 md:col-span-4">
          <SectionLabel index="06" label={content.about.heading} className="text-teal" />
          <h2
            id="about-heading"
            className="mt-6 font-heading text-4xl tracking-[-0.03em] text-paper md:text-5xl"
          >
            {content.about.heading}
          </h2>
        </div>
        <div className="col-span-12 md:col-span-7 md:col-start-6">
          <p className="max-w-xl text-xl leading-relaxed text-paper md:text-2xl">
            {content.about.text}
          </p>
        </div>
      </div>
    </section>
  );
}
