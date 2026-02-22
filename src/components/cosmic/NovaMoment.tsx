'use client';

import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useEffect, useCallback } from 'react';

interface NovaMomentProps {
  /** Whether to show the nova explosion */
  show: boolean;
  /** The ray that cleared its eclipse */
  rayName?: string;
  /** Message to display (e.g., "Power remembered.") */
  message?: string;
  /** Duration in ms before auto-dismiss */
  duration?: number;
  /** Callback when the animation completes */
  onComplete?: () => void;
}

/**
 * Nova Moment (#11) — Eclipse Clearance Explosion
 *
 * A star detonates into brilliant white-gold when a Ray clears from eclipse.
 * Four layers: white core, 30 radial beams (143 sun-style), shock wave ring,
 * warm diffuse bloom. Message appears below.
 * v3 branded: gold explosion on royal purple, rose-violet transition zone.
 */
export default function NovaMoment({
  show,
  rayName = 'Power',
  message,
  duration = 4000,
  onComplete,
}: NovaMomentProps) {
  const reducedMotion = useReducedMotion();
  const displayMessage = message ?? `${rayName} remembered.`;

  useEffect(() => {
    if (!show) return;
    const timer = setTimeout(() => onComplete?.(), duration);
    return () => clearTimeout(timer);
  }, [show, duration, onComplete]);

  // Generate 30 beam angles
  const beams = Array.from({ length: 30 }, (_, i) => (i / 30) * 360);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reducedMotion ? 0.01 : 0.3 }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}
          role="alert"
          aria-label={`Nova moment: ${displayMessage}`}
        >
          <svg viewBox="0 0 500 500" style={{ width: '100%', maxWidth: 500, maxHeight: '80vh' }}>
            <defs>
              <radialGradient id="nova-bloom">
                <stop offset="0%" stopColor="#F4C430" stopOpacity="0.5" />
                <stop offset="50%" stopColor="#F4C430" stopOpacity="0.15" />
                <stop offset="80%" stopColor="#C39BD3" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#4A0E78" stopOpacity="0" />
              </radialGradient>
              <filter id="nova-glow" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur stdDeviation="8" result="b" />
                <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>

            {/* Purple background */}
            <rect width="500" height="500" fill="#4A0E78" />

            {/* Layer 4: Diffuse warm bloom */}
            <motion.circle
              cx={250}
              cy={230}
              fill="url(#nova-bloom)"
              initial={{ r: 0, opacity: 0 }}
              animate={{ r: 220, opacity: 1 }}
              transition={{ duration: reducedMotion ? 0.01 : 1.2, ease: 'easeOut' }}
            />

            {/* Layer 3: Shock wave ring */}
            <motion.circle
              cx={250}
              cy={230}
              fill="none"
              stroke="#E8A317"
              strokeWidth={2}
              initial={{ r: 10, opacity: 0 }}
              animate={{ r: 160, opacity: [0, 0.7, 0] }}
              transition={{ duration: reducedMotion ? 0.01 : 1.5, ease: 'easeOut' }}
            />

            {/* Layer 2: 30 radial beams */}
            {beams.map((angle, i) => {
              const rad = (angle * Math.PI) / 180;
              const len = 80 + (i % 3 === 0 ? 40 : 0);
              return (
                <motion.line
                  key={i}
                  x1={250}
                  y1={230}
                  x2={250 + Math.cos(rad) * len}
                  y2={230 + Math.sin(rad) * len}
                  stroke="#F4C430"
                  strokeWidth={i % 3 === 0 ? 2.5 : 1.5}
                  initial={{ opacity: 0, pathLength: 0 }}
                  animate={{ opacity: [0, 0.9, 0.6], pathLength: 1 }}
                  transition={{
                    duration: reducedMotion ? 0.01 : 0.8,
                    delay: reducedMotion ? 0 : 0.2 + i * 0.01,
                    ease: 'easeOut',
                  }}
                  filter="url(#nova-glow)"
                />
              );
            })}

            {/* Layer 1: White core */}
            <motion.circle
              cx={250}
              cy={230}
              fill="#FFFFFF"
              initial={{ r: 0, opacity: 0 }}
              animate={{ r: 25, opacity: [0, 1, 0.85] }}
              transition={{ duration: reducedMotion ? 0.01 : 0.6, ease: 'easeOut' }}
              filter="url(#nova-glow)"
            />
            <motion.circle
              cx={250}
              cy={230}
              fill="#F4C430"
              initial={{ r: 0 }}
              animate={{ r: 35 }}
              transition={{ duration: reducedMotion ? 0.01 : 0.8, ease: 'easeOut' }}
              opacity={0.4}
            />

            {/* Message text */}
            <motion.text
              x={250}
              y={380}
              textAnchor="middle"
              fill="#FFFFFF"
              fontSize="18"
              fontWeight="600"
              letterSpacing="0.04em"
              initial={{ opacity: 0, y: 400 }}
              animate={{ opacity: 1, y: 380 }}
              transition={{
                duration: reducedMotion ? 0.01 : 0.8,
                delay: reducedMotion ? 0 : 0.6,
                ease: [0.2, 0.8, 0.2, 1],
              }}
            >
              {displayMessage}
            </motion.text>
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
