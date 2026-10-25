/*
  The narrative timeline. Every page section owns one keyframe; the scene
  blends between neighbouring keyframes using the continuous scroll progress
  `t` (section index + fraction). Because the blend is a pure function of
  scroll position, scrolling backwards restores the exact state, and jumping
  straight to an anchor lands on the right keyframe (the frame loop damps the
  jump so it reads as a camera move rather than a cut).
*/

export interface SceneKeyframe {
  /** 0 = scattered particle cloud, 1 = structured intelligence core. */
  assembly: number;
  /** 0 = no edges, 1 = every source connected to the core. */
  connection: number;
  /** Density of signal packets travelling the edges. */
  signals: number;
  /** 0 = signals travel inward (sources -> core), 1 = outward (core -> sources). */
  outbound: number;
  /** 0 = sources on an orderly ring, 1 = scattered at different depths. */
  spread: number;
  /** Global scene opacity so text-heavy sections stay readable. */
  dim: number;
  /** HTML node-label opacity. */
  labels: number;
  /** Radar sweep strength. */
  radar: number;
  /** Neighbour-link flicker strength inside the core. */
  links: number;
  /** Camera azimuth (radians) and elevation (radians). */
  orbit: number;
  elevation: number;
  /** Multiplier on the anchor-fitted camera distance (>1 pulls back). */
  zoom: number;
  /** Which measured anchor rect the core composes into. */
  anchor: string;
}

export interface NarrativeSection {
  id: string;
  key: SceneKeyframe;
}

/*
  Section order mirrors PageShell. Anchor ids point at the spacer elements
  (data-scene-anchor) each section reserves for the 3D composition.
*/
export const NARRATIVE: NarrativeSection[] = [
  {
    id: "top",
    key: {
      assembly: 0.82, connection: 0.45, signals: 0.35, outbound: 0, spread: 0.12,
      dim: 1, labels: 1, radar: 1, links: 1,
      orbit: 0.15, elevation: 0.22, zoom: 0.92, anchor: "hero",
    },
  },
  {
    id: "method",
    key: {
      assembly: 1, connection: 0, signals: 0, outbound: 0, spread: 1,
      dim: 1, labels: 0.35, radar: 0.4, links: 1,
      orbit: 0.7, elevation: 0.32, zoom: 0.98, anchor: "method",
    },
  },
  {
    id: "shift",
    key: {
      assembly: 1, connection: 1, signals: 0.6, outbound: 0, spread: 0,
      dim: 1, labels: 0.6, radar: 0.6, links: 1,
      orbit: 1.35, elevation: 0.12, zoom: 1, anchor: "shift",
    },
  },
  {
    id: "flow",
    key: {
      assembly: 1, connection: 1, signals: 1, outbound: 0.5, spread: 0,
      dim: 1, labels: 1, radar: 1, links: 0.8,
      orbit: 2.05, elevation: 0.48, zoom: 1.02, anchor: "flow",
    },
  },
  {
    id: "how",
    key: {
      assembly: 1, connection: 1, signals: 0.8, outbound: 0, spread: 0,
      dim: 1, labels: 0.7, radar: 0.8, links: 0.8,
      orbit: 2.75, elevation: 0.3, zoom: 1, anchor: "how",
    },
  },
  {
    id: "services",
    key: {
      assembly: 1, connection: 1, signals: 0.7, outbound: 0.5, spread: 0,
      dim: 0.75, labels: 0.5, radar: 0.5, links: 0.6,
      orbit: 3.35, elevation: 0.2, zoom: 1.15, anchor: "services",
    },
  },
  {
    id: "work",
    key: {
      assembly: 1, connection: 1, signals: 0.5, outbound: 0.5, spread: 0,
      dim: 0.4, labels: 0, radar: 0.3, links: 0.4,
      orbit: 3.9, elevation: 0.55, zoom: 0.8, anchor: "work",
    },
  },
  {
    id: "about",
    key: {
      assembly: 1, connection: 1, signals: 0.5, outbound: 0.5, spread: 0,
      dim: 0.5, labels: 0, radar: 0.3, links: 0.5,
      orbit: 4.35, elevation: 0.2, zoom: 1.1, anchor: "about",
    },
  },
  {
    id: "contact",
    key: {
      assembly: 1, connection: 1, signals: 1, outbound: 0.5, spread: 0,
      dim: 0.95, labels: 0.55, radar: 1, links: 1,
      orbit: 5.1, elevation: 0.55, zoom: 1.0, anchor: "contact",
    },
  },
];

export const KEY_FIELDS = Object.keys(NARRATIVE[0].key).filter(
  (k) => k !== "anchor",
) as Exclude<keyof SceneKeyframe, "anchor">[];

export type BlendedState = Omit<SceneKeyframe, "anchor"> & {
  anchorA: string;
  anchorB: string;
  anchorMix: number;
  section: number;
  fraction: number;
};

function smooth(x: number) {
  return x * x * (3 - 2 * x);
}

export function createBlendedState(): BlendedState {
  const base = { ...NARRATIVE[0].key } as SceneKeyframe & Partial<BlendedState>;
  const { anchor, ...rest } = base;
  return { ...rest, anchorA: anchor, anchorB: anchor, anchorMix: 0, section: 0, fraction: 0 } as BlendedState;
}

/** Writes the keyframe blend for progress `t` into `out` (no allocation). */
export function blendNarrative(t: number, out: BlendedState): BlendedState {
  const last = NARRATIVE.length - 1;
  const clamped = Math.min(Math.max(t, 0), last);
  const i = Math.min(Math.floor(clamped), last - 1);
  const f = clamped - i;
  const s = smooth(f);
  const a = NARRATIVE[i].key;
  const b = NARRATIVE[i + 1].key;
  for (const field of KEY_FIELDS) {
    out[field] = a[field] + (b[field] - a[field]) * s;
  }
  out.anchorA = a.anchor;
  out.anchorB = b.anchor;
  out.anchorMix = s;
  out.section = i;
  out.fraction = f;
  return out;
}

export const SECTION_IDS = NARRATIVE.map((s) => s.id);
