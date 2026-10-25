/*
  Shared state for the WebGL experience. High-frequency values live on a
  plain mutable object read inside the frame loop; discrete UI state uses a
  tiny pub/sub for useSyncExternalStore.
*/

export type ExperienceMode = "pending" | "webgl" | "fallback";
export type QualityTier = "high" | "mid" | "low";

export interface SectionMetrics {
  id: string;
  top: number;
  height: number;
}

export interface FrameNode {
  x: number;
  y: number;
  depth: number;
  visible: boolean;
  labelShift: number;
  behindCore: boolean;
}

export interface FrameSnapshot {
  nodes: FrameNode[];
  labelOpacity: number;
  flowActive: boolean;
  monogram: { x: number; y: number; opacity: number };
  caption: number;
}

export interface HudSnapshot {
  label: string;
  barWidth: number;
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

const discreteEmitter = new Emitter();

const discrete = {
  mode: "pending" as ExperienceMode,
  focusNode: -1,
  focusSource: "scene" as "scene" | "legend",
  selectedNode: -1,
  step: 0,
  serviceFocus: -1,
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
  setFocusNode: (index: number, source: "scene" | "legend" = "scene") => {
    if (index >= 0) setDiscrete("focusSource", source);
    setDiscrete("focusNode", index);
  },
  setSelectedNode: (index: number) => setDiscrete("selectedNode", index),
  setStep: (step: number) => setDiscrete("step", step),
  setServiceFocus: (index: number) => setDiscrete("serviceFocus", index),
  setTier: (tier: QualityTier) => setDiscrete("tier", tier),
  setReducedMotion: (value: boolean) => setDiscrete("reducedMotion", value),
  requestBurst: () => {
    frameState.burstCenter = true;
    invalidateFrame();
  },
};

export function activeNode(): number {
  return discrete.focusNode >= 0 ? discrete.focusNode : discrete.selectedNode;
}

export const frameState = {
  /** Damped narrative progress 0..1 (written by scene). */
  pp: 0,
  /** Target from scroll (written by tracking). */
  ppTarget: 0,
  t: 0,
  scrollY: 0,
  vw: 1,
  vh: 1,
  /** Normalized pointer −0.5..0.5 (HTML mx/my). */
  pointer: { x: 0, y: 0, active: false },
  sections: [] as SectionMetrics[],
  time: 0,
  /** Burst at group origin (step button / programmatic). */
  burstCenter: false,
  /** Screen position for tap burst (scene raycasts on the next frame). */
  burstScreen: null as { x: number; y: number } | null,
  dragDx: 0,
};

const frameEmitter = new Set<(snapshot: FrameSnapshot) => void>();
const hudEmitter = new Set<(snapshot: HudSnapshot) => void>();

export function onSceneFrame(fn: (snapshot: FrameSnapshot) => void) {
  frameEmitter.add(fn);
  return () => {
    frameEmitter.delete(fn);
  };
}

export function publishSceneFrame(snapshot: FrameSnapshot) {
  for (const fn of frameEmitter) fn(snapshot);
}

export function onSceneHud(fn: (snapshot: HudSnapshot) => void) {
  hudEmitter.add(fn);
  return () => {
    hudEmitter.delete(fn);
  };
}

export function publishSceneHud(snapshot: HudSnapshot) {
  for (const fn of hudEmitter) fn(snapshot);
}

let invalidator: (() => void) | null = null;

export function registerInvalidator(fn: (() => void) | null) {
  invalidator = fn;
}

export function invalidateFrame() {
  invalidator?.();
}
