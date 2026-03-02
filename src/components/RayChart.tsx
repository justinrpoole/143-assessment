'use client';

import { useMemo } from 'react';
import { RAY_NAMES, RAY_VERBS } from '@/lib/types';
import { rayHex } from '@/lib/ui/ray-colors';

interface RayChartProps {
  rays: Record<string, { score: number; net_energy?: number; access_score?: number; eclipse_score?: number; eclipse_modifier: string }>;
  topTwo: string[];
  bottomRay: string;
}

export default function RayChart({ rays, topTwo, bottomRay }: RayChartProps) {
  const rayOrder = useMemo(
    () => Object.entries(rays).sort(([a], [b]) => Number(a.replace('R', '')) - Number(b.replace('R', ''))),
    [rays],
  );

  return (
    <section className="space-y-4">
      <h3 className="text-lg uppercase tracking-[0.16em]" style={{ color: '#25F6FF', fontFamily: 'var(--font-cosmic-display)', textShadow: '0 0 14px rgba(37,246,255,0.5)' }}>
        Nine-Ray Capacity Map
      </h3>
      <p className="text-sm" style={{ color: 'rgba(255,255,255,0.72)', fontFamily: 'var(--font-space-grotesk)' }}>
        Current-access profile across all nine Rays of Light.
      </p>

      <div
        className="rounded-2xl p-5 space-y-3 relative overflow-hidden"
        style={{
          background: '#060014',
          border: '1px solid rgba(37,246,255,0.2)',
          boxShadow: 'inset 0 0 30px rgba(37,246,255,0.06)',
        }}
      >
        <div className="pointer-events-none absolute inset-0" style={{ background: 'repeating-linear-gradient(180deg, rgba(0,0,0,0) 0px, rgba(0,0,0,0) 2px, rgba(0,0,0,0.25) 3px)' }} />

        {rayOrder.map(([id, ray], idx) => {
          const isTop = topTwo.includes(id);
          const isBottom = id === bottomRay;
          const displayScore = ray.net_energy ?? ray.score;
          const color = rayHex(id);

          return (
            <div key={id} className="flex items-center gap-3 relative" style={{ animation: `rayIn 800ms ease ${idx * 40}ms both` }}>
              <div className="w-28 text-right shrink-0">
                <div className="text-sm uppercase tracking-[0.08em]" style={{ color: '#25F6FF', fontFamily: 'var(--font-cosmic-display)' }}>
                  {RAY_NAMES[id]}
                </div>
                <div className="text-xs" style={{ color: 'rgba(255,255,255,0.55)', fontFamily: 'var(--font-space-grotesk)' }}>
                  {RAY_VERBS[id]}
                </div>
              </div>

              <div className="flex-1 relative">
                <div className="w-full h-7 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(37,246,255,0.2)' }}>
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${isTop ? 'animate-pulse' : ''}`}
                    style={{
                      width: `${Math.max(displayScore, 3)}%`,
                      background: `linear-gradient(90deg, ${color}, ${color}CC)`,
                      boxShadow: isTop
                        ? `0 0 10px ${color}, 0 0 22px ${color}`
                        : `0 0 8px ${color}99`,
                    }}
                  />
                </div>

                {isTop && (
                  <span
                    className="absolute top-1/2 -translate-y-1/2"
                    style={{ left: `calc(${Math.max(displayScore, 3)}% - 16px)`, width: 18, height: 18, borderRadius: 9999, border: `1px solid ${color}`, boxShadow: `0 0 12px ${color}`, animation: 'pulseRing 1.2s ease-in-out infinite' }}
                  />
                )}

                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-sm font-bold" style={{ color, textShadow: `0 0 10px ${color}`, fontFamily: 'var(--font-cosmic-display)' }}>
                  {Math.round(displayScore)}
                </span>
              </div>

              <div className="w-28 text-xs shrink-0 text-right" style={{ fontFamily: 'var(--font-cosmic-display)' }}>
                {isTop && <span className="inline-block px-2 py-0.5 rounded-full" style={{ border: `1px solid ${color}`, color, boxShadow: `0 0 12px ${color}` }}>POWER SOURCE</span>}
                {isBottom && <span className="inline-block px-2 py-0.5 rounded-full" style={{ border: '1px solid rgba(255,63,180,0.5)', color: '#FF3FB4' }}>◑ ECLIPSE</span>}
              </div>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        @keyframes pulseRing { 0%,100%{transform:translateY(-50%) scale(1); opacity:.6;} 50%{transform:translateY(-50%) scale(1.2); opacity:1;} }
        @keyframes rayIn { from { opacity:0; transform:translateX(-10px);} to {opacity:1; transform:translateX(0);} }
      `}</style>
    </section>
  );
}
