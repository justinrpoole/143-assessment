'use client';

import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useEffect, useState, useMemo } from 'react';

interface AuroraCelebrationProps {
  /** Which ray improved (e.g., "R2") */
  improvedRay?: string;
  /** Ray name for display */
  rayName?: string;
  /** Whether to show the aurora */
  show: boolean;
  /** Duration in ms before auto-dismiss (default 5000) */
  duration?: number;
  /** Callback when aurora finishes */
  onComplete?: () => void;
}

function seededRandom(seed: number): number {
  return ((seed * 1597 + 51749) % 244944) / 244944;
}

/**
 * Aurora Celebration — Ray Improvement Reward (#6)
 *
 * A luminous aurora borealis sweeps across the screen when a Ray improves
 * week-over-week. Three layered ribbons (teal, emerald, rose-violet) with
 * curtain-like folds undulate gently. Fine gold sparkle particles drift
 * downward like cosmic snow. Brief and understated — a reward that respects
 * the user's intelligence. v3 branded: purple backdrop, aurora ribbons.
 */
export default function AuroraCelebration({
  rayName,
  show,
  duration = 5000,
  onComplete,
}: AuroraCelebrationProps) {
  const reducedMotion = useReducedMotion();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      queueMicrotask(() => setVisible(true));
      const timer = setTimeout(() => {
        setVisible(false);
        onComplete?.();
      }, duration);
      return () => clearTimeout(timer);
    }
    queueMicrotask(() => setVisible(false));
  }, [show, duration, onComplete]);

  // Generate falling sparkle particles
  const sparkles = useMemo(() => {
    const result: Array<{ x: number; delay: number; size: number; speed: number }> = [];
    for (let i = 0; i < 30; i++) {
      result.push({
        x: seededRandom(i * 3 + 1) * 100, // percentage
        delay: seededRandom(i * 3 + 2) * 3,
        size: 1 + seededRandom(i * 3 + 3) * 2,
        speed: 3 + seededRandom(i * 3 + 4) * 4,
      });
    }
    return result;
  }, []);

  // Aurora ribbon wave points
  const ribbonPath = (yBase: number, amplitude: number, freq: number, phase: number): string => {
    const points: string[] = [];
    const steps = 20;
    for (let i = 0; i <= steps; i++) {
      const x = (i / steps) * 100;
      const y = yBase + Math.sin((i / steps) * Math.PI * freq + phase) * amplitude;
      points.push(`${i === 0 ? 'M' : 'L'} ${x} ${y}`);
    }
    // Close path downward
    const yBottom = yBase + amplitude + 8;
    for (let i = steps; i >= 0; i--) {
      const x = (i / steps) * 100;
      const y = yBottom + Math.sin((i / steps) * Math.PI * (freq + 0.5) + phase + 0.3) * (amplitude * 0.3);
      points.push(`L ${x} ${y}`);
    }
    return points.join(' ') + ' Z';
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reducedMotion ? 0 : 1.2, ease: 'easeInOut' }}
          style={{
            position: 'fixed',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 90,
          }}
          role="status"
          aria-live="polite"
          aria-label={rayName ? `${rayName} improved this week` : 'A ray improved this week'}
        >
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
            aria-hidden="true"
          >
            <defs>
              {/* Teal ribbon gradient */}
              <linearGradient id="aurora-teal" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#1ABC9C" stopOpacity="0" />
                <stop offset="20%" stopColor="#1ABC9C" stopOpacity="0.5" />
                <stop offset="50%" stopColor="#1ABC9C" stopOpacity="0.6" />
                <stop offset="80%" stopColor="#1ABC9C" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#1ABC9C" stopOpacity="0" />
              </linearGradient>

              {/* Emerald ribbon gradient */}
              <linearGradient id="aurora-emerald" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#2ECC71" stopOpacity="0" />
                <stop offset="25%" stopColor="#2ECC71" stopOpacity="0.35" />
                <stop offset="50%" stopColor="#2ECC71" stopOpacity="0.4" />
                <stop offset="75%" stopColor="#2ECC71" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#2ECC71" stopOpacity="0" />
              </linearGradient>

              {/* Rose-violet ribbon gradient */}
              <linearGradient id="aurora-rose" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#C39BD3" stopOpacity="0" />
                <stop offset="30%" stopColor="#C39BD3" stopOpacity="0.25" />
                <stop offset="50%" stopColor="#C39BD3" stopOpacity="0.3" />
                <stop offset="70%" stopColor="#C39BD3" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#C39BD3" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Lowest ribbon — teal */}
            <motion.path
              d={ribbonPath(20, 4, 3, 0)}
              fill="url(#aurora-teal)"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 20, opacity: 0 }}
              transition={{ duration: reducedMotion ? 0 : 2, ease: 'easeOut' }}
            >
              {!reducedMotion && (
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  values="-2,0; 2,0; -2,0"
                  dur="8s"
                  repeatCount="indefinite"
                />
              )}
            </motion.path>

            {/* Middle ribbon — emerald */}
            <motion.path
              d={ribbonPath(15, 3.5, 2.5, 1)}
              fill="url(#aurora-emerald)"
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 30, opacity: 0 }}
              transition={{ duration: reducedMotion ? 0 : 2.5, ease: 'easeOut', delay: 0.3 }}
            >
              {!reducedMotion && (
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  values="2,0; -2,0; 2,0"
                  dur="7s"
                  repeatCount="indefinite"
                />
              )}
            </motion.path>

            {/* Highest ribbon — rose-violet */}
            <motion.path
              d={ribbonPath(10, 3, 2, 2)}
              fill="url(#aurora-rose)"
              initial={{ x: -40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 40, opacity: 0 }}
              transition={{ duration: reducedMotion ? 0 : 3, ease: 'easeOut', delay: 0.6 }}
            >
              {!reducedMotion && (
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  values="-1,0; 1,0; -1,0"
                  dur="9s"
                  repeatCount="indefinite"
                />
              )}
            </motion.path>
          </svg>

          {/* Sparkle particles drifting downward */}
          {!reducedMotion &&
            sparkles.map((s, i) => (
              <motion.div
                key={i}
                style={{
                  position: 'absolute',
                  left: `${s.x}%`,
                  top: '15%',
                  width: s.size,
                  height: s.size,
                  borderRadius: '50%',
                  background: '#F4C430',
                }}
                initial={{ opacity: 0, y: 0 }}
                animate={{ opacity: [0, 0.6, 0], y: 200 }}
                transition={{
                  duration: s.speed,
                  delay: s.delay,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />
            ))}

          {/* Subtle improvement indicator at bottom */}
          {rayName && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 1.5, duration: 0.6 }}
              style={{
                position: 'absolute',
                bottom: '25%',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 14px',
                background: 'rgba(17, 3, 32, 0.7)',
                borderRadius: 999,
                backdropFilter: 'blur(12px)',
              }}
            >
              <span style={{ color: '#2ECC71', fontSize: 12 }}>▲</span>
              <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, fontWeight: 500 }}>
                {rayName} grew this week
              </span>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
