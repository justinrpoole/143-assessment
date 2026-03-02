'use client';

import { useMemo, useState } from 'react';

const WEEKS = [
  { week: 1, score: 52, note: 'Baseline assessment' },
  { week: 2, score: 54, note: 'Started morning routine' },
  { week: 3, score: 58, note: 'First rep consistency' },
  { week: 4, score: 56, note: 'Stressful week — eclipse dip' },
  { week: 5, score: 61, note: 'Recovered. Practice held.' },
  { week: 6, score: 64, note: 'Energy audit added' },
  { week: 7, score: 66, note: 'Team noticed the shift' },
  { week: 8, score: 71, note: 'New baseline established' },
];

const MIN_SCORE = 45;
const MAX_SCORE = 80;

export default function ScoreMovementChart() {
  const [hovered, setHovered] = useState<number | null>(null);
  const activeWeek = hovered !== null ? WEEKS[hovered] : null;

  const points = useMemo(() => WEEKS.map((w, i) => {
    const x = i * 60 + 30;
    const y = 160 - ((w.score - MIN_SCORE) / (MAX_SCORE - MIN_SCORE)) * 140 - 10;
    return { x, y };
  }), []);

  return (
    <div className="space-y-5">
      <div className="rounded-2xl p-5 sm:p-7 relative overflow-hidden" style={{ background: '#060014', border: '1px solid rgba(37,246,255,0.2)' }}>
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(180deg, rgba(0,0,0,0) 0px, rgba(0,0,0,0) 2px, rgba(0,0,0,0.22) 3px)' }} />
        <div className="mb-4 flex items-center justify-between relative z-10">
          <div>
            <p className="text-[10px] uppercase tracking-[0.15em]" style={{ color: '#25F6FF', fontFamily: 'var(--font-cosmic-display)' }}>Presence Ray — Weekly Scan</p>
            <p className="mt-1 text-xs" style={{ color: 'rgba(255,255,255,0.58)' }}>Hover to see story behind each point</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold tabular-nums" style={{ color: '#F8D011', fontFamily: 'var(--font-cosmic-display)', textShadow: '0 0 18px rgba(248,208,17,0.75)' }}>
              {activeWeek ? activeWeek.score : WEEKS[WEEKS.length - 1].score}
            </p>
            <p className="text-[10px]" style={{ color: '#25F6FF', fontFamily: 'var(--font-cosmic-display)' }}>{activeWeek ? `Week ${activeWeek.week}` : 'Current'}</p>
          </div>
        </div>

        <div className="relative z-10" style={{ height: 160 }}>
          <svg viewBox={`0 0 ${WEEKS.length * 60} 160`} className="w-full" style={{ overflow: 'visible' }}>
            {[50, 60, 70].map((val) => {
              const y = 160 - ((val - MIN_SCORE) / (MAX_SCORE - MIN_SCORE)) * 140 - 10;
              return (
                <g key={val}>
                  <line x1={0} x2={WEEKS.length * 60} y1={y} y2={y} stroke="rgba(37,246,255,0.08)" />
                  <text x={-4} y={y + 3} fill="rgba(37,246,255,0.72)" fontSize={10} textAnchor="end" style={{ fontFamily: 'var(--font-cosmic-display)' }}>{val}</text>
                </g>
              );
            })}

            <defs>
              <linearGradient id="tron-area" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#25F6FF" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#25F6FF" stopOpacity={0} />
              </linearGradient>
            </defs>

            <polyline
              fill="none"
              stroke="#25F6FF"
              strokeWidth={2.5}
              strokeLinejoin="round"
              strokeLinecap="round"
              points={points.map((p) => `${p.x},${p.y}`).join(' ')}
              style={{ filter: 'drop-shadow(0 0 8px #25F6FF)' }}
            />

            <polygon fill="url(#tron-area)" points={[`${points[0].x},160`, ...points.map((p) => `${p.x},${p.y}`), `${points[points.length - 1].x},160`].join(' ')} />

            {WEEKS.map((w, i) => {
              const p = points[i];
              const isHovered = hovered === i;
              return (
                <g key={i}>
                  <circle cx={p.x} cy={p.y} r={14} fill="transparent" onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)} style={{ cursor: 'pointer' }} />
                  <circle cx={p.x} cy={p.y} r={isHovered ? 5 : 3.5} fill="#060014" stroke="#25F6FF" strokeWidth={2} style={{ filter: 'drop-shadow(0 0 7px #25F6FF)' }} />
                  <text x={p.x} y={155} fill="rgba(37,246,255,0.8)" fontSize={10} textAnchor="middle" style={{ fontFamily: 'var(--font-cosmic-display)' }}>W{w.week}</text>
                </g>
              );
            })}
          </svg>
        </div>

        <div className="mt-3 rounded-lg px-4 py-2.5 text-center relative z-10" style={{ background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(37,246,255,0.35)' }}>
          <p className="text-sm" style={{ color: '#25F6FF', fontFamily: 'var(--font-cosmic-display)' }}>
            {activeWeek ? `Week ${activeWeek.week}: ${activeWeek.note}` : 'Hover a data point to inspect the signal'}
          </p>
        </div>
      </div>
    </div>
  );
}
