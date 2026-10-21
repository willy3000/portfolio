import styled from 'styled-components';

const motion = "html[data-motion='on'] &";

export const Intro = styled.header`
  max-width: 72rem;
  margin-inline: auto;
  padding-inline: var(--gutter);
  margin-bottom: 3rem;

  ${motion} {
    position: absolute;
    inset: auto 0 0;
    z-index: 2;
    max-width: none;
    margin: 0;
    padding: 6rem max(var(--gutter), calc((100vw - 80rem) / 2 + var(--gutter))) 3.5rem;
    background: linear-gradient(to top, rgba(5, 7, 11, 0.94) 35%, rgba(5, 7, 11, 0));
  }
`;

export const Panels = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(17rem, 1fr));
  gap: 1rem;
  max-width: 72rem;
  margin-inline: auto;
  padding-inline: var(--gutter);

  ${motion} {
    display: block;
    position: absolute;
    inset: 0;
    max-width: 80rem;
    pointer-events: none;
  }
`;

export const Panel = styled.article`
  padding: 1.5rem;
  border-radius: 1rem;
  background: var(--surface);
  box-shadow: inset 0 0 0 1px var(--hairline);

  ${motion} {
    position: absolute;
    top: 50%;
    left: var(--gutter);
    width: min(26rem, 40vw);
    margin-top: -6rem;
    padding: 0;
    background: none;
    box-shadow: none;
    opacity: 0;
    visibility: hidden;
  }

  > .mono {
    display: flex;
    gap: 0.75rem;
    color: var(--text-tertiary);
  }
  > .mono span { color: var(--brand); }

  h3 {
    margin-top: 0.875rem;
    font-size: clamp(1.75rem, 1rem + 3vw, 3.75rem);
    font-weight: 400;
    line-height: 1;
    letter-spacing: -0.045em;
  }
  ${motion} h3 { text-shadow: 0 0 40px rgba(5, 7, 11, 0.9); }

  > p:not(.mono) {
    margin-top: 1.125rem;
    color: var(--text-secondary);
    font-size: 1.0625rem;
    line-height: 1.6;
  }

  @media ${(p) => p.theme.breakpoints.md} {
    ${motion} {
      top: auto;
      bottom: 5.5rem;
      left: var(--gutter);
      right: var(--gutter);
      width: auto;
      margin-top: 0;
      padding: 1.25rem;
      border-radius: 1rem;
      background: rgba(7, 10, 16, 0.78);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      box-shadow: inset 0 0 0 1px var(--hairline);
    }
    ${motion} h3 { font-size: 1.875rem; }
    ${motion} > p:not(.mono) { font-size: 0.9375rem; }
  }
`;

export const UsedIn = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  margin-top: 1.25rem;

  li {
    padding: 0.25rem 0.5rem;
    border-radius: 0.375rem;
    background: var(--fill);
    color: var(--text-secondary);
    font-size: 0.625rem;
  }
`;

export const Chrome = styled.div`
  display: none;

  ${motion} {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 1.5rem;
    z-index: 3;
    display: flex;
    align-items: center;
    gap: 1rem;
    max-width: 80rem;
    margin-inline: auto;
    padding-inline: var(--gutter);
    opacity: 0;
    visibility: hidden;
  }
`;

export const IndexList = styled.ol`
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;

  a {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    height: 2rem;
    padding-inline: 0.75rem;
    border-radius: 999px;
    color: var(--text-tertiary);
    font-family: var(--font-mono);
    font-size: 0.6875rem;
    letter-spacing: 0.04em;
    transition: color 0.25s ease, background-color 0.25s ease;
  }
  a::before {
    content: '';
    width: 0.375rem;
    height: 0.375rem;
    border-radius: 50%;
    background: currentColor;
    opacity: 0.4;
    transition: background-color 0.25s ease, opacity 0.25s ease;
  }
  a:hover { color: var(--text); }
  a[aria-current='step'] {
    color: var(--text);
    background: var(--fill);
  }
  a[aria-current='step']::before {
    background: var(--brand);
    opacity: 1;
  }

  @media ${(p) => p.theme.breakpoints.md} {
    display: none;
  }
`;

export const Toggle = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  height: 2.25rem;
  margin-left: auto;
  padding-inline: 1rem;
  border-radius: 999px;
  background: var(--fill);
  box-shadow: inset 0 0 0 1px var(--hairline);
  font-size: 0.8125rem;
  font-weight: 600;
  transition: background-color 0.2s ease;

  &:hover { background: var(--fill-strong); }
  svg { width: 0.9375rem; height: 0.9375rem; color: var(--cyan); }

  @media ${(p) => p.theme.breakpoints.md} {
    margin-inline: auto;
  }
`;

export const Toolkit = styled.div`
  max-width: 72rem;
  margin: 3rem auto 0;
  padding-inline: var(--gutter);
  outline: none;

  ${motion} {
    position: absolute;
    inset: calc(var(--nav-height) + 1rem) var(--gutter) 1rem;
    z-index: 6;
    max-width: 52rem;
    margin: 0 auto;
    padding: 0;
    overflow-y: auto;
    border-radius: 1.25rem;
    background: var(--material-heavy);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    box-shadow: var(--shadow-float), inset 0 0 0 1px var(--material-edge);
    pointer-events: auto;
  }
  ${motion}[data-open='false'] { display: none; }
`;

export const ToolkitInner = styled.div`
  position: relative;

  ${motion} { padding: clamp(1.5rem, 4vw, 2.5rem); }

  > h3 {
    margin: 2.5rem 0 1rem;
    color: var(--cyan);
    font-weight: 500;
  }
  > h3:first-of-type { margin-top: 0; }
`;

export const Close = styled.button`
  display: none;

  ${motion} {
    position: absolute;
    top: 1rem;
    right: 1rem;
    display: grid;
    place-items: center;
    width: 2.25rem;
    height: 2.25rem;
    border-radius: 50%;
    background: var(--fill);
  }
  svg { width: 1rem; height: 1rem; }
`;

export const Specs = styled.dl`
  border-top: 1px solid var(--hairline);
`;

export const Spec = styled.div`
  display: grid;
  grid-template-columns: 10rem minmax(0, 1fr);
  gap: 1rem;
  padding-block: 0.875rem;
  border-bottom: 1px solid var(--hairline);

  dt { color: var(--text-tertiary); font-size: 0.9375rem; }
  dd { font-size: 0.9375rem; }

  @media ${(p) => p.theme.breakpoints.sm} {
    grid-template-columns: minmax(0, 1fr);
    gap: 0.25rem;
  }
`;

export const Strengths = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;

  @media ${(p) => p.theme.breakpoints.sm} {
    grid-template-columns: minmax(0, 1fr);
  }
`;

export const Strength = styled.div`
  padding: 1.25rem;
  border-radius: 1rem;
  background: var(--fill);

  svg { width: 1.125rem; height: 1.125rem; color: var(--cyan); }
  h4 {
    margin-top: 0.875rem;
    font-size: 1rem;
    font-weight: 600;
    letter-spacing: -0.015em;
  }
  p {
    margin-top: 0.375rem;
    color: var(--text-secondary);
    font-size: 0.9375rem;
    line-height: 1.55;
  }
`;
