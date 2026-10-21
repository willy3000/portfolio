import { createGlobalStyle } from 'styled-components';
import { normalize } from 'styled-normalize';

// One art-directed palette: the experience is staged in a dark, lit space, so
// there is no light theme. Token names are shared by every component.
const palette = `
  --bg: #05070b;
  --bg-raised: #0b0f16;
  --surface: #0d121b;
  --surface-strong: #151c28;
  --fill: rgba(170, 200, 255, 0.07);
  --fill-strong: rgba(170, 200, 255, 0.13);
  --text: #e9edf5;
  --text-secondary: #a1aabb;
  --text-tertiary: #7d8699;
  --hairline: rgba(170, 200, 255, 0.1);
  --hairline-strong: rgba(170, 200, 255, 0.2);
  --accent: #2f8cff;
  --accent-hover: #4a9bff;
  --accent-text: #ffffff;
  --link: #7cd4ff;
  --cyan: #5cd0ff;
  --violet: #9a8bff;
  --accent-soft: rgba(92, 208, 255, 0.14);
  --positive: #3ddc84;
  --material: rgba(7, 10, 16, 0.66);
  --material-heavy: rgba(11, 15, 22, 0.88);
  --material-edge: rgba(170, 200, 255, 0.1);
  --shadow-card: 0 1px 2px rgba(0, 0, 0, 0.5), 0 12px 32px rgba(0, 0, 0, 0.35);
  --shadow-float: 0 2px 8px rgba(0, 0, 0, 0.5), 0 40px 90px rgba(0, 0, 0, 0.6);
  --glow: rgba(92, 208, 255, 0.14);
  --grid-dot: rgba(170, 200, 255, 0.07);
  --sheen: rgba(255, 255, 255, 0.1);
`;

const GlobalStyles = createGlobalStyle`
  ${normalize};

  :root {
    ${palette}
    color-scheme: dark;
    --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
    --font: ${(props) => props.theme.fonts.main};
    --font-mono: ${(props) => props.theme.fonts.mono};
    --font-serif: ${(props) => props.theme.fonts.serif};
    --gutter: clamp(1.25rem, 4vw, 2.5rem);
    --nav-height: 3.5rem;
  }

  @media (prefers-contrast: more) {
    :root {
      --text-secondary: var(--text);
      --hairline: var(--hairline-strong);
    }
  }

  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    -webkit-text-size-adjust: 100%;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    scroll-padding-top: calc(var(--nav-height) + 1.5rem);
  }

  @media (prefers-reduced-motion: no-preference) {
    html { scroll-behavior: smooth; }
  }

  body {
    font-family: var(--font);
    font-size: 1rem;
    line-height: 1.6;
    letter-spacing: -0.011em;
    font-optical-sizing: auto;
    background: var(--bg);
    color: var(--text);
    overflow-x: hidden;
  }

  h1, h2, h3, h4 {
    font-weight: 600;
    text-wrap: balance;
  }

  p { text-wrap: pretty; }

  a {
    color: inherit;
    text-decoration: none;
    -webkit-tap-highlight-color: transparent;
  }

  button {
    font: inherit;
    color: inherit;
    background: none;
    border: 0;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
  }

  ul, ol { list-style: none; }

  img, svg { display: block; max-width: 100%; }

  ::selection { background: var(--accent-soft); }

  :focus-visible {
    outline: 2px solid var(--link);
    outline-offset: 3px;
    border-radius: 6px;
  }

  /* Scroll reveals, applied by the Reveal component once it has mounted. */
  [data-reveal='hidden'] {
    opacity: 0;
    transform: translate3d(0, 1.5rem, 0);
  }
  [data-reveal='shown'] {
    transition: opacity 0.9s var(--ease-out) var(--reveal-delay, 0ms),
      transform 0.9s var(--ease-out) var(--reveal-delay, 0ms);
  }

  @keyframes rise {
    from { opacity: 0; transform: translate3d(0, 1rem, 0); filter: blur(6px); }
    to { opacity: 1; transform: none; filter: blur(0); }
  }

  @media (prefers-reduced-motion: reduce) {
    [data-reveal='hidden'] { transform: none; }
    [data-reveal='shown'] { transition: opacity 0.3s ease; }
    @keyframes rise {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  }

  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
  }

  .skip-link {
    position: fixed;
    top: 0.75rem;
    left: 0.75rem;
    z-index: 100;
    padding: 0.625rem 1rem;
    border-radius: 999px;
    background: var(--accent);
    color: var(--accent-text);
    font-weight: 600;
    transform: translateY(-200%);
  }
  .skip-link:focus-visible { transform: none; }

  /* Journey overlays start hidden and are revealed at their stop; the
     opening copy is visible from the first paint. */
  html[data-motion='on'] [data-stop]:not([data-stop='hero']),
  html[data-motion='on'] [data-span] {
    opacity: 0;
    visibility: hidden;
  }

  /* Lenis smooth scrolling. */
  html.lenis, html.lenis body { height: auto; }
  .lenis.lenis-smooth { scroll-behavior: auto !important; }
  .lenis.lenis-stopped { overflow: hidden; }

  .mono {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
`;

export default GlobalStyles;
