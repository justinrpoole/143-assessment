'use client';

import { useRef, useState, useEffect } from 'react';

const RAYS = [
  { label: 'Intention', angle: 0, score: 0.82 },
  { label: 'Joy', angle: 40, score: 0.68 },
  { label: 'Presence', angle: 80, score: 0.75 },
  { label: 'Power', angle: 120, score: 0.88 },
  { label: 'Purpose', angle: 160, score: 0.45 },
  { label: 'Authenticity', angle: 200, score: 0.72 },
  { label: 'Connection', angle: 240, score: 0.65 },
  { label: 'Possibility', angle: 280, score: 0.78 },
  { label: 'Be The Light', angle: 320, score: 0.55 },
];

const CX = 140;
const CY = 140;
const R_MAX = 110;

function polarToCartesian(angleDeg: number, radius: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: CX + radius * Math.cos(rad), y: CY + radius * Math.sin(rad) };
}

/**
 * RadarMockup — An animated radar/spider chart showing a sample 9-Ray
 * Light Signature. Draws on scroll with CSS-animated stroke-dashoffset.
 */
export default function RadarMockup({ className }: { className?: string }) {
  const ref = useRef<SVGSVGElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Build the data polygon path
  const dataPoints = RAYS.map((r) => polarToCartesian(r.angle, r.score * R_MAX));
  const dataPath =
    dataPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ') + ' Z';

  // Grid rings
  const rings = [0.25, 0.5, 0.75, 1.0];

  return (
    <div className={className}>
      <svg
        ref={ref}
        viewBox="0 0 280 280"
        width="280"
        height="280"
        className="mx-auto"
        role="img"
        aria-label="Sample radar chart showing 9 Ray scores"
      >
        {/* Grid rings */}
        {rings.map((pct) => (
          <circle
            key={pct}
            cx={CX}
            cy={CY}
            r={R_MAX * pct}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="1"
          />
        ))}

        {/* Axis lines + labels */}
        {RAYS.map((r) => {
          const end = polarToCartesian(r.angle, R_MAX);
          const labelPos = polarToCartesian(r.angle, R_MAX + 14);
          return (
            <g key={r.label}>
              <line
                x1={CX}
                y1={CY}
                x2={end.x}
                y2={end.y}
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="1"
              />
              <text
                x={labelPos.x}
                y={labelPos.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="rgba(255,255,255,0.35)"
                fontSize="7"
                fontFamily="var(--font-body, Inter, sans-serif)"
              >
                {r.label}
              </text>
            </g>
          );
        })}

        {/* Data area fill */}
        <path
          d={dataPath}
          fill="rgba(248, 208, 17, 0.08)"
          stroke="none"
          style={{
            opacity: visible ? 1 : 0,
            transition: 'opacity 1s ease 0.3s',
          }}
        />

        {/* Data polygon outline — animated draw */}
        <path
          d={dataPath}
          fill="none"
          stroke="#F8D011"
          strokeWidth="1.5"
          strokeLinejoin="round"
          style={{
            strokeDasharray: 800,
            strokeDashoffset: visible ? 0 : 800,
            transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />

        {/* Data points */}
        {dataPoints.map((p, i) => (
          <circle
            key={RAYS[i].label}
            cx={p.x}
            cy={p.y}
            r={3}
            fill="#F8D011"
            style={{
              opacity: visible ? 1 : 0,
              transition: `opacity 0.3s ease ${0.8 + i * 0.1}s`,
            }}
          />
        ))}

        {/* Center dot */}
        <circle cx={CX} cy={CY} r="2" fill="rgba(248,208,17,0.3)" />
      </svg>

      {/* Caption */}
      <p
        className="mt-3 text-center text-[11px]"
        style={{ color: 'rgba(255,255,255,0.4)' }}
      >
        Sample Light Signature — your results will be unique to you
      </p>
    </div>
  );
}
