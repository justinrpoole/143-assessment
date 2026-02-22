'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useState, useCallback, useMemo } from 'react';

interface AtmosphereShieldProps {
  /** Whether the shield is currently active */
  active: boolean;
  /** Shield strength 0-100 (influences dome opacity/thickness) */
  strength?: number;
  /** Toggle callback */
  onToggle?: (active: boolean) => void;
}

function seededRandom(seed: number): number {
  return ((seed * 1597 + 51749) % 244944) / 244944;
}

/**
 * Atmosphere Shield (#9) — Boundary Protection System
 *
 * Translucent hexagonal dome surrounding a figure of golden light.
 * Two states: Shield Active (warm, contained, protected) vs Shield Off
 * (fragments dissolving, particles drifting through).
 * v3 branded: gold dome on royal purple, hexagonal tessellation.
 */
export default function AtmosphereShield({ active, strength = 75, onToggle }: AtmosphereShieldProps) {
  const reducedMotion = useReducedMotion();
  const [isActive, setIsActive] = useState(active);

  const W = 700;
  const H = 400;
  const cx = W / 2;
  const cy = H * 0.55;
  const domeR = 100;

  const handleToggle = useCallback(() => {
    const next = !isActive;
    setIsActive(next);
    onToggle?.(next);
  }, [isActive, onToggle]);

  // Floating particles
  const particles = useMemo(() => {
    const pts: Array<{ x: number; y: number; vx: number; vy: number; size: number; delay: number }> = [];
    for (let i = 0; i < 20; i++) {
      const angle = seededRandom(i * 5) * Math.PI * 2;
      const dist = domeR + 20 + seededRandom(i * 5 + 1) * 80;
      pts.push({
        x: cx + Math.cos(angle) * dist,
        y: cy + Math.sin(angle) * dist * 0.7,
        vx: (seededRandom(i * 5 + 2) - 0.5) * 30,
        vy: (seededRandom(i * 5 + 3) - 0.5) * 20,
        size: 1 + seededRandom(i * 5 + 4) * 2,
        delay: seededRandom(i * 5 + 2) * 4,
      });
    }
    return pts;
  }, []);

  // Hexagonal tessellation points for dome surface
  const hexPoints = useMemo(() => {
    const pts: Array<{ x: number; y: number }> = [];
    const hexSize = 18;
    for (let row = -4; row <= 4; row++) {
      for (let col = -5; col <= 5; col++) {
        const hx = cx + col * hexSize * 1.5;
        const hy = cy + row * hexSize * 1.73 + (col % 2 ? hexSize * 0.866 : 0);
        const dist = Math.sqrt((hx - cx) ** 2 + ((hy - cy) / 0.7) ** 2);
        if (dist < domeR + 5 && dist > domeR - 25) {
          pts.push({ x: hx, y: hy });
        }
      }
    }
    return pts;
  }, []);

  const shieldOpacity = (strength / 100) * 0.4;

  return (
    <div className="glass-card p-5">
      <p
        className="mb-3"
        style={{ color: 'var(--text-on-dark-secondary)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}
      >
        Atmosphere Shield
      </p>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" aria-label={`Atmosphere shield — ${isActive ? 'active' : 'off'}`}>
        <defs>
          <radialGradient id="as-bg">
            <stop offset="0%" stopColor="#5B2C8E" />
            <stop offset="100%" stopColor="#4A0E78" />
          </radialGradient>
          <radialGradient id="as-dome" cx="50%" cy="40%">
            <stop offset="0%" stopColor="#F4C430" stopOpacity={shieldOpacity * 0.3} />
            <stop offset="70%" stopColor="#F4C430" stopOpacity={shieldOpacity} />
            <stop offset="100%" stopColor="#F4C430" stopOpacity={shieldOpacity * 0.1} />
          </radialGradient>
          <radialGradient id="as-figure">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.5" />
            <stop offset="50%" stopColor="#F4C430" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#F4C430" stopOpacity="0" />
          </radialGradient>
          <clipPath id="as-dome-clip">
            <ellipse cx={cx} cy={cy} rx={domeR} ry={domeR * 0.7} />
          </clipPath>
        </defs>

        {/* Background */}
        <rect width={W} height={H} rx="12" fill="url(#as-bg)" />

        {/* Background stars */}
        {Array.from({ length: 30 }).map((_, i) => (
          <circle
            key={i}
            cx={seededRandom(i * 9) * W}
            cy={seededRandom(i * 9 + 1) * H}
            r={0.5 + seededRandom(i * 9 + 2) * 1}
            fill="#FFFFFF"
            opacity={0.1 + seededRandom(i * 9 + 3) * 0.2}
          />
        ))}

        {/* Abstract human figure (golden light column) */}
        <ellipse cx={cx} cy={cy + 15} rx={12} ry={35} fill="url(#as-figure)" />
        <circle cx={cx} cy={cy - 30} r={8} fill="#F4C430" opacity={isActive ? 0.4 : 0.25} />

        {/* Shield dome — active state */}
        <AnimatedDome
          cx={cx}
          cy={cy}
          rx={domeR}
          ry={domeR * 0.7}
          isActive={isActive}
          reducedMotion={!!reducedMotion}
        />

        {/* Hexagonal tessellation on dome surface */}
        {isActive && hexPoints.map((pt, i) => (
          <motion.polygon
            key={i}
            points={hexagonPoints(pt.x, pt.y, 8)}
            fill="none"
            stroke="#FFFFFF"
            strokeWidth={0.5}
            initial={false}
            animate={{ strokeOpacity: reducedMotion ? 0.08 : [0.04, 0.1, 0.04] }}
            transition={
              !reducedMotion
                ? { duration: 3, delay: seededRandom(i * 13) * 2, repeat: Infinity, ease: 'easeInOut' }
                : undefined
            }
          />
        ))}

        {/* Gold rim where dome meets background */}
        {isActive && (
          <motion.ellipse
            cx={cx}
            cy={cy}
            rx={domeR}
            ry={domeR * 0.7}
            fill="none"
            stroke="#F4C430"
            strokeWidth={1.5}
            initial={false}
            animate={
              !reducedMotion
                ? { strokeOpacity: [0.2, 0.4, 0.2] }
                : { strokeOpacity: 0.3 }
            }
            transition={
              !reducedMotion
                ? { duration: 3, repeat: Infinity, ease: 'easeInOut' }
                : undefined
            }
          />
        )}

        {/* Dissolving fragments when shield is off */}
        {!isActive && hexPoints.slice(0, 12).map((pt, i) => (
          <motion.polygon
            key={`frag-${i}`}
            points={hexagonPoints(pt.x, pt.y, 6)}
            fill="#F4C430"
            fillOpacity={0.08}
            stroke="#F4C430"
            strokeWidth={0.3}
            strokeOpacity={0.15}
            initial={false}
            animate={
              !reducedMotion
                ? {
                    x: (seededRandom(i * 7) - 0.5) * 40,
                    y: (seededRandom(i * 7 + 1) - 0.5) * 30,
                    opacity: [0.3, 0.1, 0.3],
                  }
                : { opacity: 0.15 }
            }
            transition={
              !reducedMotion
                ? { duration: 4 + seededRandom(i * 7 + 2) * 3, repeat: Infinity, ease: 'easeInOut' }
                : undefined
            }
          />
        ))}

        {/* Floating particles */}
        {particles.map((p, i) => {
          // When shield is active, particles stay outside. When off, they drift freely
          const blocked = isActive && Math.sqrt((p.x - cx) ** 2 + ((p.y - cy) / 0.7) ** 2) < domeR + 10;
          return (
            <motion.circle
              key={i}
              cx={p.x}
              cy={p.y}
              r={p.size}
              fill="#FFFFFF"
              initial={false}
              animate={
                !reducedMotion
                  ? {
                      x: blocked ? 0 : [0, p.vx, 0],
                      y: blocked ? 0 : [0, p.vy, 0],
                      opacity: [0.1, 0.3, 0.1],
                    }
                  : { opacity: 0.15 }
              }
              transition={
                !reducedMotion
                  ? { duration: 5 + p.delay, repeat: Infinity, ease: 'easeInOut' }
                  : undefined
              }
            />
          );
        })}

        {/* Toggle button */}
        <g
          onClick={handleToggle}
          style={{ cursor: 'pointer' }}
          role="switch"
          aria-checked={isActive}
          aria-label="Toggle atmosphere shield"
          tabIndex={0}
          className="cosmic-focus-target"
        >
          <rect x={cx - 20} y={H - 40} width={40} height={18} rx={9} fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.2)" strokeWidth={1} />
          <motion.circle
            cy={H - 31}
            r={6}
            fill={isActive ? '#F4C430' : '#888888'}
            initial={false}
            animate={{ cx: isActive ? cx + 10 : cx - 10 }}
            transition={{ duration: 0.2 }}
          />
        </g>

        {/* State label */}
        <text x={cx} y={H - 12} textAnchor="middle" fill={isActive ? '#F4C430' : '#888888'} fontSize="9" fontWeight="600" opacity={0.6}>
          {isActive ? 'Shield Active' : 'Shield Off'}
        </text>
      </svg>
    </div>
  );
}

/** Animated dome ellipse with scale transition */
function AnimatedDome({
  cx, cy, rx, ry, isActive, reducedMotion,
}: { cx: number; cy: number; rx: number; ry: number; isActive: boolean; reducedMotion: boolean }) {
  return (
    <motion.ellipse
      cx={cx}
      cy={cy}
      rx={rx}
      ry={ry}
      fill={isActive ? 'url(#as-dome)' : 'none'}
      initial={false}
      animate={{
        scale: isActive ? 1 : 0.85,
        opacity: isActive ? 1 : 0,
      }}
      transition={{ duration: reducedMotion ? 0.01 : 0.6, ease: [0.2, 0.8, 0.2, 1] }}
      style={{ transformOrigin: `${cx}px ${cy}px` }}
    />
  );
}

/** Generate hexagon polygon points string */
function hexagonPoints(cx: number, cy: number, r: number): string {
  return Array.from({ length: 6 })
    .map((_, i) => {
      const angle = (Math.PI / 3) * i - Math.PI / 6;
      return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
    })
    .join(' ');
}
