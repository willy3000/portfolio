import React from 'react';
import styled from 'styled-components';
import { FiMail } from 'react-icons/fi';

/* Diagrammatic artwork for projects without a public screenshot. */

const Canvas = styled.div`
  position: relative;
  aspect-ratio: 16 / 11;
  overflow: hidden;
`;

const Bar = styled.span`
  display: block;
  height: ${({ $h = 6 }) => $h}px;
  width: ${({ $w = 100 }) => $w}%;
  border-radius: 999px;
  background: ${({ $tone }) => $tone || 'var(--fill-strong)'};
`;

/* Pixel Realm: three surfaces of one marketplace. */

const Surfaces = styled(Canvas)`
  background:
    radial-gradient(80% 70% at 100% 100%, var(--accent-soft), transparent 70%),
    var(--bg-raised);
`;

const Panel = styled.div`
  position: absolute;
  width: 56%;
  height: 54%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 0.625rem;
  background: var(--surface);
  box-shadow: var(--shadow-card), 0 0 0 1px var(--hairline);

  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 1.25rem;
    padding-inline: 0.5rem;
    border-bottom: 1px solid var(--hairline);
    font-size: 0.5625rem;
    font-weight: 600;
    letter-spacing: 0.02em;
    color: var(--text-secondary);
  }
  header i { display: flex; gap: 3px; }
  header i b { width: 5px; height: 5px; border-radius: 50%; background: var(--fill-strong); }
`;

const PanelBody = styled.div`
  flex: 1;
  display: flex;
  gap: 0.5rem;
  padding: 0.625rem;
  min-height: 0;
`;

const Column = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${({ $gap = 5 }) => $gap}px;
  min-width: 0;
`;

const Block = styled.span`
  display: block;
  flex: ${({ $flex = 'none' }) => $flex};
  aspect-ratio: ${({ $ratio = 'auto' }) => $ratio};
  border-radius: 0.3125rem;
  background: ${({ $tone = 'var(--fill)' }) => $tone};
`;

const Row = styled.span`
  display: flex;
  align-items: center;
  gap: 5px;
  padding-block: 4px;
  border-bottom: 1px solid var(--hairline);
`;

const Status = styled.b`
  width: 5px;
  height: 5px;
  flex-shrink: 0;
  border-radius: 50%;
  background: ${({ $tone }) => $tone};
`;

const PanelHeader = ({ label }) => (
  <header>
    <i><b /><b /><b /></i>
    {label}
  </header>
);

export const SurfacesIllustration = () => (
  <Surfaces aria-hidden="true">
    <Panel style={{ left: '6%', top: '8%' }}>
      <PanelHeader label="Landing" />
      <PanelBody>
        <Column $gap={6} style={{ justifyContent: 'center', alignItems: 'flex-start' }}>
          <Bar $h={7} $w={80} />
          <Bar $h={7} $w={55} />
          <Bar $h={4} $w={70} $tone="var(--fill)" />
          <Bar $h={10} $w={30} $tone="var(--accent)" />
        </Column>
        <Block $flex="1" $tone="var(--accent-soft)" />
      </PanelBody>
    </Panel>

    <Panel style={{ left: '22%', top: '19%' }}>
      <PanelHeader label="Storefront" />
      <PanelBody style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <Column key={i} $gap={3}>
            <Block $ratio="1" $tone={i === 1 ? 'var(--accent-soft)' : 'var(--fill)'} />
            <Bar $h={3} $w={80} />
            <Bar $h={3} $w={40} $tone="var(--fill)" />
          </Column>
        ))}
      </PanelBody>
    </Panel>

    <Panel style={{ left: '38%', top: '30%' }}>
      <PanelHeader label="Admin" />
      <PanelBody>
        <Column $gap={5} style={{ flex: '0 0 22%' }}>
          <Bar $h={4} $w={90} $tone="var(--accent)" />
          <Bar $h={4} $w={70} />
          <Bar $h={4} $w={80} />
          <Bar $h={4} $w={60} />
        </Column>
        <Column $gap={0}>
          {['var(--positive)', 'var(--link)', 'var(--positive)', 'var(--text-tertiary)', 'var(--positive)'].map((tone, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <Row key={i}>
              <Status $tone={tone} />
              <Bar $h={3} $w={40 + ((i * 17) % 30)} />
              <Bar $h={3} $w={18} $tone="var(--fill)" />
            </Row>
          ))}
        </Column>
      </PanelBody>
    </Panel>
  </Surfaces>
);

/* Hanawari: a storefront catalogue and the confirmation email that follows. */

const Store = styled(Canvas)`
  --chili: #d8452b;
  --mango: #eb9632;
  --verde: #5b9440;
  display: flex;
  flex-direction: column;
  gap: 5%;
  padding: 5% 6% 12%;
  background: color-mix(in srgb, #eb9632 7%, var(--bg-raised));
`;

const StoreNav = styled.div`
  display: flex;
  align-items: center;
  gap: 4%;

  strong {
    margin-right: auto;
    font-size: 0.8125rem;
    font-weight: 700;
    letter-spacing: -0.02em;
    color: var(--chili);
  }
`;

const Products = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4%;
`;

const Product = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 8%;
  border-radius: 0.625rem;
  background: var(--bg-raised);
  box-shadow: 0 0 0 1px var(--hairline);
`;

const Jar = styled.div`
  position: relative;
  width: 46%;
  aspect-ratio: 3 / 4;
  margin: 6% auto 10%;

  &::before {
    content: '';
    position: absolute;
    inset: 0 18% auto;
    height: 16%;
    border-radius: 3px;
    background: var(--text);
    opacity: 0.85;
  }
  span {
    position: absolute;
    inset: 12% 0 0;
    border-radius: 22% 22% 18% 18%;
    background: ${({ $tone }) => $tone};
  }
  span::after {
    content: '';
    position: absolute;
    inset: 34% 0 auto;
    height: 30%;
    background: rgba(255, 250, 240, 0.9);
  }
`;

const Toast = styled.div`
  position: absolute;
  right: 5%;
  bottom: 16%;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem 0.5rem 0.5rem;
  border-radius: 0.75rem;
  background: var(--material-heavy);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  box-shadow: var(--shadow-float), inset 0 0 0 1px var(--material-edge);
  font-size: 0.625rem;
  line-height: 1.3;
  color: var(--text-secondary);

  i {
    display: grid;
    place-items: center;
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 0.4375rem;
    background: var(--chili);
    color: #fff;
  }
  strong {
    display: block;
    font-size: 0.6875rem;
    color: var(--text);
  }
`;

export const StorefrontIllustration = () => (
  <Store aria-hidden="true">
    <StoreNav>
      <strong>Hanawari</strong>
      <Bar $h={4} $w={8} />
      <Bar $h={4} $w={8} />
      <Bar $h={4} $w={8} />
      <Status $tone="var(--chili)" style={{ width: 12, height: 12 }} />
    </StoreNav>
    <Products>
      {['var(--chili)', 'var(--mango)', 'var(--verde)'].map((tone) => (
        <Product key={tone}>
          <Jar $tone={tone}><span /></Jar>
          <Bar $h={4} $w={75} />
          <Bar $h={4} $w={40} $tone="var(--fill)" />
          <Bar $h={10} $w={100} $tone={tone} style={{ marginTop: 4, opacity: 0.9 }} />
        </Product>
      ))}
    </Products>
    <Toast>
      <i><FiMail size={12} /></i>
      <span>
        <strong>Order confirmed</strong>
        Receipt sent to your inbox
      </span>
    </Toast>
  </Store>
);
