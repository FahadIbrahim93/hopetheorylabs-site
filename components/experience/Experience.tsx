"use client";

import dynamic from "next/dynamic";
import { Component, useCallback, useEffect, useState, useSyncExternalStore, type ReactNode } from "react";

import { NodeLabels } from "./NodeLabels";
import { detectTier, detectWebGL, readOverride } from "./quality";
import { experienceActions, getDiscrete, subscribeDiscrete, type QualityTier } from "./store";
import { useNarrativeTracking } from "./useNarrativeTracking";

/*
  Progressive enhancement entry point for the 3D experience.

  - The static page (SVG core, HTML copy) renders first and is complete on
    its own. Nothing here blocks text, CTAs or navigation.
  - After the window `load` event we check WebGL support, pick a quality
    tier and lazy-load the Three.js chunk. When the first frames have drawn,
    mode flips to "webgl" and the SVG crossfades out.
  - Any failure (no WebGL, shader link error, context loss, runtime throw)
    flips mode to "fallback", which restores the SVG core and the light 2D
    particle field. `?experience=fallback` forces that path for review.
*/

const ExperienceCanvas = dynamic(() => import("./ExperienceCanvas"), { ssr: false });

export function useExperienceMode() {
  return useSyncExternalStore(subscribeDiscrete, () => getDiscrete().mode, () => "pending" as const);
}

/* Live `prefers-reduced-motion`; `useNarrativeTracking` keeps the store current when the preference changes. */
function useReducedMotion() {
  return useSyncExternalStore(subscribeDiscrete, () => getDiscrete().reducedMotion, () => false);
}

export function Experience() {
  useNarrativeTracking();
  const mode = useExperienceMode();
  const reduced = useReducedMotion();
  const [plan, setPlan] = useState<{ tier: QualityTier } | null>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const decide = () => {
      if (cancelled) return;
      const override = readOverride();
      if (override === "fallback" || !detectWebGL()) {
        experienceActions.setMode("fallback");
        return;
      }
      setPlan({ tier: override ?? detectTier() });
    };
    if (document.readyState === "complete") {
      // Yield once so hydration work finishes before the 3D chunk is fetched.
      const id = window.setTimeout(decide, 50);
      return () => {
        cancelled = true;
        window.clearTimeout(id);
      };
    }
    window.addEventListener("load", decide, { once: true });
    return () => {
      cancelled = true;
      window.removeEventListener("load", decide);
    };
  }, []);

  const handleReady = useCallback(() => {
    experienceActions.setMode("webgl");
    setLive(true);
  }, []);

  const handleFailure = useCallback((reason: string) => {
    console.warn(`[experience] falling back to the static core (${reason})`);
    setPlan(null);
    setLive(false);
    experienceActions.setMode("fallback");
  }, []);

  useEffect(() => {
    document.documentElement.dataset.experience = mode;
  }, [mode]);

  if (!plan || mode === "fallback") return null;

  return (
    <div className={`experience-layer${live ? " is-live" : ""}`} aria-hidden="true">
      <ExperienceBoundary onError={handleFailure}>
        <ExperienceCanvas initialTier={plan.tier} reduced={reduced} onReady={handleReady} onFailure={handleFailure} />
      </ExperienceBoundary>
      <NodeLabels />
    </div>
  );
}

class ExperienceBoundary extends Component<{ children: ReactNode; onError: (reason: string) => void }, { broken: boolean }> {
  state = { broken: false };
  static getDerivedStateFromError() {
    return { broken: true };
  }
  componentDidCatch(error: unknown) {
    console.error("[experience] runtime error", error);
    this.props.onError("runtime");
  }
  render() {
    return this.state.broken ? null : this.props.children;
  }
}
