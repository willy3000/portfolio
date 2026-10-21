import React from 'react';
import { FiArrowUpRight, FiLock } from 'react-icons/fi';

import { projects } from '../../constants/constants';
import { Layer } from '../../styles/GlobalComponents';
import {
  Badge, Body, Contributions, Frame, FrameBar, Links, Media, Meta, Note, Panel, Role, Summary, Tab, Tabs,
  TabsBar, Tags, TextLink, Title, Url,
} from './ShowcaseStyles';

const pad = (n) => String(n).padStart(2, '0');
const first = `project-${projects[0].id}`;
const last = `project-${projects[projects.length - 1].id}`;

// One stop per project. On stage, the screenshot is a 3D plate that breaks
// into particles and reforms as the next project, crossing sides as it goes;
// the text here sits opposite it. Off stage, each project is a normal block
// with its screenshot.
const Showcase = () => (
  <Layer aria-label="Projects">
    <TabsBar data-span={`${first}:${last}`}>
      <Tabs aria-label="Jump to project">
        <li className="mono" aria-hidden="true">~/work</li>
        {projects.map((project, i) => (
          <li key={project.id}>
            <Tab href={`#project-${project.id}`} data-index-for={`project-${project.id}`}>
              <span className="mono">{pad(i + 1)}</span>
              {project.title}
            </Tab>
          </li>
        ))}
      </Tabs>
    </TabsBar>

    {projects.map((project, i) => {
      const {
        id, title, context, period, status, summary, tags, url, image, links = [], note, role, contributions = [],
      } = project;
      return (
        <Panel
          key={id}
          id={`project-${id}`}
          data-stop={`project-${id}`}
          $side={i % 2 === 0 ? 'left' : 'right'}
          data-side={i % 2 === 0 ? 'left' : 'right'}
          aria-labelledby={`project-${id}-title`}
        >
          <Body>
            <Meta className="mono">
              <span>{pad(i + 1)} / {pad(projects.length)}</span>
              <span>{context}</span>
              <span>{period}</span>
              {status && <Badge>{status}</Badge>}
            </Meta>
            <Title id={`project-${id}-title`}>{title}</Title>
            <Summary>{summary}</Summary>

            {role && (
              <Role>
                <span className="mono">My role</span>
                {role}
              </Role>
            )}
            {contributions.length > 0 && (
              <Contributions>
                {contributions.map((item) => <li key={item}>{item}</li>)}
              </Contributions>
            )}

            <Tags aria-label="Built with">
              {tags.map((tag) => <li key={tag} className="mono">{tag}</li>)}
            </Tags>

            <Links>
              {links.map(({ label, href }) => (
                <TextLink key={href} href={href} target="_blank" rel="noopener noreferrer">
                  <span>{label}</span>
                  <FiArrowUpRight aria-hidden="true" />
                  <span className="visually-hidden">(opens in a new tab)</span>
                </TextLink>
              ))}
              {note && (
                <Note>
                  <FiLock aria-hidden="true" />
                  {note}
                </Note>
              )}
            </Links>
          </Body>

          <Media>
            <Frame>
              <FrameBar aria-hidden="true">
                <i><b /><b /><b /></i>
                <Url>
                  <FiLock />
                  {url}
                </Url>
              </FrameBar>
              <img
                src={image.src}
                width={image.width}
                height={image.height}
                alt={`${title} interface`}
                loading="lazy"
                decoding="async"
              />
            </Frame>
          </Media>
        </Panel>
      );
    })}
  </Layer>
);

export default Showcase;
