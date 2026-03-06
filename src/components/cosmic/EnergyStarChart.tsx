'use client';

/**
 * EnergyStarChart — Full-page circular instrument.
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

const VB = 1000; // viewBox size
const CX = VB / 2; // center x
const CY = VB / 2; // center y
const SUN_R = 52; // central sun radius
const ORBIT_MIN = 120; // inner orbit ring radius
const ORBIT_MAX = 400; // outer orbit ring radius
const OUTER_RING = 440; // outer instrument ring
const LABEL_RING = 465; // label placement radius
const STAR_COUNT = 80;
const SEGMENT_COUNT = 8;
const SEGMENT_ANGLE = 360 / SEGMENT_COUNT; // 45 degrees

const GOLD = '#F2D249';
const GOLD_DIM = 'rgba(242,210,73,0.3)';
const GOLD_FAINT = 'rgba(242,210,73,0.12)';
const PURPLE_BG = '#1A0A2E';
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

function arcPath(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const s = polar(cx, cy, r, startAngle);
  const e = polar(cx, cy, r, endAngle);
  const large = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`;
}

/** Get the center angle for segment index (0-based, starting from top) */
function segmentAngle(index: number) {
  return index * SEGMENT_ANGLE - 90; // -90 so index 0 is at top
}

/* ═══════════════════════════════════════════════════════════
   Component
   ═══════════════════════════════════════════════════════════ */

export default function EnergyStarChart({ mode, rays, eclipse, indices, overallScore }: EnergyStarChartProps) {
  const prefersReduced = useReducedMotion();
  const [hoveredRay, setHoveredRay] = useState<string | null>(null);
  const isPreview = mode === 'preview';

  const r9Score = rays.R9?.score ?? overallScore ?? 70;

  // Compute eclipse load percentage for shadow overlay
  const eclipsePercent = useMemo(() => {
    const dm = eclipse.derived_metrics;
    if (!dm) return 0;
    return Math.min(100, (dm.load_pressure ?? 0));
  }, [eclipse]);

  // Phase label for outer ring
  const phaseForRay = useCallback((rayId: string) => PHASE_MAP[rayId] ?? '', []);

  /* ── Stars background ── */
  const stars = useMemo(() => {
    return Array.from({ length: STAR_COUNT }, (_, i) => ({
      x: seeded(i * 7 + 1) * VB,
      y: seeded(i * 7 + 2) * VB,
      r: 0.5 + seeded(i * 7 + 3) * 1.2,
      delay: seeded(i * 7 + 4) * 4,
      dur: 2.5 + seeded(i * 7 + 5) * 2,
    }));
  }, []);

  /* ── Render ── */
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
            {/* Central sun radial gradient */}
            <radialGradient id="esc-sun-grad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFFBE2" />
              <stop offset="30%" stopColor="#FFE75A" />
              <stop offset="60%" stopColor="#F2D249" />
              <stop offset="100%" stopColor="#FFA500" stopOpacity="0" />
            </radialGradient>

            {/* Sun halo gradient */}
            <radialGradient id="esc-halo-grad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={GOLD} stopOpacity="0.4" />
              <stop offset="50%" stopColor={GOLD} stopOpacity="0.1" />
              <stop offset="100%" stopColor={GOLD} stopOpacity="0" />
            </radialGradient>

            {/* Orbiting sun gradient */}
            <radialGradient id="esc-orb-grad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFFBE2" />
              <stop offset="40%" stopColor="#FFE75A" />
              <stop offset="100%" stopColor={GOLD} stopOpacity="0" />
            </radialGradient>

            {/* Glow filter */}
            <filter id="esc-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            {/* Strong glow for central sun */}
            <filter id="esc-sun-glow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            {/* Soft halo filter */}
            <filter id="esc-halo-filter" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="20" />
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

          {/* ── Layer 1: Background stars ── */}
          <motion.g {...anim(0)}>
            {stars.map((s, i) => (
              <circle
                key={i}
                cx={s.x}
                cy={s.y}
                r={s.r}
                fill="white"
                opacity={0.4}
              >
                {!prefersReduced && (
                  <animate
                    attributeName="opacity"
                    values="0.2;0.8;0.2"
                    dur={`${s.dur}s`}
                    begin={`${s.delay}s`}
                    repeatCount="indefinite"
                  />
                )}
              </circle>
            ))}
          </motion.g>

          {/* ── Layer 2: Nebula haze ── */}
          <motion.g {...anim(0.1)}>
            <circle cx={CX - 100} cy={CY + 80} r={250} fill={PURPLE_BG} opacity={0.15} />
            <circle cx={CX + 150} cy={CY - 60} r={200} fill="#2D1450" opacity={0.12} />
          </motion.g>

          {/* ── Layer 3: Outer instrument ring ── */}
          <motion.g {...anim(0.2)}>
            <circle cx={CX} cy={CY} r={OUTER_RING} fill="none" stroke={GOLD_DIM} strokeWidth={1.5} />
            <circle cx={CX} cy={CY} r={OUTER_RING + 8} fill="none" stroke={GOLD_FAINT} strokeWidth={0.5} />
            {/* Tick marks on outer ring */}
            {Array.from({ length: 72 }, (_, i) => {
              const angle = i * 5 - 90;
              const isMajor = i % 9 === 0;
              const inner = polar(CX, CY, OUTER_RING - (isMajor ? 10 : 5), angle);
              const outer = polar(CX, CY, OUTER_RING, angle);
              return (
                <line
                  key={`tick-${i}`}
                  x1={inner.x} y1={inner.y}
                  x2={outer.x} y2={outer.y}
                  stroke={GOLD}
                  strokeWidth={isMajor ? 1.2 : 0.5}
                  opacity={isMajor ? 0.6 : 0.25}
                />
              );
            })}
          </motion.g>

          {/* ── Layer 4: Orbit tracks (concentric measurement rings) ── */}
          <motion.g {...anim(0.3)}>
            {[0.25, 0.5, 0.75, 1].map((frac, i) => {
              const r = ORBIT_MIN + frac * (ORBIT_MAX - ORBIT_MIN);
              return (
                <circle
                  key={`orbit-${i}`}
                  cx={CX} cy={CY} r={r}
                  fill="none"
                  stroke={GOLD}
                  strokeWidth={0.6}
                  opacity={0.18}
                  strokeDasharray={i === 1 || i === 3 ? 'none' : '4 8'}
                />
              );
            })}
            {/* Scale labels (0, 25, 50, 75, 100) */}
            {[0, 25, 50, 75, 100].map((val) => {
              const r = scoreToRadius(val);
              const pos = polar(CX, CY, r, -95); // just left of top
              return (
                <text
                  key={`scale-${val}`}
                  x={pos.x}
                  y={pos.y}
                  fill={GOLD}
                  opacity={0.35}
                  fontSize={8}
                  fontFamily="Orbitron, monospace"
                  textAnchor="end"
                >
                  {val}
                </text>
              );
            })}
          </motion.g>

          {/* ── Layer 5: Segment dividers ── */}
          <motion.g {...anim(0.35)}>
            {ORBIT_RAYS.map((_, i) => {
              const angle = i * SEGMENT_ANGLE - 90;
              const inner = polar(CX, CY, ORBIT_MIN - 15, angle);
              const outer = polar(CX, CY, OUTER_RING, angle);
              return (
                <line
                  key={`div-${i}`}
                  x1={inner.x} y1={inner.y}
                  x2={outer.x} y2={outer.y}
                  stroke={GOLD}
                  strokeWidth={0.8}
                  opacity={0.25}
                />
              );
            })}
          </motion.g>

          {/* ── Layer 6: Phase labels on outer ring ── */}
          <motion.g {...anim(0.4)}>
            {(['RECONNECT', 'RADIATE', 'BECOME'] as const).map((phase, pi) => {
              // RECONNECT: R1-R3 (segments 0-2), RADIATE: R4-R6 (3-5), BECOME: R7-R8 (6-7)
              const startSeg = pi === 0 ? 0 : pi === 1 ? 3 : 6;
              const endSeg = pi === 0 ? 2 : pi === 1 ? 5 : 7;
              const midAngle = ((startSeg + endSeg) / 2) * SEGMENT_ANGLE - 90;
              const pos = polar(CX, CY, LABEL_RING + 12, midAngle);
              return (
                <text
                  key={phase}
                  x={pos.x}
                  y={pos.y}
                  fill={GOLD}
                  opacity={0.45}
                  fontSize={9}
                  fontFamily="Orbitron, monospace"
                  fontWeight={700}
                  letterSpacing="0.15em"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  transform={`rotate(${midAngle + 90}, ${pos.x}, ${pos.y})`}
                >
                  {phase}
                </text>
              );
            })}
          </motion.g>

          {/* ── Layer 7: Eclipse shadow overlay ── */}
          {eclipsePercent > 5 && (
            <motion.g {...anim(0.5)}>
              <circle
                cx={CX + (40 - eclipsePercent * 0.4)}
                cy={CY}
                r={ORBIT_MAX * 0.85}
                fill={PURPLE_DEEP}
                opacity={eclipsePercent / 100 * 0.35}
              />
            </motion.g>
          )}

          {/* ── Layer 8: Orbiting suns (R1-R8) + subfacet planets ── */}
          {ORBIT_RAYS.map((rayId, i) => {
            const ray = rays[rayId];
            if (!ray) return null;
            const angle = segmentAngle(i) + SEGMENT_ANGLE / 2; // center of segment
            const r = scoreToRadius(ray.score);
            const pos = polar(CX, CY, r, angle);
            const sunR = 10 + (ray.score / 100) * 8; // 10-18px
            const isHovered = hoveredRay === rayId;
            const isBlurred = isPreview && i >= 4; // R5-R8 blurred in preview

            return (
              <motion.g
                key={rayId}
                {...(prefersReduced ? {} : {
                  initial: { opacity: 0, scale: 0 },
                  animate: { opacity: isBlurred ? 0.15 : 1, scale: 1 },
                  transition: { delay: 0.5 + i * 0.08, duration: 0.5, type: 'spring' },
                })}
                style={{ transformOrigin: `${pos.x}px ${pos.y}px` }}
                onMouseEnter={() => !isBlurred && setHoveredRay(rayId)}
                onMouseLeave={() => setHoveredRay(null)}
                cursor={isBlurred ? 'default' : 'pointer'}
              >
                {/* Connecting line from center to sun */}
                <line
                  x1={CX} y1={CY}
                  x2={pos.x} y2={pos.y}
                  stroke={GOLD}
                  strokeWidth={isHovered ? 1.2 : 0.4}
                  opacity={isHovered ? 0.5 : 0.12}
                  strokeDasharray="2 6"
                />

                {/* Subfacet planets (4 per ray) */}
                {ray.subfacets && Object.values(ray.subfacets).map((sf, si) => {
                  const planetAngle = angle + (si - 1.5) * 6;
                  const planetR = r + 20 + si * 8;
                  const pp = polar(CX, CY, planetR, planetAngle);
                  const planetSize = 1.5 + (sf.score / 100) * 3;
                  return (
                    <circle
                      key={sf.subfacet_id}
                      cx={pp.x} cy={pp.y}
                      r={planetSize}
                      fill={GOLD}
                      opacity={0.3 + (sf.score / 100) * 0.4}
                    />
                  );
                })}

                {/* Sun halo */}
                <circle
                  cx={pos.x} cy={pos.y}
                  r={sunR * 2.5}
                  fill="url(#esc-halo-grad)"
                  opacity={isHovered ? 0.7 : 0.4}
                />

                {/* Sun body */}
                <circle
                  cx={pos.x} cy={pos.y}
                  r={sunR}
                  fill="url(#esc-orb-grad)"
                  filter="url(#esc-glow)"
                />

                {/* Corona rays (4 small lines) */}
                {[0, 90, 180, 270].map((a) => {
                  const cr = polar(pos.x, pos.y, sunR + 4, a);
                  const co = polar(pos.x, pos.y, sunR + 8 + (ray.score / 100) * 6, a);
                  return (
                    <line
                      key={a}
                      x1={cr.x} y1={cr.y}
                      x2={co.x} y2={co.y}
                      stroke={GOLD}
                      strokeWidth={1}
                      opacity={0.5}
                    />
                  );
                })}

                {/* Ray label */}
                <text
                  x={pos.x}
                  y={pos.y + sunR + 16}
                  fill={GOLD}
                  fontSize={9}
                  fontFamily="Orbitron, monospace"
                  fontWeight={700}
                  textAnchor="middle"
                  opacity={isHovered ? 1 : 0.7}
                  letterSpacing="0.08em"
                >
                  {ray.ray_name?.toUpperCase() ?? rayId}
                </text>

                {/* Score */}
                {!isBlurred && (
                  <text
                    x={pos.x}
                    y={pos.y + sunR + 26}
                    fill={GOLD}
                    fontSize={10}
                    fontFamily="Orbitron, monospace"
                    fontWeight={900}
                    textAnchor="middle"
                    opacity={0.9}
                  >
                    {ray.score}
                  </text>
                )}
              </motion.g>
            );
          })}

          {/* ── Layer 9: Central Sun (R9) ── */}
          <motion.g
            {...(prefersReduced ? {} : {
              initial: { opacity: 0, scale: 0 },
              animate: { opacity: 1, scale: 1 },
              transition: { delay: 0.3, duration: 0.8, type: 'spring' },
            })}
            style={{ transformOrigin: `${CX}px ${CY}px` }}
          >
            {/* Outermost halo */}
            <circle
              cx={CX} cy={CY}
              r={SUN_R * 3}
              fill="url(#esc-halo-grad)"
              filter="url(#esc-halo-filter)"
              opacity={0.5}
            >
              {!prefersReduced && (
                <animate
                  attributeName="opacity"
                  values="0.35;0.55;0.35"
                  dur="4s"
                  repeatCount="indefinite"
                />
              )}
            </circle>

            {/* Mid halo */}
            <circle
              cx={CX} cy={CY}
              r={SUN_R * 2}
              fill="url(#esc-halo-grad)"
              opacity={0.6}
            />

            {/* Inner halo */}
            <circle
              cx={CX} cy={CY}
              r={SUN_R * 1.4}
              fill="url(#esc-sun-grad)"
              opacity={0.4}
            />

            {/* Sun body */}
            <circle
              cx={CX} cy={CY}
              r={SUN_R}
              fill="url(#esc-sun-grad)"
              filter="url(#esc-sun-glow)"
            />

            {/* Corona rays — 12 sharp lines radiating outward */}
            {Array.from({ length: 12 }, (_, i) => {
              const a = i * 30;
              const intensity = 0.6 + (r9Score / 100) * 0.4;
              const len = SUN_R + 15 + (r9Score / 100) * 20;
              const inner = polar(CX, CY, SUN_R + 3, a);
              const outer = polar(CX, CY, len, a);
              return (
                <line
                  key={`corona-${i}`}
                  x1={inner.x} y1={inner.y}
                  x2={outer.x} y2={outer.y}
                  stroke={GOLD}
                  strokeWidth={i % 3 === 0 ? 2 : 1}
                  opacity={intensity * (i % 3 === 0 ? 0.7 : 0.35)}
                />
              );
            })}

            {/* R9 label */}
            <text
              x={CX}
              y={CY + SUN_R + 24}
              fill={GOLD}
              fontSize={10}
              fontFamily="Orbitron, monospace"
              fontWeight={900}
              textAnchor="middle"
              letterSpacing="0.12em"
            >
              BE THE LIGHT
            </text>
            <text
              x={CX}
              y={CY + SUN_R + 36}
              fill={GOLD}
              fontSize={14}
              fontFamily="Orbitron, monospace"
              fontWeight={900}
              textAnchor="middle"
              opacity={0.9}
            >
              {r9Score}
            </text>
          </motion.g>

          {/* ── Layer 10: Reticle crosshairs at segment boundaries ── */}
          <motion.g {...anim(0.6)}>
            {ORBIT_RAYS.map((_, i) => {
              const angle = i * SEGMENT_ANGLE - 90;
              const pos = polar(CX, CY, OUTER_RING, angle);
              return (
                <g key={`reticle-${i}`}>
                  <circle cx={pos.x} cy={pos.y} r={3} fill="none" stroke={GOLD} strokeWidth={0.5} opacity={0.4} />
                  <circle cx={pos.x} cy={pos.y} r={1} fill={GOLD} opacity={0.5} />
                </g>
              );
            })}
          </motion.g>

          {/* ── HUD annotation lines ── */}
          <motion.g {...anim(0.7)}>
            {/* Inner ring label */}
            <text
              x={CX}
              y={CY - ORBIT_MIN + 8}
              fill={GOLD}
              fontSize={7}
              fontFamily="Orbitron, monospace"
              textAnchor="middle"
              opacity={0.3}
              letterSpacing="0.1em"
            >
              CAPACITY FIELD
            </text>
          </motion.g>
        </svg>

        {/* ── Preview mode frost overlay ── */}
        {isPreview && (
          <div className="esc-frost-overlay">
            {/* Frost covers the bottom-right half (segments R5-R8) */}
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

            {/* CTA centered in blurred zone */}
            <div
              className="esc-cta-overlay"
              style={{
                right: '10%',
                bottom: '35%',
              }}
            >
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
          // Position panel outside the chart near the hovered sun
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
