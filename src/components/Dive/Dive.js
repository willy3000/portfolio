import React from 'react';
import { FiArrowDownRight } from 'react-icons/fi';

import { projects } from '../../constants/constants';
import { Layer, Lead, SectionTitle } from '../../styles/GlobalComponents';
import {
  Caption, Cover, Hint, Index, Inner, Window, WindowBar,
} from './DiveStyles';

const pad = (n) => String(n).padStart(2, '0');

// Stops: the lid opens with the project index on its display, then the
// camera moves in until the display is the page. The cover is real HTML:
// while the lid moves the engine maps it onto the 3D screen.
const Dive = () => (
  <Layer id="work" aria-labelledby="work-title">
    <Caption className="mono" data-stop="open" aria-hidden="true">
      <span>02</span>
      ~/work · four projects
    </Caption>

    <Cover data-screen-cover data-focus-stop="index">
      <Window>
        <WindowBar className="mono" aria-hidden="true">
          <i><b /><b /><b /></i>
          <span>willy@portfolio: ~/work</span>
          <span>{pad(projects.length)} projects</span>
        </WindowBar>

        <Inner>
          <p className="mono">Selected work</p>
          <SectionTitle id="work-title">
            Built for production, <em>not for the demo.</em>
          </SectionTitle>
          <Lead>
            A selection of business platforms, internal tools and storefronts I’ve built or helped
            ship.
          </Lead>

          <Index aria-label="Projects">
            {projects.map((project, i) => (
              <li key={project.id}>
                <a href={`#project-${project.id}`}>
                  <span className="mono">{pad(i + 1)}</span>
                  <strong>{project.title}</strong>
                  <span>{project.context} · {project.period}</span>
                  <FiArrowDownRight aria-hidden="true" />
                </a>
              </li>
            ))}
          </Index>

          <Hint className="mono" aria-hidden="true">Scroll to step inside</Hint>
        </Inner>
      </Window>
    </Cover>
  </Layer>
);

export default Dive;
