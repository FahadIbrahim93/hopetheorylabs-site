"use client";

import { useEffect, useRef } from "react";

import { useExperienceMode } from "./mode";

/** Desktop custom cursor ring (mouse only). */
export function CursorRing() {
  const mode = useExperienceMode();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mode !== "webgl") return;
    const el = ref.current;
    if (!el || window.matchMedia("(hover: none)").matches) return;

    let cx = 0;
    let cy = 0;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      cx += (e.clientX - cx) * 0.2;
      cy += (e.clientY - cy) * 0.2;
      el.style.opacity = "1";
      el.style.transform = `translate(${cx}px, ${cy}px)`;
    };
    const onOver = (e: PointerEvent) => {
      const t = e.target;
      if (!(t instanceof Element)) return;
      el.classList.toggle("is-hot", Boolean(t.closest("a,button,.flow-node,input,textarea,.primary-cta,.cta")));
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
    };
  }, [mode]);

  if (mode !== "webgl") return null;
  return <div ref={ref} className="experience-cursor" aria-hidden="true" />;
}
