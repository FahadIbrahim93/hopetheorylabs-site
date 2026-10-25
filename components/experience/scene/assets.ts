import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  Color,
  Float32BufferAttribute,
  Group,
  Line,
  LineBasicMaterial,
  Points,
  PointsMaterial,
  QuadraticBezierCurve3,
  ShaderMaterial,
  SphereGeometry,
  Vector3,
} from "three";

import type { QualityProfile } from "../quality";
import { NODE_COLORS, NODE_COUNT, NODE_X, NODE_Y, nodeSide } from "../nodes";
import {
  buildParticles,
  buildStars,
  FLOW_CURVE_POINTS,
  FLOW_DOTS_PER_EDGE,
  RING_DOTS,
  RING_RADII,
  RING_SEGMENTS,
  STAR_COUNT,
} from "./layout";
import { coreFragment, coreVertex, particleFragment, particleVertex } from "./shaders";

/*
  GPU resources for the HTML-port scene. Buffers are allocated at the
  high-water particle count; quality tiers only shrink draw ranges.
*/

export function createGlowTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("2d context unavailable");
  const gr = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gr.addColorStop(0, "rgba(255,255,255,1)");
  gr.addColorStop(0.35, "rgba(255,255,255,.5)");
  gr.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = gr;
  ctx.fillRect(0, 0, 64, 64);
  return new CanvasTexture(canvas);
}

export interface FlowEdge {
  curve: QuadraticBezierCurve3;
  line: Line;
  nodeIndex: number;
}

export interface RingHandle {
  group: Group;
  line: Line;
  dots: Points;
  speed: number;
}

export function createSceneAssets(profile: QualityProfile, glowTexture: CanvasTexture) {
  const particles = buildParticles(profile.particles);
  const particleGeometry = new BufferGeometry();
  particleGeometry.setAttribute("position", new BufferAttribute(particles.scattered, 3));
  particleGeometry.setAttribute("aB", new BufferAttribute(particles.globe, 3));
  particleGeometry.setAttribute("aC", new BufferAttribute(particles.galaxy, 3));
  particleGeometry.setAttribute("aR", new BufferAttribute(particles.seed, 1));
  particleGeometry.setDrawRange(0, profile.particles);

  const particleMaterial = new ShaderMaterial({
    vertexShader: particleVertex,
    fragmentShader: particleFragment,
    uniforms: {
      uP: { value: 0 },
      uT: { value: 0 },
      uD: { value: 1 },
      uK: { value: -99 },
      uC: { value: new Vector3() },
      uPR: { value: 1 },
      uM: { value: new Vector3(99, 99, 99) },
    },
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
  });

  const coreGeometry = new SphereGeometry(1, 48, 48);
  const coreMaterial = new ShaderMaterial({
    vertexShader: coreVertex,
    fragmentShader: coreFragment,
    uniforms: { uI: { value: 0.3 }, uS: { value: 0 } },
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
  });

  const rings: RingHandle[] = RING_RADII.map((r, n) => {
    const group = new Group();
    const pts: Vector3[] = [];
    for (let j = 0; j <= RING_SEGMENTS; j++) {
      const a = (j / RING_SEGMENTS) * Math.PI * 2;
      pts.push(new Vector3(Math.cos(a) * r, 0, Math.sin(a) * r));
    }
    const line = new Line(
      new BufferGeometry().setFromPoints(pts),
      new LineBasicMaterial({ color: 0x6c8dc4, transparent: true, opacity: 0 }),
    );
    group.add(line);

    const dotPositions: number[] = [];
    for (let j = 0; j < RING_DOTS; j++) {
      const b = (j / RING_DOTS) * Math.PI * 2 + n;
      dotPositions.push(Math.cos(b) * r, 0, Math.sin(b) * r);
    }
    const dots = new Points(
      new BufferGeometry().setAttribute("position", new Float32BufferAttribute(dotPositions, 3)),
      new PointsMaterial({
        color: 0xcfe0ff,
        size: 0.28,
        map: glowTexture,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        blending: AdditiveBlending,
      }),
    );
    group.add(dots);
    return { group, line, dots, speed: (0.35 / (r * 0.4 + 1)) * (n % 2 ? -1 : 1) };
  });

  const flowEdges: FlowEdge[] = [];
  const flowNodePositions: Vector3[] = [];
  for (let i = 0; i < NODE_COUNT; i++) {
    const sd = nodeSide(i);
    const ny = NODE_Y[i % 4];
    const nv = new Vector3(sd * NODE_X, ny, 0);
    const curve = new QuadraticBezierCurve3(
      new Vector3(0, 0, 0),
      new Vector3(sd * NODE_X * 0.45, ny * 0.5 + (i % 2 ? -1 : 1) * 1.4, 0.8),
      nv,
    );
    const color = new Color(NODE_COLORS[i]);
    const line = new Line(
      new BufferGeometry().setFromPoints(curve.getPoints(FLOW_CURVE_POINTS)),
      new LineBasicMaterial({ color, transparent: true, opacity: 0, blending: AdditiveBlending }),
    );
    flowEdges.push({ curve, line, nodeIndex: i });
    flowNodePositions.push(nv);
  }

  const flowDotCount = NODE_COUNT * FLOW_DOTS_PER_EDGE;
  const flowDotPositions = new Float32Array(flowDotCount * 3);
  const flowDotColors = new Float32Array(flowDotCount * 3);
  for (let i = 0; i < flowDotCount; i++) {
    const c = new Color(NODE_COLORS[(i / FLOW_DOTS_PER_EDGE) | 0]);
    flowDotColors[i * 3] = c.r;
    flowDotColors[i * 3 + 1] = c.g;
    flowDotColors[i * 3 + 2] = c.b;
  }
  const flowDotGeometry = new BufferGeometry();
  flowDotGeometry.setAttribute("position", new BufferAttribute(flowDotPositions, 3));
  flowDotGeometry.setAttribute("color", new BufferAttribute(flowDotColors, 3));
  const flowDotMaterial = new PointsMaterial({
    size: 0.24,
    map: glowTexture,
    vertexColors: true,
    transparent: true,
    opacity: 0,
    depthWrite: false,
    blending: AdditiveBlending,
  });

  const haloGeometry = new BufferGeometry();
  haloGeometry.setAttribute("position", new Float32BufferAttribute([0, 0, 0], 3));
  const haloMaterial = new PointsMaterial({
    color: 0xff9a3c,
    size: 5,
    map: glowTexture,
    transparent: true,
    opacity: 0,
    depthWrite: false,
    blending: AdditiveBlending,
  });

  const starPositions = buildStars();
  const starGeometry = new BufferGeometry();
  starGeometry.setAttribute("position", new BufferAttribute(starPositions, 3));
  const starMaterial = new PointsMaterial({
    color: 0xb8c7e6,
    size: 0.35,
    map: glowTexture,
    transparent: true,
    opacity: 0.55,
    depthWrite: false,
    blending: AdditiveBlending,
  });

  const disposables: { dispose(): void }[] = [
    particleGeometry,
    particleMaterial,
    coreGeometry,
    coreMaterial,
    flowDotGeometry,
    flowDotMaterial,
    haloGeometry,
    haloMaterial,
    starGeometry,
    starMaterial,
  ];
  const pushMaterial = (material: import("three").Material | import("three").Material[]) => {
    if (Array.isArray(material)) disposables.push(...material);
    else disposables.push(material);
  };
  for (const r of rings) {
    disposables.push(r.line.geometry, r.dots.geometry);
    pushMaterial(r.line.material);
    pushMaterial(r.dots.material);
  }
  for (const e of flowEdges) {
    disposables.push(e.line.geometry);
    pushMaterial(e.line.material);
  }

  return {
    particleGeometry,
    particleMaterial,
    particleCount: particles.count,
    coreGeometry,
    coreMaterial,
    rings,
    flowEdges,
    flowNodePositions,
    flowDotGeometry,
    flowDotMaterial,
    flowDotPositionAttr: flowDotGeometry.getAttribute("position") as BufferAttribute,
    flowDotCount,
    haloGeometry,
    haloMaterial,
    starGeometry,
    starMaterial,
    starCount: STAR_COUNT,
    dispose() {
      for (const item of disposables) item.dispose();
    },
  };
}

export type SceneAssets = ReturnType<typeof createSceneAssets>;
