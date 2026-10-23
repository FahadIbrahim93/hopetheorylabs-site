import { en as content } from "@/content/en";

import { SectionLabel } from "./SectionLabel";

/*
  AI services — Early access only, no prices, no hype copy (brand guardrails).
  The line itself links to WhatsApp, per SPEC.
*/
export function EarlyAccessAI() {
  return (
    <section className="border-b border-paper/10" aria-labelledby="early-heading">
      <div className="mx-auto grid max-w-6xl grid-cols-12 gap-8 px-6 py-20 md:px-8 md:py-24">
        <div className="col-span-12 md:col-span-4">
          <SectionLabel index="05" label={content.earlyAccess.heading} className="text-teal" />
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <h2
              id="early-heading"
              className="font-heading text-4xl tracking-[-0.03em] text-paper md:text-5xl"
            >
              {content.earlyAccess.heading}
            </h2>
            <span className="rounded-full border border-teal/40 px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-teal">
              {content.earlyAccess.tag}
            </span>
          </div>
        </div>
        <div className="col-span-12 md:col-span-7 md:col-start-6">
          <ul className="border-y border-paper/10 divide-y divide-paper/10">
            {content.earlyAccess.items.map((item) => (
              <li key={item} className="py-6 font-heading text-2xl tracking-[-0.03em] text-paper">
                {item}
              </li>
            ))}
          </ul>
          <a
            href={content.hero.whatsappLink}
            className="mt-8 inline-block min-h-11 text-lg text-teal underline-offset-4 hover:underline"
          >
            {content.earlyAccess.text}
          </a>
        </div>
      </div>
    </section>
  );
}
