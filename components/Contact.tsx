import { useContent } from "./LanguageProvider";

import { SectionLabel } from "./SectionLabel";

/*
  Contact (#contact). Large, 44px+ tap targets, descriptive link text.
  The StickyWhatsApp button hides while this section is on screen.
*/
export function Contact() {
  const content = useContent();
  return (
    <section id="contact" className="border-b border-paper/10" aria-labelledby="contact-heading">
      <div className="mx-auto grid max-w-6xl grid-cols-12 gap-8 px-6 py-20 md:px-8 md:py-24">
        <div className="col-span-12 md:col-span-4">
          <SectionLabel index="07" label={content.contact.heading} className="text-teal" />
          <h2
            id="contact-heading"
            className="mt-6 font-heading text-4xl tracking-[-0.03em] text-paper md:text-5xl"
          >
            {content.contact.heading}
          </h2>
          <p className="mt-6 text-paper/60">{content.contact.note}</p>
        </div>
        <div className="col-span-12 md:col-span-7 md:col-start-6">
          <ul className="border-y border-paper/10 divide-y divide-paper/10">
            <li>
              <a
                href={content.contact.phoneHref}
                className="flex min-h-14 items-center justify-between gap-4 text-xl text-paper hover:text-teal md:text-2xl"
              >
                <span className="font-heading tracking-[-0.03em]">{content.contact.phone}</span>
                <span aria-hidden="true" className="font-mono text-xs text-paper/40">
                  wa.me
                </span>
              </a>
            </li>
            <li>
              <a
                href={`mailto:${content.contact.email}`}
                className="flex min-h-14 items-center justify-between gap-4 text-xl text-paper hover:text-teal md:text-2xl"
              >
                <span className="font-heading tracking-[-0.03em]">{content.contact.email}</span>
                <span aria-hidden="true" className="font-mono text-xs text-paper/40">
                  email
                </span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
