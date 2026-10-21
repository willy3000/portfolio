import React, { useEffect, useRef, useState } from 'react';
import {
  FiActivity, FiDatabase, FiGrid, FiLayout, FiRefreshCw, FiX,
} from 'react-icons/fi';

import { skills, strengths, toolkit } from '../../constants/constants';
import {
  Eyebrow, Layer, Lead, SectionTitle,
} from '../../styles/GlobalComponents';
import {
  Chrome, Close, IndexList, Intro, Panel, Panels, Strength, Strengths, Spec, Specs, Toggle, Toolkit,
  ToolkitInner, UsedIn,
} from './SkillsStyles';

const icons = {
  migrate: FiRefreshCw,
  debug: FiActivity,
  data: FiDatabase,
  interface: FiLayout,
};

const pad = (n) => String(n).padStart(2, '0');
const firstSkill = `skill-${skills[0].id}`;
const lastSkill = `skill-${skills[skills.length - 1].id}`;

// Stops: the four project screens as one mosaic under the heading, then one
// stop per technology as the particles become each mark in turn. The labels
// are real text; the toolkit panel lists everything at once for anyone who
// would rather not scroll the sequence.
const Skills = () => {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef(null);
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    panelRef.current.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
        toggleRef.current.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <Layer id="skills" aria-labelledby="skills-title">
      <Intro data-stop="stack">
        <Eyebrow>Skills</Eyebrow>
        <SectionTitle id="skills-title">
          The stack <em>behind the work.</em>
        </SectionTitle>
        <Lead>
          Every project you just saw is built from the same short list of tools. Keep scrolling
          and each one takes shape, with where I’ve used it.
        </Lead>
      </Intro>

      <Panels>
        {skills.map((s, k) => (
          <Panel key={s.id} data-stop={`skill-${s.id}`} style={{ '--brand': s.color }}>
            <p className="mono">
              <span>{pad(k + 1)} / {pad(skills.length)}</span>
              {s.kind}
            </p>
            <h3>{s.name}</h3>
            <p>{s.text}</p>
            <UsedIn aria-label="Used in">
              {s.usedIn.map((u) => <li key={u} className="mono">{u}</li>)}
            </UsedIn>
          </Panel>
        ))}
      </Panels>

      <Chrome data-span={`${firstSkill}:${lastSkill}`}>
        <IndexList aria-label="Jump to a skill">
          {skills.map((s) => (
            <li key={s.id}>
              <a href={`#skill-${s.id}`} data-index-for={`skill-${s.id}`} style={{ '--brand': s.color }}>{s.name}</a>
            </li>
          ))}
        </IndexList>
        <Toggle
          ref={toggleRef}
          type="button"
          aria-expanded={open}
          aria-controls="toolkit"
          onClick={() => setOpen((v) => !v)}
        >
          <FiGrid aria-hidden="true" />
          Full toolkit
        </Toggle>
      </Chrome>

      <Toolkit
        id="toolkit"
        ref={panelRef}
        data-open={open}
        tabIndex={-1}
        aria-label="Full toolkit and strengths"
      >
        <ToolkitInner>
          <Close type="button" onClick={() => { setOpen(false); toggleRef.current.focus(); }}>
            <FiX aria-hidden="true" />
            <span className="visually-hidden">Close toolkit</span>
          </Close>

          <h3 className="mono">Toolkit</h3>
          <Specs>
            {toolkit.map(({ label, items }) => (
              <Spec key={label}>
                <dt>{label}</dt>
                <dd>{items}</dd>
              </Spec>
            ))}
          </Specs>

          <h3 className="mono">Where I’m most useful</h3>
          <Strengths>
            {strengths.map(({ icon, title, text }) => {
              const Glyph = icons[icon];
              return (
                <Strength key={title}>
                  <Glyph aria-hidden="true" />
                  <h4>{title}</h4>
                  <p>{text}</p>
                </Strength>
              );
            })}
          </Strengths>
        </ToolkitInner>
      </Toolkit>
    </Layer>
  );
};

export default Skills;
