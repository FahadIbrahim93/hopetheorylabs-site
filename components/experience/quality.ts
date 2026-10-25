import type { QualityTier } from "./store";

/*
  Adaptive quality. The initial tier comes from coarse device signals (cores,
  memory, viewport, pointer type) rather than user-agent strings; the runtime
  monitor then steps the tier down if measured frame times say the device is
  struggling. Particle counts never grow at runtime, so buffers are allocated
  once at the high-water mark and the draw range shrinks.
*/

export interface QualityProfile {
  particles: number;
  links: number;
  maxDpr: number;
  packetsPerEdge: number;
}

export const QUALITY: Record<QualityTier, QualityProfile> = {
  high: { particles: 6400, links: 1800, maxDpr: 1.75, packetsPerEdge: 3 },
  mid: { particles: 3600, links: 1100, maxDpr: 1.35, packetsPerEdge: 2 },
  low: { particles: 1800, links: 500, maxDpr: 1, packetsPerEdge: 2 },
};

const ORDER: QualityTier[] = ["high", "mid", "low"];

export function lowerTier(tier: QualityTier): QualityTier {
  const i = ORDER.indexOf(tier);
  return ORDER[Math.min(i + 1, ORDER.length - 1)];
}

export function detectWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    const attrs = { failIfMajorPerformanceCaveat: false };
    return Boolean(canvas.getContext("webgl2", attrs) || canvas.getContext("webgl", attrs));
  } catch {
    return false;
  }
}

/** `?experience=fallback|low|mid|high` lets reviewers force a path for QA. */
export function readOverride(): "fallback" | QualityTier | null {
  try {
    const value = new URLSearchParams(window.location.search).get("experience");
    if (value === "fallback" || value === "low" || value === "mid" || value === "high") return value;
  } catch {
    /* no window / malformed URL */
  }
  return null;
}

export function detectTier(): QualityTier {
  const nav = navigator as Navigator & { deviceMemory?: number };
  const cores = nav.hardwareConcurrency ?? 4;
  const memory = nav.deviceMemory ?? 4;
  const width = window.innerWidth;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const small = width < 768;

  if (small || coarse || cores <= 4 || memory <= 4) return "low";
  if (cores >= 8 && memory >= 8 && width >= 1024) return "high";
  return "mid";
}

/**
 * Samples frame deltas after a warm-up and calls `onSlow` when the average
 * frame time exceeds the budget. Call `sample(dt)` from the frame loop.
 */
export function createFrameMonitor(onSlow: (avgMs: number) => void) {
  const WARMUP = 1.5; // seconds ignored while shaders compile and caches warm
  const WINDOW = 2.5; // seconds sampled per decision
  const BUDGET_MS = 24; // ~41 fps average triggers a downgrade
  let elapsed = 0;
  let sampled = 0;
  let frames = 0;
  let decisions = 0;
  return {
    sample(dt: number) {
      if (decisions >= 2) return; // at most two downgrades per visit
      elapsed += dt;
      if (elapsed < WARMUP) return;
      sampled += dt;
      frames += 1;
      if (sampled >= WINDOW) {
        const avg = (sampled / frames) * 1000;
        if (avg > BUDGET_MS) {
          decisions += 1;
          onSlow(avg);
        } else {
          decisions = 2; // healthy: stop sampling
        }
        sampled = 0;
        frames = 0;
      }
    },
  };
}
