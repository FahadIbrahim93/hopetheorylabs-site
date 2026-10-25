"use client";

import { useEffect, useState } from "react";

import { experienceActions } from "./experience/store";
import { useContent } from "./LanguageProvider";

export function HowItWorksTimeline() {
  const content = useContent();
  const [active, setActive] = useState(0);

  useEffect(() => {
    experienceActions.setStep(active);
  }, [active]);

  return (
    <section id="how" className="how-section how-section-html border-b border-paper/10" aria-labelledby="how-heading">
      <div className="how-head scene-copy">
        <p className="eyebrow">{content.howItWorks.eyebrow}</p>
        <h2 id="how-heading">{content.howItWorks.heading}</h2>
        <div className="how-steps" role="group" aria-label={content.howItWorks.heading}>
          {content.howItWorks.steps.map((step, index) => (
            <button
              type="button"
              key={step.label}
              aria-current={active === index ? "step" : undefined}
              className={`how-step${active === index ? " is-active" : ""}`}
              onClick={() => {
                setActive(index);
                experienceActions.requestBurst();
              }}
            >
              <b>0{index + 1}</b>
              {step.label}
            </button>
          ))}
        </div>
        <p className="how-step-text" aria-live="polite">
          {content.howItWorks.steps[active]?.description}
        </p>
      </div>
    </section>
  );
}
