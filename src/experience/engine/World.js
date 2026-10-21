import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

import { projects, skills, stacks } from '../../constants/constants';
import { LOGO_PATHS } from '../data/logoPaths';
import { story } from '../story';
import { STOP, presence } from '../timeline';
import { BACKGROUND, createAtmosphere } from './Atmosphere';
import { FOV, SHAPES, createDirector } from './Director';
import { quadToMatrix3d } from './homography';
import { createLaptop } from './Laptop';
import { ORIGIN, projectPlate, stackCells } from './layout';
import { createParticles } from './Particles';
import { createPlates } from './Plates';
import {
  haloShape, logoShape, mosaicShape, networkShape, portalShape, projectShape, screenShape, stacksShape,
} from './shapes';
import { Spring, Spring3 } from './springs';

// Quality tiers. Phones and tablets get fewer particles and a lower pixel
// ratio; a slow first few seconds on any device drops the pixel ratio further.
const TIERS = {
  high: { particles: 18000, dust: 1400, maxPixelRatio: 1.75, antialias: true },
  low: { particles: 8000, dust: 600, maxPixelRatio: 1.5, antialias: false },
};

export const detectTier = () => {
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  const small = Math.min(window.innerWidth, window.innerHeight) < 700;
  const cores = navigator.hardwareConcurrency || 4;
  return coarse || small || cores <= 4 ? 'low' : 'high';
};

const loadImage = (src) => new Promise((resolve) => {
  const img = new Image();
  img.decoding = 'async';
  img.onload = () => resolve(img);
  img.onerror = () => resolve(null);
  img.src = src;
});

const idle = () => new Promise((resolve) => {
  if ('requestIdleCallback' in window) window.requestIdleCallback(() => resolve(), { timeout: 120 });
  else setTimeout(resolve, 16);
});

const sourceFor = (item) => (item.mark ? { text: item.mark } : { path: LOGO_PATHS[item.id] });

// Point sizes per shape: image shapes need larger points to read as pictures.
const PROJECT_POINT = 1.45;
const MOSAIC_POINT = 3.2;
const STACK_POINT = 1.25;
const LABEL_OFFSET = new THREE.Vector3(0, -0.6, 0);

export function createWorld({ canvas, cover, labels = [], onProgress }) {
  const tierName = detectTier();
  const tier = TIERS[tierName];
  let pixelRatio = Math.min(window.devicePixelRatio || 1, tier.maxPixelRatio);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: tier.antialias,
    powerPreference: 'high-performance',
    alpha: false,
  });
  renderer.setPixelRatio(pixelRatio);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.localClippingEnabled = true;
  renderer.setClearColor(BACKGROUND, 1);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(BACKGROUND);
  scene.fog = new THREE.FogExp2(BACKGROUND, 0.045);

  const pmrem = new THREE.PMREMGenerator(renderer);
  const roomEnvironment = new RoomEnvironment();
  const environment = pmrem.fromScene(roomEnvironment, 0.04).texture;
  roomEnvironment.dispose();
  scene.environment = environment;
  scene.environmentIntensity = 0.55;

  const camera = new THREE.PerspectiveCamera(FOV, 1, 0.05, 260);

  // Load-in reveal: a plane sweeps across the laptop, uncovering it.
  const reveal = new THREE.Plane(new THREE.Vector3(-1, 0, 0), -2.2);
  const laptop = createLaptop({ clippingPlanes: [reveal] });
  scene.add(laptop.group);

  const seamMaterial = new THREE.MeshBasicMaterial({
    color: 0x7fdcff,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    toneMapped: false,
  });
  const seam = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.32, 2.6), seamMaterial);
  seam.position.y = 0.12;
  laptop.group.add(seam);

  const atmosphere = createAtmosphere({ dustCount: tier.dust, pixelRatio });
  scene.add(atmosphere.group);

  // The particle world: one system for every shape, plus the crisp plates
  // the project shapes hand over to. Both share one transform.
  const world = new THREE.Group();
  world.position.copy(ORIGIN);
  scene.add(world);
  const particles = createParticles(tier.particles, pixelRatio);
  particles.points.position.set(0, 0, 0);
  world.add(particles.points);
  const plates = createPlates(projects.length);
  world.add(plates.group);

  const director = createDirector();

  // ── Springs: inertia on top of the deterministic targets ───────────────
  const springs = {
    camera: new Spring3(new THREE.Vector3(), { response: 0.5, dampingRatio: 1 }),
    look: new Spring3(new THREE.Vector3(), { response: 0.45, dampingRatio: 1 }),
    sway: new Spring3(new THREE.Vector3(), { response: 0.9, dampingRatio: 0.9 }),
    laptopRot: new Spring(0, { response: 0.75, dampingRatio: 0.72 }),
    // Under-damped: the lid overshoots a little and settles on its hinge.
    lid: new Spring(0, { response: 0.62, dampingRatio: 0.5 }),
    power: new Spring(0, { response: 0.35, dampingRatio: 1 }),
    morph: new Spring(0, { response: 0.3, dampingRatio: 1 }),
    spin: new Spring(0, { response: 0.6, dampingRatio: 0.8 }),
    // Scroll momentum tips objects; they swing back when scrolling stops.
    tilt: new Spring(0, { response: 0.85, dampingRatio: 0.45 }),
  };
  let needsSnap = true;
  let lastWorld = '';

  const camPos = new THREE.Vector3();
  const camLook = new THREE.Vector3();
  const sway = new THREE.Vector3();
  const swayTarget = new THREE.Vector3();

  // ── Shapes ─────────────────────────────────────────────────────────────
  const count = tier.particles;
  let images = [];
  let stackSources = null;
  const buildStacks = () => {
    particles.setShape(
      SHAPES.STACKS,
      stacksShape(stacks, stackSources, count, stackCells(stacks.length, director.portrait)),
      STACK_POINT
    );
  };
  const rebuildImageShapes = () => {
    const { screenSize, mosaicSize } = director.sizes;
    const { portrait } = director;
    particles.setShape(SHAPES.SCREEN, screenShape(count, screenSize.width, screenSize.height), 2.4);
    plates.layout(portrait);
    projects.forEach((p, k) => {
      const { centre, width } = projectPlate(k, portrait);
      particles.setShape(SHAPES.FIRST_PROJECT + k, projectShape(images[k], count, centre, width), PROJECT_POINT);
    });
    particles.setShape(SHAPES.MOSAIC, mosaicShape(images, count, mosaicSize.width, mosaicSize.height), MOSAIC_POINT);
    if (stackSources) buildStacks();
  };

  // ── Sizing ─────────────────────────────────────────────────────────────
  let width = 1;
  let height = 1;
  const resize = () => {
    width = canvas.clientWidth || window.innerWidth;
    height = canvas.clientHeight || window.innerHeight;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    director.layout(width, height);
    rebuildImageShapes();
    needsSnap = true;
  };
  resize();

  // ── Cover: real HTML mapped onto the display ───────────────────────────
  const quad = [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()];
  const projected = [[0, 0], [0, 0], [0, 0], [0, 0]];
  let coverState = '';
  const applyCover = (mode, opacity) => {
    if (!cover) return;
    if (mode === 'hidden' || opacity <= 0.001) {
      if (coverState !== 'hidden') {
        cover.style.visibility = 'hidden';
        cover.style.opacity = '0';
        cover.style.pointerEvents = 'none';
        coverState = 'hidden';
      }
      return;
    }
    cover.style.visibility = 'visible';
    cover.style.opacity = opacity.toFixed(3);
    cover.style.pointerEvents = opacity > 0.5 ? 'auto' : 'none';
    if (mode === 'full') {
      if (coverState !== 'full') cover.style.transform = 'none';
      coverState = 'full';
      return;
    }
    coverState = 'quad';
    const rect = cover.parentElement.getBoundingClientRect();
    laptop.contentQuad(width / height, quad);
    for (let i = 0; i < 4; i += 1) {
      const p = laptop.screen.parent.localToWorld(quad[i]).project(camera);
      projected[i][0] = (p.x * 0.5 + 0.5) * width - rect.left;
      projected[i][1] = (-p.y * 0.5 + 0.5) * height - rect.top;
    }
    const matrix = quadToMatrix3d(cover.offsetWidth, cover.offsetHeight, projected);
    if (matrix) cover.style.transform = matrix;
  };

  // ── Labels under the "other stacks" marks, placed by projection ────────
  const labelPoint = new THREE.Vector3();
  let labelsShown = true;
  const applyLabels = (amount) => {
    if (!labels.length) return;
    if (amount <= 0.001) {
      if (labelsShown) {
        labels.forEach((el) => {
          el.style.opacity = '0';
          el.style.visibility = 'hidden';
        });
      }
      labelsShown = false;
      return;
    }
    labelsShown = true;
    const cells = stackCells(labels.length, director.portrait);
    const parent = labels[0].offsetParent;
    const rect = parent ? parent.getBoundingClientRect() : { left: 0, top: 0 };
    labels.forEach((el, n) => {
      labelPoint.copy(cells[n]).add(LABEL_OFFSET);
      world.localToWorld(labelPoint).project(camera);
      const x = (labelPoint.x * 0.5 + 0.5) * width - rect.left;
      const y = (-labelPoint.y * 0.5 + 0.5) * height - rect.top;
      // Labels arrive one after another, left to right.
      const local = Math.max(0, Math.min(1, amount * 1.8 - n * 0.06));
      el.style.visibility = local > 0.01 ? 'visible' : 'hidden';
      el.style.opacity = local.toFixed(3);
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${(y + (1 - local) * 10).toFixed(1)}px, 0) translateX(-50%)`;
    });
  };

  // ── Loop ───────────────────────────────────────────────────────────────
  let frame = 0;
  let last = performance.now();
  let elapsed = 0;
  let revealTime = 0;
  let ready = false;
  const slowFrames = { count: 0, total: 0 };
  const rest = new Array(projects.length).fill(0);

  const tick = (now) => {
    frame = requestAnimationFrame(tick);
    const dt = Math.min((now - last) / 1000, 1 / 15);
    last = now;
    if (!ready) return;
    elapsed += dt;

    const t = director.update(story.g);

    // Changing worlds happens behind the opaque cover: jump, don't fly.
    if (t.world !== lastWorld) needsSnap = true;
    lastWorld = t.world;
    if (needsSnap) {
      springs.camera.snap(t.camera);
      springs.look.snap(t.look);
      springs.laptopRot.snap(t.laptop.rotY);
      springs.lid.snap(t.laptop.lid);
      springs.power.snap(t.laptop.power);
      springs.morph.snap(t.morph);
      springs.spin.snap(t.spin);
      needsSnap = false;
    }

    // Load-in reveal, only when the visitor arrives at the top.
    revealTime += dt;
    const r = Math.min(1, revealTime / 2.4);
    const eased = 1 - Math.pow(1 - r, 3);
    reveal.constant = r >= 1 ? 1e3 : -2.2 + eased * 4.6;
    seam.position.x = reveal.constant;
    seamMaterial.opacity = r >= 1 ? 0 : Math.sin(Math.PI * eased) * 0.9;
    seam.visible = r < 1;

    springs.camera.setTarget(t.camera);
    springs.look.setTarget(t.look);
    springs.laptopRot.target = t.laptop.rotY;
    springs.lid.target = t.laptop.lid;
    springs.power.target = t.laptop.power;
    springs.morph.target = t.morph;
    springs.spin.target = t.spin;
    springs.tilt.target = THREE.MathUtils.clamp(story.velocity * 0.12, -0.3, 0.3);
    // Scroll velocity is only reported while scrolling; let it die away.
    story.velocity *= Math.exp(-dt * 5);
    swayTarget.set(story.pointer.x * 0.22, story.pointer.y * 0.12, 0);
    springs.sway.setTarget(swayTarget);

    springs.camera.step(dt, camPos);
    springs.look.step(dt, camLook);
    springs.sway.step(dt, sway);
    const tilt = springs.tilt.step(dt);

    camera.position.copy(camPos).add(sway);
    camera.up.copy(t.up);
    camera.lookAt(camLook);

    // Laptop
    const onLaptop = t.world === 'laptop';
    laptop.group.visible = onLaptop;
    if (onLaptop) {
      laptop.group.rotation.y = springs.laptopRot.step(dt);
      laptop.group.rotation.z = tilt * 0.08;
      const lid = Math.min(springs.lid.step(dt), THREE.MathUtils.degToRad(122));
      laptop.setLid(Math.max(0, lid));
      laptop.setPower(springs.power.step(dt));
    }

    // Particle world
    world.visible = !onLaptop;
    const m = springs.morph.step(dt);
    const spin = springs.spin.step(dt);
    if (!onLaptop) {
      particles.setMorph(m);
      particles.scatter = t.scatter;
      particles.time = elapsed;
      // Plates hold the stop; particles carry the travel between them.
      let resting = 0;
      for (let k = 0; k < rest.length; k += 1) {
        rest[k] = 1 - THREE.MathUtils.smoothstep(Math.abs(m - (SHAPES.FIRST_PROJECT + k)), 0.02, 0.12);
        resting = Math.max(resting, rest[k]);
      }
      plates.update(rest);
      particles.opacity = 1 - resting;
      // Before the career network the world leans gently towards the pointer.
      const lean = m < SHAPES.NETWORK - 0.5 ? 1 : 0;
      const inSkills = m > SHAPES.MOSAIC + 0.5 && m < SHAPES.STACKS + 0.5;
      world.rotation.y = spin + story.pointer.x * 0.08 * lean;
      world.rotation.x = tilt * (inSkills ? 0.6 : 0.2) - story.pointer.y * 0.05 * lean;
    }

    camera.updateMatrixWorld();
    scene.updateMatrixWorld();
    applyCover(t.cover.mode, t.cover.opacity);
    applyLabels(onLaptop ? 0 : presence(story.g, STOP.stacks));

    atmosphere.update({
      time: elapsed,
      reveal: 24 * eased,
      level: 0.15 + 0.85 * eased,
      glow: onLaptop ? 0.5 + 0.7 * springs.power.value : 0.5,
      path: t.path,
      links: t.links,
    });

    // While the opaque cover fills the screen there is nothing to draw.
    if (!(t.cover.mode === 'full' && t.cover.opacity >= 0.999)) renderer.render(scene, camera);

    // Adaptive resolution: if the first seconds run slow, render fewer pixels.
    if (slowFrames.count < 120 && elapsed > 1) {
      slowFrames.count += 1;
      slowFrames.total += dt;
      if (slowFrames.count === 120 && slowFrames.total / 120 > 1 / 40 && pixelRatio > 1) {
        pixelRatio = 1;
        renderer.setPixelRatio(pixelRatio);
        particles.setPixelRatio(pixelRatio);
        atmosphere.setPixelRatio(pixelRatio);
        resize();
      }
    }
  };

  // ── Loading, in honest steps ───────────────────────────────────────────
  let disposed = false;
  const steps = 3 + projects.length + skills.length;
  let done = 0;
  const step = (label) => {
    done += 1;
    if (onProgress) onProgress(done, steps, label);
  };

  const load = async () => {
    // First frame as soon as the laptop exists; the rest streams in.
    renderer.compile(scene, camera);
    step('Scene');
    ready = true;
    // Skip the reveal when arriving part way down the page.
    if (story.g > 0.5) revealTime = 10;
    frame = requestAnimationFrame(tick);

    images = await Promise.all(projects.map(async (p, k) => {
      const img = await loadImage(p.image.src);
      if (img) plates.setImage(k, img);
      step('Projects');
      return img;
    }));
    if (disposed) return;
    rebuildImageShapes();

    for (let i = 0; i < skills.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await idle();
      if (disposed) return;
      const s = skills[i];
      particles.setShape(SHAPES.FIRST_SKILL + i, logoShape(s.id, sourceFor(s), s.color, count));
      step('Skills');
    }
    await idle();
    if (disposed) return;
    stackSources = stacks.map(sourceFor);
    buildStacks();
    step('Stacks');
    await idle();
    if (disposed) return;
    particles.setShape(SHAPES.NETWORK, networkShape(count));
    particles.setShape(SHAPES.PORTAL, portalShape(count));
    particles.setShape(SHAPES.HALO, haloShape(count));
    step('Network');
  };

  load();

  return {
    tier: tierName,
    resize,
    dispose() {
      disposed = true;
      cancelAnimationFrame(frame);
      laptop.dispose();
      seam.geometry.dispose();
      seamMaterial.dispose();
      atmosphere.dispose();
      particles.dispose();
      plates.dispose();
      environment.dispose();
      pmrem.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      if (cover) ['transform', 'opacity', 'visibility', 'pointer-events'].forEach((p) => cover.style.removeProperty(p));
      labels.forEach((el) => ['transform', 'opacity', 'visibility'].forEach((p) => el.style.removeProperty(p)));
    },
  };
}
