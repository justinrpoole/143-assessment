'use client';

interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-xs font-semibold" style={{ color: 'var(--text-on-dark)' }}>
          {current} of {total}
        </span>
        <span className="text-xs" style={{ color: 'var(--text-on-dark-muted)' }}>
          {pct}%
        </span>
      </div>
      <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'color-mix(in srgb, var(--violet-650) 25%, transparent)', border: '1px solid var(--surface-border)' }}>
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${pct}%`,
            background: 'linear-gradient(90deg, var(--text-body) 0%, var(--text-body) 100%)',
          }}
        />
      </div>
    </div>
  );
}
