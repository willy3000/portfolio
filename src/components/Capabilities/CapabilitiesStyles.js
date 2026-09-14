import styled from 'styled-components';

export const Strengths = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(1rem, 2vw, 1.5rem);

  @media ${(p) => p.theme.breakpoints.md} {
    grid-template-columns: minmax(0, 1fr);
  }
`;

export const Strength = styled.div`
  height: 100%;
  padding: clamp(1.75rem, 3.5vw, 2.5rem);
  border-radius: clamp(1.25rem, 2.5vw, 1.5rem);
  background: var(--surface);
  box-shadow: inset 0 0 0 1px var(--hairline);

  h3 {
    margin-top: clamp(1.75rem, 4vw, 2.5rem);
    font-size: 1.375rem;
    line-height: 1.25;
    letter-spacing: -0.022em;
  }
  p {
    margin-top: 0.5rem;
    max-width: 30rem;
    font-size: 1.0625rem;
    line-height: 1.55;
    letter-spacing: -0.013em;
    color: var(--text-secondary);
  }
`;

export const Icon = styled.span`
  display: grid;
  place-items: center;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 0.75rem;
  background: var(--accent-soft);
  color: var(--link);

  svg { width: 1.25rem; height: 1.25rem; }
`;

export const Toolkit = styled.div`
  margin-top: clamp(4rem, 8vw, 6rem);

  h3 {
    font-size: clamp(1.5rem, 1.2rem + 1vw, 2rem);
    line-height: 1.15;
    letter-spacing: -0.028em;
  }
`;

export const Specs = styled.dl`
  margin-top: 1.5rem;
  border-top: 1px solid var(--hairline-strong);
`;

export const Spec = styled.div`
  display: grid;
  grid-template-columns: minmax(8rem, 0.4fr) minmax(0, 1fr);
  gap: 0.25rem 2rem;
  padding-block: 1.125rem;
  border-bottom: 1px solid var(--hairline);

  dt {
    font-size: 0.9375rem;
    font-weight: 500;
    color: var(--text-secondary);
  }
  dd {
    font-size: 1.0625rem;
    letter-spacing: -0.014em;
  }

  @media ${(p) => p.theme.breakpoints.sm} {
    grid-template-columns: minmax(0, 1fr);
  }
`;
