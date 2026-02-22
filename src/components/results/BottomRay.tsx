'use client';

import type { LightSignatureOutput } from '@/lib/types';
import { RAY_VERBS } from '@/lib/types';
import { getRayExplanation } from '@/lib/cosmic-copy';

interface Props {
  justInRay: LightSignatureOutput['just_in_ray'];
  selectionBasis?: string[];
}

const ROUTING_LABELS: Record<string, { label: string; description: string }> = {
  STRETCH: {
    label: 'Ready to Stretch',
    description: 'You have the foundation to push into new territory here.',
  },
  STANDARD: {
    label: 'Ready to Build',
    description: 'You have the access to grow this skill with consistent practice.',
  },
  STABILIZE_MICRO: {
    label: 'Small Moves First',
    description: 'Start with micro-reps. Consistency matters more than intensity right now.',
  },
  STABILIZE_RETEST: {
    label: 'Stabilize First',
    description: 'Your system needs recovery before this skill can grow. Focus on foundation tools.',
  },
};

export default function BottomRay({ justInRay, selectionBasis }: Props) {
  const routing = justInRay.routing ? ROUTING_LABELS[justInRay.routing] : null;
  const rayInsight = getRayExplanation(justInRay.ray_id);

  return (
    <section className="space-y-4">
      <h3 className="text-lg font-semibold" style={{ color: 'var(--text-on-dark)' }}>Your Next Skill</h3>
      <p className="text-sm" style={{ color: 'var(--text-on-dark-secondary)' }}>
        This is your next skill to train. Small investment here creates the biggest return.
      </p>

      <div className="glass-card p-6" style={{ border: '2px solid rgba(114, 21, 184, 0.25)' }}>
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">&#129517;</span>
          <div>
            <h4 className="font-bold text-lg" style={{ color: 'var(--text-on-dark)' }}>
              {justInRay.ray_name} — {RAY_VERBS[justInRay.ray_id] || ''}
            </h4>
            {routing && (
              <span
                className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{ background: 'rgba(114, 21, 184, 0.15)', color: 'var(--cosmic-purple-light)' }}
              >
                {routing.label}
              </span>
            )}
          </div>
        </div>

        <p className="text-sm mb-4" style={{ color: 'var(--text-on-dark-secondary)' }}>{justInRay.why_this_is_next}</p>

        {routing && (
          <p className="text-xs mb-4" style={{ color: 'var(--text-on-dark-muted)' }}>{routing.description}</p>
        )}

        {/* Science context for this ray */}
        {rayInsight && (
          <div className="mb-4 pb-4" style={{ borderBottom: '1px solid var(--surface-border)' }}>
            <p className="text-xs uppercase tracking-wider font-semibold mb-1.5" style={{ color: 'var(--brand-gold)' }}>
              Why This Matters
            </p>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-on-dark-muted)' }}>
              {rayInsight.science}
            </p>
          </div>
        )}

        {/* What eclipsed looks like — real-life examples */}
        {rayInsight && (
          <div className="mb-4 pb-4" style={{ borderBottom: '1px solid var(--surface-border)' }}>
            <p className="text-xs uppercase tracking-wider font-semibold mb-1.5" style={{ color: 'var(--brand-gold)' }}>
              What This Might Look Like Right Now
            </p>
            <ul className="space-y-1.5">
              {rayInsight.whenEclipsed.map((ex, i) => (
                <li key={i} className="flex gap-2 text-xs leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
                  <span className="mt-0.5 shrink-0" style={{ color: 'var(--text-on-dark-muted)' }}>&#9679;</span>
                  {ex}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Reps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-xl p-3" style={{ background: 'var(--surface-glass)' }}>
            <p className="text-xs uppercase tracking-wide mb-1" style={{ color: 'var(--brand-gold)' }}>Work Rep</p>
            <p className="text-sm" style={{ color: 'var(--text-on-dark-secondary)' }}>{justInRay.work_rep}</p>
          </div>
          <div className="rounded-xl p-3" style={{ background: 'var(--surface-glass)' }}>
            <p className="text-xs uppercase tracking-wide mb-1" style={{ color: 'var(--brand-gold)' }}>Life Rep</p>
            <p className="text-sm" style={{ color: 'var(--text-on-dark-secondary)' }}>{justInRay.life_rep}</p>
          </div>
        </div>

        {/* Coaching reps from science framework */}
        {rayInsight && rayInsight.coachingReps.length > 0 && (
          <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--surface-border)' }}>
            <p className="text-xs uppercase tracking-wider font-semibold mb-2" style={{ color: 'var(--brand-gold)' }}>
              Coaching Reps to Build This Skill
            </p>
            <ul className="space-y-2">
              {rayInsight.coachingReps.map((rep, i) => (
                <li key={i} className="flex gap-2 text-xs leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
                  <span className="font-bold shrink-0" style={{ color: 'var(--brand-gold)' }}>{i + 1}.</span>
                  {rep}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Move Score + Selection Basis */}
        {(justInRay.move_score != null || (selectionBasis && selectionBasis.length > 0)) && (
          <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--surface-border)' }}>
            <div className="flex items-start gap-4 flex-wrap">
              {justInRay.move_score != null && (
                <div className="text-center">
                  <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--brand-gold)' }}>Move Score</p>
                  <p className="text-2xl font-bold" style={{ color: 'var(--text-on-dark)' }}>
                    {(justInRay.move_score * 100).toFixed(0)}
                  </p>
                  <p className="text-[10px]" style={{ color: 'var(--text-on-dark-muted)' }}>
                    Higher = more ready for growth
                  </p>
                </div>
              )}
              {selectionBasis && selectionBasis.length > 0 && (
                <div className="flex-1 min-w-[200px]">
                  <p className="text-xs uppercase tracking-wider mb-1.5" style={{ color: 'var(--brand-gold)' }}>
                    Why This Ray
                  </p>
                  {selectionBasis.map((reason, i) => (
                    <p key={i} className="text-xs mb-1" style={{ color: 'var(--text-on-dark-muted)' }}>
                      &#8226; {reason}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
