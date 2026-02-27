import Link from 'next/link';

import { RasPrimeCard } from '@/components/retention/RasPrimeCard';

export function RepsRasActions() {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--brand-gold, #F8D011)' }}>
          Light Reps
        </p>
        <h3 className="mt-2 text-lg font-semibold" style={{ color: 'var(--text-on-dark)' }}>
          Your daily practice starts here
        </h3>
        <p className="mt-1 text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
          Choose one rep from your Rise Path and prime your attention for what you want to see more of.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link href="/reps" className="btn-primary">
          Log a REP
        </Link>
        <Link href="/portal" className="btn-watch">
          Go to Portal
        </Link>
      </div>

      <RasPrimeCard variant="compact" />
    </div>
  );
}
