import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  max-width: 72rem;
  margin-inline: auto;
  padding-inline: var(--gutter);
`;

export const Section = styled.section`
  position: relative;
  padding-block: clamp(4rem, 7.5vw, 6.5rem);
`;

export const SectionHeader = styled.header`
  max-width: 44rem;
  margin-bottom: clamp(2.75rem, 6vw, 4.5rem);
`;

export const Eyebrow = styled.p`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.125rem;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--cyan);

  &::before {
    content: '';
    width: 1.5rem;
    height: 1px;
    background: currentColor;
    opacity: 0.6;
  }
`;

export const SectionTitle = styled.h2`
  font-size: clamp(2.25rem, 1.35rem + 3.6vw, 4rem);
  line-height: 1.04;
  letter-spacing: -0.04em;
  font-weight: 500;

  em {
    font-family: var(--font-serif);
    font-style: italic;
    font-weight: 400;
    letter-spacing: -0.01em;
    color: var(--text-secondary);
  }
`;

export const Lead = styled.p`
  margin-top: 1.25rem;
  max-width: 38rem;
  font-size: clamp(1.0625rem, 0.98rem + 0.4vw, 1.3125rem);
  line-height: 1.5;
  letter-spacing: -0.014em;
  color: var(--text-secondary);
`;

// The scroll track for the whole journey. With motion on it is as tall as
// the journey needs (one transition per stop); otherwise it is just a wrapper
// and every layer flows as an ordinary section.
export const Track = styled.div`
  position: relative;

  html[data-motion='on'] & {
    height: calc(100vh + ${(p) => p.$scroll} * 1vh);
    height: calc(100svh + ${(p) => p.$scroll} * 1svh);
  }
`;

// The viewport-sized stage that stays in place while the track scrolls.
export const Stage = styled.div`
  position: relative;

  html[data-motion='on'] & {
    position: sticky;
    top: 0;
    height: 100vh;
    height: 100svh;
    overflow: hidden;
  }
`;

// One section of the journey. On stage, layers sit on top of each other and
// their content fades in at its stop; off stage they are normal sections.
export const Layer = styled.section`
  position: relative;
  padding-block: clamp(4rem, 7.5vw, 6.5rem);

  html[data-motion='on'] & {
    position: absolute;
    inset: 0;
    padding: 0;
    pointer-events: none;
  }
`;

// Mono chip naming what a panel is (Education, Work experience, …).
export const Chip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.625rem;
  border-radius: 999px;
  background: ${(p) => p.$tone || 'rgba(92, 208, 255, 0.12)'};
  color: ${(p) => p.$color || 'var(--cyan)'};
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;

  &::before {
    content: '';
    width: 0.375rem;
    height: 0.375rem;
    border-radius: 50%;
    background: currentColor;
  }
`;
