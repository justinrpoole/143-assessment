'use client';

import { useEffect, useMemo, useState } from 'react';
import { rayHex } from '@/lib/ui/ray-colors';

type Rep = {
  id?: string;
  tool_name?: string;
  logged_at: string;
  ray_number?: number | null;
};

type PositionedStar = {
  key: string;
  x: number;
  y: number;
  size: number;
  color: string;
  delay: number;
};

const BG_DEEP = '#1A0A2E';

const TOOL_TO_RAY: Record<string, number> = {
  watch_me: 1,
  go_first: 4,
  i_rise: 6,
  presence_pause: 3,
  ras_reset: 8,
  reflection_loop: 7,
  if_then_planning: 5,
  boundary_of_light: 7,
  question_loop: 5,
  witness: 6,
  let_them: 7,
  challenge_rep: 2,
  '143_challenge': 2,
  full_reps: 9,
  evidence_receipt: 9,
};

const ZONES: Record<number, { x: [number, number]; y: [number, number] }> = {
  1: { x: [8, 30], y: [8, 26] },
  2: { x: [70, 92], y: [8, 26] },
  3: { x: [36, 64], y: [6, 24] },
  4: { x: [8, 30], y: [34, 56] },
  5: { x: [36, 64], y: [34, 56] },
  6: { x: [70, 92], y: [34, 56] },
  7: { x: [8, 30], y: [64, 90] },
  8: { x: [70, 92], y: [64, 90] },
  9: { x: [38, 62], y: [66, 92] },
};

function inferRay(rep: Rep): number {
  if (typeof rep.ray_number === 'number' && rep.ray_number >= 1 && rep.ray_number <= 9) {
    return rep.ray_number;
  }
  if (rep.tool_name && TOOL_TO_RAY[rep.tool_name]) return TOOL_TO_RAY[rep.tool_name];
  return 9;
}

function seeded(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export default function StarChart() {
  const [reps, setReps] = useState<Rep[]>([]);

  useEffect(() => {
    fetch('/api/reps?limit=300')
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('reps_fetch_failed'))))
      .then((data: { reps?: Rep[] }) => setReps(data.reps ?? []))
      .catch(() => setReps([]));
  }, []);

  const stars = useMemo<PositionedStar[]>(() => {
    return reps.map((rep, index) => {
      const ray = inferRay(rep);
      const zone = ZONES[ray] ?? ZONES[9];
      const baseSeed = (new Date(rep.logged_at).getTime() || index + 1) + index * 17;
      const xr = seeded(baseSeed + 1);
      const yr = seeded(baseSeed + 2);
      const sr = seeded(baseSeed + 3);
      const x = zone.x[0] + xr * (zone.x[1] - zone.x[0]);
      const y = zone.y[0] + yr * (zone.y[1] - zone.y[0]);
      const size = 1.6 + sr * 2.8;
      const color = rayHex(`R${ray}`);
      return {
        key: rep.id ?? `${rep.logged_at}-${index}`,
        x,
        y,
        size,
        color,
        delay: (index % 24) * 0.06,
      };
    });
  }, [reps]);

  return (
    <section
      className="glass-card p-5 sm:p-6"
      style={{ background: `linear-gradient(180deg, ${BG_DEEP}, rgba(26,10,46,0.92))`, borderColor: 'rgba(248,208,17,0.2)' }}
    >
      <h3 className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: '#F8D011' }}>
        Star Chart
      </h3>

      <div className="relative w-full overflow-hidden rounded-2xl" style={{ minHeight: 320, background: BG_DEEP }}>
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
          {stars.map((star) => (
            <g key={star.key} style={{ animation: `starIn 550ms ease ${star.delay}s both` }}>
              <circle cx={star.x} cy={star.y} r={star.size * 2.8} fill={star.color} opacity={0.12} />
              <circle cx={star.x} cy={star.y} r={star.size} fill={star.color} opacity={0.95} style={{ animation: 'twinkle 2.8s ease-in-out infinite' }} />
            </g>
          ))}
        </svg>

        <div className="absolute inset-0 flex items-center justify-center text-center px-4 pointer-events-none">
          {stars.length > 0 ? (
            <p className="text-base sm:text-lg font-semibold" style={{ color: '#F8D011' }}>
              {stars.length} reps logged
            </p>
          ) : (
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.72)' }}>
              Log your first rep to light your first star
            </p>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes starIn {
          from { opacity: 0; transform: scale(0.5); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
      `}</style>
    </section>
  );
}
