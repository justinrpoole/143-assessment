'use client';

import { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import SunCore from './SunCore';
import CosmicRing from './CosmicRing';
import { RAY_NAMES, RAY_SHORT_NAMES, RAY_VERBS } from '@/lib/types';
import { getRayExplanation, getModifierLabel, getPhaseExplanation } from '@/lib/cosmic-copy';
import { rayHex } from '@/lib/ui/ray-colors';

/* ── Types ── */

interface RayData {
  score: number;
  net_energy?: number;
  access_score?: number;
  eclipse_score?: number;
  eclipse_modifier: string;
}

interface SolarCoreScoreProps {
  rays: Record<string, RayData>;
  topTwo: string[];
  bottomRay: string;
  /** Eclipse load percentage (0-100). Renders a shadow arc overlay. */
  loadPercent?: number;
  /** Percentile ranks per ray (0-100). Shown in detail panel when available. */
  percentiles?: Record<string, number>;
  /** Analytics: fires when a ray is hovered or keyboard-focused */
  onRayHovered?: (rayId: string | null) => void;
  /** Analytics: fires when a ray is clicked or Enter-selected */
  onRaySelected?: (rayId: string | null) => void;
}

/* ── Constants ── */

const CENTER = 220;
const SUN_RADIUS = 42;
const BEAM_START = 62;
const BEAM_END_MIN = 100;
const BEAM_END_MAX = 175;
const BEAM_WIDTH_MIN = 8;
const BEAM_WIDTH_MAX = 28;
const STAR_COUNT = 45;

const RAY_PHASE: Record<string, string> = {
  R1: 'Reconnect', R2: 'Reconnect', R3: 'Reconnect',
  R4: 'Radiate', R5: 'Radiate', R6: 'Radiate',
  R7: 'Become', R8: 'Become', R9: 'Become',
};

/* ── Utilities ── */

function scoreToLength(score: number): number {
  return BEAM_END_MIN + ((score / 100) * (BEAM_END_MAX - BEAM_END_MIN));
}

function scoreToWidth(score: number): number {
  return BEAM_WIDTH_MIN + ((score / 100) * (BEAM_WIDTH_MAX - BEAM_WIDTH_MIN));
}

function getBeamAngle(index: number): number {
  return (index * 40) - 90;
}

function polarToXY(cx: number, cy: number, radius: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
}

function seededRandom(seed: number): number {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

/** SVG arc path for eclipse load overlay. Sweeps clockwise from bottom. */
function eclipseArcPath(cx: number, cy: number, r: number, percent: number): string {
  if (percent <= 0) return '';
  if (percent >= 100) return `M${cx - r},${cy} A${r},${r} 0 1,1 ${cx + r},${cy} A${r},${r} 0 1,1 ${cx - r},${cy} Z`;
  const angleDeg = (percent / 100) * 360;
  const startAngle = 90; // start from bottom (6 o'clock)
  const endAngle = startAngle + angleDeg;
  const startRad = (startAngle * Math.PI) / 180;
  const endRad = (endAngle * Math.PI) / 180;
  const x1 = cx + r * Math.cos(startRad);
  const y1 = cy + r * Math.sin(startRad);
  const x2 = cx + r * Math.cos(endRad);
  const y2 = cy + r * Math.sin(endRad);
  const largeArc = angleDeg > 180 ? 1 : 0;
  return `M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${largeArc},1 ${x2},${y2} Z`;
}

function sparklePath(cx: number, cy: number, size: number): string {
  const outer = size;
  const inner = size * 0.25;
  return [
    `M${cx},${cy - outer}`, `L${cx + inner},${cy - inner}`,
    `L${cx + outer},${cy}`, `L${cx + inner},${cy + inner}`,
    `L${cx},${cy + outer}`, `L${cx - inner},${cy + inner}`,
    `L${cx - outer},${cy}`, `L${cx - inner},${cy - inner}`, 'Z',
  ].join(' ');
}

/* ── Component ── */

/**
 * Solar Core Score — Gravitational Stability Report visualization.
 *
 * Accessibility: keyboard nav (arrow keys cycle, Enter selects, Escape closes),
 * aria-live announcements, focus indicators, reduced motion support.
 *
 * Analytics: onRayHovered / onRaySelected callbacks.
 *
 * Detail panel: click or Enter a ray to open bottom-sheet with full info.
 */
export default function SolarCoreScore({
  rays, topTwo, bottomRay, loadPercent = 0, percentiles, onRayHovered, onRaySelected,
}: SolarCoreScoreProps) {
  const [hoveredRay, setHoveredRay] = useState<string | null>(null);
  const [selectedRay, setSelectedRay] = useState<string | null>(null);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const [showRayInsight, setShowRayInsight] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const rayOrder = useMemo(() =>
    Object.entries(rays).sort(([a], [b]) =>
      Number(a.replace('R', '')) - Number(b.replace('R', ''))
    ),
    [rays]
  );

  // Star diversity per v3: white, gold, rose
  const stars = useMemo(() =>
    Array.from({ length: STAR_COUNT }, (_, i) => {
      const roll = seededRandom(i + 500);
      const fill = roll < 0.06 ? '#C39BD3' : roll < 0.22 ? '#F8D011' : '#FDFCFD';
      const maxOpacity = roll < 0.06 ? 0.4 : roll < 0.22 ? 0.6 : 0.85;
      return {
        x: seededRandom(i) * CENTER * 2,
        y: seededRandom(i + 100) * CENTER * 2,
        r: 0.5 + seededRandom(i + 200) * 1.8,
        delay: seededRandom(i + 300) * 3,
        duration: 1.2 + seededRandom(i + 400) * 2,
        fill, maxOpacity,
      };
    }), []
  );

  /* ── Keyboard Navigation ── */

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    const count = rayOrder.length;
    if (!count) return;

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex(prev => (prev < 0 ? 0 : (prev + 1) % count));
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex(prev => (prev < 0 ? count - 1 : (prev - 1 + count) % count));
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (focusedIndex >= 0 && rayOrder[focusedIndex]) {
          const id = rayOrder[focusedIndex][0];
          const next = selectedRay === id ? null : id;
          setSelectedRay(next);
          onRaySelected?.(next);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setSelectedRay(null);
        setFocusedIndex(-1);
        onRaySelected?.(null);
        break;
    }
  }, [focusedIndex, rayOrder, selectedRay, onRaySelected]);

  const handleSvgFocus = useCallback(() => {
    if (focusedIndex < 0) setFocusedIndex(0);
  }, [focusedIndex]);

  const handleSvgBlur = useCallback(() => {
    // Delay to check if focus moved to detail panel
    setTimeout(() => {
      const active = document.activeElement;
      if (!svgRef.current?.contains(active) && !panelRef.current?.contains(active)) {
        setFocusedIndex(-1);
        setHoveredRay(null);
      }
    }, 10);
  }, []);

  // Sync hover state with keyboard focus
  useEffect(() => {
    if (focusedIndex >= 0 && rayOrder[focusedIndex]) {
      const id = rayOrder[focusedIndex][0];
      queueMicrotask(() => {
        setHoveredRay(id);
        onRayHovered?.(id);
      });
    }
  }, [focusedIndex, rayOrder, onRayHovered]);

  /* ── Parallax pointer tracking ── */
  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (prefersReducedMotion) return;
    const el = wrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;  // -1..1
    const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setParallax({ x: nx * 4, y: ny * 4 }); // max 4px shift
  }, [prefersReducedMotion]);

  const handlePointerLeave = useCallback(() => {
    setParallax({ x: 0, y: 0 });
  }, []);

  /* ── Interaction Handlers ── */

  const handleRayHover = useCallback((id: string | null) => {
    setHoveredRay(id);
    onRayHovered?.(id);
  }, [onRayHovered]);

  const handleRayClick = useCallback((id: string) => {
    const next = selectedRay === id ? null : id;
    setSelectedRay(next);
    onRaySelected?.(next);
    // Also set focused index for keyboard continuity
    const idx = rayOrder.findIndex(([rid]) => rid === id);
    if (idx >= 0) setFocusedIndex(idx);
  }, [selectedRay, rayOrder, onRaySelected]);

  /* ── Render Helpers ── */

  const anim = !prefersReducedMotion;
  const viewBox = `0 0 ${CENTER * 2} ${CENTER * 2}`;

  // Snap-to-top: rotate wheel so selected ray points at 12 o'clock
  const wheelRotation = useMemo(() => {
    if (!selectedRay) return 0;
    const idx = rayOrder.findIndex(([id]) => id === selectedRay);
    if (idx < 0) return 0;
    return -(idx * 40); // each ray is 40° apart, negative to rotate to top
  }, [selectedRay, rayOrder]);

  // Live region text for screen readers
  const liveText = focusedIndex >= 0 && rayOrder[focusedIndex]
    ? `${RAY_NAMES[rayOrder[focusedIndex][0]]}: ${Math.round(rayOrder[focusedIndex][1].net_energy ?? rayOrder[focusedIndex][1].score)} percent`
    : '';

  return (
    <section className="space-y-4" aria-label="Gravitational Stability — Nine-Ray Capacity Map">
      <p className="text-sm" style={{ color: 'var(--text-on-dark-secondary)' }}>
        Your gravitational stability map — each beam represents a ray&apos;s current energy level. Use arrow keys to explore, Enter to select.
      </p>

      {/* Screen reader live region */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">{liveText}</div>

      <div
        ref={wrapRef}
        className="relative rounded-2xl overflow-hidden shadow-lg"
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
      >
        <svg
          ref={svgRef}
          viewBox={viewBox}
          className="w-full max-w-[540px] mx-auto block cosmic-focus-target"
          tabIndex={0}
          role="application"
          aria-roledescription="interactive radial chart"
          aria-labelledby="scs-title scs-desc"
          onKeyDown={handleKeyDown}
          onFocus={handleSvgFocus}
          onBlur={handleSvgBlur}
        >
          {/* Accessible title + description */}
          <title id="scs-title">Gravitational Stability — Nine-Ray Capacity Map</title>
          <desc id="scs-desc">
            Radial visualization of nine ray capacities. Each beam length represents energy level.
            {topTwo.length === 2 && ` Primary rays: ${RAY_NAMES[topTwo[0]]} and ${RAY_NAMES[topTwo[1]]}.`}
            {bottomRay && ` Train next: ${RAY_NAMES[bottomRay]}.`}
          </desc>

          <defs>
            {/* Deep space background — matches vintage 80s instrument aesthetic */}
            <radialGradient id="scs-bg" cx="50%" cy="48%" r="65%">
              <stop offset="0%" stopColor="#1a0a35" />
              <stop offset="30%" stopColor="#0f0520" />
              <stop offset="60%" stopColor="#0a0318" />
              <stop offset="85%" stopColor="#060212" />
              <stop offset="100%" stopColor="#030108" />
            </radialGradient>
            <radialGradient id="scs-golden-haze" cx="50%" cy="50%" r="45%">
              <stop offset="0%" stopColor="#F8D011" stopOpacity="0.08" />
              <stop offset="50%" stopColor="#F8D011" stopOpacity="0.03" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
            <radialGradient id="scs-rose-warmth" cx="50%" cy="50%" r="32%">
              <stop offset="40%" stopColor="transparent" />
              <stop offset="65%" stopColor="#C39BD3" stopOpacity="0.1" />
              <stop offset="85%" stopColor="#C39BD3" stopOpacity="0.04" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
            <radialGradient id="scs-nebula" cx="30%" cy="35%" r="55%">
              <stop offset="0%" stopColor="#7B4FA2" stopOpacity="0.25" />
              <stop offset="50%" stopColor="var(--cosmic-svg-bg)" stopOpacity="0.1" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
            <radialGradient id="scs-nebula2" cx="75%" cy="70%" r="40%">
              <stop offset="0%" stopColor="#F8D011" stopOpacity="0.05" />
              <stop offset="40%" stopColor="#C39BD3" stopOpacity="0.04" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
            <radialGradient id="scs-stardust" cx="55%" cy="25%" r="40%">
              <stop offset="0%" stopColor="#F8D011" stopOpacity="0.06" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>

            <filter id="scs-beam-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="scs-top-glow" x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation="8" result="blur1" />
              <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur2" />
              <feMerge><feMergeNode in="blur1" /><feMergeNode in="blur2" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="scs-hover-glow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="10" result="blur1" />
              <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur2" />
              <feMerge><feMergeNode in="blur1" /><feMergeNode in="blur2" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="scs-amp-glow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>

            {/* Ray-specific gradients — each beam tints toward its ray color */}
            {rayOrder.map(([id], index) => {
              const angle = getBeamAngle(index);
              const rad = (angle * Math.PI) / 180;
              const rc = rayHex(id);
              const isTop = topTwo.includes(id);
              return (
                <linearGradient key={`grad-${id}`} id={`scs-grad-${id}`}
                  x1={CENTER + BEAM_START * Math.cos(rad)} y1={CENTER + BEAM_START * Math.sin(rad)}
                  x2={CENTER + BEAM_END_MAX * Math.cos(rad)} y2={CENTER + BEAM_END_MAX * Math.sin(rad)}
                  gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor={isTop ? rc : '#F8D011'} />
                  <stop offset="60%" stopColor={isTop ? rc : rc} stopOpacity={isTop ? 0.8 : 0.5} />
                  <stop offset="100%" stopColor="#FFFEF5" stopOpacity={0.6} />
                </linearGradient>
              );
            })}

            {/* CRT scanline pattern */}
            <pattern id="scs-scanlines" width="4" height="4" patternUnits="userSpaceOnUse">
              <rect width="4" height="2" fill="rgba(0,0,0,0.04)" />
            </pattern>

            <filter id="scs-text-outline" x="-10%" y="-10%" width="120%" height="120%">
              <feMorphology in="SourceAlpha" operator="dilate" radius="1.2" result="expanded" />
              <feFlood floodColor="#1A1A1A" result="color" />
              <feComposite in="color" in2="expanded" operator="in" result="outline" />
              <feMerge><feMergeNode in="outline" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {/* Background layers */}
          <rect x="0" y="0" width={CENTER * 2} height={CENTER * 2} fill="url(#scs-bg)" rx="16" />
          <rect x="0" y="0" width={CENTER * 2} height={CENTER * 2} fill="url(#scs-nebula)" rx="16" aria-hidden="true" />
          <rect x="0" y="0" width={CENTER * 2} height={CENTER * 2} fill="url(#scs-nebula2)" rx="16" aria-hidden="true" />
          <rect x="0" y="0" width={CENTER * 2} height={CENTER * 2} fill="url(#scs-golden-haze)" rx="16" aria-hidden="true" />
          <rect x="0" y="0" width={CENTER * 2} height={CENTER * 2} fill="url(#scs-rose-warmth)" rx="16" aria-hidden="true" />
          {anim && (
            <motion.rect x="0" y="0" width={CENTER * 2} height={CENTER * 2}
              fill="url(#scs-stardust)" rx="16" aria-hidden="true"
              initial={false} animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }} />
          )}

          {/* Starfield — parallax layer */}
          <g aria-hidden="true" style={{ transform: `translate(${parallax.x}px, ${parallax.y}px)`, transition: 'transform 0.3s ease-out' }}>
            {stars.map((star, i) =>
              anim ? (
                <motion.path key={`star-${i}`} d={sparklePath(star.x, star.y, star.r)} fill={star.fill}
                  initial={false} animate={{ opacity: [0.05, star.maxOpacity, 0.05], scale: [0.7, 1.2, 0.7] }}
                  transition={{ duration: star.duration, delay: star.delay, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ transformOrigin: `${star.x}px ${star.y}px` }} />
              ) : (
                <path key={`star-${i}`} d={sparklePath(star.x, star.y, star.r)}
                  fill={star.fill} opacity={star.maxOpacity * 0.5} />
              )
            )}
          </g>

          {/* Rotatable group — snaps selected ray to 12 o'clock */}
          <motion.g
            initial={false}
            animate={{ rotate: wheelRotation }}
            transition={anim ? { type: 'spring', stiffness: 60, damping: 18 } : { duration: 0 }}
            style={{ transformOrigin: `${CENTER}px ${CENTER}px` }}
          >

          {/* ── Star chart elements ── */}

          {/* Concentric orbit rings — evokes celestial chart */}
          <circle cx={CENTER} cy={CENTER} r={BEAM_END_MIN} fill="none" stroke="rgba(253, 252, 253, 0.06)" strokeWidth={0.5} />
          <circle cx={CENTER} cy={CENTER} r={(BEAM_END_MIN + BEAM_END_MAX) / 2} fill="none" stroke="rgba(253, 252, 253, 0.04)" strokeWidth={0.5} />
          <CosmicRing cx={CENTER} cy={CENTER} radius={BEAM_END_MAX + 18} smoothness={0.7} opacity={0.12} color="#FDFCFD" />
          <circle cx={CENTER} cy={CENTER} r={BEAM_END_MAX + 18} fill="none" stroke="rgba(253, 252, 253, 0.1)" strokeWidth={0.8} />

          {/* 9 sector dividing lines — like house cusps */}
          {Array.from({ length: 9 }, (_, i) => {
            const angle = getBeamAngle(i) + 20; // offset to sit between rays
            const innerR = BEAM_START - 5;
            const outerR = BEAM_END_MAX + 25;
            const rad = (angle * Math.PI) / 180;
            return (
              <line key={`sector-${i}`}
                x1={CENTER + innerR * Math.cos(rad)} y1={CENTER + innerR * Math.sin(rad)}
                x2={CENTER + outerR * Math.cos(rad)} y2={CENTER + outerR * Math.sin(rad)}
                stroke="rgba(253, 252, 253, 0.06)" strokeWidth={0.5}
                strokeDasharray="2 4" aria-hidden="true" />
            );
          })}

          {/* Degree tick marks — fine marks around outer ring */}
          {Array.from({ length: 36 }, (_, i) => {
            const angle = i * 10 - 90;
            const isMajor = i % 4 === 0;
            const outerR = BEAM_END_MAX + 18;
            const innerR = outerR - (isMajor ? 6 : 3);
            const rad = (angle * Math.PI) / 180;
            return (
              <line key={`tick-${i}`}
                x1={CENTER + innerR * Math.cos(rad)} y1={CENTER + innerR * Math.sin(rad)}
                x2={CENTER + outerR * Math.cos(rad)} y2={CENTER + outerR * Math.sin(rad)}
                stroke={isMajor ? 'rgba(248, 208, 17, 0.25)' : 'rgba(253, 252, 253, 0.1)'}
                strokeWidth={isMajor ? 1 : 0.5} aria-hidden="true" />
            );
          })}

          {/* Cardinal cross — subtle axis lines */}
          {[0, 90, 180, 270].map((angle) => {
            const rad = ((angle - 90) * Math.PI) / 180;
            return (
              <line key={`axis-${angle}`}
                x1={CENTER + 55 * Math.cos(rad)} y1={CENTER + 55 * Math.sin(rad)}
                x2={CENTER + (BEAM_END_MAX + 25) * Math.cos(rad)} y2={CENTER + (BEAM_END_MAX + 25) * Math.sin(rad)}
                stroke="rgba(248, 208, 17, 0.08)" strokeWidth={0.5} aria-hidden="true" />
            );
          })}

          {/* Inner golden ring — chart border */}
          <CosmicRing cx={CENTER} cy={CENTER} radius={BEAM_END_MIN} smoothness={1} opacity={0.1} color="#F8D011" />

          {/* ── BEAMS ── */}
          {rayOrder.map(([id, ray], index) => {
            const isTop = topTwo.includes(id);
            const isBottom = id === bottomRay;
            const isAmplified = ray.eclipse_modifier === 'AMPLIFIED';
            const isHovered = hoveredRay === id;
            const isFocused = focusedIndex === index;
            const isActive = isHovered || isFocused;
            const displayScore = ray.net_energy ?? ray.score;
            const angle = getBeamAngle(index);
            const length = scoreToLength(displayScore);
            const widthAtBase = scoreToWidth(displayScore);
            const start = polarToXY(CENTER, CENTER, BEAM_START, angle);
            const end = polarToXY(CENTER, CENTER, length, angle);
            const perpRad = ((angle + 90) * Math.PI) / 180;
            const dx = Math.cos(perpRad);
            const dy = Math.sin(perpRad);

            const poly = [
              `${start.x + dx * widthAtBase / 2},${start.y + dy * widthAtBase / 2}`,
              `${end.x},${end.y}`,
              `${start.x - dx * widthAtBase / 2},${start.y - dy * widthAtBase / 2}`,
            ].join(' ');

            let fill: string;
            if (isAmplified) fill = 'var(--cosmic-svg-bg)';
            else if (isTop) fill = `url(#scs-grad-${id})`;
            else if (isBottom) fill = `url(#scs-grad-${id})`;
            else fill = `url(#scs-grad-${id})`;

            const beamFilter = isActive ? 'url(#scs-hover-glow)'
              : isAmplified ? 'url(#scs-amp-glow)'
              : isTop ? 'url(#scs-top-glow)' : 'url(#scs-beam-glow)';

            const targetOpacity = isActive ? 1 : isBottom ? 0.55 : 0.9;

            const labelPos = polarToXY(CENTER, CENTER, length + 20, angle);
            const adjustedAngle = (angle + 360) % 360;
            const isLeftSide = adjustedAngle > 90 && adjustedAngle < 270;

            return (
              <g key={id}
                role="button"
                aria-label={`${RAY_NAMES[id]}: ${Math.round(displayScore)} percent${isTop ? ', Power Source' : ''}${isBottom ? ', Train Next' : ''}${isAmplified ? ', Load Amplified' : ''}`}
                onMouseEnter={() => handleRayHover(id)}
                onMouseLeave={() => handleRayHover(null)}
                onClick={() => handleRayClick(id)}
                onTouchStart={() => handleRayClick(id)}
                className="cursor-pointer"
              >
                {/* Amplified outer pulse */}
                {isAmplified && anim && (
                  <motion.polygon points={poly} fill="rgba(74, 14, 120, 0.35)" filter="url(#scs-amp-glow)"
                    initial={false} animate={{ opacity: [0.2, 0.5, 0.2] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }} />
                )}

                {/* Glow halo */}
                <motion.line x1={start.x} y1={start.y} x2={end.x} y2={end.y}
                  stroke={isAmplified ? 'var(--cosmic-svg-bg)' : 'var(--brand-gold)'}
                  strokeWidth={widthAtBase + (isActive ? 14 : 8)}
                  strokeLinecap="round"
                  strokeOpacity={isActive ? 0.25 : isTop ? 0.14 : 0.07}
                  filter="url(#scs-beam-glow)"
                  initial={anim ? { x2: start.x, y2: start.y } : false}
                  animate={{ x2: end.x, y2: end.y }}
                  transition={anim ? { duration: 0.9, delay: index * 0.06, ease: 'easeOut' } : { duration: 0 }} />

                {/* Main beam */}
                <motion.polygon points={poly} fill={fill} filter={beamFilter}
                  stroke={isActive ? '#F8D011' : 'none'} strokeWidth={isActive ? 1.5 : 0}
                  initial={anim ? { opacity: 0 } : { opacity: targetOpacity }}
                  animate={{ opacity: targetOpacity }}
                  transition={{ duration: anim ? 0.2 : 0 }} />

                {/* Beam tip */}
                <motion.circle cx={end.x} cy={end.y}
                  r={isActive ? 5 : isTop ? 3.5 : 2}
                  fill={isAmplified ? '#7B4FA2' : '#FFFEF5'}
                  opacity={isActive ? 1 : 0.8}
                  filter={isActive ? 'url(#scs-hover-glow)' : 'url(#scs-beam-glow)'}
                  initial={anim ? { r: 0 } : false}
                  animate={{ r: isActive ? 5 : isTop ? 3.5 : 2 }}
                  transition={{ duration: anim ? 0.2 : 0 }} />

                {/* Orbiting gold dot — circles beam tip when selected */}
                {selectedRay === id && (
                  <motion.circle
                    r={3}
                    fill="#F8D011"
                    filter="url(#scs-beam-glow)"
                    initial={false}
                    animate={anim ? {
                      cx: [end.x + 12, end.x, end.x - 12, end.x, end.x + 12],
                      cy: [end.y, end.y - 12, end.y, end.y + 12, end.y],
                    } : { cx: end.x + 12, cy: end.y }}
                    transition={anim ? { duration: 12, repeat: Infinity, ease: 'linear' } : { duration: 0 }}
                  />
                )}

                {/* Keyboard focus indicator — dashed ring at beam tip */}
                {isFocused && (
                  <circle cx={end.x} cy={end.y} r={10} fill="none"
                    stroke="#F8D011" strokeWidth={2} strokeDasharray="4 3" opacity={0.9} />
                )}

                {/* Label — counter-rotated so text stays upright */}
                <text x={labelPos.x} y={labelPos.y}
                  textAnchor={
                    (adjustedAngle > 60 && adjustedAngle < 120) || (adjustedAngle > 240 && adjustedAngle < 300)
                      ? 'middle' : isLeftSide ? 'end' : 'start'
                  }
                  dominantBaseline="central"
                  fill={isActive ? '#F8D011' : isTop ? '#F8D011' : isAmplified ? '#7B4FA2' : 'rgba(253, 252, 253, 0.75)'}
                  filter={isActive || isTop ? 'url(#scs-text-outline)' : undefined}
                  transform={`rotate(${-wheelRotation}, ${labelPos.x}, ${labelPos.y})`}
                  style={{
                    fontSize: isActive ? '11px' : '10px',
                    fontWeight: isActive ? 600 : 400,
                    fontFamily: 'var(--font-cosmic-display), serif',
                    textTransform: 'uppercase' as const,
                    letterSpacing: '0.06em',
                    transition: 'all 0.2s ease',
                  }}>
                  {RAY_SHORT_NAMES[id]}
                </text>

                {/* Badge — counter-rotated */}
                {(isTop || isBottom) && (() => {
                  const bp = polarToXY(CENTER, CENTER, length + 33, angle);
                  return (
                    <text x={bp.x} y={bp.y} textAnchor="middle" dominantBaseline="central"
                      filter={isTop ? 'url(#scs-text-outline)' : undefined}
                      transform={`rotate(${-wheelRotation}, ${bp.x}, ${bp.y})`}
                      style={{
                        fontSize: '7px', fontWeight: 400,
                        fontFamily: 'var(--font-cosmic-display), serif',
                        textTransform: 'uppercase' as const, letterSpacing: '0.1em',
                        fill: isTop ? '#F8D011' : 'rgba(253, 252, 253, 0.6)',
                      }}>
                      {isTop ? 'POWER SOURCE' : 'TRAIN NEXT'}
                    </text>
                  );
                })()}
              </g>
            );
          })}

          {/* Central Sun */}
          <SunCore cx={CENTER} cy={CENTER} radius={SUN_RADIUS} animate={anim} />

          {/* Eclipse load overlay — shadow arc proportional to loadPercent */}
          {loadPercent > 0 && (
            <motion.path
              d={eclipseArcPath(CENTER, CENTER, BEAM_END_MAX + 25, loadPercent)}
              fill="rgba(26, 26, 26, 0.45)"
              initial={anim ? { opacity: 0 } : false}
              animate={{ opacity: 1 }}
              transition={{ duration: anim ? 0.8 : 0 }}
              aria-hidden="true"
            />
          )}

          </motion.g>{/* end rotatable group */}

          {/* CRT scanline overlay */}
          <rect x="0" y="0" width={CENTER * 2} height={CENTER * 2} rx="16" fill="url(#scs-scanlines)" opacity={0.4} />
        </svg>

        {/* Hover tooltip */}
        <AnimatePresence>
          {hoveredRay && !selectedRay && rays[hoveredRay] && (
            <motion.div
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }} transition={{ duration: anim ? 0.15 : 0 }}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-xl px-5 py-3 text-center pointer-events-none"
              style={{ background: 'var(--overlay-heavy)', border: '1px solid var(--surface-border)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', boxShadow: 'var(--shadow-depth)' }}
              role="tooltip"
            >
              <p className="text-xs tracking-wide uppercase"
                style={{ fontFamily: 'var(--font-cosmic-display), serif', color: 'var(--brand-gold)' }}>
                {RAY_NAMES[hoveredRay]} — {RAY_VERBS[hoveredRay]}
              </p>
              <p className="text-lg font-bold mt-0.5" style={{ color: 'var(--text-on-dark)' }}>
                {Math.round(rays[hoveredRay].net_energy ?? rays[hoveredRay].score)}
              </p>
              {rays[hoveredRay].eclipse_modifier === 'AMPLIFIED' && (
                <p className="text-[10px] mt-0.5" style={{ color: '#A78BFA' }}>Load Amplified</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Chart Legend ── */}
      <div
        className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 rounded-xl px-4 py-3 text-[11px]"
        style={{ background: 'var(--surface-glass, rgba(255,255,255,0.06))', border: '1px solid var(--surface-border, rgba(255,255,255,0.10))' }}
        aria-label="Chart legend"
      >
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-5 rounded-sm" style={{ background: 'linear-gradient(90deg, #F8D011, #FFFEF5)' }} />
          <span style={{ color: 'var(--text-on-dark-secondary)' }}>Power Source</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-5 rounded-sm" style={{ background: 'rgba(244, 196, 48, 0.55)' }} />
          <span style={{ color: 'var(--text-on-dark-secondary)' }}>Standard Ray</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-5 rounded-sm" style={{ background: 'var(--cosmic-svg-bg)' }} />
          <span style={{ color: 'var(--text-on-dark-secondary)' }}>Load Amplified</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-5 rounded-sm" style={{ background: 'rgba(244, 196, 48, 0.35)' }} />
          <span style={{ color: 'var(--text-on-dark-secondary)' }}>Train Next</span>
        </span>
      </div>

      {/* ── Detail Panel (bottom sheet) ── */}
      <AnimatePresence>
        {selectedRay && rays[selectedRay] && (
          <motion.aside
            ref={panelRef}
            role="dialog"
            aria-label={`${RAY_NAMES[selectedRay]} ray details`}
            initial={anim ? { opacity: 0, y: 16 } : { opacity: 1 }}
            animate={{ opacity: 1, y: 0 }}
            exit={anim ? { opacity: 0, y: 16 } : { opacity: 0 }}
            transition={anim ? { duration: 0.25, ease: 'easeOut' } : { duration: 0 }}
            className="rounded-2xl overflow-hidden"
            style={{ background: 'var(--overlay-heavy)', border: '1px solid var(--surface-border)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', boxShadow: 'var(--shadow-glow-md)' }}
          >
            <div className="p-5">
              {/* Header row */}
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-base uppercase tracking-wide"
                  style={{ fontFamily: 'var(--font-cosmic-display), serif', color: 'var(--brand-gold)' }}>
                  {RAY_NAMES[selectedRay]}
                </h4>
                <button onClick={() => { setSelectedRay(null); onRaySelected?.(null); }}
                  aria-label="Close ray details"
                  className="text-xl leading-none p-1.5 rounded-lg transition-colors cosmic-focus-target"
                  style={{ color: 'var(--text-on-dark-muted)' }}
                  onMouseOver={(e) => (e.currentTarget.style.color = 'var(--text-on-dark)')}
                  onMouseOut={(e) => (e.currentTarget.style.color = 'var(--text-on-dark-muted)')}>
                  &times;
                </button>
              </div>

              <p className="text-xs uppercase tracking-wider mb-4" style={{ color: 'var(--text-on-dark-secondary)' }}>
                {RAY_VERBS[selectedRay]} — {RAY_PHASE[selectedRay]} Phase
              </p>

              {/* Score bar */}
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span style={{ color: 'var(--text-on-dark-secondary)' }}>Net Access</span>
                  <span className="font-bold text-sm" style={{ color: 'var(--brand-gold)' }}>
                    {Math.round(rays[selectedRay].net_energy ?? rays[selectedRay].score)}
                  </span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--surface-glass)' }}>
                  <motion.div className="h-full rounded-full"
                    style={{ background: 'linear-gradient(90deg, var(--brand-purple), var(--brand-gold))' }}
                    initial={anim ? { width: 0 } : false}
                    animate={{ width: `${rays[selectedRay].net_energy ?? rays[selectedRay].score}%` }}
                    transition={anim ? { duration: 0.6, ease: 'easeOut' } : { duration: 0 }} />
                </div>
              </div>

              {/* Percentile context */}
              {percentiles && percentiles[selectedRay] != null && (
                <p className="text-xs mt-2" style={{ color: 'var(--text-on-dark-muted)' }}>
                  Stronger than {percentiles[selectedRay]}% of leaders assessed
                </p>
              )}

              {/* Metadata pills */}
              <div className="flex gap-2 mt-4 flex-wrap">
                <span className="status-pill"
                  style={{ background: 'var(--surface-glass)', color: 'var(--text-on-dark-secondary)' }}>
                  {RAY_PHASE[selectedRay]}
                </span>
                {topTwo.includes(selectedRay) && (
                  <span className="status-pill"
                    style={{ background: 'rgba(244, 196, 48, 0.15)', color: 'var(--brand-gold)' }}>
                    Power Source
                  </span>
                )}
                {selectedRay === bottomRay && (
                  <span className="status-pill"
                    style={{ background: 'var(--surface-glass)', color: 'var(--text-on-dark-secondary)' }}>
                    Train Next
                  </span>
                )}
                {rays[selectedRay].eclipse_modifier === 'AMPLIFIED' && (
                  <span className="status-pill"
                    style={{ background: 'rgba(96, 5, 141, 0.20)', color: '#A78BFA' }}>
                    Load Amplified
                  </span>
                )}
              </div>

              {/* Raw scores */}
              <div className="grid grid-cols-3 gap-3 mt-4 pt-4" style={{ borderTop: '1px solid var(--surface-border)' }}>
                <div className="text-center">
                  <p className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--text-on-dark-muted)' }}>Score</p>
                  <p className="text-sm font-bold" style={{ color: 'var(--text-on-dark)' }}>{rays[selectedRay].score}</p>
                </div>
                {rays[selectedRay].eclipse_score != null && (
                  <div className="text-center">
                    <p className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--text-on-dark-muted)' }}>Eclipse</p>
                    <p className="text-sm font-bold" style={{ color: 'var(--brand-purple)' }}>{rays[selectedRay].eclipse_score}</p>
                  </div>
                )}
                {rays[selectedRay].access_score != null && (
                  <div className="text-center">
                    <p className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--text-on-dark-muted)' }}>Access</p>
                    <p className="text-sm font-bold" style={{ color: 'var(--brand-gold)' }}>{rays[selectedRay].access_score}</p>
                  </div>
                )}
              </div>

              {/* Eclipse modifier explanation */}
              {rays[selectedRay].eclipse_modifier !== 'NONE' && (
                <p className="text-xs mt-3 leading-relaxed" style={{ color: 'var(--text-on-dark-muted)' }}>
                  {getModifierLabel(rays[selectedRay].eclipse_modifier)}
                </p>
              )}

              {/* Phase explanation */}
              {RAY_PHASE[selectedRay] && (
                <p className="text-xs mt-3 leading-relaxed" style={{ color: 'var(--text-on-dark-muted)' }}>
                  {getPhaseExplanation(RAY_PHASE[selectedRay])}
                </p>
              )}

              {/* Expandable Insight Section */}
              {(() => {
                const rayInsight = getRayExplanation(selectedRay);
                if (!rayInsight) return null;
                const score = rays[selectedRay].net_energy ?? rays[selectedRay].score;
                const isEclipsed = score < 40;
                return (
                  <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--surface-border)' }}>
                    <button
                      type="button"
                      onClick={() => setShowRayInsight(!showRayInsight)}
                      aria-expanded={showRayInsight}
                      className="flex items-center gap-2 text-sm font-medium w-full text-left cosmic-focus-target transition-colors"
                      style={{ color: 'var(--brand-gold)' }}
                    >
                      <span
                        className="inline-block transition-transform"
                        style={{ transform: showRayInsight ? 'rotate(90deg)' : 'rotate(0deg)' }}
                        aria-hidden="true"
                      >
                        &#9654;
                      </span>
                      Science, real life, and coaching reps
                    </button>

                    <AnimatePresence>
                      {showRayInsight && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                          className="overflow-hidden"
                        >
                          <div className="space-y-4 mt-3">
                            {/* Definition */}
                            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
                              {rayInsight.definition}
                            </p>

                            {/* Science */}
                            <div>
                              <p className="text-xs uppercase tracking-wider font-semibold mb-1.5" style={{ color: 'var(--brand-gold)' }}>
                                The Research
                              </p>
                              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-on-dark-muted)' }}>
                                {rayInsight.science}
                              </p>
                            </div>

                            {/* Context-sensitive examples: show eclipsed if score < 40, strong if >= 40 */}
                            <div>
                              <p className="text-xs uppercase tracking-wider font-semibold mb-1.5" style={{ color: 'var(--brand-gold)' }}>
                                {isEclipsed ? 'What This Might Look Like Right Now' : 'What This Looks Like When It\'s Working'}
                              </p>
                              <ul className="space-y-1.5">
                                {(isEclipsed ? rayInsight.whenEclipsed : rayInsight.whenStrong).map((ex, i) => (
                                  <li key={i} className="flex gap-2 text-xs leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
                                    <span className="mt-0.5 shrink-0" style={{ color: 'var(--text-on-dark-muted)' }}>&#9679;</span>
                                    {ex}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Coaching Reps */}
                            <div>
                              <p className="text-xs uppercase tracking-wider font-semibold mb-1.5" style={{ color: 'var(--brand-gold)' }}>
                                Try This Week
                              </p>
                              <ul className="space-y-1.5">
                                {rayInsight.coachingReps.map((rep, i) => (
                                  <li key={i} className="flex gap-2 text-xs leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
                                    <span className="font-bold shrink-0" style={{ color: 'var(--brand-gold)' }}>{i + 1}.</span>
                                    {rep}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })()}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </section>
  );
}
