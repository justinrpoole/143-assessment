'use client';

import { RAY_NAMES, RAY_VERBS } from '@/lib/types';

interface RayChartProps {
  rays: Record<string, { score: number; net_energy?: number; access_score?: number; eclipse_score?: number; eclipse_modifier: string }>;
  topTwo: string[];
  bottomRay: string;
}

export default function RayChart({ rays, topTwo, bottomRay }: RayChartProps) {
  const rayOrder = Object.entries(rays).sort(([a], [b]) => {
    const aNum = Number(a.replace('R', ''));
    const bNum = Number(b.replace('R', ''));
    return aNum - bNum;
  });

  return (
    <section className="space-y-4">
      <h3 className="text-lg font-semibold" style={{ color: 'var(--text-on-dark)' }}>Nine-Ray Capacity Map</h3>
      <p className="text-sm" style={{ color: 'var(--text-on-dark-secondary)' }}>
        Current-access profile across all nine Rays of Light.
      </p>

      <div className="glass-card p-5 space-y-3">
        {rayOrder.map(([id, ray]) => {
          const isTop = topTwo.includes(id);
          const isBottom = id === bottomRay;
          const displayScore = ray.net_energy ?? ray.score;

          return (
            <div key={id} className="flex items-center gap-3">
              <div className="w-28 text-right shrink-0">
                <div className="text-sm font-medium" style={{ color: 'var(--text-on-dark)' }}>
                  {RAY_NAMES[id]}
                </div>
                <div className="text-xs" style={{ color: 'var(--text-on-dark-muted)' }}>
                  {RAY_VERBS[id]}
                </div>
              </div>

              <div className="flex-1 relative">
                <div className="w-full h-6 rounded-full overflow-hidden" style={{ background: 'rgba(96, 5, 141, 0.25)' }}>
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${Math.max(displayScore, 3)}%`,
                      background: isTop
                        ? 'linear-gradient(90deg, #60058D 0%, #F8D011 100%)'
                        : isBottom
                          ? 'linear-gradient(90deg, #60058D 0%, #A78BFA 100%)'
                          : 'linear-gradient(90deg, #60058D 0%, #9B59B6 100%)',
                    }}
                  />
                </div>
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold" style={{ color: 'var(--text-on-dark)' }}>
                  {Math.round(displayScore)}
                </span>
              </div>

              <div className="w-28 text-xs shrink-0 text-right">
                {isTop && (
                  <span className="inline-block px-2 py-0.5 rounded-full font-semibold" style={{ background: 'rgba(248, 208, 17, 0.15)', color: '#F8D011' }}>
                    Power Source
                  </span>
                )}
                {isBottom && (
                  <span className="inline-block px-2 py-0.5 rounded-full font-semibold" style={{ background: 'rgba(148, 80, 200, 0.25)', color: 'var(--text-on-dark-secondary)' }}>
                    Train Next
                  </span>
                )}
                {ray.eclipse_modifier === 'AMPLIFIED' && (
                  <span className="inline-block px-2 py-0.5 bg-red-500/20 text-red-400 rounded-full font-semibold">
                    Load Amplified
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
