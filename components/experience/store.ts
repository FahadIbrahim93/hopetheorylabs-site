/*
  Shared, render-loop-friendly state for the WebGL experience.

  High-frequency values (scroll progress, pointer, anchor rects) live on a
  plain mutable object that the scene reads inside its frame loop, so no React
  re-render happens per frame. Low-frequency discrete state (experience mode,
  focused node, active step) goes through a tiny pub/sub so React components
  can subscribe with useSyncExternalStore.
*/

export type ExperienceMode = "pending" | "webgl" | "fallback";
export type QualityTier = "high" | "mid" | "low";

export interface AnchorRect {
  /** Document-relative top (px). */
  top: number;
  left: number;
  width: number;
  height: number;
}

export interface SectionMetrics {
  id: string;
  top: number;
  height: number;
}

export interface FrameNode {
  x: number; // viewport px
  y: number; // viewport px
  depth: number; // 0 (far) .. 1 (near)
  visible: boolean;
  labelShift: number; // vertical px nudge so neighbouring labels never overlap
  behindCore: boolean; // node sits behind the core from the camera's point of view
}

export interface FrameSnapshot {
  nodes: FrameNode[];
  labelOpacity: number;
}

type Listener = () => void;

class Emitter {
  private listeners = new Set<Listener>();
  subscribe = (fn: Listener) => {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  };
  emit() {
    for (const fn of this.listeners) fn();
  }
}

/* ---------- discrete state ---------- */

const discreteEmitter = new Emitter();

const discrete = {
  mode: "pending" as ExperienceMode,
  focusNode: -1, // transient hover/focus
  selectedNode: -1, // sticky click/tap selection
  step: 0, // "How it works" active step
  serviceFocus: -1, // hovered/focused service row
  tier: "mid" as QualityTier,
  reducedMotion: false,
};

export type DiscreteState = typeof discrete;

export function getDiscrete(): DiscreteState {
  return discrete;
}

export const subscribeDiscrete = discreteEmitter.subscribe;

function setDiscrete<K extends keyof DiscreteState>(key: K, value: DiscreteState[K]) {
  if (discrete[key] === value) return;
  discrete[key] = value;
  discreteEmitter.emit();
  invalidateFrame();
}

export const experienceActions = {
  setMode: (mode: ExperienceMode) => setDiscrete("mode", mode),
  setFocusNode: (index: number) => setDiscrete("focusNode", index),
  setSelectedNode: (index: number) => setDiscrete("selectedNode", index),
  setStep: (step: number) => setDiscrete("step", step),
  setServiceFocus: (index: number) => setDiscrete("serviceFocus", index),
  setTier: (tier: QualityTier) => setDiscrete("tier", tier),
  setReducedMotion: (value: boolean) => setDiscrete("reducedMotion", value),
};

/** The node the scene should treat as active: sticky selection wins over hover. */
export function activeNode(): number {
  return discrete.focusNode >= 0 ? discrete.focusNode : discrete.selectedNode;
}

/* ---------- continuous state ---------- */

export const frameState = {
  /** Narrative progress: section index + fraction (0 = hero). */
  t: 0,
  scrollY: 0,
  vw: 1,
  vh: 1,
  pointer: { x: 0, y: 0, active: false },
  anchors: new Map<string, AnchorRect>(),
  sections: [] as SectionMetrics[],
  /** Monotonic clock for ambient motion; frozen under reduced motion. */
  time: 0,
};

/* ---------- frame bridge (scene -> DOM overlays, single loop) ---------- */

const frameEmitter = new Set<(snapshot: FrameSnapshot) => void>();

export function onSceneFrame(fn: (snapshot: FrameSnapshot) => void) {
  frameEmitter.add(fn);
  return () => {
    frameEmitter.delete(fn);
  };
}

export function publishSceneFrame(snapshot: FrameSnapshot) {
  for (const fn of frameEmitter) fn(snapshot);
}

/* ---------- demand rendering hook (reduced motion) ---------- */

let invalidator: (() => void) | null = null;

export function registerInvalidator(fn: (() => void) | null) {
  invalidator = fn;
}

/** Ask the scene to render one more frame (no-op in continuous mode). */
export function invalidateFrame() {
  invalidator?.();
}
