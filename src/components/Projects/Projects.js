import React from 'react';

import { projects } from '../../constants/constants';
import {
  Container, Eyebrow, Lead, Section, SectionHeader, SectionTitle,
} from '../../styles/GlobalComponents';
import Reveal from '../Reveal/Reveal';
import ProjectCard from './ProjectCard';
import { Grid } from './ProjectsStyles';

const Projects = () => (
  <Section id="work">
    <Container>
      <Reveal as={SectionHeader}>
        <Eyebrow>Selected work</Eyebrow>
        <SectionTitle>Built for production, not for the demo.</SectionTitle>
        <Lead>
          A selection of business platforms, internal tools and storefronts I’ve built or helped
          ship.
        </Lead>
      </Reveal>

      <Grid>
        {projects.map((project, index) => (
          <Reveal
            key={project.id}
            className={project.size === 'full' ? 'span-full' : undefined}
            delay={project.size === 'half' && index % 2 === 1 ? 100 : 0}
          >
            <ProjectCard project={project} />
          </Reveal>
        ))}
      </Grid>
    </Container>
  </Section>
);

export default Projects;
