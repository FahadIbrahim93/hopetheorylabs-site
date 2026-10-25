"use client";

import dynamic from "next/dynamic";
import { Component, useCallback, useEffect, useState, useSyncExternalStore, type ReactNode } from "react";

import { CursorRing } from "./CursorRing";
import { IntroOverlay } from "./IntroOverlay";
import { NodeLabels } from "./NodeLabels";
import { detectTier, detectWebGL, readOverride } from "./quality";
import { experienceActions, getDiscrete, subscribeDiscrete, type QualityTier } from "./store";
import { useNarrativeTracking } from "./useNarrativeTracking";

const ExperienceCanvas = dynamic(() => import("./ExperienceCanvas"), { ssr: false });

export function useExperienceMode() {
  return useSyncExternalStore(subscribeDiscrete, () => getDiscrete().mode, () => "pending" as const);
}

function useReducedMotion() {
  return useSyncExternalStore(subscribeDiscrete, () => getDiscrete().reducedMotion, () => false);
}

export function Experience() {
  useNarrativeTracking();
  const mode = useExperienceMode();
  const reduced = useReducedMotion();
  const [plan, setPlan] = useState<{ tier: QualityTier; introStart: number } | null>(null);
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
      setPlan({ tier: override ?? detectTier(), introStart: performance.now() });
    };
    if (document.readyState === "complete") {
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
    document.documentElement.classList.toggle("nogl", mode === "fallback");
  }, [mode]);

  if (!plan || mode === "fallback") return null;

  return (
    <>
      <IntroOverlay />
      <CursorRing />
      <div className={`experience-layer${live ? " is-live" : ""}`} aria-hidden="true">
        <ExperienceBoundary onError={handleFailure}>
          <ExperienceCanvas
            initialTier={plan.tier}
            reduced={reduced}
            introStart={plan.introStart}
            onReady={handleReady}
            onFailure={handleFailure}
          />
        </ExperienceBoundary>
        <NodeLabels />
      </div>
    </>
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
