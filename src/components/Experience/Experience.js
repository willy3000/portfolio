import React from 'react';
import { FiArrowUpRight } from 'react-icons/fi';

import { education, experience, profile } from '../../constants/constants';
import {
  Container, Eyebrow, Lead, Section,
} from '../../styles/GlobalComponents';
import { TextLink } from '../Projects/ProjectsStyles';
import Reveal from '../Reveal/Reveal';
import {
  Aside, AsideTitle, Company, Education, Highlights, Layout, Period, Role, RoleHead, RoleTitle, School, Timeline,
} from './ExperienceStyles';

const Experience = () => (
  <Section id="experience">
    <Container>
      <Layout>
        <Aside>
          <Reveal>
            <Eyebrow>Experience</Eyebrow>
            <AsideTitle>
              Four teams.
              <br />
              One standard.
            </AsideTitle>
            <Lead>
              Frontend-leaning full-stack work, from data-processing systems to multi-surface
              marketplaces.
            </Lead>
            <div style={{ marginTop: '1.75rem' }}>
              <TextLink href={profile.resume} target="_blank" rel="noopener noreferrer">
                <span>Full résumé</span>
                <FiArrowUpRight aria-hidden="true" />
              </TextLink>
            </div>
          </Reveal>
        </Aside>

        <div>
          <Timeline>
            {experience.map((job) => (
              <Reveal as={Role} key={job.company} data-current={Boolean(job.current)}>
                <RoleHead>
                  <Company>{job.company}</Company>
                  <Period>{job.period}</Period>
                </RoleHead>
                <RoleTitle>
                  <strong>{job.role}</strong> · {job.location}
                </RoleTitle>
                <Highlights>
                  {job.highlights.map((item) => <li key={item}>{item}</li>)}
                </Highlights>
              </Reveal>
            ))}
          </Timeline>

          <Reveal as={Education}>
            <h3>Education</h3>
            {education.map(({ school, program, period }) => (
              <School key={school}>
                <p>
                  {school}
                  <span> · {program}</span>
                </p>
                <Period>{period}</Period>
              </School>
            ))}
          </Reveal>
        </div>
      </Layout>
    </Container>
  </Section>
);

export default Experience;
