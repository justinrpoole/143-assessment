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
          style={{ color: 'var(--brand-gold, #F8D011)' }}
        >
          Your Operating System
        </p>
        <h2
          className="heading-section mx-auto max-w-[640px]"
          style={{ color: 'var(--text-on-dark, #FFFEF5)' }}
        >
          Your leadership runs on an{' '}
          <span className="text-gold-gradient">operating system</span>.
          When the OS is overloaded, every tactic fails.
        </h2>
        <p
          className="mx-auto max-w-[540px] text-sm leading-relaxed"
          style={{ color: 'var(--text-on-dark-secondary, rgba(255,255,255,0.75))' }}
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
                      ? 'rgba(248,208,17,0.15)'
                      : 'rgba(255,255,255,0.05)',
                    color: phase.highlight ? '#F8D011' : 'rgba(255,255,255,0.3)',
                    border: `1px solid ${phase.highlight ? 'rgba(248,208,17,0.3)' : 'rgba(255,255,255,0.1)'}`,
                  }}
                >
                  {phase.icon}
                </div>
                {i < PHASES.length - 1 && (
                  <div
                    className="w-px flex-1"
                    style={{
                      background: 'linear-gradient(to bottom, rgba(248,208,17,0.2), rgba(248,208,17,0.05))',
                      minHeight: 12,
                    }}
                  />
                )}
              </div>

              {/* Content */}
              <div
                className={`glass-card flex-1 p-4 sm:p-5 ${phase.highlight ? 'glass-card--lift' : ''}`}
                style={phase.highlight ? { borderLeft: '2px solid rgba(248,208,17,0.3)' } : undefined}
              >
                <p
                  className="text-[10px] font-bold uppercase tracking-widest"
                  style={{
                    color: phase.highlight ? '#F8D011' : 'rgba(255,255,255,0.45)',
                  }}
                >
                  {phase.label}
                </p>
                <p
                  className="mt-1 text-base font-semibold"
                  style={{ color: 'var(--text-on-dark, #FFFEF5)' }}
                >
                  {phase.title}
                </p>
                <p
                  className="mt-2 text-sm leading-relaxed"
                  style={{ color: 'var(--text-on-dark-secondary, rgba(255,255,255,0.75))' }}
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
