import { en as content } from "@/content/en";

import { SectionLabel } from "./SectionLabel";

/*
  Rollers Republic — always labelled "Concept", never client work.
  TODO(issue #2): real concept screenshots belong in public/work/ inside the
  framed area below. Not faked, per AGENTS.md — asked on the issue.
*/
export function WorkCard() {
  return (
    <section id="work" className="border-b border-paper/10" aria-labelledby="work-heading">
      <div className="mx-auto grid max-w-6xl grid-cols-12 gap-8 px-6 py-20 md:px-8 md:py-24">
        <div className="col-span-12 md:col-span-4">
          <SectionLabel index="03" label={content.work.heading} className="text-teal" />
          <h2
            id="work-heading"
            className="mt-6 font-heading text-4xl tracking-[-0.03em] text-paper md:text-5xl"
          >
            {content.work.heading}
          </h2>
        </div>
        <div className="col-span-12 md:col-span-7 md:col-start-6">
          <div
            aria-hidden="true"
            className="h-64 w-full rounded-lg border border-paper/15 bg-paper/5 bg-[radial-gradient(var(--color-paper)_1px,transparent_1px)] [background-size:16px_16px] [background-position:center] md:h-96"
          />
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <h3 className="font-heading text-c-3xl tracking-[-0.03em] text-paper">
              <a
                href={content.work.link}
                target="_blank"
                rel="noreferrer"
                className="underline-offset-4 hover:text-teal hover:underline"
              >
                {content.work.title}
              </a>
            </h3>
            <span className="rounded-full border border-teal/40 px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-teal">
              {content.work.tag}
            </span>
          </div>
          <p className="mt-4 max-w-md text-paper/70">{content.work.description}</p>
        </div>
      </div>
    </section>
  );
}
