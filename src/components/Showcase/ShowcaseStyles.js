import styled from 'styled-components';

const motion = "html[data-motion='on'] &";

export const TabsBar = styled.nav`
  display: none;

  ${motion} {
    position: absolute;
    top: calc(var(--nav-height) + 0.75rem);
    left: 0;
    right: 0;
    z-index: 3;
    display: block;
  }
`;

export const Tabs = styled.ul`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  max-width: 80rem;
  height: 2.75rem;
  margin-inline: auto;
  padding-inline: var(--gutter);
  overflow-x: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar { display: none; }

  > .mono {
    margin-right: 1rem;
    color: var(--text-tertiary);
    font-size: 0.6875rem;
  }
`;

export const Tab = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  height: 2rem;
  padding-inline: 0.75rem;
  border-radius: 0.5rem;
  color: var(--text-secondary);
  font-size: 0.8125rem;
  font-weight: 500;
  white-space: nowrap;
  transition: background-color 0.2s ease, color 0.2s ease;

  .mono {
    font-size: 0.6875rem;
    color: var(--text-tertiary);
  }

  &:hover { color: var(--text); }
  &[aria-current='step'] {
    background: var(--fill);
    color: var(--text);
  }
  &[aria-current='step'] .mono { color: var(--cyan); }
`;

// A project's text. Off stage it sits beside its screenshot; on stage it
// floats opposite the 3D plate, or as a sheet under it on narrow screens.
export const Panel = styled.article`
  display: grid;
  grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr);
  grid-template-areas: ${({ $side }) => ($side === 'left' ? "'body media'" : "'media body'")};
  align-items: center;
  gap: clamp(2rem, 5vw, 4.5rem);
  max-width: 80rem;
  margin-inline: auto;
  padding: clamp(2.5rem, 6vh, 4.5rem) var(--gutter);

  & + & { border-top: 1px solid var(--hairline); }

  @media ${(p) => p.theme.breakpoints.md} {
    grid-template-columns: minmax(0, 1fr);
    grid-template-areas: 'media' 'body';
  }

  ${motion} {
    position: absolute;
    top: calc(var(--nav-height) + 4.5rem);
    bottom: 2rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: min(29rem, 38vw);
    padding: 0;
    border: 0;
  }
  /* Side by attribute: prop styles inside a parent selector would apply to
     every instance in styled-components 5. */
  ${motion}[data-side='left'] { left: var(--gutter); }
  ${motion}[data-side='right'] { right: var(--gutter); }

  @media ${(p) => p.theme.breakpoints.md} {
    ${motion} {
      top: auto;
      bottom: 1rem;
      left: var(--gutter);
      right: var(--gutter);
      display: block;
      width: auto;
      max-height: 50svh;
      padding: 1.25rem;
      overflow-y: auto;
      overscroll-behavior: contain;
      border-radius: 1rem;
      background: rgba(7, 10, 16, 0.84);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      box-shadow: inset 0 0 0 1px var(--hairline);
    }
  }
`;

export const Body = styled.div`
  position: relative;
  grid-area: body;
`;

export const Meta = styled.p`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.375rem 1rem;
  margin-bottom: 1.25rem;
  color: var(--text-tertiary);
  font-size: 0.6875rem;

  span:first-child { color: var(--cyan); }
`;

export const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.125rem 0.5rem;
  border-radius: 999px;
  background: rgba(61, 220, 132, 0.12);
  color: var(--positive);

  &::before {
    content: '';
    width: 0.375rem;
    height: 0.375rem;
    border-radius: 50%;
    background: currentColor;
  }
`;

export const Title = styled.h3`
  font-size: clamp(2rem, 1.3rem + 2.6vw, 3.5rem);
  font-weight: 500;
  line-height: 1;
  letter-spacing: -0.045em;
`;

export const Summary = styled.p`
  margin-top: 1.25rem;
  font-size: 1.0625rem;
  line-height: 1.6;
  color: var(--text-secondary);
`;

export const Role = styled.p`
  display: flex;
  align-items: baseline;
  gap: 0.875rem;
  margin-top: 1.5rem;
  padding-top: 1.25rem;
  border-top: 1px solid var(--hairline);
  font-weight: 500;

  .mono {
    color: var(--text-tertiary);
    font-size: 0.6875rem;
  }
`;

export const Contributions = styled.ul`
  margin-top: 0.75rem;

  li {
    position: relative;
    padding-left: 1.25rem;
    color: var(--text-secondary);
    font-size: 0.9375rem;
    line-height: 1.55;
  }
  li + li { margin-top: 0.5rem; }
  li::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0.7em;
    width: 0.5rem;
    height: 1px;
    background: var(--cyan);
  }
`;

export const Tags = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  margin-top: 1.5rem;

  li {
    padding: 0.3125rem 0.625rem;
    border: 1px solid var(--hairline);
    border-radius: 0.375rem;
    color: var(--text-secondary);
    font-size: 0.6875rem;
    letter-spacing: 0.04em;
  }
`;

export const Links = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem 1.5rem;
  margin-top: 1.75rem;
`;

export const TextLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  height: 2.5rem;
  padding-inline: 1rem;
  border-radius: 999px;
  background: var(--fill);
  box-shadow: inset 0 0 0 1px var(--hairline);
  font-size: 0.9375rem;
  font-weight: 600;
  letter-spacing: -0.012em;
  transition: background-color 0.2s ease, transform 0.2s var(--ease-out);

  svg {
    width: 1rem;
    height: 1rem;
    color: var(--cyan);
    transition: transform 0.3s var(--ease-out);
  }
  &:hover { background: var(--fill-strong); }
  &:hover svg { transform: translate3d(2px, -2px, 0); }
  &:active { transform: scale(0.97); }
`;

export const Note = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.875rem;
  color: var(--text-tertiary);

  svg { width: 0.875rem; height: 0.875rem; }
`;

export const Media = styled.div`
  grid-area: media;

  ${motion} { display: none; }
`;

export const Frame = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: 0.875rem;
  background: var(--bg-raised);
  box-shadow:
    0 0 0 1px var(--hairline-strong),
    0 40px 90px rgba(0, 0, 0, 0.6),
    0 0 80px rgba(92, 208, 255, 0.06);

  img {
    width: 100%;
    height: auto;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(
      36rem circle at var(--sheen-x, 50%) var(--sheen-y, 0%),
      var(--sheen),
      transparent 45%
    );
    opacity: var(--sheen-o, 0);
    pointer-events: none;
  }
`;

export const FrameBar = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  height: 2.25rem;
  padding-inline: 0.875rem;
  border-bottom: 1px solid var(--hairline);

  i {
    display: flex;
    gap: 0.375rem;
  }
  i b {
    width: 0.625rem;
    height: 0.625rem;
    border-radius: 50%;
    background: var(--fill-strong);
  }
`;

export const Url = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  max-width: 100%;
  padding: 0.1875rem 0.75rem;
  overflow: hidden;
  border-radius: 0.375rem;
  background: var(--fill);
  font-size: 0.75rem;
  color: var(--text-secondary);
  white-space: nowrap;
  text-overflow: ellipsis;

  svg { width: 0.6875rem; height: 0.6875rem; flex-shrink: 0; }
`;

