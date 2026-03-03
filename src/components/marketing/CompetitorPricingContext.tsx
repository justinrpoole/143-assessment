'use client';

const COMPETITORS = [
  { name: 'Leadership Circle Profile', price: '$625', unit: '/person' },
  { name: 'Hogan Assessment', price: '$1,600', unit: ' w/ debrief' },
  { name: 'BetterUp', price: '~$6,000', unit: '/year' },
  { name: 'EQ-i 2.0', price: '$425', unit: '/assessment' },
  { name: 'CliftonStrengths', price: '$72', unit: '/person' },
];

export default function CompetitorPricingContext() {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-3">
        <p
          className="text-xs font-bold uppercase tracking-widest"
          style={{ color: 'var(--gold-primary)' }}
        >
          What Others Charge
        </p>
        <h3
          className="mx-auto max-w-[540px] text-xl font-bold sm:text-2xl"
          style={{ color: 'var(--text-body)' }}
        >
          Same category. Different price point.{' '}
          <span className="text-gold-gradient">Different results.</span>
        </h3>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {COMPETITORS.map((c) => (
          <div
            key={c.name}
            className="rounded-full px-4 py-2 text-center"
            style={{
              background: 'color-mix(in srgb, var(--text-body) 3%, transparent)',
              border: '1px solid color-mix(in srgb, var(--text-body) 8%, transparent)',
            }}
          >
            <span
              className="text-xs"
              style={{ color: 'color-mix(in srgb, var(--text-body) 40%, transparent)' }}
            >
              {c.name}:{' '}
            </span>
            <span
              className="text-sm font-bold tabular-nums"
              style={{ color: 'color-mix(in srgb, var(--text-body) 60%, transparent)' }}
            >
              {c.price}
            </span>
            <span
              className="text-xs"
              style={{ color: 'color-mix(in srgb, var(--text-body) 30%, transparent)' }}
            >
              {c.unit}
            </span>
          </div>
        ))}
      </div>

      {/* 143 highlight */}
      <div
        className="mx-auto max-w-[480px] rounded-xl p-5 text-center"
        style={{
          background: 'color-mix(in srgb, var(--gold-primary) 4%, transparent)',
          border: '1.5px solid color-mix(in srgb, var(--gold-primary) 20%, transparent)',
        }}
      >
        <p
          className="text-[10px] font-bold uppercase tracking-widest"
          style={{ color: 'var(--gold-primary)' }}
        >
          143 Leadership
        </p>
        <p className="mt-2">
          <span
            className="text-3xl font-bold tabular-nums"
            style={{ color: 'var(--gold-primary)', fontFamily: 'var(--font-cosmic-display)' }}
          >
            $14.33
          </span>
          <span className="text-sm" style={{ color: 'color-mix(in srgb, var(--gold-primary) 60%, transparent)' }}>
            /month
          </span>
        </p>
        <p
          className="mt-2 text-sm leading-relaxed"
          style={{ color: 'var(--text-secondary)' }}
        >
          Full assessment + weekly retakes + daily practice system + growth tracking.
          Cancel anytime.
        </p>
      </div>

      <p
        className="text-center text-xs leading-relaxed"
        style={{ color: 'color-mix(in srgb, var(--text-body) 40%, transparent)' }}
      >
        If 143 helps you avoid one mismanaged conflict per month,
        that is worth more than the annual subscription in the first week.
        But we do not ask you to believe us — we ask you to{' '}
        <span className="gold-highlight">measure it</span>.
      </p>
    </div>
  );
}
