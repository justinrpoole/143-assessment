'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useMemo } from 'react';

interface EscapeVelocityProps {
  /** Progress from 0 (trapped) to 100 (free) */
  progress: number;
  /** Ray being escaped from */
  rayName?: string;
  /** Pattern being escaped */
  patternLabel?: string;
}

/**
 * Escape Velocity (#24) — Breaking Free from Gravitational Pattern
 *
 * Gold sphere escapes a gravity well. Trail tells the story: curved and
 * strained below, straightening and brightening above the threshold.
 * v3 branded: gold grid on purple, sphere breaking free.
 */
export default function EscapeVelocity({
  progress,
  rayName,
  patternLabel = 'Breaking free',
}: EscapeVelocityProps) {
  const reducedMotion = useReducedMotion();
  const W = 400;
  const H = 500;
  const cx = W / 2;

  // Threshold line at 55% height from bottom
  const thresholdY = H * 0.45;

  // Grid lines that curve into the well
  const gridLines = useMemo(() => {
    const lines: string[] = [];
    const wellCenterY = H * 0.85;
    const wellDepth = 60;

    for (let row = 0; row < 16; row++) {
      const pts: string[] = [];
      const baseY = H * 0.3 + row * 16;
      for (let col = 0; col <= 16; col++) {
        const x = (col / 16) * W;
        const dx = x - cx;
        const dy = baseY - wellCenterY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const pull = Math.max(0, 1 - dist / 200) * wellDepth;
        const y = baseY + pull;
        pts.push(`${x},${y}`);
      }
      lines.push(pts.join(' '));
    }
    return lines;
  }, [H, cx, W]);

  // Sphere position based on progress
  const sphereY = useMemo(() => {
    // Map 0-100 to bottom of well to top of frame
    const bottomY = H * 0.82;
    const topY = H * 0.08;
    return bottomY - (progress / 100) * (bottomY - topY);
  }, [progress]);

  // Trail path from bottom to current position
  const trailPath = useMemo(() => {
    const pts: string[] = [];
    const steps = 30;
    const bottomY = H * 0.82;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const y = bottomY - t * (bottomY - sphereY);
      // Curve: more horizontal wobble near bottom, straightening up top
      const curvature = Math.max(0, 1 - t * 1.5) * 25;
      const x = cx + Math.sin(t * Math.PI * 1.5) * curvature;
      pts.push(`${i === 0 ? 'M' : 'L'} ${x} ${y}`);
    }
    return pts.join(' ');
  }, [sphereY, H, cx]);

  const aboveThreshold = sphereY < thresholdY;

  return (
    <div className="glass-card p-5">
      <p
        className="mb-3"
        style={{ color: 'var(--text-on-dark-secondary)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}
      >
        Escape Velocity
      </p>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" aria-label={`Escape velocity — ${progress}% progress${aboveThreshold ? ', above threshold' : ''}`}>
        <defs>
          <linearGradient id="ev-bg" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#3A0A5E" />
            <stop offset="45%" stopColor="var(--cosmic-svg-bg)" />
            <stop offset="100%" stopColor="var(--cosmic-purple-vivid)" />
          </linearGradient>
          <linearGradient id="ev-trail" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#E8A317" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#F4C430" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#F4C430" stopOpacity="0.9" />
          </linearGradient>
          <filter id="ev-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        <rect width={W} height={H} rx="12" fill="url(#ev-bg)" />

        {/* Gold grid curving into well */}
        {gridLines.map((pts, i) => (
          <polyline
            key={i}
            points={pts}
            fill="none"
            stroke="#F4C430"
            strokeWidth={0.4}
            strokeOpacity={0.2}
          />
        ))}

        {/* Dark well center */}
        <circle cx={cx} cy={H * 0.85} r={25} fill="#1A1A1A" opacity={0.7} />
        <circle cx={cx} cy={H * 0.85} r={35} fill="#3A0A5E" opacity={0.3} />

        {/* Threshold line */}
        <line
          x1={40}
          y1={thresholdY}
          x2={W - 40}
          y2={thresholdY}
          stroke="#FFFFFF"
          strokeWidth={1}
          strokeOpacity={0.2}
          strokeDasharray="6 6"
        />
        <text x={W - 44} y={thresholdY - 6} textAnchor="end" fill="#FFFFFF" fontSize="8" fontWeight="500" opacity={0.3}>
          escape threshold
        </text>

        {/* Escape trail */}
        <motion.path
          d={trailPath}
          fill="none"
          stroke="url(#ev-trail)"
          strokeWidth={2}
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: reducedMotion ? 0.01 : 1.5, ease: 'easeOut' }}
        />

        {/* Escaping gold sphere */}
        <motion.circle
          cx={cx}
          cy={sphereY}
          r={10}
          fill="#F4C430"
          filter={aboveThreshold ? 'url(#ev-glow)' : undefined}
          initial={false}
          animate={
            !reducedMotion && aboveThreshold
              ? { r: [9, 11, 9], opacity: [0.8, 1, 0.8] }
              : { opacity: aboveThreshold ? 0.9 : 0.6 }
          }
          transition={!reducedMotion ? { duration: 2, repeat: Infinity, ease: 'easeInOut' } : undefined}
        />
        <circle cx={cx} cy={sphereY} r={4} fill="#FFFFFF" opacity={aboveThreshold ? 0.6 : 0.3} />

        {/* Label */}
        {rayName && (
          <text x={cx} y={H - 16} textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="500" opacity={0.4}>
            {patternLabel} — {rayName}
          </text>
        )}
      </svg>
    </div>
  );
}
