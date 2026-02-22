'use client';

import { useState } from 'react';

/**
 * Psychometric Validity Summary — Enterprise credibility section.
 * Shows the research foundation, measurement model, and construct
 * validity evidence for the 143 Leadership Assessment.
 */

const RESEARCH_PILLARS = [
  { name: 'Lisa Feldman Barrett', domain: 'Constructed Emotion', rays: 'R2, R3, R6', contribution: 'Emotions are constructed predictions, not fixed reactions. The assessment measures regulation capacity, not emotional "types."' },
  { name: 'Katy Milkman', domain: 'Behavioral Change', rays: 'R1, R4', contribution: 'Temptation bundling, fresh starts, and commitment devices. The rep system and if/then plans use these mechanisms.' },
  { name: 'Caroline Leaf', domain: 'Neuroplasticity', rays: 'R1, R3, R8', contribution: 'Thought patterns are trainable. Scores are designed to move through deliberate practice, not remain fixed.' },
  { name: 'Amishi Jha', domain: 'Attention Science', rays: 'R3, R5', contribution: 'Attention is a depletable resource that responds to training. The Presence ray measures attentional capacity.' },
  { name: 'BJ Fogg', domain: 'Tiny Habits', rays: 'R1, R4', contribution: 'Behavior change through minimum effective dose. The Rise Path prescribes the smallest viable rep.' },
  { name: 'Daniel Goleman', domain: 'Emotional Intelligence', rays: 'R3, R6, R7', contribution: 'Self-awareness, self-regulation, social awareness, relationship management. Four pillars mapped across rays.' },
  { name: 'Christina Maslach', domain: 'Burnout Research', rays: 'Eclipse', contribution: 'Three-dimensional burnout model. The Eclipse system measures emotional load, cognitive load, and relational load.' },
  { name: 'Carol Dweck', domain: 'Growth Mindset', rays: 'R8, R9', contribution: 'Fixed vs. growth orientation. The assessment treats capacity as trainable — scores move with practice.' },
  { name: 'Angela Duckworth', domain: 'Grit & Perseverance', rays: 'R4, R5', contribution: 'Sustained effort toward long-term goals. Power and Purpose rays measure consistency of action under pressure.' },
  { name: 'Amy Edmondson', domain: 'Psychological Safety', rays: 'R7, R9', contribution: 'Team-level trust and candor. Connection and Be The Light measure capacity to hold safe space.' },
  { name: 'Edward Deci', domain: 'Self-Determination', rays: 'R5, R6', contribution: 'Autonomy, competence, relatedness. Intrinsic motivation mapped through Purpose and Authenticity.' },
  { name: 'Richard Ryan', domain: 'Self-Determination', rays: 'R5, R6, R7', contribution: 'Basic psychological needs theory. Satisfaction of autonomy, competence, and relatedness drives sustained growth.' },
];

const MODEL_STATS = [
  { label: 'Rays Measured', value: '9', detail: 'Trainable leadership capacities across 3 developmental phases' },
  { label: 'Subfacets', value: '36', detail: '4 subfacets per ray for granular coaching precision' },
  { label: 'Assessment Items', value: '143', detail: 'Full instrument (43-item monthly retake available)' },
  { label: 'Executive Signals', value: '24', detail: 'Behavioral markers derived from ray + tool composites' },
  { label: 'Question Types', value: '3', detail: 'Frequency scales, scenario cards, and open reflections' },
  { label: 'Validity Checks', value: '9', detail: 'Social desirability, consistency, speeding, attention, and more' },
];

const DESIGN_PRINCIPLES = [
  {
    title: 'Capacity-Based, Not Trait-Based',
    description: 'Scores represent current capacity levels that respond to training — not fixed personality traits. Retake assessments are designed to show measurable movement.',
  },
  {
    title: 'Three-Phase Developmental Model',
    description: 'Reconnect (R1-R3) builds internal foundation. Radiate (R4-R6) drives external action. Become (R7-R9) extends impact to others. Phases are sequential and cumulative.',
  },
  {
    title: 'Eclipse System (Load Measurement)',
    description: 'Adapted from Maslach\'s burnout model. Measures emotional, cognitive, and relational load as temporary capacity reducers — not personal deficits.',
  },
  {
    title: 'Confidence-Banded Scoring',
    description: 'Every score includes a confidence band (HIGH / MODERATE / LOW) derived from response quality checks. Results are gated when data quality is insufficient.',
  },
  {
    title: 'No-Shame Reporting',
    description: 'Report language adapts to eclipse level. High-load users receive simplified, grounding guidance. No deficit framing, no comparison rankings.',
  },
];

export default function PsychometricSummary() {
  const [showPillars, setShowPillars] = useState(false);

  return (
    <section className="space-y-4">
      {/* Header card */}
      <div className="glass-card p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p
              className="text-[10px] font-bold uppercase tracking-widest"
              style={{ color: 'var(--brand-gold, #F8D011)' }}
            >
              Measurement Model
            </p>
            <h3
              className="mt-1 text-base font-semibold sm:text-lg"
              style={{ color: 'var(--text-on-dark)' }}
            >
              Psychometric Foundation
            </h3>
            <p
              className="mt-1 text-xs leading-relaxed"
              style={{ color: 'var(--text-on-dark-secondary)' }}
            >
              The 143 Leadership Assessment is grounded in 12 peer-reviewed research pillars spanning
              neuroscience, behavioral science, and organizational psychology. The instrument
              measures trainable capacities — not fixed traits — through a confidence-banded
              scoring system with 9 built-in validity checks.
            </p>
          </div>
        </div>

        {/* Model stats grid */}
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {MODEL_STATS.map((stat) => (
            <div
              key={stat.label}
              className="rounded-lg p-3 text-center"
              style={{
                background: 'rgba(96, 5, 141, 0.2)',
                border: '1px solid rgba(148, 80, 200, 0.15)',
              }}
            >
              <p
                className="text-xl font-bold"
                style={{ color: 'var(--brand-gold, #F8D011)' }}
              >
                {stat.value}
              </p>
              <p
                className="text-[10px] font-semibold uppercase tracking-wider mt-0.5"
                style={{ color: 'var(--text-on-dark)' }}
              >
                {stat.label}
              </p>
              <p
                className="text-[9px] mt-1 leading-tight"
                style={{ color: 'var(--text-on-dark-muted)' }}
              >
                {stat.detail}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Design principles */}
      <div className="glass-card p-5 sm:p-6 space-y-3">
        <p
          className="text-[10px] font-bold uppercase tracking-widest"
          style={{ color: 'var(--brand-gold, #F8D011)' }}
        >
          Construct Design
        </p>
        {DESIGN_PRINCIPLES.map((principle) => (
          <div
            key={principle.title}
            className="rounded-lg p-3"
            style={{
              background: 'rgba(96, 5, 141, 0.12)',
              border: '1px solid rgba(148, 80, 200, 0.1)',
            }}
          >
            <p
              className="text-sm font-medium"
              style={{ color: 'var(--text-on-dark)' }}
            >
              {principle.title}
            </p>
            <p
              className="text-xs mt-1 leading-relaxed"
              style={{ color: 'var(--text-on-dark-secondary)' }}
            >
              {principle.description}
            </p>
          </div>
        ))}
      </div>

      {/* Research pillars (expandable) */}
      <button
        onClick={() => setShowPillars(!showPillars)}
        className="w-full glass-card p-5 text-left"
        aria-expanded={showPillars}
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <p
              className="text-[10px] font-bold uppercase tracking-widest"
              style={{ color: 'var(--brand-gold, #F8D011)' }}
            >
              Research Foundation
            </p>
            <p
              className="text-sm font-medium mt-1"
              style={{ color: 'var(--text-on-dark)' }}
            >
              12 Peer-Reviewed Research Pillars
            </p>
            <p
              className="text-xs mt-0.5"
              style={{ color: 'var(--text-on-dark-muted)' }}
            >
              {showPillars ? 'Collapse' : 'Expand'} to see each researcher and their contribution to the model
            </p>
          </div>
          <span
            className="text-xs transition-transform"
            style={{
              color: 'var(--text-on-dark-muted)',
              transform: showPillars ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
            aria-hidden="true"
          >
            &#9660;
          </span>
        </div>
      </button>

      {showPillars && (
        <div className="space-y-2">
          {RESEARCH_PILLARS.map((pillar) => (
            <div
              key={pillar.name}
              className="rounded-lg px-4 py-3 border"
              style={{
                background: 'rgba(96, 5, 141, 0.1)',
                borderColor: 'rgba(148, 80, 200, 0.12)',
              }}
            >
              <div className="flex items-baseline justify-between gap-2 mb-1">
                <span
                  className="text-sm font-medium"
                  style={{ color: 'var(--text-on-dark)' }}
                >
                  {pillar.name}
                </span>
                <span
                  className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full shrink-0"
                  style={{
                    background: 'rgba(248, 208, 17, 0.12)',
                    color: 'var(--brand-gold, #F8D011)',
                  }}
                >
                  {pillar.rays}
                </span>
              </div>
              <p
                className="text-[10px] font-semibold uppercase tracking-wider mb-1"
                style={{ color: 'var(--brand-gold, #F8D011)' }}
              >
                {pillar.domain}
              </p>
              <p
                className="text-xs leading-relaxed"
                style={{ color: 'var(--text-on-dark-secondary)' }}
              >
                {pillar.contribution}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
