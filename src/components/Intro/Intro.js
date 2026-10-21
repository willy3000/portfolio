import React from 'react';
import { FiArrowDown, FiArrowUpRight } from 'react-icons/fi';

import { facts, profile } from '../../constants/constants';
import { Layer } from '../../styles/GlobalComponents';
import Button from '../../styles/GlobalComponents/Button';
import {
  Actions, Caption, Copy, Cue, Dot, Fact, Facts, Frame, Headline, Kicker, Lede, Name, Status,
} from './IntroStyles';

// Stops: hero (the introduction beside the laptop), then the closed laptop
// alone at the centre, ready to open.
const Intro = () => (
  <Layer id="top" aria-labelledby="intro-title">
    <Frame>
      <Copy data-stop="hero">
        <Status className="mono">
          <Dot aria-hidden="true" />
          Currently at Digital Realm Entertainment
        </Status>

        <Name id="intro-title">
          {profile.name}
          <span className="visually-hidden">, {profile.role}</span>
        </Name>

        <Kicker className="mono" aria-hidden="true">
          {profile.role}
          <i />
          {profile.location}
        </Kicker>

        <Headline>
          I build web software <em>that holds up in production.</em>
        </Headline>

        <Lede>
          I’m a Kenyan software engineer currently working in Kigali, Rwanda. For more than five
          years I’ve shipped React, Next.js and TypeScript front ends on top of Node.js and REST APIs.
        </Lede>

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

        <Facts>
          {facts.map(({ label, value }) => (
            <Fact key={label}>
              <dt className="mono">{label}</dt>
              <dd>{value}</dd>
            </Fact>
          ))}
        </Facts>
      </Copy>

      <Cue className="mono" data-stop="hero" aria-hidden="true">
        <span>Scroll</span>
        <i />
      </Cue>
    </Frame>

    <Caption className="mono" data-stop="laptop" aria-hidden="true">
      <span>01</span>
      The workstation · scroll to open it
    </Caption>
  </Layer>
);

export default Intro;
