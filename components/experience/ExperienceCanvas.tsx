"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { NoToneMapping, type WebGLRenderer } from "three";

import { createFrameMonitor, lowerTier, QUALITY } from "./quality";
import { IntelligenceScene } from "./scene/IntelligenceScene";
import { experienceActions, frameState, registerInvalidator, type QualityTier } from "./store";

/*
  Hosts the single WebGL renderer. Responsibilities: pixel-ratio cap per
  tier, runtime frame monitoring (steps the tier down, never up), shader
  link-failure detection via renderer.debug.onShaderError, context-loss
  handling, and demand-only rendering when the visitor prefers reduced motion.
  The parent decides what to do on failure (swap to the SVG fallback).
*/

interface Props {
  initialTier: QualityTier;
  reduced: boolean;
  onReady: () => void;
  onFailure: (reason: string) => void;
}

declare global {
  interface Window {
    __htlExperience?: {
      tier: QualityTier;
      dpr: number;
      avgFrameMs: number | null;
      downgrades: number;
      renderer: string;
      /** Read-only snapshot of the scroll narrative for QA tooling. */
      readonly progress: { t: number; scrollY: number; anchors: Record<string, { top: number; height: number }> };
      /** Frames rendered so far (lets QA confirm demand rendering under reduced motion). */
      readonly frames: number;
    };
  }
}

export default function ExperienceCanvas({ initialTier, reduced, onReady, onFailure }: Props) {
  const [tier, setTier] = useState<QualityTier>(initialTier);
  const failed = useRef(false);
  const glRef = useRef<WebGLRenderer | null>(null);

  const fail = useCallback(
    (reason: string) => {
      if (failed.current) return;
      failed.current = true;
      onFailure(reason);
    },
    [onFailure],
  );

  const monitor = useMemo(
    () =>
      createFrameMonitor((avgMs) => {
        setTier((current) => {
          const next = lowerTier(current);
          if (window.__htlExperience) {
            window.__htlExperience.avgFrameMs = avgMs;
            window.__htlExperience.downgrades += 1;
          }
          return next;
        });
      }),
    [],
  );

  // Apply the tier's pixel-ratio cap to the live renderer and publish diagnostics.
  useEffect(() => {
    experienceActions.setTier(tier);
    const gl = glRef.current;
    if (!gl) return;
    const dpr = Math.min(window.devicePixelRatio || 1, QUALITY[tier].maxDpr);
    gl.setPixelRatio(dpr);
    const parent = gl.domElement.parentElement;
    if (parent) gl.setSize(parent.clientWidth, parent.clientHeight, false);
    if (window.__htlExperience) {
      window.__htlExperience.tier = tier;
      window.__htlExperience.dpr = dpr;
    }
  }, [tier]);

  const maxDpr = QUALITY[initialTier].maxDpr;

  return (
    <Canvas
      className="experience-canvas"
      frameloop={reduced ? "demand" : "always"}
      dpr={[1, maxDpr]}
      flat
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
        failIfMajorPerformanceCaveat: false,
        toneMapping: NoToneMapping,
      }}
      camera={{ fov: 38, near: 0.5, far: 60, position: [0, 0, 7] }}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      onCreated={({ gl }) => {
        glRef.current = gl;
        gl.setClearColor(0x000000, 0);
        gl.debug.onShaderError = (context, program, vertexShader, fragmentShader) => {
          console.error(
            "[experience] shader link failed",
            context.getShaderInfoLog(vertexShader),
            context.getShaderInfoLog(fragmentShader),
            context.getProgramInfoLog(program),
          );
          fail("shader");
        };
        gl.domElement.addEventListener("webglcontextlost", () => fail("context-lost"), { once: true });
        const info = gl.getContext().getParameter(gl.getContext().VERSION) as string;
        window.__htlExperience = {
          tier: initialTier,
          dpr: gl.getPixelRatio(),
          avgFrameMs: null,
          downgrades: 0,
          renderer: typeof info === "string" ? info : "webgl",
          get frames() {
            return gl.info.render.frame;
          },
          get progress() {
            const anchors: Record<string, { top: number; height: number }> = {};
            frameState.anchors.forEach((rect, id) => {
              anchors[id] = { top: rect.top, height: rect.height };
            });
            return { t: frameState.t, scrollY: frameState.scrollY, anchors };
          },
        };
      }}
    >
      <DemandBridge reduced={reduced} />
      <ReadySignal onReady={onReady} failed={failed} />
      <IntelligenceScene tier={tier} reduced={reduced} onFrameSample={reduced ? undefined : monitor.sample} />
    </Canvas>
  );
}

/** Lets scroll/pointer/focus changes request a frame when the loop is demand-only. */
function DemandBridge({ reduced }: { reduced: boolean }) {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    registerInvalidator(reduced ? () => invalidate() : null);
    return () => registerInvalidator(null);
  }, [invalidate, reduced]);
  return null;
}

/**
 * Declares the scene ready after the first frames have been drawn and no
 * shader failed to link, so the fallback crossfades out only once there is
 * really something to look at.
 */
function ReadySignal({ onReady, failed }: { onReady: () => void; failed: React.RefObject<boolean> }) {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  const camera = useThree((s) => s.camera);
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    let cancelled = false;
    // Compile everything up front so link errors surface before we commit.
    try {
      gl.compile(scene, camera);
    } catch (error) {
      console.error("[experience] compile failed", error);
      return;
    }
    invalidate();
    const id = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        if (cancelled || failed.current) return;
        onReady();
      });
    });
    return () => {
      cancelled = true;
      window.cancelAnimationFrame(id);
    };
  }, [gl, scene, camera, invalidate, onReady, failed]);
  return null;
}
