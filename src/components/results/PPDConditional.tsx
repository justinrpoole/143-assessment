'use client';

import type { ActingVsCapacityOutput } from '@/lib/types';

interface Props {
  acting: ActingVsCapacityOutput;
}

export default function PPDConditional({ acting }: Props) {
  // Only render if PPD is flagged or watched
  if (acting.status === 'CLEAR') return null;

  return (
    <section>
      <div
        className="rounded-xl p-5"
        style={{
          background: acting.status === 'FLAGGED'
            ? 'rgba(255, 207, 0, 0.08)'
            : 'var(--surface-glass)',
          border: acting.status === 'FLAGGED'
            ? '2px solid rgba(255, 207, 0, 0.25)'
            : '1px solid var(--surface-border)',
        }}
      >
        <div className="flex items-start gap-3">
          <span className="text-xl mt-0.5">&#9888;&#65039;</span>
          <div className="space-y-2">
            <h3 className="font-semibold" style={{ color: 'var(--brand-gold)' }}>
              {acting.status === 'FLAGGED'
                ? 'Performance-Presence Gap Detected'
                : 'Something to Watch'}
            </h3>
            <p className="text-sm" style={{ color: 'var(--text-on-dark-secondary)' }}>
              {acting.status === 'FLAGGED'
                ? 'Your output rays are strong, but your grounding system may be running on fumes. This happens when you\'re performing well but not fully resourced underneath. Research on compensatory effort (Hockey, 2013) shows this pattern is common in high-performers — output stays high while internal recovery costs accumulate invisibly.'
                : 'Your system shows signs of elevated Eclipse. Results are directional — they point in the right direction, but take them as a starting point. Your nervous system may be masking load through performance.'}
            </p>
            {acting.indicators.length > 0 && (
              <ul className="space-y-1 mt-2">
                {acting.indicators.map((ind) => (
                  <li key={ind.indicator_id} className="text-xs" style={{ color: 'var(--text-on-dark-muted)' }}>
                    &#8226; {ind.label}
                  </li>
                ))}
              </ul>
            )}
            <p className="text-sm font-medium mt-2" style={{ color: 'var(--text-on-dark)' }}>{acting.next_step}</p>

            {/* Science-backed context */}
            <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--surface-border)' }}>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-on-dark-muted)' }}>
                {acting.status === 'FLAGGED'
                  ? 'In real life, this might look like delivering the presentation and coming home empty. Or leading the team through a crisis while your own Joy and Presence scores sit below 40. The gap between output and felt experience is the signal. Your Power or Purpose ray may be carrying your Presence or Joy ray — effective in the short term, but your system is borrowing against recovery to maintain performance.'
                  : 'In real life, this might look like being effective but not feeling effective. The days work but the weeks blur. Small things that used to be automatic — remembering names, finding the right word, staying patient — now require conscious effort. This is your system working harder to produce the same output.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
