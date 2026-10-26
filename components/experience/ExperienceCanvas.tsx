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
  handling, demand-only rendering when the visitor prefers reduced motion,
  and a paused ("never") frameloop while offscreen or the tab is hidden.
  The parent decides what to do on failure (swap to the SVG fallback).
*/

interface Props {
  initialTier: QualityTier;
  reduced: boolean;
  introStart: number;
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
      readonly progress: { t: number; pp: number; scrollY: number };
      /** Frames rendered so far (lets QA confirm demand rendering under reduced motion). */
      readonly frames: number;
    };
  }
}

export default function ExperienceCanvas({ initialTier, reduced, introStart, onReady, onFailure }: Props) {
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
  const active = useActive(glRef);

  return (
    <Canvas
      className="experience-canvas"
      frameloop={!active ? "never" : reduced ? "demand" : "always"}
      dpr={[1, maxDpr]}
      flat
      gl={{
        antialias: false,
        alpha: true,
        powerPreference: "high-performance",
        failIfMajorPerformanceCaveat: false,
        toneMapping: NoToneMapping,
      }}
      camera={{ fov: 50, near: 0.1, far: 100, position: [0, 0, 11] }}
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
            return { t: frameState.t, pp: frameState.pp, scrollY: frameState.scrollY };
          },
        };
      }}
    >
      <DemandBridge reduced={reduced} />
      <ReadySignal onReady={onReady} failed={failed} />
      <IntelligenceScene
        tier={tier}
        reduced={reduced}
        introStart={introStart}
        onFrameSample={reduced ? undefined : monitor.sample}
        onSlowGpu={() => {
          setTier((current) => lowerTier(current));
          const gl = glRef.current;
          if (gl) {
            gl.setPixelRatio(1);
            if (window.__htlExperience) window.__htlExperience.dpr = 1;
          }
        }}
      />
    </Canvas>
  );
}

/**
 * True while the canvas is on screen and the tab is visible. Drives the
 * frameloop to "never" otherwise so no GPU/CPU time is spent offscreen.
 */
function useActive(glRef: React.RefObject<WebGLRenderer | null>) {
  const [visible, setVisible] = useState(() => typeof document === "undefined" || !document.hidden);
  const [onscreen, setOnscreen] = useState(true);
  useEffect(() => {
    const onVis = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVis);
    let io: IntersectionObserver | null = null;
    let raf = 0;
    const attach = () => {
      const el = glRef.current?.domElement;
      if (!el) {
        raf = window.requestAnimationFrame(attach);
        return;
      }
      if (typeof IntersectionObserver === "undefined") return;
      io = new IntersectionObserver((entries) => {
        for (const entry of entries) setOnscreen(entry.isIntersecting);
      });
      io.observe(el);
    };
    attach();
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      window.cancelAnimationFrame(raf);
      io?.disconnect();
    };
  }, [glRef]);
  return visible && onscreen;
}

/** Lets scroll/pointer/focus changes request a frame when the loop is demand-only. */
function DemandBridge({ reduced }: { reduced: boolean }) {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    registerInvalidator(reduced ? () => invalidate() : null);
    // Draw one settled frame when the preference flips mid-session.
    invalidate();
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
