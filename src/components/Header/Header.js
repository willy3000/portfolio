import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FiArrowRight, FiMoon, FiSun } from 'react-icons/fi';

import { profile } from '../../constants/constants';
import { createSprings, prefersReducedMotion } from '../../lib/motion';
import Button from '../../styles/GlobalComponents/Button';
import {
  Actions, Bar, Brand, IconButton, Inner, Links, Menu, MenuButton, Monogram, NavLink, Pill,
} from './HeaderStyles';

const SECTIONS = [
  { id: 'work', label: 'Work' },
  { id: 'experience', label: 'Experience' },
  { id: 'capabilities', label: 'Capabilities' },
  { id: 'contact', label: 'Contact' },
];

const setTheme = (theme) => {
  const root = document.documentElement;
  root.classList.add('theme-transition');
  root.dataset.theme = theme;
  window.setTimeout(() => root.classList.remove('theme-transition'), 450);
};

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const itemRefs = useRef({});
  const pillRef = useRef(null);
  const pill = useRef(null);
  const hovered = useRef(null);
  const menuRef = useRef(null);
  const menuButtonRef = useRef(null);
  const menu = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Scroll spy: the section crossing the middle of the viewport is current.
  useEffect(() => {
    const targets = ['top', ...SECTIONS.map((s) => s.id)]
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id === 'top' ? null : entry.target.id);
        });
      },
      { rootMargin: '-45% 0px -54% 0px' }
    );
    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
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
    if (!hovered.current) movePill(active);
  }, [active, movePill]);

  const onLinkEnter = (id) => {
    hovered.current = id;
    movePill(id);
  };
  const onLinksLeave = () => {
    hovered.current = null;
    movePill(active);
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

  // Follow the system theme until the visitor picks one.
  useEffect(() => {
    const query = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = (e) => {
      let stored = null;
      try { stored = localStorage.getItem('theme'); } catch (err) { /* storage unavailable */ }
      if (!stored) setTheme(e.matches ? 'dark' : 'light');
    };
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  const toggleTheme = () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    try { localStorage.setItem('theme', next); } catch (err) { /* storage unavailable */ }
  };

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
                  aria-current={active === id}
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
            <IconButton type="button" onClick={toggleTheme} aria-label="Toggle colour theme">
              <FiSun className="icon-sun" aria-hidden="true" />
              <FiMoon className="icon-moon" aria-hidden="true" />
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
