import React from 'react';
import { FiArrowUp } from 'react-icons/fi';

import { profile } from '../../constants/constants';
import { Container } from '../../styles/GlobalComponents';
import { FooterBar, Inner } from './FooterStyles';

const Footer = () => (
  <FooterBar>
    <Container>
      <Inner>
        <p>
          © {new Date().getFullYear()} {profile.name}. Designed and built in {profile.location}.
        </p>
        <a href="#top">
          Back to top
          <FiArrowUp aria-hidden="true" />
        </a>
      </Inner>
    </Container>
  </FooterBar>
);

export default Footer;
