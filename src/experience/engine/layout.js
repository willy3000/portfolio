import * as THREE from 'three';

// World layout of the particle chapters. The particle system sits at ORIGIN;
// every shape below is in its local space. The laptop lives at the world
// origin, well behind the camera by the time the particles take over.

export const ORIGIN = new THREE.Vector3(0, 2.3, -20);
export const LOGO_SIZE = 3.0;
export const MOSAIC_HEIGHT = 4.2;

// Project plates: the screenshot sits opposite its text, alternating sides on
// wide screens and above the text on narrow ones.
export const projectPlate = (k, portrait) => (portrait
  ? { centre: new THREE.Vector3(0, 1.15, 0), width: 3.1 }
  : { centre: new THREE.Vector3(k % 2 === 0 ? 2.05 : -2.05, 0.05, 0), width: 3.7 });

// "Other stacks": a grid of small marks with room for a label under each.
export const STACK_SIZE = 0.78;
export const stackCells = (count, portrait) => {
  const cols = portrait ? 3 : 6;
  const rows = Math.ceil(count / cols);
  const sx = portrait ? 1.22 : 1.45;
  const sy = portrait ? 1.45 : 1.75;
  const oy = portrait ? 0.35 : -0.35;
  return Array.from({ length: count }, (_, i) => {
    const c = i % cols;
    const r = Math.floor(i / cols);
    return new THREE.Vector3((c - (cols - 1) / 2) * sx, ((rows - 1) / 2 - r) * sy + oy, 0);
  });
};

// Career stops: education first, the current role last.
export const NODES = [
  new THREE.Vector3(-1.7, -0.1, -3),
  new THREE.Vector3(1.8, 0.35, -10),
  new THREE.Vector3(-1.7, -0.25, -17),
  new THREE.Vector3(1.8, 0.3, -24),
  new THREE.Vector3(-1.6, 0.15, -31),
];
export const CURRENT_NODE = NODES.length - 1;

export const PORTAL = new THREE.Vector3(0, 1.1, -40);
export const PORTAL_RADIUS = 2.3;
export const HALO = new THREE.Vector3(0, 0, -80);
export const HALO_RADIUS = 12;

export const pathCurve = () =>
  new THREE.CatmullRomCurve3(
    [new THREE.Vector3(0, 0, 1.5), ...NODES, PORTAL.clone().add(new THREE.Vector3(0, 0, 2))],
    false,
    'centripetal'
  );

// Deterministic random numbers, so shapes and the lines that join them agree.
export const seeded = (seed) => {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

// Satellite systems around each career node, shared by shapes and lines.
export const satellites = () => {
  const rand = seeded(7);
  return NODES.map((node) => Array.from({ length: 4 }, () => {
    const dir = new THREE.Vector3(rand() - 0.5, (rand() - 0.5) * 0.7, rand() - 0.5).normalize();
    return node.clone().add(dir.multiplyScalar(1.0 + rand() * 0.9));
  }));
};
