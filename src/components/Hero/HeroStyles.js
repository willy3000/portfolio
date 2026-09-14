import styled from 'styled-components';

export const HeroSection = styled.section`
  position: relative;
  isolation: isolate;
  overflow: hidden;
  padding-top: calc(var(--nav-height) + clamp(3.5rem, 8vw, 6.5rem));
  padding-bottom: clamp(3.5rem, 7vw, 5.5rem);

  /* Static ambient light and a dot grid that fades out from the top. */
  &::before,
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -1;
    pointer-events: none;
  }
  &::before {
    background: radial-gradient(60rem 32rem at 50% -8rem, var(--glow), transparent 70%);
  }
  &::after {
    background-image: radial-gradient(var(--grid-dot) 1px, transparent 1px);
    background-size: 1.5rem 1.5rem;
    -webkit-mask-image: radial-gradient(ellipse 70% 60% at 50% 0%, #000 30%, transparent 75%);
    mask-image: radial-gradient(ellipse 70% 60% at 50% 0%, #000 30%, transparent 75%);
  }
`;

// Staggered entrance on first paint, before JavaScript loads.
export const Rise = styled.div`
  animation: rise 1s var(--ease-out) both;
  animation-delay: ${({ $i = 0 }) => 80 + $i * 70}ms;
`;

export const Status = styled.p`
  display: inline-flex;
  align-items: center;
  gap: 0.625rem;
  margin-bottom: 1.75rem;
  padding: 0.375rem 0.875rem 0.375rem 0.625rem;
  border-radius: 999px;
  background: var(--fill);
  box-shadow: inset 0 0 0 1px var(--hairline);
  font-size: 0.875rem;
  font-weight: 500;
  letter-spacing: -0.004em;
  color: var(--text-secondary);

  strong {
    font-weight: 600;
    color: var(--text);
  }
`;

export const Dot = styled.span`
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background: var(--positive);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--positive) 22%, transparent);
`;

export const Headline = styled.h1`
  font-size: clamp(2.625rem, 1.2rem + 5.6vw, 5.5rem);
  line-height: 1.02;
  letter-spacing: -0.036em;
  font-weight: 650;

  span {
    display: block;
    color: var(--text-tertiary);
  }
`;

export const Intro = styled.p`
  max-width: 36rem;
  margin-top: 1.75rem;
  font-size: clamp(1.125rem, 1rem + 0.5vw, 1.375rem);
  line-height: 1.5;
  letter-spacing: -0.016em;
  color: var(--text-secondary);

  strong {
    font-weight: 500;
    color: var(--text);
  }
`;

export const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 2.5rem;
`;

export const Facts = styled.dl`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  margin-top: clamp(3.5rem, 7vw, 5.5rem);
  border-top: 1px solid var(--hairline);

  @media ${(p) => p.theme.breakpoints.md} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

export const Fact = styled.div`
  padding: 1.25rem 1.5rem 0 0;

  dt {
    font-size: 0.8125rem;
    letter-spacing: 0.005em;
    color: var(--text-secondary);
  }
  dd {
    margin-top: 0.25rem;
    font-size: 1.0625rem;
    font-weight: 500;
    letter-spacing: -0.016em;
  }
`;
