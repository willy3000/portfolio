import React from 'react';

import { Section, SectionText, SectionTitle, Link } from '../../styles/GlobalComponents';
import Button from '../../styles/GlobalComponents/Button';
import { LeftSection } from './HeroStyles';

const Hero = (props) => (
  <>
    <Section row nopadding>
      <LeftSection>
        <SectionTitle main center>
          Hey there,
        </SectionTitle>
        <SectionText>
          Hey there, I'm Willy Wario. I am a Fullstack Developer currently focused in Frontend Development with ReactJS/NextJS. I'm also current with backend frameworks such as Express and SpringBoot with databases such as mySQL, postgresql and MongoDB.
        </SectionText>
        <Button onClick={(e) => {
          e.preventDefault();
          window.location.href = '/files/resume-wario.pdf';
        }}>My Resume</Button>
      </LeftSection>
    </Section>
  </>
);

export default Hero;
