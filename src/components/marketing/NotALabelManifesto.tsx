'use client';

import { StaggerContainer, StaggerItem } from '@/components/ui/FadeInSection';

const PANELS = [
  {
    kicker: 'What They Do',
    title: 'Static label',
    steps: ['Take the test once', 'Get a personality type', 'Accept it as identity', 'Stagnation'],
    muted: true,
  },
  {
    kicker: 'What We Do',
    title: 'Dynamic measurement',
    steps: ['Measure your capacities now', 'Get a daily practice', 'Train through reps', 'Visible growth'],
    muted: false,
  },
  {
    kicker: 'The Result',
    title: 'A score that moves',
    steps: ['Retake weekly', 'Watch the numbers shift', 'See evidence of practice landing', 'Your proof of growth'],
    muted: false,
  },
];

export default function NotALabelManifesto() {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-3">
        <p
          className="text-xs font-bold uppercase tracking-widest"
          style={{ color: 'var(--brand-gold, #F8D011)' }}
        >
          The Paradigm Shift
        </p>
        <h2
          className="heading-section mx-auto max-w-[640px]"
          style={{ color: 'var(--text-on-dark, #FFFEF5)' }}
        >
          Every other assessment tells you who you are.{' '}
          <span className="text-gold-gradient">We show you who you are right now.</span>
        </h2>
        <p
          className="mx-auto max-w-[540px] text-sm leading-relaxed"
          style={{ color: 'var(--text-on-dark-secondary, rgba(255,255,255,0.75))' }}
        >
          50% of people who retake MBTI get a different type. That is not growth — that is a broken instrument.
          143 expects scores to change because it measures energy states, not personality traits.
        </p>
      </div>

      <StaggerContainer className="grid gap-5 sm:grid-cols-3">
        {PANELS.map((panel) => (
          <StaggerItem key={panel.kicker}>
            <div
              className={`glass-card p-5 md:p-6 h-full space-y-4 ${!panel.muted ? 'glass-card--lift' : ''}`}
              style={!panel.muted ? { border: '1px solid rgba(248,208,17,0.2)' } : undefined}
            >
              <p
                className="text-[10px] font-bold uppercase tracking-widest"
                style={{
                  color: panel.muted ? 'rgba(255,255,255,0.45)' : '#F8D011',
                }}
              >
                {panel.kicker}
              </p>
              <p
                className="text-lg font-semibold"
                style={{
                  color: panel.muted
                    ? 'var(--text-on-dark-muted, rgba(255,255,255,0.5))'
                    : 'var(--text-on-dark, #FFFEF5)',
                }}
              >
                {panel.title}
              </p>
              <div className="space-y-2">
                {panel.steps.map((step, i) => (
                  <div key={step} className="flex items-center gap-2">
                    <span
                      className="text-sm font-bold"
                      style={{
                        color: panel.muted ? 'rgba(255,255,255,0.2)' : '#F8D011',
                        textShadow: !panel.muted ? '0 0 6px rgba(248,208,17,0.2)' : undefined,
                      }}
                    >
                      {i < panel.steps.length - 1 ? '↓' : '◆'}
                    </span>
                    <span
                      className="text-sm"
                      style={{
                        color: panel.muted
                          ? 'var(--text-on-dark-muted, rgba(255,255,255,0.5))'
                          : 'var(--text-on-dark-secondary, rgba(255,255,255,0.75))',
                      }}
                    >
                      {step}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </StaggerItem>
        ))}
      </StaggerContainer>

      <p
        className="text-center text-sm leading-relaxed"
        style={{ color: 'var(--text-on-dark-secondary, rgba(255,255,255,0.75))' }}
      >
        When your Presence score moves from 52 to 68, that is not noise.{' '}
        <span className="gold-highlight">That is evidence of practice landing.</span>
      </p>
    </div>
  );
}
