'use client';

import { StaggerContainer, StaggerItem } from '@/components/ui/FadeInSection';

const PHASES = [
  {
    icon: '◆',
    label: 'Healthy OS',
    title: 'All 9 Rays online',
    description: 'Your leadership runs on a foundation of 9 capacities. When the operating system is healthy, your presence is felt, your decisions are clear, your team trusts you.',
    highlight: true,
  },
  {
    icon: '◇',
    label: 'Stress Loads',
    title: 'Eclipse creeps in',
    description: 'Sustained pressure starts covering your strongest capacities. You still perform — but it costs more. The system is running on borrowed energy.',
    highlight: false,
  },
  {
    icon: '✕',
    label: 'Tactics Fail',
    title: 'Same playbook, different result',
    description: 'You try the leadership tactic that always worked. It does not land. Not because the tactic is wrong — because the OS underneath it is overloaded.',
    highlight: false,
  },
  {
    icon: '↻',
    label: 'Daily Practice',
    title: 'Upgrade the OS, not the tactic',
    description: 'Three minutes a day. One rep. The daily practice targets the capacity that is most eclipsed — not the one that is easiest. Eclipse starts to reduce.',
    highlight: true,
  },
  {
    icon: '◆',
    label: 'Tactic Works',
    title: 'Same playbook — different foundation',
    description: 'The same tactic that failed now lands. Nothing changed about the tactic. Everything changed about the system running it. That is the difference an OS upgrade makes.',
    highlight: true,
  },
];

export default function OSExplainer() {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-3">
        <p
          className="text-xs font-bold uppercase tracking-widest"
          style={{ color: 'var(--gold-primary)' }}
        >
          Your Operating System
        </p>
        <h2
          className="heading-section mx-auto max-w-[640px]"
          style={{ color: 'var(--text-body)' }}
        >
          Your leadership runs on an{' '}
          <span className="text-gold-gradient">operating system</span>.
          When the OS is overloaded, every tactic fails.
        </h2>
        <p
          className="mx-auto max-w-[540px] text-sm leading-relaxed"
          style={{ color: 'var(--text-secondary)' }}
        >
          The assessment diagnoses your OS. The daily practice upgrades it.
          The retake proves it changed.
        </p>
      </div>

      <StaggerContainer className="space-y-3">
        {PHASES.map((phase, i) => (
          <StaggerItem key={phase.label}>
            <div className="flex gap-4">
              {/* Timeline connector */}
              <div className="flex flex-col items-center">
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold"
                  style={{
                    background: phase.highlight
                      ? 'color-mix(in srgb, var(--gold-primary) 15%, transparent)'
                      : 'color-mix(in srgb, var(--text-body) 5%, transparent)',
                    color: phase.highlight ? 'var(--gold-primary)' : 'color-mix(in srgb, var(--text-body) 30%, transparent)',
                    border: `1px solid ${phase.highlight ? 'color-mix(in srgb, var(--gold-primary) 30%, transparent)' : 'color-mix(in srgb, var(--text-body) 10%, transparent)'}`,
                  }}
                >
                  {phase.icon}
                </div>
                {i < PHASES.length - 1 && (
                  <div
                    className="w-px flex-1"
                    style={{
                      background: 'linear-gradient(to bottom, color-mix(in srgb, var(--gold-primary) 20%, transparent), color-mix(in srgb, var(--gold-primary) 5%, transparent))',
                      minHeight: 'clamp(8px, 2vw, 24px)',
                    }}
                  />
                )}
              </div>

              {/* Content */}
              <div
                className={`glass-card flex-1 p-4 sm:p-5 ${phase.highlight ? 'glass-card--lift' : ''}`}
                style={phase.highlight ? { borderLeft: '2px solid color-mix(in srgb, var(--gold-primary) 30%, transparent)' } : undefined}
              >
                <p
                  className="text-xs font-bold uppercase tracking-widest"
                  style={{
                    color: phase.highlight ? 'var(--gold-primary)' : 'color-mix(in srgb, var(--text-body) 45%, transparent)',
                  }}
                >
                  {phase.label}
                </p>
                <p
                  className="mt-1 text-base font-semibold"
                  style={{ color: 'var(--text-body)' }}
                >
                  {phase.title}
                </p>
                <p
                  className="mt-2 text-sm leading-relaxed"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {phase.description}
                </p>
              </div>
            </div>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </div>
  );
}
