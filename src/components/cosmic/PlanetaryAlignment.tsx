'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useMemo } from 'react';
import type { RayOutput } from '@/lib/types';
import { RAY_SHORT_NAMES } from '@/lib/types';
import { rayHex } from '@/lib/ui/ray-colors';

interface PlanetaryAlignmentProps {
  rays: Record<string, RayOutput>;
}

const RAY_COLORS: Record<string, string> = {
  R2: rayHex('R2'),
  R4: rayHex('R4'),
  R3: rayHex('R3'),
  R8: rayHex('R8'),
  R5: rayHex('R5'),
};

const PLANET_RAYS = ['R2', 'R4', 'R3', 'R8', 'R5'];

function seededRandom(seed: number): number {
  return ((seed * 1597 + 51749) % 244944) / 244944;
}

/**
 * Planetary Alignment (#22) — Multi-Ray Coherence
 *
 * Five planets aligned along a beam from the 143 sun. Each planet has
 * surface gradients, ring systems, atmospheric glow. Alignment beam
 * refracts into spectral streaks with neon bloom.
 * v4 vintage cockpit: deep space, planet textures, CRT scanlines.
 */
export default function PlanetaryAlignment({ rays }: PlanetaryAlignmentProps) {
  const reducedMotion = useReducedMotion();
  const W = 800;
  const H = 350;

  const alignment = useMemo(() => {
    const scores = PLANET_RAYS.map((id) => rays[id]?.net_energy ?? rays[id]?.score ?? 50);
    const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
    const variance = scores.reduce((a, s) => a + (s - mean) ** 2, 0) / scores.length;
    return Math.max(0, Math.min(1, 1 - Math.sqrt(variance) / 30));
  }, [rays]);

  const planets = useMemo(() => {
    const startX = 110;
    const endX = W - 80;
    const beamAngle = -0.12;
    return PLANET_RAYS.map((rayId, i) => {
      const t = (i + 1) / (PLANET_RAYS.length + 1);
      const x = startX + t * (endX - startX);
      const y = H / 2 + (x - W / 2) * beamAngle;
      const score = rays[rayId]?.net_energy ?? rays[rayId]?.score ?? 50;
      return {
        rayId,
        name: RAY_SHORT_NAMES[rayId] ?? rayId,
        color: RAY_COLORS[rayId] ?? '#F4C430',
        x, y, score,
        r: 14 + (score / 100) * 6,
      };
    });
  }, [rays]);

  return (
    <div className="glass-card p-5">
      <p
        className="mb-3"
        style={{ color: 'var(--text-on-dark-secondary)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}
      >
        Planetary Alignment
      </p>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" aria-label={`Planetary alignment — ${Math.round(alignment * 100)}% coherent`}>
        <defs>
          {/* Deep space background */}
          <linearGradient id="pa-space" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0a0318" />
            <stop offset="40%" stopColor="#0f0520" />
            <stop offset="100%" stopColor="#1a0a35" />
          </linearGradient>

          {/* Sun bloom filter */}
          <filter id="pa-sun-bloom" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="b1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="b2" />
            <feMerge>
              <feMergeNode in="b2" />
              <feMergeNode in="b1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Planet glow filter */}
          <filter id="pa-planet-glow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="b1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="b2" />
            <feMerge>
              <feMergeNode in="b2" />
              <feMergeNode in="b1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Beam glow */}
          <filter id="pa-beam-glow" x="-20%" y="-200%" width="140%" height="500%">
            <feGaussianBlur stdDeviation="3" />
          </filter>

          {/* Sun core gradient */}
          <radialGradient id="pa-sun-core" cx="38%" cy="38%">
            <stop offset="0%" stopColor="#FFFDF5" />
            <stop offset="25%" stopColor="#FFF8E7" />
            <stop offset="55%" stopColor="#F4C430" />
            <stop offset="80%" stopColor="#E8A317" />
            <stop offset="100%" stopColor="#A8820A" />
          </radialGradient>

          {/* Sun corona */}
          <radialGradient id="pa-corona">
            <stop offset="0%" stopColor="#F4C430" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#F4C430" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#F4C430" stopOpacity="0" />
          </radialGradient>

          {/* Per-planet gradients */}
          {planets.map((p) => (
            <radialGradient key={`grad-${p.rayId}`} id={`pa-planet-${p.rayId}`} cx="35%" cy="35%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.3" />
              <stop offset="30%" stopColor={p.color} stopOpacity="0.95" />
              <stop offset="70%" stopColor={p.color} stopOpacity="1" />
              <stop offset="100%" stopColor="rgba(0,0,0,0.4)" />
            </radialGradient>
          ))}

          {/* Beam gradient */}
          <linearGradient id="pa-beam-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#F4C430" stopOpacity="0.5" />
            <stop offset="50%" stopColor="#FFF8E7" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#F4C430" stopOpacity="0.1" />
          </linearGradient>

          {/* Scanline pattern */}
          <pattern id="pa-scanlines" width="4" height="4" patternUnits="userSpaceOnUse">
            <rect width="4" height="2" fill="rgba(0,0,0,0.05)" />
          </pattern>
        </defs>

        {/* Deep space background */}
        <rect width={W} height={H} rx="12" fill="url(#pa-space)" />

        {/* Background stars — varied brightness */}
        {Array.from({ length: 40 }).map((_, i) => (
          <motion.circle
            key={`star-${i}`}
            cx={seededRandom(i * 23) * W}
            cy={seededRandom(i * 23 + 1) * H}
            r={0.3 + seededRandom(i * 23 + 2) * 0.7}
            fill="#FFFFFF"
            initial={false}
            animate={
              !reducedMotion && i % 6 === 0
                ? { opacity: [0.05 + seededRandom(i * 23 + 3) * 0.1, 0.2 + seededRandom(i * 23 + 3) * 0.15, 0.05 + seededRandom(i * 23 + 3) * 0.1] }
                : { opacity: 0.06 + seededRandom(i * 23 + 3) * 0.12 }
            }
            transition={!reducedMotion && i % 6 === 0
              ? { duration: 2 + seededRandom(i * 23 + 4) * 3, repeat: Infinity, ease: 'easeInOut' }
              : undefined
            }
          />
        ))}

        {/* 143 Sun — full treatment */}
        <circle cx={55} cy={H / 2} r={42} fill="url(#pa-corona)" />
        <g filter="url(#pa-sun-bloom)">
          <circle cx={55} cy={H / 2} r={22} fill="url(#pa-sun-core)" />
        </g>
        {/* Sun beams — tapered */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i / 12) * Math.PI * 2;
          const len = i % 3 === 0 ? 36 : 30;
          const w = i % 3 === 0 ? 2 : 1.2;
          return (
            <line
              key={`beam-${i}`}
              x1={55 + Math.cos(angle) * 23}
              y1={H / 2 + Math.sin(angle) * 23}
              x2={55 + Math.cos(angle) * len}
              y2={H / 2 + Math.sin(angle) * len}
              stroke="#F4C430" strokeWidth={w}
              strokeOpacity={0.5} strokeLinecap="round"
            />
          );
        })}
        {/* Sun hotspot */}
        <circle cx={51} cy={H / 2 - 4} r={5} fill="#FFFFFF" opacity={0.25} />

        {/* Alignment beam — layered glow */}
        <line
          x1={77} y1={H / 2}
          x2={W - 15} y2={H / 2 + (W - 15 - W / 2) * -0.12}
          stroke="#F4C430" strokeWidth={6}
          strokeOpacity={0.04 + alignment * 0.06}
          filter="url(#pa-beam-glow)"
        />
        <line
          x1={77} y1={H / 2}
          x2={W - 15} y2={H / 2 + (W - 15 - W / 2) * -0.12}
          stroke="url(#pa-beam-grad)"
          strokeWidth={alignment > 0.7 ? 2 : 1}
          strokeOpacity={0.2 + alignment * 0.25}
        />

        {/* Planets — full surface treatment */}
        {planets.map((planet, pi) => (
          <g key={planet.rayId}>
            {/* Atmospheric halo — outer glow */}
            <circle
              cx={planet.x} cy={planet.y}
              r={planet.r + 10}
              fill={planet.color} opacity={0.04}
            />
            <circle
              cx={planet.x} cy={planet.y}
              r={planet.r + 5}
              fill={planet.color} opacity={0.08}
            />

            {/* Planet body — gradient sphere */}
            <motion.circle
              cx={planet.x} cy={planet.y}
              r={planet.r}
              fill={`url(#pa-planet-${planet.rayId})`}
              filter="url(#pa-planet-glow)"
              initial={false}
              animate={!reducedMotion
                ? { opacity: [0.8, 1, 0.8] }
                : { opacity: 0.9 }
              }
              transition={!reducedMotion
                ? { duration: 3 + pi * 0.5, repeat: Infinity, ease: 'easeInOut' }
                : undefined
              }
            />

            {/* Planet shadow crescent (dark side) */}
            <circle
              cx={planet.x + planet.r * 0.3}
              cy={planet.y + planet.r * 0.1}
              r={planet.r * 0.9}
              fill="rgba(0,0,0,0.35)"
              clipPath={`circle(${planet.r}px at ${planet.x}px ${planet.y}px)`}
            />

            {/* Surface highlight band */}
            <ellipse
              cx={planet.x - planet.r * 0.15}
              cy={planet.y}
              rx={planet.r * 0.6}
              ry={planet.r * 0.15}
              fill="rgba(255,255,255,0.06)"
              transform={`rotate(-20 ${planet.x} ${planet.y})`}
            />

            {/* Ring system for larger planets (score > 60) */}
            {planet.score > 60 && (
              <ellipse
                cx={planet.x} cy={planet.y}
                rx={planet.r + 8} ry={planet.r * 0.25}
                fill="none"
                stroke={planet.color}
                strokeWidth={1.5}
                strokeOpacity={0.25}
                transform={`rotate(-15 ${planet.x} ${planet.y})`}
              />
            )}

            {/* Planet label — monospace readout */}
            <rect
              x={planet.x - 22} y={planet.y + planet.r + 6}
              width={44} height={12} rx={2}
              fill="rgba(10,5,28,0.7)"
              stroke={planet.color} strokeWidth={0.4} strokeOpacity={0.3}
            />
            <text
              x={planet.x} y={planet.y + planet.r + 15}
              textAnchor="middle"
              fill={planet.color}
              fontSize="7" fontFamily="monospace"
              fontWeight="600" letterSpacing="0.05em"
              opacity={0.8}
            >
              {planet.name}
            </text>

            {/* Score readout below name */}
            <text
              x={planet.x} y={planet.y + planet.r + 28}
              textAnchor="middle"
              fill="#F0F0FF"
              fontSize="7" fontFamily="monospace"
              fontWeight="400" opacity={0.4}
            >
              {Math.round(planet.score)}
            </text>
          </g>
        ))}

        {/* Spectral streak — prismatic refraction past last planet */}
        {alignment > 0.4 && (
          <g>
            {PLANET_RAYS.map((rayId, i) => {
              const lastPlanet = planets[planets.length - 1];
              const y = lastPlanet.y - 10 + i * 5;
              return (
                <g key={rayId}>
                  {/* Glow layer */}
                  <line
                    x1={lastPlanet.x + lastPlanet.r + 4} y1={y}
                    x2={W - 8} y2={y + (y - lastPlanet.y) * 0.4}
                    stroke={RAY_COLORS[rayId]} strokeWidth={3}
                    strokeOpacity={alignment * 0.08}
                    filter="url(#pa-beam-glow)"
                  />
                  {/* Core streak */}
                  <line
                    x1={lastPlanet.x + lastPlanet.r + 4} y1={y}
                    x2={W - 8} y2={y + (y - lastPlanet.y) * 0.4}
                    stroke={RAY_COLORS[rayId]} strokeWidth={1.5}
                    strokeOpacity={alignment * 0.45}
                    strokeLinecap="round"
                  />
                </g>
              );
            })}
          </g>
        )}

        {/* CRT scanline overlay */}
        <rect width={W} height={H} rx="12" fill="url(#pa-scanlines)" opacity={0.5} />

        {/* Alignment readout — vintage instrument style */}
        <rect
          x={12} y={H - 28} width={100} height={18} rx={3}
          fill="rgba(10,5,28,0.8)"
          stroke="rgba(244,196,48,0.2)" strokeWidth={0.5}
        />
        <text
          x={22} y={H - 15.5}
          fill={alignment > 0.7 ? '#F4C430' : '#8B5CF6'}
          fontSize="8" fontFamily="monospace" fontWeight="700"
          letterSpacing="0.08em"
        >
          ALIGN {Math.round(alignment * 100)}%
        </text>
      </svg>

      {/* Alignment readout */}
      <div className="mt-3 flex items-center justify-between">
        <span style={{ color: 'var(--text-on-dark-secondary)', fontSize: 11 }}>Ray coherence</span>
        <span style={{ color: alignment > 0.7 ? '#F4C430' : '#A78BFA', fontSize: 13, fontWeight: 700 }}>
          {Math.round(alignment * 100)}%
        </span>
      </div>
    </div>
  );
}
