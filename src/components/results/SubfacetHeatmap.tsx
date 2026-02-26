'use client';

import { useState } from 'react';
import type { RayOutput } from '@/lib/types';
import { RAY_SHORT_NAMES, SUBFACET_NAMES } from '@/lib/types';
import { rayHex } from '@/lib/ui/ray-colors';

interface Props {
  rays: Record<string, RayOutput>;
}

// Score to color mapping (cosmic theme)
function scoreColor(score: number): string {
  if (score >= 80) return '#34D399'; // emerald — mastery
  if (score >= 60) return '#F8D011'; // gold — active capacity
  if (score >= 40) return '#FB923C'; // amber — emerging
  if (score >= 20) return '#F87171'; // rose — training edge
  return '#94A3B8';                  // slate — dormant
}

function scoreLabel(score: number): string {
  if (score >= 80) return 'Mastery';
  if (score >= 60) return 'Active';
  if (score >= 40) return 'Emerging';
  if (score >= 20) return 'Training';
  return 'Dormant';
}

const RAY_ORDER = ['R1', 'R2', 'R3', 'R4', 'R5', 'R6', 'R7', 'R8', 'R9'];
const SUBFACET_SUFFIXES = ['a', 'b', 'c', 'd'];

/**
 * 9×4 heatmap grid showing all 36 subfacets color-coded by score.
 * Rows = rays (R1-R9), columns = subfacets (a-d).
 * Hover/tap for details.
 */
export default function SubfacetHeatmap({ rays }: Props) {
  const [selected, setSelected] = useState<{ rayId: string; sfCode: string; score: number; label: string } | null>(null);

  return (
    <section className="space-y-4">
      <h3 className="text-lg font-semibold" style={{ color: 'var(--text-on-dark)' }}>
        Subfacet Mastery Map
      </h3>
      <p className="text-sm" style={{ color: 'var(--text-on-dark-secondary)' }}>
        Each ray is built from four subfacets. This grid shows where your capacity is concentrated
        and where it&apos;s still forming. Tap any cell for details.
      </p>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 text-xs" style={{ color: 'var(--text-on-dark-muted)' }}>
        {[
          { label: 'Mastery (80+)', color: '#34D399' },
          { label: 'Active (60-79)', color: '#F8D011' },
          { label: 'Emerging (40-59)', color: '#FB923C' },
          { label: 'Training (20-39)', color: '#F87171' },
          { label: 'Dormant (<20)', color: '#94A3B8' },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <span
              className="w-3 h-3 rounded-sm"
              style={{ background: item.color }}
              aria-hidden="true"
            />
            <span>{item.label}</span>
          </div>
        ))}
      </div>

      {/* Heatmap grid */}
      <div className="glass-card p-4 overflow-x-auto">
        <table className="w-full border-collapse" style={{ minWidth: '320px' }}>
          <thead>
            <tr>
              <th className="text-left text-xs font-medium px-2 py-1.5" style={{ color: 'var(--brand-gold)', width: '100px' }}>
                Ray
              </th>
              {SUBFACET_SUFFIXES.map((s) => (
                <th key={s} className="text-center text-xs font-medium px-1 py-1.5" style={{ color: 'var(--text-on-dark-muted)' }}>
                  {s.toUpperCase()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {RAY_ORDER.map((rayId) => {
              const ray = rays[rayId];
              if (!ray) return null;
              const subfacets = ray.subfacets ?? {};

              return (
                <tr key={rayId}>
                  <td className="text-xs font-medium px-2 py-1" style={{ color: rayHex(rayId) }}>
                    {RAY_SHORT_NAMES[rayId] ?? rayId}
                  </td>
                  {SUBFACET_SUFFIXES.map((suffix) => {
                    const sfCode = `${rayId}${suffix}`;
                    const sf = subfacets[sfCode];
                    const score = sf?.score ?? 0;
                    const color = scoreColor(score);
                    const label = SUBFACET_NAMES[sfCode] ?? sfCode;
                    const isSelected = selected?.sfCode === sfCode;

                    return (
                      <td key={sfCode} className="px-1 py-1">
                        <button
                          onClick={() => setSelected(isSelected ? null : { rayId, sfCode, score, label })}
                          className="w-full aspect-square rounded-md transition-all relative"
                          style={{
                            background: color,
                            opacity: sf ? 1 : 0.25,
                            boxShadow: isSelected ? `0 0 0 2px ${color}, 0 0 8px ${color}60` : 'none',
                            minHeight: '28px',
                          }}
                          aria-label={`${label}: ${Math.round(score)}%`}
                          title={`${label}: ${Math.round(score)}%`}
                        >
                          <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold" style={{ color: score >= 60 ? '#0B0212' : '#fff' }}>
                            {sf ? Math.round(score) : '—'}
                          </span>
                        </button>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Detail panel */}
      {selected && (
        <div
          className="rounded-xl p-4 transition-all"
          style={{
            background: `${scoreColor(selected.score)}10`,
            border: `1px solid ${scoreColor(selected.score)}30`,
          }}
        >
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-sm font-semibold" style={{ color: 'var(--text-on-dark)' }}>
              {selected.label}
            </span>
            <span
              className="text-xs font-bold px-2 py-0.5 rounded-full"
              style={{ background: `${scoreColor(selected.score)}20`, color: scoreColor(selected.score) }}
            >
              {Math.round(selected.score)}% — {scoreLabel(selected.score)}
            </span>
          </div>
          <p className="text-xs" style={{ color: 'var(--text-on-dark-secondary)' }}>
            {RAY_SHORT_NAMES[selected.rayId]} &middot; Subfacet {selected.sfCode.slice(-1).toUpperCase()}
          </p>
          {selected.score < 60 && (
            <p className="text-xs mt-2 italic" style={{ color: 'var(--text-on-dark-muted)' }}>
              This subfacet is below active threshold. Targeted reps on {RAY_SHORT_NAMES[selected.rayId]} will build capacity here.
            </p>
          )}
          {selected.score >= 80 && (
            <p className="text-xs mt-2 italic" style={{ color: 'var(--text-on-dark-muted)' }}>
              Mastery level. This is a source of natural strength you can draw on under pressure.
            </p>
          )}
        </div>
      )}
    </section>
  );
}
