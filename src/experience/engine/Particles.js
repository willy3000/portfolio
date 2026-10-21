import * as THREE from 'three';

// One particle system plays every shape in the journey. Two buffers hold the
// outgoing and incoming shapes; uMix blends them on the GPU. Particles leave
// in a sweep (by position) with a per-particle offset, lift off along a noise
// field mid-flight and settle into the next shape. All of it is a pure
// function of uMix, so scrubbing backwards replays it exactly in reverse.

const vertexShader = /* glsl */ `
  attribute vec3 aFrom;
  attribute vec3 aTo;
  attribute vec3 aColorFrom;
  attribute vec3 aColorTo;
  attribute float aSeed;

  uniform float uMix;
  uniform float uTime;
  uniform float uSize;
  uniform float uScatter;
  uniform float uSweep;
  uniform vec2 uScale;

  varying vec3 vColor;
  varying float vBurst;

  vec3 field(vec3 p, float s) {
    return vec3(
      sin(p.y * 1.7 + s * 91.3 + uTime * 0.55),
      sin(p.z * 1.3 + s * 47.1 + uTime * 0.47),
      sin(p.x * 1.9 + s * 13.7 + uTime * 0.61)
    );
  }

  void main() {
    // Sweep from left to right, loosened by each particle's own delay.
    float order = clamp(0.5 + aFrom.x / uSweep, 0.0, 1.0);
    float delay = mix(aSeed, order, 0.65) * 0.42;
    float t = clamp((uMix - delay) / 0.58, 0.0, 1.0);
    t = t * t * (3.0 - 2.0 * t);

    vec3 p = mix(aFrom, aTo, t);
    float burst = sin(3.14159265 * t);
    vec3 n = field(p, aSeed);
    p += n * burst * uScatter;
    // Resting particles shimmer very slightly.
    p += n * 0.008;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    float size = uSize * mix(uScale.x, uScale.y, t) * (1.0 + burst * 0.5) / max(0.1, -mv.z);
    // Particles drifting past the lens stay specks, not blobs.
    gl_PointSize = min(size, uSize * 0.45);

    vColor = mix(aColorFrom, aColorTo, t);
    vBurst = burst;
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uOpacity;
  varying vec3 vColor;
  varying float vBurst;

  void main() {
    float r = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.12, r);
    if (a < 0.01) discard;
    // Travelling particles burn slightly hotter.
    vec3 c = vColor * (1.0 + vBurst * 0.6);
    gl_FragColor = vec4(c * a * uOpacity, a * uOpacity);
  }
`;

export function createParticles(count, pixelRatio) {
  const geometry = new THREE.BufferGeometry();
  const from = new THREE.BufferAttribute(new Float32Array(count * 3), 3);
  const to = new THREE.BufferAttribute(new Float32Array(count * 3), 3);
  const colorFrom = new THREE.BufferAttribute(new Float32Array(count * 3), 3);
  const colorTo = new THREE.BufferAttribute(new Float32Array(count * 3), 3);
  const seeds = new Float32Array(count);
  for (let i = 0; i < count; i += 1) seeds[i] = Math.random();
  [from, to, colorFrom, colorTo].forEach((a) => a.setUsage(THREE.DynamicDrawUsage));
  geometry.setAttribute('position', from);
  geometry.setAttribute('aFrom', from);
  geometry.setAttribute('aTo', to);
  geometry.setAttribute('aColorFrom', colorFrom);
  geometry.setAttribute('aColorTo', colorTo);
  geometry.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));
  // Positions change on the GPU; keep the object from being culled.
  geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 1e4);

  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uMix: { value: 0 },
      uTime: { value: 0 },
      uSize: { value: 26 * pixelRatio },
      uScatter: { value: 0.6 },
      uSweep: { value: 8 },
      uOpacity: { value: 1 },
      uScale: { value: new THREE.Vector2(1, 1) },
    },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const points = new THREE.Points(geometry, material);
  points.frustumCulled = false;

  const shapes = [];
  const scales = [];
  let segment = -1;
  const versions = [];
  let loaded = [-1, -1];

  const upload = (i) => {
    const a = shapes[i];
    const b = shapes[i + 1];
    if (!a || !b) return;
    from.array.set(a.positions);
    colorFrom.array.set(a.colors);
    to.array.set(b.positions);
    colorTo.array.set(b.colors);
    from.needsUpdate = true;
    to.needsUpdate = true;
    colorFrom.needsUpdate = true;
    colorTo.needsUpdate = true;
    loaded = [versions[i], versions[i + 1]];
    material.uniforms.uScale.value.set(scales[i] || 1, scales[i + 1] || 1);
  };

  return {
    points,

    setShape(index, shape, scale = 1) {
      shapes[index] = shape;
      scales[index] = scale;
      versions[index] = (versions[index] || 0) + 1;
    },

    // m is a position along the shape list: 3.25 is a quarter of the way from
    // shape 3 to shape 4.
    setMorph(m) {
      const last = shapes.length - 2;
      const i = Math.max(0, Math.min(last, Math.floor(m)));
      const t = Math.max(0, Math.min(1, m - i));
      if (i !== segment || loaded[0] !== versions[i] || loaded[1] !== versions[i + 1]) {
        segment = i;
        upload(i);
      }
      material.uniforms.uMix.value = t;
    },

    set opacity(v) { material.uniforms.uOpacity.value = v; },
    set scatter(v) { material.uniforms.uScatter.value = v; },
    set time(v) { material.uniforms.uTime.value = v; },
    setPixelRatio(pr) { material.uniforms.uSize.value = 26 * pr; },

    dispose() {
      geometry.dispose();
      material.dispose();
    },
  };
}
