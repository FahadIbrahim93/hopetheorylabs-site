/*
  GLSL for the particle field and the fresnel core, ported from the supplied
  Hope Theory Labs concept page (three r128 inline shaders). three injects
  the GLSL ES 3 preamble and attribute/varying rewrites for ShaderMaterial,
  so the sources stay in the original ES 1 syntax.

  Particle morph: `position` is the scattered cloud, aB the globe lattice,
  aC the spiral galaxy. uP runs 0 -> 1 (scatter -> globe) -> 2 (globe ->
  galaxy); aR is a per-particle random that staggers both transitions.
  uM is the pointer in group space (repulsion), uC/uK the last burst
  origin and time (expanding ring).
*/

export const particleVertex = /* glsl */ `
attribute vec3 aB;
attribute vec3 aC;
attribute float aR;
uniform float uP, uT, uPR, uD, uK;
uniform vec3 uM, uC;
varying vec3 vC;
varying float vA;

void main() {
  float t1 = clamp((uP - aR * .35) / .65, 0., 1.);
  t1 = t1 * t1 * (3. - 2. * t1);
  float t2 = clamp((uP - 1. - aR * .35) / .65, 0., 1.);
  t2 = t2 * t2 * (3. - 2. * t2);

  // Galaxy: differential rotation, faster near the core.
  vec3 c = aC;
  float r = length(c.xz);
  float an = uT * .4 / (.8 + r * .4);
  float cs = cos(an), sn = sin(an);
  c.xz = mat2(cs, -sn, sn, cs) * c.xz;

  // Scattered: slow drift. Globe: gentle breathing.
  vec3 a = position + vec3(sin(uT * .3 + aR * 40.), cos(uT * .25 + aR * 55.), sin(uT * .2 + aR * 30.)) * .5;
  vec3 b = aB * (1. + .015 * sin(uT * 1.5 + aR * 20.));
  vec3 p = mix(mix(a, b, t1), c, t2);

  // Pointer repulsion.
  vec3 d = p - uM;
  float f = exp(-dot(d, d) * .35);
  p += normalize(d + .0001) * f * .9;

  // Burst ring travelling outward from uC for 3.5 s.
  vec3 e = p - uC;
  float wt = uT - uK;
  float rg = exp(-pow((length(e) - wt * 7.) * 1.1, 2.)) * step(0., wt) * step(wt, 3.5) * (1. - wt / 3.5);
  p += normalize(e + .0001) * rg * 1.6;

  vec4 mv = modelViewMatrix * vec4(p, 1.);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = (1.3 + aR * 2.) * uPR * (9. / -mv.z) * (1. + t2 * .4);

  vec3 col = mix(vec3(.45, .52, .62), vec3(.72, .54, .18), t1);
  col = mix(col, mix(vec3(1., .6, .25), vec3(.45, .65, 1.), smoothstep(0., 6., r)), t2);
  vC = col + rg * .5;
  vA = mix(.35, .9, t1) * (.6 + .4 * aR) * uD * (1. - .3 * t2) + rg * .5 * uD;
}
`;

export const particleFragment = /* glsl */ `
varying vec3 vC;
varying float vA;
void main() {
  float d = length(gl_PointCoord - .5);
  if (d > .5) discard;
  float a = smoothstep(.5, 0., d);
  gl_FragColor = vec4(vC * (.6 + a), a * a * vA * 1.4);
}
`;

export const coreVertex = /* glsl */ `
varying vec3 vN, vV;
void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.);
  vN = normalize(normalMatrix * normal);
  vV = normalize(-mv.xyz);
  gl_Position = projectionMatrix * mv;
}
`;

export const coreFragment = /* glsl */ `
uniform float uI, uS;
varying vec3 vN, vV;
void main() {
  float f = pow(1. - abs(dot(vN, vV)), 2.2);
  vec3 c = mix(vec3(.72, .54, .18), vec3(1., .62, .24), uS);
  gl_FragColor = vec4(c * (f * 1.8 + .25), (f * .9 + .25) * uI);
}
`;
