import React from 'react';
import { FiArrowUpRight } from 'react-icons/fi';

import { education, profile } from '../../constants/constants';
import { jobs } from '../../experience/timeline';
import {
  Chip, Eyebrow, Layer, Lead, SectionTitle,
} from '../../styles/GlobalComponents';
import {
  Divider, Group, Highlights, Intro, Legend, Period, Rail, ResumeLink, Roles, School, Stop, WorkIntro,
} from './JourneyStyles';

const EDUCATION = { $tone: 'rgba(255, 210, 122, 0.14)', $color: '#ffd27a' };
const CURRENT = { $tone: 'rgba(154, 139, 255, 0.16)', $color: 'var(--violet)' };
const start = (period) => period.split(' – ')[0];

// Stops: an overview of the whole career network, education, a clear turn
// into work experience, then one stop per role, oldest first. Node colours
// match the chips: amber for education, cyan for work, violet for now.
const Journey = () => (
  <Layer id="experience" aria-labelledby="experience-title">
    <Intro data-stop="experience">
      <Eyebrow>Experience</Eyebrow>
      <SectionTitle id="experience-title">
        Where I studied, <em>and where I’ve worked.</em>
      </SectionTitle>
      <Lead>
        Education first, then four teams across Kenya and Rwanda: frontend-leaning full-stack
        work, from data-processing systems to multi-surface marketplaces.
      </Lead>
      <Legend aria-label="Key">
        <li><Chip {...EDUCATION}>Education</Chip></li>
        <li><Chip>Work experience</Chip></li>
        <li><Chip {...CURRENT}>Current role</Chip></li>
      </Legend>
      <ResumeLink href={profile.resume} target="_blank" rel="noopener noreferrer">
        Full résumé
        <FiArrowUpRight aria-hidden="true" />
      </ResumeLink>
    </Intro>

    <Stop data-stop="education" data-side="right">
      <Chip {...EDUCATION}>Education</Chip>
      <h3>Foundations</h3>
      {education.map(({ school, program, period }) => (
        <School key={school}>
          <strong>{school}</strong>
          <span>{program}</span>
          <span className="mono">{period}</span>
        </School>
      ))}
    </Stop>

    <WorkIntro data-stop="work-intro">
      <Chip>Work experience</Chip>
      <h3>
        Four teams. <em>One standard.</em>
      </h3>
      <p>Four roles since {start(jobs[0].period).slice(-4)}, oldest first.</p>
      <Roles>
        {jobs.map((job) => (
          <li key={job.company}>
            <span className="mono">{job.period}</span>
            <strong>{job.company}</strong>
            <span>{job.role}</span>
          </li>
        ))}
      </Roles>
    </WorkIntro>

    {jobs.map((job, k) => (
      <Stop key={job.company} data-stop={`job-${k}`} data-side={k % 2 === 0 ? 'left' : 'right'}>
        <Period>
          <Chip>Work experience · {k + 1} of {jobs.length}</Chip>
          {job.current && <Chip {...CURRENT}>Current</Chip>}
        </Period>
        <p className="mono">{job.period}</p>
        <h3>{job.company}</h3>
        <p>
          <strong>{job.role}</strong> · {job.location}
        </p>
        <Highlights>
          {job.highlights.map((item) => <li key={item}>{item}</li>)}
        </Highlights>
      </Stop>
    ))}

    <Rail aria-label="Career stops" data-span={`education:job-${jobs.length - 1}`}>
      <Group $color="#ffd27a">
        <span className="mono" aria-hidden="true">Education</span>
        <a href="#education" data-index-for="education">{start(education[0].period)}</a>
      </Group>
      <Divider aria-hidden="true" />
      <Group $color="var(--cyan)">
        <a href="#work-intro" className="mono" data-index-for="work-intro">Work</a>
        {jobs.map((job, k) => (
          <a key={job.company} href={`#job-${k}`} data-index-for={`job-${k}`}>
            {start(job.period)}
            <span className="visually-hidden">, {job.company}</span>
          </a>
        ))}
      </Group>
    </Rail>
  </Layer>
);

export default Journey;
