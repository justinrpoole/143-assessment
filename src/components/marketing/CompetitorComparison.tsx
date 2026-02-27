'use client';

import { FadeInSection } from '@/components/ui/FadeInSection';

const COMPETITORS = [
  { name: '143 Leadership', highlight: true },
  { name: 'MBTI', highlight: false },
  { name: 'DISC', highlight: false },
  { name: 'CliftonStrengths', highlight: false },
  { name: 'Hogan', highlight: false },
  { name: 'BetterUp', highlight: false },
];

const DIMENSIONS = [
  {
    label: 'Dynamic measurement',
    values: [true, false, false, false, false, false],
  },
  {
    label: 'Daily practice system',
    values: [true, false, false, false, false, false],
  },
  {
    label: 'Measures change over time',
    values: [true, false, false, false, false, false],
  },
  {
    label: 'Compassion-centered',
    values: [true, false, false, false, false, false],
  },
  {
    label: 'Neurodivergent-friendly',
    values: [true, false, false, false, false, false],
  },
  {
    label: 'Trainable capacities',
    values: [true, false, false, true, false, false],
  },
  {
    label: 'Light + shadow model',
    values: [true, false, false, false, true, false],
  },
  {
    label: 'Self-directed (no coach required)',
    values: [true, false, false, false, false, false],
  },
  {
    label: 'Retakeable by design',
    values: [true, false, false, false, false, false],
  },
  {
    label: 'Under $50 entry',
    values: [true, false, true, false, false, false],
  },
];

const HOW_THEY_SEE_YOU = [
  { name: '143 Leadership', quote: '"Your Presence is at 72 Shine right now. Here\'s your practice for this week."' },
  { name: 'MBTI', quote: '"You\'re an INTJ."' },
  { name: 'CliftonStrengths', quote: '"Your top strength is Strategic."' },
  { name: 'Hogan', quote: '"Your derailment risk is Bold."' },
  { name: 'DISC', quote: '"You\'re a high D."' },
  { name: 'Enneagram', quote: '"You\'re a 3w4."' },
];

export default function CompetitorComparison() {
  return (
    <div className="space-y-10">
      {/* ── How They See You ── */}
      <div className="space-y-4">
        <p
          className="text-xs font-bold uppercase tracking-widest"
          style={{ color: 'var(--brand-gold, #F8D011)' }}
        >
          How They See You
        </p>
        <h3
          className="text-xl font-bold sm:text-2xl"
          style={{ color: 'var(--text-on-dark, #FFFEF5)' }}
        >
          Not a label. A live measurement.
        </h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {HOW_THEY_SEE_YOU.map((item) => (
            <div
              key={item.name}
              className={`glass-card p-4 ${item.name === '143 Leadership' ? 'glass-card--executive' : ''}`}
              style={item.name === '143 Leadership' ? { border: '1.5px solid #F8D011' } : undefined}
            >
              <p
                className="text-[10px] font-bold uppercase tracking-widest"
                style={{
                  color: item.name === '143 Leadership' ? '#F8D011' : 'rgba(255,255,255,0.4)',
                }}
              >
                {item.name}
              </p>
              <p
                className="mt-2 text-sm leading-relaxed italic"
                style={{
                  color: item.name === '143 Leadership'
                    ? 'var(--text-on-dark, #FFFEF5)'
                    : 'var(--text-on-dark-muted, rgba(255,255,255,0.5))',
                }}
              >
                {item.quote}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Comparison Table ── */}
      <div className="glass-card overflow-x-auto p-0">
        <table className="w-full min-w-[700px] text-sm">
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <th
                className="px-4 py-3 text-left text-xs font-bold uppercase tracking-widest"
                style={{ color: 'var(--brand-gold, #F8D011)' }}
              >
                Dimension
              </th>
              {COMPETITORS.map((c) => (
                <th
                  key={c.name}
                  className="px-3 py-3 text-center text-[10px] font-bold uppercase tracking-widest"
                  style={{
                    color: c.highlight ? '#F8D011' : 'rgba(255,255,255,0.4)',
                  }}
                >
                  {c.name === '143 Leadership' ? '143' : c.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DIMENSIONS.map((dim, i) => (
              <tr
                key={dim.label}
                style={{
                  borderBottom:
                    i < DIMENSIONS.length - 1
                      ? '1px solid rgba(255,255,255,0.06)'
                      : 'none',
                }}
              >
                <td
                  className="px-4 py-3 text-sm"
                  style={{ color: 'var(--text-on-dark, #FFFEF5)' }}
                >
                  {dim.label}
                </td>
                {dim.values.map((val, j) => (
                  <td key={j} className="px-3 py-3 text-center">
                    {val ? (
                      <span style={{ color: '#F8D011' }}>&#x25C6;</span>
                    ) : (
                      <span style={{ color: 'rgba(255,255,255,0.15)' }}>&#x2014;</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p
        className="text-center text-xs leading-relaxed"
        style={{ color: 'var(--text-on-dark-muted, rgba(255,255,255,0.5))' }}
      >
        Source: Published pricing and feature documentation for each platform as of 2025.
        CliftonStrengths measures strengths (partially trainable). Hogan measures light/dark side.
      </p>
    </div>
  );
}
