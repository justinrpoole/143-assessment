'use client';

interface LikertScaleProps {
  itemId: string;
  value: number | null;
  onChange: (itemId: string, value: number) => void;
  labels?: { low: string; high: string };
}

const DEFAULT_LABELS = {
  low: 'Strongly disagree',
  high: 'Strongly agree',
};

export default function LikertScale({ itemId, value, onChange, labels }: LikertScaleProps) {
  const l = labels || DEFAULT_LABELS;

  return (
    <div className="w-full">
      <div className="flex justify-between text-xs mb-2 px-1" style={{ color: 'var(--text-on-dark-muted)' }}>
        <span>{l.low}</span>
        <span>{l.high}</span>
      </div>
      <div className="flex gap-2 justify-center">
        {[1, 2, 3, 4, 5, 6, 7].map((n) => (
          <button
            key={n}
            onClick={() => onChange(itemId, n)}
            className={`
              w-10 h-10 sm:w-12 sm:h-12 rounded-full text-sm font-medium transition-all
              ${value === n
                ? 'bg-brand-gold text-brand-black shadow-lg scale-110'
                : 'hover:scale-105'
              }
            `}
            style={value !== n ? { background: 'rgba(96, 5, 141, 0.35)', color: 'var(--text-on-dark-secondary)', border: '1px solid var(--surface-border)' } : undefined}
            aria-label={`${n} out of 7`}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}
