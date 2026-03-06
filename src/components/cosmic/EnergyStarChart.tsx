'use client';

/**
 * EnergyStarChart — Full-page circular instrument (v2 visual rebuild).
 *
 * R9 (Be The Light) is the radiant central Sun.
 * R1-R8 orbit around it as 8 measurement segments.
 * Purple base + gold illumination only.
 */

import { useState, useMemo, useCallback } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import type { RayOutput, EclipseOutput, AssessmentIndices } from '@/lib/types';
import { ORBIT_RAYS, PHASE_MAP } from './energy-star-chart-data';
import './energy-star-chart.css';

/* ── Types ── */

interface EnergyStarChartProps {
  mode: 'preview' | 'full';
  rays: Record<string, RayOutput>;
  eclipse: EclipseOutput;
  indices?: AssessmentIndices;
  overallScore?: number;
}

/* ── Constants ── */

const VB = 1000;
const CX = VB / 2;
const CY = VB / 2;
const SUN_R = 75; // central sun radius (was 52)
const ORBIT_MIN = 140; // inner orbit ring
const ORBIT_MAX = 400; // outer orbit ring
const OUTER_RING = 445; // outer instrument ring
const LABEL_RING = 468;
const STAR_COUNT = 120;
const SEGMENT_COUNT = 8;
const SEGMENT_ANGLE = 360 / SEGMENT_COUNT;

const GOLD = '#F2D249';
const GOLD_BRIGHT = '#FFE75A';
const GOLD_DIM = 'rgba(242,210,73,0.35)';
const GOLD_FAINT = 'rgba(242,210,73,0.12)';
const PURPLE_DEEP = '#0D0520';

/* ── Utilities ── */

function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function seeded(seed: number) {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

function scoreToRadius(score: number) {
  return ORBIT_MIN + (score / 100) * (ORBIT_MAX - ORBIT_MIN);
}

/** Build an SVG arc path for a wedge/gauge */
function arcPath(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const s = polar(cx, cy, r, startAngle);
  const e = polar(cx, cy, r, endAngle);
  const large = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`;
}

/** Segment center angle (0-based, starting from top) */
function segmentAngle(index: number) {
  return index * SEGMENT_ANGLE - 90;
}

/** Score-based brightness tier */
function scoreBrightness(score: number): { opacity: number; haloScale: number; coronaLen: number } {
  if (score >= 80) return { opacity: 1.0, haloScale: 1.0, coronaLen: 14 };
  if (score >= 60) return { opacity: 0.8, haloScale: 0.75, coronaLen: 10 };
  if (score >= 40) return { opacity: 0.6, haloScale: 0.55, coronaLen: 7 };
  return { opacity: 0.45, haloScale: 0.4, coronaLen: 5 };
}

/** Build a wedge path (pie slice) */
function wedgePath(cx: number, cy: number, innerR: number, outerR: number, startAngle: number, endAngle: number) {
  const si = polar(cx, cy, innerR, startAngle);
  const ei = polar(cx, cy, innerR, endAngle);
  const so = polar(cx, cy, outerR, startAngle);
  const eo = polar(cx, cy, outerR, endAngle);
  const large = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${si.x} ${si.y} L ${so.x} ${so.y} A ${outerR} ${outerR} 0 ${large} 1 ${eo.x} ${eo.y} L ${ei.x} ${ei.y} A ${innerR} ${innerR} 0 ${large} 0 ${si.x} ${si.y} Z`;
}

/* ═══════════════════════════════════════════════════════════
   Component
   ═══════════════════════════════════════════════════════════ */

export default function EnergyStarChart({ mode, rays, eclipse, indices, overallScore }: EnergyStarChartProps) {
  const prefersReduced = useReducedMotion();
  const [hoveredRay, setHoveredRay] = useState<string | null>(null);
  const isPreview = mode === 'preview';

  const r9Score = rays.R9?.score ?? overallScore ?? 70;

  const eclipsePercent = useMemo(() => {
    const dm = eclipse.derived_metrics;
    if (!dm) return 0;
    return Math.min(100, dm.load_pressure ?? 0);
  }, [eclipse]);

  const phaseForRay = useCallback((rayId: string) => PHASE_MAP[rayId] ?? '', []);

  /* ── Stars ── */
  const stars = useMemo(() => {
    return Array.from({ length: STAR_COUNT }, (_, i) => ({
      x: seeded(i * 7 + 1) * VB,
      y: seeded(i * 7 + 2) * VB,
      r: 0.4 + seeded(i * 7 + 3) * 1.0,
      delay: seeded(i * 7 + 4) * 5,
      dur: 2 + seeded(i * 7 + 5) * 3,
    }));
  }, []);

  /* ── Score polygon points ── */
  const polygonPoints = useMemo(() => {
    return ORBIT_RAYS.map((rayId, i) => {
      const ray = rays[rayId];
      if (!ray) return `${CX},${CY}`;
      const angle = segmentAngle(i) + SEGMENT_ANGLE / 2;
      const r = scoreToRadius(ray.score);
      const pos = polar(CX, CY, r, angle);
      return `${pos.x},${pos.y}`;
    }).join(' ');
  }, [rays]);

  const containerClass = `esc-container ${isPreview ? 'esc-container--preview' : 'esc-container--full'}`;

  const anim = (delay: number) =>
    prefersReduced ? {} : { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay, duration: 0.6 } };

  return (
    <div>
      {/* Header */}
      <div className="esc-header">
        <h1 className="esc-header__title">Energy Star Chart</h1>
        <p className="esc-header__subtitle">Leadership Capacity Diagnostic</p>
      </div>

      {/* Status bar */}
      {!isPreview && indices && (
        <div className="esc-status-bar">
          <span>Radiance <span className="esc-status-bar__value">{r9Score}%</span></span>
          <span>Eclipse <span className="esc-status-bar__value">{eclipse.level}</span></span>
          <span>EER <span className="esc-status-bar__value">{indices.eer?.toFixed(1) ?? '—'}</span></span>
          <span>BRI <span className="esc-status-bar__value">{indices.bri ?? '—'}</span></span>
        </div>
      )}

      {/* Chart */}
      <div className={containerClass}>
        <svg
          className="esc-svg"
          viewBox={`0 0 ${VB} ${VB}`}
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Energy Star Chart — 9-ray leadership capacity instrument"
          role="img"
        >
          <defs>
            {/* ── Gradients ── */}

            {/* Central sun */}
            <radialGradient id="esc-sun-grad" cx="50%" cy="45%" r="55%">
              <stop offset="0%" stopColor="#FFFEF5" />
              <stop offset="15%" stopColor="#FFFBE2" />
              <stop offset="35%" stopColor="#FFE75A" />
              <stop offset="60%" stopColor="#F2D249" />
              <stop offset="85%" stopColor="#FFA500" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#FFA500" stopOpacity="0" />
            </radialGradient>

            {/* Sun halo */}
            <radialGradient id="esc-halo-grad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={GOLD_BRIGHT} stopOpacity="0.5" />
              <stop offset="30%" stopColor={GOLD} stopOpacity="0.25" />
              <stop offset="60%" stopColor={GOLD} stopOpacity="0.08" />
              <stop offset="100%" stopColor={GOLD} stopOpacity="0" />
            </radialGradient>

            {/* Orbiting sun */}
            <radialGradient id="esc-orb-grad" cx="50%" cy="45%" r="55%">
              <stop offset="0%" stopColor="#FFFEF5" />
              <stop offset="20%" stopColor="#FFFBE2" />
              <stop offset="50%" stopColor="#FFE75A" />
              <stop offset="80%" stopColor={GOLD} stopOpacity="0.7" />
              <stop offset="100%" stopColor={GOLD} stopOpacity="0" />
            </radialGradient>

            {/* Score polygon fill */}
            <radialGradient id="esc-poly-grad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={GOLD_BRIGHT} stopOpacity="0.25" />
              <stop offset="50%" stopColor={GOLD} stopOpacity="0.12" />
              <stop offset="100%" stopColor={GOLD} stopOpacity="0.04" />
            </radialGradient>

            {/* Wedge fill */}
            <radialGradient id="esc-wedge-grad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={GOLD} stopOpacity="0.08" />
              <stop offset="100%" stopColor={GOLD} stopOpacity="0.03" />
            </radialGradient>

            {/* ── Filters ── */}

            {/* Orbiting sun glow — layered bloom */}
            <filter id="esc-orb-glow" x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur1" />
              <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur2" />
              <feBlend in="blur1" in2="blur2" mode="screen" result="bloom" />
              <feComposite in="SourceGraphic" in2="bloom" operator="over" />
            </filter>

            {/* Central sun glow — intense multi-layer bloom */}
            <filter id="esc-sun-glow" x="-120%" y="-120%" width="340%" height="340%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur1" />
              <feGaussianBlur in="SourceGraphic" stdDeviation="25" result="blur2" />
              <feGaussianBlur in="SourceGraphic" stdDeviation="50" result="blur3" />
              <feBlend in="blur1" in2="blur2" mode="screen" result="bloom1" />
              <feBlend in="bloom1" in2="blur3" mode="screen" result="bloom2" />
              <feComposite in="SourceGraphic" in2="bloom2" operator="over" />
            </filter>

            {/* Mega halo — very large soft glow */}
            <filter id="esc-mega-halo" x="-150%" y="-150%" width="400%" height="400%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="45" />
            </filter>

            {/* Soft glow for rings */}
            <filter id="esc-ring-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            {/* Score polygon glow */}
            <filter id="esc-poly-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            {/* Eclipse shadow mask */}
            {eclipsePercent > 0 && (
              <mask id="esc-eclipse-mask">
                <rect width={VB} height={VB} fill="white" />
                <circle
                  cx={CX + (100 - eclipsePercent) * 0.8}
                  cy={CY - 20}
                  r={ORBIT_MAX * 0.6}
                  fill="black"
                  opacity={eclipsePercent / 100 * 0.7}
                />
              </mask>
            )}
          </defs>

          {/* ═══ Layer 1: Background stars ═══ */}
          <motion.g {...anim(0)}>
            {stars.map((s, i) => (
              <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="white" opacity={0.35}>
                {!prefersReduced && (
                  <animate
                    attributeName="opacity"
                    values="0.15;0.7;0.15"
                    dur={`${s.dur}s`}
                    begin={`${s.delay}s`}
                    repeatCount="indefinite"
                  />
                )}
              </circle>
            ))}
          </motion.g>

          {/* ═══ Layer 2: Nebula haze ═══ */}
          <motion.g {...anim(0.1)}>
            <circle cx={CX - 120} cy={CY + 100} r={300} fill="#2D1450" opacity={0.12} />
            <circle cx={CX + 160} cy={CY - 80} r={250} fill="#1A0A2E" opacity={0.15} />
            <circle cx={CX} cy={CY} r={180} fill="#3D1870" opacity={0.06} />
          </motion.g>

          {/* ═══ Layer 3: Outer instrument ring ═══ */}
          <motion.g {...anim(0.2)}>
            {/* Double ring */}
            <circle cx={CX} cy={CY} r={OUTER_RING} fill="none" stroke={GOLD} strokeWidth={1.8} opacity={0.4} filter="url(#esc-ring-glow)" />
            <circle cx={CX} cy={CY} r={OUTER_RING + 10} fill="none" stroke={GOLD} strokeWidth={0.5} opacity={0.2} />
            <circle cx={CX} cy={CY} r={OUTER_RING - 6} fill="none" stroke={GOLD} strokeWidth={0.3} opacity={0.15} />

            {/* Tick marks — 72 around the ring */}
            {Array.from({ length: 72 }, (_, i) => {
              const angle = i * 5 - 90;
              const isMajor = i % 9 === 0;
              const isMid = i % 3 === 0;
              const len = isMajor ? 14 : isMid ? 8 : 4;
              const inner = polar(CX, CY, OUTER_RING - len, angle);
              const outer = polar(CX, CY, OUTER_RING, angle);
              return (
                <line
                  key={`tick-${i}`}
                  x1={inner.x} y1={inner.y}
                  x2={outer.x} y2={outer.y}
                  stroke={GOLD}
                  strokeWidth={isMajor ? 1.5 : isMid ? 0.8 : 0.4}
                  opacity={isMajor ? 0.7 : isMid ? 0.4 : 0.2}
                />
              );
            })}
          </motion.g>

          {/* ═══ Layer 4: Orbit tracks ═══ */}
          <motion.g {...anim(0.3)}>
            {[0.25, 0.5, 0.75, 1].map((frac, i) => {
              const r = ORBIT_MIN + frac * (ORBIT_MAX - ORBIT_MIN);
              const isOuter = i === 3;
              const isMid = i === 1;
              return (
                <circle
                  key={`orbit-${i}`}
                  cx={CX} cy={CY} r={r}
                  fill="none"
                  stroke={GOLD}
                  strokeWidth={isOuter ? 1.2 : isMid ? 0.8 : 0.5}
                  opacity={isOuter ? 0.4 : isMid ? 0.3 : 0.2}
                  strokeDasharray={i === 0 || i === 2 ? '3 10' : 'none'}
                  filter={isOuter ? 'url(#esc-ring-glow)' : undefined}
                />
              );
            })}

            {/* Inner boundary ring */}
            <circle cx={CX} cy={CY} r={ORBIT_MIN} fill="none" stroke={GOLD} strokeWidth={0.6} opacity={0.25} />

            {/* Scale labels */}
            {[0, 25, 50, 75, 100].map((val) => {
              const r = scoreToRadius(val);
              const pos = polar(CX, CY, r, -95);
              return (
                <text
                  key={`scale-${val}`}
                  x={pos.x} y={pos.y}
                  fill={GOLD}
                  opacity={0.4}
                  fontSize={9}
                  fontFamily="Orbitron, monospace"
                  fontWeight={700}
                  textAnchor="end"
                >
                  {val}
                </text>
              );
            })}
          </motion.g>

          {/* ═══ Layer 5: Segment dividers ═══ */}
          <motion.g {...anim(0.35)}>
            {ORBIT_RAYS.map((_, i) => {
              const angle = i * SEGMENT_ANGLE - 90;
              const inner = polar(CX, CY, SUN_R + 10, angle);
              const outer = polar(CX, CY, OUTER_RING, angle);
              return (
                <line
                  key={`div-${i}`}
                  x1={inner.x} y1={inner.y}
                  x2={outer.x} y2={outer.y}
                  stroke={GOLD}
                  strokeWidth={0.8}
                  opacity={0.35}
                />
              );
            })}
          </motion.g>

          {/* ═══ Layer 6: Segment score wedges (radar fill) ═══ */}
          <motion.g {...anim(0.38)}>
            {ORBIT_RAYS.map((rayId, i) => {
              const ray = rays[rayId];
              if (!ray) return null;
              const startAngle = i * SEGMENT_ANGLE - 90;
              const endAngle = startAngle + SEGMENT_ANGLE;
              const scoreR = scoreToRadius(ray.score);
              const isBlurred = isPreview && i >= 4;
              const brightness = scoreBrightness(ray.score);
              const isHovered = hoveredRay === rayId;

              return (
                <path
                  key={`wedge-${rayId}`}
                  d={wedgePath(CX, CY, ORBIT_MIN, scoreR, startAngle, endAngle)}
                  fill={GOLD}
                  opacity={isBlurred ? 0.02 : (0.04 + brightness.opacity * 0.08) * (isHovered ? 2.5 : 1)}
                  stroke={GOLD}
                  strokeWidth={0.3}
                  strokeOpacity={isBlurred ? 0 : 0.15}
                />
              );
            })}
          </motion.g>

          {/* ═══ Layer 7: Score polygon ═══ */}
          <motion.g {...anim(0.42)}>
            {/* Glow layer */}
            <polygon
              points={polygonPoints}
              fill="none"
              stroke={GOLD}
              strokeWidth={2.5}
              opacity={0.2}
              filter="url(#esc-poly-glow)"
            />
            {/* Fill */}
            <polygon
              points={polygonPoints}
              fill="url(#esc-poly-grad)"
              stroke={GOLD}
              strokeWidth={1.5}
              strokeOpacity={0.5}
              fillOpacity={1}
            />
          </motion.g>

          {/* ═══ Layer 8: Eclipse shadow ═══ */}
          {eclipsePercent > 5 && (
            <motion.g {...anim(0.5)}>
              <circle
                cx={CX + (40 - eclipsePercent * 0.4)}
                cy={CY}
                r={ORBIT_MAX * 0.85}
                fill={PURPLE_DEEP}
                opacity={eclipsePercent / 100 * 0.3}
              />
            </motion.g>
          )}

          {/* ═══ Layer 9: Phase labels ═══ */}
          <motion.g {...anim(0.4)}>
            {(['RECONNECT', 'RADIATE', 'BECOME'] as const).map((phase, pi) => {
              const startSeg = pi === 0 ? 0 : pi === 1 ? 3 : 6;
              const endSeg = pi === 0 ? 2 : pi === 1 ? 5 : 7;
              const midAngle = ((startSeg + endSeg) / 2) * SEGMENT_ANGLE - 90;
              const pos = polar(CX, CY, LABEL_RING + 16, midAngle);
              return (
                <text
                  key={phase}
                  x={pos.x} y={pos.y}
                  fill={GOLD}
                  opacity={0.5}
                  fontSize={10}
                  fontFamily="Orbitron, monospace"
                  fontWeight={700}
                  letterSpacing="0.18em"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  transform={`rotate(${midAngle + 90}, ${pos.x}, ${pos.y})`}
                >
                  {phase}
                </text>
              );
            })}
          </motion.g>

          {/* ═══ Layer 10: Inner index gauges (EER, BRI, LSI) ═══ */}
          {indices && (
            <motion.g {...anim(0.45)}>
              {[
                { label: 'EER', value: indices.eer ?? 0, max: 4, startAngle: -30, color: GOLD },
                { label: 'BRI', value: indices.bri ?? 0, max: 9, startAngle: 90, color: GOLD },
                { label: 'LSI', value: indices.lsi_0_4 ?? 0, max: 4, startAngle: 210, color: GOLD },
              ].map((gauge) => {
                const fillAngle = (gauge.value / gauge.max) * 28;
                const bgPath = arcPath(CX, CY, ORBIT_MIN - 8, gauge.startAngle, gauge.startAngle + 28);
                const fillPath = arcPath(CX, CY, ORBIT_MIN - 8, gauge.startAngle, gauge.startAngle + fillAngle);
                const labelPos = polar(CX, CY, ORBIT_MIN - 22, gauge.startAngle + 14);
                const valuePos = polar(CX, CY, ORBIT_MIN + 6, gauge.startAngle + 14);
                return (
                  <g key={gauge.label}>
                    <path d={bgPath} fill="none" stroke={gauge.color} strokeWidth={3} opacity={0.15} strokeLinecap="round" />
                    <path d={fillPath} fill="none" stroke={gauge.color} strokeWidth={3} opacity={0.7} strokeLinecap="round" filter="url(#esc-ring-glow)" />
                    <text x={labelPos.x} y={labelPos.y} fill={gauge.color} fontSize={7} fontFamily="Orbitron, monospace" fontWeight={700} textAnchor="middle" dominantBaseline="middle" opacity={0.5} letterSpacing="0.08em">
                      {gauge.label}
                    </text>
                    <text x={valuePos.x} y={valuePos.y} fill={gauge.color} fontSize={8} fontFamily="Orbitron, monospace" fontWeight={900} textAnchor="middle" dominantBaseline="middle" opacity={0.8}>
                      {typeof gauge.value === 'number' ? gauge.value.toFixed(1) : '—'}
                    </text>
                  </g>
                );
              })}
            </motion.g>
          )}

          {/* ═══ Layer 11: Orbiting suns (R1-R8) ═══ */}
          {ORBIT_RAYS.map((rayId, i) => {
            const ray = rays[rayId];
            if (!ray) return null;
            const angle = segmentAngle(i) + SEGMENT_ANGLE / 2;
            const r = scoreToRadius(ray.score);
            const pos = polar(CX, CY, r, angle);
            const bright = scoreBrightness(ray.score);
            const sunR = 14 + (ray.score / 100) * 12; // 14-26px
            const isHovered = hoveredRay === rayId;
            const isBlurred = isPreview && i >= 4;

            return (
              <motion.g
                key={rayId}
                {...(prefersReduced ? {} : {
                  initial: { opacity: 0, scale: 0 },
                  animate: { opacity: isBlurred ? 0.12 : 1, scale: 1 },
                  transition: { delay: 0.5 + i * 0.08, duration: 0.5, type: 'spring' },
                })}
                style={{ transformOrigin: `${pos.x}px ${pos.y}px` }}
                onMouseEnter={() => !isBlurred && setHoveredRay(rayId)}
                onMouseLeave={() => setHoveredRay(null)}
                cursor={isBlurred ? 'default' : 'pointer'}
              >
                {/* Energy trail from center */}
                <line
                  x1={CX} y1={CY}
                  x2={pos.x} y2={pos.y}
                  stroke={GOLD}
                  strokeWidth={isHovered ? 1.5 : 0.6}
                  opacity={isHovered ? 0.4 : 0.1}
                  strokeDasharray="2 8"
                />

                {/* Subfacet planets */}
                {ray.subfacets && Object.values(ray.subfacets).map((sf, si) => {
                  const planetAngle = angle + (si - 1.5) * 7;
                  const planetR = r + 22 + si * 10;
                  const pp = polar(CX, CY, planetR, planetAngle);
                  const planetSize = 2 + (sf.score / 100) * 3.5;
                  return (
                    <g key={sf.subfacet_id}>
                      {/* Planet halo */}
                      <circle
                        cx={pp.x} cy={pp.y}
                        r={planetSize * 2.5}
                        fill={GOLD}
                        opacity={0.06}
                      />
                      {/* Planet body */}
                      <circle
                        cx={pp.x} cy={pp.y}
                        r={planetSize}
                        fill={GOLD}
                        opacity={0.25 + (sf.score / 100) * 0.5}
                      />
                    </g>
                  );
                })}

                {/* Halo 3 (outermost) */}
                <circle
                  cx={pos.x} cy={pos.y}
                  r={sunR * 4 * bright.haloScale}
                  fill="url(#esc-halo-grad)"
                  opacity={isHovered ? 0.5 : 0.25 * bright.opacity}
                />

                {/* Halo 2 */}
                <circle
                  cx={pos.x} cy={pos.y}
                  r={sunR * 2.8 * bright.haloScale}
                  fill="url(#esc-halo-grad)"
                  opacity={isHovered ? 0.6 : 0.35 * bright.opacity}
                />

                {/* Halo 1 (inner glow) */}
                <circle
                  cx={pos.x} cy={pos.y}
                  r={sunR * 1.8}
                  fill="url(#esc-orb-grad)"
                  opacity={0.3 * bright.opacity}
                />

                {/* Sun body */}
                <circle
                  cx={pos.x} cy={pos.y}
                  r={sunR}
                  fill="url(#esc-orb-grad)"
                  filter="url(#esc-orb-glow)"
                  opacity={bright.opacity}
                />

                {/* Corona rays — 8 per sun */}
                {Array.from({ length: 8 }, (_, ci) => {
                  const a = ci * 45;
                  const isPrimary = ci % 2 === 0;
                  const len = isPrimary ? bright.coronaLen : bright.coronaLen * 0.6;
                  const cr = polar(pos.x, pos.y, sunR + 2, a);
                  const co = polar(pos.x, pos.y, sunR + len, a);
                  return (
                    <line
                      key={ci}
                      x1={cr.x} y1={cr.y}
                      x2={co.x} y2={co.y}
                      stroke={GOLD}
                      strokeWidth={isPrimary ? 1.2 : 0.6}
                      opacity={bright.opacity * (isPrimary ? 0.6 : 0.3)}
                    />
                  );
                })}

                {/* Ray label */}
                <text
                  x={pos.x}
                  y={pos.y + sunR + 18}
                  fill={GOLD}
                  fontSize={10}
                  fontFamily="Orbitron, monospace"
                  fontWeight={700}
                  textAnchor="middle"
                  opacity={isHovered ? 1 : 0.75}
                  letterSpacing="0.1em"
                >
                  {ray.ray_name?.toUpperCase() ?? rayId}
                </text>

                {/* Score */}
                {!isBlurred && (
                  <text
                    x={pos.x}
                    y={pos.y + sunR + 30}
                    fill={GOLD}
                    fontSize={12}
                    fontFamily="Orbitron, monospace"
                    fontWeight={900}
                    textAnchor="middle"
                    opacity={0.95}
                    filter="url(#esc-ring-glow)"
                  >
                    {ray.score}
                  </text>
                )}
              </motion.g>
            );
          })}

          {/* ═══ Layer 12: Central Sun (R9) ═══ */}
          <motion.g
            {...(prefersReduced ? {} : {
              initial: { opacity: 0, scale: 0 },
              animate: { opacity: 1, scale: 1 },
              transition: { delay: 0.3, duration: 0.8, type: 'spring' },
            })}
            style={{ transformOrigin: `${CX}px ${CY}px` }}
          >
            {/* Mega halo (very large soft glow) */}
            <circle
              cx={CX} cy={CY}
              r={SUN_R * 4}
              fill={GOLD}
              filter="url(#esc-mega-halo)"
              opacity={0.15 + (r9Score / 100) * 0.15}
            >
              {!prefersReduced && (
                <animate
                  attributeName="opacity"
                  values={`${0.12 + (r9Score / 100) * 0.1};${0.2 + (r9Score / 100) * 0.2};${0.12 + (r9Score / 100) * 0.1}`}
                  dur="5s"
                  repeatCount="indefinite"
                />
              )}
            </circle>

            {/* Halo 4 (outermost visible ring) */}
            <circle
              cx={CX} cy={CY}
              r={SUN_R * 3}
              fill="url(#esc-halo-grad)"
              opacity={0.35}
            >
              {!prefersReduced && (
                <animate
                  attributeName="opacity"
                  values="0.25;0.45;0.25"
                  dur="4s"
                  repeatCount="indefinite"
                />
              )}
            </circle>

            {/* Halo 3 */}
            <circle
              cx={CX} cy={CY}
              r={SUN_R * 2.2}
              fill="url(#esc-halo-grad)"
              opacity={0.5}
            />

            {/* Halo 2 */}
            <circle
              cx={CX} cy={CY}
              r={SUN_R * 1.5}
              fill="url(#esc-sun-grad)"
              opacity={0.45}
            />

            {/* Halo 1 (inner glow) */}
            <circle
              cx={CX} cy={CY}
              r={SUN_R * 1.15}
              fill="url(#esc-sun-grad)"
              opacity={0.6}
            />

            {/* Sun body */}
            <circle
              cx={CX} cy={CY}
              r={SUN_R}
              fill="url(#esc-sun-grad)"
              filter="url(#esc-sun-glow)"
            />

            {/* Corona rays — 16 radiating outward */}
            {Array.from({ length: 16 }, (_, i) => {
              const a = i * 22.5;
              const isPrimary = i % 4 === 0; // 4 main rays
              const isSecondary = i % 2 === 0; // 8 secondary
              const intensity = 0.6 + (r9Score / 100) * 0.4;
              const baseLen = SUN_R + 10;
              const len = isPrimary ? baseLen + 28 + (r9Score / 100) * 15 :
                          isSecondary ? baseLen + 16 + (r9Score / 100) * 8 :
                          baseLen + 6;
              const inner = polar(CX, CY, SUN_R + 3, a);
              const outer = polar(CX, CY, len, a);
              return (
                <line
                  key={`corona-${i}`}
                  x1={inner.x} y1={inner.y}
                  x2={outer.x} y2={outer.y}
                  stroke={isPrimary ? GOLD_BRIGHT : GOLD}
                  strokeWidth={isPrimary ? 2.5 : isSecondary ? 1.2 : 0.5}
                  opacity={intensity * (isPrimary ? 0.7 : isSecondary ? 0.4 : 0.2)}
                />
              );
            })}

            {/* R9 label */}
            <text
              x={CX} y={CY + SUN_R + 28}
              fill={GOLD}
              fontSize={11}
              fontFamily="Orbitron, monospace"
              fontWeight={900}
              textAnchor="middle"
              letterSpacing="0.14em"
            >
              BE THE LIGHT
            </text>
            <text
              x={CX} y={CY + SUN_R + 42}
              fill={GOLD_BRIGHT}
              fontSize={16}
              fontFamily="Orbitron, monospace"
              fontWeight={900}
              textAnchor="middle"
              opacity={0.95}
              filter="url(#esc-ring-glow)"
            >
              {r9Score}
            </text>
          </motion.g>

          {/* ═══ Layer 13: Reticle crosshairs ═══ */}
          <motion.g {...anim(0.6)}>
            {ORBIT_RAYS.map((_, i) => {
              const angle = i * SEGMENT_ANGLE - 90;
              const pos = polar(CX, CY, OUTER_RING, angle);
              return (
                <g key={`reticle-${i}`}>
                  <circle cx={pos.x} cy={pos.y} r={4} fill="none" stroke={GOLD} strokeWidth={0.6} opacity={0.45} />
                  <circle cx={pos.x} cy={pos.y} r={1.5} fill={GOLD} opacity={0.6} />
                </g>
              );
            })}
          </motion.g>

          {/* ═══ Layer 14: Scan sweep line ═══ */}
          {!prefersReduced && (
            <g className="esc-scan-line" style={{ transformOrigin: `${CX}px ${CY}px` }}>
              <line
                x1={CX} y1={CY}
                x2={CX} y2={CY - OUTER_RING}
                stroke={GOLD}
                strokeWidth={1}
                opacity={0.06}
              />
              {/* Trailing gradient effect */}
              <path
                d={wedgePath(CX, CY, 0, OUTER_RING, -92, -87)}
                fill={GOLD}
                opacity={0.03}
              />
            </g>
          )}

          {/* ═══ Layer 15: HUD label ═══ */}
          <motion.g {...anim(0.7)}>
            <text
              x={CX} y={CY - ORBIT_MIN + 12}
              fill={GOLD}
              fontSize={8}
              fontFamily="Orbitron, monospace"
              fontWeight={700}
              textAnchor="middle"
              opacity={0.35}
              letterSpacing="0.15em"
            >
              CAPACITY FIELD
            </text>
          </motion.g>
        </svg>

        {/* ── Preview mode frost overlay ── */}
        {isPreview && (
          <div className="esc-frost-overlay">
            <div
              className="esc-frost-arc"
              style={{
                '--frost-mask': `conic-gradient(from 90deg at 50% 50%, transparent 0deg, transparent 180deg, black 180deg, black 360deg)`,
              } as React.CSSProperties}
            />
            <div
              className="esc-watermark"
              style={{
                '--frost-mask': `conic-gradient(from 90deg at 50% 50%, transparent 0deg, transparent 180deg, black 180deg, black 360deg)`,
              } as React.CSSProperties}
            />
            <div className="esc-cta-overlay" style={{ right: '10%', bottom: '35%' }}>
              <svg className="esc-lock-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <Link href="/assessment" className="esc-cta-btn">
                Take the Assessment
              </Link>
            </div>
          </div>
        )}

        {/* ── Detail panel (hover) ── */}
        {hoveredRay && !isPreview && rays[hoveredRay] && (() => {
          const ray = rays[hoveredRay];
          const i = ORBIT_RAYS.indexOf(hoveredRay as typeof ORBIT_RAYS[number]);
          if (i < 0) return null;
          const angle = segmentAngle(i) + SEGMENT_ANGLE / 2;
          const r = scoreToRadius(ray.score);
          const panelSide = angle > -90 && angle < 90 ? 'right' : 'left';
          const panelTop = `${((CY + r * Math.sin((angle * Math.PI) / 180)) / VB) * 100}%`;
          return (
            <motion.div
              className="esc-detail-panel"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              style={{
                top: panelTop,
                [panelSide]: '-8px',
                transform: 'translateY(-50%)',
              }}
            >
              <p className="esc-detail-panel__title">{ray.ray_name}</p>
              <p className="esc-detail-panel__score">{ray.score}</p>
              {ray.subfacets && Object.values(ray.subfacets).map((sf) => (
                <div key={sf.subfacet_id} className="esc-detail-panel__subfacet">
                  <span>{sf.label}</span>
                  <div className="esc-detail-panel__subfacet-bar">
                    <div
                      className="esc-detail-panel__subfacet-fill"
                      style={{ width: `${sf.score}%` }}
                    />
                  </div>
                </div>
              ))}
              <p style={{ fontSize: 9, color: 'rgba(242,210,73,0.5)', marginTop: 8, fontFamily: 'Orbitron, monospace' }}>
                {phaseForRay(hoveredRay)} PHASE
              </p>
            </motion.div>
          );
        })()}
      </div>
    </div>
  );
}
