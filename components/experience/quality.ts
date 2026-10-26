import type { QualityTier } from "./store";

/*
  Adaptive quality. Particle buffers are sized to the tier the scene starts
  on; runtime downgrades shrink the draw range only. WebGL only runs on
  desktop-class devices (see isConstrainedDevice), so budgets are modest.
*/

export interface QualityProfile {
  particles: number;
  maxDpr: number;
}

export const QUALITY: Record<QualityTier, QualityProfile> = {
  high: { particles: 12000, maxDpr: 1.5 },
  mid: { particles: 4000, maxDpr: 1.25 },
  low: { particles: 2500, maxDpr: 1 },
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

export function readOverride(): "fallback" | QualityTier | null {
  try {
    const value = new URLSearchParams(window.location.search).get("experience");
    if (value === "fallback" || value === "low" || value === "mid" || value === "high") return value;
  } catch {
    /* no window */
  }
  return null;
}

/**
 * Devices that always get the static SVG fallback: small screens, fewer
 * than 6 logical cores, save-data, or prefers-reduced-motion.
 */
export function isConstrainedDevice(): boolean {
  try {
    const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
    if (window.matchMedia("(max-width: 800px)").matches) return true;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return true;
    if ((nav.hardwareConcurrency ?? 4) < 6) return true;
    if (nav.connection?.saveData) return true;
  } catch {
    return true;
  }
  return false;
}

export function detectTier(): QualityTier {
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  const cores = nav.hardwareConcurrency ?? 4;
  const saveData = nav.connection?.saveData;
  const width = window.innerWidth;

  if (saveData || cores < 4) return "low";
  if (width < 800) return "mid";
  if (cores >= 8 && width >= 1024) return "high";
  return "mid";
}

export function createFrameMonitor(onSlow: (avgMs: number) => void) {
  const WARMUP = 0.5;
  const WINDOW = 2.5;
  const BUDGET_MS = 24;
  let elapsed = 0;
  let sampled = 0;
  let frames = 0;
  let decisions = 0;
  return {
    sample(dt: number) {
      if (decisions >= 2) return;
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
          decisions = 2;
        }
        sampled = 0;
        frames = 0;
      }
    },
  };
}
