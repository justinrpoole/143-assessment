'use client';

interface WeeklyGoalRingProps {
  /** Reps logged this week */
  current: number;
  /** Weekly target (default 5) */
  target: number;
}

/**
 * WeeklyGoalRing — Circular progress indicator for weekly rep target.
 *
 * Research: Flexible weekly goals (vs rigid daily) improve 90-day
 * retention by 20%. The ring provides satisfying visual feedback
 * without the punishing streak-break of daily requirements.
 */
export default function WeeklyGoalRing({ current, target }: WeeklyGoalRingProps) {
  const pct = Math.min(current / target, 1);
  const complete = current >= target;

  // SVG ring dimensions
  const size = 72;
  const strokeWidth = 5;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - pct);

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Background ring */}
        <svg width={size} height={size} className="absolute inset-0 -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="color-mix(in srgb, var(--text-body) 8%, transparent)"
            strokeWidth={strokeWidth}
          />
          {/* Progress ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={complete ? 'var(--ray-authenticity)' : 'var(--gold-primary)'}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 0.6s ease-out' }}
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-lg font-bold leading-none"
            style={{ color: complete ? 'var(--ray-authenticity)' : 'var(--gold-primary)' }}
          >
            {current}
          </span>
          <span
            className="text-[9px] leading-none mt-0.5"
            style={{ color: 'var(--text-on-dark-muted)' }}
          >
            /{target}
          </span>
        </div>
      </div>
      <p className="text-[10px] font-medium" style={{ color: 'var(--text-on-dark-muted)' }}>
        {complete ? 'Week complete' : 'this week'}
      </p>
    </div>
  );
}
