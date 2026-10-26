/*
  Geometry data for the particle field: three target layouts per particle
  (scattered cloud, globe lattice, spiral galaxy) plus a random seed. Built
  once at the starting tier's particle count; downgrades shrink the draw range.
*/

export interface ParticleBuffers {
  count: number;
  scattered: Float32Array;
  globe: Float32Array;
  galaxy: Float32Array;
  seed: Float32Array;
}

/** Gaussian-ish random in [-1, 1]. */
function g() {
  return (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;
}

const TAU = Math.PI * 2;

export function buildParticles(count: number): ParticleBuffers {
  const scattered = new Float32Array(count * 3);
  const globe = new Float32Array(count * 3);
  const galaxy = new Float32Array(count * 3);
  const seed = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    const k = i * 3;
    seed[i] = Math.random();

    // Scattered: a loose, flattened shell pushed slightly back.
    const rad = 4 + Math.random() * 10;
    const th = Math.random() * TAU;
    const ph = Math.acos(2 * Math.random() - 1);
    scattered[k] = rad * Math.sin(ph) * Math.cos(th);
    scattered[k + 1] = rad * Math.sin(ph) * Math.sin(th) * 0.7;
    scattered[k + 2] = rad * Math.cos(ph) - 2;

    // Globe lattice: odd particles on 14 latitude bands, even on 18 meridians.
    let la: number;
    let lo: number;
    if (i % 2) {
      la = ((Math.floor(Math.random() * 14) + 0.5) / 14) * Math.PI;
      lo = Math.random() * TAU;
    } else {
      lo = (Math.floor(Math.random() * 18) / 18) * TAU;
      la = Math.random() * Math.PI;
    }
    globe[k] = 3.1 * Math.sin(la) * Math.cos(lo);
    globe[k + 1] = 3.1 * Math.cos(la);
    globe[k + 2] = 3.1 * Math.sin(la) * Math.sin(lo);

    // Galaxy: 6% dense core, the rest on five arms.
    if (Math.random() < 0.06) {
      const cr = 0.9 * Math.cbrt(Math.random());
      const cp = Math.acos(2 * Math.random() - 1);
      const ct = Math.random() * TAU;
      galaxy[k] = cr * Math.sin(cp) * Math.cos(ct);
      galaxy[k + 1] = cr * Math.cos(cp);
      galaxy[k + 2] = cr * Math.sin(cp) * Math.sin(ct);
    } else {
      const arm = i % 5;
      const rr = Math.pow(Math.random(), 0.65) * 7 + 0.5;
      const an = (arm / 5) * TAU + rr * 0.85 + g() * (0.12 + rr * 0.04);
      galaxy[k] = rr * Math.cos(an);
      galaxy[k + 1] = g() * 0.35 * (1 + rr * 0.1);
      galaxy[k + 2] = rr * Math.sin(an);
    }
  }

  return { count, scattered, globe, galaxy, seed };
}

export const STAR_COUNT = 300;

export function buildStars(): Float32Array {
  const stars = new Float32Array(STAR_COUNT * 3);
  for (let i = 0; i < STAR_COUNT; i++) {
    const sr = 24 + Math.random() * 22;
    const sa = Math.random() * TAU;
    const s2 = Math.acos(2 * Math.random() - 1);
    stars[i * 3] = sr * Math.sin(s2) * Math.cos(sa);
    stars[i * 3 + 1] = sr * Math.cos(s2);
    stars[i * 3 + 2] = sr * Math.sin(s2) * Math.sin(sa) - 10;
  }
  return stars;
}

export const RING_RADII = [2.2, 3.6, 5.2, 7] as const;
export const RING_SEGMENTS = 96;
export const RING_DOTS = 3;
export const FLOW_CURVE_POINTS = 48;
export const FLOW_DOTS_PER_EDGE = 3;
