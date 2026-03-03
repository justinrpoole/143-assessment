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
      <h3 className="text-lg uppercase tracking-[0.16em] text-neon-cyan" style={{ fontFamily: 'var(--font-cosmic-display)', textShadow: 'var(--text-glow-cyan)' }}>
        Nine-Ray Capacity Map
      </h3>
      <p className="text-sm text-secondary" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
        Current-access profile across all nine Rays of Light.
      </p>

      <div
        className="rounded-2xl p-5 space-y-3 relative overflow-hidden"
        style={{
          background: 'var(--bg-deep)',
          border: '1px solid var(--surface-border)',
          boxShadow: 'inset 0 0 30px color-mix(in srgb, var(--neon-cyan) 12%, transparent)',
          fontFamily: "'Orbitron', var(--font-cosmic-display)",
        }}
      >
        <div className="pointer-events-none absolute inset-0" style={{ background: 'repeating-linear-gradient(180deg, transparent 0px, transparent 2px, color-mix(in srgb, var(--ink-950) 25%, transparent) 3px)' }} />

        {rayOrder.map(([id, ray], idx) => {
          const isTop = topTwo.includes(id);
          const isBottom = id === bottomRay;
          const displayScore = ray.net_energy ?? ray.score;
          const color = rayHex(id);

          return (
            <div key={id} className="flex items-center gap-3 relative" style={{ animation: `rayIn 800ms ease ${idx * 40}ms both` }}>
              <div className="w-28 text-right shrink-0">
                <div className="text-sm uppercase tracking-[0.08em] text-neon-cyan" style={{ fontFamily: 'var(--font-cosmic-display)' }}>
                  {RAY_NAMES[id]}
                </div>
                <div className="text-xs text-muted" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
                  {RAY_VERBS[id]}
                </div>
              </div>

              <div className="flex-1 relative">
                <div className="w-full h-7 rounded-full overflow-hidden" style={{ background: 'color-mix(in srgb, var(--ink-950) 60%, transparent)', border: '1px solid var(--surface-border)' }}>
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
                {isBottom && (
                  <span
                    className="inline-block px-2 py-0.5 rounded-full"
                    style={{ border: "1px solid color-mix(in srgb, var(--neon-pink) 50%, transparent)", color: "var(--neon-pink)" }}
                  >
                    ◑ ECLIPSE
                  </span>
                )}
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
