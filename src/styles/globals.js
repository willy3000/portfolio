import { createGlobalStyle } from 'styled-components';
import { normalize } from 'styled-normalize';

const light = `
  --bg: #fbfbfd;
  --bg-raised: #ffffff;
  --surface: #f2f2f5;
  --surface-strong: #e7e7ec;
  --fill: rgba(0, 0, 0, 0.05);
  --fill-strong: rgba(0, 0, 0, 0.09);
  --text: #1d1d1f;
  --text-secondary: #5e5e66;
  --text-tertiary: #8a8a91;
  --hairline: rgba(0, 0, 0, 0.08);
  --hairline-strong: rgba(0, 0, 0, 0.14);
  --accent: #0a66d8;
  --accent-hover: #0858bd;
  --accent-text: #ffffff;
  --link: #0a66d8;
  --accent-soft: rgba(10, 102, 216, 0.1);
  --positive: #1a9a52;
  --material: rgba(251, 251, 253, 0.72);
  --material-heavy: rgba(255, 255, 255, 0.84);
  --material-edge: rgba(255, 255, 255, 0.7);
  --shadow-card: 0 1px 2px rgba(0, 0, 0, 0.04), 0 10px 30px rgba(0, 0, 0, 0.05);
  --shadow-float: 0 2px 8px rgba(0, 0, 0, 0.06), 0 30px 70px rgba(0, 0, 0, 0.14);
  --glow: rgba(10, 102, 216, 0.1);
  --grid-dot: rgba(0, 0, 0, 0.09);
  --sheen: rgba(255, 255, 255, 0.35);
`;

const dark = `
  --bg: #08080a;
  --bg-raised: #121215;
  --surface: #121215;
  --surface-strong: #1f1f23;
  --fill: rgba(255, 255, 255, 0.07);
  --fill-strong: rgba(255, 255, 255, 0.12);
  --text: #f5f5f7;
  --text-secondary: #a3a3aa;
  --text-tertiary: #6f6f77;
  --hairline: rgba(255, 255, 255, 0.08);
  --hairline-strong: rgba(255, 255, 255, 0.15);
  --accent: #0b6ee6;
  --accent-hover: #1f7ff2;
  --accent-text: #ffffff;
  --link: #5ea3ff;
  --accent-soft: rgba(94, 163, 255, 0.16);
  --positive: #34c46e;
  --material: rgba(16, 16, 19, 0.7);
  --material-heavy: rgba(22, 22, 26, 0.82);
  --material-edge: rgba(255, 255, 255, 0.08);
  --shadow-card: 0 1px 2px rgba(0, 0, 0, 0.5), 0 12px 32px rgba(0, 0, 0, 0.35);
  --shadow-float: 0 2px 8px rgba(0, 0, 0, 0.5), 0 40px 90px rgba(0, 0, 0, 0.6);
  --glow: rgba(46, 128, 255, 0.16);
  --grid-dot: rgba(255, 255, 255, 0.075);
  --sheen: rgba(255, 255, 255, 0.12);
`;

const GlobalStyles = createGlobalStyle`
  ${normalize};

  :root {
    ${light}
    color-scheme: light;
    --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
    --font: ${(props) => props.theme.fonts.main};
    --gutter: clamp(1.25rem, 4vw, 2.5rem);
    --nav-height: 3.5rem;
  }

  @media (prefers-color-scheme: dark) {
    :root:not([data-theme='light']) { ${dark} color-scheme: dark; }
  }
  :root[data-theme='dark'] { ${dark} color-scheme: dark; }

  @media (prefers-contrast: more) {
    :root, :root[data-theme] {
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

  /* Eases the brightness change when the theme is toggled. */
  html.theme-transition,
  html.theme-transition *,
  html.theme-transition *::before,
  html.theme-transition *::after {
    transition: background-color 0.4s ease, border-color 0.4s ease, color 0.4s ease,
      fill 0.4s ease, box-shadow 0.4s ease !important;
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
`;

export default GlobalStyles;
