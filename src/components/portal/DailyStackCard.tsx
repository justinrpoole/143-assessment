import Link from 'next/link';

const STACK_ITEMS = [
  {
    label: 'Morning',
    description: 'Set the tone and log one clear intention.',
    href: '/morning',
  },
  {
    label: 'RAS Prime',
    description: 'Choose three signals your attention will notice.',
    href: '/portal',
  },
  {
    label: 'Micro Joy',
    description: 'One small reset that tells your brain the good is real.',
    href: '/micro-joy',
  },
  {
    label: 'REP Log',
    description: 'Lock the rep so it repeats.',
    href: '/reps',
  },
];

export default function DailyStackCard() {
  return (
    <div className="glass-card p-5 space-y-4">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--brand-gold, #F8D011)' }}>
          Daily Stack
        </p>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
          Four small reps. Five minutes. This is how the system upgrades.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {STACK_ITEMS.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="glass-card glass-card--interactive p-4 block"
          >
            <p className="text-sm font-semibold" style={{ color: 'var(--text-on-dark)' }}>
              {item.label}
            </p>
            <p className="mt-1 text-xs" style={{ color: 'var(--text-on-dark-secondary)' }}>
              {item.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
