"use client";

import { useEffect, useRef, type ReactNode } from "react";

/*
  Scroll-triggered reveal (issue #5): fade + 12px rise, once per element.

  CSS-first for the no-JS rule: styles only activate when `html.js` is set
  by the tiny head script, so with JavaScript disabled the content is fully
  visible from the start. With reduced motion the class is applied
  immediately (no transition) — instant reveal.
  Timing/easing tokens: --ease-signature / 600ms (globals.css).
*/
export function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced || typeof IntersectionObserver === "undefined") {
      el.classList.add("reveal", "reveal-in");
      return;
    }

    el.classList.add("reveal");
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.classList.add("reveal-in");
            io.disconnect();
          }
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
