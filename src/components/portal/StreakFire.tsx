'use client';

export interface StreakDimension {
  label: string;
  days: number;
}

interface StreakFireProps {
  days: number;
  /** Optional multi-dimension streaks shown as small badges below the flame */
  dimensions?: StreakDimension[];
}

/**
 * Progressive flame visualization for streak days.
 * Ember (1-2) → Small flame (3-6) → Medium with particles (7-13)
 * → Full fire (14+) → Cosmic halo (30+)
 *
 * Pure CSS animations — no Framer Motion dependency.
 * Supports multi-dimension streak display (reps, loop, reflection).
 */
export default function StreakFire({ days, dimensions }: StreakFireProps) {
  if (days <= 0 && !dimensions?.some((d) => d.days > 0)) return null;

  const tier = days >= 30 ? 'cosmic' : days >= 14 ? 'full' : days >= 7 ? 'medium' : days >= 3 ? 'small' : 'ember';

  return (
    <div className="relative flex items-center justify-center" style={{ width: 40, height: 44 }}>
      {/* Cosmic halo (30+) */}
      {tier === 'cosmic' && (
        <div
          className="absolute inset-[-8px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(248,208,17,0.2) 0%, transparent 70%)',
            animation: 'streakPulse 2s ease-in-out infinite',
          }}
        />
      )}

      {/* Glow base */}
      <div
        className="absolute rounded-full"
        style={{
          width: tier === 'cosmic' ? 36 : tier === 'full' ? 30 : tier === 'medium' ? 24 : tier === 'small' ? 18 : 12,
          height: tier === 'cosmic' ? 36 : tier === 'full' ? 30 : tier === 'medium' ? 24 : tier === 'small' ? 18 : 12,
          background: tier === 'ember'
            ? 'radial-gradient(circle, rgba(245,158,11,0.5) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(248,208,17,0.4) 0%, rgba(245,158,11,0.2) 50%, transparent 80%)',
          filter: `blur(${tier === 'cosmic' ? 6 : tier === 'full' ? 5 : 3}px)`,
          animation: tier !== 'ember' ? 'streakFlicker 1.5s ease-in-out infinite' : undefined,
        }}
      />

      {/* Flame shape */}
      <svg
        viewBox="0 0 32 40"
        width={tier === 'cosmic' ? 28 : tier === 'full' ? 24 : tier === 'medium' ? 20 : tier === 'small' ? 16 : 12}
        height={tier === 'cosmic' ? 35 : tier === 'full' ? 30 : tier === 'medium' ? 25 : tier === 'small' ? 20 : 15}
        className="relative z-10"
        style={{
          filter: `drop-shadow(0 0 ${tier === 'cosmic' ? 8 : tier === 'full' ? 6 : 4}px rgba(248,208,17,0.5))`,
          animation: tier !== 'ember' ? 'streakDance 0.8s ease-in-out infinite alternate' : undefined,
        }}
      >
        <defs>
          <linearGradient id="flame-grad" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#E89D0C" />
            <stop offset="40%" stopColor="#F8D011" />
            <stop offset="70%" stopColor="#FFEC80" />
            <stop offset="100%" stopColor="#FFFEF5" />
          </linearGradient>
          <linearGradient id="flame-inner" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#F0B800" />
            <stop offset="60%" stopColor="#FFFEF5" />
            <stop offset="100%" stopColor="#FFFFFF" />
          </linearGradient>
        </defs>
        {/* Outer flame */}
        <path
          d="M16 2C16 2 6 14 6 24C6 30 10 36 16 38C22 36 26 30 26 24C26 14 16 2 16 2Z"
          fill="url(#flame-grad)"
          opacity={tier === 'ember' ? 0.7 : 1}
        />
        {/* Inner bright core */}
        <path
          d="M16 14C16 14 11 20 11 26C11 30 13 34 16 35C19 34 21 30 21 26C21 20 16 14 16 14Z"
          fill="url(#flame-inner)"
          opacity={0.8}
        />
      </svg>

      {/* Spark particles (medium+) */}
      {(tier === 'medium' || tier === 'full' || tier === 'cosmic') && (
        <>
          <div className="absolute" style={{ top: 2, left: '50%', width: 3, height: 3, borderRadius: '50%', background: '#FFEC80', animation: 'streakSpark 1.2s ease-out infinite', opacity: 0.8 }} />
          <div className="absolute" style={{ top: 6, left: '30%', width: 2, height: 2, borderRadius: '50%', background: 'var(--brand-gold)', animation: 'streakSpark 1.5s ease-out infinite 0.4s', opacity: 0.6 }} />
          <div className="absolute" style={{ top: 4, left: '65%', width: 2, height: 2, borderRadius: '50%', background: '#FFFEF5', animation: 'streakSpark 1.8s ease-out infinite 0.8s', opacity: 0.7 }} />
        </>
      )}

      <style>{`
        @keyframes streakFlicker {
          0%, 100% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.15); opacity: 1; }
        }
        @keyframes streakDance {
          0% { transform: rotate(-2deg) scaleY(1); }
          100% { transform: rotate(2deg) scaleY(1.04); }
        }
        @keyframes streakPulse {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }
        @keyframes streakSpark {
          0% { transform: translateY(0) scale(1); opacity: 0.8; }
          100% { transform: translateY(-12px) scale(0); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

/** Compact row of dimension badges, shown below the main streak count. */
export function StreakDimensions({ dimensions }: { dimensions: StreakDimension[] }) {
  const active = dimensions.filter((d) => d.days > 0);
  if (active.length === 0) return null;

  return (
    <div className="flex flex-wrap justify-center gap-1 mt-1">
      {active.map((d) => (
        <span
          key={d.label}
          className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
          style={{
            background: 'rgba(248, 208, 17, 0.1)',
            color: 'var(--brand-gold)',
            border: '1px solid rgba(248, 208, 17, 0.2)',
          }}
        >
          {d.label} {d.days}d
        </span>
      ))}
    </div>
  );
}
