'use client';

import StreakFire, { StreakDimensions } from './StreakFire';
import WeeklyGoalRing from '@/components/retention/WeeklyGoalRing';

const WEEKLY_TARGET = 5;

interface GrowthSignalCardProps {
  streakDays: number;
  repsThisWeek: number;
  totalReps: number;
  loopStreak: number;
  reflectionStreak: number;
  mostPracticedTool: string | null;
  runNumber: number | null;
}

export default function GrowthSignalCard({
  streakDays,
  repsThisWeek,
  totalReps,
  loopStreak,
  reflectionStreak,
  runNumber,
}: GrowthSignalCardProps) {
  const progressPct = Math.min(Math.round((repsThisWeek / WEEKLY_TARGET) * 100), 100);

  return (
    <div className="grid grid-cols-2 gap-3">
      {/* Weekly reps */}
      <div className="glass-card p-4 space-y-2">
        <div className="flex items-center gap-3">
          <WeeklyGoalRing current={repsThisWeek} target={WEEKLY_TARGET} />
          <div className="flex-1 space-y-1.5">
            <p className="text-xs font-medium" style={{ color: 'var(--text-on-dark-secondary)' }}>
              Weekly reps
            </p>
            <div className="surface-track-mid h-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-brand-purple to-brand-gold rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <p className="text-xs" style={{ color: 'var(--text-on-dark-muted)' }}>
              {progressPct >= 100
                ? 'Week complete'
                : `${WEEKLY_TARGET - repsThisWeek} more to hit target`}
            </p>
          </div>
        </div>
      </div>

      {/* Streak */}
      <div className="glass-card p-4 text-center space-y-1 flex flex-col items-center">
        <StreakFire days={streakDays} />
        <p className="text-2xl font-bold text-brand-gold">
          {streakDays > 0 ? streakDays : '—'}
        </p>
        <p className="text-xs" style={{ color: 'var(--text-on-dark-secondary)' }}>
          day streak
        </p>
        <StreakDimensions
          dimensions={[
            { label: 'Reps', days: streakDays },
            { label: 'Loop', days: loopStreak },
            { label: 'Reflect', days: reflectionStreak },
          ]}
        />
        <p className="text-xs" style={{ color: 'var(--text-on-dark-muted)' }}>
          {totalReps} total
          {runNumber && runNumber > 1 ? ` · ${runNumber} assessments` : ''}
        </p>
      </div>
    </div>
  );
}
