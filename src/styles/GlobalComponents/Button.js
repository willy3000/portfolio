import styled, { css } from 'styled-components';

const variants = {
  primary: css`
    background: var(--accent);
    color: var(--accent-text);
    &:hover { background: var(--accent-hover); }
  `,
  secondary: css`
    background: var(--fill);
    color: var(--text);
    &:hover { background: var(--fill-strong); }
  `,
};

const Button = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  height: ${({ $size }) => ($size === 'sm' ? '2.125rem' : '3rem')};
  padding-inline: ${({ $size }) => ($size === 'sm' ? '0.9375rem' : '1.375rem')};
  border-radius: 999px;
  font-size: ${({ $size }) => ($size === 'sm' ? '0.875rem' : '1rem')};
  font-weight: 600;
  letter-spacing: -0.012em;
  white-space: nowrap;
  cursor: pointer;
  user-select: none;
  transition: background-color 0.2s ease, transform 0.2s var(--ease-out);

  ${({ $variant = 'primary' }) => variants[$variant]}

  /* Feedback on press, not release. */
  &:active {
    transform: scale(0.97);
    transition: transform 0.1s ease-out;
  }

  svg {
    width: 1.05em;
    height: 1.05em;
    flex-shrink: 0;
  }
`;

export default Button;
