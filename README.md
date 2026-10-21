# Willy Wario — portfolio

A scroll-driven 3D journey: intro → into the laptop → projects → skills →
career → contact. Built on Next.js 10, React 17 and styled-components, with
Three.js and GSAP ScrollTrigger loaded as a separate chunk after first paint.

```bash
yarn install
yarn dev     # http://localhost:3000
yarn build && yarn start
```

## How it fits together

- **Content** lives in `src/constants/constants.js`. Every section renders it as
  real HTML, so it is readable, linkable and accessible with or without 3D.
- **Stops** (`src/experience/timeline.js`) are the spine: one ordered list of
  moments where a scene is fully formed and its text is on screen (intro,
  closed laptop, open laptop, project index, each project, the stack, each
  technology, other stacks, experience, education, work experience, each
  role, contact). Scroll maps to `g`, a float index into that list; the 3D
  director, the overlays, snapping and navigation all read it.
- **Layout**: one tall `Track` with a sticky `Stage`; each section is a `Layer`
  whose overlays carry `data-stop` (or `data-span` for chrome across stops).
- **Choreography** (`src/experience/choreography.js`): Lenis smooths wheel
  input, one ScrollTrigger maps the track to `g`, and a snap controller
  settles on the next stop in the direction of travel. Keyboard arrows and
  Page keys step between stops; in-page links land exactly on theirs.
- **Engine** (`src/experience/engine/*`): `World` (renderer, loop, quality
  tiers, loading), `Director` (a pose per stop, blended between stops),
  `Laptop` (procedural, hinged lid), `Plates` (crisp project screenshots),
  `Particles` (GPU morph between shapes), `shapes` (screen grid, projects,
  mosaic, logos, other-stacks constellation, career network, portal, halo),
  `Atmosphere`, `springs` (inertia and overshoot) and `homography` (maps the
  HTML project index onto the 3D display).
- **Motion off**: the header toggle, `prefers-reduced-motion` or missing WebGL
  switch `html[data-motion]` to `off`. The canvas and smooth scrolling are torn
  down and the same content renders as a static page.

## Assets and credits

- **Laptop** — modelled procedurally in `Laptop.js`; no external model.
- **Technology logos** — SVG path data from [Simple Icons](https://simpleicons.org)
  v13.21.0, CC0 1.0 (`src/experience/data/logoPaths.js`). The marks are
  trademarks of their owners and are used only to identify technologies.
- **Smooth scrolling** — [Lenis](https://github.com/darkroomengineering/lenis) (MIT).
- **C# and SQL** — drawn as typographic marks; Simple Icons has no official
  single-colour mark for them.
- **Reflections** — Three.js `RoomEnvironment` (MIT), generated at runtime.
- **Fonts** — Inter, JetBrains Mono and Instrument Serif via Google Fonts (SIL OFL).
- **Project screenshots** — the projects' own interfaces, in `public/images`.
