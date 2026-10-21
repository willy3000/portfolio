import styled from 'styled-components';

// Shared look of the "display": the cover and the showcase behind it.
export const screenSurface = `
  background-color: #0a0f17;
  background-image:
    radial-gradient(120% 80% at 50% 0%, rgba(92, 208, 255, 0.07), transparent 60%),
    linear-gradient(rgba(170, 200, 255, 0.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(170, 200, 255, 0.035) 1px, transparent 1px);
  background-size: 100% 100%, 48px 48px, 48px 48px;
`;

export const Caption = styled.p`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 5%;
  z-index: 1;
  display: none;
  justify-content: center;
  gap: 0.75rem;
  color: var(--text-secondary);

  html[data-motion='on'] & { display: flex; }

  span { color: var(--cyan); }
`;

export const Cover = styled.div`
  position: relative;
  ${screenSurface}

  html[data-motion='on'] & {
    position: absolute;
    inset: 0;
    z-index: 2;
    transform-origin: 0 0;
    will-change: transform, opacity;
    backface-visibility: hidden;
    visibility: hidden;
    opacity: 0;
    pointer-events: none;
  }
`;

export const Window = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100%;
`;

export const WindowBar = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  height: 2.5rem;
  padding-inline: var(--gutter);
  border-bottom: 1px solid var(--hairline);
  color: var(--text-tertiary);
  font-size: 0.6875rem;

  i {
    display: flex;
    gap: 0.375rem;
  }
  b {
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 50%;
    background: var(--fill-strong);
  }
  span:last-child { margin-left: auto; }

  html[data-motion='on'] & {
    margin-top: var(--nav-height);
  }
`;

export const Inner = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  max-width: 72rem;
  margin-inline: auto;
  padding: clamp(2.5rem, 6vh, 4.5rem) var(--gutter);

  > .mono {
    margin-bottom: 1.25rem;
    color: var(--cyan);
  }
`;

export const Index = styled.ol`
  margin-top: clamp(2rem, 5vh, 3.5rem);
  border-top: 1px solid var(--hairline);

  a {
    display: grid;
    grid-template-columns: 3rem minmax(0, 1fr) auto 1.25rem;
    align-items: baseline;
    gap: 1rem;
    padding: clamp(0.75rem, 2vh, 1.125rem) 0.25rem;
    border-bottom: 1px solid var(--hairline);
    transition: background-color 0.25s ease, padding 0.35s var(--ease-out);
  }
  a:hover {
    padding-left: 0.75rem;
    background: var(--fill);
  }
  .mono { color: var(--text-tertiary); }
  strong {
    font-size: clamp(1.125rem, 0.95rem + 0.7vw, 1.5rem);
    font-weight: 500;
    letter-spacing: -0.025em;
  }
  span:not(.mono) {
    color: var(--text-secondary);
    font-size: 0.9375rem;
  }
  svg { color: var(--cyan); align-self: center; }

  @media ${(p) => p.theme.breakpoints.sm} {
    a { grid-template-columns: 2.25rem minmax(0, 1fr) 1.25rem; }
    span:not(.mono) { display: none; }
  }
`;

export const Hint = styled.p`
  display: none;
  margin-top: 2rem;
  color: var(--text-tertiary);
  font-size: 0.6875rem;

  html[data-motion='on'] & { display: block; }
`;
