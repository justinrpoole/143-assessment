'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useMemo, useState, useCallback } from 'react';

interface ProgressStar {
  id: string;
  label: string;
  completed: boolean;
  /** Is this a major breakthrough (renders larger) */
  major?: boolean;
}

interface ConstellationProgressProps {
  stars: ProgressStar[];
  constellationName?: string;
  dateRange?: string;
}

function seededRandom(seed: number): number {
  return ((seed * 1597 + 51749) % 244944) / 244944;
}

/**
 * Constellation Progress Map (#20) — Personal Mythology
 *
 * Stars form a personal constellation. Lit stars glow with neon gold bloom.
 * Connection lines pulse with gradient energy. Major breakthroughs emit
 * multi-point beam flares. Deep-space nebula backdrop with CRT scanlines.
 * v4 vintage cockpit: 80s phosphor glow, deep space depth, neon accents.
 */
export default function ConstellationProgress({
  stars,
  constellationName = 'The Lightkeeper',
  dateRange,
}: ConstellationProgressProps) {
  const reducedMotion = useReducedMotion();
  const [selectedStar, setSelectedStar] = useState<string | null>(null);

  const W = 500;
  const H = 500;

  const completedCount = stars.filter((s) => s.completed).length;

  // Generate star positions in an organic asymmetric shape
  const starPositions = useMemo(() => {
    return stars.map((star, i) => {
      const angle = (i / stars.length) * Math.PI * 2 + seededRandom(i * 7) * 0.8;
      const r = 80 + seededRandom(i * 7 + 1) * 120;
      return {
        ...star,
        x: W / 2 + Math.cos(angle) * r,
        y: H / 2 + Math.sin(angle) * r * 0.8,
      };
    });
  }, [stars]);

  const handleSelect = useCallback((id: string) => {
    setSelectedStar((prev) => (prev === id ? null : id));
  }, []);

  return (
    <div className="glass-card p-5">
      <p
        className="mb-3"
        style={{ color: 'var(--text-on-dark-secondary)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}
      >
        Constellation Progress
      </p>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" aria-label={`Personal constellation: ${constellationName}`}>
        <defs>
          {/* Deep space background gradient */}
          <radialGradient id="cp-deep-space" cx="50%" cy="45%">
            <stop offset="0%" stopColor="#1a0a35" />
            <stop offset="35%" stopColor="#0f0520" />
            <stop offset="70%" stopColor="#0a0318" />
            <stop offset="100%" stopColor="#050210" />
          </radialGradient>

          {/* Nebula cloud patches */}
          <radialGradient id="cp-nebula1" cx="30%" cy="25%">
            <stop offset="0%" stopColor="#6B21A8" stopOpacity="0.12" />
            <stop offset="50%" stopColor="var(--cosmic-svg-bg)" stopOpacity="0.06" />
            <stop offset="100%" stopColor="var(--cosmic-svg-bg)" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="cp-nebula2" cx="70%" cy="65%">
            <stop offset="0%" stopColor="#F4C430" stopOpacity="0.04" />
            <stop offset="40%" stopColor="#E8A317" stopOpacity="0.02" />
            <stop offset="100%" stopColor="#E8A317" stopOpacity="0" />
          </radialGradient>

          {/* Star glow filter — neon bloom */}
          <filter id="cp-star-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Major star burst filter — intense bloom */}
          <filter id="cp-burst-glow" x="-150%" y="-150%" width="400%" height="400%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur2" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="18" result="blur3" />
            <feMerge>
              <feMergeNode in="blur3" />
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Connection line gradient */}
          <linearGradient id="cp-line-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F4C430" stopOpacity="0.7" />
            <stop offset="50%" stopColor="#FFF8E7" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#F4C430" stopOpacity="0.7" />
          </linearGradient>

          {/* Star core gradient */}
          <radialGradient id="cp-star-core" cx="35%" cy="35%">
            <stop offset="0%" stopColor="#FFFDF5" />
            <stop offset="40%" stopColor="#F4C430" />
            <stop offset="80%" stopColor="#E8A317" />
            <stop offset="100%" stopColor="#D4920A" />
          </radialGradient>

          {/* Unlit star gradient */}
          <radialGradient id="cp-unlit" cx="40%" cy="40%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.15)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.03)" />
          </radialGradient>

          {/* Scanline pattern */}
          <pattern id="cp-scanlines" width="4" height="4" patternUnits="userSpaceOnUse">
            <rect width="4" height="2" fill="rgba(0,0,0,0.06)" />
          </pattern>
        </defs>

        {/* Deep space background */}
        <rect width={W} height={H} rx="12" fill="url(#cp-deep-space)" />

        {/* Nebula clouds for depth */}
        <ellipse cx={150} cy={130} rx={120} ry={80} fill="url(#cp-nebula1)" />
        <ellipse cx={370} cy={350} rx={100} ry={70} fill="url(#cp-nebula2)" />

        {/* Upgraded celestial grid — crosshairs with glow */}
        {Array.from({ length: 10 }).map((_, i) => (
          <g key={`grid-${i}`}>
            <line
              x1={i * 50} y1={0} x2={i * 50} y2={H}
              stroke="#6B21A8" strokeWidth={0.4} strokeOpacity={0.15}
            />
            <line
              x1={0} y1={i * 50} x2={W} y2={i * 50}
              stroke="#6B21A8" strokeWidth={0.4} strokeOpacity={0.15}
            />
            {/* Grid intersection dots */}
            {Array.from({ length: 10 }).map((__, j) => (
              <circle
                key={`dot-${i}-${j}`}
                cx={i * 50} cy={j * 50} r={0.6}
                fill="#8B5CF6" opacity={0.12}
              />
            ))}
          </g>
        ))}

        {/* Ambient background stars — multi-layered with varied sizes and twinkle */}
        {Array.from({ length: 60 }).map((_, i) => {
          const cx = seededRandom(i * 19) * W;
          const cy = seededRandom(i * 19 + 1) * H;
          const brightness = 0.06 + seededRandom(i * 19 + 2) * 0.15;
          const size = 0.3 + seededRandom(i * 19 + 3) * 0.8;
          return (
            <motion.circle
              key={`bg-${i}`}
              cx={cx} cy={cy} r={size}
              fill="#FFFFFF"
              initial={false}
              animate={
                !reducedMotion && i % 5 === 0
                  ? { opacity: [brightness, brightness * 2.5, brightness] }
                  : { opacity: brightness }
              }
              transition={!reducedMotion && i % 5 === 0
                ? { duration: 2 + seededRandom(i * 19 + 4) * 3, repeat: Infinity, ease: 'easeInOut' }
                : undefined
              }
            />
          );
        })}

        {/* Connection lines between completed adjacent stars — glowing gradient */}
        {starPositions.map((star, i) => {
          if (i === 0 || !star.completed) return null;
          let prevIdx = i - 1;
          while (prevIdx >= 0 && !starPositions[prevIdx].completed) prevIdx--;
          if (prevIdx < 0) return null;
          const prev = starPositions[prevIdx];
          return (
            <g key={`line-${i}`}>
              {/* Outer glow layer */}
              <line
                x1={prev.x} y1={prev.y} x2={star.x} y2={star.y}
                stroke="#F4C430" strokeWidth={3} strokeOpacity={0.1}
                strokeLinecap="round"
              />
              {/* Core line */}
              <motion.line
                x1={prev.x} y1={prev.y} x2={star.x} y2={star.y}
                stroke="url(#cp-line-grad)" strokeWidth={1.2}
                strokeLinecap="round"
                initial={false}
                animate={!reducedMotion ? { strokeOpacity: [0.5, 0.8, 0.5] } : { strokeOpacity: 0.6 }}
                transition={!reducedMotion ? { duration: 3, repeat: Infinity, ease: 'easeInOut' } : undefined}
              />
            </g>
          );
        })}

        {/* Future connection lines (dotted with subtle glow) */}
        {starPositions.map((star, i) => {
          if (i === 0 || star.completed) return null;
          const prev = starPositions[i - 1];
          return (
            <line
              key={`future-${i}`}
              x1={prev.x} y1={prev.y} x2={star.x} y2={star.y}
              stroke="#8B5CF6" strokeWidth={0.6}
              strokeOpacity={0.15} strokeDasharray="2 6"
              strokeLinecap="round"
            />
          );
        })}

        {/* Stars */}
        {starPositions.map((star) => {
          const isSelected = selectedStar === star.id;
          const r = star.major ? 7 : 4.5;

          return (
            <g key={star.id}>
              {star.completed ? (
                <>
                  {/* Completed star — full glow treatment */}
                  {/* Outer halo */}
                  <circle
                    cx={star.x} cy={star.y}
                    r={r * 3.5}
                    fill="#F4C430" opacity={0.03}
                  />

                  {/* Major breakthrough — 8-point diffraction spikes */}
                  {star.major && (
                    <g filter="url(#cp-burst-glow)">
                      {Array.from({ length: 8 }).map((_, bi) => {
                        const angle = (bi / 8) * Math.PI * 2;
                        const len = bi % 2 === 0 ? r + 16 : r + 10;
                        return (
                          <line
                            key={bi}
                            x1={star.x + Math.cos(angle) * (r + 1)}
                            y1={star.y + Math.sin(angle) * (r + 1)}
                            x2={star.x + Math.cos(angle) * len}
                            y2={star.y + Math.sin(angle) * len}
                            stroke="#F4C430"
                            strokeWidth={bi % 2 === 0 ? 1.5 : 0.8}
                            strokeOpacity={0.7}
                            strokeLinecap="round"
                          />
                        );
                      })}
                    </g>
                  )}

                  {/* Star body with glow */}
                  <motion.circle
                    cx={star.x} cy={star.y}
                    r={r}
                    fill="url(#cp-star-core)"
                    filter="url(#cp-star-glow)"
                    initial={false}
                    animate={
                      !reducedMotion
                        ? star.major
                          ? { r: [r - 0.5, r + 1, r - 0.5], opacity: [0.85, 1, 0.85] }
                          : { opacity: [0.8, 1, 0.8] }
                        : undefined
                    }
                    transition={!reducedMotion
                      ? { duration: 2.5 + seededRandom(stars.indexOf(star) * 3) * 2, repeat: Infinity, ease: 'easeInOut' }
                      : undefined
                    }
                  />

                  {/* Inner hot-spot */}
                  <circle
                    cx={star.x - r * 0.2}
                    cy={star.y - r * 0.2}
                    r={r * 0.25}
                    fill="#FFFFFF" opacity={0.5}
                  />
                </>
              ) : (
                <>
                  {/* Unlit star — ghostly ring with faint fill */}
                  <circle
                    cx={star.x} cy={star.y}
                    r={r - 0.5}
                    fill="url(#cp-unlit)"
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth={0.6}
                  />
                  {/* Tiny center dot */}
                  <circle
                    cx={star.x} cy={star.y}
                    r={0.8}
                    fill="#FFFFFF" opacity={0.15}
                  />
                </>
              )}

              {/* Tap target */}
              <circle
                cx={star.x} cy={star.y}
                r={15} fill="transparent"
                className="cosmic-focus-target"
                role="button" tabIndex={0}
                aria-label={`${star.label}${star.completed ? ' (completed)' : ' (upcoming)'}${star.major ? ' — major breakthrough' : ''}`}
                style={{ cursor: 'pointer' }}
                onClick={() => handleSelect(star.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSelect(star.id);
                  }
                }}
              />

              {/* Label on select */}
              {isSelected && (
                <g>
                  <rect
                    x={star.x - 40} y={star.y - 22}
                    width={80} height={14} rx={3}
                    fill="rgba(10,5,28,0.85)"
                    stroke={star.completed ? '#F4C430' : 'rgba(255,255,255,0.15)'}
                    strokeWidth={0.5}
                  />
                  <text
                    x={star.x} y={star.y - 12.5}
                    textAnchor="middle"
                    fill={star.completed ? '#F4C430' : '#FFFFFF'}
                    fontSize="7" fontFamily="monospace"
                    fontWeight="600" letterSpacing="0.05em"
                    opacity={0.9}
                  >
                    {star.label.toUpperCase()}
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {/* CRT scanline overlay */}
        <rect width={W} height={H} rx="12" fill="url(#cp-scanlines)" opacity={0.4} />

        {/* Constellation name — vintage readout style */}
        <rect
          x={W - 160} y={H - 48} width={145} height={32} rx={4}
          fill="rgba(10,5,28,0.8)"
          stroke="rgba(244,196,48,0.15)" strokeWidth={0.5}
        />
        <text
          x={W - 88} y={H - 30}
          textAnchor="middle" fill="#F4C430"
          fontSize="10" fontFamily="monospace" fontWeight="700"
          letterSpacing="0.08em" opacity={0.7}
        >
          &quot;{constellationName}&quot;
        </text>
        {dateRange && (
          <text
            x={W - 88} y={H - 20}
            textAnchor="middle" fill="#8B5CF6"
            fontSize="7" fontFamily="monospace" fontWeight="400"
            opacity={0.5}
          >
            {dateRange}
          </text>
        )}

        {/* Progress counter — top right */}
        <rect
          x={W - 80} y={12} width={65} height={20} rx={3}
          fill="rgba(10,5,28,0.8)"
          stroke="rgba(244,196,48,0.2)" strokeWidth={0.5}
        />
        <text
          x={W - 48} y={25}
          textAnchor="middle" fill="#F4C430"
          fontSize="8" fontFamily="monospace" fontWeight="600"
          opacity={0.7}
        >
          {completedCount}/{stars.length}
        </text>
      </svg>
    </div>
  );
}
