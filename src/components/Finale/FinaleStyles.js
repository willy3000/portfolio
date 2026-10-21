import styled from 'styled-components';

const motion = "html[data-motion='on'] &";

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 48rem;
  margin-inline: auto;
  padding-inline: var(--gutter);
  text-align: center;

  ${motion} {
    position: absolute;
    inset: 0;
    z-index: 2;
    justify-content: center;
    padding-top: var(--nav-height);
  }

  > p:first-child { justify-content: center; }
`;

export const Title = styled.h2`
  font-size: clamp(2.5rem, 1.2rem + 5.2vw, 5.5rem);
  font-weight: 400;
  line-height: 0.98;
  letter-spacing: -0.05em;

  em {
    font-family: var(--font-serif);
    font-style: italic;
    letter-spacing: -0.015em;
    color: var(--text-secondary);
  }
`;

export const Text = styled.p`
  max-width: 32rem;
  margin-top: 1.5rem;
  color: var(--text-secondary);
  font-size: clamp(1.0625rem, 0.98rem + 0.4vw, 1.25rem);
  line-height: 1.55;
`;

export const EmailRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 2.25rem;
`;

export const CopyButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  height: 3rem;
  padding-inline: 1.25rem;
  border-radius: 999px;
  background: var(--fill);
  box-shadow: inset 0 0 0 1px var(--hairline);
  font-weight: 600;
  transition: background-color 0.2s ease, transform 0.2s var(--ease-out);

  &:hover { background: var(--fill-strong); }
  &:active { transform: scale(0.97); }
  &[data-copied='true'] { color: var(--positive); }
  svg { width: 1rem; height: 1rem; }
`;

export const Channels = styled.ul`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1.5rem;

  a {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    height: 2.5rem;
    padding-inline: 1rem;
    border-radius: 999px;
    color: var(--text-secondary);
    font-size: 0.9375rem;
    font-weight: 500;
    transition: color 0.2s ease, background-color 0.2s ease;
  }
  a:hover {
    color: var(--text);
    background: var(--fill);
  }
  svg { width: 1rem; height: 1rem; }
`;

export const Restart = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 3rem;
  color: var(--text-tertiary);
  font-family: var(--font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  transition: color 0.2s ease;

  &:hover { color: var(--text); }
  svg { width: 0.875rem; height: 0.875rem; }
`;
