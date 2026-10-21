import * as THREE from 'three';

import { NODES, ORIGIN, pathCurve, satellites } from './layout';

export const BACKGROUND = 0x05070b;

// ── Floor ─────────────────────────────────────────────────────────────────
// An anti-aliased grid that fades with distance from the camera. On load a
// ring of light expands from under the laptop and leaves the grid behind it.
const floorVertex = /* glsl */ `
  varying vec3 vWorld;
  void main() {
    vec4 w = modelMatrix * vec4(position, 1.0);
    vWorld = w.xyz;
    gl_Position = projectionMatrix * viewMatrix * w;
  }
`;

const floorFragment = /* glsl */ `
  uniform float uReveal;
  uniform float uGlow;
  uniform float uLevel;
  varying vec3 vWorld;

  float grid(vec2 p) {
    vec2 g = abs(fract(p - 0.5) - 0.5) / fwidth(p);
    return 1.0 - min(min(g.x, g.y), 1.0);
  }

  void main() {
    vec2 p = vWorld.xz;
    float minor = grid(p * 2.0);
    float major = grid(p * 0.5);
    float fromCentre = length(p);
    float fromCamera = length(vWorld - cameraPosition);
    float fade = exp(-fromCamera * 0.075);
    float revealed = smoothstep(uReveal, uReveal - 2.5, fromCentre);
    float ring = exp(-pow(fromCentre - uReveal, 2.0) * 3.0) * step(0.01, uReveal) * (1.0 - smoothstep(14.0, 22.0, uReveal));

    vec3 lineColour = vec3(0.32, 0.6, 0.95);
    vec3 c = lineColour * (minor * 0.035 + major * 0.11) * fade * revealed * uLevel;
    c += vec3(0.36, 0.82, 1.0) * ring * 0.35;
    c += vec3(0.2, 0.55, 0.9) * uGlow * exp(-fromCentre * 0.75) * 0.22;
    gl_FragColor = vec4(vec3(0.0196, 0.0275, 0.043) + c, 1.0);
  }
`;

const dustVertex = /* glsl */ `
  attribute float aSeed;
  uniform float uTime;
  uniform float uSize;
  varying float vAlpha;
  void main() {
    vec3 p = position;
    p.y += sin(uTime * 0.15 + aSeed * 40.0) * 0.25;
    p.x += cos(uTime * 0.11 + aSeed * 23.0) * 0.25;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    float d = -mv.z;
    gl_PointSize = uSize * (0.6 + aSeed) / max(0.5, d);
    vAlpha = smoothstep(0.3, 2.0, d) * exp(-d * 0.05) * (0.35 + 0.65 * fract(aSeed * 7.0));
  }
`;

const dustFragment = /* glsl */ `
  uniform float uOpacity;
  varying float vAlpha;
  void main() {
    float r = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, r) * vAlpha * uOpacity;
    gl_FragColor = vec4(vec3(0.75, 0.88, 1.0) * a, a);
  }
`;

const lineVertex = /* glsl */ `
  attribute float aT;
  varying float vT;
  void main() {
    vT = aT;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const lineFragment = /* glsl */ `
  uniform float uDraw;
  uniform float uOpacity;
  uniform vec3 uColour;
  varying float vT;
  void main() {
    float visible = 1.0 - smoothstep(uDraw - 0.02, uDraw, vT);
    float head = exp(-pow((vT - uDraw) * 40.0, 2.0));
    float a = (visible * 0.55 + head) * uOpacity;
    gl_FragColor = vec4(uColour * a, a);
  }
`;

export function createAtmosphere({ dustCount, pixelRatio }) {
  const group = new THREE.Group();
  const disposables = [];
  const track = (thing) => {
    disposables.push(thing);
    return thing;
  };

  // Floor
  const floorMaterial = track(new THREE.ShaderMaterial({
    vertexShader: floorVertex,
    fragmentShader: floorFragment,
    uniforms: { uReveal: { value: 0 }, uGlow: { value: 1 }, uLevel: { value: 1 } },
  }));
  const floor = new THREE.Mesh(track(new THREE.PlaneGeometry(240, 240)), floorMaterial);
  floor.rotation.x = -Math.PI / 2;
  floor.position.z = -60;
  group.add(floor);

  // Dust, spread along the whole route.
  const dustGeometry = track(new THREE.BufferGeometry());
  const positions = new Float32Array(dustCount * 3);
  const seeds = new Float32Array(dustCount);
  for (let i = 0; i < dustCount; i += 1) {
    positions[i * 3] = (Math.random() - 0.5) * 30;
    positions[i * 3 + 1] = 0.2 + Math.random() * 8;
    positions[i * 3 + 2] = 10 - Math.random() * 115;
    seeds[i] = Math.random();
  }
  dustGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  dustGeometry.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));
  const dustMaterial = track(new THREE.ShaderMaterial({
    vertexShader: dustVertex,
    fragmentShader: dustFragment,
    uniforms: { uTime: { value: 0 }, uSize: { value: 9 * pixelRatio }, uOpacity: { value: 1 } },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  }));
  const dust = new THREE.Points(dustGeometry, dustMaterial);
  dust.frustumCulled = false;
  group.add(dust);

  // Lights
  const hemi = new THREE.HemisphereLight(0x9fc8ff, 0x050608, 0.35);
  const key = new THREE.SpotLight(0xf2f6ff, 60, 22, Math.PI / 6, 0.6, 1.6);
  key.position.set(-3.5, 6.5, 4.5);
  key.target.position.set(0, 0.4, 0);
  const rim = new THREE.DirectionalLight(0x5cd0ff, 2.2);
  rim.position.set(3, 3, -5);
  const fill = new THREE.PointLight(0x9a8bff, 6, 12, 2);
  fill.position.set(-4.5, 1.2, 1.5);
  group.add(hemi, key, key.target, rim, fill);
  const lights = [
    [hemi, 0.35], [key, 60], [rim, 2.2], [fill, 6],
  ];

  // Career path and the links to each node's satellites, drawn in the
  // particle system's local space.
  const lines = new THREE.Group();
  lines.position.copy(ORIGIN);
  group.add(lines);

  const curve = pathCurve();
  const samples = 400;
  const pathPoints = curve.getSpacedPoints(samples);
  const pathGeometry = track(new THREE.BufferGeometry().setFromPoints(pathPoints));
  pathGeometry.setAttribute('aT', new THREE.BufferAttribute(new Float32Array(pathPoints.map((_, i) => i / samples)), 1));
  const pathMaterial = track(new THREE.ShaderMaterial({
    vertexShader: lineVertex,
    fragmentShader: lineFragment,
    uniforms: { uDraw: { value: 0 }, uOpacity: { value: 0 }, uColour: { value: new THREE.Color('#6fd0ff') } },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  }));
  lines.add(new THREE.Line(pathGeometry, pathMaterial));

  const linkPoints = [];
  const linkT = [];
  satellites().forEach((group_, n) => {
    group_.forEach((s) => {
      linkPoints.push(NODES[n].clone(), s.clone());
      linkT.push(0, 1);
    });
  });
  const linkGeometry = track(new THREE.BufferGeometry().setFromPoints(linkPoints));
  linkGeometry.setAttribute('aT', new THREE.BufferAttribute(new Float32Array(linkT), 1));
  const linkMaterial = track(new THREE.ShaderMaterial({
    vertexShader: lineVertex,
    fragmentShader: lineFragment,
    uniforms: { uDraw: { value: 0 }, uOpacity: { value: 0 }, uColour: { value: new THREE.Color('#7f8fff') } },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  }));
  lines.add(new THREE.LineSegments(linkGeometry, linkMaterial));

  return {
    group,
    floor,

    update({ time, reveal, level, glow, path, links }) {
      floorMaterial.uniforms.uReveal.value = reveal;
      floorMaterial.uniforms.uLevel.value = level;
      floorMaterial.uniforms.uGlow.value = glow;
      dustMaterial.uniforms.uTime.value = time;
      lights.forEach(([light, intensity]) => { light.intensity = intensity * level; });
      pathMaterial.uniforms.uDraw.value = path.draw;
      pathMaterial.uniforms.uOpacity.value = path.opacity;
      linkMaterial.uniforms.uDraw.value = links.draw;
      linkMaterial.uniforms.uOpacity.value = links.opacity;
      lines.visible = path.opacity > 0.001 || links.opacity > 0.001;
    },

    setPixelRatio(pr) {
      dustMaterial.uniforms.uSize.value = 9 * pr;
    },

    dispose() {
      disposables.forEach((d) => d.dispose());
    },
  };
}
