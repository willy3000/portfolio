import styled from 'styled-components';

export const FooterBar = styled.footer`
  padding-bottom: 2.5rem;
`;

export const Inner = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--hairline);
  font-size: 0.875rem;
  color: var(--text-secondary);

  a {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    transition: color 0.2s ease;
  }
  a:hover { color: var(--text); }
  svg { width: 0.9375rem; height: 0.9375rem; }
`;
