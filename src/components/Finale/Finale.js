import React, { useEffect, useRef, useState } from 'react';
import {
  FiArrowUp, FiCheck, FiCopy, FiFileText, FiGithub, FiLinkedin, FiMail, FiPhone,
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

import { profile } from '../../constants/constants';
import { Eyebrow, Layer } from '../../styles/GlobalComponents';
import Button from '../../styles/GlobalComponents/Button';
import {
  Channels, Content, CopyButton, EmailRow, Restart, Text, Title,
} from './FinaleStyles';

const channels = [
  { label: 'LinkedIn', href: profile.linkedin, Icon: FiLinkedin, external: true },
  { label: 'GitHub', href: profile.github, Icon: FiGithub, external: true },
  { label: 'WhatsApp', href: profile.whatsapp, Icon: FaWhatsapp, external: true },
  { label: profile.phone, href: profile.phoneHref, Icon: FiPhone },
  { label: 'Résumé', href: profile.resume, Icon: FiFileText, external: true },
];

// Stop: the career network gathers into a ring, the camera passes through
// it, and the journey resolves on a way to get in touch.
const Finale = () => {
  const [copied, setCopied] = useState(false);
  const timer = useRef(0);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
    } catch (err) {
      window.location.href = `mailto:${profile.email}`;
      return;
    }
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Layer id="contact" aria-labelledby="contact-title">
      <Content data-stop="contact">
        <Eyebrow>Contact</Eyebrow>
        <Title id="contact-title">
          Let’s build something <em>that lasts.</em>
        </Title>
        <Text>
          Whether it’s a role, a contract or a product that needs to ship, I’d like to hear about it.
        </Text>

        <EmailRow>
          <Button href={`mailto:${profile.email}`}>
            <FiMail aria-hidden="true" />
            {profile.email}
          </Button>
          <CopyButton type="button" onClick={copyEmail} data-copied={copied}>
            {copied ? <FiCheck aria-hidden="true" /> : <FiCopy aria-hidden="true" />}
            {copied ? 'Copied' : 'Copy email'}
          </CopyButton>
          <span className="visually-hidden" role="status" aria-live="polite">
            {copied ? 'Email address copied to clipboard' : ''}
          </span>
        </EmailRow>

        <Channels>
          {channels.map(({ label, href, Icon, external }) => (
            <li key={label}>
              <a href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                <Icon aria-hidden="true" />
                {label}
              </a>
            </li>
          ))}
        </Channels>

        <Restart href="#top">
          <FiArrowUp aria-hidden="true" />
          Back to the beginning
        </Restart>
      </Content>
    </Layer>
  );
};

export default Finale;
