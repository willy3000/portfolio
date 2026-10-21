import styled, { keyframes } from 'styled-components';

const rise = keyframes`
  from { opacity: 0; transform: translate3d(0, 1.25rem, 0); filter: blur(8px); }
  to { opacity: 1; transform: none; filter: blur(0); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.35; }
`;

const travel = keyframes`
  0% { transform: scaleY(0); transform-origin: top; }
  45% { transform: scaleY(1); transform-origin: top; }
  55% { transform: scaleY(1); transform-origin: bottom; }
  100% { transform: scaleY(0); transform-origin: bottom; }
`;

export const Frame = styled.div`
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 80rem;
  margin-inline: auto;
  padding: calc(var(--nav-height) + 3rem) var(--gutter) 3rem;

  html[data-motion='on'] & {
    display: flex;
    align-items: center;
    height: 100%;
    padding-block: var(--nav-height) 4rem;
    pointer-events: none;
  }
  html[data-motion='on'] & > * { pointer-events: auto; }

  @media ${(p) => p.theme.breakpoints.md} {
    html[data-motion='on'] & {
      align-items: flex-end;
      padding-bottom: 2.5rem;
    }
  }
`;

export const Copy = styled.div`
  max-width: 34rem;

  > * {
    /* backwards, not both: once finished it must not override scroll-driven styles. */
    animation: ${rise} 1.1s var(--ease-out) backwards;
  }
  > *:nth-child(2) { animation-delay: 0.08s; }
  > *:nth-child(3) { animation-delay: 0.16s; }
  > *:nth-child(4) { animation-delay: 0.24s; }
  > *:nth-child(5) { animation-delay: 0.32s; }
  > *:nth-child(6) { animation-delay: 0.4s; }
  > *:nth-child(7) { animation-delay: 0.48s; }

  @media (prefers-reduced-motion: reduce) {
    > * { animation: none; }
  }
`;

export const Status = styled.p`
  display: inline-flex;
  align-items: center;
  gap: 0.625rem;
  margin-bottom: 1.25rem;
  color: var(--text-secondary);
`;

export const Dot = styled.span`
  width: 0.4375rem;
  height: 0.4375rem;
  border-radius: 50%;
  background: var(--positive);
  box-shadow: 0 0 0 4px rgba(61, 220, 132, 0.15);
  animation: ${pulse} 2.4s ease-in-out infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

export const Name = styled.h1`
  font-size: clamp(3.25rem, 1.5rem + 6vw, 6.25rem);
  font-weight: 300;
  line-height: 0.92;
  letter-spacing: -0.055em;
  background: linear-gradient(180deg, #ffffff 30%, #9fb4d6 110%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
`;

export const Kicker = styled.p`
  display: flex;
  align-items: center;
  gap: 0.875rem;
  margin-top: 1.25rem;
  color: var(--cyan);

  i {
    width: 2rem;
    height: 1px;
    background: var(--hairline-strong);
  }
`;

export const Headline = styled.p`
  margin-top: 1.5rem;
  font-size: clamp(1.375rem, 1.1rem + 1.1vw, 1.875rem);
  font-weight: 500;
  line-height: 1.2;
  letter-spacing: -0.025em;

  em {
    font-family: var(--font-serif);
    font-style: italic;
    font-weight: 400;
    letter-spacing: -0.005em;
    color: var(--text-secondary);
  }
`;

export const Lede = styled.p`
  margin-top: 1rem;
  max-width: 30rem;
  color: var(--text-secondary);
  font-size: 1.0625rem;
  line-height: 1.55;

  @media (max-height: 760px) {
    html[data-motion='on'] & { display: none; }
  }
`;

export const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 1.75rem;
`;

export const Facts = styled.dl`
  display: grid;
  grid-template-columns: repeat(4, auto);
  gap: 1.75rem;
  margin-top: 3rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--hairline);

  @media ${(p) => p.theme.breakpoints.md} {
    grid-template-columns: repeat(2, auto);
    gap: 1.25rem;
  }

  @media (max-height: 1000px), ${(p) => p.theme.breakpoints.md} {
    html[data-motion='on'] & { display: none; }
  }
`;

export const Fact = styled.div`
  dt {
    margin-bottom: 0.375rem;
    color: var(--text-tertiary);
    font-size: 0.6875rem;
  }
  dd {
    font-size: 0.9375rem;
    font-weight: 500;
    letter-spacing: -0.012em;
  }
`;

export const Cue = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 1.5rem;
  width: max-content;
  margin-inline: auto;
  display: none;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  color: var(--text-tertiary);
  font-size: 0.6875rem;

  html[data-motion='on'] & { display: flex; }

  i {
    width: 1px;
    height: 2.5rem;
    background: linear-gradient(var(--cyan), transparent);
    animation: ${travel} 2.2s var(--ease-out) infinite;
  }

  @media ${(p) => p.theme.breakpoints.md} {
    left: auto;
    right: var(--gutter);
    margin: 0;
  }
`;

export const Caption = styled.p`
  display: none;

  html[data-motion='on'] & {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 9%;
    display: flex;
    justify-content: center;
    gap: 0.75rem;
    color: var(--text-secondary);
  }

  span { color: var(--cyan); }
`;
