'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import type { EclipseOutput } from '@/lib/types';
import { getEclipseLabel, getEclipseEncouragement, getEclipseExplanation, getGateExplanation } from '@/lib/cosmic-copy';

interface EclipseMeterProps {
  eclipse: EclipseOutput;
}

const LEVEL_COVERAGE: Record<string, number> = {
  LOW: 0.10,
  MODERATE: 0.40,
  ELEVATED: 0.70,
  HIGH: 0.95,
};

const LEVEL_COLORS: Record<string, string> = {
  LOW: 'var(--status-low, #A78BFA)',
  MODERATE: 'var(--status-moderate, #F8D011)',
  ELEVATED: 'var(--status-elevated, #F59E0B)',
  HIGH: 'var(--status-high, #FB923C)',
};

const LEVEL_LABELS: Record<string, string> = {
  LOW: 'LOW LOAD',
  MODERATE: 'MODERATE LOAD',
  ELEVATED: 'ELEVATED LOAD',
  HIGH: 'HIGH LOAD',
};

const GATE_LABELS: Record<string, string> = {
  STABILIZE: 'Your system is asking for stability before expansion.',
  BUILD_RANGE: 'You have room to build — stay intentional about load.',
  STRETCH: 'Clear for progressive development work.',
};

const METRIC_DETAILS: Record<string, { title: string; description: string }> = {
  recovery_access: {
    title: 'Recovery Access',
    description: 'How much energy your system has available to recover and rebuild. Higher means more capacity for growth work.',
  },
  load_pressure: {
    title: 'Load Pressure',
    description: 'The weight your system is currently carrying across emotional, cognitive, and relational dimensions.',
  },
};

const CENTER = 150;
const SUN_RADIUS = 52;
const STAR_COUNT = 20;

function seededRandom(seed: number): number {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

/** 4-point sparkle star path centered at (cx, cy) with given size */
function sparklePath(cx: number, cy: number, size: number): string {
  const outer = size;
  const inner = size * 0.25;
  return [
    `M${cx},${cy - outer}`,
    `L${cx + inner},${cy - inner}`,
    `L${cx + outer},${cy}`,
    `L${cx + inner},${cy + inner}`,
    `L${cx},${cy + outer}`,
    `L${cx - inner},${cy + inner}`,
    `L${cx - outer},${cy}`,
    `L${cx - inner},${cy - inner}`,
    'Z',
  ].join(' ');
}

/**
 * Eclipse Meter — Gravitational Stability load visualization.
 * Deep cosmic background (#0B0212) with purple nebula haze,
 * gold sun (#F8D011), charcoal moon (#2C2C2C) with thin white outline,
 * diamond-ring effect (intensely white crescent glow),
 * cleanly severed beams via moon mask, sparse diverse stars.
 */
export default function EclipseMeter({ eclipse }: EclipseMeterProps) {
  const [expandedMetric, setExpandedMetric] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const anim = !prefersReducedMotion;
  const coverage = LEVEL_COVERAGE[eclipse.level] ?? 0.40;
  const levelColor = LEVEL_COLORS[eclipse.level] ?? '#E8A317';
  const gateLabel = GATE_LABELS[eclipse.gating.mode] || eclipse.gating.reason;
  const cosmicLabel = getEclipseLabel(eclipse.level);
  const encouragement = getEclipseEncouragement(eclipse.level);
  const explanation = getEclipseExplanation(eclipse.level);
  const gateExplanation = getGateExplanation(eclipse.gating.mode);

  const moonTargetX = CENTER + SUN_RADIUS * 2 * (1 - coverage) - SUN_RADIUS;

  const rayCount = Math.max(2, Math.round(12 * (1 - coverage)));
  const rays = useMemo(() => {
    const result: Array<{ angle: number; length: number; width: number }> = [];
    const startAngle = 110;
    const spread = 260;
    for (let i = 0; i < rayCount; i++) {
      const angle = startAngle + (spread / (rayCount + 1)) * (i + 1);
      result.push({
        angle,
        length: SUN_RADIUS + 18 + seededRandom(i + 50) * 28 * (1 - coverage),
        width: 2 + seededRandom(i + 70) * 4,
      });
    }
    return result;
  }, [rayCount, coverage]);

  // Star diversity per v3: "most pinpoint warm white, a handful pale gold, two-three faint rose"
  const stars = useMemo(() =>
    Array.from({ length: STAR_COUNT }, (_, i) => {
      const colorRoll = seededRandom(i + 1500);
      let fill: string;
      let maxOpacity: number;
      if (colorRoll < 0.10) {
        fill = '#C39BD3'; // ~2 faint rose stars
        maxOpacity = 0.4;
      } else if (colorRoll < 0.25) {
        fill = '#F8D011'; // ~3 pale gold stars
        maxOpacity = 0.55;
      } else {
        fill = '#FDFCFD'; // ~15 warm white stars
        maxOpacity = 0.85;
      }
      return {
        x: seededRandom(i + 500) * CENTER * 2,
        y: seededRandom(i + 600) * CENTER * 2,
        r: 0.5 + seededRandom(i + 700) * 1.6,
        delay: seededRandom(i + 800) * 2.5,
        duration: 1 + seededRandom(i + 900) * 2,
        fill,
        maxOpacity,
      };
    }),
    []
  );

  const viewBox = `0 0 ${CENTER * 2} ${CENTER * 2}`;

  const toggleMetric = (key: string) => {
    setExpandedMetric(expandedMetric === key ? null : key);
  };

  return (
    <section className="space-y-4">
      <p className="text-sm" style={{ color: 'var(--text-on-dark-secondary, #FDFCFD)' }}>{cosmicLabel}</p>

      <div className="rounded-2xl overflow-hidden shadow-lg">
        <div className="relative">
          <svg
            viewBox={viewBox}
            className="w-full max-w-[400px] mx-auto block"
            role="img"
            aria-labelledby="ecl-title ecl-desc"
          >
            <title id="ecl-title">Eclipse Meter — {LEVEL_LABELS[eclipse.level] ?? 'System Load'}</title>
            <desc id="ecl-desc">
              Sun-and-moon eclipse visualization showing {eclipse.level.toLowerCase()} system load.
              Recovery access: {eclipse.derived_metrics.recovery_access}%.
              Load pressure: {eclipse.derived_metrics.load_pressure}%.
            </desc>
            <defs>
              {/* Deep space background — matches vintage 80s instrument aesthetic */}
              <radialGradient id="ecl-bg" cx="42%" cy="44%" r="65%">
                <stop offset="0%" stopColor="#1a0a35" />
                <stop offset="30%" stopColor="#0f0520" />
                <stop offset="60%" stopColor="#0a0318" />
                <stop offset="85%" stopColor="#060212" />
                <stop offset="100%" stopColor="#030108" />
              </radialGradient>

              {/* Golden atmospheric haze — #F8D011 at 8% per spec */}
              <radialGradient id="ecl-golden-haze" cx="48%" cy="48%" r="45%">
                <stop offset="0%" stopColor="#F8D011" stopOpacity="0.08" />
                <stop offset="50%" stopColor="#F8D011" stopOpacity="0.03" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>

              {/* Rose-violet warmth at gold/purple boundary */}
              <radialGradient id="ecl-rose-warmth" cx="48%" cy="48%" r="30%">
                <stop offset="35%" stopColor="transparent" />
                <stop offset="60%" stopColor="#C39BD3" stopOpacity="0.1" />
                <stop offset="85%" stopColor="#C39BD3" stopOpacity="0.04" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>

              {/* Warm nebula glow */}
              <radialGradient id="ecl-nebula" cx="60%" cy="40%" r="50%">
                <stop offset="0%" stopColor="#7B4FA2" stopOpacity="0.2" />
                <stop offset="50%" stopColor="#4A0E78" stopOpacity="0.08" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>

              {/* Golden nebula wisp */}
              <radialGradient id="ecl-nebula2" cx="25%" cy="65%" r="35%">
                <stop offset="0%" stopColor="#F8D011" stopOpacity="0.04" />
                <stop offset="40%" stopColor="#C39BD3" stopOpacity="0.03" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>

              {/* Gold dust */}
              <radialGradient id="ecl-stardust" cx="50%" cy="30%" r="35%">
                <stop offset="0%" stopColor="#F8D011" stopOpacity="0.05" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>

              {/* v3 brand gold sun */}
              <radialGradient id="ecl-sun" cx="46%" cy="40%" r="54%">
                <stop offset="0%" stopColor="#FFFEF5" />
                <stop offset="20%" stopColor="#FFF7CC" />
                <stop offset="50%" stopColor="#F8D011" />
                <stop offset="78%" stopColor="#E8A317" />
                <stop offset="100%" stopColor="#A8820A" stopOpacity="0.6" />
              </radialGradient>

              {/* Gold corona */}
              <radialGradient id="ecl-corona" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#F8D011" stopOpacity="0.55" />
                <stop offset="30%" stopColor="#F8D011" stopOpacity="0.25" />
                <stop offset="55%" stopColor="#E8A317" stopOpacity="0.1" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>

              {/* Charcoal moon — per v3: "#2C2C2C with thin white outline" */}
              <radialGradient id="ecl-moon" cx="40%" cy="45%" r="55%">
                <stop offset="0%" stopColor="#3A3A3A" />
                <stop offset="35%" stopColor="#2C2C2C" />
                <stop offset="70%" stopColor="#1F1F1F" />
                <stop offset="100%" stopColor="#1A1A1A" />
              </radialGradient>

              {/* Moon surface texture */}
              <radialGradient id="ecl-moon-highlight" cx="65%" cy="35%" r="30%">
                <stop offset="0%" stopColor="#4A4A4A" stopOpacity="0.3" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>

              {/* Diamond-ring — "crescent gap glows intensely white" */}
              <radialGradient id="ecl-diamond" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
                <stop offset="12%" stopColor="#FFFEF5" stopOpacity="0.85" />
                <stop offset="30%" stopColor="#F8D011" stopOpacity="0.5" />
                <stop offset="55%" stopColor="#F8D011" stopOpacity="0.15" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>

              {/* Sun glow */}
              <filter id="ecl-sun-glow" x="-80%" y="-80%" width="260%" height="260%">
                <feGaussianBlur stdDeviation="9" result="blur1" />
                <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur2" />
                <feMerge>
                  <feMergeNode in="blur1" />
                  <feMergeNode in="blur2" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* Strong ray glow */}
              <filter id="ecl-ray-glow" x="-80%" y="-80%" width="260%" height="260%">
                <feGaussianBlur stdDeviation="6" result="blur1" />
                <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur2" />
                <feMerge>
                  <feMergeNode in="blur1" />
                  <feMergeNode in="blur2" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* Diamond-ring glow filter — intense bloom */}
              <filter id="ecl-diamond-glow" x="-200%" y="-200%" width="500%" height="500%">
                <feGaussianBlur stdDeviation="6" result="blur1" />
                <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur2" />
                <feGaussianBlur in="SourceGraphic" stdDeviation="1" result="blur3" />
                <feMerge>
                  <feMergeNode in="blur1" />
                  <feMergeNode in="blur2" />
                  <feMergeNode in="blur3" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              <clipPath id="ecl-sun-clip">
                <circle cx={CENTER} cy={CENTER} r={SUN_RADIUS} />
              </clipPath>

              {/* Beam severance mask — beams are "cleanly severed" at the moon's edge */}
              <mask id="ecl-beam-mask">
                <rect x="0" y="0" width={CENTER * 2} height={CENTER * 2} fill="white" />
                {anim ? (
                  <motion.circle
                    cx={moonTargetX} cy={CENTER} r={SUN_RADIUS + 4} fill="black"
                    initial={{ cx: CENTER + SUN_RADIUS * 3 }}
                    animate={{ cx: moonTargetX }}
                    transition={{ duration: 1.4, ease: [0.25, 0.1, 0.25, 1], delay: 0.4 }}
                  />
                ) : (
                  <circle cx={moonTargetX} cy={CENTER} r={SUN_RADIUS + 4} fill="black" />
                )}
              </mask>

              {/* CRT scanline pattern */}
              <pattern id="ecl-scanlines" width="4" height="4" patternUnits="userSpaceOnUse">
                <rect width="4" height="2" fill="rgba(0,0,0,0.04)" />
              </pattern>

              {/* Solid outline for SVG labels */}
              <filter id="ecl-text-outline" x="-10%" y="-10%" width="120%" height="120%">
                <feMorphology in="SourceAlpha" operator="dilate" radius="1.2" result="expanded" />
                <feFlood floodColor="#1A1A1A" result="color" />
                <feComposite in="color" in2="expanded" operator="in" result="outline" />
                <feMerge>
                  <feMergeNode in="outline" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Background — "rich warm cosmos that feels like velvet and gold" */}
            <rect x="0" y="0" width={CENTER * 2} height={CENTER * 2} fill="url(#ecl-bg)" rx="16" />
            <rect x="0" y="0" width={CENTER * 2} height={CENTER * 2} fill="url(#ecl-nebula)" rx="16" aria-hidden="true" />
            <rect x="0" y="0" width={CENTER * 2} height={CENTER * 2} fill="url(#ecl-nebula2)" rx="16" aria-hidden="true" />
            <rect x="0" y="0" width={CENTER * 2} height={CENTER * 2} fill="url(#ecl-golden-haze)" rx="16" aria-hidden="true" />
            <rect x="0" y="0" width={CENTER * 2} height={CENTER * 2} fill="url(#ecl-rose-warmth)" rx="16" aria-hidden="true" />
            {anim ? (
              <motion.rect
                x="0" y="0" width={CENTER * 2} height={CENTER * 2}
                fill="url(#ecl-stardust)" rx="16" aria-hidden="true"
                initial={false}
                animate={{ opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
              />
            ) : (
              <rect x="0" y="0" width={CENTER * 2} height={CENTER * 2}
                fill="url(#ecl-stardust)" rx="16" opacity={0.6} aria-hidden="true" />
            )}

            {/* Sparse diverse starfield per v3 */}
            <g aria-hidden="true">
              {stars.map((star, i) =>
                anim ? (
                  <motion.path
                    key={`s-${i}`}
                    d={sparklePath(star.x, star.y, star.r)}
                    fill={star.fill}
                    initial={false}
                    animate={{ opacity: [0.05, star.maxOpacity, 0.05], scale: [0.7, 1.2, 0.7] }}
                    transition={{
                      duration: star.duration,
                      delay: star.delay,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    style={{ transformOrigin: `${star.x}px ${star.y}px` }}
                  />
                ) : (
                  <path key={`s-${i}`}
                    d={sparklePath(star.x, star.y, star.r)}
                    fill={star.fill} opacity={star.maxOpacity * 0.5} />
                )
              )}
            </g>

            {/* Corona haze */}
            {anim ? (
              <motion.circle
                cx={CENTER} cy={CENTER} r={SUN_RADIUS * 2.5}
                fill="url(#ecl-corona)" aria-hidden="true"
                initial={false}
                animate={{ opacity: [0.5 * (1 - coverage * 0.4), 0.95 * (1 - coverage * 0.4), 0.5 * (1 - coverage * 0.4)] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              />
            ) : (
              <circle cx={CENTER} cy={CENTER} r={SUN_RADIUS * 2.5}
                fill="url(#ecl-corona)" opacity={0.7 * (1 - coverage * 0.4)} aria-hidden="true" />
            )}

            {/* Corona rings */}
            {anim ? (
              <motion.circle
                cx={CENTER} cy={CENTER} r={SUN_RADIUS * 1.5}
                fill="none" stroke="#F8D011" strokeWidth={1.5} aria-hidden="true"
                initial={false}
                animate={{ strokeOpacity: [0.1 * (1 - coverage), 0.35 * (1 - coverage), 0.1 * (1 - coverage)] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
              />
            ) : (
              <circle cx={CENTER} cy={CENTER} r={SUN_RADIUS * 1.5}
                fill="none" stroke="#F8D011" strokeWidth={1.5}
                strokeOpacity={0.2 * (1 - coverage)} aria-hidden="true" />
            )}
            <circle
              cx={CENTER} cy={CENTER} r={SUN_RADIUS * 1.25}
              fill="none" stroke="#FFF7CC" strokeWidth={0.8}
              opacity={0.3 * (1 - coverage)}
            />

            {/* Glowing triangular light rays — masked for clean moon severance */}
            <g mask="url(#ecl-beam-mask)">
              {rays.map((ray, i) => {
                const rad = (ray.angle * Math.PI) / 180;
                const perpRad = rad + Math.PI / 2;
                const innerR = SUN_RADIUS + 2;
                const baseX = CENTER + innerR * Math.cos(rad);
                const baseY = CENTER + innerR * Math.sin(rad);
                const tipX = CENTER + ray.length * Math.cos(rad);
                const tipY = CENTER + ray.length * Math.sin(rad);
                const halfW = ray.width * 0.8;
                const triPoints = [
                  `${baseX + Math.cos(perpRad) * halfW},${baseY + Math.sin(perpRad) * halfW}`,
                  `${tipX},${tipY}`,
                  `${baseX - Math.cos(perpRad) * halfW},${baseY - Math.sin(perpRad) * halfW}`,
                ].join(' ');
                return anim ? (
                  <motion.polygon
                    key={`r-${i}`}
                    points={triPoints}
                    fill="#F8D011"
                    filter="url(#ecl-ray-glow)"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.3, 0.85, 0.3] }}
                    transition={{
                      duration: 2 + seededRandom(i + 150) * 1.5,
                      delay: 0.8 + i * 0.1,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />
                ) : (
                  <polygon
                    key={`r-${i}`}
                    points={triPoints}
                    fill="#F8D011"
                    filter="url(#ecl-ray-glow)"
                    opacity={0.6}
                  />
                );
              })}
            </g>

            {/* Sun body */}
            <circle
              cx={CENTER}
              cy={CENTER}
              r={SUN_RADIUS}
              fill="url(#ecl-sun)"
              filter="url(#ecl-sun-glow)"
            />

            {/* Hot center */}
            <circle cx={CENTER - 4} cy={CENTER - 5} r={SUN_RADIUS * 0.22} fill="white" opacity={0.22} />
            <circle cx={CENTER - 8} cy={CENTER - 9} r={SUN_RADIUS * 0.08} fill="white" opacity={0.4} />

            {/* Moon — charcoal #2C2C2C per v3 spec */}
            {anim ? (
              <motion.circle
                cx={moonTargetX} cy={CENTER} r={SUN_RADIUS + 2}
                fill="url(#ecl-moon)" clipPath="url(#ecl-sun-clip)"
                initial={{ cx: CENTER + SUN_RADIUS * 3 }}
                animate={{ cx: moonTargetX }}
                transition={{ duration: 1.4, ease: [0.25, 0.1, 0.25, 1], delay: 0.4 }}
              />
            ) : (
              <circle cx={moonTargetX} cy={CENTER} r={SUN_RADIUS + 2}
                fill="url(#ecl-moon)" clipPath="url(#ecl-sun-clip)" />
            )}
            {/* Moon surface highlight for depth */}
            {anim ? (
              <motion.circle
                cx={moonTargetX + 8} cy={CENTER - 6} r={SUN_RADIUS * 0.6}
                fill="url(#ecl-moon-highlight)" clipPath="url(#ecl-sun-clip)"
                initial={{ cx: CENTER + SUN_RADIUS * 3 + 8 }}
                animate={{ cx: moonTargetX + 8 }}
                transition={{ duration: 1.4, ease: [0.25, 0.1, 0.25, 1], delay: 0.4 }}
              />
            ) : (
              <circle cx={moonTargetX + 8} cy={CENTER - 6} r={SUN_RADIUS * 0.6}
                fill="url(#ecl-moon-highlight)" clipPath="url(#ecl-sun-clip)" />
            )}
            {/* Moon crater accents — gray tones */}
            {anim ? (
              <motion.circle
                cx={moonTargetX + 12} cy={CENTER + 8} r={4}
                fill="#3A3A3A" opacity={0.3} clipPath="url(#ecl-sun-clip)"
                initial={{ cx: CENTER + SUN_RADIUS * 3 + 12 }}
                animate={{ cx: moonTargetX + 12 }}
                transition={{ duration: 1.4, ease: [0.25, 0.1, 0.25, 1], delay: 0.4 }}
              />
            ) : (
              <circle cx={moonTargetX + 12} cy={CENTER + 8} r={4}
                fill="#3A3A3A" opacity={0.3} clipPath="url(#ecl-sun-clip)" />
            )}
            {anim ? (
              <motion.circle
                cx={moonTargetX - 4} cy={CENTER - 12} r={3}
                fill="#444444" opacity={0.25} clipPath="url(#ecl-sun-clip)"
                initial={{ cx: CENTER + SUN_RADIUS * 3 - 4 }}
                animate={{ cx: moonTargetX - 4 }}
                transition={{ duration: 1.4, ease: [0.25, 0.1, 0.25, 1], delay: 0.4 }}
              />
            ) : (
              <circle cx={moonTargetX - 4} cy={CENTER - 12} r={3}
                fill="#444444" opacity={0.25} clipPath="url(#ecl-sun-clip)" />
            )}
            {/* Moon edge — thin white outline per v3 spec */}
            {anim ? (
              <motion.circle
                cx={moonTargetX} cy={CENTER} r={SUN_RADIUS + 1}
                fill="none" stroke="#FDFCFD" strokeWidth={1.2}
                clipPath="url(#ecl-sun-clip)" opacity={0.5}
                initial={{ cx: CENTER + SUN_RADIUS * 3 }}
                animate={{ cx: moonTargetX }}
                transition={{ duration: 1.4, ease: [0.25, 0.1, 0.25, 1], delay: 0.4 }}
              />
            ) : (
              <circle cx={moonTargetX} cy={CENTER} r={SUN_RADIUS + 1}
                fill="none" stroke="#FDFCFD" strokeWidth={1.2}
                clipPath="url(#ecl-sun-clip)" opacity={0.5} />
            )}

            {/* Diamond-ring effect — "crescent gap between moon edge and sun edge
                glows intensely white — a diamond-ring effect" per v3 spec */}
            {coverage > 0.15 && (
              <>
                {/* Outer diamond halo — large diffuse glow */}
                {anim ? (
                  <motion.circle
                    cx={moonTargetX - (SUN_RADIUS + 2)} cy={CENTER}
                    r={10 + coverage * 16} fill="url(#ecl-diamond)"
                    filter="url(#ecl-diamond-glow)" clipPath="url(#ecl-sun-clip)"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.3 + coverage * 0.5, 0.7 + coverage * 0.3, 0.3 + coverage * 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 1.6 }}
                  />
                ) : (
                  <circle cx={moonTargetX - (SUN_RADIUS + 2)} cy={CENTER}
                    r={10 + coverage * 16} fill="url(#ecl-diamond)"
                    filter="url(#ecl-diamond-glow)" clipPath="url(#ecl-sun-clip)"
                    opacity={0.5 + coverage * 0.4} />
                )}
                {/* Inner diamond bright point — intense white */}
                {anim ? (
                  <motion.circle
                    cx={moonTargetX - (SUN_RADIUS + 2)} cy={CENTER}
                    r={2 + coverage * 5} fill="#FFFFFF" clipPath="url(#ecl-sun-clip)"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.5 + coverage * 0.3, 0.95, 0.5 + coverage * 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 1.8 }}
                  />
                ) : (
                  <circle cx={moonTargetX - (SUN_RADIUS + 2)} cy={CENTER}
                    r={2 + coverage * 5} fill="#FFFFFF" clipPath="url(#ecl-sun-clip)"
                    opacity={0.7 + coverage * 0.2} />
                )}
              </>
            )}

            {/* Corona crescent around moon edge */}
            {coverage > 0.3 && (
              anim ? (
                <motion.circle
                  cx={moonTargetX - 1} cy={CENTER} r={SUN_RADIUS + 3}
                  fill="none" stroke="#F8D011" strokeWidth={2.5}
                  clipPath="url(#ecl-sun-clip)"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0.12, 0.3, 0.12] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
                />
              ) : (
                <circle cx={moonTargetX - 1} cy={CENTER} r={SUN_RADIUS + 3}
                  fill="none" stroke="#F8D011" strokeWidth={2.5}
                  clipPath="url(#ecl-sun-clip)" opacity={0.2} />
              )
            )}

            {/* Level indicator arc */}
            <circle
              cx={CENTER} cy={CENTER} r={SUN_RADIUS + 36}
              fill="none" stroke={levelColor} strokeWidth={2}
              strokeDasharray="3 8" opacity={0.35}
            />

            {/* CRT scanline overlay */}
            <rect x="0" y="0" width={CENTER * 2} height={CENTER * 2} rx="16" fill="url(#ecl-scanlines)" opacity={0.4} />

            {/* Level label — Orelega One, all caps */}
            <text
              x={CENTER}
              y={CENTER + SUN_RADIUS + 52}
              textAnchor="middle"
              dominantBaseline="central"
              fill={levelColor}
              filter="url(#ecl-text-outline)"
              style={{
                fontSize: '12px',
                fontWeight: 400,
                fontFamily: 'var(--font-cosmic-display), serif',
                letterSpacing: '0.12em',
                textTransform: 'uppercase' as const,
              }}
            >
              {LEVEL_LABELS[eclipse.level] ?? 'MODERATE LOAD'}
            </text>
          </svg>
        </div>

        {/* Eclipse Level Legend */}
        <div
          className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 px-4 py-2.5 text-[10px]"
          style={{ background: 'rgba(11, 2, 18, 0.6)' }}
          aria-label="Eclipse level scale"
        >
          {(['LOW', 'MODERATE', 'ELEVATED', 'HIGH'] as const).map((lvl) => (
            <span key={lvl} className="flex items-center gap-1.5">
              <span
                className="inline-block h-2 w-2 rounded-full"
                style={{
                  background: LEVEL_COLORS[lvl],
                  boxShadow: eclipse.level === lvl ? `0 0 6px ${LEVEL_COLORS[lvl]}` : 'none',
                }}
              />
              <span style={{
                color: eclipse.level === lvl ? LEVEL_COLORS[lvl] : 'var(--text-on-dark-muted, rgba(255,255,255,0.40))',
                fontWeight: eclipse.level === lvl ? 600 : 400,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}>
                {lvl}
              </span>
            </span>
          ))}
        </div>

        {/* Data section — glass metric chips */}
        <div className="p-5 space-y-4 rounded-b-2xl" style={{ background: 'var(--surface-glass, rgba(255,255,255,0.06))' }}>
          <p className="text-sm text-center" style={{ color: 'var(--text-on-dark-secondary, #FDFCFD)' }}>{encouragement}</p>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => toggleMetric('recovery_access')}
              aria-expanded={expandedMetric === 'recovery_access'}
              aria-label={`Recovery Access: ${eclipse.derived_metrics.recovery_access}%. Tap to ${expandedMetric === 'recovery_access' ? 'collapse' : 'expand'} details.`}
              className="metric-chip cosmic-focus-target active:scale-95 transition-transform"
            >
              <span className="metric-chip__value">
                {eclipse.derived_metrics.recovery_access}%
              </span>
              <span className="metric-chip__label">Recovery Access</span>
            </button>
            <button
              type="button"
              onClick={() => toggleMetric('load_pressure')}
              aria-expanded={expandedMetric === 'load_pressure'}
              aria-label={`Load Pressure: ${eclipse.derived_metrics.load_pressure}%. Tap to ${expandedMetric === 'load_pressure' ? 'collapse' : 'expand'} details.`}
              className="metric-chip cosmic-focus-target active:scale-95 transition-transform"
            >
              <span className="metric-chip__value">
                {eclipse.derived_metrics.load_pressure}%
              </span>
              <span className="metric-chip__label">Load Pressure</span>
            </button>
          </div>

          {/* Expandable detail panel */}
          <AnimatePresence>
            {expandedMetric && METRIC_DETAILS[expandedMetric] && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <div className="p-4 rounded-lg" style={{ background: 'var(--surface-glass, rgba(255,255,255,0.06))', border: '1px solid var(--surface-border, rgba(255,255,255,0.10))' }}>
                  <p className="text-sm font-bold" style={{ color: 'var(--brand-gold, #F8D011)' }}>
                    {METRIC_DETAILS[expandedMetric].title}
                  </p>
                  <p className="text-sm mt-1" style={{ color: 'var(--text-on-dark-secondary, rgba(255,255,255,0.60))' }}>
                    {METRIC_DETAILS[expandedMetric].description}
                  </p>
                  {expandedMetric === 'recovery_access' && (
                    <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                      <div>
                        <p className="text-xs font-semibold" style={{ color: 'var(--text-on-dark-muted, rgba(255,255,255,0.40))' }}>Emotional</p>
                        <p className="text-sm font-bold" style={{ color: 'var(--text-on-dark, rgba(255,255,255,0.92))' }}>{eclipse.dimensions.emotional_load.score}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold" style={{ color: 'var(--text-on-dark-muted, rgba(255,255,255,0.40))' }}>Cognitive</p>
                        <p className="text-sm font-bold" style={{ color: 'var(--text-on-dark, rgba(255,255,255,0.92))' }}>{eclipse.dimensions.cognitive_load.score}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold" style={{ color: 'var(--text-on-dark-muted, rgba(255,255,255,0.40))' }}>Relational</p>
                        <p className="text-sm font-bold" style={{ color: 'var(--text-on-dark, rgba(255,255,255,0.92))' }}>{eclipse.dimensions.relational_load.score}</p>
                      </div>
                    </div>
                  )}
                  {expandedMetric === 'load_pressure' && (
                    <div className="mt-3 grid grid-cols-2 gap-2 text-center">
                      <div>
                        <p className="text-xs font-semibold" style={{ color: 'var(--text-on-dark-muted, rgba(255,255,255,0.40))' }}>Energy Ratio</p>
                        <p className="text-sm font-bold" style={{ color: 'var(--text-on-dark, rgba(255,255,255,0.92))' }}>{eclipse.derived_metrics.eer}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold" style={{ color: 'var(--text-on-dark-muted, rgba(255,255,255,0.40))' }}>Load Signal Count</p>
                        <p className="text-sm font-bold" style={{ color: 'var(--text-on-dark, rgba(255,255,255,0.92))' }}>{eclipse.derived_metrics.bri}</p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="pt-4" style={{ borderTop: '1px solid var(--surface-border, rgba(255,255,255,0.10))' }}>
            <p className="text-sm" style={{ color: 'var(--text-on-dark-secondary, rgba(255,255,255,0.60))' }}>{gateLabel}</p>
            {gateExplanation && (
              <p className="text-xs mt-2" style={{ color: 'var(--text-on-dark-muted, rgba(255,255,255,0.42))' }}>{gateExplanation}</p>
            )}
          </div>

          {/* Expandable "What This Means" section */}
          <div className="pt-4" style={{ borderTop: '1px solid var(--surface-border, rgba(255,255,255,0.10))' }}>
            <button
              type="button"
              onClick={() => setShowExplanation(!showExplanation)}
              aria-expanded={showExplanation}
              className="flex items-center gap-2 text-sm font-medium w-full text-left cosmic-focus-target transition-colors"
              style={{ color: 'var(--brand-gold, #F8D011)' }}
            >
              <span
                className="inline-block transition-transform"
                style={{ transform: showExplanation ? 'rotate(90deg)' : 'rotate(0deg)' }}
                aria-hidden="true"
              >
                &#9654;
              </span>
              What this means — science, real life, and what to do next
            </button>

            <AnimatePresence>
              {showExplanation && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="space-y-5 mt-4">
                    {/* Science */}
                    <div>
                      <p className="text-xs uppercase tracking-wider font-semibold mb-2" style={{ color: 'var(--brand-gold, #F8D011)' }}>
                        The Science
                      </p>
                      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary, rgba(255,255,255,0.70))' }}>
                        {explanation.science}
                      </p>
                    </div>

                    {/* Real Life Examples */}
                    <div>
                      <p className="text-xs uppercase tracking-wider font-semibold mb-2" style={{ color: 'var(--brand-gold, #F8D011)' }}>
                        What This Might Look Like
                      </p>
                      <ul className="space-y-2">
                        {explanation.realLife.map((example, i) => (
                          <li key={i} className="flex gap-2.5 text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary, rgba(255,255,255,0.70))' }}>
                            <span className="mt-0.5 shrink-0" style={{ color: 'var(--text-on-dark-muted, rgba(255,255,255,0.42))' }}>&#9679;</span>
                            {example}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Coaching Interventions */}
                    <div>
                      <p className="text-xs uppercase tracking-wider font-semibold mb-2" style={{ color: 'var(--brand-gold, #F8D011)' }}>
                        Where to Start
                      </p>
                      <ul className="space-y-2">
                        {explanation.coaching.map((step, i) => (
                          <li key={i} className="flex gap-2.5 text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary, rgba(255,255,255,0.70))' }}>
                            <span className="font-bold shrink-0" style={{ color: 'var(--brand-gold, #F8D011)' }}>{i + 1}.</span>
                            {step}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
