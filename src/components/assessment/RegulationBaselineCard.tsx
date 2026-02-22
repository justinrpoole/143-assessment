'use client';

import { useMemo, useState } from 'react';

type StateOption = 'steady' | 'activated' | 'depleted';

const OPTIONS: Array<{ value: StateOption; label: string; description: string }> = [
  {
    value: 'steady',
    label: 'Steady',
    description: 'Your system feels clear and present right now.',
  },
  {
    value: 'activated',
    label: 'Activated',
    description: 'Your system is alert, tight, or rushing.',
  },
  {
    value: 'depleted',
    label: 'Depleted',
    description: 'Your system feels low, heavy, or flat.',
  },
];

const GUIDANCE: Record<StateOption, string> = {
  steady: 'Good time to start. Trust your first instinct and keep moving.',
  activated:
    'Give yourself 90 seconds first. Long exhale, shoulders down, then begin.',
  depleted:
    'Do a short reset first. Presence Pause, water, then begin when you feel ready.',
};

export function RegulationBaselineCard() {
  const [selected, setSelected] = useState<StateOption>('steady');

  const guidance = useMemo(() => GUIDANCE[selected], [selected]);

  return (
    <section className="glass-card p-6 space-y-4">
      <div className="space-y-1">
        <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--brand-gold, #F8D011)' }}>
          State Check
        </p>
        <h2 className="text-lg font-semibold" style={{ color: 'var(--text-on-dark)' }}>
          Quick regulation baseline
        </h2>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
          This does not change your score. It helps you start in a clear state.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {OPTIONS.map((option) => {
          const active = selected === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => setSelected(option.value)}
              className="glass-card p-4 text-left transition-all"
              style={{
                borderColor: active ? '#F8D011' : 'var(--surface-border)',
              }}
            >
              <p className="text-sm font-semibold" style={{ color: 'var(--text-on-dark)' }}>
                {option.label}
              </p>
              <p className="mt-1 text-xs" style={{ color: 'var(--text-on-dark-secondary)' }}>
                {option.description}
              </p>
            </button>
          );
        })}
      </div>

      <div className="glass-card p-4" style={{ borderColor: 'rgba(248, 208, 17, 0.3)' }}>
        <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--brand-gold, #F8D011)' }}>
          What to do next
        </p>
        <p className="mt-1 text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
          {guidance}
        </p>
      </div>
    </section>
  );
}
