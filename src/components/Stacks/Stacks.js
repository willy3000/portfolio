import React from 'react';

import { stacks } from '../../constants/constants';
import { LOGO_PATHS } from '../../experience/data/logoPaths';
import { Eyebrow, Layer, Lead, SectionTitle } from '../../styles/GlobalComponents';
import {
  Heading, Item, List, Mark,
} from './StacksStyles';

// Stop: the last technology bursts into a constellation of the rest of the
// toolkit. On stage the marks are particles and the engine pins each label
// under its mark; off stage this is a grid of the same marks as SVG.
const Stacks = () => (
  <Layer id="other-stacks" aria-labelledby="stacks-title">
    <Heading data-stop="stacks">
      <Eyebrow>Also in the toolkit</Eyebrow>
      <SectionTitle id="stacks-title">
        Other stacks <em>I use.</em>
      </SectionTitle>
      <Lead>Languages, frameworks and tools I work with alongside the core stack.</Lead>
    </Heading>

    <List>
      {stacks.map((item) => (
        <Item key={item.id} data-stack-label style={{ '--brand': item.color }}>
          <Mark aria-hidden="true">
            {item.mark ? (
              <span>{item.mark}</span>
            ) : (
              <svg viewBox="0 0 24 24" focusable="false"><path d={LOGO_PATHS[item.id]} /></svg>
            )}
          </Mark>
          <strong>{item.name}</strong>
          <span className="mono">{item.note}</span>
        </Item>
      ))}
    </List>
  </Layer>
);

export default Stacks;
