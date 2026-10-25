"use client";
import { useEffect, useRef, useState } from "react";
import { experienceActions } from "./experience/store";
import { useContent } from "./LanguageProvider";
export function HowItWorksTimeline() {
  const content = useContent();
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  // The 3D scene mirrors the active step (map / digital self / connect / act).
  useEffect(() => {
    experienceActions.setStep(active);
  }, [active]);
  useEffect(() => {
    const root = listRef.current;
    if (!root || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      const index = visible ? Number((visible.target as HTMLElement).dataset.index) : NaN;
      if (Number.isInteger(index)) setActive(index);
    }, { threshold: [0.35, 0.65] });
    root.querySelectorAll("[data-index]").forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);
  return <section id="how" className="how-section border-b border-paper/10" aria-labelledby="how-heading">
    <div className="how-head"><p className="eyebrow">{content.howItWorks.eyebrow}</p><h2 id="how-heading">{content.howItWorks.heading}</h2><div className="scene-slot how-visual" data-scene-anchor="how" aria-hidden="true" /></div>
    <div className="step-list" ref={listRef} role="group" aria-label={content.howItWorks.heading}>
      {content.howItWorks.steps.map((step, index) => <button type="button" key={step.label} data-index={index} aria-current={active === index ? "step" : undefined} className={`story-step ${active === index ? "is-active" : ""}`} onClick={() => setActive(index)}>
        <span className="step-count">0{index + 1}</span><span className="step-label">{step.label}</span><span className="step-description">{step.description}</span><span className="step-arrow" aria-hidden="true">↗</span>
      </button>)}
    </div>
  </section>;
}
