'use client';

import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useState, useMemo, useCallback } from 'react';
import type { RayOutput, EclipseOutput } from '@/lib/types';
import { RAY_NAMES } from '@/lib/types';

interface BlackHoleFlagsProps {
  rays: Record<string, RayOutput>;
  eclipse: EclipseOutput;
}

interface BlackHoleData {
  rayId: string;
  rayName: string;
  eclipseScore: number;
  netEnergy: number;
  severity: 'moderate' | 'elevated' | 'high';
}

function seededRandom(seed: number): number {
  return ((seed * 1597 + 51749) % 244944) / 244944;
}

const ACTIONS = [
  { icon: '◇', label: 'Reframe', desc: 'See the pattern differently' },
  { icon: '⬡', label: 'Boundary', desc: 'Protect the energy' },
  { icon: '↻', label: 'Swap Rep', desc: 'Replace the drain' },
] as const;

/**
 * Black Hole Flags — Energy Leak Indicators (#5)
 *
 * Identifies rays with high eclipse scores (energy drains) and renders them
 * as dark gravity wells. Tapping a black hole reveals an action card with
 * intervention options. v3 branded: royal purple background, gold action
 * cards, accretion disc spirals in deep purple-crimson.
 */
export default function BlackHoleFlags({ rays, eclipse }: BlackHoleFlagsProps) {
  const reducedMotion = useReducedMotion();
  const [openHole, setOpenHole] = useState<string | null>(null);

  // Identify energy leaks: rays where eclipse > shine (or eclipse is high)
  const blackHoles = useMemo<BlackHoleData[]>(() => {
    const leaks: BlackHoleData[] = [];
    for (const [rayId, ray] of Object.entries(rays)) {
      const eclipseScore = ray.eclipse_score ?? 0;
      const netEnergy = ray.net_energy ?? ray.score;
      // Flag if eclipse is significantly high
      if (eclipseScore >= 55 || (eclipseScore > 40 && eclipseScore > ray.score)) {
        leaks.push({
          rayId,
          rayName: RAY_NAMES[rayId] ?? ray.ray_name,
          eclipseScore,
          netEnergy,
          severity: eclipseScore >= 70 ? 'high' : eclipseScore >= 55 ? 'elevated' : 'moderate',
        });
      }
    }
    // Sort by severity (worst first), limit to 3
    return leaks
      .sort((a, b) => b.eclipseScore - a.eclipseScore)
      .slice(0, 3);
  }, [rays]);

  const handleToggle = useCallback((rayId: string) => {
    setOpenHole((prev) => (prev === rayId ? null : rayId));
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent, rayId: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleToggle(rayId);
    } else if (e.key === 'Escape') {
      setOpenHole(null);
    }
  }, [handleToggle]);

  // If no leaks detected, show a positive state
  if (blackHoles.length === 0) {
    return (
      <div className="glass-card p-5" role="status">
        <p
          style={{ color: 'var(--text-on-dark-secondary)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}
        >
          Energy Integrity
        </p>
        <p className="mt-2" style={{ color: 'var(--text-on-dark)', fontSize: 14 }}>
          No significant energy leaks detected. Your field is holding.
        </p>
      </div>
    );
  }

  const W = 700;
  const H = 400;
  const holeSpacing = W / (blackHoles.length + 1);

  // Generate spiral accretion disc path for each black hole
  function accretionPath(cx: number, cy: number, seed: number): string {
    const points: string[] = [];
    const turns = 2.5;
    const steps = 60;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const angle = t * turns * Math.PI * 2 + seed;
      const r = 8 + t * 30;
      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r;
      points.push(`${i === 0 ? 'M' : 'L'} ${x} ${y}`);
    }
    return points.join(' ');
  }

  // Generate captured particle trail paths
  function particleTrails(cx: number, cy: number, seed: number) {
    const trails: Array<{ path: string; delay: number }> = [];
    for (let i = 0; i < 5; i++) {
      const startAngle = seededRandom(seed + i * 7) * Math.PI * 2;
      const dist = 60 + seededRandom(seed + i * 7 + 1) * 40;
      const sx = cx + Math.cos(startAngle) * dist;
      const sy = cy + Math.sin(startAngle) * dist;
      // Spiral inward
      const midAngle = startAngle + 1.2;
      const midDist = dist * 0.5;
      const mx = cx + Math.cos(midAngle) * midDist;
      const my = cy + Math.sin(midAngle) * midDist;
      trails.push({
        path: `M ${sx} ${sy} Q ${mx} ${my} ${cx} ${cy}`,
        delay: seededRandom(seed + i * 7 + 2) * 3,
      });
    }
    return trails;
  }

  return (
    <div className="glass-card p-5">
      <p
        className="mb-3"
        style={{ color: 'var(--text-on-dark-secondary)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}
      >
        Energy Leak Detection
      </p>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" aria-label="Black hole energy leak indicators">
        <defs>
          {/* Deep space background */}
          <radialGradient id="bhf-bg" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#0f0520" />
            <stop offset="35%" stopColor="#0a0318" />
            <stop offset="70%" stopColor="#050210" />
            <stop offset="100%" stopColor="#030108" />
          </radialGradient>

          {/* Accretion disc gradient */}
          <linearGradient id="bhf-accretion" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#2C0A3E" />
            <stop offset="50%" stopColor="#4A0A0A" />
            <stop offset="100%" stopColor="#2C0A3E" />
          </linearGradient>

          {/* Gold card glow */}
          <radialGradient id="bhf-card-glow">
            <stop offset="0%" stopColor="#F4C430" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#F4C430" stopOpacity="0" />
          </radialGradient>

          {/* Dark vortex gradient */}
          <radialGradient id="bhf-vortex">
            <stop offset="0%" stopColor="#000000" />
            <stop offset="40%" stopColor="#0A0010" />
            <stop offset="70%" stopColor="#2C0A3E" stopOpacity="0.6" />
            <stop offset="100%" stopColor="var(--cosmic-svg-bg)" stopOpacity="0" />
          </radialGradient>

          <filter id="bhf-glow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="b1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="b2" />
            <feMerge>
              <feMergeNode in="b2" />
              <feMergeNode in="b1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Scanline pattern */}
          <pattern id="bhf-scanlines" width="4" height="4" patternUnits="userSpaceOnUse">
            <rect width="4" height="2" fill="rgba(0,0,0,0.05)" />
          </pattern>
        </defs>

        {/* Deep space background */}
        <rect width={W} height={H} rx="12" fill="url(#bhf-bg)" />

        {/* Background stars */}
        {Array.from({ length: 30 }).map((_, i) => (
          <circle
            key={`bgstar-${i}`}
            cx={seededRandom(i * 29) * W}
            cy={seededRandom(i * 29 + 1) * H}
            r={0.3 + seededRandom(i * 29 + 2) * 0.5}
            fill="#FFFFFF"
            opacity={0.04 + seededRandom(i * 29 + 3) * 0.08}
          />
        ))}

        {/* Faint background sun reference — upper left, out of focus */}
        <circle cx={60} cy={60} r={25} fill="#F4C430" opacity={0.06} />
        <circle cx={60} cy={60} r={12} fill="#F4C430" opacity={0.1} />
        {/* Faint orbit rings */}
        <circle cx={60} cy={60} r={60} fill="none" stroke="#F4C430" strokeWidth={0.5} strokeOpacity={0.05} strokeDasharray="4 6" />
        <circle cx={60} cy={60} r={90} fill="none" stroke="#F4C430" strokeWidth={0.3} strokeOpacity={0.03} strokeDasharray="3 8" />

        {/* ── Black Holes ── */}
        {blackHoles.map((hole, idx) => {
          const cx = holeSpacing * (idx + 1);
          const cy = CY_FOR_HOLE(idx, H);
          const isOpen = openHole === hole.rayId;
          const size = hole.severity === 'high' ? 1.2 : hole.severity === 'elevated' ? 1 : 0.85;

          return (
            <g key={hole.rayId}>
              {/* Captured gold particle trails bending inward */}
              {particleTrails(cx, cy, idx * 100).map((trail, ti) => (
                <motion.path
                  key={`trail-${ti}`}
                  d={trail.path}
                  fill="none"
                  stroke="#F4C430"
                  strokeWidth={0.6}
                  strokeOpacity={0.2}
                  initial={false}
                  animate={
                    !reducedMotion
                      ? { strokeDashoffset: [100, 0], strokeOpacity: [0.05, 0.2, 0.05] }
                      : undefined
                  }
                  transition={
                    !reducedMotion
                      ? { duration: 4 + trail.delay, repeat: Infinity, ease: 'linear' }
                      : undefined
                  }
                  strokeDasharray="4 8"
                />
              ))}

              {/* Accretion disc spiral */}
              <motion.path
                d={accretionPath(cx, cy, idx * 2)}
                fill="none"
                stroke="url(#bhf-accretion)"
                strokeWidth={1.5 * size}
                strokeOpacity={0.4}
                initial={false}
                animate={
                  !reducedMotion
                    ? { rotate: [0, 360] }
                    : undefined
                }
                transition={
                  !reducedMotion
                    ? { duration: 20 + idx * 5, repeat: Infinity, ease: 'linear' }
                    : undefined
                }
                style={{ transformOrigin: `${cx}px ${cy}px` }}
              />

              {/* Dark vortex center */}
              <circle cx={cx} cy={cy} r={22 * size} fill="url(#bhf-vortex)" />
              <circle cx={cx} cy={cy} r={8 * size} fill="#000000" />

              {/* Interactive tap target */}
              <circle
                cx={cx}
                cy={cy}
                r={35 * size}
                fill="transparent"
                className="cosmic-focus-target"
                role="button"
                tabIndex={0}
                aria-label={`${hole.rayName} energy leak — eclipse score ${hole.eclipseScore}. Tap to see actions.`}
                aria-expanded={isOpen}
                onClick={() => handleToggle(hole.rayId)}
                onKeyDown={(e) => handleKeyDown(e, hole.rayId)}
                style={{ cursor: 'pointer' }}
              />

              {/* Pulsing ring around the tap target */}
              <motion.circle
                cx={cx}
                cy={cy}
                r={32 * size}
                fill="none"
                stroke={hole.severity === 'high' ? '#C0392B' : '#E8A317'}
                strokeWidth={1}
                strokeDasharray="3 5"
                initial={false}
                animate={
                  !reducedMotion
                    ? { strokeOpacity: [0.15, 0.35, 0.15] }
                    : undefined
                }
                transition={
                  !reducedMotion
                    ? { duration: 2.5, repeat: Infinity, ease: 'easeInOut' }
                    : undefined
                }
              />

              {/* Ray name label below */}
              <text
                x={cx}
                y={cy + 45 * size}
                textAnchor="middle"
                fill="#F0F0FF"
                fontSize="10"
                fontWeight="500"
                opacity={0.5}
              >
                {hole.rayName}
              </text>

              {/* Severity indicator */}
              <text
                x={cx}
                y={cy + 57 * size}
                textAnchor="middle"
                fill={hole.severity === 'high' ? '#FB923C' : hole.severity === 'elevated' ? '#F59E0B' : '#A78BFA'}
                fontSize="8"
                fontWeight="600"
                opacity={0.6}
                style={{ textTransform: 'uppercase' }}
              >
                {hole.severity}
              </text>
            </g>
          );
        })}

        {/* CRT scanline overlay */}
        <rect width={W} height={H} rx="12" fill="url(#bhf-scanlines)" opacity={0.4} />
      </svg>

      {/* ── Action Card (appears when a black hole is tapped) ── */}
      <AnimatePresence>
        {openHole && (() => {
          const hole = blackHoles.find((h) => h.rayId === openHole);
          if (!hole) return null;
          return (
            <motion.div
              key={hole.rayId}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
              className="mt-4 p-4"
              style={{
                background: 'rgba(17, 3, 32, 0.85)',
                border: '1.5px solid #F4C430',
                borderRadius: 'var(--radius-xl)',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 0 24px rgba(244, 196, 48, 0.12)',
              }}
              role="dialog"
              aria-label={`Actions to seal the ${hole.rayName} energy leak`}
            >
              <p style={{ color: '#F4C430', fontSize: 12, fontWeight: 700, letterSpacing: '0.04em' }}>
                Seal the leak
              </p>
              <p style={{ color: 'var(--text-on-dark-secondary)', fontSize: 13, marginTop: 4 }}>
                {hole.rayName} — Eclipse {hole.eclipseScore}%
              </p>

              <div className="flex gap-3 mt-4">
                {ACTIONS.map((action) => (
                  <button
                    key={action.label}
                    className="flex-1 p-3 text-center cosmic-focus-target"
                    style={{
                      background: 'var(--surface-glass)',
                      border: '1px solid var(--surface-border)',
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer',
                    }}
                  >
                    <span style={{ fontSize: 18, display: 'block', color: '#F4C430' }}>{action.icon}</span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-on-dark)', display: 'block', marginTop: 4 }}>
                      {action.label}
                    </span>
                    <span style={{ fontSize: 9, color: 'var(--text-on-dark-muted)', display: 'block', marginTop: 2 }}>
                      {action.desc}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}

/** Stagger the vertical positions of black holes */
function CY_FOR_HOLE(idx: number, h: number): number {
  const positions = [h * 0.45, h * 0.55, h * 0.4];
  return positions[idx % positions.length];
}
