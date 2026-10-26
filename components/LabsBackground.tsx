"use client";

import { useEffect, useRef } from "react";

/*
  The one signature interaction (docs/SPEC.md): a faint gold dot/particle
  field behind the hero that drifts slowly as a quiet supporting layer.

  Budget (docs/SPEC.md): under 8 KB, no libraries, 2D canvas only.
  - Starts only after first paint, and only while the hero is visible
    (IntersectionObserver) and the tab is visible (visibilitychange).
  - Max 60 particles on mobile, 140 on desktop; devicePixelRatio capped at 2.
  - Dot opacity 0.15–0.4; no pointer interaction, keeping the intelligence core as the signature.
  - prefers-reduced-motion: exactly one static frame, no drift.
  Canvas is aria-hidden; the static CSS fallback beneath it carries the look.

  Loaded with next/dynamic ssr:false from Hero (client component), so this
  module only ships after first paint.
*/

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number; // radius, px
  base: number; // base opacity 0.15–0.4
}

const COUNT_MOBILE = 60;
const COUNT_DESKTOP = 140;
const MIN_OPACITY = 0.15;
const MAX_OPACITY = 0.4;
const DRIFT = 3.5; // max drift speed, px/s

const MOBILE_QUERY = "(max-width: 767px)";
const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

export default function LabsBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvasEl = canvasRef.current;
    const ctx = canvasEl?.getContext("2d") ?? null;
    if (!canvasEl || !ctx) return;
    const canvas: HTMLCanvasElement = canvasEl;

    const reduced = window.matchMedia(REDUCED_QUERY);
    const mobile = window.matchMedia(MOBILE_QUERY);

    let particles: Particle[] = [];
    let width = 0;
    let height = 0;
    let raf = 0;
    let visible = false; // hero on screen
    let running = false;
    let last = 0;

    function resize() {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, Math.round(rect.width));
      height = Math.max(1, Math.round(rect.height));
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    }

    function seed() {
      const count = mobile.matches ? COUNT_MOBILE : COUNT_DESKTOP;
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() * 2 - 1) * DRIFT,
        vy: (Math.random() * 2 - 1) * DRIFT,
        r: 0.6 + Math.random() * 1.2,
        base: MIN_OPACITY + Math.random() * (MAX_OPACITY - MIN_OPACITY),
      }));
    }

    function opacityFor(p: Particle): number {
      return Math.min(p.base, MAX_OPACITY);
    }

    /** Advance one step (dt seconds) and paint. dt = 0 paints without moving. */
    function step(dt: number) {
      ctx!.clearRect(0, 0, width, height);
      for (const p of particles) {
        if (dt > 0) {
          // Slow random drift.
          p.x += p.vx * dt;
          p.y += p.vy * dt;

          // Wrap around the edges.
          if (p.x < -4) p.x = width + 4;
          else if (p.x > width + 4) p.x = -4;
          if (p.y < -4) p.y = height + 4;
          else if (p.y > height + 4) p.y = -4;
        }

        ctx!.fillStyle = `rgba(184, 137, 47, ${opacityFor(p).toFixed(3)})`;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx!.fill();
      }
    }

    function frame(now: number) {
      if (!running) return;
      const dt = Math.min((now - last) / 1000, 0.1); // clamp tab-switch jumps
      last = now;
      step(dt);
      raf = window.requestAnimationFrame(frame);
    }

    function start() {
      if (running || !visible) return;
      running = true;
      if (reduced.matches) {
        // One static frame only — no drift, no loop (docs/SPEC.md).
        step(0);
        running = false;
      } else {
        last = performance.now();
        raf = window.requestAnimationFrame(frame);
      }
    }

    function stop() {
      running = false;
      if (raf) {
        window.cancelAnimationFrame(raf);
        raf = 0;
      }
    }

    resize();

    // Start only when the hero is on screen; pause when scrolled away.
    const io = new IntersectionObserver(
      (entries) => {
        visible = entries.some((e) => e.isIntersecting);
        if (visible) start();
        else stop();
      },
      { threshold: 0 },
    );
    io.observe(canvas);

    // Pause when the tab is hidden.
    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };
    document.addEventListener("visibilitychange", onVisibility);

    const onResize = () => {
      resize();
      if (running) last = performance.now();
      else if (reduced.matches) step(0); // keep the reduced-motion frame sized
    };
    window.addEventListener("resize", onResize);

    return () => {
      stop();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 h-full w-full" />
  );
}
