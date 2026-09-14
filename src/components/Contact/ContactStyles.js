import styled from 'styled-components';

export const Panel = styled.div`
  position: relative;
  isolation: isolate;
  overflow: hidden;
  padding: clamp(3rem, 8vw, 6.5rem) clamp(1.5rem, 6vw, 5rem);
  border-radius: clamp(1.5rem, 3vw, 2.25rem);
  background: var(--surface);
  box-shadow: inset 0 0 0 1px var(--hairline);
  text-align: center;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -1;
    background: radial-gradient(50rem 26rem at 50% 115%, var(--glow), transparent 70%);
  }
`;

export const Title = styled.h2`
  max-width: 14em;
  margin-inline: auto;
  font-size: clamp(2.5rem, 1.3rem + 4.6vw, 4.75rem);
  line-height: 1.02;
  letter-spacing: -0.042em;
  font-weight: 650;
`;

export const Text = styled.p`
  max-width: 34rem;
  margin: 1.25rem auto 0;
  font-size: clamp(1.0625rem, 0.98rem + 0.4vw, 1.3125rem);
  line-height: 1.5;
  letter-spacing: -0.014em;
  color: var(--text-secondary);
`;

export const EmailRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 2.5rem;
`;

export const CopyButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  height: 3rem;
  min-width: 9.5rem;
  padding-inline: 1.375rem;
  border-radius: 999px;
  background: var(--fill);
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: -0.012em;
  transition: background-color 0.2s ease, transform 0.2s var(--ease-out);

  &:hover { background: var(--fill-strong); }
  &:active {
    transform: scale(0.97);
    transition: transform 0.1s ease-out;
  }

  svg { width: 1.05em; height: 1.05em; }

  &[data-copied='true'] { color: var(--positive); }
`;

export const Channels = styled.ul`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem 1.75rem;
  margin-top: 2.5rem;

  a {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9375rem;
    font-weight: 500;
    color: var(--text-secondary);
    transition: color 0.2s ease, opacity 0.2s ease;
  }
  a:hover { color: var(--text); }
  a:active {
    opacity: 0.6;
    transition: opacity 0.1s ease-out;
  }
  svg { width: 1.0625rem; height: 1.0625rem; }
`;
