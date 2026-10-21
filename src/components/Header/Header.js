import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FiArrowRight, FiZap, FiZapOff } from 'react-icons/fi';

import { profile } from '../../constants/constants';
import {
  MOTION_EVENT, SECTION_EVENT, getMotion, setMotion,
} from '../../experience/story';
import { createSprings, prefersReducedMotion } from '../../lib/motion';
import Button from '../../styles/GlobalComponents/Button';
import {
  Actions, Bar, Brand, IconButton, Inner, Links, Menu, MenuButton, Monogram, NavLink, Pill, Rail, RailFill,
} from './HeaderStyles';

const SECTIONS = [
  { id: 'work', label: 'Work' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
];

const CHAPTERS = [{ id: 'top', label: 'Intro' }, ...SECTIONS];

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [motionOn, setMotionOn] = useState(true);
  // While the journey runs it reports the section; otherwise use the spy.
  const [journeySection, setJourneySection] = useState(undefined);
  const section = journeySection !== undefined ? (journeySection === 'top' ? null : journeySection) : active;
  const fillRef = useRef(null);

  const itemRefs = useRef({});
  const pillRef = useRef(null);
  const pill = useRef(null);
  const hovered = useRef(null);
  const menuRef = useRef(null);
  const menuButtonRef = useRef(null);
  const menu = useRef(null);

  // One scroll listener: header material, scroll spy and journey progress.
  // Anchors sit where each chapter's content is fully formed, so the active
  // link is the last anchor above the middle of the viewport.
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      setScrolled(y > 8);
      const middle = window.innerHeight * 0.5;
      let current = null;
      SECTIONS.forEach(({ id }) => {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= middle) current = id;
      });
      setActive(current);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (fillRef.current) fillRef.current.style.transform = `scaleY(${max > 0 ? y / max : 0})`;
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, []);

  // Highlight pill that springs between links.
  useEffect(() => {
    const el = pillRef.current;
    pill.current = createSprings(
      { x: 0, width: 0, opacity: 0 },
      (v) => {
        el.style.transform = `translate3d(${v.x}px, 0, 0)`;
        el.style.width = `${v.width}px`;
        el.style.opacity = v.opacity;
      },
      { response: 0.35, dampingRatio: 1 }
    );
    return () => pill.current.stop();
  }, []);

  const movePill = useCallback((id) => {
    const springs = pill.current;
    const link = id && itemRefs.current[id];
    if (!springs) return;
    if (!link) {
      springs.to({ opacity: 0 });
      return;
    }
    const target = { x: link.offsetLeft, width: link.offsetWidth };
    // An invisible pill has no position worth animating from.
    if (springs.values.opacity < 0.05 || prefersReducedMotion()) springs.set(target);
    springs.to({ ...target, opacity: 1 });
  }, []);

  useEffect(() => {
    if (!hovered.current) movePill(section);
  }, [section, movePill]);

  const onLinkEnter = (id) => {
    hovered.current = id;
    movePill(id);
  };
  const onLinksLeave = () => {
    hovered.current = null;
    movePill(section);
  };

  // Mobile menu: one spring drives presence so it can reverse mid-flight.
  useEffect(() => {
    const el = menuRef.current;
    menu.current = createSprings(
      { p: 0 },
      ({ p }) => {
        el.style.opacity = p;
        el.style.visibility = p < 0.01 ? 'hidden' : 'visible';
        el.style.transform = prefersReducedMotion()
          ? 'none'
          : `translate3d(0, ${(1 - p) * -10}px, 0) scale(${0.95 + 0.05 * p})`;
      },
      { response: 0.32, dampingRatio: 1 }
    );
    return () => menu.current.stop();
  }, []);

  useEffect(() => {
    menu.current.to({ p: menuOpen ? 1 : 0 });
    if (!menuOpen) return undefined;

    const onKey = (e) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        menuButtonRef.current.focus();
      }
    };
    const onPointerDown = (e) => {
      if (!menuRef.current.contains(e.target) && !menuButtonRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    const onResize = () => window.innerWidth > 832 && setMenuOpen(false);

    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('resize', onResize);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('resize', onResize);
    };
  }, [menuOpen]);

  useEffect(() => {
    const sync = () => setMotionOn(getMotion());
    sync();
    window.addEventListener(MOTION_EVENT, sync);
    return () => window.removeEventListener(MOTION_EVENT, sync);
  }, []);

  useEffect(() => {
    const onSection = (event) => setJourneySection(event.detail);
    window.addEventListener(SECTION_EVENT, onSection);
    return () => window.removeEventListener(SECTION_EVENT, onSection);
  }, []);

  const toggleMotion = () => setMotion(!getMotion());

  return (
    <>
      <Bar data-scrolled={scrolled} data-menu={menuOpen}>
        <Inner aria-label="Primary">
          <Brand href="#top" aria-label={`${profile.name}, back to top`}>
            <Monogram aria-hidden="true">WW</Monogram>
            {profile.name}
          </Brand>

          <Links onPointerLeave={onLinksLeave}>
            <Pill ref={pillRef} aria-hidden="true" />
            {SECTIONS.map(({ id, label }) => (
              <li key={id}>
                <NavLink
                  href={`#${id}`}
                  ref={(node) => { itemRefs.current[id] = node; }}
                  aria-current={section === id}
                  onPointerEnter={() => onLinkEnter(id)}
                  onFocus={() => onLinkEnter(id)}
                  onBlur={onLinksLeave}
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </Links>

          <Actions>
            <IconButton
              type="button"
              onClick={toggleMotion}
              aria-pressed={motionOn}
              aria-label="3D scroll animation"
              title={motionOn ? 'Turn the 3D animation off' : 'Turn the 3D animation on'}
            >
              {motionOn ? <FiZap aria-hidden="true" /> : <FiZapOff aria-hidden="true" />}
            </IconButton>
            <Button className="resume" $size="sm" href={profile.resume} target="_blank" rel="noopener noreferrer">
              Résumé
            </Button>
            <MenuButton
              ref={menuButtonRef}
              type="button"
              aria-label="Menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span aria-hidden="true" />
              <span aria-hidden="true" />
            </MenuButton>
          </Actions>
        </Inner>
      </Bar>

      <Rail aria-label="Journey">
        <RailFill aria-hidden="true"><i ref={fillRef} /></RailFill>
        <ol>
          {CHAPTERS.map(({ id, label }, i) => (
            <li key={id}>
              <a href={`#${id}`} aria-current={(section || 'top') === id}>
                <span className="mono">{String(i + 1).padStart(2, '0')}</span>
                <span>{label}</span>
              </a>
            </li>
          ))}
        </ol>
      </Rail>

      <Menu id="mobile-menu" ref={menuRef} data-open={menuOpen}>
        {SECTIONS.map(({ id, label }) => (
          <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)}>
            {label}
            <FiArrowRight aria-hidden="true" />
          </a>
        ))}
        <Button className="resume" href={profile.resume} target="_blank" rel="noopener noreferrer">
          Download résumé
        </Button>
      </Menu>
    </>
  );
};

export default Header;
