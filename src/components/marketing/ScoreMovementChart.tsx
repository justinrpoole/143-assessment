'use client';

import { useState } from 'react';

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

  return (
    <div className="space-y-5">
      {/* Chart container */}
      <div className="glass-card p-5 sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p
              className="text-[10px] font-bold uppercase tracking-widest"
              style={{ color: '#F8D011' }}
            >
              Presence Ray — Weekly Scan
            </p>
            <p
              className="mt-1 text-xs"
              style={{ color: 'rgba(255,255,255,0.5)' }}
            >
              Hover to see the story behind each data point
            </p>
          </div>
          <div className="text-right">
            <p
              className="text-2xl font-bold tabular-nums"
              style={{ color: '#F8D011', fontFamily: 'var(--font-cosmic-display)' }}
            >
              {activeWeek ? activeWeek.score : WEEKS[WEEKS.length - 1].score}
            </p>
            <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.4)' }}>
              {activeWeek ? `Week ${activeWeek.week}` : 'Current'}
            </p>
          </div>
        </div>

        {/* SVG Chart */}
        <div className="relative" style={{ height: 160 }}>
          <svg
            viewBox={`0 0 ${WEEKS.length * 60} 160`}
            className="w-full"
            style={{ overflow: 'visible' }}
          >
            {/* Grid lines */}
            {[50, 60, 70].map((val) => {
              const y = 160 - ((val - MIN_SCORE) / (MAX_SCORE - MIN_SCORE)) * 140 - 10;
              return (
                <g key={val}>
                  <line
                    x1={0}
                    x2={WEEKS.length * 60}
                    y1={y}
                    y2={y}
                    stroke="rgba(255,255,255,0.06)"
                    strokeDasharray="4 4"
                  />
                  <text
                    x={-4}
                    y={y + 3}
                    fill="rgba(255,255,255,0.25)"
                    fontSize={9}
                    textAnchor="end"
                  >
                    {val}
                  </text>
                </g>
              );
            })}

            {/* Line path */}
            <polyline
              fill="none"
              stroke="#F8D011"
              strokeWidth={2}
              strokeLinejoin="round"
              strokeLinecap="round"
              points={WEEKS.map((w, i) => {
                const x = i * 60 + 30;
                const y = 160 - ((w.score - MIN_SCORE) / (MAX_SCORE - MIN_SCORE)) * 140 - 10;
                return `${x},${y}`;
              }).join(' ')}
            />

            {/* Gradient fill under the line */}
            <defs>
              <linearGradient id="chart-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F8D011" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#F8D011" stopOpacity={0} />
              </linearGradient>
            </defs>
            <polygon
              fill="url(#chart-fill)"
              points={[
                `${30},${160}`,
                ...WEEKS.map((w, i) => {
                  const x = i * 60 + 30;
                  const y = 160 - ((w.score - MIN_SCORE) / (MAX_SCORE - MIN_SCORE)) * 140 - 10;
                  return `${x},${y}`;
                }),
                `${(WEEKS.length - 1) * 60 + 30},${160}`,
              ].join(' ')}
            />

            {/* Data points */}
            {WEEKS.map((w, i) => {
              const x = i * 60 + 30;
              const y = 160 - ((w.score - MIN_SCORE) / (MAX_SCORE - MIN_SCORE)) * 140 - 10;
              const isHovered = hovered === i;
              return (
                <g key={i}>
                  {/* Hover target (larger invisible circle) */}
                  <circle
                    cx={x}
                    cy={y}
                    r={14}
                    fill="transparent"
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(null)}
                    style={{ cursor: 'pointer' }}
                  />
                  {/* Visible dot */}
                  <circle
                    cx={x}
                    cy={y}
                    r={isHovered ? 5 : 3.5}
                    fill={isHovered ? '#F8D011' : '#020202'}
                    stroke="#F8D011"
                    strokeWidth={2}
                    style={{ transition: 'r 0.15s ease' }}
                  />
                  {/* Week label */}
                  <text
                    x={x}
                    y={155}
                    fill="rgba(255,255,255,0.3)"
                    fontSize={9}
                    textAnchor="middle"
                  >
                    W{w.week}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Hover tooltip */}
        <div
          className="mt-3 rounded-lg px-4 py-2.5 text-center transition-opacity duration-200"
          style={{
            background: 'rgba(248,208,17,0.06)',
            border: '1px solid rgba(248,208,17,0.15)',
            opacity: activeWeek ? 1 : 0.4,
          }}
        >
          <p className="text-sm" style={{ color: 'var(--text-on-dark, #FFFEF5)' }}>
            {activeWeek ? (
              <>
                <span className="font-bold" style={{ color: '#F8D011' }}>
                  Week {activeWeek.week}: {activeWeek.note}
                </span>{' '}
                — Presence moved to{' '}
                <span className="font-bold tabular-nums" style={{ color: '#F8D011' }}>
                  {activeWeek.score}
                </span>
              </>
            ) : (
              <span style={{ color: 'rgba(255,255,255,0.5)' }}>
                Hover a data point to see the story behind the score
              </span>
            )}
          </p>
        </div>
      </div>

      <p
        className="text-center text-xs"
        style={{ color: 'rgba(255,255,255,0.4)' }}
      >
        Simulated data based on typical coaching engagement patterns.
        Your trajectory will be unique to your practice.
      </p>
    </div>
  );
}
