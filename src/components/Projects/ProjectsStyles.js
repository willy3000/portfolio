import styled, { css } from 'styled-components';

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(1rem, 2vw, 1.5rem);

  .span-full { grid-column: 1 / -1; }

  @media ${(p) => p.theme.breakpoints.md} {
    grid-template-columns: minmax(0, 1fr);
  }
`;

export const Card = styled.article`
  position: relative;
  isolation: isolate;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  border-radius: clamp(1.25rem, 2.5vw, 1.75rem);
  background: var(--surface);
  box-shadow: inset 0 0 0 1px var(--hairline);
`;

export const Body = styled.div`
  padding: clamp(1.75rem, 4vw, 3rem) clamp(1.5rem, 4vw, 3rem) 0;

  ${({ $full }) => $full && css`
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.15fr);
    gap: 1.25rem clamp(2rem, 6vw, 5rem);
    align-items: start;

    @media ${(p) => p.theme.breakpoints.md} {
      grid-template-columns: minmax(0, 1fr);
    }
  `}
`;

export const Meta = styled.p`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.25rem 0.5rem;
  margin-bottom: 0.75rem;
  font-size: 0.875rem;
  color: var(--text-secondary);
`;

export const Badge = styled.span`
  padding: 0.125rem 0.5rem;
  border-radius: 999px;
  background: var(--accent-soft);
  color: var(--link);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.005em;
`;

export const Title = styled.h3`
  font-size: ${({ $full }) => ($full
    ? 'clamp(2rem, 1.35rem + 2.6vw, 3.25rem)'
    : 'clamp(1.75rem, 1.4rem + 1.2vw, 2.25rem)')};
  line-height: 1.04;
  letter-spacing: -0.035em;
  font-weight: 650;
`;

export const Summary = styled.p`
  margin-top: ${({ $full }) => ($full ? '0' : '1rem')};
  font-size: ${({ $full }) => ($full ? '1.125rem' : '1.0625rem')};
  line-height: 1.55;
  letter-spacing: -0.013em;
  color: var(--text-secondary);
`;

export const Tags = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  margin-top: 1.25rem;

  li {
    padding: 0.25rem 0.625rem;
    border-radius: 999px;
    background: var(--fill);
    font-size: 0.8125rem;
    font-weight: 500;
    letter-spacing: -0.003em;
    color: var(--text-secondary);
  }
`;

export const Links = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem 1.5rem;
  margin-top: 1.5rem;
`;

export const TextLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.9375rem;
  font-weight: 600;
  letter-spacing: -0.012em;
  color: var(--link);
  transition: opacity 0.2s ease;

  svg {
    width: 1rem;
    height: 1rem;
    transition: transform 0.3s var(--ease-out);
  }
  &:hover svg { transform: translate3d(2px, -2px, 0); }
  &:hover span { text-decoration: underline; text-underline-offset: 0.2em; }
  &:active {
    opacity: 0.6;
    transition: opacity 0.1s ease-out;
  }
`;

export const Note = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.875rem;
  color: var(--text-secondary);

  svg { width: 0.875rem; height: 0.875rem; }
`;

export const Stage = styled.div`
  flex: 1;
  display: flex;
  align-items: flex-end;
  margin-top: clamp(2rem, 4vw, 3rem);
  padding-inline: ${({ $full }) => ($full ? 'clamp(1.25rem, 6vw, 5rem)' : 'clamp(1.25rem, 4vw, 2.5rem)')};
  transform-origin: 50% 100%;
`;

export const Frame = styled.div`
  position: relative;
  width: 100%;
  /* Runs past the card edge so a lift never reveals a gap underneath. */
  margin-bottom: -1.75rem;
  padding-bottom: 1.75rem;
  overflow: hidden;
  border-radius: 0.875rem 0.875rem 0 0;
  background: var(--bg-raised);
  box-shadow: var(--shadow-float), 0 0 0 1px var(--hairline);
  transform-origin: 50% 100%;

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
