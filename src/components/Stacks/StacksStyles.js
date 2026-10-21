import styled from 'styled-components';

const motion = "html[data-motion='on'] &";

export const Heading = styled.header`
  max-width: 72rem;
  margin: 0 auto 2.5rem;
  padding-inline: var(--gutter);

  ${motion} {
    position: absolute;
    top: calc(var(--nav-height) + 1.5rem);
    left: 0;
    right: 0;
    z-index: 2;
    max-width: 80rem;
    margin: 0 auto;
  }
  ${motion} h2 { font-size: clamp(1.75rem, 1.1rem + 2.4vw, 3rem); }
  ${motion} p:last-child { margin-top: 0.75rem; font-size: 1rem; }

  @media ${(p) => p.theme.breakpoints.md} {
    ${motion} p:last-child { display: none; }
  }
`;

export const List = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
  gap: 0.75rem;
  max-width: 72rem;
  margin-inline: auto;
  padding-inline: var(--gutter);

  ${motion} {
    position: absolute;
    inset: 0;
    display: block;
    max-width: none;
    padding: 0;
  }
`;

export const Item = styled.li`
  display: grid;
  justify-items: start;
  gap: 0.25rem;
  padding: 1.125rem;
  border-radius: 1rem;
  background: var(--surface);
  box-shadow: inset 0 0 0 1px var(--hairline);

  strong {
    margin-top: 0.75rem;
    font-weight: 600;
    letter-spacing: -0.015em;
  }
  .mono {
    color: var(--text-tertiary);
    font-size: 0.625rem;
  }

  /* On stage: just the label, pinned under its particle mark by the engine. */
  ${motion} {
    position: absolute;
    top: 0;
    left: 0;
    justify-items: center;
    gap: 0.125rem;
    padding: 0;
    background: none;
    box-shadow: none;
    white-space: nowrap;
    opacity: 0;
    visibility: hidden;
    will-change: transform, opacity;
  }
  ${motion} strong {
    margin: 0;
    font-size: 0.875rem;
  }
`;

export const Mark = styled.span`
  display: grid;
  place-items: center;
  width: 2rem;
  height: 2rem;
  color: var(--brand);

  svg {
    width: 100%;
    height: 100%;
    fill: currentColor;
  }
  span {
    padding: 0.125rem 0.375rem;
    border: 1.5px solid currentColor;
    border-radius: 0.375rem;
    font-family: var(--font-mono);
    font-size: 0.75rem;
    font-weight: 700;
  }

  html[data-motion='on'] & { display: none; }
`;
