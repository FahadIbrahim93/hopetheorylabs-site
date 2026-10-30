"use client";

import { useEffect } from "react";

/*
  The locked homepage shader was cut off mid-line at `vec3`.
  The uniforms and attributes that did arrive describe a two-stage morph:
  scattered points (position) → a sphere (aB) → orbiting rings (aC),
  driven by scroll progress uP, time uT, pixel ratio uPR, and a pointer uM.
  This file completes that field. It is not a verbatim copy of the missing lines.
*/

const VERT = `#version 300 es
precision mediump float;
in vec3 position;
in vec3 aB;
in vec3 aC;
in float aR;
uniform float uP;
uniform float uT;
uniform float uPR;
uniform float uD;
uniform vec3 uM;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
out vec3 vC;
out float vA;
void main() {
  float t1 = clamp((uP - aR * 0.35) / 0.65, 0.0, 1.0);
  t1 = t1 * t1 * (3.0 - 2.0 * t1);
  float t2 = clamp((uP - 1.0 - aR * 0.35) / 0.65, 0.0, 1.0);
  t2 = t2 * t2 * (3.0 - 2.0 * t2);
  vec3 c = aC;
  float r = length(c.xz);
  float an = uT * 0.4 / (0.8 + r * 0.4);
  float cs = cos(an);
  float sn = sin(an);
  c.xz = mat2(cs, -sn, sn, cs) * c.xz;
  vec3 a = position + vec3(
    sin(uT * 0.3 + aR * 40.0),
    cos(uT * 0.25 + aR * 55.0),
    sin(uT * 0.2 + aR * 30.0)
  ) * 0.5;
  vec3 b = aB * (1.0 + 0.015 * sin(uT * 1.5 + aR * 20.0));
  vec3 p = mix(mix(a, b, t1), c, t2);
  vec3 d = p - uM;
  float pull = exp(-dot(d, d) * 0.35);
  p += normalize(d + 0.0001) * pull * 0.9;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = (1.05 + aR * 1.35) * uPR * (11.0 / max(1.0, -mv.z)) * (1.0 + t2 * 0.15);
  vec3 dust = vec3(0.62, 0.66, 0.70);
  vec3 teal = vec3(0.498, 0.839, 0.761);
  vC = mix(dust, teal, max(t1, t2));
  float ndcX = gl_Position.x / gl_Position.w;
  float keepRight = smoothstep(0.02, 0.48, ndcX);
  float assembled = smoothstep(1.05, 1.4, uP);
  vA = mix(0.28, 0.55, max(t1, t2)) * clamp(uD, 0.0, 1.0) * mix(1.0, keepRight, assembled);
}`;

const FRAG = `#version 300 es
precision mediump float;
in vec3 vC;
in float vA;
out vec4 fragColor;
void main() {
  vec2 q = gl_PointCoord * 2.0 - 1.0;
  float d = dot(q, q);
  if (d > 1.0) discard;
  fragColor = vec4(vC, vA * smoothstep(1.0, 0.2, d));
}`;

const STAGES: Record<string, [string, string]> = {
  top: ["Scattered", "16%"],
  method: ["Mapping", "34%"],
  shift: ["Connecting", "50%"],
  flow: ["Flowing", "66%"],
  how: ["Integrating", "80%"],
  services: ["Intelligent", "100%"],
  work: ["Intelligent", "100%"],
  about: ["Intelligent", "100%"],
  contact: ["Intelligent", "100%"],
};

const NODE_LAYOUT: {
  desktop: [number, number];
  mobile: [number, number];
  scatter: [number, number];
}[] = [
  { desktop: [84, 12], mobile: [31, 10], scatter: [-14, -10] },
  { desktop: [80, 26], mobile: [50, 10], scatter: [-8, -16] },
  { desktop: [92, 44], mobile: [79, 10], scatter: [8, -6] },
  { desktop: [78, 66], mobile: [97, 10], scatter: [-12, 10] },
  { desktop: [91, 84], mobile: [31, 15.5], scatter: [6, 14] },
  { desktop: [90, 16], mobile: [50, 15.5], scatter: [16, -12] },
  { desktop: [86, 58], mobile: [79, 15.5], scatter: [12, 2] },
  { desktop: [88, 74], mobile: [97, 15.5], scatter: [14, 12] },
];

function perspective(fov: number, aspect: number, near: number, far: number) {
  const f = 1 / Math.tan(fov / 2);
  const nf = 1 / (near - far);
  const out = new Float32Array(16);
  out[0] = f / aspect;
  out[5] = f;
  out[10] = (far + near) * nf;
  out[11] = -1;
  out[14] = 2 * far * near * nf;
  return out;
}

function viewMatrix() {
  const out = new Float32Array(16);
  out[0] = 1;
  out[5] = 1;
  out[10] = 1;
  out[15] = 1;
  out[13] = -0.05;
  out[14] = -6.2;
  return out;
}

function makeField(count: number) {
  const position = new Float32Array(count * 3);
  const aB = new Float32Array(count * 3);
  const aC = new Float32Array(count * 3);
  const aR = new Float32Array(count);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i += 1) {
    const rnd = Math.random();
    aR[i] = rnd;
    const theta = Math.random() * Math.PI * 2;
    const rad = 2.4 + Math.random() * 4.8;
    position[i * 3] = Math.cos(theta) * rad * (0.75 + Math.random() * 0.5);
    position[i * 3 + 1] = (Math.random() - 0.5) * 5.6;
    position[i * 3 + 2] = Math.sin(theta) * rad * 0.42;

    const y = 1 - (i / Math.max(1, count - 1)) * 2;
    const ring = Math.sqrt(Math.max(0, 1 - y * y));
    const th = golden * i;
    const sr = 2.05;
    aB[i * 3] = Math.cos(th) * ring * sr + 1.9;
    aB[i * 3 + 1] = y * sr * 0.92;
    aB[i * 3 + 2] = Math.sin(th) * ring * sr;

    const th2 = golden * i * 2.0;
    const sr2 = 1.55;
    aC[i * 3] = Math.cos(th2) * ring * sr2 + 2.85;
    aC[i * 3 + 1] = y * sr2;
    aC[i * 3 + 2] = Math.sin(th2) * ring * sr2 * 0.7;
  }
  return { position, aB, aC, aR, count };
}

function compile(gl: WebGL2RenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export function HomeMotion() {
  useEffect(() => {
    const root = document.documentElement;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobileQuery = window.matchMedia("(max-width: 800px)");
    let alive = true;

    const sections = Array.from(
      document.querySelectorAll<HTMLElement>(".lock section"),
    );
    const reveal = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) entry.target.classList.add("vis");
        }
      },
      { threshold: 0.3 },
    );
    for (const section of sections) reveal.observe(section);

    const go = (id: string) => {
      document
        .getElementById(id)
        ?.scrollIntoView({ behavior: reduced.matches ? "auto" : "smooth" });
    };
    const onGo = (event: Event) => {
      const target = (event.currentTarget as HTMLElement | null)?.dataset.go;
      if (!target) return;
      event.preventDefault();
      go(target);
    };
    const jumpers = Array.from(
      document.querySelectorAll<HTMLElement>("[data-go]"),
    );
    for (const jumper of jumpers) jumper.addEventListener("click", onGo);

    const skip = document.getElementById("sk");
    const onSkip = () => {
      const main = document.getElementById("main");
      if (!(main instanceof HTMLElement)) return;
      main.focus();
      main.scrollIntoView();
    };
    skip?.addEventListener("click", onSkip);

    const stepButtons = Array.from(
      document.querySelectorAll<HTMLButtonElement>(".stp button"),
    );
    const stepText = document.getElementById("stx");
    const onStep = (event: Event) => {
      const button = event.currentTarget as HTMLButtonElement;
      for (const other of stepButtons) {
        if (other === button) other.setAttribute("aria-current", "true");
        else other.removeAttribute("aria-current");
      }
      if (stepText) stepText.textContent = button.dataset.text ?? "";
    };
    for (const button of stepButtons) button.addEventListener("click", onStep);

    const form = document.getElementById("fm");
    const onSubmit = (event: Event) => {
      event.preventDefault();
      const name =
        (
          document.getElementById("fn") as HTMLInputElement | null
        )?.value.trim() ?? "";
      const need =
        (
          document.getElementById("ft") as HTMLTextAreaElement | null
        )?.value.trim() ?? "";
      const message =
        `Hi Hope Theory Labs, I’m ${name || "a visitor"}. ${need}`.trim();
      window.open(
        `https://wa.me/8801718463471?text=${encodeURIComponent(message)}`,
        "_blank",
        "noopener,noreferrer",
      );
    };
    form?.addEventListener("submit", onSubmit);

    const floating = document.getElementById("wa");
    const contact = document.getElementById("contact");
    const hideFloating = new IntersectionObserver(
      (entries) => {
        const hidden = Boolean(entries[0]?.isIntersecting);
        floating?.classList.toggle("off", hidden);
        if (floating) {
          floating.tabIndex = hidden ? -1 : 0;
          floating.setAttribute("aria-hidden", hidden ? "true" : "false");
        }
      },
      { threshold: 0.35 },
    );
    if (contact) hideFloating.observe(contact);

    const heroCta = document.querySelector<HTMLElement>(".cta");
    const onTilt = (event: PointerEvent) => {
      if (reduced.matches || !heroCta) return;
      const rect = heroCta.getBoundingClientRect();
      const x = (event.clientX - rect.left - rect.width / 2) * 0.2;
      const y = (event.clientY - rect.top - rect.height / 2) * 0.3;
      heroCta.style.transform = `translate(${x}px, ${y}px)`;
    };
    const onTiltEnd = () => {
      if (heroCta) heroCta.style.transform = "";
    };
    heroCta?.addEventListener("pointermove", onTilt);
    heroCta?.addEventListener("pointerleave", onTiltEnd);

    const hudLabel = document.getElementById("hs");
    const hudBar = document.getElementById("hb");
    const stageWatch = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        const stage = visible ? STAGES[visible.target.id] : undefined;
        if (!stage || !hudLabel || !hudBar) return;
        hudLabel.textContent = stage[0];
        hudBar.style.width = stage[1];
      },
      { threshold: [0.25, 0.45, 0.7] },
    );
    for (const section of sections) stageWatch.observe(section);

    let frame = 0;
    const listeners: Array<() => void> = [];
    const stopGl = () => {
      cancelAnimationFrame(frame);
    };

    // The field starts after load, on an idle slot, so the copy paints first
    // and the GL work never competes with the first render.
    const startField = () => {
      if (!alive) return;
      const canvas = document.getElementById("c");
      const nodes = Array.from(
        document.querySelectorAll<HTMLElement>("#nds .nd"),
      );
      const mono = document.getElementById("mn");
      const gl =
        canvas instanceof HTMLCanvasElement
          ? canvas.getContext("webgl2", { alpha: true, antialias: false })
          : null;

      if (!gl || !(canvas instanceof HTMLCanvasElement)) {
        root.classList.add("nogl");
      } else {
        root.classList.remove("nogl");
        const vertex = compile(gl, gl.VERTEX_SHADER, VERT);
        const fragment = compile(gl, gl.FRAGMENT_SHADER, FRAG);
        const program = gl.createProgram();
        if (!vertex || !fragment || !program) {
          root.classList.add("nogl");
        } else {
          gl.attachShader(program, vertex);
          gl.attachShader(program, fragment);
          gl.bindAttribLocation(program, 0, "position");
          gl.bindAttribLocation(program, 1, "aB");
          gl.bindAttribLocation(program, 2, "aC");
          gl.bindAttribLocation(program, 3, "aR");
          gl.linkProgram(program);
          if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            root.classList.add("nogl");
          } else {
            const count = mobileQuery.matches ? 900 : 2400;
            const field = makeField(count);
            const buffers = [field.position, field.aB, field.aC, field.aR].map(
              (data) => {
                const buffer = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
                gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
                return buffer;
              },
            );
            const sizes = [3, 3, 3, 1];
            gl.useProgram(program);
            buffers.forEach((buffer, index) => {
              gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
              gl.enableVertexAttribArray(index);
              gl.vertexAttribPointer(
                index,
                sizes[index] ?? 1,
                gl.FLOAT,
                false,
                0,
                0,
              );
            });
            gl.enable(gl.BLEND);
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
            gl.disable(gl.DEPTH_TEST);

            const loc = {
              uP: gl.getUniformLocation(program, "uP"),
              uT: gl.getUniformLocation(program, "uT"),
              uPR: gl.getUniformLocation(program, "uPR"),
              uD: gl.getUniformLocation(program, "uD"),
              uM: gl.getUniformLocation(program, "uM"),
              model: gl.getUniformLocation(program, "modelViewMatrix"),
              proj: gl.getUniformLocation(program, "projectionMatrix"),
            };
            const view = viewMatrix();
            let shown = reduced.matches ? 2 : 0;
            let clock = 0;
            const pointer = [0, 0, 40];

            const resize = () => {
              const dpr = Math.min(
                window.devicePixelRatio || 1,
                mobileQuery.matches ? 1.5 : 2,
              );
              const width = canvas.clientWidth || window.innerWidth;
              const height = canvas.clientHeight || window.innerHeight;
              canvas.width = Math.max(1, Math.round(width * dpr));
              canvas.height = Math.max(1, Math.round(height * dpr));
              gl.viewport(0, 0, canvas.width, canvas.height);
              gl.uniformMatrix4fv(
                loc.proj,
                false,
                perspective(0.72, width / Math.max(1, height), 0.1, 40),
              );
              gl.uniform1f(loc.uPR, dpr);
            };

            const place = () => {
              const narrow = window.innerWidth <= 800;
              const scatter =
                narrow || reduced.matches ? 0 : Math.max(0, 1 - shown / 1.35);
              const fade = reduced.matches
                ? 1
                : Math.min(1, Math.max(0, (shown - 0.15) / 0.7));
              // The labels belong to the hero field: clear them once the page has
              // moved on, or they sit pinned over every section below.
              const field = Math.min(
                1,
                Math.max(0, 1 - (window.scrollY - window.innerHeight * 0.8) / (window.innerHeight * 0.4)),
              );
              nodes.forEach((node, index) => {
                const spec = NODE_LAYOUT[index];
                if (!spec) return;
                const base = narrow ? spec.mobile : spec.desktop;
                const bob = reduced.matches
                  ? 0
                  : Math.sin(clock * 0.7 + index * 0.8) * 5 * (1 - scatter);
                node.style.left = `${base[0] + spec.scatter[0] * scatter}%`;
                node.style.top = `calc(${base[1] + spec.scatter[1] * scatter}% + ${bob}px)`;
                node.style.opacity = String(fade * field);
                const growLeft = narrow || node.dataset.side !== "mark";
                node.style.transform = growLeft
                  ? "translate(-100%, -50%)"
                  : "translate(0, -50%)";
              });
              if (mono) {
                const markFade = reduced.matches
                  ? 1
                  : Math.min(1, Math.max(0, (shown - 0.35) / 0.65));
                const x = (narrow ? 50 : 78) + (narrow ? 0 : 6) * scatter;
                const y = (narrow ? 22 : 44) - (narrow ? 0 : 6) * scatter;
                mono.style.left = `${x}%`;
                mono.style.top = `${y}%`;
                mono.style.opacity = String(markFade * field);
                mono.style.transform = "translate(-50%, -50%)";
              }
            };

            const draw = () => {
              const target = Math.max(
                0,
                Math.min(2, window.scrollY / Math.max(1, window.innerHeight)),
              );
              if (reduced.matches) shown = target === 0 ? 1.15 : target;
              else shown += (target - shown) * 0.08;
              gl.uniform1f(loc.uP, shown);
              gl.uniform1f(loc.uT, reduced.matches ? 0.4 : clock);
              gl.uniform1f(loc.uD, 1);
              gl.uniform3f(
                loc.uM,
                pointer[0] ?? 0,
                pointer[1] ?? 0,
                pointer[2] ?? 40,
              );
              gl.uniformMatrix4fv(loc.model, false, view);
              gl.clearColor(0, 0, 0, 0);
              gl.clear(gl.COLOR_BUFFER_BIT);
              gl.drawArrays(gl.POINTS, 0, field.count);
              place();
            };

            const onPointer = (event: PointerEvent) => {
              const width = window.innerWidth || 1;
              const height = window.innerHeight || 1;
              pointer[0] = ((event.clientX / width) * 2 - 1) * 4.8;
              pointer[1] = -((event.clientY / height) * 2 - 1) * 2.8;
              pointer[2] = 0.2;
            };
            const onPointerOut = (event: PointerEvent) => {
              if (event.relatedTarget) return;
              pointer[0] = 0;
              pointer[1] = 0;
              pointer[2] = 40;
            };

            resize();
            draw();
            window.addEventListener("resize", resize);
            window.addEventListener("pointermove", onPointer);
            window.addEventListener("pointerout", onPointerOut);
            listeners.push(() => {
              window.removeEventListener("resize", resize);
              window.removeEventListener("pointermove", onPointer);
              window.removeEventListener("pointerout", onPointerOut);
            });

            if (!reduced.matches) {
              let last = performance.now();
              let lastDraw = 0;
              const interval = mobileQuery.matches ? 1000 / 30 : 0;
              const loop = (now: number) => {
                if (!alive) return;
                frame = requestAnimationFrame(loop);
                if (interval && now - lastDraw < interval) return;
                lastDraw = now;
                clock += Math.min(0.05, (now - last) / 1000);
                last = now;
                if (!document.hidden) draw();
              };
              frame = requestAnimationFrame(loop);
            } else {
              const onScroll = () => draw();
              window.addEventListener("scroll", onScroll, { passive: true });
              listeners.push(() =>
                window.removeEventListener("scroll", onScroll),
              );
            }
          }
        }
      }
    };

    let idleHandle = 0;
    const scheduleField = () => {
      if (!alive) return;
      const idle = typeof window.requestIdleCallback === "function";
      idleHandle = idle
        ? window.requestIdleCallback(startField, { timeout: 800 })
        : window.setTimeout(startField, 120);
    };
    if (document.readyState === "complete") scheduleField();
    else window.addEventListener("load", scheduleField, { once: true });
    listeners.push(() => {
      window.removeEventListener("load", scheduleField);
      if (typeof window.cancelIdleCallback === "function") window.cancelIdleCallback(idleHandle);
      window.clearTimeout(idleHandle);
    });

    return () => {
      alive = false;
      stopGl();
      reveal.disconnect();
      hideFloating.disconnect();
      stageWatch.disconnect();
      for (const jumper of jumpers) jumper.removeEventListener("click", onGo);
      skip?.removeEventListener("click", onSkip);
      for (const button of stepButtons)
        button.removeEventListener("click", onStep);
      form?.removeEventListener("submit", onSubmit);
      heroCta?.removeEventListener("pointermove", onTilt);
      heroCta?.removeEventListener("pointerleave", onTiltEnd);
      for (const detach of listeners) detach();
    };
  }, []);

  return null;
}
