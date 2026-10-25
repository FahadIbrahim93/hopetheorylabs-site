import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  DynamicDrawUsage,
  EllipseCurve,
  Float32BufferAttribute,
  IcosahedronGeometry,
  LineBasicMaterial,
  LineDashedMaterial,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PlaneGeometry,
  ShaderMaterial,
  SphereGeometry,
  DoubleSide,
  Vector3,
  WireframeGeometry,
} from "three";

import type { QualityProfile } from "../quality";
import { buildLinks, buildParticles, EDGE_SAMPLES, NODE_COUNT } from "./layout";
import {
  COLORS,
  edgeFragment,
  edgeVertex,
  linkFragment,
  linkVertex,
  packetFragment,
  packetVertex,
  particleFragment,
  particleVertex,
  radarFragment,
  radarVertex,
} from "./shaders";

/*
  All GPU resources for the scene, created once per mount at the high-water
  quality mark. Quality changes shrink draw ranges and pixel ratio; nothing is
  reallocated at runtime. `dispose()` releases everything.
*/

const gold = new Color(...COLORS.gold);
const amber = new Color(...COLORS.amber);
const teal = new Color(...COLORS.teal);

export function createSceneAssets(profile: QualityProfile) {
  /* particles */
  const particles = buildParticles(profile.particles);
  const particleGeometry = new BufferGeometry();
  particleGeometry.setAttribute("position", new BufferAttribute(particles.target, 3));
  particleGeometry.setAttribute("aScattered", new BufferAttribute(particles.scattered, 3));
  particleGeometry.setAttribute("aSeed", new BufferAttribute(particles.seed, 1));
  particleGeometry.setAttribute("aTone", new BufferAttribute(particles.tone, 1));
  particleGeometry.setAttribute("aSize", new BufferAttribute(particles.size, 1));
  particleGeometry.setAttribute("aKind", new BufferAttribute(particles.kind, 1));
  particleGeometry.computeBoundingSphere();
  const particleMaterial = new ShaderMaterial({
    vertexShader: particleVertex,
    fragmentShader: particleFragment,
    uniforms: {
      uTime: { value: 0 },
      uAssembly: { value: 0 },
      uPixelScale: { value: 1000 },
      uMotion: { value: 1 },
      uPointer: { value: new Vector3() },
      uPointerStrength: { value: 0 },
      uCamDist: { value: 8 },
      uGold: { value: gold },
      uTeal: { value: teal },
      uDim: { value: 1 },
    },
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
  });

  /* neighbour links */
  const links = buildLinks(particles, profile.links);
  const linkGeometry = new BufferGeometry();
  linkGeometry.setAttribute("position", new BufferAttribute(links.target, 3));
  linkGeometry.setAttribute("aScattered", new BufferAttribute(links.scattered, 3));
  linkGeometry.setAttribute("aSeed", new BufferAttribute(links.seed, 1));
  const linkMaterial = new ShaderMaterial({
    vertexShader: linkVertex,
    fragmentShader: linkFragment,
    uniforms: {
      uTime: { value: 0 },
      uAssembly: { value: 0 },
      uMotion: { value: 1 },
      uColor: { value: gold },
      uStrength: { value: 1 },
      uDim: { value: 1 },
      uCamDist: { value: 8 },
    },
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
  });

  /* wireframe shell + centre */
  const shellGeometry = new WireframeGeometry(new IcosahedronGeometry(1.0, 2));
  const shellMaterial = new LineBasicMaterial({
    color: gold,
    transparent: true,
    opacity: 0.1,
    depthWrite: false,
    blending: AdditiveBlending,
  });
  const centreGeometry = new SphereGeometry(0.11, 24, 18);
  const centreMaterial = new MeshBasicMaterial({ color: gold, transparent: true, opacity: 1 });

  /* orbit rings */
  const ringCurve = new EllipseCurve(0, 0, 1, 1, 0, Math.PI * 2, false, 0);
  const ringPoints = ringCurve.getPoints(96);
  const ringGeometry = new BufferGeometry().setFromPoints(ringPoints);
  const ringMaterial = new LineBasicMaterial({
    color: gold,
    transparent: true,
    opacity: 0.22,
    depthWrite: false,
    blending: AdditiveBlending,
  });
  const dashedRingGeometry = new BufferGeometry().setFromPoints(ringPoints);
  const dashedRingMaterial = new LineDashedMaterial({
    color: teal,
    transparent: true,
    opacity: 0.35,
    dashSize: 0.06,
    gapSize: 0.16,
    depthWrite: false,
    blending: AdditiveBlending,
  });

  /* radar sweep */
  const radarGeometry = new PlaneGeometry(2, 2, 1, 1);
  const radarMaterial = new ShaderMaterial({
    vertexShader: radarVertex,
    fragmentShader: radarFragment,
    uniforms: {
      uSweep: { value: 0 },
      uStrength: { value: 1 },
      uDim: { value: 1 },
      uCamDist: { value: 8 },
      uGold: { value: gold },
      uTeal: { value: teal },
    },
    transparent: true,
    depthWrite: false,
    side: DoubleSide,
    blending: AdditiveBlending,
  });

  /* source nodes */
  const nodeGeometry = new SphereGeometry(0.075, 24, 18);
  const nodeMaterials = Array.from({ length: NODE_COUNT }, () =>
    new MeshStandardMaterial({
      color: new Color(0.11, 0.14, 0.18),
      emissive: teal.clone(),
      emissiveIntensity: 0.35,
      roughness: 0.35,
      metalness: 0.6,
    }),
  );
  const haloGeometry = new PlaneGeometry(1, 1);
  const haloMaterials = Array.from({ length: NODE_COUNT }, () => createGlowMaterial(teal));

  /* core aura (billboard) */
  const auraGeometry = new PlaneGeometry(1, 1);
  const auraMaterial = createGlowMaterial(amber);

  /* edges */
  const edgeVertexCount = NODE_COUNT * EDGE_SAMPLES * 2;
  const edgePositions = new Float32Array(edgeVertexCount * 3);
  const edgeT = new Float32Array(edgeVertexCount);
  const edgeIndex = new Float32Array(edgeVertexCount);
  for (let e = 0; e < NODE_COUNT; e++) {
    for (let s = 0; s < EDGE_SAMPLES; s++) {
      const v = (e * EDGE_SAMPLES + s) * 2;
      edgeT[v] = s / EDGE_SAMPLES;
      edgeT[v + 1] = (s + 1) / EDGE_SAMPLES;
      edgeIndex[v] = e;
      edgeIndex[v + 1] = e;
    }
  }
  const edgeGeometry = new BufferGeometry();
  const edgePositionAttr = new BufferAttribute(edgePositions, 3);
  edgePositionAttr.setUsage(DynamicDrawUsage);
  edgeGeometry.setAttribute("position", edgePositionAttr);
  edgeGeometry.setAttribute("aT", new BufferAttribute(edgeT, 1));
  edgeGeometry.setAttribute("aEdge", new BufferAttribute(edgeIndex, 1));
  const edgeMaterial = new ShaderMaterial({
    vertexShader: edgeVertex,
    fragmentShader: edgeFragment,
    uniforms: {
      uTime: { value: 0 },
      uConnection: { value: 0 },
      uMotion: { value: 1 },
      uOutbound: { value: 0 },
      uWeights: { value: new Array(NODE_COUNT).fill(0) },
      uGold: { value: gold },
      uTeal: { value: teal },
      uDim: { value: 1 },
      uFocusActive: { value: 0 },
      uCamDist: { value: 8 },
    },
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
  });

  /* packets */
  const packetCount = NODE_COUNT * profile.packetsPerEdge;
  const packetGeometry = new BufferGeometry();
  const packetPositionAttr = new Float32BufferAttribute(new Float32Array(packetCount * 3), 3);
  packetPositionAttr.setUsage(DynamicDrawUsage);
  const packetAlphaAttr = new Float32BufferAttribute(new Float32Array(packetCount), 1);
  packetAlphaAttr.setUsage(DynamicDrawUsage);
  const packetTone = new Float32Array(packetCount);
  for (let i = 0; i < packetCount; i++) packetTone[i] = i % 3 === 0 ? 1 : 0;
  packetGeometry.setAttribute("position", packetPositionAttr);
  packetGeometry.setAttribute("aAlpha", packetAlphaAttr);
  packetGeometry.setAttribute("aTone", new BufferAttribute(packetTone, 1));
  const packetMaterial = new ShaderMaterial({
    vertexShader: packetVertex,
    fragmentShader: packetFragment,
    uniforms: {
      uPixelScale: { value: 1000 },
      uTeal: { value: teal },
      uGold: { value: gold },
      uDim: { value: 1 },
      uCamDist: { value: 8 },
    },
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
  });

  const disposables = [
    particleGeometry, particleMaterial, linkGeometry, linkMaterial,
    shellGeometry, shellMaterial, centreGeometry, centreMaterial,
    ringGeometry, ringMaterial, dashedRingGeometry, dashedRingMaterial,
    radarGeometry, radarMaterial, nodeGeometry, ...nodeMaterials,
    haloGeometry, ...haloMaterials, auraGeometry, auraMaterial,
    edgeGeometry, edgeMaterial, packetGeometry, packetMaterial,
  ];

  return {
    particleGeometry, particleMaterial, particleCount: particles.count,
    linkGeometry, linkMaterial, linkCount: links.count,
    shellGeometry, shellMaterial, centreGeometry, centreMaterial,
    ringGeometry, ringMaterial, dashedRingGeometry, dashedRingMaterial,
    radarGeometry, radarMaterial,
    nodeGeometry, nodeMaterials, haloGeometry, haloMaterials,
    auraGeometry, auraMaterial,
    edgeGeometry, edgeMaterial, edgePositionAttr,
    packetGeometry, packetMaterial, packetPositionAttr, packetAlphaAttr, packetCount,
    packetsPerEdge: profile.packetsPerEdge,
    dispose() {
      for (const item of disposables) item.dispose();
    },
  };
}

export type SceneAssets = ReturnType<typeof createSceneAssets>;

function createGlowMaterial(color: Color) {
  return new ShaderMaterial({
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor;
      uniform float uAlpha;
      varying vec2 vUv;
      void main() {
        float d = length(vUv - 0.5) * 2.0;
        float a = pow(max(0.0, 1.0 - d), 2.8) * uAlpha;
        if (a < 0.003) discard;
        gl_FragColor = vec4(uColor * a, a);
      }
    `,
    uniforms: { uColor: { value: color }, uAlpha: { value: 0.5 } },
    transparent: true,
    depthWrite: false,
    depthTest: false,
    blending: AdditiveBlending,
  });
}
