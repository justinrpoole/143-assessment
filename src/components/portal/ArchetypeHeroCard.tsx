'use client';

import Link from 'next/link';

interface ArchetypeHeroCardProps {
  name: string;
  tagline: string;
  identityCode: string;
  neonColor: string;
  rays: string[];
  theLine: string;
  eclipseLevel: string | null;
  streakDays: number;
  lastRunId: string | null;
}

const ECLIPSE_LABELS: Record<string, string> = {
  low: 'Low Eclipse',
  medium: 'Medium Eclipse',
  high: 'High Eclipse',
};

export default function ArchetypeHeroCard({
  name,
  tagline,
  identityCode,
  neonColor,
  rays,
  theLine,
  eclipseLevel,
  streakDays,
  lastRunId,
}: ArchetypeHeroCardProps) {
  return (
    <div
      className="glass-card rounded-2xl p-6 space-y-4 relative overflow-hidden"
      style={{
        borderLeft: `3px solid ${neonColor}`,
        boxShadow: `inset 4px 0 24px -12px ${neonColor}40`,
      }}
    >
      {/* Identity code */}
      <p
        className="text-[10px] font-bold uppercase tracking-[0.2em]"
        style={{ color: `${neonColor}aa` }}
      >
        {identityCode}
      </p>

      {/* Archetype name */}
      <h2
        className="text-2xl font-bold"
        style={{
          fontFamily: "'Orbitron', var(--font-mono)",
          color: 'var(--text-on-dark)',
          textShadow: `0 0 20px ${neonColor}30`,
        }}
      >
        {name}
      </h2>

      {/* Tagline */}
      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
        {tagline}
      </p>

      {/* Ray chips + eclipse badge */}
      <div className="flex flex-wrap gap-2 items-center">
        {rays.map((ray) => (
          <span
            key={ray}
            className="px-3 py-1 rounded-full text-xs font-semibold"
            style={{
              background: `${neonColor}15`,
              color: neonColor,
              border: `1px solid ${neonColor}30`,
            }}
          >
            {ray}
          </span>
        ))}
        {eclipseLevel && (
          <span
            className="px-2.5 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider"
            style={{
              background: 'var(--surface-card)',
              color: eclipseLevel === 'high' ? 'var(--neon-amber)' : 'var(--text-on-dark-muted)',
              border: '1px solid var(--surface-border)',
            }}
          >
            {ECLIPSE_LABELS[eclipseLevel] ?? eclipseLevel}
          </span>
        )}
        {streakDays > 0 && (
          <span
            className="px-2.5 py-0.5 rounded-full text-[10px] font-medium"
            style={{
              background: 'var(--surface-card)',
              color: 'var(--gold-primary)',
              border: '1px solid var(--surface-border)',
            }}
          >
            🔥 {streakDays}d
          </span>
        )}
      </div>

      {/* The Line — no-shame reframe */}
      <p className="text-sm italic" style={{ color: 'var(--text-on-dark-muted)' }}>
        &ldquo;{theLine}&rdquo;
      </p>

      {/* Report link */}
      {lastRunId && (
        <Link
          href={`/results?run_id=${lastRunId}`}
          className="inline-block text-xs underline underline-offset-2 hover:text-white transition-colors"
          style={{ color: 'var(--text-on-dark-secondary)' }}
        >
          View full report →
        </Link>
      )}
    </div>
  );
}
