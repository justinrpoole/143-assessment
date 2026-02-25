'use client';

import { useState } from 'react';

/**
 * Psychometric Validity Summary — Enterprise credibility section.
 * Shows the research foundation, measurement model, and construct
 * validity evidence for the 143 Leadership Assessment.
 */

const RESEARCH_PILLARS = [
  { name: 'Lisa Feldman Barrett', domain: 'Constructed Emotion', rays: 'R2, R3, R6', citation: 'Barrett, L. F. (2017). How Emotions Are Made. Houghton Mifflin Harcourt.', contribution: 'Emotions are constructed predictions, not fixed reactions. The assessment measures regulation capacity, not emotional types.' },
  { name: 'Katy Milkman', domain: 'Behavioral Change', rays: 'R1, R4', citation: 'Milkman, K. (2021). How to Change. Portfolio/Penguin.', contribution: 'Temptation bundling, fresh starts, and commitment devices. The rep system uses these mechanisms to lower the barrier to consistent practice.' },
  { name: 'Caroline Leaf', domain: 'Neuroplasticity', rays: 'R1, R3, R8', citation: 'Leaf, C. (2021). Cleaning Up Your Mental Mess. Baker Books.', contribution: 'Neuroplasticity research supports that thought patterns respond to deliberate practice. Scores are designed to move, not remain fixed.' },
  { name: 'Amishi Jha', domain: 'Attention Science', rays: 'R3, R5', citation: 'Jha, A. P. (2021). Peak Mind. HarperOne. Based on Jha et al. (2015, 2017).', contribution: 'Attention is a depletable resource that responds to training. The Presence ray measures attentional capacity under real conditions.' },
  { name: 'BJ Fogg', domain: 'Behavior Design', rays: 'R1, R4', citation: 'Fogg, B. J. (2020). Tiny Habits. Houghton Mifflin Harcourt.', contribution: 'Behavior change through minimum effective dose. The Rise Path prescribes the smallest viable rep using Fogg\u2019s Behavior Model (B = MAP).' },
  { name: 'Daniel Goleman', domain: 'Emotional Intelligence', rays: 'R3, R6, R7', citation: 'Goleman, D. (1995). Emotional Intelligence. Bantam Books.', contribution: 'Self-awareness, self-regulation, social awareness, and relationship management principles inform the design of Rays 3, 6, and 7.' },
  { name: 'Christina Maslach', domain: 'Burnout Research', rays: 'Eclipse', citation: 'Maslach, C. & Leiter, M. P. (2016). Burnout. In Stress: Concepts, Cognition, Emotion, and Behavior. Academic Press.', contribution: 'Three-dimensional burnout model. The Eclipse system measures emotional load, cognitive load, and relational load as temporary capacity reducers.' },
  { name: 'Carol Dweck', domain: 'Growth Mindset', rays: 'R8, R9', citation: 'Dweck, C. S. (2006). Mindset: The New Psychology of Success. Random House.', contribution: 'Fixed vs. growth orientation. The assessment treats capacity as trainable \u2014 scores are designed to move with deliberate practice.' },
  { name: 'Angela Duckworth', domain: 'Grit & Perseverance', rays: 'R4, R5', citation: 'Duckworth, A. L. et al. (2007). Grit. J. of Personality and Social Psychology, 92(6), 1087\u20131101.', contribution: 'Sustained effort toward long-term goals. Power and Purpose rays measure consistency of action under pressure.' },
  { name: 'Amy Edmondson', domain: 'Psychological Safety', rays: 'R7, R9', citation: 'Edmondson, A. C. (1999). Psychological safety. Administrative Science Quarterly, 44(2), 350\u2013383.', contribution: 'Team-level trust and candor. Connection and Be The Light measure capacity to create conditions where others can speak honestly.' },
  { name: 'Edward Deci', domain: 'Self-Determination', rays: 'R5, R6', citation: 'Deci, E. L. & Ryan, R. M. (2000). American Psychologist, 55(1), 68\u201378.', contribution: 'Autonomy, competence, and relatedness as basic psychological needs. Intrinsic motivation mapped through Purpose and Authenticity.' },
  { name: 'Richard Ryan', domain: 'Self-Determination', rays: 'R5, R6, R7', citation: 'Ryan, R. M. & Deci, E. L. (2017). Self-Determination Theory. Guilford Press.', contribution: 'Basic psychological needs theory. Satisfaction of autonomy, competence, and relatedness drives sustained growth.' },
];

const MODEL_STATS = [
  { label: 'Rays Measured', value: '9', detail: 'Trainable leadership capacities across 3 developmental phases' },
  { label: 'Subfacets', value: '36', detail: '4 subfacets per ray for granular coaching precision' },
  { label: 'Assessment Items', value: '143', detail: 'Full instrument (43-item weekly retake available)' },
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
              <p
                className="text-[9px] mt-1.5 leading-snug italic"
                style={{ color: 'var(--text-on-dark-muted, rgba(255,255,255,0.4))' }}
              >
                {pillar.citation}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
