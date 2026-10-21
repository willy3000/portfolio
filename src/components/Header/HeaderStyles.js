import styled from 'styled-components';

export const Bar = styled.header`
  position: fixed;
  inset: 0 0 auto;
  z-index: 50;
  height: var(--nav-height);
  transition: background-color 0.3s ease, box-shadow 0.3s ease;

  /* Material appears only once content scrolls underneath it. */
  &[data-scrolled='true'],
  &[data-menu='true'] {
    background: var(--material);
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    box-shadow: 0 1px 0 var(--hairline);
  }

  @media (prefers-reduced-transparency: reduce) {
    &[data-scrolled='true'],
    &[data-menu='true'] {
      background: var(--bg);
      backdrop-filter: none;
      -webkit-backdrop-filter: none;
    }
  }
`;

export const Inner = styled.nav`
  display: flex;
  align-items: center;
  gap: 1rem;
  height: 100%;
  max-width: 72rem;
  margin-inline: auto;
  padding-inline: var(--gutter);
`;

export const Brand = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.625rem;
  margin-right: auto;
  font-size: 0.9375rem;
  font-weight: 600;
  letter-spacing: -0.015em;
`;

export const Monogram = styled.span`
  display: grid;
  place-items: center;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 0.5rem;
  background: var(--text);
  color: var(--bg);
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.02em;
`;

export const Links = styled.ul`
  position: relative;
  display: flex;
  align-items: center;

  @media ${(p) => p.theme.breakpoints.md} {
    display: none;
  }
`;

export const Pill = styled.span`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  border-radius: 999px;
  background: var(--fill);
  opacity: 0;
  pointer-events: none;
`;

export const NavLink = styled.a`
  position: relative;
  display: block;
  padding: 0.375rem 0.875rem;
  font-size: 0.875rem;
  font-weight: 500;
  letter-spacing: -0.006em;
  color: var(--text-secondary);
  transition: color 0.2s ease;

  &:hover,
  &[aria-current='true'] {
    color: var(--text);
  }
`;

export const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  @media ${(p) => p.theme.breakpoints.md} {
    .resume { display: none; }
  }
`;

export const IconButton = styled.button`
  display: grid;
  place-items: center;
  width: 2.125rem;
  height: 2.125rem;
  border-radius: 999px;
  color: var(--text-secondary);
  transition: background-color 0.2s ease, color 0.2s ease, transform 0.2s var(--ease-out);

  &:hover {
    background: var(--fill);
    color: var(--text);
  }
  &:active {
    transform: scale(0.92);
    transition: transform 0.1s ease-out;
  }

  svg { width: 1.0625rem; height: 1.0625rem; }

  &[aria-pressed='true'] { color: var(--cyan); }
`;

export const MenuButton = styled(IconButton)`
  display: none;

  @media ${(p) => p.theme.breakpoints.md} {
    display: grid;
  }

  span {
    position: absolute;
    width: 1rem;
    height: 1.5px;
    border-radius: 1px;
    background: currentColor;
    transition: transform 0.35s var(--ease-out);
  }
  span:first-child { transform: translateY(-3px); }
  span:last-child { transform: translateY(3px); }

  &[aria-expanded='true'] span:first-child { transform: rotate(45deg); }
  &[aria-expanded='true'] span:last-child { transform: rotate(-45deg); }
`;

export const Menu = styled.div`
  position: fixed;
  top: calc(var(--nav-height) + 0.5rem);
  right: var(--gutter);
  left: var(--gutter);
  z-index: 49;
  padding: 0.5rem;
  border-radius: 1.25rem;
  background: var(--material-heavy);
  backdrop-filter: blur(30px) saturate(180%);
  -webkit-backdrop-filter: blur(30px) saturate(180%);
  box-shadow: var(--shadow-float), inset 0 0 0 1px var(--material-edge);
  transform-origin: top right;
  opacity: 0;
  visibility: hidden;

  &[data-open='false'] { pointer-events: none; }

  a:not(.resume) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.875rem 1rem;
    border-radius: 0.75rem;
    font-size: 1.1875rem;
    font-weight: 600;
    letter-spacing: -0.02em;
    transition: background-color 0.15s ease;
  }
  a:not(.resume):active { background: var(--fill); }

  .resume {
    width: 100%;
    margin-top: 0.5rem;
  }

  @media (prefers-reduced-transparency: reduce) {
    background: var(--bg-raised);
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
  }
`;

// Journey rail: where you are in the story, and a way to jump through it.
export const Rail = styled.nav`
  position: fixed;
  top: 50%;
  right: 1.25rem;
  z-index: 40;
  display: none;
  transform: translateY(-50%);

  @media (min-width: 75rem) {
    html[data-motion='on'] & { display: block; }
  }

  ol {
    position: relative;
    display: grid;
    gap: 0.25rem;
  }

  a {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 0.75rem;
    height: 2rem;
    padding-right: 1.25rem;
    color: var(--text-tertiary);
    transition: color 0.25s ease;
  }
  a span:last-child {
    position: absolute;
    right: 3.25rem;
    font-size: 0.8125rem;
    white-space: nowrap;
    opacity: 0;
    transform: translateX(6px);
    transition: opacity 0.25s ease, transform 0.35s var(--ease-out);
  }
  a .mono { font-size: 0.625rem; }
  a::after {
    content: '';
    position: absolute;
    right: -3px;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--bg);
    box-shadow: inset 0 0 0 1px var(--hairline-strong);
    transition: background-color 0.25s ease, box-shadow 0.25s ease;
  }
  a:hover,
  a:focus-visible,
  a[aria-current='true'] { color: var(--text); }
  a:hover span:last-child,
  a:focus-visible span:last-child {
    opacity: 1;
    transform: none;
  }
  a[aria-current='true']::after {
    background: var(--cyan);
    box-shadow: 0 0 12px var(--cyan);
  }
`;

export const RailFill = styled.span`
  position: absolute;
  top: 1rem;
  bottom: 1rem;
  right: 0;
  width: 1px;
  background: var(--hairline);

  i {
    position: absolute;
    inset: 0;
    background: linear-gradient(var(--cyan), var(--violet));
    transform-origin: top;
    transform: scaleY(0);
  }
`;
