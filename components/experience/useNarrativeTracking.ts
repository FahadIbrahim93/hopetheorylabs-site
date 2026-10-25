"use client";

import { useEffect } from "react";
import { PROGRESS_ANCHORS, stageProgress } from "./narrative";
import { experienceActions, frameState, invalidateFrame } from "./store";

const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

function measureSections() {
  const scrollY = window.scrollY;
  frameState.vh = window.innerHeight;
  frameState.vw = window.innerWidth;
  frameState.scrollY = scrollY;

  const sections = [];
  const tops: number[] = [];
  for (const id of PROGRESS_ANCHORS) {
    const el = document.getElementById(id);
    if (!el) {
      tops.push(tops.length ? tops[tops.length - 1] : 0);
      continue;
    }
    const rect = el.getBoundingClientRect();
    const top = rect.top + scrollY;
    sections.push({ id, top, height: rect.height });
    tops.push(top);
  }
  frameState.sections = sections;
  frameState.ppTarget = stageProgress(scrollY, tops);

  const maxIndex = Math.max(0, sections.length - 1);
  let t = 0;
  for (let i = 0; i < sections.length; i++) {
    if (scrollY >= sections[i].top) t = i;
  }
  const next = sections[Math.min(t + 1, maxIndex)];
  const cur = sections[t];
  if (next && cur && scrollY > cur.top && next.top > cur.top) {
    t += (scrollY - cur.top) / (next.top - cur.top);
  }
  frameState.t = t;
}

export function useNarrativeTracking() {
  useEffect(() => {
    const reduced = window.matchMedia(REDUCED_QUERY);
    experienceActions.setReducedMotion(reduced.matches);
    const onReduced = () => experienceActions.setReducedMotion(reduced.matches);
    reduced.addEventListener("change", onReduced);

    let raf = 0;
    const scheduleMeasure = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        measureSections();
        invalidateFrame();
      });
    };

    const onScroll = () => {
      measureSections();
      invalidateFrame();
    };

    measureSections();

    let pd = false;
    let px = 0;
    let mv = 0;

    const blockTarget = (target: EventTarget | null) => {
      if (!(target instanceof Element)) return false;
      return Boolean(
        target.closest(
          "a,button,input,textarea,label,.flow-pill,.flow-node,.primary-cta,.cta,.text-link,.site-header,.contact-form,.hero-copy,.story-copy,.flow-copy,.how-head,.services-intro,.work-copy,.about-inner,.contact-intro,.contact-main",
        ),
      );
    };

    const onPointerDown = (e: PointerEvent) => {
      if (blockTarget(e.target)) return;
      pd = true;
      px = e.clientX;
      mv = 0;
    };

    const onPointerMove = (e: PointerEvent) => {
      frameState.pointer.x = e.clientX / window.innerWidth - 0.5;
      frameState.pointer.y = e.clientY / window.innerHeight - 0.5;
      frameState.pointer.active = e.pointerType !== "touch";
      if (pd && e.pointerType === "mouse") {
        const dx = e.clientX - px;
        px = e.clientX;
        mv += Math.abs(dx);
        frameState.dragDx += dx;
        invalidateFrame();
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      if (pd && mv < 6 && !blockTarget(e.target) && !reduced.matches) {
        frameState.burstScreen = { x: e.clientX, y: e.clientY };
        invalidateFrame();
      }
      pd = false;
    };

    const onPointerLeave = () => {
      frameState.pointer.active = false;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", scheduleMeasure);
    window.addEventListener("orientationchange", scheduleMeasure);
    window.addEventListener("load", scheduleMeasure);
    document.fonts?.ready.then(scheduleMeasure).catch(() => {});
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", () => { pd = false; });
    document.documentElement.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("blur", onPointerLeave);

    const main = document.getElementById("main");
    const ro = main && typeof ResizeObserver !== "undefined" ? new ResizeObserver(scheduleMeasure) : null;
    if (main && ro) ro.observe(main);

    return () => {
      if (raf) window.cancelAnimationFrame(raf);
      reduced.removeEventListener("change", onReduced);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", scheduleMeasure);
      window.removeEventListener("orientationchange", scheduleMeasure);
      window.removeEventListener("load", scheduleMeasure);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      document.documentElement.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("blur", onPointerLeave);
      ro?.disconnect();
    };
  }, []);
}
