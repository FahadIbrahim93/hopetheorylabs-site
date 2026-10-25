"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useState } from "react";
import type { PerspectiveCamera } from "three";

import type { QualityTier } from "../store";
import { SceneRig } from "./rig";

/*
  Thin React shell around the SceneRig: mounts the objects into the R3F
  scene graph and drives one update per frame. All per-frame mutation lives
  in the rig, so React never re-renders for animation.
*/

interface Props {
  tier: QualityTier;
  reduced: boolean;
  onFrameSample?: (dt: number) => void;
}

export function IntelligenceScene({ tier, reduced, onFrameSample }: Props) {
  const [rig] = useState(() => new SceneRig());
  const camera = useThree((s) => s.camera) as PerspectiveCamera;
  const size = useThree((s) => s.size);
  const gl = useThree((s) => s.gl);

  useEffect(() => () => rig.dispose(), [rig]);
  useEffect(() => rig.setTier(tier), [rig, tier]);

  useFrame((_, dt) => {
    onFrameSample?.(dt);
    rig.update({ camera, width: size.width, height: size.height, pixelRatio: gl.getPixelRatio(), dt, reduced });
  });

  const a = rig.assets;

  return (
    <>
      <ambientLight intensity={0.55} />
      <pointLight position={[0, 0, 0]} color="#ffbd61" intensity={14} distance={9} decay={2} />
      <directionalLight position={[4, 6, 5]} color="#dfe9f4" intensity={0.9} />

      <points geometry={a.particleGeometry} material={a.particleMaterial} frustumCulled={false} />
      <lineSegments geometry={a.linkGeometry} material={a.linkMaterial} frustumCulled={false} />
      <lineSegments geometry={a.shellGeometry} material={a.shellMaterial} />
      <mesh geometry={a.centreGeometry} material={a.centreMaterial} />
      <mesh ref={(el) => rig.setAura(el)} geometry={a.auraGeometry} material={a.auraMaterial} renderOrder={-1} />
      <mesh ref={(el) => rig.setRadar(el)} geometry={a.radarGeometry} material={a.radarMaterial} />

      {rig.rings.map((ring, i) => (
        <primitive key={`ring-${i}`} object={ring} />
      ))}

      {a.nodeMaterials.map((material, i) => (
        <mesh key={`node-${i}`} ref={(el) => rig.setNodeMesh(i, el)} geometry={a.nodeGeometry} material={material} />
      ))}
      {a.haloMaterials.map((material, i) => (
        <mesh key={`halo-${i}`} ref={(el) => rig.setHaloMesh(i, el)} geometry={a.haloGeometry} material={material} />
      ))}

      <lineSegments geometry={a.edgeGeometry} material={a.edgeMaterial} frustumCulled={false} />
      <points geometry={a.packetGeometry} material={a.packetMaterial} frustumCulled={false} />
    </>
  );
}
