"use client";

import { useEffect, useState } from "react";

import { useContent } from "./LanguageProvider";

const SECTIONS = [
  { id: "top", label: "Origin" },
  { id: "method", label: "Digital self" },
  { id: "shift", label: "Intelligence" },
  { id: "flow", label: "Living flow" },
  { id: "how", label: "Process" },
  { id: "services", label: "Services" },
  { id: "work", label: "Work" },
  { id: "about", label: "Studio" },
  { id: "contact", label: "Contact" },
] as const;

/*
  Desktop editorial rail: scroll-linked progress + section ticks.
  Pure DOM + IntersectionObserver — no external animation libraries.
*/
export function NarrativeRail() {
  const { studio } = useContent();
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      setProgress(max > 0 ? doc.scrollTop / max : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const idx = SECTIONS.findIndex((s) => s.id === visible.target.id);
        if (idx >= 0) setActive(idx);
      },
      { rootMargin: "-35% 0px -45% 0px", threshold: [0, 0.15, 0.4] },
    );
    for (const { id } of SECTIONS) {
      const node = document.getElementById(id);
      if (node) observer.observe(node);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <nav className="narrative-rail" aria-label="Page narrative">
      <span className="narrative-rail-label">{studio.railLabel}</span>
      <div className="narrative-rail-track">
        <i className="narrative-rail-fill" style={{ height: `${Math.round(progress * 100)}%` }} />
        <ol className="narrative-rail-stops">
          {SECTIONS.map((section, index) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className={index === active ? "is-active" : undefined}
                aria-current={index === active ? "true" : undefined}
              >
                <span className="narrative-rail-dot" aria-hidden="true" />
                <span className="narrative-rail-name">{section.label}</span>
              </a>
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}
