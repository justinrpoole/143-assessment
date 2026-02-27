'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useMemo, useState, useCallback } from 'react';
import type { RayOutput } from '@/lib/types';
import { RAY_SHORT_NAMES } from '@/lib/types';
import { rayHex } from '@/lib/ui/ray-colors';

interface OrbitMapProps {
  /** All ray outputs — rays are sorted into orbits by net energy */
  rays: Record<string, RayOutput>;
  /** Top two ray IDs (power sources — always inner orbit) */
  topTwo: string[];
  /** Bottom ray ID (train next — outer orbit) */
  bottomRay: string;
}

interface OrbitChip {
  rayId: string;
  name: string;
  score: number;
  netEnergy: number;
  orbit: 'inner' | 'middle' | 'outer';
  angle: number;
  icon: string;
}

const RAY_ICONS: Record<string, string> = {
  R1: '◎', R2: '☀', R3: '◈', R4: '⬡', R5: '△',
  R6: '◇', R7: '∞', R8: '✧', R9: '✦',
};

const RAY_COLORS: Record<string, string> = {
  R1: rayHex('R1'), R2: rayHex('R2'), R3: rayHex('R3'),
  R4: rayHex('R4'), R5: rayHex('R5'), R6: rayHex('R6'),
  R7: rayHex('R7'), R8: rayHex('R8'), R9: rayHex('R9'),
};

function seededRandom(seed: number): number {
  return ((seed * 1597 + 51749) % 244944) / 244944;
}

/**
 * Orbit Map — Personal Solar System (#4)
 *
 * Interactive top-down orbit map with three concentric rings.
 * v4 vintage cockpit: deep space nebula, neon orbit rings,
 * glowing chips, CRT scanlines, bloom filters.
 */
export default function OrbitMap({ rays, topTwo, bottomRay }: OrbitMapProps) {
  const reducedMotion = useReducedMotion();
  const [hoveredRay, setHoveredRay] = useState<string | null>(null);
  const [selectedRay, setSelectedRay] = useState<string | null>(null);

  const chips = useMemo<OrbitChip[]>(() => {
    const entries = Object.entries(rays);
    const sorted = entries
      .map(([rayId, ray]) => ({
        rayId,
        name: RAY_SHORT_NAMES[rayId] ?? ray.ray_name,
        score: ray.score,
        netEnergy: ray.net_energy ?? ray.score,
        icon: RAY_ICONS[rayId] ?? '●',
      }))
      .sort((a, b) => b.netEnergy - a.netEnergy);

    return sorted.map((ray) => {
      let orbit: 'inner' | 'middle' | 'outer';
      if (topTwo.includes(ray.rayId)) orbit = 'inner';
      else if (ray.rayId === bottomRay) orbit = 'outer';
      else if (ray.netEnergy >= 60) orbit = 'inner';
      else if (ray.netEnergy >= 40) orbit = 'middle';
      else orbit = 'outer';
      return { ...ray, orbit, angle: 0 };
    });
  }, [rays, topTwo, bottomRay]);

  const positioned = useMemo(() => {
    const byOrbit = { inner: [] as OrbitChip[], middle: [] as OrbitChip[], outer: [] as OrbitChip[] };
    for (const c of chips) byOrbit[c.orbit].push(c);
    const result: OrbitChip[] = [];
    for (const [orbit, group] of Object.entries(byOrbit)) {
      group.forEach((chip, i) => {
        const angle = (i / Math.max(group.length, 1)) * 360 - 90;
        result.push({ ...chip, orbit: orbit as 'inner' | 'middle' | 'outer', angle });
      });
    }
    return result;
  }, [chips]);

  const SIZE = 440;
  const CX = SIZE / 2;
  const CY = SIZE / 2;
  const SUN_R = 22;
  const INNER_R = 90;
  const MIDDLE_R = 140;
  const OUTER_R = 190;

  const orbitRadius = (orbit: 'inner' | 'middle' | 'outer') =>
    orbit === 'inner' ? INNER_R : orbit === 'middle' ? MIDDLE_R : OUTER_R;

  const handleClick = useCallback((rayId: string) => {
    setSelectedRay((prev) => (prev === rayId ? null : rayId));
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent, rayId: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick(rayId);
    } else if (e.key === 'Escape') {
      setSelectedRay(null);
    }
  }, [handleClick]);

  const selected = selectedRay ? positioned.find((c) => c.rayId === selectedRay) : null;

  return (
    <div className="glass-card p-5">
      <p
        className="mb-3"
        style={{ color: 'var(--text-on-dark-secondary)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}
      >
        Your Orbit
      </p>

      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="w-full max-w-md mx-auto"
        aria-label="Orbit map showing your rays sorted by alignment"
      >
        <defs>
          {/* Deep space background */}
          <radialGradient id="om-bg">
            <stop offset="0%" stopColor="#1a0a35" />
            <stop offset="40%" stopColor="#0f0520" />
            <stop offset="100%" stopColor="#050210" />
          </radialGradient>

          {/* Warm atmospheric glow near sun */}
          <radialGradient id="om-warmth">
            <stop offset="0%" stopColor="#F4C430" stopOpacity="0.06" />
            <stop offset="30%" stopColor="#E8A317" stopOpacity="0.03" />
            <stop offset="100%" stopColor="#E8A317" stopOpacity="0" />
          </radialGradient>

          {/* Sun core */}
          <radialGradient id="om-sun" cx="38%" cy="38%" r="56%">
            <stop offset="0%" stopColor="#FFFDF5" />
            <stop offset="25%" stopColor="#FFF8E7" />
            <stop offset="55%" stopColor="#F4C430" />
            <stop offset="80%" stopColor="#E8A317" />
            <stop offset="100%" stopColor="#A8820A" />
          </radialGradient>

          {/* Sun glow */}
          <radialGradient id="om-sun-glow">
            <stop offset="0%" stopColor="#F4C430" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#F4C430" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#F4C430" stopOpacity="0" />
          </radialGradient>

          {/* Sun bloom */}
          <filter id="om-sun-bloom" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="b1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="b2" />
            <feMerge>
              <feMergeNode in="b2" />
              <feMergeNode in="b1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Chip glow filter */}
          <filter id="om-chip-glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Nebula patches */}
          <radialGradient id="om-nebula1" cx="25%" cy="30%">
            <stop offset="0%" stopColor="#6B21A8" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#6B21A8" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="om-nebula2" cx="75%" cy="70%">
            <stop offset="0%" stopColor="#F4C430" stopOpacity="0.03" />
            <stop offset="100%" stopColor="#F4C430" stopOpacity="0" />
          </radialGradient>

          {/* Scanline pattern */}
          <pattern id="om-scanlines" width="4" height="4" patternUnits="userSpaceOnUse">
            <rect width="4" height="2" fill="rgba(0,0,0,0.05)" />
          </pattern>
        </defs>

        {/* Deep space background */}
        <rect width={SIZE} height={SIZE} rx="16" fill="url(#om-bg)" />

        {/* Nebula depth layers */}
        <ellipse cx={100} cy={120} rx={100} ry={80} fill="url(#om-nebula1)" />
        <ellipse cx={350} cy={340} rx={90} ry={70} fill="url(#om-nebula2)" />

        {/* Background stars */}
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.circle
            key={`star-${i}`}
            cx={seededRandom(i * 17) * SIZE}
            cy={seededRandom(i * 17 + 1) * SIZE}
            r={0.3 + seededRandom(i * 17 + 2) * 0.6}
            fill="#FFFFFF"
            initial={false}
            animate={
              !reducedMotion && i % 7 === 0
                ? { opacity: [0.04 + seededRandom(i * 17 + 3) * 0.08, 0.15 + seededRandom(i * 17 + 3) * 0.1, 0.04 + seededRandom(i * 17 + 3) * 0.08] }
                : { opacity: 0.05 + seededRandom(i * 17 + 3) * 0.1 }
            }
            transition={!reducedMotion && i % 7 === 0
              ? { duration: 2 + seededRandom(i * 17 + 4) * 3, repeat: Infinity, ease: 'easeInOut' }
              : undefined
            }
          />
        ))}

        {/* Solar warmth zone */}
        <circle cx={CX} cy={CY} r={INNER_R + 30} fill="url(#om-warmth)" />

        {/* ── Orbit rings — neon glow effect ── */}
        {[
          { r: INNER_R, color: '#F4C430', label: 'ALIGNED', opacity: 0.25 },
          { r: MIDDLE_R, color: '#8B5CF6', label: 'TRANSITIONING', opacity: 0.18 },
          { r: OUTER_R, color: '#64748B', label: 'RELEASING', opacity: 0.12 },
        ].map((ring, i) => (
          <g key={`ring-${i}`}>
            {/* Outer glow layer */}
            <circle
              cx={CX} cy={CY} r={ring.r}
              fill="none" stroke={ring.color}
              strokeWidth={4} strokeOpacity={ring.opacity * 0.3}
            />
            {/* Core ring */}
            <motion.circle
              cx={CX} cy={CY} r={ring.r}
              fill="none" stroke={ring.color}
              strokeWidth={0.8}
              strokeDasharray="3 8"
              initial={false}
              animate={!reducedMotion
                ? { strokeOpacity: [ring.opacity * 0.6, ring.opacity, ring.opacity * 0.6] }
                : { strokeOpacity: ring.opacity }
              }
              transition={!reducedMotion
                ? { duration: 5 + i * 2, repeat: Infinity, ease: 'easeInOut' }
                : undefined
              }
            />
            {/* Ring label */}
            <text
              x={CX} y={CY - ring.r - 6}
              textAnchor="middle" fill={ring.color}
              fontSize="6" fontFamily="monospace"
              fontWeight="600" letterSpacing="0.12em"
              opacity={ring.opacity * 2}
            >
              {ring.label}
            </text>
          </g>
        ))}

        {/* ── Sun — full vintage treatment ── */}
        <circle cx={CX} cy={CY} r={SUN_R * 2.2} fill="url(#om-sun-glow)" />
        {/* Sun beams */}
        {Array.from({ length: 12 }, (_, i) => {
          const angle = (i / 12) * Math.PI * 2;
          const len = i % 3 === 0 ? SUN_R * 1.6 : SUN_R * 1.3;
          return (
            <line
              key={`sb-${i}`}
              x1={CX + Math.cos(angle) * (SUN_R + 1)}
              y1={CY + Math.sin(angle) * (SUN_R + 1)}
              x2={CX + Math.cos(angle) * len}
              y2={CY + Math.sin(angle) * len}
              stroke="#F4C430" strokeWidth={i % 3 === 0 ? 1.8 : 1}
              strokeOpacity={0.5} strokeLinecap="round"
            />
          );
        })}
        <g filter="url(#om-sun-bloom)">
          <circle cx={CX} cy={CY} r={SUN_R} fill="url(#om-sun)" />
        </g>
        <circle cx={CX - 3} cy={CY - 4} r={SUN_R * 0.2} fill="white" opacity={0.3} />

        {/* ── Orbit Chips — upgraded frosted glass ── */}
        {positioned.map((chip) => {
          const r = orbitRadius(chip.orbit);
          const rad = (chip.angle * Math.PI) / 180;
          const chipX = CX + Math.cos(rad) * r;
          const chipY = CY + Math.sin(rad) * r;
          const isHovered = hoveredRay === chip.rayId;
          const isSelected = selectedRay === chip.rayId;
          const isInner = chip.orbit === 'inner';
          const isOuter = chip.orbit === 'outer';
          const chipColor = RAY_COLORS[chip.rayId] ?? (isInner ? '#F4C430' : '#8B5CF6');

          const borderColor = isInner ? '#F4C430' : isOuter ? '#64748B' : 'rgba(139,92,246,0.3)';
          const bgOpacity = isInner ? 0.1 : isOuter ? 0.04 : 0.06;
          const textOpacity = isOuter ? 0.5 : 0.85;
          const CHIP_W = 52;
          const CHIP_H = 36;

          return (
            <g key={chip.rayId}>
              {/* Chip glow aura */}
              {(isHovered || isSelected) && (
                <rect
                  x={chipX - CHIP_W / 2 - 3}
                  y={chipY - CHIP_H / 2 - 3}
                  width={CHIP_W + 6} height={CHIP_H + 6}
                  rx={10} fill={chipColor} opacity={0.08}
                  filter="url(#om-chip-glow)"
                />
              )}

              {/* Chip background */}
              <rect
                x={chipX - CHIP_W / 2}
                y={chipY - CHIP_H / 2}
                width={CHIP_W} height={CHIP_H}
                rx={8}
                fill={`rgba(10, 5, 28, ${0.6 + bgOpacity})`}
                stroke={borderColor}
                strokeWidth={isSelected ? 1.5 : 0.8}
                className="cosmic-focus-target"
                role="button" tabIndex={0}
                aria-label={`${chip.name}: score ${chip.score}, net energy ${Math.round(chip.netEnergy)} — ${chip.orbit} orbit`}
                onClick={() => handleClick(chip.rayId)}
                onKeyDown={(e) => handleKeyDown(e, chip.rayId)}
                onMouseEnter={() => setHoveredRay(chip.rayId)}
                onMouseLeave={() => setHoveredRay(null)}
                style={{ cursor: 'pointer' }}
                opacity={isHovered || isSelected ? 1 : 0.9}
              />

              {/* Icon */}
              <text
                x={chipX} y={chipY - 4}
                textAnchor="middle" dominantBaseline="central"
                fontSize="12"
                fill={chipColor}
                opacity={textOpacity}
              >
                {chip.icon}
              </text>

              {/* Score */}
              <text
                x={chipX} y={chipY + 10}
                textAnchor="middle"
                fontSize="7" fontFamily="monospace" fontWeight="600"
                fill="#F0F0FF"
                opacity={textOpacity * 0.7}
              >
                {Math.round(chip.netEnergy)}
              </text>

              {/* Power Source badge for top-two — glowing dot */}
              {topTwo.includes(chip.rayId) && (
                <g>
                  <circle
                    cx={chipX + CHIP_W / 2 - 4}
                    cy={chipY - CHIP_H / 2 + 4}
                    r={5} fill="#F4C430" opacity={0.15}
                  />
                  <circle
                    cx={chipX + CHIP_W / 2 - 4}
                    cy={chipY - CHIP_H / 2 + 4}
                    r={3} fill="#F4C430"
                  />
                </g>
              )}
            </g>
          );
        })}

        {/* CRT scanline overlay */}
        <rect width={SIZE} height={SIZE} rx="16" fill="url(#om-scanlines)" opacity={0.4} />
      </svg>

      {/* Selected ray detail */}
      {selected && (
        <motion.div
          key={selected.rayId}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 p-3 flex items-center gap-3"
          style={{
            background: 'var(--surface-glass)',
            border: '1px solid var(--surface-border)',
            borderRadius: 'var(--radius-md)',
          }}
        >
          <span style={{ fontSize: 20 }}>{selected.icon}</span>
          <div>
            <p style={{ color: 'var(--text-on-dark)', fontSize: 14, fontWeight: 600 }}>{selected.name}</p>
            <p style={{ color: 'var(--text-on-dark-secondary)', fontSize: 12 }}>
              Score {selected.score} · Net Access {Math.round(selected.netEnergy)} · {selected.orbit} orbit
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
