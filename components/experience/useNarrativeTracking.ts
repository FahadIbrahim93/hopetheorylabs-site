"use client";

import { useEffect } from "react";

import { NARRATIVE, SECTION_IDS } from "./narrative";
import { experienceActions, frameState, invalidateFrame } from "./store";

/*
  Measures the page once per layout change (resize, fonts, ResizeObserver on
  <main>) and converts scroll position into narrative progress on every
  scroll event. Only cheap arithmetic happens per scroll; layout reads happen
  on layout changes. Pointer position is tracked for parallax and node
  proximity (mouse/pen only; touch never steals scroll).
*/

const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

function measure() {
  const vh = window.innerHeight;
  const vw = window.innerWidth;
  const scrollY = window.scrollY;
  frameState.vh = vh;
  frameState.vw = vw;

  const sections = [];
  for (const id of SECTION_IDS) {
    const el = document.getElementById(id);
    if (!el) continue;
    const rect = el.getBoundingClientRect();
    sections.push({ id, top: rect.top + scrollY, height: rect.height });
  }
  frameState.sections = sections;

  frameState.anchors.clear();
  document.querySelectorAll<HTMLElement>("[data-scene-anchor]").forEach((el) => {
    const name = el.dataset.sceneAnchor;
    if (!name) return;
    const rect = el.getBoundingClientRect();
    frameState.anchors.set(name, {
      top: rect.top + scrollY,
      left: rect.left,
      width: rect.width,
      height: rect.height,
    });
  });
  updateProgress();
}

/*
  Scroll position at which a block is "in focus": vertically centred when
  shorter than the viewport, otherwise aligned to the top. Progress is linear
  between consecutive focus positions.
*/
function focusScroll(top: number, height: number, vh: number) {
  return top - Math.max(0, vh - Math.min(height, vh)) / 2;
}

/*
  Each section's focus point is its scene slot when one is laid out (so the
  keyframe lands exactly when the visual is centred, however tall the section
  is on a narrow screen), otherwise the section itself. Focus points are kept
  monotonic so progress never runs backwards while scrolling forwards.
*/
function focusPoints() {
  const { sections, anchors, vh } = frameState;
  const focus: number[] = [];
  let previous = -Infinity;
  sections.forEach((section, i) => {
    const anchorId = NARRATIVE[i]?.key.anchor;
    const anchor = anchorId ? anchors.get(anchorId) : undefined;
    const point =
      anchor && anchor.height > 0
        ? focusScroll(anchor.top, anchor.height, vh)
        : focusScroll(section.top, section.height, vh);
    previous = Math.max(previous, point);
    focus.push(previous);
  });
  return focus;
}

function updateProgress() {
  const { sections } = frameState;
  const scrollY = window.scrollY;
  frameState.scrollY = scrollY;
  if (sections.length < 2) {
    frameState.t = 0;
    return;
  }
  const focus = focusPoints();
  let t = 0;
  if (scrollY <= focus[0]) t = 0;
  else if (scrollY >= focus[focus.length - 1]) t = focus.length - 1;
  else {
    for (let i = 0; i < focus.length - 1; i++) {
      if (scrollY >= focus[i] && scrollY < focus[i + 1]) {
        const span = Math.max(1, focus[i + 1] - focus[i]);
        t = i + (scrollY - focus[i]) / span;
        break;
      }
    }
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
        measure();
        invalidateFrame();
      });
    };

    const onScroll = () => {
      updateProgress();
      invalidateFrame();
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", scheduleMeasure);
    window.addEventListener("orientationchange", scheduleMeasure);
    document.fonts?.ready.then(scheduleMeasure).catch(() => {});
    window.addEventListener("load", scheduleMeasure);

    const main = document.getElementById("main");
    const ro = main && typeof ResizeObserver !== "undefined" ? new ResizeObserver(scheduleMeasure) : null;
    if (main && ro) ro.observe(main);

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      frameState.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      frameState.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
      frameState.pointer.active = true;
    };
    const onPointerLeave = () => {
      frameState.pointer.active = false;
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("blur", onPointerLeave);

    return () => {
      if (raf) window.cancelAnimationFrame(raf);
      reduced.removeEventListener("change", onReduced);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", scheduleMeasure);
      window.removeEventListener("orientationchange", scheduleMeasure);
      window.removeEventListener("load", scheduleMeasure);
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("blur", onPointerLeave);
      ro?.disconnect();
    };
  }, []);
}
