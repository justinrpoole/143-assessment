'use client';

const LOOP_STEPS = [
  {
    time: '7:00 am',
    label: 'Morning Routine',
    duration: '3 min',
    description: 'Set your intention. Name one capacity to train today. The negotiation with yourself is already over.',
    icon: '◆',
  },
  {
    time: 'Throughout day',
    label: 'Energy Audit',
    duration: '30 sec',
    description: 'Quick check: what capacity am I running on? Is it mine or borrowed? Name it. That is the intervention.',
    icon: '◇',
  },
  {
    time: 'In the moment',
    label: 'Rep',
    duration: '< 1 min',
    description: 'IF I notice [trigger], THEN I will [micro-behavior]. One rep. One data point. One neural pathway getting stronger.',
    icon: '↻',
  },
  {
    time: 'Evening',
    label: 'Reflection',
    duration: '2 min',
    description: 'What landed today? What cost more than it should have? Log one win and one observation. That is the data.',
    icon: '◆',
  },
  {
    time: 'Weekly',
    label: 'Scan',
    duration: '5 min',
    description: 'Retake the 43-question tracking set. Watch your scores shift. Not a feeling — a measurement.',
    icon: '★',
  },
];

const COMPETITOR_TIME = [
  { name: 'Headspace', time: '10 min', note: 'meditation. No leadership framework.' },
  { name: 'Noom', time: '5–10 min', note: 'lessons. No assessment.' },
  { name: 'BetterUp', time: '60 min', note: 'coaching sessions. $6,000/year.' },
  { name: 'The 143 Loop', time: '3–5 min', note: 'daily + 5 min weekly scan. $14.33/month.' },
];

export default function DailyLoopVisual() {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-3">
        <p
          className="text-xs font-bold uppercase tracking-widest"
          style={{ color: '#F8D011' }}
        >
          The 143 Loop
        </p>
        <h2
          className="heading-section mx-auto max-w-[640px]"
          style={{ color: 'var(--text-on-dark, #FFFEF5)' }}
        >
          Your daily operating system.{' '}
          <span className="text-gold-gradient">3 minutes to start. 5 minutes to measure.</span>
        </h2>
        <p
          className="mx-auto max-w-[540px] text-sm leading-relaxed"
          style={{ color: 'var(--text-on-dark-secondary, rgba(255,255,255,0.75))' }}
        >
          Morning → Practice → Rep → Reflect → Scan.
          The full leadership operating system for less time than it takes to check your email.
        </p>
      </div>

      {/* Loop Timeline */}
      <div className="space-y-3">
        {LOOP_STEPS.map((step, i) => (
          <div key={step.label} className="flex gap-4">
            {/* Timeline */}
            <div className="flex flex-col items-center">
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm"
                style={{
                  background: 'rgba(248,208,17,0.1)',
                  color: '#F8D011',
                  border: '1px solid rgba(248,208,17,0.25)',
                }}
              >
                {step.icon}
              </div>
              {i < LOOP_STEPS.length - 1 && (
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
            <div className="glass-card flex-1 p-4 sm:p-5">
              <div className="flex items-center justify-between">
                <p
                  className="text-sm font-bold"
                  style={{ color: 'var(--text-on-dark, #FFFEF5)' }}
                >
                  {step.label}
                </p>
                <div className="flex items-center gap-2">
                  <span
                    className="rounded-full px-2 py-0.5 text-[10px] font-bold"
                    style={{
                      background: 'rgba(248,208,17,0.08)',
                      color: '#F8D011',
                    }}
                  >
                    {step.duration}
                  </span>
                  <span
                    className="text-[10px]"
                    style={{ color: 'rgba(255,255,255,0.3)' }}
                  >
                    {step.time}
                  </span>
                </div>
              </div>
              <p
                className="mt-2 text-sm leading-relaxed"
                style={{ color: 'var(--text-on-dark-secondary, rgba(255,255,255,0.75))' }}
              >
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Competitor time comparison */}
      <div
        className="glass-card rounded-xl p-5 sm:p-6"
        style={{
          border: '1px solid rgba(248,208,17,0.15)',
        }}
      >
        <p
          className="mb-3 text-xs font-bold uppercase tracking-widest"
          style={{ color: '#F8D011' }}
        >
          Time Comparison
        </p>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {COMPETITOR_TIME.map((c) => (
            <div key={c.name} className="flex items-baseline gap-2">
              <span
                className="text-sm font-bold tabular-nums"
                style={{
                  color: c.name === 'The 143 Loop' ? '#F8D011' : 'rgba(255,255,255,0.5)',
                }}
              >
                {c.time}
              </span>
              <span
                className="text-xs"
                style={{
                  color: c.name === 'The 143 Loop'
                    ? 'var(--text-on-dark-secondary)'
                    : 'rgba(255,255,255,0.3)',
                }}
              >
                {c.name}: {c.note}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
