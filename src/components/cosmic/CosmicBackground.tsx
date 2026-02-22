'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useMemo } from 'react';

interface DailyEnergy {
  day: string; // e.g., "Mon", "Tue"
  level: number; // 0-100
}

interface CosmicBackgroundProps {
  /** Seven days of energy data */
  dailyEnergy: DailyEnergy[];
}

/**
 * Cosmic Background Radiation (#28) — Baseline Energy Heat Map
 *
 * Full-bleed organic heat map on purple foundation showing 7 days.
 * Cold = deeper purple, warm = gold-on-purple. Flows like weather.
 * v3 branded: stays purple-family throughout, gold highlights.
 */
export default function CosmicBackground({ dailyEnergy }: CosmicBackgroundProps) {
  const reducedMotion = useReducedMotion();
  const W = 900;
  const H = 250;

  const days = dailyEnergy.slice(0, 7);
  const dayWidth = W / days.length;

  // For each day, generate organic blotch shapes
  const blotches = useMemo(() => {
    return days.map((day, di) => {
      const cx = di * dayWidth + dayWidth / 2;
      const cy = H / 2;
      const level = day.level / 100;
      const count = 3 + Math.floor(level * 4);
      const shapes: Array<{
        x: number; y: number; rx: number; ry: number;
        rotation: number; color: string; opacity: number;
      }> = [];

      for (let i = 0; i < count; i++) {
        const seed = di * 100 + i * 7;
        const angle = ((seed * 1597 + 51749) % 244944) / 244944 * Math.PI * 2;
        const dist = ((seed * 2 * 1597 + 51749) % 244944) / 244944 * 50;
        const bx = cx + Math.cos(angle) * dist;
        const by = cy + Math.sin(angle) * dist;
        const rx = 20 + ((seed * 3 * 1597 + 51749) % 244944) / 244944 * 40;
        const ry = 15 + ((seed * 4 * 1597 + 51749) % 244944) / 244944 * 30;

        // Color mapping based on energy level
        let color: string;
        let opacity: number;
        if (level < 0.2) {
          color = '#2C0A3E';
          opacity = 0.4;
        } else if (level < 0.4) {
          color = '#1ABC9C';
          opacity = 0.08;
        } else if (level < 0.6) {
          color = '#E8A317';
          opacity = 0.1;
        } else if (level < 0.8) {
          color = '#F4C430';
          opacity = 0.15;
        } else {
          color = '#F4C430';
          opacity = 0.3;
        }

        shapes.push({
          x: bx,
          y: by,
          rx,
          ry,
          rotation: ((seed * 5 * 1597 + 51749) % 244944) / 244944 * 180,
          color,
          opacity,
        });
      }

      // Highlight breakthrough: highest energy gets a white core
      if (level > 0.8) {
        shapes.push({
          x: cx,
          y: cy,
          rx: 15,
          ry: 12,
          rotation: 0,
          color: '#FFFFFF',
          opacity: 0.08,
        });
      }

      return shapes;
    });
  }, [days, dayWidth]);

  return (
    <div className="glass-card p-5">
      <p
        className="mb-3"
        style={{ color: 'var(--text-on-dark-secondary)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}
      >
        Baseline Energy
      </p>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" aria-label="Weekly energy heat map" style={{ borderRadius: 'var(--radius-xl)' }}>
        <defs>
          <filter id="cbr-blur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="16" />
          </filter>
        </defs>

        {/* Purple base */}
        <rect width={W} height={H} rx="12" fill="#4A0E78" />

        {/* Organic blotches */}
        {blotches.map((dayBlotches, di) =>
          dayBlotches.map((b, bi) => (
            <motion.ellipse
              key={`${di}-${bi}`}
              cx={b.x}
              cy={b.y}
              rx={b.rx}
              ry={b.ry}
              fill={b.color}
              opacity={b.opacity}
              transform={`rotate(${b.rotation} ${b.x} ${b.y})`}
              filter="url(#cbr-blur)"
              initial={false}
              animate={
                !reducedMotion
                  ? { opacity: [b.opacity * 0.7, b.opacity, b.opacity * 0.7] }
                  : undefined
              }
              transition={
                !reducedMotion
                  ? { duration: 5 + di + bi, repeat: Infinity, ease: 'easeInOut' }
                  : undefined
              }
            />
          )),
        )}

        {/* Day labels */}
        {days.map((day, di) => (
          <text
            key={di}
            x={di * dayWidth + dayWidth / 2}
            y={H - 8}
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="8"
            fontWeight="400"
            opacity={0.25}
          >
            {day.day}
          </text>
        ))}
      </svg>

      {/* Energy values */}
      <div className="mt-2 flex justify-between px-1">
        {days.map((day, di) => (
          <div key={di} className="text-center" style={{ flex: 1 }}>
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: day.level > 70 ? '#F4C430' : day.level > 40 ? '#E8A317' : 'var(--text-on-dark-muted)',
              }}
            >
              {day.level}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
