import {
  Group,
  LineBasicMaterial,
  Mesh,
  Plane,
  Points,
  PointsMaterial,
  Raycaster,
  Vector2,
  Vector3,
  type PerspectiveCamera,
} from "three";

import { flowMix, hudIndex, HUD_NAMES, sceneDim, smoothstep } from "../narrative";
import { QUALITY } from "../quality";
import {
  frameState,
  getDiscrete,
  publishSceneFrame,
  publishSceneHud,
  type QualityTier,
} from "../store";
import { NODE_COUNT } from "../nodes";
import { createGlowTexture, createSceneAssets, type SceneAssets } from "./assets";
import { FLOW_DOTS_PER_EDGE } from "./layout";

const FOV = 50;
const FIXED_TIME = 0;

export interface FrameContext {
  camera: PerspectiveCamera;
  width: number;
  height: number;
  pixelRatio: number;
  dt: number;
  reduced: boolean;
  introStart: number;
}

export class SceneRig {
  readonly assets: SceneAssets;
  readonly coreGroup: Group;
  readonly flowGroup: Group;
  readonly stars: Points;

  private coreMesh: Mesh | null = null;
  private halo: Points | null = null;
  private elapsed = 0;
  private pp = 0;
  private mxs = 0;
  private mys = 0;
  private dr = 0;
  private dv = 0;
  private gx0 = 0;
  private gy0 = 0;
  private fsx = 1;
  private ray = new Raycaster();
  private plane = new Plane(new Vector3(0, 0, 1), 0);
  private ndc = new Vector2();
  private hit = new Vector3();
  private tmp = new Vector3();
  private frameNodes = Array.from({ length: NODE_COUNT }, () => ({
    x: 0,
    y: 0,
    depth: 1,
    visible: false,
    labelShift: 0,
    behindCore: false,
  }));
  private glowTexture = createGlowTexture();
  private monitorFrames = 0;
  private monitorMs = 0;
  private monitorDone = false;
  private cameraConfigured = false;

  constructor(initialTier: QualityTier = "mid") {
    this.coreGroup = new Group();
    this.flowGroup = new Group();
    this.assets = createSceneAssets(QUALITY[initialTier], this.glowTexture);
    const a = this.assets;

    this.coreGroup.add(new Points(a.particleGeometry, a.particleMaterial));
    this.coreMesh = new Mesh(a.coreGeometry, a.coreMaterial);
    this.coreGroup.add(this.coreMesh);
    this.halo = new Points(a.haloGeometry, a.haloMaterial);
    this.coreGroup.add(this.halo);
    for (const ring of a.rings) this.coreGroup.add(ring.group);

    for (const edge of a.flowEdges) this.flowGroup.add(edge.line);
    this.flowGroup.add(new Points(a.flowDotGeometry, a.flowDotMaterial));

    this.stars = new Points(a.starGeometry, a.starMaterial);
  }

  setTier(tier: QualityTier) {
    const profile = QUALITY[tier];
    this.assets.particleGeometry.setDrawRange(0, Math.min(profile.particles, this.assets.particleCount));
  }

  /** Pointer burst at world point (already in coreGroup local space). */
  burstAt(local: Vector3) {
    const u = this.assets.particleMaterial.uniforms;
    (u.uC.value as Vector3).copy(local);
    u.uK.value = u.uT.value as number;
  }

  applyDragDelta(dxPx: number) {
    this.dv = dxPx * 0.0035;
  }

  dispose() {
    this.assets.dispose();
    this.glowTexture.dispose();
  }

  private maybeDowngrade(pixelRatio: number, onDowngrade: () => void) {
    if (this.monitorDone) return;
    this.monitorFrames += 1;
    if (this.monitorFrames === 90) {
      this.monitorDone = true;
      const avg = this.monitorMs / 90;
      if (avg > 32) {
        const draw = Math.floor(this.assets.particleCount * 0.45);
        this.assets.particleGeometry.setDrawRange(0, draw);
        onDowngrade();
      }
    }
  }

  update(ctx: FrameContext & { onSlowGpu?: () => void }) {
    const { camera, width, height, pixelRatio, dt, reduced, introStart } = ctx;
    const now = performance.now();

    if (!this.cameraConfigured) {
      camera.fov = FOV;
      camera.near = 0.1;
      camera.far = 100;
      this.cameraConfigured = true;
    }

    if (!reduced) this.elapsed += Math.min(dt, 0.05);
    const time = reduced ? FIXED_TIME : this.elapsed;
    frameState.time = time;

    const w = width;
    const h = height;
    const ar = w / h;
    this.gx0 = w > 800 ? Math.min(3.4, 1.9 * ar) : 0;
    this.gy0 = w > 800 ? 0 : 2.4;
    this.fsx = Math.min(1, 0.85 * ar);

    const ik = reduced ? 1 : Math.min(1, (now - introStart) / 3200);
    const tp = frameState.ppTarget;
    const pk = reduced ? 1 : 0.06;
    this.pp += (tp - this.pp) * pk;
    frameState.pp = this.pp;

    const up = Math.min(this.pp * 5, 2);
    const uF = flowMix(this.pp);
    const uD = sceneDim(this.pp, ik);

    this.mxs += (frameState.pointer.x - this.mxs) * 0.05;
    this.mys += (frameState.pointer.y - this.mys) * 0.05;

    this.coreGroup.position.set(this.gx0 * (1 - uF), this.gy0 * (1 - uF * 0.5), 0);
    this.flowGroup.position.copy(this.coreGroup.position);
    this.flowGroup.scale.set(this.fsx, this.fsx > 0.7 ? 1 : 0.75, 1);

    camera.position.set(
      this.mxs * 2.5 * (1 - uF * 0.7),
      -this.mys * 1.8 * (1 - uF * 0.7) + 1.2 * (1 - uF),
      11 + 5 * (1 - smoothstep(up, 0, 2)) + 2.5 * uF + 7 * (1 - smoothstep(ik, 0, 1)),
    );
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();

    this.dr += this.dv;
    this.dv *= 0.93;
    this.coreGroup.rotation.y = time * 0.05 + this.pp * 1.2 + this.dr;
    this.coreGroup.rotation.x = 0.12 + 0.45 * smoothstep(up, 1, 2);
    this.stars.rotation.y = time * 0.01 + this.mxs * 0.15 + this.pp * 0.3;
    this.stars.rotation.x = this.mys * 0.1;

    const a = this.assets;
    const pu = a.particleMaterial.uniforms;
    pu.uP.value = up;
    pu.uT.value = time;
    pu.uD.value = uD;
    pu.uPR.value = pixelRatio;

    this.ndc.set(frameState.pointer.x * 2, -frameState.pointer.y * 2);
    this.ray.setFromCamera(this.ndc, camera);
    if (this.ray.ray.intersectPlane(this.plane, this.hit)) {
      this.coreGroup.worldToLocal(this.hit);
      (pu.uM.value as Vector3).copy(this.hit);
    }

    if (frameState.burstScreen) {
      const { x, y } = frameState.burstScreen;
      this.ndc.set((x / w) * 2 - 1, -(y / h) * 2 + 1);
      this.ray.setFromCamera(this.ndc, camera);
      if (this.ray.ray.intersectPlane(this.plane, this.hit)) {
        this.coreGroup.worldToLocal(this.hit);
        this.burstAt(this.hit.clone());
      }
      frameState.burstScreen = null;
    }
    if (frameState.burstCenter) {
      this.burstAt(new Vector3(0, 0, 0));
      frameState.burstCenter = false;
    }

    const cu = a.coreMaterial.uniforms;
    const coreScale = 0.12 + 0.95 * smoothstep(up, 0.6, 2) + Math.sin(time * 2) * 0.03 * smoothstep(up, 0.6, 2);
    if (this.coreMesh) this.coreMesh.scale.setScalar(coreScale);
    cu.uI.value = 0.3 + 0.7 * smoothstep(up, 0.4, 1.4);
    cu.uS.value = smoothstep(up, 1.2, 2);

    const ro = smoothstep(up, 1.4, 2) * (1 - uF * 0.5);
    for (const ring of a.rings) {
      ring.group.rotation.y = time * ring.speed;
      (ring.line.material as LineBasicMaterial).opacity = 0.4 * ro;
      (ring.dots.material as PointsMaterial).opacity = 0.95 * ro;
    }

    if (this.halo) {
      const hm = this.halo.material as PointsMaterial;
      hm.opacity = (0.35 + 0.25 * Math.sin(time * 1.6)) * smoothstep(up, 0.9, 2) * (1 + 0.6 * uF) * 0.9;
      hm.size = 4 + 3 * smoothstep(up, 0.9, 2);
    }

    const discrete = getDiscrete();
    const hv = discrete.focusNode;
    a.flowDotMaterial.opacity = 0.95 * uF;
    const fdp = a.flowDotPositionAttr.array as Float32Array;
    for (let n = 0; n < NODE_COUNT; n++) {
      const edge = a.flowEdges[n];
      const lineMat = edge.line.material as LineBasicMaterial;
      lineMat.opacity = (hv < 0 ? 0.55 : n === hv ? 1 : 0.15) * uF;
      for (let j = 0; j < FLOW_DOTS_PER_EDGE; j++) {
        const u = (time * 0.35 + j / FLOW_DOTS_PER_EDGE + n * 0.13) % 1;
        edge.curve.getPoint(u, this.tmp);
        const q = (n * FLOW_DOTS_PER_EDGE + j) * 3;
        fdp[q] = this.tmp.x;
        fdp[q + 1] = this.tmp.y;
        fdp[q + 2] = this.tmp.z;
      }
    }
    a.flowDotPositionAttr.needsUpdate = true;

    for (let n = 0; n < NODE_COUNT; n++) {
      this.tmp.copy(a.flowNodePositions[n]).multiply(this.flowGroup.scale).add(this.flowGroup.position).project(camera);
      const fn = this.frameNodes[n];
      fn.x = (this.tmp.x * 0.5 + 0.5) * w;
      fn.y = (-this.tmp.y * 0.5 + 0.5) * h;
      fn.visible = this.tmp.z < 1;
      fn.depth = 1;
      fn.behindCore = false;
      fn.labelShift = 0;
    }

    this.tmp.copy(this.coreGroup.position).project(camera);
    const mx = (this.tmp.x * 0.5 + 0.5) * w;
    const my = (-this.tmp.y * 0.5 + 0.5) * h;

    const idx = hudIndex(up);
    publishSceneHud({ label: HUD_NAMES[idx], barWidth: up / 2 });
    publishSceneFrame({
      nodes: this.frameNodes,
      labelOpacity: uF,
      flowActive: uF > 0.6,
      monogram: { x: mx, y: my, opacity: uF },
      caption: discrete.focusNode >= 0 ? discrete.focusNode : -1,
    });

    if (!reduced && ctx.onSlowGpu) {
      this.monitorMs += Math.min(dt, 0.1) * 1000;
      this.maybeDowngrade(pixelRatio, ctx.onSlowGpu);
    }
  }
}
