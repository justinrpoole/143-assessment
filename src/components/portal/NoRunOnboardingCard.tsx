'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import archetypePublicData from '@/data/archetype_public.json';

interface NoRunOnboardingCardProps {
  inProgressRunId: string | null;
  inProgressAnswered: number;
  inProgressTotal: number;
}

export default function NoRunOnboardingCard({
  inProgressRunId,
  inProgressAnswered,
  inProgressTotal,
}: NoRunOnboardingCardProps) {
  // Show a random archetype as a teaser (consistent per day)
  const teaser = useMemo(() => {
    const dayIndex = Math.floor(Date.now() / 86400000) % archetypePublicData.length;
    return archetypePublicData[dayIndex];
  }, []);

  const pct = inProgressTotal > 0 ? Math.round((inProgressAnswered / inProgressTotal) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Main CTA */}
      <div className="glass-card rounded-2xl p-7 space-y-4">
        <h2 className="text-2xl font-bold" style={{ color: 'var(--text-on-dark)' }}>
          Let&apos;s find your signal.
        </h2>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
          The Be The Light Assessment maps your 9 leadership capacities — trainable states, not
          personality traits. 143 questions. ~25 minutes. A result you can actually use.
        </p>

        <div className="space-y-2">
          {[
            { icon: '🎯', label: 'Your Light Signature — your archetype + top 2 Rays' },
            { icon: '📈', label: 'Your training focus — where to grow next' },
            { icon: '⚡', label: 'Your Eclipse level — state awareness' },
            { icon: '🛠️', label: 'Your 30-day plan with coaching tools' },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-3">
              <span className="text-xl">{item.icon}</span>
              <p className="text-sm" style={{ color: 'var(--text-on-dark-secondary)' }}>
                {item.label}
              </p>
            </div>
          ))}
        </div>

        {inProgressRunId ? (
          <div className="space-y-3">
            <Link
              href={`/assessment?run_id=${encodeURIComponent(inProgressRunId)}`}
              className="btn-primary block text-center"
            >
              Continue assessment →
            </Link>
            <div className="surface-track-mid h-2 overflow-hidden rounded-full">
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand-purple to-brand-gold transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className="text-xs text-center" style={{ color: 'var(--text-on-dark-muted)' }}>
              {pct}% complete — your answers are saved
            </p>
          </div>
        ) : (
          <Link href="/assessment/setup" className="btn-primary block text-center">
            Start your assessment →
          </Link>
        )}
      </div>

      {/* Archetype teaser */}
      {teaser && (
        <div
          className="glass-card rounded-xl p-5 space-y-3"
          style={{
            borderLeft: `3px solid ${teaser.neon_color}`,
            boxShadow: `inset 4px 0 24px -12px ${teaser.neon_color}40`,
          }}
        >
          <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: `${teaser.neon_color}aa` }}>
            Sample archetype
          </p>
          <p className="text-lg font-bold" style={{ color: 'var(--text-on-dark)' }}>
            {teaser.name}
          </p>
          <p className="text-sm" style={{ color: 'var(--text-on-dark-secondary)' }}>
            &ldquo;{teaser.tagline}&rdquo;
          </p>
          <p className="text-xs" style={{ color: 'var(--text-on-dark-muted)' }}>
            {teaser.identity_code}
          </p>
          <p className="text-xs" style={{ color: 'var(--text-on-dark-muted)' }}>
            Which of the 28 archetypes are you? Take the assessment to find out.
          </p>
        </div>
      )}
    </div>
  );
}
