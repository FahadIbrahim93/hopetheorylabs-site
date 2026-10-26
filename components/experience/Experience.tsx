"use client";

import { Component, useCallback, useEffect, useState, useSyncExternalStore, type ReactNode } from "react";

import { CursorRing } from "./CursorRing";
import { IntroOverlay } from "./IntroOverlay";
import { NodeLabels } from "./NodeLabels";
import { detectTier, detectWebGL, isConstrainedDevice, readOverride } from "./quality";
import { experienceActions, getDiscrete, subscribeDiscrete, type QualityTier } from "./store";
import { useNarrativeTracking } from "./useNarrativeTracking";

type CanvasModule = typeof import("./ExperienceCanvas");
type CanvasComponent = CanvasModule["default"];

/*
  The WebGL module (three + r3f) is only ever requested on the allowed path:
  never on small screens, low-core CPUs, save-data or reduced motion, and on
  desktop only once the browser is idle (2.5s timeout) or the visitor first
  scrolls / moves the pointer / presses a key.
*/
function whenIdleOrInteraction(run: () => void) {
  let done = false;
  const events = ["scroll", "pointermove", "pointerdown", "keydown", "touchstart"] as const;
  const fire = () => {
    if (done) return;
    done = true;
    cleanup();
    run();
  };
  const w = window as Window & {
    requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
    cancelIdleCallback?: (id: number) => void;
  };
  const idleId = w.requestIdleCallback ? w.requestIdleCallback(fire, { timeout: 2500 }) : null;
  const timeoutId = idleId === null ? window.setTimeout(fire, 2000) : null;
  for (const e of events) window.addEventListener(e, fire, { once: true, passive: true });
  function cleanup() {
    if (idleId !== null) w.cancelIdleCallback?.(idleId);
    if (timeoutId !== null) window.clearTimeout(timeoutId);
    for (const e of events) window.removeEventListener(e, fire);
  }
  return () => {
    done = true;
    cleanup();
  };
}

const FINE_POINTER = "(pointer: fine)";
function subscribeFinePointer(cb: () => void) {
  const mq = window.matchMedia(FINE_POINTER);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}
function getFinePointer() {
  return window.matchMedia(FINE_POINTER).matches;
}

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
  const finePointer = useSyncExternalStore(subscribeFinePointer, getFinePointer, () => false);
  const [Canvas, setCanvas] = useState<CanvasComponent | null>(null);

  useEffect(() => {
    let cancelled = false;
    let cancelWait: (() => void) | null = null;
    const override = readOverride();
    // Constrained devices get the static fallback immediately; the WebGL module is never fetched.
    if (override === "fallback" || (!override && isConstrainedDevice())) {
      experienceActions.setMode("fallback");
      return;
    }
    const start = () => {
      if (cancelled) return;
      if (!detectWebGL()) {
        experienceActions.setMode("fallback");
        return;
      }
      import("./ExperienceCanvas")
        .then((mod: CanvasModule) => {
          if (cancelled) return;
          setCanvas(() => mod.default);
          setPlan({ tier: override ?? detectTier(), introStart: performance.now() });
        })
        .catch(() => {
          if (!cancelled) experienceActions.setMode("fallback");
        });
    };
    const afterLoad = () => {
      if (!cancelled) cancelWait = whenIdleOrInteraction(start);
    };
    if (document.readyState === "complete") afterLoad();
    else window.addEventListener("load", afterLoad, { once: true });
    return () => {
      cancelled = true;
      cancelWait?.();
      window.removeEventListener("load", afterLoad);
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

  if (!plan || !Canvas || mode === "fallback") return null;

  return (
    <>
      <IntroOverlay />
      {finePointer && <CursorRing />}
      <div className={`experience-layer${live ? " is-live" : ""}`} aria-hidden="true">
        <ExperienceBoundary onError={handleFailure}>
          <Canvas
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
