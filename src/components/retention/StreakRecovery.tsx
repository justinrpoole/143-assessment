'use client';

import { streakRecoveryMessage } from '@/lib/identity/identity-messages';

interface StreakRecoveryProps {
  /** Current streak (should be 0 for this to show) */
  streakDays: number;
  /** Total reps ever logged — used to detect returning user */
  totalReps: number;
  /** Previous streak length (if available) */
  previousStreak?: number;
}

/**
 * StreakRecovery — Shows a warm, identity-based comeback prompt
 * when a user has lost their streak but has prior activity.
 *
 * Research: Punishing streak loss drives churn. Warm recovery
 * messages retain 20%+ more users at Day 90 (Duolingo, Noom).
 */
export default function StreakRecovery({
  streakDays,
  totalReps,
  previousStreak = 0,
}: StreakRecoveryProps) {
  // Only show when streak is broken AND user has prior history
  if (streakDays > 0 || totalReps === 0) return null;

  // Estimate missed days from lack of streak
  // If we don't have precise data, use a warm generic message
  const missedDays = previousStreak > 0 ? 1 : 2;
  const message = streakRecoveryMessage(missedDays, previousStreak || totalReps);

  return (
    <div
      className="glass-card p-5 space-y-3"
      style={{ borderColor: 'rgba(248, 208, 17, 0.25)' }}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl">🔥</span>
        <div className="flex-1 space-y-2">
          <p className="text-sm font-semibold" style={{ color: 'var(--text-on-dark)' }}>
            Welcome back.
          </p>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
            {message}
          </p>
          {totalReps > 0 && (
            <p className="text-xs" style={{ color: 'var(--text-on-dark-muted)' }}>
              {totalReps} total rep{totalReps !== 1 ? 's' : ''} logged. That history doesn&apos;t disappear.
            </p>
          )}
          <a
            href="/reps"
            className="btn-primary inline-block text-sm py-2 px-5 mt-1"
          >
            Resume my practice
          </a>
        </div>
      </div>
    </div>
  );
}
