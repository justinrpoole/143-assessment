'use client';

import Link from 'next/link';

interface EclipseAnchorCardProps {
  archetypeName: string | null;
  stressDistortion: string | null;
  theLine: string | null;
  neonColor: string | null;
  lastRunId: string | null;
}

export default function EclipseAnchorCard({
  archetypeName,
  stressDistortion,
  theLine,
  neonColor,
  lastRunId,
}: EclipseAnchorCardProps) {
  return (
    <div
      className="glass-card rounded-2xl p-7 space-y-4"
      style={{
        borderLeft: neonColor ? `3px solid ${neonColor}50` : undefined,
      }}
    >
      <p
        className="text-xs font-bold uppercase tracking-widest"
        style={{ color: 'var(--neon-amber)' }}
      >
        High Eclipse
      </p>

      <h2 className="text-xl font-semibold" style={{ color: 'var(--text-on-dark)' }}>
        Your signal is temporarily covered.
      </h2>

      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
        {archetypeName
          ? `As a ${archetypeName}, high eclipse can look like this:`
          : 'Right now, your capacity is under load.'}
      </p>

      {stressDistortion && (
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-muted)' }}>
          {stressDistortion.length > 300
            ? stressDistortion.slice(0, 300).replace(/\s+\S*$/, '') + '...'
            : stressDistortion}
        </p>
      )}

      {theLine && (
        <p className="text-sm italic" style={{ color: 'var(--text-on-dark-muted)' }}>
          &ldquo;{theLine}&rdquo;
        </p>
      )}

      <p className="text-sm" style={{ color: 'var(--text-on-dark-secondary)' }}>
        One thing. Right here. Start with this.
      </p>

      {lastRunId && (
        <Link
          href={`/results?run_id=${lastRunId}`}
          className="inline-block text-xs underline underline-offset-2 hover:text-white transition-colors"
          style={{ color: 'var(--text-on-dark-secondary)' }}
        >
          When you&apos;re ready, your full plan is here →
        </Link>
      )}
    </div>
  );
}
