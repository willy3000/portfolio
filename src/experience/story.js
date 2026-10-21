// Shared, mutable scroll state. The choreography writes it; the render loop
// reads it. Nothing here goes through React state, so scrolling never
// re-renders.
export const story = {
  // Position along the journey, as a float index into STOPS.
  g: 0,
  // Scroll velocity in viewport heights per second, signed.
  velocity: 0,
  // Pointer position in normalised device coordinates.
  pointer: { x: 0, y: 0 },
  // Set while the journey is running: go to a stop by anchor id.
  goTo: null,
};

export const resetStory = () => {
  story.g = 0;
  story.velocity = 0;
  story.goTo = null;
};

export const getMotion = () =>
  typeof document !== 'undefined' && document.documentElement.dataset.motion === 'on';

export const MOTION_EVENT = 'motionchange';
// Fired with the nearest stop's anchor section when it changes.
export const SECTION_EVENT = 'journeysection';

export const setMotion = (on, { persist = true } = {}) => {
  document.documentElement.dataset.motion = on ? 'on' : 'off';
  if (persist) {
    try { localStorage.setItem('motion', on ? 'on' : 'off'); } catch (err) { /* storage unavailable */ }
  }
  window.dispatchEvent(new CustomEvent(MOTION_EVENT, { detail: on }));
};
