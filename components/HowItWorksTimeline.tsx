"use client";

import { useEffect, useRef, useState } from "react";

import { useContent } from "./LanguageProvider";

import { SectionLabel } from "./SectionLabel";

/*
  3-step timeline (issue #5): steps highlight on scroll and on click/tap,
  keyboard accessible. Each step is a real <button> with a visual label;
  the active step carries aria-current="step". Visual state is a quiet CSS
  transition (globals.css tokens), instant under reduced motion.

  Scroll behaviour: a center-band IntersectionObserver picks whichever step
  crosses the viewport middle; click/tap (or keyboard) also sets the active
  step directly. Reduced motion: same logic, transitions are instant.
*/
export function HowItWorksTimeline() {
  const content = useContent();
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLOListElement>(null);

  // Scroll-driven highlight: the step crossing the viewport middle.
  useEffect(() => {
    const list = listRef.current;
    if (!list || typeof IntersectionObserver === "undefined") return;

    const byIndex = new Map<Element, number>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const index = byIndex.get(entry.target);
            if (index !== undefined) setActive(index);
          }
        }
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: 0 },
    );
    list.querySelectorAll("li").forEach((li, i) => {
      byIndex.set(li, i);
      io.observe(li);
    });
    return () => io.disconnect();
  }, []);

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
          <ol ref={listRef} className="border-y border-paper/10 divide-y divide-paper/10">
            {content.howItWorks.steps.map((step, index) => (
              <li
                key={step}
                data-active={active === index}
                aria-current={active === index ? "step" : undefined}
                className="step grid grid-cols-12 items-baseline gap-4 py-8"
              >
                <button
                  type="button"
                  onClick={() => setActive(index)}
                  className="col-span-12 grid grid-cols-12 items-baseline gap-4 text-left"
                >
                  <span className="step-number col-span-2 font-mono text-sm text-teal md:col-span-1">
                    0{index + 1}
                  </span>
                  <span
                    className={`step-text col-span-10 text-lg md:col-span-11 md:text-xl ${
                      active === index ? "text-paper" : "text-paper/50"
                    }`}
                  >
                    {step}
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
