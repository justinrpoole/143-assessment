'use client';

import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useState, useCallback, useMemo } from 'react';

interface CometData {
  id: string;
  label: string;
  rayId?: string;
}

interface CometMomentsProps {
  /** Active comet opportunities */
  comets: CometData[];
  /** Callback when a comet is captured */
  onCapture?: (cometId: string) => void;
}

function seededRandom(seed: number): number {
  return ((seed * 1597 + 51749) % 244944) / 244944;
}

/**
 * Comet Moments (#10) — Opportunity Capture
 *
 * Brilliant comets streak across the purple sky with ion + dust tails.
 * Tapping captures the comet, adding it as a new glowing chip on the orbit map.
 * v3 branded: blue-white head, gold dust tail on royal purple.
 */
export default function CometMoments({ comets, onCapture }: CometMomentsProps) {
  const reducedMotion = useReducedMotion();
  const [capturedIds, setCapturedIds] = useState<Set<string>>(new Set());

  const W = 700;
  const H = 380;

  const handleCapture = useCallback(
    (id: string) => {
      setCapturedIds((prev) => new Set(prev).add(id));
      onCapture?.(id);
    },
    [onCapture],
  );

  // Dust particles for each comet tail
  const dustParticles = useMemo(() => {
    return comets.map((_, idx) => {
      const pts: Array<{ x: number; y: number; size: number; opacity: number }> = [];
      const baseY = 50 + idx * 90;
      for (let i = 0; i < 40; i++) {
        const t = i / 40;
        pts.push({
          x: W * 0.85 - t * W * 0.55 + (seededRandom(idx * 200 + i * 3) - 0.5) * 20,
          y: baseY + t * 40 + (seededRandom(idx * 200 + i * 3 + 1) - 0.5) * 15 - t * 15,
          size: 0.5 + seededRandom(idx * 200 + i * 3 + 2) * 1.5,
          opacity: (1 - t) * 0.5,
        });
      }
      return pts;
    });
  }, [comets]);

  // Landing positions for captured comets (orbit map chips)
  const landingPositions = useMemo(() => {
    const cx = W / 2;
    const cy = H - 60;
    return comets.map((_, idx) => {
      const angle = -Math.PI * 0.3 + idx * 0.6;
      const r = 55;
      return { x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r * 0.5 };
    });
  }, [comets]);

  return (
    <div className="glass-card p-5">
      <p
        className="mb-3"
        style={{ color: 'var(--text-on-dark-secondary)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}
      >
        Comet Opportunities
      </p>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" aria-label="Comet opportunity capture">
        <defs>
          <radialGradient id="cm-bg">
            <stop offset="0%" stopColor="var(--cosmic-purple-vivid)" />
            <stop offset="100%" stopColor="var(--cosmic-svg-bg)" />
          </radialGradient>
          <radialGradient id="cm-head">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="40%" stopColor="#E8F4FD" />
            <stop offset="100%" stopColor="#BDE0FE" stopOpacity="0" />
          </radialGradient>
          <filter id="cm-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        <rect width={W} height={H} rx="12" fill="url(#cm-bg)" />

        {/* Background stars */}
        {Array.from({ length: 25 }).map((_, i) => (
          <circle
            key={i}
            cx={seededRandom(i * 11) * W}
            cy={seededRandom(i * 11 + 1) * H * 0.7}
            r={0.6}
            fill="#FFFFFF"
            opacity={0.15 + seededRandom(i * 11 + 2) * 0.15}
          />
        ))}

        {/* Mini orbit map at bottom */}
        <circle cx={W / 2} cy={H - 60} r={8} fill="#F4C430" opacity={0.2} />
        <ellipse cx={W / 2} cy={H - 60} rx={55} ry={28} fill="none" stroke="#FFFFFF" strokeWidth={0.5} strokeOpacity={0.1} strokeDasharray="3 5" />

        {/* Captured chips on orbit map */}
        {comets.map((comet, idx) => {
          if (!capturedIds.has(comet.id)) return null;
          const lp = landingPositions[idx];
          return (
            <g key={`captured-${comet.id}`}>
              <motion.circle
                cx={lp.x}
                cy={lp.y}
                r={6}
                fill="#F4C430"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
                style={{ transformOrigin: `${lp.x}px ${lp.y}px` }}
              />
              {/* Tiny comet tail wisp */}
              <line x1={lp.x + 6} y1={lp.y - 2} x2={lp.x + 16} y2={lp.y - 6} stroke="#F4C430" strokeWidth={0.8} strokeOpacity={0.3} />
            </g>
          );
        })}

        {/* Active comets */}
        {comets.map((comet, idx) => {
          if (capturedIds.has(comet.id)) return null;
          const headX = W * 0.85;
          const headY = 50 + idx * 90;

          return (
            <g key={comet.id}>
              {/* Gold dust tail (curved, broader) */}
              {dustParticles[idx]?.map((dp, di) => (
                <motion.circle
                  key={di}
                  cx={dp.x}
                  cy={dp.y}
                  r={dp.size}
                  fill="#F4C430"
                  initial={false}
                  animate={
                    !reducedMotion
                      ? { opacity: [dp.opacity * 0.3, dp.opacity, dp.opacity * 0.3] }
                      : { opacity: dp.opacity * 0.6 }
                  }
                  transition={
                    !reducedMotion
                      ? { duration: 2 + seededRandom(idx * 200 + di) * 2, repeat: Infinity, ease: 'easeInOut' }
                      : undefined
                  }
                />
              ))}

              {/* Ion tail (straight, narrow, blue-white) */}
              <line
                x1={headX}
                y1={headY}
                x2={headX - W * 0.45}
                y2={headY + 5}
                stroke="#BDE0FE"
                strokeWidth={1.5}
                strokeOpacity={0.35}
              />

              {/* Comet head */}
              <circle cx={headX} cy={headY} r={8} fill="url(#cm-head)" filter="url(#cm-glow)" />
              <circle cx={headX} cy={headY} r={3} fill="#FFFFFF" />

              {/* Pulsing capture ring */}
              <motion.circle
                cx={headX}
                cy={headY}
                r={16}
                fill="none"
                stroke="#F4C430"
                strokeWidth={1}
                strokeDasharray="4 4"
                initial={false}
                animate={
                  !reducedMotion
                    ? { strokeOpacity: [0.15, 0.4, 0.15] }
                    : { strokeOpacity: 0.25 }
                }
                transition={
                  !reducedMotion
                    ? { duration: 1.5, repeat: Infinity, ease: 'easeInOut' }
                    : undefined
                }
              />

              {/* Tap target */}
              <circle
                cx={headX}
                cy={headY}
                r={25}
                fill="transparent"
                className="cosmic-focus-target"
                role="button"
                tabIndex={0}
                aria-label={`Capture opportunity: ${comet.label}`}
                style={{ cursor: 'pointer' }}
                onClick={() => handleCapture(comet.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleCapture(comet.id);
                  }
                }}
              />

              {/* Label */}
              <text x={headX} y={headY + 28} textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="500" opacity={0.5}>
                {comet.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
