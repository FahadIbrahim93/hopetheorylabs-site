import { QuadraticBezierCurve3, Vector3 } from "three";

/*
  Deterministic geometry for the intelligence core. A seeded PRNG keeps the
  composition identical across reloads and between the scattered and
  assembled states, so the assembly animation always resolves to the same
  picture.
*/

export const NODE_COUNT = 8;
export const CORE_RADIUS = 1;
export const RING_RADIUS = 2.35;
export const EDGE_SAMPLES = 36;

export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface ParticleBuffers {
  count: number;
  scattered: Float32Array;
  target: Float32Array;
  seed: Float32Array; // per-particle random 0..1
  tone: Float32Array; // 0 = gold, 1 = teal
  size: Float32Array;
  kind: Float32Array; // 0 surface, 1 inner, 2 dust
}

/**
 * Particles: ~62% on the sphere surface (Fibonacci lattice, so the assembled
 * core reads as a precise shell), ~23% inner shells, ~15% ambient dust that
 * never fully settles. Scattered positions fill a wide, shallow volume so the
 * opening state reads as fragments rather than a smaller ball.
 */
export function buildParticles(count: number): ParticleBuffers {
  const rand = mulberry32(1337);
  const scattered = new Float32Array(count * 3);
  const target = new Float32Array(count * 3);
  const seed = new Float32Array(count);
  const tone = new Float32Array(count);
  const size = new Float32Array(count);
  const kind = new Float32Array(count);

  const surfaceCount = Math.floor(count * 0.62);
  const innerCount = Math.floor(count * 0.23);
  const golden = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    let x: number, y: number, z: number;
    if (i < surfaceCount) {
      const k = i + 0.5;
      const phi = Math.acos(1 - (2 * k) / surfaceCount);
      const theta = golden * k;
      const r = CORE_RADIUS * (0.985 + rand() * 0.03);
      x = r * Math.cos(theta) * Math.sin(phi);
      y = r * Math.cos(phi);
      z = r * Math.sin(theta) * Math.sin(phi);
      kind[i] = 0;
      tone[i] = rand() < 0.3 ? 1 : 0;
      size[i] = 0.017 + rand() * 0.014;
    } else if (i < surfaceCount + innerCount) {
      const dir = randomDirection(rand);
      const r = CORE_RADIUS * (0.35 + Math.pow(rand(), 0.6) * 0.55);
      x = dir.x * r;
      y = dir.y * r;
      z = dir.z * r;
      kind[i] = 1;
      tone[i] = rand() < 0.5 ? 1 : 0;
      size[i] = 0.012 + rand() * 0.014;
    } else {
      const dir = randomDirection(rand);
      const r = CORE_RADIUS * (1.4 + Math.pow(rand(), 1.4) * 2.4);
      x = dir.x * r;
      y = dir.y * r * 0.6;
      z = dir.z * r;
      kind[i] = 2;
      tone[i] = rand() < 0.65 ? 1 : 0;
      size[i] = 0.01 + rand() * 0.017;
    }
    target[i3] = x;
    target[i3 + 1] = y;
    target[i3 + 2] = z;

    scattered[i3] = (rand() * 2 - 1) * 5.2;
    scattered[i3 + 1] = (rand() * 2 - 1) * 3.4;
    scattered[i3 + 2] = (rand() * 2 - 1) * 3.6;
    seed[i] = rand();
  }
  return { count, scattered, target, seed, tone, size, kind };
}

function randomDirection(rand: () => number) {
  const u = rand() * 2 - 1;
  const theta = rand() * Math.PI * 2;
  const s = Math.sqrt(1 - u * u);
  return { x: s * Math.cos(theta), y: u, z: s * Math.sin(theta) };
}

/**
 * Neighbour links between surface particles: the short filaments that flicker
 * inside the core. Pairs are chosen by distance on the assembled lattice, and
 * both endpoints carry the scattered/target pair so the links follow the
 * particles through assembly.
 */
export function buildLinks(p: ParticleBuffers, maxLinks: number) {
  const surfaceCount = Math.floor(p.count * 0.62);
  const rand = mulberry32(4242);
  const threshold = Math.sqrt((4 * Math.PI) / surfaceCount) * 1.55; // mean lattice spacing * 1.55
  const pairs: number[] = [];
  const stride = Math.max(1, Math.floor(surfaceCount / 900));
  for (let i = 0; i < surfaceCount && pairs.length / 2 < maxLinks; i += stride) {
    const ax = p.target[i * 3], ay = p.target[i * 3 + 1], az = p.target[i * 3 + 2];
    let found = 0;
    for (let tries = 0; tries < 40 && found < 2; tries++) {
      const j = Math.floor(rand() * surfaceCount);
      if (j === i) continue;
      const dx = p.target[j * 3] - ax, dy = p.target[j * 3 + 1] - ay, dz = p.target[j * 3 + 2] - az;
      if (dx * dx + dy * dy + dz * dz < threshold * threshold) {
        pairs.push(i, j);
        found++;
      }
    }
  }
  const n = pairs.length;
  const scattered = new Float32Array(n * 3);
  const target = new Float32Array(n * 3);
  const seed = new Float32Array(n);
  for (let k = 0; k < n; k++) {
    const idx = pairs[k];
    scattered.set(p.scattered.subarray(idx * 3, idx * 3 + 3), k * 3);
    target.set(p.target.subarray(idx * 3, idx * 3 + 3), k * 3);
    seed[k] = p.seed[pairs[k - (k % 2)]]; // both ends of a segment share a seed
  }
  return { count: n, scattered, target, seed };
}

/* ---------- source nodes ---------- */

const RING_TILT = 0.42; // radians around X so the ring reads as an orbit, not a flat circle

/** Orderly position of node i on the tilted ring, with a little per-node lift. */
export function nodeRingPosition(i: number, out: Vector3) {
  const angle = (i / NODE_COUNT) * Math.PI * 2 - Math.PI / 2;
  const lift = [0.35, -0.2, 0.15, -0.35, 0.25, -0.15, 0.3, -0.25][i];
  out.set(Math.cos(angle) * RING_RADIUS, lift, Math.sin(angle) * RING_RADIUS);
  out.applyAxisAngle(X_AXIS, RING_TILT);
  return out;
}

const X_AXIS = new Vector3(1, 0, 0);

/** Scattered position of node i: further out, at clearly different depths. */
export function nodeScatteredPosition(i: number, out: Vector3) {
  const rand = mulberry32(900 + i * 17);
  const angle = (i / NODE_COUNT) * Math.PI * 2 - Math.PI / 2 + (rand() - 0.5) * 0.9;
  const r = 3.1 + rand() * 1.6;
  out.set(Math.cos(angle) * r, (rand() - 0.5) * 2.6, Math.sin(angle) * r * 0.7 + (rand() - 0.5) * 2.2);
  return out;
}

/* ---------- edges ---------- */

const tmpA = new Vector3();
const tmpB = new Vector3();
const tmpC = new Vector3();
const tmpN = new Vector3();

/**
 * A gently bowed curve from a node to the point where it meets the core shell.
 * The bow bends sideways and slightly up so eight edges never read as spokes.
 */
export function writeEdgeCurve(index: number, node: Vector3, curve: QuadraticBezierCurve3) {
  tmpA.copy(node);
  tmpB.copy(node).normalize().multiplyScalar(CORE_RADIUS * 1.02);
  tmpC.copy(tmpA).add(tmpB).multiplyScalar(0.5);
  tmpN.crossVectors(tmpA, Y_AXIS).normalize();
  const side = index % 2 === 0 ? 1 : -1;
  tmpC.addScaledVector(tmpN, side * 0.45).add(Y_LIFT);
  curve.v0.copy(tmpA);
  curve.v1.copy(tmpC);
  curve.v2.copy(tmpB);
}

const Y_AXIS = new Vector3(0, 1, 0);
const Y_LIFT = new Vector3(0, 0.22, 0);
