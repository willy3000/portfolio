import React, { useRef } from 'react';
import { FiArrowUpRight, FiLock } from 'react-icons/fi';

import { useScrollProgress, useTilt } from '../../lib/motion';
import { StorefrontIllustration, SurfacesIllustration } from './Illustrations';
import {
  Badge, Body, Card, Frame, FrameBar, Links, Meta, Note, Stage, Summary, Tags, TextLink, Title, Url,
} from './ProjectsStyles';

const illustrations = {
  surfaces: SurfacesIllustration,
  storefront: StorefrontIllustration,
};

const ProjectCard = ({ project }) => {
  const {
    title, context, period, status, summary, tags, url, image, illustration, links = [], note, size,
  } = project;
  const full = size === 'full';
  const cardRef = useRef(null);
  const stageRef = useRef(null);
  const frameRef = useRef(null);
  const Illustration = illustrations[illustration];

  useTilt(cardRef, frameRef);

  // Large screenshots stand up from a tilt as they scroll into view.
  useScrollProgress(
    stageRef,
    (progress) => {
      const stage = stageRef.current;
      if (window.innerWidth < 832) {
        stage.style.transform = '';
        return;
      }
      stage.style.transform = `perspective(1800px) rotateX(${(1 - progress) * 16}deg) scale(${0.94 + 0.06 * progress})`;
    },
    { enabled: full, endAt: 0.45 }
  );

  const heading = (
    <div>
      <Meta>
        <span>{context}</span>
        <span aria-hidden="true">·</span>
        <span>{period}</span>
        {status && <Badge>{status}</Badge>}
      </Meta>
      <Title $full={full}>{title}</Title>
    </div>
  );

  const details = (
    <div>
      <Summary $full={full}>{summary}</Summary>
      <Tags aria-label="Built with">
        {tags.map((tag) => <li key={tag}>{tag}</li>)}
      </Tags>
      <Links>
        {links.map(({ label, href }) => (
          <TextLink key={href} href={href} target="_blank" rel="noopener noreferrer">
            <span>{label}</span>
            <FiArrowUpRight aria-hidden="true" />
          </TextLink>
        ))}
        {note && (
          <Note>
            <FiLock aria-hidden="true" />
            {note}
          </Note>
        )}
      </Links>
    </div>
  );

  return (
    <Card ref={cardRef}>
      <Body $full={full}>
        {heading}
        {details}
      </Body>

      <Stage ref={stageRef} $full={full}>
        <Frame ref={frameRef}>
          {url && (
            <FrameBar aria-hidden="true">
              <i><b /><b /><b /></i>
              <Url>
                <FiLock />
                {url}
              </Url>
            </FrameBar>
          )}
          {image ? (
            <img
              src={image.src}
              width={image.width}
              height={image.height}
              alt={`${title} interface`}
              loading="lazy"
              decoding="async"
            />
          ) : (
            Illustration && <Illustration />
          )}
        </Frame>
      </Stage>
    </Card>
  );
};

export default ProjectCard;
