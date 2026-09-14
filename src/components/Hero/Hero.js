import React from 'react';
import { FiArrowDown, FiArrowUpRight } from 'react-icons/fi';

import { facts, profile } from '../../constants/constants';
import { Container } from '../../styles/GlobalComponents';
import Button from '../../styles/GlobalComponents/Button';
import {
  Actions, Dot, Fact, Facts, Headline, HeroSection, Intro, Rise, Status,
} from './HeroStyles';

const Hero = () => (
  <HeroSection id="top">
    <Container>
      <Rise $i={0}>
        <Status>
          <Dot aria-hidden="true" />
          <span>
            Currently at <strong>Digital Realm Entertainment</strong>
          </span>
        </Status>
      </Rise>

      <Rise $i={1}>
        <Headline>
          I build web software <span>that holds up in production.</span>
        </Headline>
      </Rise>

      <Rise $i={2}>
        <Intro>
          I’m <strong>{profile.name}</strong>, a Kenyan software engineer currently working in
          Kigali, Rwanda. For more than five years I’ve shipped React, Next.js and TypeScript front
          ends on top of Node.js and REST APIs.
        </Intro>
      </Rise>

      <Rise $i={3}>
        <Actions>
          <Button href="#work">
            See selected work
            <FiArrowDown aria-hidden="true" />
          </Button>
          <Button $variant="secondary" href={profile.resume} target="_blank" rel="noopener noreferrer">
            Résumé
            <FiArrowUpRight aria-hidden="true" />
          </Button>
        </Actions>
      </Rise>

      <Rise $i={5}>
        <Facts>
          {facts.map(({ label, value }) => (
            <Fact key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </Fact>
          ))}
        </Facts>
      </Rise>
    </Container>
  </HeroSection>
);

export default Hero;
