import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { MOTION_EVENT, getMotion, setMotion } from './story';

// Mounts the 3D layer behind the page. Three.js and GSAP load as a separate
// chunk after first paint, so the HTML (which holds all of the content) is
// readable immediately. Turning motion off tears everything down.

const Layer = styled.div`
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  display: none;

  html[data-motion='on'] & { display: block; }

  canvas {
    display: block;
    width: 100%;
    height: 100%;
  }
`;

const Loader = styled.div`
  position: fixed;
  left: var(--gutter);
  bottom: 1.25rem;
  z-index: 3;
  display: none;
  align-items: center;
  gap: 0.75rem;
  color: var(--text-tertiary);
  pointer-events: none;
  transition: opacity 0.6s ease;

  html[data-motion='on'] & { display: flex; }
  &[data-done='true'] { opacity: 0; }

  span:last-child {
    position: relative;
    width: 4.5rem;
    height: 1px;
    background: var(--hairline-strong);
    overflow: hidden;
  }
  span:last-child::after {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--cyan);
    transform-origin: left;
    transform: scaleX(var(--loaded, 0));
    transition: transform 0.4s var(--ease-out);
  }
`;

const Experience = () => {
  const layerRef = useRef(null);
  const [loading, setLoading] = useState({ done: 0, total: 0, label: '' });

  useEffect(() => {
    let world = null;
    let choreography = null;
    let canvas = null;
    let generation = 0;

    const stop = () => {
      generation += 1;
      if (world) world.dispose();
      if (choreography) choreography.destroy();
      if (canvas) canvas.remove();
      world = null;
      choreography = null;
      canvas = null;
    };

    const start = async () => {
      if (!getMotion()) return;
      const run = generation;
      let modules;
      try {
        modules = await Promise.all([import('./engine/World'), import('./choreography')]);
      } catch (err) {
        // Offline or a failed chunk: keep the content, drop the staging.
        setMotion(false, { persist: false });
        return;
      }
      if (run !== generation || !getMotion()) return;
      const [{ createWorld }, { createChoreography }] = modules;

      // A fresh canvas each time: a disposed WebGL context cannot be reused.
      canvas = document.createElement('canvas');
      canvas.setAttribute('aria-hidden', 'true');
      layerRef.current.appendChild(canvas);
      choreography = createChoreography();
      try {
        world = createWorld({
          canvas,
          cover: document.querySelector('[data-screen-cover]'),
          labels: Array.from(document.querySelectorAll('[data-stack-label]')),
          onProgress: (done, total, label) => setLoading({ done, total, label }),
        });
      } catch (err) {
        stop();
        setMotion(false, { persist: false });
      }
    };

    const onMotion = (event) => {
      stop();
      if (event.detail) start();
    };
    const onResize = () => { if (world) world.resize(); };

    start();
    window.addEventListener(MOTION_EVENT, onMotion);
    window.addEventListener('resize', onResize);
    return () => {
      stop();
      window.removeEventListener(MOTION_EVENT, onMotion);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const done = loading.total > 0 && loading.done >= loading.total;

  return (
    <>
      <Layer ref={layerRef} />
      <Loader
        className="mono"
        data-done={done}
        style={{ '--loaded': loading.total ? loading.done / loading.total : 0 }}
        aria-hidden="true"
      >
        <span>
          {loading.total
            ? `${done ? 'Scene ready' : `Loading scene · ${loading.done}/${loading.total}`}`
            : 'Loading scene'}
        </span>
        <span aria-hidden="true" />
      </Loader>
    </>
  );
};

export default Experience;
