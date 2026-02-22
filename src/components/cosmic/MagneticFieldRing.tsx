'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useMemo } from 'react';
import type { RayOutput } from '@/lib/types';

interface MagneticFieldRingProps {
  /** All ray outputs — coherence is derived from score consistency */
  rays: Record<string, RayOutput>;
}

function seededRandom(seed: number): number {
  return ((seed * 1597 + 51749) % 244944) / 244944;
}

/**
 * Magnetic Field Ring — Coherence Visualization (#3)
 *
 * Side-by-side LOW vs HIGH coherence states with deep space backdrop,
 * neon glow halos, scattered energy particles, CRT scanlines, and
 * vintage instrument readouts. Active state highlighted with bloom.
 * v4 vintage cockpit: 80s phosphor glow, deep space, instrument panels.
 */
export default function MagneticFieldRing({ rays }: MagneticFieldRingProps) {
  const reducedMotion = useReducedMotion();

  const coherence = useMemo(() => {
    const scores = Object.values(rays)
      .map((r) => r.net_energy ?? r.score)
      .filter((s) => s != null);
    if (scores.length < 2) return 0.5;
    const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
    const variance = scores.reduce((a, s) => a + (s - mean) ** 2, 0) / scores.length;
    return Math.max(0, Math.min(1, 1 - Math.sqrt(variance) / 35));
  }, [rays]);

  const isHighCoherence = coherence >= 0.5;

  const W = 800;
  const H = 360;
  const HALF = W / 2;
  const GAP = 6;
  const LEFT_CX = HALF / 2;
  const RIGHT_CX = HALF + HALF / 2;
  const CY = H / 2;
  const SUN_R = 18;

  const lowParticles = useMemo(() => {
    const result: Array<{ x: number; y: number; r: number; speed: number }> = [];
    for (let i = 0; i < 25; i++) {
      const angle = seededRandom(i * 5 + 1) * Math.PI * 2;
      const dist = 45 + seededRandom(i * 5 + 2) * 85;
      result.push({
        x: LEFT_CX + Math.cos(angle) * dist,
        y: CY + Math.sin(angle) * dist,
        r: 0.8 + seededRandom(i * 5 + 3) * 2,
        speed: 2 + seededRandom(i * 5 + 5) * 4,
      });
    }
    return result;
  }, []);

  const lowRingPath = useMemo(() => {
    const points: string[] = [];
    const segments = 36;
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      const noise = Math.sin(angle * 3) * 14 + Math.cos(angle * 7) * 10 + Math.sin(angle * 11) * 6;
      const r = 58 + noise;
      const x = LEFT_CX + Math.cos(angle) * r;
      const y = CY + Math.sin(angle) * r;
      points.push(`${i === 0 ? 'M' : 'L'} ${x} ${y}`);
    }
    return points.join(' ') + ' Z';
  }, []);

  return (
    <div
      className="glass-card p-5"
      role="img"
      aria-label={`Magnetic coherence: ${isHighCoherence ? 'high' : 'low'} — ${Math.round(coherence * 100)} percent aligned`}
    >
      <p
        className="mb-3"
        style={{ color: 'var(--text-on-dark-secondary)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}
      >
        Magnetic Coherence
      </p>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" aria-hidden="true">
        <defs>
          {/* Deep space backgrounds */}
          <radialGradient id="mfr-bg-left" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#0f0520" />
            <stop offset="60%" stopColor="#0a0318" />
            <stop offset="100%" stopColor="#050210" />
          </radialGradient>
          <radialGradient id="mfr-bg-right" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#1a0a35" />
            <stop offset="60%" stopColor="#0f0520" />
            <stop offset="100%" stopColor="#050210" />
          </radialGradient>

          {/* Low coherence ring gradient */}
          <linearGradient id="mfr-low-ring" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#F4C430" stopOpacity="0.3" />
            <stop offset="25%" stopColor="#A0D468" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#BDC3C7" stopOpacity="0.25" />
            <stop offset="75%" stopColor="#F4C430" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#C39BD3" stopOpacity="0.2" />
          </linearGradient>

          {/* High coherence ring gradient */}
          <radialGradient id="mfr-high-ring" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#F4C430" stopOpacity="0" />
            <stop offset="55%" stopColor="#F4C430" stopOpacity="0.08" />
            <stop offset="75%" stopColor="#F4C430" stopOpacity="0.5" />
            <stop offset="85%" stopColor="#F4C430" stopOpacity="0.65" />
            <stop offset="93%" stopColor="#FFF8E7" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#FFF8E7" stopOpacity="0" />
          </radialGradient>

          {/* Sun gradients */}
          <radialGradient id="mfr-low-sun" cx="42%" cy="38%">
            <stop offset="0%" stopColor="#F5E6CC" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#F4C430" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#E8A317" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="mfr-high-sun" cx="38%" cy="38%" r="56%">
            <stop offset="0%" stopColor="#FFFDF5" />
            <stop offset="25%" stopColor="#FFF8E7" />
            <stop offset="55%" stopColor="#F4C430" />
            <stop offset="80%" stopColor="#E8A317" />
            <stop offset="100%" stopColor="#A8820A" />
          </radialGradient>

          {/* Glow filters */}
          <filter id="mfr-glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="mfr-bloom" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="b1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="b2" />
            <feMerge>
              <feMergeNode in="b1" />
              <feMergeNode in="b2" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="mfr-particle-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="2" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Nebula patches */}
          <radialGradient id="mfr-nebula-l" cx="40%" cy="35%">
            <stop offset="0%" stopColor="#6B21A8" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#6B21A8" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="mfr-nebula-r" cx="60%" cy="55%">
            <stop offset="0%" stopColor="#F4C430" stopOpacity="0.03" />
            <stop offset="100%" stopColor="#F4C430" stopOpacity="0" />
          </radialGradient>

          {/* Scanline pattern */}
          <pattern id="mfr-scanlines" width="4" height="4" patternUnits="userSpaceOnUse">
            <rect width="4" height="2" fill="rgba(0,0,0,0.05)" />
          </pattern>
        </defs>

        {/* ── Backgrounds — deep space ── */}
        <rect x={0} y={0} width={HALF - GAP / 2} height={H} rx="12" fill="url(#mfr-bg-left)" />
        <rect x={HALF + GAP / 2} y={0} width={HALF - GAP / 2} height={H} rx="12" fill="url(#mfr-bg-right)" />

        {/* Nebula depth */}
        <ellipse cx={LEFT_CX - 30} cy={CY - 30} rx={90} ry={60} fill="url(#mfr-nebula-l)" />
        <ellipse cx={RIGHT_CX + 20} cy={CY + 20} rx={80} ry={55} fill="url(#mfr-nebula-r)" />

        {/* Background stars — both sides */}
        {Array.from({ length: 35 }).map((_, i) => {
          const side = i < 18 ? 0 : HALF + GAP / 2;
          const w = HALF - GAP / 2;
          return (
            <motion.circle
              key={`bgstar-${i}`}
              cx={side + seededRandom(i * 31) * w}
              cy={seededRandom(i * 31 + 1) * H}
              r={0.3 + seededRandom(i * 31 + 2) * 0.5}
              fill="#FFFFFF"
              initial={false}
              animate={
                !reducedMotion && i % 6 === 0
                  ? { opacity: [0.04 + seededRandom(i * 31 + 3) * 0.06, 0.12 + seededRandom(i * 31 + 3) * 0.1, 0.04 + seededRandom(i * 31 + 3) * 0.06] }
                  : { opacity: 0.04 + seededRandom(i * 31 + 3) * 0.08 }
              }
              transition={!reducedMotion && i % 6 === 0
                ? { duration: 2.5 + seededRandom(i * 31 + 4) * 3, repeat: Infinity, ease: 'easeInOut' }
                : undefined
              }
            />
          );
        })}

        {/* ════════════ LEFT — LOW COHERENCE ════════════ */}

        {/* Desaturated sun with faded glow */}
        <circle cx={LEFT_CX} cy={CY} r={SUN_R * 2.2} fill="url(#mfr-low-sun)" opacity={0.35} />
        <circle cx={LEFT_CX} cy={CY} r={SUN_R} fill="#F5E6CC" opacity={0.55} />
        <circle cx={LEFT_CX - 2} cy={CY - 2} r={SUN_R * 0.2} fill="white" opacity={0.15} />

        {/* Irregular halo ring — fractured with glow */}
        <motion.path
          d={lowRingPath} fill="none"
          stroke="url(#mfr-low-ring)" strokeWidth={3}
          strokeDasharray="8 4 3 6"
          initial={false}
          animate={!reducedMotion ? { strokeOpacity: [0.35, 0.55, 0.25, 0.45, 0.35] } : { strokeOpacity: 0.4 }}
          transition={!reducedMotion ? { duration: 3, repeat: Infinity, ease: 'easeInOut' } : undefined}
        />
        {/* Ring outer glow */}
        <path
          d={lowRingPath} fill="none"
          stroke="#F4C430" strokeWidth={6} strokeOpacity={0.04}
        />

        {/* Fracture lines — energy breaks */}
        {[30, 110, 200, 280].map((deg, i) => {
          const rad = (deg * Math.PI) / 180;
          const r1 = 48 + Math.sin(deg * 3) * 10;
          const r2 = r1 + 15;
          return (
            <line
              key={`frac-${i}`}
              x1={LEFT_CX + Math.cos(rad) * r1}
              y1={CY + Math.sin(rad) * r1}
              x2={LEFT_CX + Math.cos(rad) * r2}
              y2={CY + Math.sin(rad) * r2}
              stroke="#C0392B" strokeWidth={0.6} strokeOpacity={0.25}
              strokeLinecap="round"
            />
          );
        })}

        {/* Scattered particles — drifting energy with glow */}
        {lowParticles.map((p, i) => (
          <motion.circle
            key={`lp-${i}`}
            cx={p.x} cy={p.y} r={p.r}
            fill={i % 3 === 0 ? '#F4C430' : '#F0F0FF'}
            filter={i % 4 === 0 ? 'url(#mfr-particle-glow)' : undefined}
            initial={false}
            animate={!reducedMotion
              ? {
                  cx: [p.x, p.x + (seededRandom(i * 3) - 0.5) * 25, p.x],
                  cy: [p.y, p.y + (seededRandom(i * 3 + 1) - 0.5) * 25, p.y],
                  opacity: [0.35, 0.12, 0.35],
                }
              : { opacity: 0.25 }
            }
            transition={!reducedMotion ? { duration: p.speed, repeat: Infinity, ease: 'easeInOut' } : undefined}
          />
        ))}

        {/* Label — monospace readout */}
        <rect
          x={LEFT_CX - 52} y={H - 28} width={104} height={16} rx={3}
          fill="rgba(10,5,28,0.8)" stroke="rgba(192,57,43,0.2)" strokeWidth={0.5}
        />
        <text
          x={LEFT_CX} y={H - 17}
          textAnchor="middle" fill="#C0392B"
          fontSize="7" fontFamily="monospace" fontWeight="600"
          letterSpacing="0.1em" opacity={0.7}
        >
          LOW COHERENCE
        </text>

        {/* ════════════ RIGHT — HIGH COHERENCE ════════════ */}

        {/* Golden sun corona */}
        <circle cx={RIGHT_CX} cy={CY} r={SUN_R * 2.8} fill="url(#mfr-high-ring)" />

        {/* Thick smooth pulsating halo ring — with bloom */}
        <motion.circle
          cx={RIGHT_CX} cy={CY} r={62}
          fill="none" stroke="#F4C430" strokeWidth={8}
          filter="url(#mfr-bloom)"
          initial={false}
          animate={!reducedMotion
            ? { r: [59, 66, 59], strokeOpacity: [0.45, 0.7, 0.45] }
            : { strokeOpacity: 0.55 }
          }
          transition={!reducedMotion ? { duration: 4, repeat: Infinity, ease: 'easeInOut' } : undefined}
        />

        {/* Concentric ripple 1 */}
        <motion.circle
          cx={RIGHT_CX} cy={CY} r={75}
          fill="none" stroke="#F4C430" strokeWidth={1.5}
          initial={false}
          animate={!reducedMotion
            ? { r: [73, 80, 73], strokeOpacity: [0.12, 0.28, 0.12] }
            : { strokeOpacity: 0.18 }
          }
          transition={!reducedMotion ? { duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 } : undefined}
        />

        {/* Concentric ripple 2 */}
        <motion.circle
          cx={RIGHT_CX} cy={CY} r={90}
          fill="none" stroke="#FFF8E7" strokeWidth={0.8}
          initial={false}
          animate={!reducedMotion
            ? { r: [87, 95, 87], strokeOpacity: [0.06, 0.15, 0.06] }
            : { strokeOpacity: 0.1 }
          }
          transition={!reducedMotion ? { duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 } : undefined}
        />

        {/* Concentric ripple 3 — outermost shimmer */}
        <motion.circle
          cx={RIGHT_CX} cy={CY} r={105}
          fill="none" stroke="#F4C430" strokeWidth={0.4}
          initial={false}
          animate={!reducedMotion
            ? { r: [102, 110, 102], strokeOpacity: [0.03, 0.08, 0.03] }
            : { strokeOpacity: 0.05 }
          }
          transition={!reducedMotion ? { duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1.5 } : undefined}
        />

        {/* Sun body — glowing */}
        <g filter="url(#mfr-glow)">
          <circle cx={RIGHT_CX} cy={CY} r={SUN_R} fill="url(#mfr-high-sun)" />
        </g>
        {/* Sun beams */}
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          const len = i % 2 === 0 ? SUN_R * 1.5 : SUN_R * 1.2;
          return (
            <line
              key={`hbeam-${i}`}
              x1={RIGHT_CX + Math.cos(angle) * (SUN_R + 1)}
              y1={CY + Math.sin(angle) * (SUN_R + 1)}
              x2={RIGHT_CX + Math.cos(angle) * len}
              y2={CY + Math.sin(angle) * len}
              stroke="#F4C430" strokeWidth={i % 2 === 0 ? 1.5 : 0.8}
              strokeOpacity={0.4} strokeLinecap="round"
            />
          );
        })}
        <circle cx={RIGHT_CX - 3} cy={CY - 3} r={SUN_R * 0.22} fill="white" opacity={0.35} />

        {/* Label — monospace readout */}
        <rect
          x={RIGHT_CX - 52} y={H - 28} width={104} height={16} rx={3}
          fill="rgba(10,5,28,0.8)" stroke="rgba(244,196,48,0.2)" strokeWidth={0.5}
        />
        <text
          x={RIGHT_CX} y={H - 17}
          textAnchor="middle" fill="#F4C430"
          fontSize="7" fontFamily="monospace" fontWeight="600"
          letterSpacing="0.1em" opacity={0.7}
        >
          HIGH COHERENCE
        </text>

        {/* ════════════ ACTIVE STATE INDICATOR ════════════ */}

        {/* Highlight border — neon glow */}
        {isHighCoherence ? (
          <g>
            <rect
              x={HALF + GAP / 2 + 1} y={1}
              width={HALF - GAP / 2 - 2} height={H - 2}
              rx="11" fill="none"
              stroke="#F4C430" strokeWidth={1.5} strokeOpacity={0.3}
            />
            <rect
              x={HALF + GAP / 2 + 1} y={1}
              width={HALF - GAP / 2 - 2} height={H - 2}
              rx="11" fill="none"
              stroke="#F4C430" strokeWidth={4} strokeOpacity={0.05}
            />
          </g>
        ) : (
          <g>
            <rect
              x={1} y={1}
              width={HALF - GAP / 2 - 2} height={H - 2}
              rx="11" fill="none"
              stroke="#C0392B" strokeWidth={1.5} strokeOpacity={0.3}
            />
            <rect
              x={1} y={1}
              width={HALF - GAP / 2 - 2} height={H - 2}
              rx="11" fill="none"
              stroke="#C0392B" strokeWidth={4} strokeOpacity={0.05}
            />
          </g>
        )}

        {/* "YOU" indicator — instrument readout style */}
        <rect
          x={(isHighCoherence ? RIGHT_CX : LEFT_CX) - 18} y={14}
          width={36} height={14} rx={3}
          fill="rgba(10,5,28,0.85)"
          stroke={isHighCoherence ? '#F4C430' : '#C0392B'}
          strokeWidth={0.5} strokeOpacity={0.4}
        />
        <circle
          cx={(isHighCoherence ? RIGHT_CX : LEFT_CX) - 10} cy={21}
          r={2.5}
          fill={isHighCoherence ? '#F4C430' : '#C0392B'}
        />
        <text
          x={(isHighCoherence ? RIGHT_CX : LEFT_CX) + 3} y={24}
          fill={isHighCoherence ? '#F4C430' : '#C0392B'}
          fontSize="7" fontFamily="monospace" fontWeight="700"
          letterSpacing="0.1em" opacity={0.8}
        >
          YOU
        </text>

        {/* CRT scanline overlay */}
        <rect width={W} height={H} fill="url(#mfr-scanlines)" opacity={0.4} />
      </svg>

      {/* Coherence score chip */}
      <div className="flex justify-center mt-3">
        <div className="metric-chip" style={{ cursor: 'default' }}>
          <span className="metric-chip__value">{Math.round(coherence * 100)}%</span>
          <span className="metric-chip__label">Coherence</span>
        </div>
      </div>
    </div>
  );
}
