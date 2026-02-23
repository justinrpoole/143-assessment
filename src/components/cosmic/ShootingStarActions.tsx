'use client';

import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useState, useCallback, useMemo } from 'react';

interface ActionItem {
  id: string;
  rayId: string;
  rayName: string;
  action: string;
  icon?: string;
}

interface ShootingStarActionsProps {
  actions: ActionItem[];
  onComplete?: (actionId: string) => void;
}

const RAY_COLORS: Record<string, string> = {
  R1: '#F4C430', R2: '#F4C430', R3: '#8E44AD',
  R4: '#C0392B', R5: '#D4770B', R6: '#E8A317',
  R7: '#1ABC9C', R8: '#1ABC9C', R9: '#F4C430',
};

function seededRandom(seed: number): number {
  return ((seed * 1597 + 51749) % 244944) / 244944;
}

/**
 * Shooting Star Actions (#8) — Dynamic Action Moments
 *
 * Brilliant shooting stars streak diagonally. Each carries an action card.
 * Completing an action leaves a permanent glow trail in the Ray's color.
 * v3 branded: gold-white streaks on royal purple, ray-colored completion trails.
 */
export default function ShootingStarActions({ actions, onComplete }: ShootingStarActionsProps) {
  const reducedMotion = useReducedMotion();
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [activeAction, setActiveAction] = useState<string | null>(null);

  const W = 700;
  const H = 400;

  const handleComplete = useCallback(
    (id: string) => {
      setCompletedIds((prev) => new Set(prev).add(id));
      setActiveAction(null);
      onComplete?.(id);
    },
    [onComplete],
  );

  // Sparkle particles along each trail
  const sparkles = useMemo(() => {
    return actions.map((_, idx) => {
      const pts: Array<{ x: number; y: number; size: number; delay: number }> = [];
      for (let i = 0; i < 8; i++) {
        const t = 0.1 + (i / 8) * 0.7;
        const baseX = W * 0.85 - t * W * 0.7;
        const baseY = 40 + idx * 100 + t * 80;
        pts.push({
          x: baseX + (seededRandom(idx * 100 + i * 3) - 0.5) * 12,
          y: baseY + (seededRandom(idx * 100 + i * 3 + 1) - 0.5) * 12,
          size: 1 + seededRandom(idx * 100 + i * 3 + 2) * 2,
          delay: i * 0.15,
        });
      }
      return pts;
    });
  }, [actions]);

  return (
    <div className="glass-card p-5">
      <p
        className="mb-3"
        style={{ color: 'var(--text-on-dark-secondary)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}
      >
        Shooting Star Actions
      </p>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" aria-label="Shooting star action items">
        <defs>
          <radialGradient id="ssa-bg">
            <stop offset="0%" stopColor="var(--cosmic-purple-vivid)" />
            <stop offset="100%" stopColor="var(--cosmic-svg-bg)" />
          </radialGradient>
          <filter id="ssa-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        <rect width={W} height={H} rx="12" fill="url(#ssa-bg)" />

        {/* Distant 143 sun reference */}
        <circle cx={60} cy={H - 60} r={15} fill="#F4C430" opacity={0.15} />
        <circle cx={60} cy={H - 60} r={6} fill="#F4C430" opacity={0.25} />

        {actions.map((action, idx) => {
          const completed = completedIds.has(action.id);
          const isActive = activeAction === action.id;
          const rayColor = RAY_COLORS[action.rayId] ?? '#F4C430';

          // Shooting star path: upper-right to lower-left
          const sx = W * 0.88;
          const sy = 30 + idx * 100;
          const ex = W * 0.15;
          const ey = sy + 80;

          return (
            <g key={action.id}>
              {/* Completion trail (permanent ray-colored line) */}
              {completed && (
                <line
                  x1={ex}
                  y1={ey}
                  x2={60}
                  y2={H - 60}
                  stroke={rayColor}
                  strokeWidth={1}
                  strokeOpacity={0.3}
                  strokeDasharray="4 6"
                />
              )}

              {/* Shooting star trail */}
              <motion.line
                x1={sx}
                y1={sy}
                x2={completed ? ex : ex + 80}
                y2={completed ? ey : ey - 20}
                stroke={completed ? rayColor : '#F4C430'}
                strokeWidth={completed ? 1.5 : 2}
                strokeOpacity={completed ? 0.5 : 0.7}
                filter={completed ? undefined : 'url(#ssa-glow)'}
                initial={false}
                animate={
                  !reducedMotion && !completed
                    ? { strokeOpacity: [0.4, 0.8, 0.4] }
                    : undefined
                }
                transition={
                  !reducedMotion ? { duration: 2, repeat: Infinity, ease: 'easeInOut' } : undefined
                }
              />

              {/* Sparkle particles */}
              {!completed &&
                sparkles[idx]?.map((sp, si) => (
                  <motion.circle
                    key={si}
                    cx={sp.x}
                    cy={sp.y}
                    r={sp.size}
                    fill="#F4C430"
                    initial={false}
                    animate={
                      !reducedMotion
                        ? { opacity: [0.1, 0.6, 0.1], scale: [0.8, 1.2, 0.8] }
                        : { opacity: 0.3 }
                    }
                    transition={
                      !reducedMotion
                        ? { duration: 1.5, delay: sp.delay, repeat: Infinity, ease: 'easeInOut' }
                        : undefined
                    }
                  />
                ))}

              {/* Star head */}
              {!completed && (
                <motion.circle
                  cx={completed ? ex : ex + 80}
                  cy={completed ? ey : ey - 20}
                  r={5}
                  fill="#FFFFFF"
                  filter="url(#ssa-glow)"
                  initial={false}
                  animate={
                    !reducedMotion
                      ? { r: [4, 6, 4], opacity: [0.8, 1, 0.8] }
                      : undefined
                  }
                  transition={
                    !reducedMotion
                      ? { duration: 1.5, repeat: Infinity, ease: 'easeInOut' }
                      : undefined
                  }
                />
              )}

              {/* Tap target */}
              <circle
                cx={completed ? ex : ex + 80}
                cy={completed ? ey : ey - 20}
                r={25}
                fill="transparent"
                className="cosmic-focus-target"
                role="button"
                tabIndex={0}
                aria-label={`${action.rayName}: ${action.action}${completed ? ' (completed)' : ''}`}
                style={{ cursor: completed ? 'default' : 'pointer' }}
                onClick={() => !completed && setActiveAction(isActive ? null : action.id)}
                onKeyDown={(e) => {
                  if ((e.key === 'Enter' || e.key === ' ') && !completed) {
                    e.preventDefault();
                    setActiveAction(isActive ? null : action.id);
                  }
                }}
              />

              {/* Ray name label */}
              <text
                x={completed ? ex : ex + 80}
                y={(completed ? ey : ey - 20) + 32}
                textAnchor="middle"
                fill={rayColor}
                fontSize="9"
                fontWeight="500"
                opacity={0.6}
              >
                {action.rayName}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Action card */}
      <AnimatePresence>
        {activeAction && (() => {
          const action = actions.find((a) => a.id === activeAction);
          if (!action) return null;
          const rayColor = RAY_COLORS[action.rayId] ?? '#F4C430';
          return (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
              className="mt-4 p-4"
              style={{
                background: 'rgba(17, 3, 32, 0.85)',
                border: `1.5px solid ${rayColor}`,
                borderRadius: 'var(--radius-xl)',
                backdropFilter: 'blur(20px)',
                boxShadow: `0 0 24px ${rayColor}22`,
              }}
              role="dialog"
              aria-label={`Action: ${action.action}`}
            >
              <p style={{ color: rayColor, fontSize: 12, fontWeight: 700, letterSpacing: '0.04em' }}>
                {action.icon ?? '⚡'} {action.rayName} Action
              </p>
              <p className="mt-2" style={{ color: 'var(--text-on-dark)', fontSize: 14 }}>
                {action.action}
              </p>
              <button
                className="mt-3 btn-primary"
                style={{ fontSize: 12, padding: '8px 20px' }}
                onClick={() => handleComplete(action.id)}
              >
                Mark Complete
              </button>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}
