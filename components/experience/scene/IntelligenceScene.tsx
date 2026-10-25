"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useState } from "react";
import type { PerspectiveCamera } from "three";

import type { QualityTier } from "../store";
import { frameState } from "../store";
import { SceneRig } from "./rig";

interface Props {
  tier: QualityTier;
  reduced: boolean;
  introStart: number;
  onFrameSample?: (dt: number) => void;
  onSlowGpu?: () => void;
}

export function IntelligenceScene({ tier, reduced, introStart, onFrameSample, onSlowGpu }: Props) {
  const [rig] = useState(() => new SceneRig());
  const camera = useThree((s) => s.camera) as PerspectiveCamera;
  const size = useThree((s) => s.size);
  const gl = useThree((s) => s.gl);

  useEffect(() => () => rig.dispose(), [rig]);
  useEffect(() => rig.setTier(tier), [rig, tier]);

  useFrame((_, dt) => {
    onFrameSample?.(dt);
    const dx = frameState.dragDx;
    frameState.dragDx = 0;
    rig.applyDragDelta(dx);
    rig.update({
      camera,
      width: size.width,
      height: size.height,
      pixelRatio: gl.getPixelRatio(),
      dt,
      reduced,
      introStart,
      onSlowGpu,
    });
  });

  return (
    <>
      <primitive object={rig.coreGroup} />
      <primitive object={rig.flowGroup} />
      <primitive object={rig.stars} />
    </>
  );
}
