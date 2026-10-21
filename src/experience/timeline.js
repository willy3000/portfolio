import { experience, projects, skills } from '../constants/constants';

// The whole journey is one list of stops. A stop is a moment where the scene
// is fully formed and its text is on screen; scrolling between two stops is a
// transition. Scroll position maps to g, a float index into this list:
// g = 3 is stop 3, g = 3.5 is halfway to stop 4. The 3D director, the HTML
// overlays, the snapping and the navigation all read the same list, and every
// state is a pure function of g, so scrubbing backwards replays exactly.

export const jobs = [...experience].reverse();

export const STOPS = [
  { id: 'hero', anchor: 'top', nav: 'Intro' },
  { id: 'laptop' },
  { id: 'open' },
  { id: 'index', anchor: 'work', nav: 'Work' },
  ...projects.map((p) => ({ id: `project-${p.id}` })),
  { id: 'stack', anchor: 'skills', nav: 'Skills' },
  ...skills.map((s) => ({ id: `skill-${s.id}` })),
  { id: 'stacks', anchor: 'other-stacks' },
  { id: 'experience', anchor: 'experience', nav: 'Experience' },
  { id: 'education' },
  { id: 'work-intro' },
  ...jobs.map((_, k) => ({ id: `job-${k}` })),
  { id: 'contact', anchor: 'contact', nav: 'Contact' },
];

export const LAST = STOPS.length - 1;
export const at = (id) => STOPS.findIndex((s) => s.id === id);

export const STOP = {
  hero: at('hero'),
  laptop: at('laptop'),
  open: at('open'),
  index: at('index'),
  firstProject: at(`project-${projects[0].id}`),
  stack: at('stack'),
  firstSkill: at(`skill-${skills[0].id}`),
  stacks: at('stacks'),
  experience: at('experience'),
  education: at('education'),
  workIntro: at('work-intro'),
  firstJob: at('job-0'),
  contact: at('contact'),
};

// ── Maths ─────────────────────────────────────────────────────────────────
export const clamp01 = (v) => Math.min(1, Math.max(0, v));
export const lerp = (a, b, t) => a + (b - a) * t;
export const smoothstep = (a, b, v) => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};
// Transitions rest briefly at both ends, so a scene is perfectly still when
// a snap settles on its stop.
export const ease = (t) => smoothstep(0.06, 0.94, t);

// Which transition g is in: from stop i towards stop i + 1, t of the way.
export const segment = (g) => {
  const c = Math.min(Math.max(g, 0), LAST);
  const i = Math.min(Math.floor(c), LAST - 1);
  return { i, t: c - i };
};

// How present the content of a stop is: 1 at the stop, gone by the middle
// of the transition either side.
export const presence = (g, index, reach = 0.42) => 1 - smoothstep(0.12, reach, Math.abs(g - index));

// Presence over a run of stops, for chrome that stays across them.
export const span = (g, from, to, reach = 0.42) => {
  if (g >= from && g <= to) return 1;
  return presence(g, g < from ? from : to, reach);
};
