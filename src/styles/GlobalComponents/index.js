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
  margin-bottom: 0.875rem;
  font-size: 0.9375rem;
  font-weight: 600;
  letter-spacing: -0.005em;
  color: var(--link);
`;

export const SectionTitle = styled.h2`
  font-size: clamp(2.25rem, 1.35rem + 3.6vw, 4rem);
  line-height: 1.04;
  letter-spacing: -0.035em;
  font-weight: 650;
`;

export const Lead = styled.p`
  margin-top: 1.25rem;
  max-width: 38rem;
  font-size: clamp(1.0625rem, 0.98rem + 0.4vw, 1.3125rem);
  line-height: 1.5;
  letter-spacing: -0.014em;
  color: var(--text-secondary);
`;
