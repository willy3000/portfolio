import styled from 'styled-components';

const motion = "html[data-motion='on'] &";

export const Intro = styled.header`
  max-width: 72rem;
  margin: 0 auto 3rem;
  padding-inline: var(--gutter);

  ${motion} {
    position: absolute;
    inset: 0;
    z-index: 2;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    max-width: 80rem;
    margin: 0 auto;
  }
  ${motion} > * { max-width: 34rem; }

  @media ${(p) => p.theme.breakpoints.md} {
    ${motion} {
      justify-content: flex-end;
      padding-bottom: 2.5rem;
    }
  }
`;

export const Legend = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1.5rem;
`;

export const ResumeLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  margin-top: 1.5rem;
  color: var(--link);
  font-weight: 600;

  svg { width: 1rem; height: 1rem; }
  &:hover { text-decoration: underline; text-underline-offset: 0.2em; }
`;

const panel = `
  padding: clamp(1.25rem, 3vw, 2rem);
  border-radius: 1.25rem;
  background: var(--surface);
  box-shadow: inset 0 0 0 1px var(--hairline);
`;

export const Stop = styled.article`
  max-width: 72rem;
  margin: 0 auto 1rem;
  ${panel}

  ${motion} {
    position: absolute;
    top: 50%;
    width: min(30rem, 42vw);
    margin: -9rem 0 0;
    background: rgba(7, 10, 16, 0.66);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  }

  /* Side by attribute: prop styles inside a parent selector would apply to
     every instance in styled-components 5. */
  ${motion}[data-side='left'] { left: var(--gutter); }
  ${motion}[data-side='right'] { right: var(--gutter); }

  > .mono {
    margin-top: 1rem;
    color: var(--text-tertiary);
  }
  h3 {
    margin-top: 0.5rem;
    font-size: clamp(1.625rem, 1.1rem + 1.6vw, 2.5rem);
    font-weight: 500;
    line-height: 1.05;
    letter-spacing: -0.04em;
  }
  > p:not(.mono) {
    margin-top: 0.5rem;
    color: var(--text-secondary);
  }
  > p strong { color: var(--text); font-weight: 600; }
  > span:first-child + h3 { margin-top: 1rem; }

  @media ${(p) => p.theme.breakpoints.md} {
    ${motion} {
      top: auto;
      bottom: 4.5rem;
      left: var(--gutter);
      right: var(--gutter);
      width: auto;
      max-height: 56svh;
      margin-top: 0;
      overflow-y: auto;
      overscroll-behavior: contain;
      background: rgba(7, 10, 16, 0.84);
    }
  }
`;

export const Period = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

export const Highlights = styled.ul`
  margin-top: 1.25rem;
  padding-top: 1.25rem;
  border-top: 1px solid var(--hairline);

  li {
    position: relative;
    padding-left: 1.25rem;
    color: var(--text-secondary);
    font-size: 0.9375rem;
    line-height: 1.55;
  }
  li + li { margin-top: 0.625rem; }
  li::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0.7em;
    width: 0.5rem;
    height: 1px;
    background: var(--cyan);
  }

  @media ${(p) => p.theme.breakpoints.md} {
    li { font-size: 0.875rem; }
  }
`;

export const School = styled.p`
  display: grid;
  gap: 0.125rem;
  margin-top: 1.25rem;
  padding-top: 1.25rem;
  border-top: 1px solid var(--hairline);

  strong { font-weight: 600; }
  span { color: var(--text-secondary); }
  .mono { color: var(--text-tertiary); }
`;

// The turn from education into work: a clear title card listing the roles.
export const WorkIntro = styled.div`
  max-width: 72rem;
  margin: 0 auto 1rem;
  ${panel}

  ${motion} {
    position: absolute;
    top: 50%;
    left: 50%;
    width: min(36rem, calc(100vw - 2 * var(--gutter)));
    margin: -12rem 0 0 calc(min(36rem, calc(100vw - 2 * var(--gutter))) / -2);
    background: rgba(7, 10, 16, 0.7);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
  }

  h3 {
    margin-top: 1rem;
    font-size: clamp(2rem, 1.3rem + 2.4vw, 3.25rem);
    font-weight: 500;
    line-height: 1;
    letter-spacing: -0.045em;
  }
  h3 em {
    font-family: var(--font-serif);
    font-style: italic;
    font-weight: 400;
    color: var(--text-secondary);
  }
  > p {
    margin-top: 0.75rem;
    color: var(--text-secondary);
  }

  @media ${(p) => p.theme.breakpoints.md} {
    ${motion} {
      top: auto;
      bottom: 4.5rem;
      margin-top: 0;
    }
  }
`;

export const Roles = styled.ol`
  margin-top: 1.5rem;
  border-top: 1px solid var(--hairline);

  li {
    display: grid;
    grid-template-columns: 9.5rem minmax(0, 1fr) auto;
    align-items: baseline;
    gap: 1rem;
    padding-block: 0.75rem;
    border-bottom: 1px solid var(--hairline);
  }
  .mono { color: var(--cyan); font-size: 0.6875rem; }
  strong { font-weight: 600; }
  span:last-child { color: var(--text-tertiary); font-size: 0.875rem; }

  @media ${(p) => p.theme.breakpoints.sm} {
    li { grid-template-columns: minmax(0, 1fr); gap: 0.125rem; }
  }
`;

export const Rail = styled.nav`
  display: none;

  ${motion} {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 1.25rem;
    z-index: 3;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.75rem;
  }

  a {
    display: inline-flex;
    align-items: center;
    height: 2rem;
    padding-inline: 0.625rem;
    border-radius: 999px;
    color: var(--text-tertiary);
    font-family: var(--font-mono);
    font-size: 0.6875rem;
    letter-spacing: 0.04em;
    white-space: nowrap;
    transition: color 0.25s ease, background-color 0.25s ease;
  }
  a:hover { color: var(--text); }
  a[aria-current='step'] {
    color: var(--text);
    background: var(--fill);
  }

  @media ${(p) => p.theme.breakpoints.md} {
    ${motion} { gap: 0.25rem; }
    a { padding-inline: 0.375rem; font-size: 0.5625rem; }
  }
`;

export const Group = styled.div`
  display: flex;
  align-items: center;
  gap: 0.125rem;

  > span.mono,
  > a.mono {
    margin-right: 0.25rem;
    color: ${(p) => p.$color};
    font-size: 0.625rem;
    text-transform: uppercase;
  }
  a[aria-current='step'] { box-shadow: inset 0 0 0 1px ${(p) => p.$color}; }
`;

export const Divider = styled.span`
  width: 1.5rem;
  height: 1px;
  background: var(--hairline-strong);
`;
