import React from 'react';
import { FiActivity, FiDatabase, FiLayout, FiRefreshCw } from 'react-icons/fi';

import { strengths, toolkit } from '../../constants/constants';
import {
  Container, Eyebrow, Lead, Section, SectionHeader, SectionTitle,
} from '../../styles/GlobalComponents';
import Reveal from '../Reveal/Reveal';
import {
  Icon, Spec, Specs, Strength, Strengths, Toolkit,
} from './CapabilitiesStyles';

const icons = {
  migrate: FiRefreshCw,
  debug: FiActivity,
  data: FiDatabase,
  interface: FiLayout,
};

const Capabilities = () => (
  <Section id="capabilities">
    <Container>
      <Reveal as={SectionHeader}>
        <Eyebrow>Capabilities</Eyebrow>
        <SectionTitle>Where I’m most useful.</SectionTitle>
        <Lead>The problems I’m usually trusted with, and the tools I use to solve them.</Lead>
      </Reveal>

      <Strengths>
        {strengths.map(({ icon, title, text }, index) => {
          const Glyph = icons[icon];
          return (
            <Reveal key={title} delay={(index % 2) * 100}>
              <Strength>
                <Icon aria-hidden="true"><Glyph /></Icon>
                <h3>{title}</h3>
                <p>{text}</p>
              </Strength>
            </Reveal>
          );
        })}
      </Strengths>

      <Reveal as={Toolkit}>
        <h3>Toolkit</h3>
        <Specs>
          {toolkit.map(({ label, items }) => (
            <Spec key={label}>
              <dt>{label}</dt>
              <dd>{items}</dd>
            </Spec>
          ))}
        </Specs>
      </Reveal>
    </Container>
  </Section>
);

export default Capabilities;
