/*
  GLSL for the intelligence core. Everything is additive, depth-tested but not
  depth-written, with a view-space depth fade standing in for fog so far
  particles sink into the obsidian background.

  Colours (docs/BRAND.md, supplied concept): champagne gold #E8D5A5 /
  #FFBD61 for structure, teal #7FD6C2 for active signal.
*/

export const COLORS = {
  gold: [0.91, 0.835, 0.647],
  amber: [1.0, 0.741, 0.38],
  teal: [0.498, 0.839, 0.76],
  ink: [0.027, 0.035, 0.047],
} as const;

const DEPTH_FADE = /* glsl */ `
  float depthFade(float viewZ, float near, float far) {
    return smoothstep(far, near, viewZ);
  }
`;

const SOFT_DISC = /* glsl */ `
  float softDisc(vec2 uv, float hardness) {
    float d = length(uv - 0.5) * 2.0;
    float body = 1.0 - smoothstep(hardness, 1.0, d);
    float hot = 1.0 - smoothstep(0.0, 0.35, d);
    return body * 0.75 + hot * 0.6;
  }
`;

/* ---------- particles ---------- */

export const particleVertex = /* glsl */ `
  attribute vec3 aScattered;
  attribute float aSeed;
  attribute float aTone;
  attribute float aSize;
  attribute float aKind;

  uniform float uTime;
  uniform float uAssembly;
  uniform float uPixelScale;
  uniform float uMotion;
  uniform vec3 uPointer; // world-space pointer on the screen-parallel plane through the origin
  uniform float uPointerStrength;

  varying float vAlpha;
  varying float vTone;
  varying float vKind;

  ${DEPTH_FADE}

  void main() {
    // Staggered assembly: each particle has its own window inside uAssembly.
    float window = clamp(uAssembly * 1.35 - aSeed * 0.35, 0.0, 1.0);
    float ease = window * window * (3.0 - 2.0 * window);
    vec3 pos = mix(aScattered, position, ease);

    // Organic breathing on the assembled lattice, slow drift on dust.
    float phase = aSeed * 6.2831;
    float breathe = sin(uTime * 0.55 + phase) * 0.018 * uMotion;
    pos += normalize(position + 0.0001) * breathe * (1.0 - aKind * 0.5);
    if (aKind > 1.5) {
      float orbit = uTime * (0.05 + aSeed * 0.05) * uMotion;
      float c = cos(orbit), s = sin(orbit);
      pos.xz = mat2(c, -s, s, c) * pos.xz;
      pos.y += sin(uTime * 0.3 + phase) * 0.06 * uMotion;
    }

    // Scattered fragments drift so the opening state is alive, not frozen.
    pos += (1.0 - ease) * vec3(
      sin(uTime * 0.21 + phase) * 0.22,
      cos(uTime * 0.17 + phase * 1.7) * 0.16,
      sin(uTime * 0.13 + phase * 0.6) * 0.2
    ) * uMotion;

    // Pointer: a soft, damped push away from the cursor in world space.
    vec3 toPointer = pos - uPointer;
    float pd = length(toPointer);
    float push = (1.0 - smoothstep(0.0, 1.1, pd)) * uPointerStrength;
    pos += normalize(toPointer + vec3(0.0001, 0.0, 0.0)) * push * 0.22;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    float dist = -mv.z;
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aSize * uPixelScale / dist;

    float fade = depthFade(dist, 3.5, 13.0);
    float kindAlpha = aKind < 0.5 ? 0.85 : (aKind < 1.5 ? 0.6 : 0.5);
    vAlpha = fade * kindAlpha * (0.55 + 0.45 * ease);
    vTone = aTone;
    vKind = aKind;
  }
`;

export const particleFragment = /* glsl */ `
  uniform vec3 uGold;
  uniform vec3 uTeal;
  uniform float uDim;
  varying float vAlpha;
  varying float vTone;
  varying float vKind;

  ${SOFT_DISC}

  void main() {
    float a = softDisc(gl_PointCoord, 0.25) * vAlpha * uDim;
    if (a < 0.004) discard;
    vec3 color = mix(uGold, uTeal, vTone);
    gl_FragColor = vec4(color * a, a);
  }
`;

/* ---------- neighbour links (filaments inside the core) ---------- */

export const linkVertex = /* glsl */ `
  attribute vec3 aScattered;
  attribute float aSeed;
  uniform float uTime;
  uniform float uAssembly;
  uniform float uMotion;
  varying float vAlpha;
  ${DEPTH_FADE}
  void main() {
    float window = clamp(uAssembly * 1.35 - aSeed * 0.35, 0.0, 1.0);
    float ease = window * window * (3.0 - 2.0 * window);
    vec3 pos = mix(aScattered, position, ease);
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    // Links emerge, hold, and dissolve on their own rhythm.
    float cycle = sin(uTime * 0.35 * uMotion + aSeed * 40.0);
    float flicker = smoothstep(0.1, 0.75, cycle);
    if (uMotion < 0.5) flicker = step(0.45, aSeed);
    vAlpha = flicker * ease * depthFade(-mv.z, 3.5, 12.0);
  }
`;

export const linkFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uStrength;
  uniform float uDim;
  varying float vAlpha;
  void main() {
    float a = vAlpha * uStrength * uDim * 0.55;
    if (a < 0.003) discard;
    gl_FragColor = vec4(uColor * a, a);
  }
`;

/* ---------- edges (source -> core) ---------- */

export const edgeVertex = /* glsl */ `
  attribute float aT;     // 0 at the source node, 1 at the core
  attribute float aEdge;  // edge index
  uniform float uTime;
  uniform float uConnection;
  uniform float uMotion;
  uniform float uOutbound;
  uniform float uWeights[8];
  varying float vT;
  varying float vAlpha;
  varying float vWeight;
  varying float vPulse;
  ${DEPTH_FADE}
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    int idx = int(aEdge + 0.5);
    float w = 0.0;
    for (int i = 0; i < 8; i++) { if (i == idx) w = uWeights[i]; }
    // Draw-on from the source toward the core, staggered per edge.
    float stagger = aEdge * 0.07;
    float reveal = clamp((uConnection * 1.5 - stagger) , 0.0, 1.0);
    float drawn = 1.0 - smoothstep(reveal - 0.08, reveal, aT);
    // A luminous pulse running along the edge; direction follows uOutbound.
    float dir = mix(1.0, -1.0, step(0.5, uOutbound));
    float travel = fract(aT * dir - uTime * (0.22 + aEdge * 0.013) * uMotion + aEdge * 0.37);
    vPulse = pow(1.0 - travel, 7.0);
    vT = aT;
    vWeight = w;
    vAlpha = drawn * depthFade(-mv.z, 3.5, 13.0);
  }
`;

export const edgeFragment = /* glsl */ `
  uniform vec3 uGold;
  uniform vec3 uTeal;
  uniform float uDim;
  uniform float uFocusActive;
  varying float vT;
  varying float vAlpha;
  varying float vWeight;
  varying float vPulse;
  void main() {
    float base = 0.16 + vWeight * 0.5;
    // When something is focused, unrelated edges recede.
    base *= mix(1.0, 0.35, uFocusActive * (1.0 - vWeight));
    float a = (base + vPulse * (0.55 + vWeight * 0.6)) * vAlpha * uDim;
    if (a < 0.003) discard;
    vec3 color = mix(uGold, uTeal, clamp(vPulse * 1.6 + vWeight, 0.0, 1.0));
    gl_FragColor = vec4(color * a, a);
  }
`;

/* ---------- signal packets ---------- */

export const packetVertex = /* glsl */ `
  attribute float aAlpha;
  attribute float aTone;
  uniform float uPixelScale;
  varying float vAlpha;
  varying float vTone;
  ${DEPTH_FADE}
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = (0.06 + aTone * 0.03) * uPixelScale / -mv.z;
    vAlpha = aAlpha * depthFade(-mv.z, 3.0, 13.0);
    vTone = aTone;
  }
`;

export const packetFragment = /* glsl */ `
  uniform vec3 uTeal;
  uniform vec3 uGold;
  uniform float uDim;
  varying float vAlpha;
  varying float vTone;
  ${SOFT_DISC}
  void main() {
    float a = softDisc(gl_PointCoord, 0.1) * vAlpha * uDim;
    if (a < 0.004) discard;
    vec3 color = mix(uTeal, uGold, vTone * 0.5);
    gl_FragColor = vec4((color + vec3(0.25)) * a, a);
  }
`;

/* ---------- radar sweep disc ---------- */

export const radarVertex = /* glsl */ `
  varying vec2 vUv;
  varying float vDepth;
  void main() {
    vUv = uv;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vDepth = -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`;

export const radarFragment = /* glsl */ `
  uniform float uSweep;     // 0..1 rotation phase
  uniform float uStrength;
  uniform float uDim;
  uniform vec3 uGold;
  uniform vec3 uTeal;
  varying vec2 vUv;
  varying float vDepth;
  void main() {
    vec2 p = vUv * 2.0 - 1.0;
    float r = length(p);
    if (r > 1.0) discard;
    float angle = atan(p.y, p.x) / 6.2831853 + 0.5;
    float trail = fract(uSweep - angle);
    float sweep = pow(1.0 - trail, 9.0) * smoothstep(0.08, 0.3, r) * (1.0 - smoothstep(0.82, 1.0, r));
    // Faint calibration rings and a thin edge.
    float rings = (1.0 - smoothstep(0.0, 0.015, abs(fract(r * 4.0) - 0.5) - 0.48)) * 0.05;
    float rim = (1.0 - smoothstep(0.0, 0.03, abs(r - 0.985))) * 0.18;
    float fade = smoothstep(14.0, 4.0, vDepth);
    float a = (sweep * 0.38 + rings + rim) * uStrength * uDim * fade;
    if (a < 0.003) discard;
    vec3 color = mix(uGold, uTeal, smoothstep(0.3, 0.9, r));
    gl_FragColor = vec4(color * a, a);
  }
`;
