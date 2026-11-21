"use client";

import { useEffect } from "react";

import { IntelligenceCore } from "./IntelligenceCore";
import LabsBackground from "./LabsBackground";

/**
 * Static scene layer for standalone routes (/pricing, /services) so the
 * transparent pricing cards read against the same intelligence-core scene
 * the homepage shows as its WebGL fallback.
 *
 * This is the first-class static fallback from docs/DESIGN_RULES.md — the
 * inline-SVG IntelligenceCore plus the 2D LabsBackground particle field —
 * not the WebGL Three.js tree, which only ever mounts on the homepage and
 * would break static export here.
 *
 * It mirrors what the homepage shows when WebGL is absent: a full-viewport
 * intelligence core (orbit rings, radar sweep, signal pulses, eight labelled
 * source nodes) over a gold particle field, with the studio drafting grid.
 *
 * Behaviour mirrors the homepage CSS contract:
 *  - html.dataset.experience = "fallback" + html.nogl, so rules like
 *    html[data-experience="webgl"] .hero-fallback / html.nogl .hero-visual-static
 *    behave consistently even though these routes have no hero.
 *  - Mounts after window load (never blocks first paint; keeps static export clean).
 *  - pointer-events: none, aria-hidden — like the WebGL experience layer.
 */
export function StandaloneAtmosphere() {
  useEffect(() => {
    const root = document.documentElement;
    if (root.dataset.experience) return; // leave any live WebGL override alone
    root.dataset.experience = "fallback";
    root.classList.add("nogl");
    return () => {
      // Only clear what this mount set, so a page that later mounts WebGL
      // (none here, but be tidy) can still take over.
      if (root.dataset.experience === "fallback") {
        root.dataset.experience = "";
      }
      root.classList.remove("nogl");
    };
  }, []);

  return (
    <div
      className="experience-layer is-live"
      aria-hidden="true"
      style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}
    >
      <div className="site-shell" style={{ position: "relative", height: "100%" }}>
        {/* Gold particle field — the quiet supporting layer behind the core. */}
        <LabsBackground />
        {/* Static intelligence core: the scene the transparent cards read through. */}
        <div
          className="intelligence-core"
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "clamp(80px, 12vw, 160px) var(--section-pad-x)",
            pointerEvents: "none",
          }}
        >
          <span className="sr-only">Connected intelligence scene</span>
          <IntelligenceCore />
        </div>
        {/* Studio drafting grid — complements body grain/vignette. */}
        <div className="studio-grid" aria-hidden="true" />
      </div>
    </div>
  );
}
