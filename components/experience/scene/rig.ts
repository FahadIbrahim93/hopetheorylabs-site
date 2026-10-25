import {
  Line,
  MathUtils,
  QuadraticBezierCurve3,
  Vector3,
  type Mesh,
  type PerspectiveCamera,
} from "three";

import { blendNarrative, createBlendedState } from "../narrative";
import { QUALITY } from "../quality";
import {
  activeNode,
  experienceActions,
  frameState,
  getDiscrete,
  publishSceneFrame,
  type FrameNode,
  type QualityTier,
} from "../store";
import { createSceneAssets, type SceneAssets } from "./assets";
import {
  EDGE_SAMPLES,
  NODE_COUNT,
  nodeRingPosition,
  nodeScatteredPosition,
  writeEdgeCurve,
} from "./layout";

/*
  The scene rig owns every mutable thing the frame loop touches: GPU assets,
  scratch vectors, damped values and the object handles. The React component
  is a thin shell that mounts the objects and calls `update()` once per frame.

  Composition model: the core always sits at the world origin. Each section
  reserves a slot (data-scene-anchor); the rig shifts the camera's view
  offset so the origin lands on that slot and fits the camera distance to the
  slot size. The orbit stays centred, and layout drives composition.
*/

const FOV = 38;
const SCENE_RADIUS = 3.05; // ring radius + node/label margin, fitted into the anchor
const RING_TILT = 0.42;
const HOW_SECTION = 4;
const SERVICES_SECTION = 5;
const FIXED_TIME = 11.3; // ambient clock under reduced motion

// Service rows -> source node groups (Websites / AI integrations / AI transformation).
const SERVICE_GROUPS = [
  [0],
  [1, 4, 5, 6],
  [0, 1, 2, 3, 4, 5, 6, 7],
];

export interface FrameContext {
  camera: PerspectiveCamera;
  width: number;
  height: number;
  pixelRatio: number;
  dt: number;
  reduced: boolean;
}

export class SceneRig {
  readonly assets: SceneAssets;
  readonly rings: Line[];
  readonly nodeMeshes: (Mesh | null)[] = [];
  readonly haloMeshes: (Mesh | null)[] = [];
  private aura: Mesh | null = null;
  private radar: Mesh | null = null;

  private blended = createBlendedState();
  private ringPos = Array.from({ length: NODE_COUNT }, (_, i) => nodeRingPosition(i, new Vector3()));
  private scatterPos = Array.from({ length: NODE_COUNT }, (_, i) => nodeScatteredPosition(i, new Vector3()));
  private nodePos = Array.from({ length: NODE_COUNT }, () => new Vector3());
  private weights = new Float32Array(NODE_COUNT);
  private curves = Array.from({ length: NODE_COUNT }, () => new QuadraticBezierCurve3());
  private tmp = new Vector3();
  private tmp2 = new Vector3();
  private pointer = { x: 0, y: 0, strength: 0 };
  private pointerWorld = new Vector3();
  private frameNodes = Array.from({ length: NODE_COUNT }, (): FrameNode => ({ x: 0, y: 0, depth: 0, visible: false }));
  private stepMix = [1, 0, 0, 0];
  private coreBoost = 0;
  private hoverCandidate = -1;
  private sceneOwnsFocus = false;
  private elapsed = 0;
  private cameraConfigured = false;

  constructor() {
    this.assets = createSceneAssets(QUALITY.high);
    const a = this.assets;
    this.rings = [
      new Line(a.ringGeometry, a.ringMaterial),
      new Line(a.ringGeometry, a.ringMaterial),
      new Line(a.dashedRingGeometry, a.dashedRingMaterial),
    ];
    this.rings[0].scale.setScalar(1.55);
    this.rings[1].scale.setScalar(1.85);
    this.rings[2].scale.setScalar(1.28);
    this.rings[2].computeLineDistances();
  }

  /** Draw ranges follow the active tier; buffers stay allocated at "high". */
  setTier(tier: QualityTier) {
    const profile = QUALITY[tier];
    const a = this.assets;
    a.particleGeometry.setDrawRange(0, Math.min(profile.particles, a.particleCount));
    a.linkGeometry.setDrawRange(0, Math.min(profile.links * 2, a.linkCount));
    a.packetGeometry.setDrawRange(0, Math.min(NODE_COUNT * profile.packetsPerEdge, a.packetCount));
  }

  setNodeMesh(i: number, mesh: Mesh | null) {
    this.nodeMeshes[i] = mesh;
  }

  setHaloMesh(i: number, mesh: Mesh | null) {
    this.haloMeshes[i] = mesh;
  }

  setAura(mesh: Mesh | null) {
    this.aura = mesh;
  }

  setRadar(mesh: Mesh | null) {
    this.radar = mesh;
  }

  dispose() {
    this.assets.dispose();
  }

  update({ camera, width, height, pixelRatio, dt: rawDt, reduced }: FrameContext) {
    const dt = Math.min(rawDt, 0.05);
    const a = this.assets;
    const discrete = getDiscrete();
    const motion = reduced ? 0 : 1;

    if (!this.cameraConfigured) {
      camera.fov = FOV;
      camera.near = 0.5;
      camera.far = 60;
      this.cameraConfigured = true;
    }

    if (!reduced) this.elapsed += dt;
    const time = reduced ? FIXED_TIME : this.elapsed;
    frameState.time = time;

    /* 1. narrative blend */
    const b = blendNarrative(frameState.t, this.blended);

    /* 2. discrete overrides: how-it-works steps and service hover */
    const howInfluence = 1 - Math.min(1, Math.abs(frameState.t - HOW_SECTION));
    const servicesInfluence = 1 - Math.min(1, Math.abs(frameState.t - SERVICES_SECTION));
    const k = reduced ? 1 : 1 - Math.exp(-dt * 5);
    for (let i = 0; i < 4; i++) {
      const target = discrete.step === i ? 1 : 0;
      this.stepMix[i] += (target - this.stepMix[i]) * k;
    }
    const mapMix = this.stepMix[0] * howInfluence;
    const selfMix = this.stepMix[1] * howInfluence;
    const connectMix = this.stepMix[2] * howInfluence;
    const actMix = this.stepMix[3] * howInfluence;

    const assembly = MathUtils.lerp(b.assembly, 1, selfMix);
    let connection = MathUtils.lerp(b.connection, 1, Math.min(1, connectMix + actMix));
    connection = MathUtils.lerp(connection, 0.15, mapMix);
    let signals = MathUtils.lerp(b.signals, 1, Math.min(1, connectMix + actMix));
    signals = MathUtils.lerp(signals, 0.1, Math.min(1, mapMix + selfMix));
    const outbound = MathUtils.lerp(b.outbound, 1, actMix);
    const radar = Math.min(1, b.radar + mapMix);
    this.coreBoost += (selfMix - this.coreBoost) * k;

    /* 3. composition: anchors -> camera view offset + fitted distance */
    const { vw, vh, scrollY } = frameState;
    const anchorA = frameState.anchors.get(b.anchorA);
    const anchorB = frameState.anchors.get(b.anchorB);
    const ax = anchorA ? anchorA.left + anchorA.width / 2 : vw / 2;
    const ay = anchorA ? anchorA.top - scrollY + anchorA.height / 2 : vh / 2;
    const ar = anchorA ? Math.min(anchorA.width, anchorA.height) / 2 : Math.min(vw, vh) * 0.35;
    const cx = anchorB ? anchorB.left + anchorB.width / 2 : vw / 2;
    const cy = anchorB ? anchorB.top - scrollY + anchorB.height / 2 : vh / 2;
    const cr = anchorB ? Math.min(anchorB.width, anchorB.height) / 2 : Math.min(vw, vh) * 0.35;
    const mix = b.anchorMix;
    const px = MathUtils.lerp(ax, cx, mix);
    const py = MathUtils.lerp(ay, cy, mix);
    const pr = Math.max(40, MathUtils.lerp(ar, cr, mix));

    const tanHalf = Math.tan(MathUtils.degToRad(FOV / 2));
    const fitted = (SCENE_RADIUS * height) / (2 * pr * tanHalf);
    const dist = MathUtils.clamp(fitted * b.zoom, 3.6, 22);

    /* 4. pointer (damped) + camera */
    const pointerTargetX = frameState.pointer.active ? frameState.pointer.x : 0;
    const pointerTargetY = frameState.pointer.active ? frameState.pointer.y : 0;
    const pk = reduced ? 1 : 1 - Math.exp(-dt * 3.5);
    this.pointer.x += (pointerTargetX - this.pointer.x) * pk;
    this.pointer.y += (pointerTargetY - this.pointer.y) * pk;

    const az = b.orbit + time * 0.045 + this.pointer.x * 0.14 * motion;
    const el = b.elevation + this.pointer.y * 0.1 * motion;
    camera.position.set(
      dist * Math.cos(el) * Math.sin(az),
      dist * Math.sin(el),
      dist * Math.cos(el) * Math.cos(az),
    );
    camera.lookAt(0, 0, 0);
    camera.setViewOffset(width, height, width / 2 - px, height / 2 - py, width, height);
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld();

    // Pointer in world space on the screen-parallel plane through the origin.
    const originNdcZ = this.tmp.set(0, 0, 0).project(camera).z;
    this.pointerWorld.set(frameState.pointer.x, frameState.pointer.y, originNdcZ).unproject(camera);
    const pointerStrengthTarget = frameState.pointer.active && b.dim > 0.5 ? 1 : 0;
    this.pointer.strength += (pointerStrengthTarget - this.pointer.strength) * pk;

    /* 5. node positions, weights, meshes */
    const focused = activeNode();
    const focusActive = focused >= 0 ? 1 : 0;
    const serviceGroup = discrete.serviceFocus >= 0 ? SERVICE_GROUPS[discrete.serviceFocus] : null;
    const scanPos = (time * 0.9) % NODE_COUNT;
    const wk = reduced ? 1 : 1 - Math.exp(-dt * 7);
    const edgeWeights = a.edgeMaterial.uniforms.uWeights.value as number[];
    for (let i = 0; i < NODE_COUNT; i++) {
      const p = this.nodePos[i].lerpVectors(this.ringPos[i], this.scatterPos[i], b.spread);
      let w = 0;
      if (focused === i) w = 1;
      if (serviceGroup && serviceGroup.includes(i)) w = Math.max(w, 0.85 * servicesInfluence);
      if (mapMix > 0.01) {
        const d = Math.min(Math.abs(scanPos - i), NODE_COUNT - Math.abs(scanPos - i));
        w = Math.max(w, Math.max(0, 1 - d) * mapMix);
      }
      if (actMix > 0.01) w = Math.max(w, (0.35 + 0.25 * Math.sin(time * 2 + i)) * actMix);
      this.weights[i] += (w - this.weights[i]) * wk;
      const weight = this.weights[i];
      edgeWeights[i] = weight;

      const mesh = this.nodeMeshes[i];
      if (mesh) {
        mesh.position.copy(p);
        mesh.scale.setScalar(1 + weight * 0.5);
        a.nodeMaterials[i].emissiveIntensity = 0.3 + weight * 1.6;
      }
      const halo = this.haloMeshes[i];
      if (halo) {
        halo.position.copy(p);
        halo.quaternion.copy(camera.quaternion);
        halo.scale.setScalar(0.42 + weight * 0.5);
        a.haloMaterials[i].uniforms.uAlpha.value = (0.28 + weight * 0.55) * b.dim * (1 - b.spread * 0.35);
      }

      // Projection for HTML labels + pointer proximity.
      this.tmp2.copy(p).project(camera);
      const sx = (this.tmp2.x * 0.5 + 0.5) * width;
      const sy = (-this.tmp2.y * 0.5 + 0.5) * height;
      const fn = this.frameNodes[i];
      fn.x = sx;
      fn.y = sy;
      const camDist = camera.position.distanceTo(p);
      fn.depth = MathUtils.clamp(1 - (camDist - (dist - 2.6)) / 5.2, 0, 1);
      fn.visible = this.tmp2.z < 1 && sx > -40 && sx < width + 40 && sy > -40 && sy < height + 40;
    }

    // Pointer proximity hover (mouse/pen only; touch uses the HTML labels).
    let best = -1;
    if (frameState.pointer.active && b.labels > 0.2 && !reduced) {
      const mx = (frameState.pointer.x * 0.5 + 0.5) * width;
      const my = (-frameState.pointer.y * 0.5 + 0.5) * height;
      let bestDist = 34;
      for (let i = 0; i < NODE_COUNT; i++) {
        const fn = this.frameNodes[i];
        if (!fn.visible) continue;
        const d = Math.hypot(fn.x - mx, fn.y - my);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      }
    }
    if (best !== this.hoverCandidate) {
      const previous = this.hoverCandidate;
      this.hoverCandidate = best;
      if (best >= 0) {
        experienceActions.setFocusNode(best);
        this.sceneOwnsFocus = true;
      } else if (this.sceneOwnsFocus && discrete.focusNode === previous) {
        experienceActions.setFocusNode(-1);
        this.sceneOwnsFocus = false;
      }
    }

    /* 6. edges + packets */
    const ep = a.edgePositionAttr.array as Float32Array;
    const pp = a.packetPositionAttr.array as Float32Array;
    const pa = a.packetAlphaAttr.array as Float32Array;
    const perEdge = a.packetsPerEdge;
    const bothWays = outbound > 0.3 && outbound < 0.7;
    for (let e = 0; e < NODE_COUNT; e++) {
      const curve = this.curves[e];
      writeEdgeCurve(e, this.nodePos[e], curve);
      for (let i = 0; i <= EDGE_SAMPLES; i++) {
        curve.getPoint(i / EDGE_SAMPLES, this.tmp);
        if (i < EDGE_SAMPLES) {
          const v = (e * EDGE_SAMPLES + i) * 6;
          ep[v] = this.tmp.x;
          ep[v + 1] = this.tmp.y;
          ep[v + 2] = this.tmp.z;
        }
        if (i > 0) {
          const v = (e * EDGE_SAMPLES + i - 1) * 6 + 3;
          ep[v] = this.tmp.x;
          ep[v + 1] = this.tmp.y;
          ep[v + 2] = this.tmp.z;
        }
      }
      const edgeWeight = this.weights[e];
      for (let j = 0; j < perEdge; j++) {
        const idx = e * perEdge + j;
        const phase = (time * (0.16 + e * 0.011) + j / perEdge + e * 0.13) % 1;
        // 0 = source, 1 = core. Outbound flips direction; mid values alternate per packet.
        const inward = bothWays ? j % 2 === 0 : outbound < 0.5;
        const along = inward ? phase : 1 - phase;
        curve.getPoint(along, this.tmp);
        pp[idx * 3] = this.tmp.x;
        pp[idx * 3 + 1] = this.tmp.y;
        pp[idx * 3 + 2] = this.tmp.z;
        const drawn = connection * 1.5 - e * 0.07 > along ? 1 : 0;
        const active = signals >= (j + 1) / perEdge - 0.001 ? 1 : 0;
        const recede = focusActive && focused !== e ? 0.35 : 1;
        pa[idx] = drawn * active * (0.55 + edgeWeight * 0.45) * recede;
      }
    }
    a.edgePositionAttr.needsUpdate = true;
    a.packetPositionAttr.needsUpdate = true;
    a.packetAlphaAttr.needsUpdate = true;

    /* 7. uniforms + simple materials */
    const pixelScale = (height * pixelRatio) / (2 * tanHalf);
    const pu = a.particleMaterial.uniforms;
    pu.uTime.value = time;
    pu.uAssembly.value = assembly;
    pu.uPixelScale.value = pixelScale;
    pu.uMotion.value = motion;
    pu.uDim.value = b.dim;
    (pu.uPointer.value as Vector3).copy(this.pointerWorld);
    pu.uPointerStrength.value = this.pointer.strength * motion;

    const lu = a.linkMaterial.uniforms;
    lu.uTime.value = time;
    lu.uAssembly.value = assembly;
    lu.uMotion.value = motion;
    lu.uStrength.value = b.links * (0.8 + this.coreBoost * 0.6);
    lu.uDim.value = b.dim;

    const eu = a.edgeMaterial.uniforms;
    eu.uTime.value = time;
    eu.uConnection.value = connection;
    eu.uMotion.value = motion;
    eu.uOutbound.value = outbound;
    eu.uDim.value = b.dim;
    eu.uFocusActive.value = focusActive;

    a.packetMaterial.uniforms.uPixelScale.value = pixelScale;
    a.packetMaterial.uniforms.uDim.value = b.dim;

    const ru = a.radarMaterial.uniforms;
    ru.uSweep.value = (time * (0.11 + mapMix * 0.18)) % 1;
    ru.uStrength.value = radar;
    ru.uDim.value = b.dim;

    a.shellMaterial.opacity = (0.06 + 0.1 * assembly + this.coreBoost * 0.14) * b.dim;
    a.centreMaterial.opacity = (0.75 + this.coreBoost * 0.25) * b.dim * (0.4 + 0.6 * assembly);
    a.ringMaterial.opacity = 0.2 * assembly * b.dim;
    a.dashedRingMaterial.opacity = 0.32 * assembly * b.dim;
    a.auraMaterial.uniforms.uAlpha.value =
      (0.34 + this.coreBoost * 0.3 + 0.12 * Math.sin(time * 0.7) * motion) * b.dim * (0.3 + 0.7 * assembly);

    if (this.aura) {
      this.aura.quaternion.copy(camera.quaternion);
      this.aura.scale.setScalar(4.2 + 0.3 * Math.sin(time * 0.5) * motion);
    }
    if (this.radar) {
      this.radar.rotation.set(-Math.PI / 2 + RING_TILT, 0, 0);
      this.radar.scale.setScalar(1.95);
    }
    this.rings[0].rotation.set(1.15, time * 0.05 * motion, 0.3);
    this.rings[1].rotation.set(0.55, -time * 0.035 * motion, -1.1);
    this.rings[2].rotation.set(-Math.PI / 2 + RING_TILT, 0, 0);

    /* 8. publish to DOM overlays */
    publishSceneFrame({ nodes: this.frameNodes, labelOpacity: b.labels * b.dim });
  }
}
