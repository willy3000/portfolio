import styled from 'styled-components';

import { SectionTitle } from '../../styles/GlobalComponents';

export const Layout = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.5fr);
  gap: clamp(2.5rem, 7vw, 6rem);
  align-items: start;

  @media ${(p) => p.theme.breakpoints.lg} {
    grid-template-columns: minmax(0, 1fr);
  }
`;

export const Aside = styled.div`
  position: sticky;
  top: calc(var(--nav-height) + 3rem);

  @media ${(p) => p.theme.breakpoints.lg} {
    position: static;
  }
`;

// The pinned column is narrow, so its title steps down a size.
export const AsideTitle = styled(SectionTitle)`
  font-size: clamp(2.25rem, 1.5rem + 2.4vw, 3.5rem);
`;

export const Timeline = styled.ol`
  position: relative;

  /* The rail. */
  &::before {
    content: '';
    position: absolute;
    top: 0.625rem;
    bottom: 0.625rem;
    left: 0.3125rem;
    width: 1px;
    background: linear-gradient(var(--hairline-strong), var(--hairline) 85%, transparent);
  }
`;

export const Role = styled.li`
  position: relative;
  padding-left: 2.25rem;

  & + & {
    margin-top: clamp(2.5rem, 5vw, 3.5rem);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0.4375rem;
    left: 0;
    width: 0.6875rem;
    height: 0.6875rem;
    border-radius: 50%;
    background: var(--bg);
    box-shadow: inset 0 0 0 1.5px var(--text-tertiary);
  }

  &[data-current='true']::before {
    background: var(--positive);
    box-shadow: 0 0 0 4px color-mix(in srgb, var(--positive) 20%, transparent);
  }
`;

export const RoleHead = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.25rem 1.5rem;
`;

export const Company = styled.h3`
  font-size: 1.375rem;
  line-height: 1.25;
  letter-spacing: -0.022em;
  font-weight: 600;
`;

export const Period = styled.p`
  font-size: 0.875rem;
  font-variant-numeric: tabular-nums;
  color: var(--text-secondary);
  white-space: nowrap;
`;

export const RoleTitle = styled.p`
  margin-top: 0.125rem;
  font-size: 1rem;
  color: var(--text-secondary);

  strong {
    font-weight: 500;
    color: var(--text);
  }
`;

export const Highlights = styled.ul`
  margin-top: 1rem;
  display: grid;
  gap: 0.625rem;

  li {
    position: relative;
    padding-left: 1.125rem;
    font-size: 1rem;
    line-height: 1.6;
    color: var(--text-secondary);
  }
  li::before {
    content: '';
    position: absolute;
    top: 0.72em;
    left: 0;
    width: 0.3125rem;
    height: 1px;
    background: var(--text-tertiary);
  }
`;

export const Education = styled.div`
  margin-top: clamp(3.5rem, 7vw, 5rem);
  padding-top: 2rem;
  border-top: 1px solid var(--hairline);

  h3 {
    margin-bottom: 1.25rem;
    font-size: 0.9375rem;
    font-weight: 600;
    letter-spacing: -0.005em;
    color: var(--text-secondary);
  }
`;

export const School = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 0.125rem 1.5rem;
  padding-block: 0.875rem;

  & + & { border-top: 1px solid var(--hairline); }

  p:first-child { font-size: 1.0625rem; letter-spacing: -0.016em; }
  p span { color: var(--text-secondary); }
`;
