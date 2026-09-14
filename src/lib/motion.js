import { useEffect, useRef } from 'react';

const STEP = 1 / 240;
const PRECISION = 0.001;

// Response (seconds) and damping ratio are the designer-facing spring
// parameters. Damping 1 is critically damped: no overshoot.
const configure = (spring, { response = 0.4, dampingRatio = 1 } = {}) => {
  spring.stiffness = Math.pow((2 * Math.PI) / response, 2);
  spring.damping = (4 * Math.PI * dampingRatio) / response;
};

/**
 * A group of independent 1D springs stepped on one animation frame.
 * Retargeting keeps the current value and velocity, so every animation is
 * interruptible and never jumps.
 */
export function createSprings(initial, onFrame, config) {
  const keys = Object.keys(initial);
  const springs = {};
  const values = { ...initial };
  let frame = 0;
  let last = 0;
  let accumulator = 0;

  keys.forEach((key) => {
    springs[key] = { value: initial[key], velocity: 0, target: initial[key] };
    configure(springs[key], config);
  });

  const tick = (now) => {
    accumulator += Math.min((now - last) / 1000, 1 / 20);
    last = now;

    while (accumulator >= STEP) {
      accumulator -= STEP;
      keys.forEach((key) => {
        const s = springs[key];
        const force = -s.stiffness * (s.value - s.target) - s.damping * s.velocity;
        s.velocity += force * STEP;
        s.value += s.velocity * STEP;
      });
    }

    let moving = false;
    keys.forEach((key) => {
      const s = springs[key];
      if (Math.abs(s.velocity) < PRECISION && Math.abs(s.value - s.target) < PRECISION) {
        s.value = s.target;
        s.velocity = 0;
      } else {
        moving = true;
      }
      values[key] = s.value;
    });

    onFrame(values);
    frame = moving ? requestAnimationFrame(tick) : 0;
  };

  return {
    values,
    to(targets, options = {}) {
      Object.keys(targets).forEach((key) => {
        const s = springs[key];
        s.target = targets[key];
        if (options.velocity && options.velocity[key] != null) s.velocity = options.velocity[key];
        if (options.response || options.dampingRatio) configure(s, { ...config, ...options });
      });
      if (!frame) {
        last = performance.now();
        accumulator = 0;
        frame = requestAnimationFrame(tick);
      }
    },
    set(targets) {
      Object.keys(targets).forEach((key) => {
        const s = springs[key];
        s.value = s.target = values[key] = targets[key];
        s.velocity = 0;
      });
      onFrame(values);
    },
    stop() {
      cancelAnimationFrame(frame);
      frame = 0;
    },
  };
}

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const canHover = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches;

/**
 * Pointer-driven lift and tilt. X and Y rotate on separate springs, and
 * leaving the surface springs back from wherever it currently is.
 */
export function useTilt(surfaceRef, targetRef, { maxTilt = 2.5, lift = 10 } = {}) {
  useEffect(() => {
    const surface = surfaceRef.current;
    const target = targetRef.current;
    if (!surface || !target || !canHover() || prefersReducedMotion()) return undefined;

    let pointer = { x: 0.5, y: 0.5 };
    const springs = createSprings(
      { rx: 0, ry: 0, y: 0, glow: 0 },
      (v) => {
        target.style.transform = `perspective(1400px) translate3d(0, ${v.y}px, 0) rotateX(${v.rx}deg) rotateY(${v.ry}deg)`;
        target.style.setProperty('--sheen-x', `${pointer.x * 100}%`);
        target.style.setProperty('--sheen-y', `${pointer.y * 100}%`);
        target.style.setProperty('--sheen-o', v.glow);
      },
      { response: 0.5, dampingRatio: 1 }
    );

    const onMove = (event) => {
      const rect = surface.getBoundingClientRect();
      pointer = {
        x: (event.clientX - rect.left) / rect.width,
        y: (event.clientY - rect.top) / rect.height,
      };
      springs.to({
        rx: (0.5 - pointer.y) * maxTilt,
        ry: (pointer.x - 0.5) * maxTilt * 1.4,
        y: -lift,
        glow: 1,
      });
    };
    const onLeave = () => springs.to({ rx: 0, ry: 0, y: 0, glow: 0 });

    target.style.willChange = 'transform';
    surface.addEventListener('pointermove', onMove);
    surface.addEventListener('pointerleave', onLeave);
    return () => {
      springs.stop();
      surface.removeEventListener('pointermove', onMove);
      surface.removeEventListener('pointerleave', onLeave);
    };
  }, [surfaceRef, targetRef, maxTilt, lift]);
}

/**
 * Maps scroll position 1:1 to a 0–1 progress value as the element travels
 * from the bottom of the viewport to `endAt` (fraction of viewport height).
 */
export function useScrollProgress(ref, onProgress, { endAt = 0.4, enabled = true } = {}) {
  const callback = useRef(onProgress);
  callback.current = onProgress;

  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled || prefersReducedMotion()) return undefined;

    let frame = 0;
    const update = () => {
      frame = 0;
      const { top } = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const progress = (vh - top) / (vh - vh * endAt);
      callback.current(Math.min(1, Math.max(0, progress)));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [ref, endAt, enabled]);
}
