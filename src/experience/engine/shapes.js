import * as THREE from 'three';

import {
  CURRENT_NODE, HALO, HALO_RADIUS, LOGO_SIZE, NODES, PORTAL, PORTAL_RADIUS, STACK_SIZE, pathCurve, satellites,
  seeded,
} from './layout';

// Each shape is { positions: Float32Array(n*3), colors: Float32Array(n*3) }
// with the same particle count, so any shape can morph into any other.

const makeShape = (count) => ({
  positions: new Float32Array(count * 3),
  colors: new Float32Array(count * 3),
});

const write = (shape, i, x, y, z, color, brightness = 1) => {
  shape.positions[i * 3] = x;
  shape.positions[i * 3 + 1] = y;
  shape.positions[i * 3 + 2] = z;
  shape.colors[i * 3] = color.r * brightness;
  shape.colors[i * 3 + 1] = color.g * brightness;
  shape.colors[i * 3 + 2] = color.b * brightness;
};

const gaussian = (rand) => (rand() + rand() + rand() - 1.5) / 1.5;

// ── Project mosaic ────────────────────────────────────────────────────────
// The four project screenshots, rebuilt as a grid of coloured particles: the
// showcase "screen" coming apart into the stack behind it.
const coverSample = (image, cols, rows) => {
  const canvas = document.createElement('canvas');
  canvas.width = cols;
  canvas.height = rows;
  const ctx = canvas.getContext('2d');
  const target = cols / rows;
  const source = image.naturalWidth / image.naturalHeight;
  let sw = image.naturalWidth;
  let sh = image.naturalHeight;
  if (source > target) sw = sh * target;
  else sh = sw / target;
  ctx.drawImage(image, (image.naturalWidth - sw) / 2, 0, sw, sh, 0, 0, cols, rows);
  return ctx.getImageData(0, 0, cols, rows).data;
};

export function mosaicShape(images, count, width, height) {
  const shape = makeShape(count);
  const gap = height * 0.04;
  const tileW = (width - gap) / 2;
  const tileH = (height - gap) / 2;
  const perTile = Math.floor(count / 4);
  const cols = Math.max(4, Math.round(Math.sqrt(perTile * (tileW / tileH))));
  const rows = Math.max(4, Math.floor(perTile / cols));
  const color = new THREE.Color();
  const rand = seeded(11);
  let i = 0;

  images.forEach((image, t) => {
    const data = image ? coverSample(image, cols, rows) : null;
    const ox = (t % 2 === 0 ? -1 : 1) * (tileW + gap) / 2;
    const oy = (t < 2 ? 1 : -1) * (tileH + gap) / 2;
    for (let r = 0; r < rows; r += 1) {
      for (let c = 0; c < cols; c += 1) {
        const k = (r * cols + c) * 4;
        if (data) color.setRGB(data[k] / 255, data[k + 1] / 255, data[k + 2] / 255, THREE.SRGBColorSpace);
        else color.setRGB(0.1, 0.14, 0.2);
        write(
          shape, i,
          ox + ((c + 0.5) / cols - 0.5) * tileW,
          oy - ((r + 0.5) / rows - 0.5) * tileH,
          (rand() - 0.5) * 0.02,
          color, 2.2
        );
        i += 1;
      }
    }
  });
  // Spare particles rest invisibly inside the grid.
  for (; i < count; i += 1) {
    write(shape, i, (rand() - 0.5) * width, (rand() - 0.5) * height, 0, color, 0);
  }
  return shape;
}

// ── Logos ─────────────────────────────────────────────────────────────────
// The official mark is rasterised from its SVG path, then rebuilt as a solid:
// a front face, a back face and side walls along its silhouette.
const RES = 256;
const DEPTH = 0.15;

// A source is an SVG path, or a short typographic mark for technologies with
// no official single-colour logo.
const rasterise = (source) => {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = RES;
  const ctx = canvas.getContext('2d');
  ctx.scale(RES / 24, RES / 24);
  ctx.fillStyle = '#fff';
  if (source.text) {
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(1.5, 4, 21, 16, 3);
    ctx.stroke();
    ctx.font = `700 ${source.text.length > 2 ? 7.5 : 9.5}px "JetBrains Mono", ui-monospace, monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(source.text, 12, 12.6);
  } else {
    ctx.fill(new Path2D(source.path));
  }
  const { data } = ctx.getImageData(0, 0, RES, RES);
  const inside = new Uint8Array(RES * RES);
  for (let i = 0; i < inside.length; i += 1) inside[i] = data[i * 4 + 3] > 127 ? 1 : 0;
  return inside;
};

// Connected regions of the mask, largest first, for multi-colour marks.
const regions = (inside) => {
  const label = new Int32Array(inside.length).fill(-1);
  const found = [];
  const stack = [];
  for (let start = 0; start < inside.length; start += 1) {
    if (!inside[start] || label[start] !== -1) continue;
    const id = found.length;
    let size = 0;
    let sumY = 0;
    stack.push(start);
    label[start] = id;
    while (stack.length) {
      const p = stack.pop();
      size += 1;
      sumY += Math.floor(p / RES);
      const x = p % RES;
      const neighbours = [x > 0 ? p - 1 : -1, x < RES - 1 ? p + 1 : -1, p - RES, p + RES];
      neighbours.forEach((n) => {
        if (n >= 0 && n < inside.length && inside[n] && label[n] === -1) {
          label[n] = id;
          stack.push(n);
        }
      });
    }
    found.push({ id, size, centreY: sumY / size });
  }
  return { label, found: found.sort((a, b) => b.size - a.size) };
};

const PALETTES = {
  python: { top: new THREE.Color('#4b8bd4'), bottom: new THREE.Color('#ffd43b') },
  firebase: { top: new THREE.Color('#ffca28'), bottom: new THREE.Color('#f57c00') },
};

export function logoShape(id, source, hex, count, { size = LOGO_SIZE, centre = null, depth = DEPTH } = {}) {
  const shape = makeShape(count);
  const inside = rasterise(source);
  const interior = [];
  const edge = [];
  for (let y = 1; y < RES - 1; y += 1) {
    for (let x = 1; x < RES - 1; x += 1) {
      const p = y * RES + x;
      if (!inside[p]) continue;
      const boundary = !inside[p - 1] || !inside[p + 1] || !inside[p - RES] || !inside[p + RES];
      (boundary ? edge : interior).push(p);
    }
  }
  if (!interior.length) interior.push(...edge);

  const base = new THREE.Color(hex);
  const color = new THREE.Color();
  let colourAt = () => base;
  if (id === 'python') {
    const { label, found } = regions(inside);
    const [a, b] = found;
    const upper = b && b.centreY < a.centreY ? b.id : a.id;
    colourAt = (p) => (label[p] === upper ? PALETTES.python.top : PALETTES.python.bottom);
  } else if (id === 'firebase') {
    colourAt = (p) => color.copy(PALETTES.firebase.top).lerp(PALETTES.firebase.bottom, Math.floor(p / RES) / RES);
  }

  const rand = seeded(id.length * 97 + count);
  const px = 1 / RES;
  for (let i = 0; i < count; i += 1) {
    const r = rand();
    const onEdge = r < 0.38 && edge.length;
    const list = onEdge ? edge : interior;
    const p = list[Math.floor(rand() * list.length)];
    let x = ((p % RES) / RES - 0.5 + (rand() - 0.5) * px) * size;
    let y = -((Math.floor(p / RES)) / RES - 0.5 + (rand() - 0.5) * px) * size;
    let z;
    let brightness;
    if (onEdge) {
      z = (rand() * 2 - 1) * depth;
      brightness = 0.85;
    } else if (r < 0.84) {
      z = depth;
      brightness = 0.75 + rand() * 0.25;
    } else {
      z = -depth;
      brightness = 0.4;
    }
    if (centre) {
      x += centre.x;
      y += centre.y;
      z += centre.z;
    }
    write(shape, i, x, y, z, colourAt(p), brightness);
  }
  return shape;
}

// ── Career network ────────────────────────────────────────────────────────
export function networkShape(count) {
  const shape = makeShape(count);
  const rand = seeded(23);
  const curve = pathCurve();
  const sats = satellites();
  const pathColour = new THREE.Color('#4fb8ff');
  const nodeColour = new THREE.Color('#c6ecff');
  const currentColour = new THREE.Color('#ab9eff');
  const educationColour = new THREE.Color('#ffd27a');
  const satColour = new THREE.Color('#6f86ff');
  const point = new THREE.Vector3();
  const nodeShare = Math.floor(count * 0.45);
  const satShare = Math.floor(count * 0.12);
  let i = 0;

  // Node shells: Fibonacci spheres, the current role slightly larger.
  const perNode = Math.floor(nodeShare / NODES.length);
  NODES.forEach((node, n) => {
    const current = n === CURRENT_NODE;
    const radius = current ? 0.55 : 0.42;
    const colour = n === 0 ? educationColour : current ? currentColour : nodeColour;
    for (let k = 0; k < perNode; k += 1) {
      const t = (k + 0.5) / perNode;
      const phi = Math.acos(1 - 2 * t);
      const theta = Math.PI * (1 + Math.sqrt(5)) * k;
      const shell = k % 5 === 0 ? 0.35 + rand() * 0.4 : 1 + gaussian(rand) * 0.03;
      write(
        shape, i,
        node.x + radius * shell * Math.sin(phi) * Math.cos(theta),
        node.y + radius * shell * Math.cos(phi),
        node.z + radius * shell * Math.sin(phi) * Math.sin(theta),
        colour, k % 5 === 0 ? 1 : 0.7
      );
      i += 1;
    }
  });

  // Satellites
  const flat = sats.flat();
  const perSat = Math.floor(satShare / flat.length);
  flat.forEach((s) => {
    for (let k = 0; k < perSat; k += 1) {
      write(shape, i, s.x + gaussian(rand) * 0.07, s.y + gaussian(rand) * 0.07, s.z + gaussian(rand) * 0.07, satColour, 0.8);
      i += 1;
    }
  });

  // The rest stream along the career path.
  for (; i < count; i += 1) {
    curve.getPointAt(rand(), point);
    const spread = 0.04 + rand() * rand() * 0.25;
    write(
      shape, i,
      point.x + gaussian(rand) * spread,
      point.y + gaussian(rand) * spread,
      point.z + gaussian(rand) * spread,
      pathColour, 0.35 + rand() * 0.45
    );
  }
  return shape;
}

// ── Portal and halo ───────────────────────────────────────────────────────
export function portalShape(count) {
  const shape = makeShape(count);
  const rand = seeded(31);
  const cyan = new THREE.Color('#5cd0ff');
  const violet = new THREE.Color('#9a8bff');
  const colour = new THREE.Color();
  for (let i = 0; i < count; i += 1) {
    const theta = rand() * Math.PI * 2;
    const core = rand() < 0.82;
    const r = core ? PORTAL_RADIUS + gaussian(rand) * 0.07 : PORTAL_RADIUS * (0.25 + rand() * 0.75);
    colour.copy(cyan).lerp(violet, 0.5 + 0.5 * Math.sin(theta * 2));
    write(
      shape, i,
      PORTAL.x + Math.cos(theta) * r,
      PORTAL.y + Math.sin(theta) * r,
      PORTAL.z + gaussian(rand) * (core ? 0.06 : 0.25),
      colour, core ? 0.9 : 0.25
    );
  }
  return shape;
}

export function haloShape(count) {
  const shape = makeShape(count);
  const rand = seeded(41);
  const ring = new THREE.Color('#6fb6ff');
  const star = new THREE.Color('#9aa8d8');
  for (let i = 0; i < count; i += 1) {
    if (rand() < 0.62) {
      const theta = rand() * Math.PI * 2;
      const r = HALO_RADIUS + gaussian(rand) * 0.3;
      write(shape, i, HALO.x + Math.cos(theta) * r, HALO.y + Math.sin(theta) * r, HALO.z + gaussian(rand) * 0.4, ring, 0.95);
    } else {
      const v = new THREE.Vector3(rand() - 0.5, rand() - 0.5, rand() - 0.5).normalize().multiplyScalar(14 + rand() * 30);
      write(shape, i, HALO.x + v.x, HALO.y + v.y * 0.6, HALO.z + v.z, star, 0.15 + rand() * 0.25);
    }
  }
  return shape;
}

// ── The display, before a project appears on it ───────────────────────────
// A faint grid filling the view, matching the cover it replaces.
export function screenShape(count, width, height) {
  const shape = makeShape(count);
  const rand = seeded(5);
  const cols = Math.max(4, Math.round(Math.sqrt(count * (width / height))));
  const rows = Math.max(4, Math.floor(count / cols));
  const base = new THREE.Color('#1b2a40');
  const accent = new THREE.Color('#5cd0ff');
  let i = 0;
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      const lit = rand() < 0.015;
      write(
        shape, i,
        ((c + 0.5) / cols - 0.5) * width,
        -((r + 0.5) / rows - 0.5) * height,
        (rand() - 0.5) * 0.04,
        lit ? accent : base, lit ? 0.9 : 0.35 + rand() * 0.2
      );
      i += 1;
    }
  }
  for (; i < count; i += 1) write(shape, i, (rand() - 0.5) * width, (rand() - 0.5) * height, 0, base, 0);
  return shape;
}

// ── One project screenshot ────────────────────────────────────────────────
// Sampled on a grid that lines up with the crisp plate it hands over to.
export function projectShape(image, count, centre, width) {
  const shape = makeShape(count);
  const aspect = image ? image.naturalWidth / image.naturalHeight : 16 / 9;
  const height = width / aspect;
  const cols = Math.max(4, Math.round(Math.sqrt(count * aspect)));
  const rows = Math.max(4, Math.floor(count / cols));
  const data = image ? coverSample(image, cols, rows) : null;
  const color = new THREE.Color();
  const rand = seeded(17);
  let i = 0;
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      const k = (r * cols + c) * 4;
      if (data) color.setRGB(data[k] / 255, data[k + 1] / 255, data[k + 2] / 255, THREE.SRGBColorSpace);
      else color.setRGB(0.1, 0.14, 0.2);
      write(
        shape, i,
        centre.x + ((c + 0.5) / cols - 0.5) * width,
        centre.y - ((r + 0.5) / rows - 0.5) * height,
        centre.z,
        color, 1.15
      );
      i += 1;
    }
  }
  for (; i < count; i += 1) {
    write(shape, i, centre.x + (rand() - 0.5) * width, centre.y + (rand() - 0.5) * height, centre.z, color, 0);
  }
  return { ...shape, height };
}

// ── Other stacks: a constellation of small marks ──────────────────────────
export function stacksShape(items, sources, count, cells) {
  const shape = makeShape(count);
  const per = Math.floor(count / items.length);
  items.forEach((item, n) => {
    const part = logoShape(item.id, sources[n], item.color, per, { size: STACK_SIZE, centre: cells[n], depth: 0.05 });
    // Small marks read better a little brighter.
    for (let i = 0; i < part.colors.length; i += 1) part.colors[i] = Math.min(1.4, part.colors[i] * 1.35);
    shape.positions.set(part.positions, n * per * 3);
    shape.colors.set(part.colors, n * per * 3);
  });
  // Spare particles join the first mark.
  for (let i = per * items.length; i < count; i += 1) {
    const j = i % per;
    for (let a = 0; a < 3; a += 1) {
      shape.positions[i * 3 + a] = shape.positions[j * 3 + a];
      shape.colors[i * 3 + a] = shape.colors[j * 3 + a] * 0.5;
    }
  }
  return shape;
}
