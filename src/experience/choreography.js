import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import Lenis from 'lenis';

import { SECTION_EVENT, resetStory, story } from './story';
import {
  LAST, STOPS, at, presence, span,
} from './timeline';

gsap.registerPlugin(ScrollTrigger);

// Scroll for the journey.
//
// Lenis smooths wheel input (touch keeps the platform's own momentum).
// One ScrollTrigger maps the journey chapter to g, a float index into STOPS.
// When scrolling comes to rest between two stops, the snap controller moves
// on to the next stop in the direction of travel: a light scroll goes one
// stop, a hard flick coasts through several and settles on the next one
// ahead, and any new input takes over immediately. Text overlays are driven
// from g with the same presence functions the 3D scene uses.

const easeOut = (t) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

const all = (selector) => Array.from(document.querySelectorAll(selector));

export function createChoreography() {
  const chapter = document.querySelector('[data-journey]');
  const touched = new Set();

  // ── Overlays ───────────────────────────────────────────────────────────
  const stopped = all('[data-stop]').map((el) => ({ el, index: at(el.dataset.stop) })).filter((o) => o.index >= 0);
  const spanned = all('[data-span]').map((el) => {
    const [from, to] = el.dataset.span.split(':').map(at);
    return { el, from, to };
  });
  const markers = all('[data-index-for]').map((el) => ({ el, index: at(el.dataset.indexFor) }));
  [...stopped, ...spanned].forEach(({ el }) => touched.add(el));

  const show = (el, amount, offset) => {
    el.style.opacity = amount.toFixed(3);
    el.style.visibility = amount < 0.01 ? 'hidden' : 'visible';
    el.style.pointerEvents = amount > 0.5 ? 'auto' : 'none';
    el.style.transform = offset ? `translate3d(0, ${offset.toFixed(1)}px, 0)` : '';
  };

  let nearest = -1;
  let section = null;
  const apply = (g) => {
    stopped.forEach(({ el, index }) => {
      const amount = presence(g, index);
      // Content drifts up as the scroll carries it past.
      show(el, amount, Math.max(-1, Math.min(1, index - g)) * 48 * (1 - amount));
    });
    spanned.forEach(({ el, from, to }) => show(el, span(g, from, to), 0));

    const n = Math.round(g);
    if (n !== nearest) {
      nearest = n;
      markers.forEach(({ el, index }) => {
        if (index === n) el.setAttribute('aria-current', 'step');
        else el.removeAttribute('aria-current');
      });
      let current = null;
      for (let i = 0; i <= n && i <= LAST; i += 1) if (STOPS[i].nav) current = STOPS[i].anchor;
      if (current !== section) {
        section = current;
        window.dispatchEvent(new CustomEvent(SECTION_EVENT, { detail: current }));
      }
    }
  };

  // ── Scroll ─────────────────────────────────────────────────────────────
  const lenis = new Lenis({
    lerp: 0.11,
    smoothWheel: true,
    wheelMultiplier: 0.9,
    syncTouch: false,
    autoRaf: false,
  });
  const raf = (time) => lenis.raf(time * 1000);
  gsap.ticker.add(raf);
  gsap.ticker.lagSmoothing(0);

  const trigger = ScrollTrigger.create({
    trigger: chapter,
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: (self) => {
      story.g = self.progress * LAST;
      apply(story.g);
    },
    onRefresh: (self) => {
      story.g = self.progress * LAST;
      apply(story.g);
    },
  });

  const yOf = (index) => trigger.start + (index / LAST) * (trigger.end - trigger.start);
  const rawG = () => ((window.scrollY - trigger.start) / Math.max(1, trigger.end - trigger.start)) * LAST;

  // ── Snapping ───────────────────────────────────────────────────────────
  let snapping = false;
  let touching = false;
  let direction = 1;
  let lastY = window.scrollY;
  let lastInput = 0;
  let timer = 0;

  const goTo = (index, { duration, immediate = false } = {}) => {
    const target = Math.max(0, Math.min(LAST, index));
    const distance = Math.abs(target - rawG());
    snapping = !immediate;
    lenis.scrollTo(yOf(target), {
      immediate,
      duration: duration || Math.min(1.6, 0.55 + distance * 0.28),
      easing: distance > 1.5 ? easeInOut : easeOut,
      force: true,
      onComplete: () => { snapping = false; },
    });
  };

  const settle = () => {
    timer = 0;
    if (snapping || touching) return;
    const g = rawG();
    // Before the journey or past its end (the footer) scrolling is free.
    if (g < -0.01 || g > LAST + 0.01) return;
    const n = Math.round(g);
    if (Math.abs(g - n) < 0.01) return;
    goTo(direction > 0 ? Math.ceil(g) : Math.floor(g));
  };

  const onScroll = () => {
    const y = window.scrollY;
    if (y !== lastY) direction = y > lastY ? 1 : -1;
    lastY = y;
    story.velocity = (lenis.velocity * 60) / window.innerHeight;
    ScrollTrigger.update();
    if (snapping || touching) return;
    window.clearTimeout(timer);
    // Settle as soon as the wheel has gone quiet and the glide has slowed;
    // otherwise once scroll events stop arriving (touch momentum).
    const quiet = performance.now() - lastInput > 140;
    if (quiet && Math.abs(lenis.velocity) < 4) settle();
    else timer = window.setTimeout(settle, 140);
  };
  lenis.on('scroll', onScroll);

  const onInput = () => {
    lastInput = performance.now();
    snapping = false;
  };
  const onTouchStart = () => {
    touching = true;
    onInput();
  };
  const onTouchEnd = () => {
    touching = false;
    window.clearTimeout(timer);
    timer = window.setTimeout(settle, 160);
  };
  window.addEventListener('wheel', onInput, { passive: true });
  window.addEventListener('touchstart', onTouchStart, { passive: true });
  window.addEventListener('touchend', onTouchEnd, { passive: true });
  window.addEventListener('touchcancel', onTouchEnd, { passive: true });

  // Keyboard: step stop to stop while inside the journey.
  const onKey = (event) => {
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
    const tag = event.target.tagName;
    if (['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON', 'A'].includes(tag) && event.key === ' ') return;
    const g = rawG();
    if (g < -0.01 || g > LAST + 0.01) return;
    const forward = ['ArrowDown', 'PageDown'].includes(event.key) || (event.key === ' ' && !event.shiftKey);
    const back = ['ArrowUp', 'PageUp'].includes(event.key) || (event.key === ' ' && event.shiftKey);
    if (!forward && !back) return;
    const next = forward ? Math.floor(g + 0.01) + 1 : Math.ceil(g - 0.01) - 1;
    if (next > LAST || next < 0) return;
    event.preventDefault();
    onInput();
    direction = forward ? 1 : -1;
    goTo(next);
  };
  window.addEventListener('keydown', onKey);

  // In-page links land exactly on their stop.
  const stopFor = (id) => STOPS.findIndex((s) => s.anchor === id || s.id === id);
  const onClick = (event) => {
    const link = event.target.closest('a[href^="#"]');
    if (!link) return;
    const index = stopFor(link.getAttribute('href').slice(1));
    if (index < 0) return;
    event.preventDefault();
    onInput();
    goTo(index);
  };
  document.addEventListener('click', onClick);
  story.goTo = (id) => {
    const index = stopFor(id);
    if (index >= 0) goTo(index);
  };

  // Keyboard users can tab into content that is faded out; bring its stop in.
  const onFocusIn = (event) => {
    const host = event.target.closest('[data-stop], [data-focus-stop]');
    if (!host || Number(host.style.opacity || 1) > 0.95) return;
    goTo(at(host.dataset.stop || host.dataset.focusStop), { duration: 0.6 });
  };
  document.addEventListener('focusin', onFocusIn);

  // Pointer parallax, on devices with a fine pointer.
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const onPointer = (event) => {
    story.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    story.pointer.y = -((event.clientY / window.innerHeight) * 2 - 1);
  };
  if (fine) window.addEventListener('pointermove', onPointer, { passive: true });

  ScrollTrigger.config({ ignoreMobileResize: true });
  ScrollTrigger.refresh();

  // Arriving with a hash: start at that stop.
  const initial = stopFor(window.location.hash.slice(1));
  if (initial >= 0) goTo(initial, { immediate: true });

  return {
    refresh: () => ScrollTrigger.refresh(),
    destroy() {
      window.clearTimeout(timer);
      trigger.kill();
      lenis.destroy();
      gsap.ticker.remove(raf);
      window.removeEventListener('wheel', onInput);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('touchcancel', onTouchEnd);
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('click', onClick);
      document.removeEventListener('focusin', onFocusIn);
      window.removeEventListener('pointermove', onPointer);
      touched.forEach((el) => {
        ['opacity', 'transform', 'visibility', 'pointer-events'].forEach((prop) => el.style.removeProperty(prop));
      });
      markers.forEach(({ el }) => el.removeAttribute('aria-current'));
      window.dispatchEvent(new CustomEvent(SECTION_EVENT, { detail: undefined }));
      resetStory();
    },
  };
}
