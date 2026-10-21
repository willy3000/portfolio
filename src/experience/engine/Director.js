import * as THREE from 'three';

import { projects, skills } from '../../constants/constants';
import {
  LAST, STOP, STOPS, ease, lerp, segment, smoothstep,
} from '../timeline';
import { DIMENSIONS } from './Laptop';
import {
  HALO, MOSAIC_HEIGHT, NODES, ORIGIN, PORTAL, projectPlate,
} from './layout';

// The director gives every stop a pose (camera, laptop, particle shape) and
// blends between neighbouring poses. Poses depend only on the viewport;
// blends only on g. Springs in World add the physics on top.

export const FOV = 35;
const TAN = Math.tan(THREE.MathUtils.degToRad(FOV / 2));
const LID_OPEN = THREE.MathUtils.degToRad(108);
const LID_CRACK = THREE.MathUtils.degToRad(4);

// Particle shapes, in journey order.
export const SHAPES = (() => {
  const s = { SCREEN: 0, FIRST_PROJECT: 1 };
  s.MOSAIC = s.FIRST_PROJECT + projects.length;
  s.FIRST_SKILL = s.MOSAIC + 1;
  s.STACKS = s.FIRST_SKILL + skills.length;
  s.NETWORK = s.STACKS + 1;
  s.PORTAL = s.NETWORK + 1;
  s.HALO = s.PORTAL + 1;
  return s;
})();

const v = (x, y, z) => new THREE.Vector3(x, y, z);
const UP = v(0, 1, 0);

export function createDirector() {
  const target = {
    world: 'laptop',
    camera: v(0, 0, 0),
    look: v(0, 0, 0),
    up: v(0, 1, 0),
    laptop: { rotY: 0, lid: 0, power: 0 },
    morph: 0,
    spin: 0,
    scatter: 0.65,
    path: { draw: 0, opacity: 0 },
    links: { draw: 0, opacity: 0 },
    cover: { mode: 'hidden', opacity: 0 },
  };

  let aspect = 16 / 9;
  let portrait = false;
  let poses = [];
  const frames = {};

  const layout = (w, h) => {
    aspect = w / h;
    portrait = aspect < 0.85;
    const fit = (width) => width / (2 * TAN * aspect);
    const away = (look, dir, distance) => ({ cam: look.clone().add(dir.normalize().multiplyScalar(distance)), look });
    const o = (x, y, z) => ORIGIN.clone().add(v(x, y, z));

    // Laptop
    const hero = portrait
      ? away(v(0, -1.3, 0), v(2.2, 2.8, 8.6), fit(4.2))
      : { cam: v(3.4, 2.5, 7.6), look: v(-1.7, 0.55, 0) };
    const closed = portrait
      ? away(v(0, -0.3, 0), v(0, 2.6, 6.4), fit(3.9))
      : { cam: v(0, 2.7, 5.9), look: v(0, 0.5, 0) };
    const open = portrait
      ? away(v(0, 0.9, -0.6), v(0, 1.4, 6), fit(3.6))
      : { cam: v(0, 2.05, 4.9), look: v(0, 0.95, -0.6) };

    // Square-on to the open display, at the distance where content with the
    // viewport's aspect exactly fills the view.
    const pivot = new THREE.Object3D();
    pivot.position.set(0, DIMENSIONS.baseThickness + 0.006, -DIMENSIONS.depth / 2 + 0.035);
    pivot.rotation.set(Math.PI / 2 - LID_OPEN, 0, 0);
    pivot.updateMatrixWorld(true);
    let qh = DIMENSIONS.screenWidth / aspect;
    if (qh > DIMENSIONS.screenHeight) qh = DIMENSIONS.screenHeight;
    const centre = v(0, DIMENSIONS.chin + DIMENSIONS.screenHeight / 2, 0.0013).applyMatrix4(pivot.matrixWorld);
    const normal = v(0, 0, 1).applyQuaternion(pivot.quaternion);
    frames.fillUp = v(0, 1, 0).applyQuaternion(pivot.quaternion);
    const fill = { cam: centre.clone().addScaledVector(normal, (qh / 2) / TAN), look: centre };

    // Particle world
    const projectsFrame = portrait
      ? { cam: o(0, -0.35, Math.max(9, fit(3.6))), look: o(0, -0.35, 0) }
      : { cam: o(0, 0, Math.max(8.4, 4.3 / (TAN * aspect))), look: o(0, 0, 0) };
    frames.projectsDistance = projectsFrame.cam.distanceTo(projectsFrame.look);
    const mosaic = { cam: o(0, 0, (MOSAIC_HEIGHT / 2) / TAN * 0.97), look: o(0, 0, 0) };
    const logo = portrait
      ? { cam: o(0, -1.1, Math.max(11, fit(3.5))), look: o(0, -1.25, 0) }
      : { cam: o(-1.9, 0.1, 8.6), look: o(-1.9, -0.05, 0) };
    const stacks = portrait
      ? { cam: o(0, 0.6, Math.max(10, fit(4.1))), look: o(0, 0.6, 0) }
      : { cam: o(0, -0.15, Math.max(8.2, 4.9 / (TAN * aspect))), look: o(0, -0.15, 0) };
    const overview = portrait
      ? { cam: o(0, 9, 9), look: o(0, -1.5, -14) }
      : { cam: o(6.5, 4.8, 5.5), look: o(-1.5, -0.4, -13) };
    const workIntro = portrait
      ? { cam: o(0, 3.6, -1), look: o(0, -0.8, -20) }
      : { cam: o(-6, 3.4, -3.5), look: o(1.2, -0.3, -19) };
    const stopFrame = (node) => (portrait
      ? { cam: ORIGIN.clone().add(node).add(v(0, -0.6, 6.4)), look: ORIGIN.clone().add(node).add(v(0, -1.1, 0)) }
      : {
        cam: ORIGIN.clone().add(node).add(v(-node.x * 0.62, 0.35, 4.6)),
        look: ORIGIN.clone().add(node).add(v(-node.x * 0.62, 0, 0)),
      });
    frames.portalFront = { cam: ORIGIN.clone().add(PORTAL).add(v(0, 0, 10)), look: ORIGIN.clone().add(PORTAL) };
    const beyond = {
      cam: ORIGIN.clone().add(PORTAL).add(v(0, 0, -7)),
      look: ORIGIN.clone().add(HALO).add(v(0, portrait ? -2 : 0, 0)),
    };

    // Sizes the image-based shapes need.
    const visibleH = 2 * frames.projectsDistance * TAN;
    frames.screenSize = { width: visibleH * aspect * 1.05, height: visibleH * 1.05 };
    frames.mosaicSize = { width: MOSAIC_HEIGHT * aspect, height: MOSAIC_HEIGHT };

    const laptopPose = (frame, rotY, lid, power, cover) => ({
      world: 'laptop', ...frame, laptop: { rotY, lid, power }, cover, morph: SHAPES.SCREEN,
    });
    const particlePose = (frame, morph) => ({ world: 'particles', ...frame, morph, cover: { mode: 'full', opacity: 0 } });

    poses = STOPS.map(({ id }) => {
      if (id === 'hero') return laptopPose(hero, -0.78, 0, 0, { mode: 'hidden', opacity: 0 });
      if (id === 'laptop') return laptopPose(closed, 0, LID_CRACK, 0, { mode: 'hidden', opacity: 0 });
      if (id === 'open') return laptopPose(open, 0, LID_OPEN, 1, { mode: 'quad', opacity: 1 });
      if (id === 'index') return { ...laptopPose(fill, 0, LID_OPEN, 1, { mode: 'full', opacity: 1 }), up: frames.fillUp };
      if (id.startsWith('project-')) {
        const k = projects.findIndex((p) => `project-${p.id}` === id);
        return particlePose(projectsFrame, SHAPES.FIRST_PROJECT + k);
      }
      if (id === 'stack') return particlePose(mosaic, SHAPES.MOSAIC);
      if (id.startsWith('skill-')) {
        const k = skills.findIndex((s) => `skill-${s.id}` === id);
        return particlePose(logo, SHAPES.FIRST_SKILL + k);
      }
      if (id === 'stacks') return particlePose(stacks, SHAPES.STACKS);
      if (id === 'experience') return particlePose(overview, SHAPES.NETWORK);
      if (id === 'education') return particlePose(stopFrame(NODES[0]), SHAPES.NETWORK);
      if (id === 'work-intro') return particlePose(workIntro, SHAPES.NETWORK);
      if (id.startsWith('job-')) return particlePose(stopFrame(NODES[Number(id.slice(4)) + 1]), SHAPES.NETWORK);
      return particlePose(beyond, SHAPES.HALO);
    });
  };

  const apply = (pose) => {
    target.world = pose.world;
    target.camera.copy(pose.cam);
    target.look.copy(pose.look);
    target.up.copy(pose.up || UP);
    if (pose.laptop) Object.assign(target.laptop, pose.laptop);
    target.morph = pose.morph;
    target.cover.mode = pose.cover.mode;
    target.cover.opacity = pose.cover.opacity;
  };

  const blend = (a, b, t) => {
    apply(a);
    target.camera.lerpVectors(a.cam, b.cam, t);
    target.look.lerpVectors(a.look, b.look, t);
    target.up.copy(a.up || UP).lerp(b.up || UP, t).normalize();
    target.morph = lerp(a.morph, b.morph, t);
    if (a.laptop && b.laptop) {
      target.laptop.rotY = lerp(a.laptop.rotY, b.laptop.rotY, t);
      target.laptop.lid = lerp(a.laptop.lid, b.laptop.lid, t);
      target.laptop.power = lerp(a.laptop.power, b.laptop.power, t);
    }
  };

  const update = (g) => {
    const { i, t } = segment(g);
    const a = poses[i];
    const b = poses[i + 1];
    const e = ease(t);

    target.scatter = 0.65;
    target.path.opacity = 0;
    target.links.opacity = 0;

    if (i === STOP.index) {
      // Through the display: the cover is opaque while the camera cuts from
      // the laptop to the particle world, then fades to reveal the screen
      // grid gathering into the first project.
      const cut = t >= 0.3;
      apply(cut ? b : a);
      target.cover.mode = 'full';
      target.cover.opacity = 1 - smoothstep(0.4, 0.8, t);
      target.morph = cut ? SHAPES.SCREEN + smoothstep(0.45, 0.95, t) : SHAPES.SCREEN;
    } else if (i === LAST - 1) {
      // Into the portal and out the other side.
      apply(a);
      if (t < 0.5) {
        const k = ease(t / 0.5);
        target.camera.lerpVectors(a.cam, frames.portalFront.cam, k);
        target.look.lerpVectors(a.look, frames.portalFront.look, k);
      } else {
        const k = ease((t - 0.5) / 0.5);
        target.camera.lerpVectors(frames.portalFront.cam, b.cam, k);
        target.look.lerpVectors(frames.portalFront.look, b.look, k);
      }
      target.morph = SHAPES.NETWORK + 2 * smoothstep(0.05, 0.9, t);
      target.scatter = lerp(0.65, 1.4, Math.sin(Math.PI * t));
    } else {
      blend(a, b, e);
      // Travel between career stops on a gentle arc.
      if (i >= STOP.experience) target.camera.y += Math.sin(Math.PI * t) * 0.6;
    }

    // Logos spin a full turn on each change; nothing else spins.
    const m = target.morph;
    target.spin = 2 * Math.PI * Math.min(Math.max(m - SHAPES.FIRST_SKILL, 0), skills.length - 1);

    // Career lines draw in as the network forms, and fade at the portal.
    if (g >= STOP.stacks) {
      const form = i === STOP.stacks ? e : 1;
      const leave = i === LAST - 1 ? 1 - smoothstep(0, 0.4, t) : 1;
      target.path.opacity = form * leave;
      target.path.draw = form;
      target.links.opacity = form * leave * 0.5;
      target.links.draw = form;
    }
    return target;
  };

  return {
    target,
    layout,
    update,
    get portrait() { return portrait; },
    get sizes() { return frames; },
  };
}
