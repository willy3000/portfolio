import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

// A procedural laptop, modelled in scene units (≈ 10 cm). The lid hangs from a
// pivot on the hinge axis, so opening it is a rotation about the hinge rather
// than about the lid's centre. Everything is built from primitives at runtime:
// no model download, and no third-party asset licence to track.

export const DIMENSIONS = {
  width: 3.2,
  depth: 2.2,
  baseThickness: 0.11,
  lidThickness: 0.055,
  lidHeight: 2.14,
  screenWidth: 2.96,
  screenHeight: 1.85,
  chin: 0.17,
};

const { width: W, depth: D, baseThickness: BT, lidThickness: LT, lidHeight: LH } = DIMENSIONS;
const SW = DIMENSIONS.screenWidth;
const SH = DIMENSIONS.screenHeight;
const SCREEN_Y = DIMENSIONS.chin + SH / 2;

// Keyboard rows in key units; each row sums to 14.5.
const ROWS = [
  { h: 0.6, keys: Array(14).fill(1).concat(0.5) },
  { h: 1, keys: Array(13).fill(1).concat(1.5) },
  { h: 1, keys: [1.5].concat(Array(13).fill(1)) },
  { h: 1, keys: [1.75].concat(Array(11).fill(1), [1.75]) },
  { h: 1, keys: [2.25].concat(Array(10).fill(1), [2.25]) },
  { h: 1, keys: [1, 1, 1, 1.25, 5.5, 1.25, 1, 1, 1.5] },
];
const UNIT = 0.192;
const GAP = 0.026;

const monogramTexture = () => {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size * 0.36, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = '#ffffff';
  ctx.font = '300 74px Inter, system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('WW', size / 2, size / 2 + 3);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
};

const shadowTexture = () => {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, 'rgba(0,0,0,0.95)');
  g.addColorStop(0.55, 'rgba(0,0,0,0.55)');
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(canvas);
};

export function createLaptop({ clippingPlanes = [] } = {}) {
  const disposables = [];
  const track = (thing) => {
    disposables.push(thing);
    return thing;
  };

  const group = new THREE.Group();
  group.name = 'laptop';

  const aluminium = track(new THREE.MeshPhysicalMaterial({
    color: 0x3b414b,
    metalness: 0.92,
    roughness: 0.34,
    clearcoat: 0.25,
    clearcoatRoughness: 0.5,
    envMapIntensity: 0.9,
    clippingPlanes,
  }));
  const keyMaterial = track(new THREE.MeshStandardMaterial({
    color: 0x0b0d11,
    metalness: 0.2,
    roughness: 0.62,
    clippingPlanes,
  }));
  const well = track(new THREE.MeshStandardMaterial({
    color: 0x16191f,
    metalness: 0.7,
    roughness: 0.5,
    clippingPlanes,
  }));
  const backlight = track(new THREE.MeshBasicMaterial({
    color: 0x5cd0ff,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    toneMapped: false,
    clippingPlanes,
  }));
  const bezel = track(new THREE.MeshStandardMaterial({
    color: 0x020203,
    metalness: 0,
    roughness: 0.55,
    envMapIntensity: 0.15,
    clippingPlanes,
  }));
  const screenMaterial = track(new THREE.MeshBasicMaterial({
    color: 0x020305,
    toneMapped: false,
    clippingPlanes,
  }));
  const monogram = track(new THREE.MeshBasicMaterial({
    map: track(monogramTexture()),
    color: 0x9fdcff,
    transparent: true,
    opacity: 0.55,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    toneMapped: false,
    clippingPlanes,
  }));

  // Base
  const base = new THREE.Mesh(track(new RoundedBoxGeometry(W, BT, D, 4, 0.05)), aluminium);
  base.position.y = BT / 2;
  group.add(base);

  // Keyboard well, backlight and keys
  const rowsDepth = ROWS.reduce((sum, r) => sum + r.h * UNIT, 0);
  const keysWidth = 14.5 * UNIT;
  const keysTop = -D / 2 + 0.2;
  const wellMesh = new THREE.Mesh(track(new THREE.PlaneGeometry(keysWidth + 0.08, rowsDepth + 0.08)), well);
  wellMesh.rotation.x = -Math.PI / 2;
  wellMesh.position.set(0, BT + 0.001, keysTop + rowsDepth / 2);
  group.add(wellMesh);

  const glow = new THREE.Mesh(track(new THREE.PlaneGeometry(keysWidth, rowsDepth)), backlight);
  glow.rotation.x = -Math.PI / 2;
  glow.position.set(0, BT + 0.003, keysTop + rowsDepth / 2);
  group.add(glow);

  const keyCount = ROWS.reduce((sum, r) => sum + r.keys.length, 0);
  const keys = new THREE.InstancedMesh(track(new RoundedBoxGeometry(1, 1, 1, 2, 0.12)), keyMaterial, keyCount);
  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  let index = 0;
  let z = keysTop;
  ROWS.forEach((row) => {
    let x = -keysWidth / 2;
    const depth = row.h * UNIT;
    row.keys.forEach((w) => {
      const kw = w * UNIT;
      m.compose(
        new THREE.Vector3(x + kw / 2, BT + 0.016, z + depth / 2),
        q,
        new THREE.Vector3(kw - GAP, 0.026, depth - GAP)
      );
      keys.setMatrixAt(index, m);
      index += 1;
      x += kw;
    });
    z += depth;
  });
  keys.instanceMatrix.needsUpdate = true;
  group.add(keys);

  // Trackpad
  const pad = new THREE.Mesh(track(new RoundedBoxGeometry(1.2, 0.004, 0.7, 2, 0.002)), well);
  pad.position.set(0, BT + 0.001, keysTop + rowsDepth + 0.5);
  group.add(pad);

  // Hinge barrel
  const hinge = new THREE.Mesh(track(new THREE.CylinderGeometry(0.05, 0.05, W * 0.86, 24)), aluminium);
  hinge.rotation.z = Math.PI / 2;
  hinge.position.set(0, BT + 0.01, -D / 2 + 0.05);
  group.add(hinge);

  // Lid, hung from the hinge axis. Local +y runs up the lid, +z is the screen.
  const pivot = new THREE.Group();
  pivot.position.set(0, BT + 0.006, -D / 2 + 0.035);
  group.add(pivot);

  const lid = new THREE.Mesh(track(new RoundedBoxGeometry(W, LH, LT, 4, 0.025)), aluminium);
  lid.position.set(0, LH / 2, -LT / 2);
  pivot.add(lid);

  const bezelMesh = new THREE.Mesh(track(new THREE.PlaneGeometry(W - 0.05, LH - 0.05)), bezel);
  bezelMesh.position.set(0, LH / 2, 0.0006);
  pivot.add(bezelMesh);

  const screen = new THREE.Mesh(track(new THREE.PlaneGeometry(SW, SH)), screenMaterial);
  screen.position.set(0, SCREEN_Y, 0.0012);
  pivot.add(screen);

  const logo = new THREE.Mesh(track(new THREE.PlaneGeometry(0.62, 0.62)), monogram);
  logo.position.set(0, LH / 2, -LT - 0.001);
  // Faces out of the back of the lid and reads upright while the lid is shut.
  logo.rotation.set(0, Math.PI, Math.PI);
  pivot.add(logo);

  // Soft contact shadow
  const shadowMaterial = track(new THREE.MeshBasicMaterial({
    map: track(shadowTexture()),
    transparent: true,
    depthWrite: false,
    opacity: 0.85,
  }));
  const shadow = new THREE.Mesh(track(new THREE.PlaneGeometry(W * 1.6, D * 1.9)), shadowMaterial);
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.003;
  shadow.renderOrder = -1;
  group.add(shadow);

  // Light spilling from the display onto the keyboard.
  const spill = new THREE.PointLight(0x8fd8ff, 0, 4.5, 2);
  spill.position.set(0, 1.0, 0.6);
  pivot.add(spill);

  const off = new THREE.Color(0x020305);
  const on = new THREE.Color(0x0a0f17);

  return {
    group,
    pivot,
    screen,

    // Opening angle between lid and base, in radians. 0 is closed.
    setLid(angle) {
      pivot.rotation.x = Math.PI / 2 - angle;
    },

    // 0 asleep → 1 awake: display, key backlight and spill light.
    setPower(v) {
      screenMaterial.color.copy(off).lerp(on, v);
      backlight.opacity = 0.32 * v;
      spill.intensity = 1.6 * v;
      monogram.opacity = 0.55 * (1 - v * 0.6);
    },

    // The rectangle on the display, in lid space, that holds content of the
    // given aspect ratio (fitted inside the 16:10 panel).
    contentQuad(aspect, out = [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()]) {
      let w = SW;
      let h = SW / aspect;
      if (h > SH) {
        h = SH;
        w = SH * aspect;
      }
      // Top-left, top-right, bottom-right, bottom-left
      out[0].set(-w / 2, SCREEN_Y + h / 2, 0.0013);
      out[1].set(w / 2, SCREEN_Y + h / 2, 0.0013);
      out[2].set(w / 2, SCREEN_Y - h / 2, 0.0013);
      out[3].set(-w / 2, SCREEN_Y - h / 2, 0.0013);
      return { corners: out, width: w, height: h };
    },

    screenCentreLocal: new THREE.Vector3(0, SCREEN_Y, 0.0013),

    dispose() {
      disposables.forEach((d) => d.dispose());
      keys.dispose();
    },
  };
}
