'use client';

/**
 * IlluminateDashboard v3 — The Complete Merged Dashboard
 *
 * Design spec (Justin Ray, 2026-03-01):
 * - Background: Royal Purple var(--text-body)
 * - Primary accent: Solar Gold var(--text-body)
 * - East end: Purple Moon (dim)
 * - West end: SUN — glows in THAT RAY'S COLOR (the ray's neon color radiates out)
 * - Full ray names: "Ray of Intention", "Ray of Joy", etc.
 * - Mechanical 3D buttons (actual visual depth — pressed state)
 * - Conic gauge: cyan → amber sweep
 * - Insight card + Reps counter
 * - Orbitron + Space Grotesk fonts
 */

import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import { rayHex } from '@/lib/ui/ray-colors';

/* ── Brand tokens ──────────────────────────────────────── */
const BG      = 'var(--bg-deep)';
const GOLD    = 'var(--gold-primary)';
const CYAN    = 'var(--neon-cyan)';
const AMBER   = 'var(--text-body)';
const MAGENTA = 'var(--neon-pink)';
const PANEL   = 'var(--surface-border)';

/* ── Ray definitions ────────────────────────────────────── */
const RAYS = [
  { id:'R1', name:'Ray of Intention',     verb:'CHOOSE',  color:'var(--text-body)' },
  { id:'R2', name:'Ray of Joy',           verb:'EXPAND',  color:'var(--gold-primary)' },
  { id:'R3', name:'Ray of Presence',      verb:'ANCHOR',  color:'var(--neon-violet)' },
  { id:'R4', name:'Ray of Power',         verb:'ACT',     color:'var(--text-body)' },
  { id:'R5', name:'Ray of Purpose',       verb:'ALIGN',   color:'var(--neon-amber)' },
  { id:'R6', name:'Ray of Authenticity',  verb:'REVEAL',  color:'var(--text-body)' },
  { id:'R7', name:'Ray of Connection',    verb:'ATTUNE',  color:'var(--text-body)' },
  { id:'R8', name:'Ray of Possibility',   verb:'EXPLORE', color:'var(--text-body)' },
] as const;

const CORE_RAY = { id:'R9', name:'Be The Light', verb:'INSPIRE', color:'var(--gold-primary)' };

/* ── Orb states (5 levels per spec) ────────────────────── */
function orbState(score: number) {
  if (score >= 88) return { r: 20, rings: 3, bloom: 28, brightness: 1.0,  label: 'BLAZING'  };
  if (score >= 68) return { r: 14, rings: 2, bloom: 16, brightness: 0.85, label: 'RADIANT'  };
  if (score >= 45) return { r: 9,  rings: 1, bloom: 9,  brightness: 0.65, label: 'RISING'   };
  if (score >= 22) return { r: 6,  rings: 1, bloom: 5,  brightness: 0.45, label: 'EMERGING' };
  return               { r: 3,  rings: 0, bloom: 2,  brightness: 0.25, label: 'QUIET'    };
}

/* ── Props ──────────────────────────────────────────────── */
interface Props {
  scores?:       Partial<Record<string,number>>;
  eclipseLevel?: number;
  phase?:        'ECLIPSE'|'DAWN'|'RADIANT';
  repsToday?:    number;
  insight?:      string;
  className?:    string;
  onWatchMe?:    ()=>void;
  onGoFirst?:    ()=>void;
  onLogRep?:     ()=>void;
}

/* ══════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════ */
export default function IlluminateDashboard({
  scores = {}, eclipseLevel = 0, phase = 'ECLIPSE',
  repsToday = 0, insight, className,
  onWatchMe, onGoFirst, onLogRep,
}: Props) {

  const [reps, setReps] = useState(repsToday);
  const handleLogRep = useCallback(() => { setReps(r => r + 1); onLogRep?.(); }, [onLogRep]);

  const radiance = useMemo(() => {
    const vals = [...RAYS, CORE_RAY].map(r => scores[r.id] ?? 0);
    return Math.round(vals.reduce((a,b) => a+b, 0) / vals.length);
  }, [scores]);

  const phaseColor  = phase === 'RADIANT' ? GOLD : phase === 'DAWN' ? AMBER : MAGENTA;
  const defaultInsight = phase === 'RADIANT'
    ? 'The light is steady. The system is trained. Keep the reps clean.'
    : phase === 'DAWN'
    ? 'The light is building. One clean rep before the week closes.'
    : 'Not gone. Covered. The light responds to clean reps, not hype.';

  /* Scattered star dots */
  const dots = useMemo(() => {
    const C = [CYAN, GOLD, MAGENTA, AMBER, 'var(--neon-violet)','var(--text-body)','var(--text-body)','var(--text-body)'];
    return Array.from({ length: 70 }, (_, i) => {
      const a = ((i * 1597 + 143) * 6364136223) % 4294967296;
      const b = ((a * 1597 + 3) * 2654435761) % 4294967296;
      const c = ((b + i * 37) * 1664525) % 4294967296;
      const d = ((c * 1597 + 7) * 2246822519) % 4294967296;
      const n = (c % 10) < 3;
      return {
        x: (a % 10000) / 100, y: (b % 10000) / 100,
        size: n ? 1.5 + (c % 25) / 10 : 0.7,
        color: n ? C[d % C.length] : 'color-mix(in srgb, var(--text-body) 20%, transparent)',
        glow: n ? 3 + (d % 6) : 0,
        opacity: n ? 0.7 : 0.12 + (c % 25) / 100,
      };
    });
  }, []);

  return (
    <div
      className={`relative w-full select-none overflow-hidden ${className ?? ''}`}
      style={{
        background: BG,
        borderRadius: 20,
        fontFamily: "'Orbitron', system-ui, sans-serif",
        border: '1px solid color-mix(in srgb, var(--text-body) 6%, transparent)',
        animation: 'crtFlicker 8s ease-in-out infinite',
      }}
    >
      {/* Google fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Space+Grotesk:wght@400;500;600&display=swap');
        .illum-btn { transition: transform 0.07s ease, box-shadow 0.07s ease; cursor: pointer; }
        .illum-btn:active { transform: translateY(4px) !important; }
        @keyframes illum-pulse { 0%,100%{opacity:.6} 50%{opacity:1} }
        @keyframes illum-orbit { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes illum-star  { 0%,100%{opacity:.4;transform:scale(1)} 50%{opacity:1;transform:scale(1.4)} }
        @keyframes crtFlicker { 0%,100%{filter:brightness(1)} 50%{filter:brightness(.98)} }
        @keyframes gaugeSweep { 0%{stroke-dashoffset:0} 100%{stroke-dashoffset:-120} }
      `}</style>

      {/* Tron grid overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1, backgroundImage: 'linear-gradient(color-mix(in srgb, var(--neon-cyan) 8%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in srgb, var(--neon-cyan) 8%, transparent) 1px, transparent 1px)', backgroundSize: '36px 36px', opacity: 0.35 }} />

      {/* Star field */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
        {dots.map((d, i) => (
          <span key={i} className="absolute rounded-full" style={{
            left: `${d.x}%`, top: `${d.y}%`,
            width: d.size, height: d.size,
            background: d.color, opacity: d.opacity,
            boxShadow: d.glow ? `0 0 ${d.glow}px ${d.glow/2}px ${d.color}` : 'none',
            animation: d.glow ? `illum-star ${3 + i % 4}s ease-in-out ${i * 0.3 % 6}s infinite` : 'none',
          }} />
        ))}
      </div>

      {/* Scanlines */}
      <div className="absolute inset-0 pointer-events-none" style={{
        zIndex: 2, opacity: 0.035,
        backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 2px,var(--text-body) 2px,var(--text-body) 4px)',
      }} />

      {/* ══ TOP BAR ══════════════════════════════════════════ */}
      <div style={{
        position: 'relative', zIndex: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '18px 28px 14px',
        borderBottom: `1px solid var(--surface-border)`,
        background: 'color-mix(in srgb, var(--ink-950) 25%, transparent)',
      }}>
        {/* Brand */}
        <div>
          <div style={{ fontSize: 13, fontWeight: 900, letterSpacing: '.28em', color: GOLD, textShadow: `0 0 16px ${GOLD}` }}>
            143 LEADERSHIP
          </div>
          <div style={{ fontSize: 9, letterSpacing: '.18em', color: 'color-mix(in srgb, var(--text-body) 40%, transparent)', marginTop: 3, fontFamily: "'Space Grotesk',sans-serif" }}>
            LIGHT DASHBOARD · COMMAND CENTER
          </div>
        </div>

        {/* Conic gauge */}
        <ConicGauge value={radiance} phase={phase} />

        {/* Eclipse */}
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 9, letterSpacing: '.14em', color: 'color-mix(in srgb, var(--text-body) 35%, transparent)', fontFamily: "'Space Grotesk',sans-serif" }}>
            ECLIPSE LOAD
          </div>
          <div style={{ fontSize: 26, fontWeight: 900, color: MAGENTA, lineHeight: 1, textShadow: `0 0 18px ${MAGENTA}, 0 0 40px ${MAGENTA}55` }}>
            {eclipseLevel}%
          </div>
          <div style={{ fontSize: 8, letterSpacing: '.12em', color: phaseColor, marginTop: 2, textShadow: `0 0 8px ${phaseColor}` }}>
            {phase}
          </div>
        </div>
      </div>

      {/* ══ RAY TRACKS ═══════════════════════════════════════ */}
      <div style={{ position: 'relative', zIndex: 10, padding: '16px 0 8px' }}>
        {/* East / West labels */}
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 28px', marginBottom: 8 }}>
          <span style={{ fontSize: 8, letterSpacing: '.14em', color: 'color-mix(in srgb, var(--text-body) 28%, transparent)' }}>
            ← EAST · WHERE LIGHT ORIGINATES
          </span>
          <span style={{ fontSize: 8, letterSpacing: '.14em', color: `${GOLD}99` }}>
            WEST · WHERE LIGHT RADIATES →
          </span>
        </div>

        {/* Track panel */}
        <div style={{
          margin: '0 20px',
          background: PANEL,
          borderRadius: 16,
          border: '2px solid transparent',
          backgroundClip: 'padding-box',
          boxShadow: `0 0 0 2px ${MAGENTA}55, 0 0 40px ${MAGENTA}22, inset 0 1px 0 color-mix(in srgb, var(--text-body) 5%, transparent)`,
          padding: '12px 16px',
          position: 'relative',
        }}>
          {/* Neon border glow overlay */}
          <div style={{
            position: 'absolute', inset: -2, borderRadius: 18, pointerEvents: 'none',
            background: `linear-gradient(160deg, ${MAGENTA}66, ${GOLD}44, ${CYAN}22)`,
            zIndex: 0, opacity: 0.6,
            WebkitMask: 'linear-gradient(var(--text-body) 0 0) content-box, linear-gradient(var(--text-body) 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
            padding: 2,
          }} />

          {RAYS.map((ray, i) => (
            <RayTrack
              key={ray.id}
              ray={ray}
              score={scores[ray.id] ?? 0}
              isLast={i === RAYS.length - 1}
            />
          ))}
        </div>

        {/* R9 — Be The Light (special core) */}
        <div style={{ margin: '10px 20px 0', padding: '10px 16px', borderRadius: 12,
          background: `linear-gradient(90deg, color-mix(in srgb, var(--gold-primary) 8%, transparent), color-mix(in srgb, var(--gold-primary) 3%, transparent))`,
          border: `1px solid ${GOLD}33`,
        }}>
          <RayTrack ray={CORE_RAY} score={scores['R9'] ?? 0} isCore />
        </div>
      </div>

      {/* ══ ACTION BUTTONS ═══════════════════════════════════ */}
      <div style={{
        position: 'relative', zIndex: 10,
        padding: '14px 20px 14px',
        borderTop: `1px solid var(--surface-border)`,
        borderBottom: `1px solid var(--surface-border)`,
        background: 'color-mix(in srgb, var(--ink-950) 30%, transparent)',
      }}>
        <div style={{ fontSize: 8, letterSpacing: '.2em', color: 'color-mix(in srgb, var(--text-body) 25%, transparent)', marginBottom: 10, fontFamily: "'Space Grotesk',sans-serif" }}>
          ACTION CENTER
        </div>
        <div style={{ display: 'flex', gap: 14 }}>
          <MechButton
            label="WATCH ME"
            sub="COURAGE ACTIVATION"
            icon="▶"
            color={CYAN}
            glowColor={`${CYAN}66`}
            onClick={onWatchMe}
          />
          <MechButton
            label="GO FIRST"
            sub="HESITATION OVERRIDE"
            icon="⚡"
            color={AMBER}
            glowColor={`${AMBER}66`}
            onClick={onGoFirst}
          />
          <MechButton
            label="LOG REPS"
            sub="CAPTURE + RECORD"
            icon="✦"
            color={GOLD}
            glowColor={`${GOLD}44`}
            ghost
            onClick={handleLogRep}
          />
        </div>
      </div>

      {/* ══ BOTTOM BAR ═══════════════════════════════════════ */}
      <div style={{
        position: 'relative', zIndex: 10,
        display: 'flex', gap: 14, padding: '14px 20px 18px', alignItems: 'stretch',
      }}>
        {/* Weekly insight */}
        <div style={{
          flex: 1, background: 'color-mix(in srgb, var(--ink-950) 45%, transparent)', borderRadius: 14,
          padding: '14px 18px', border: `1px solid ${MAGENTA}22`,
          fontFamily: "'Space Grotesk',sans-serif",
        }}>
          <div style={{ fontSize: 9, letterSpacing: '.18em', color: MAGENTA, marginBottom: 8,
            textShadow: `0 0 10px ${MAGENTA}`, fontFamily: "'Orbitron',sans-serif" }}>
            THIS WEEK
          </div>
          <div style={{ fontSize: 13, color: 'color-mix(in srgb, var(--text-body) 88%, transparent)', lineHeight: 1.6, fontStyle: 'italic' }}>
            &ldquo;{insight ?? defaultInsight}&rdquo;
          </div>
          <div style={{ fontSize: 8, color: 'color-mix(in srgb, var(--text-body) 25%, transparent)', marginTop: 10 }}>
            The light responds to clean reps, not hype.
          </div>
        </div>

        {/* Reps counter */}
        <div style={{
          minWidth: 130, background: 'color-mix(in srgb, var(--ink-950) 55%, transparent)', borderRadius: 14,
          padding: '14px 18px', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          border: `1px solid ${GOLD}44`,
          boxShadow: `0 0 20px ${GOLD}11`,
        }}>
          <div style={{ fontSize: 9, letterSpacing: '.18em', color: 'color-mix(in srgb, var(--text-body) 35%, transparent)',
            fontFamily: "'Orbitron',sans-serif", marginBottom: 6 }}>
            REPS TODAY
          </div>
          <div style={{ fontSize: 48, fontWeight: 900, color: GOLD, lineHeight: 1,
            textShadow: `0 0 24px ${GOLD}, 0 0 50px ${GOLD}55` }}>
            {reps}
          </div>
          <div style={{ fontSize: 8, letterSpacing: '.1em', color: `${GOLD}88`, marginTop: 6,
            fontFamily: "'Space Grotesk',sans-serif" }}>
            TOTAL · THIS SESSION
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   RAY TRACK — individual slider row
══════════════════════════════════════════════════════════ */
function RayTrack({ ray, score, isLast = false, isCore = false }: {
  ray: { id:string; name:string; verb:string; color:string };
  score: number;
  isLast?: boolean;
  isCore?: boolean;
}) {
  const [display, setDisplay] = useState(0);
  const target = useRef(score);
  const cur    = useRef(0);
  const vel    = useRef(0);
  const raf    = useRef<number>(0);

  useEffect(() => { target.current = score; }, [score]);
  useEffect(() => {
    function tick() {
      const d = target.current - cur.current;
      vel.current = vel.current * 0.80 + d * 0.06;
      cur.current += vel.current;
      setDisplay(cur.current);
      if (Math.abs(d) > 0.2) raf.current = requestAnimationFrame(tick);
    }
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, []);

  const pct   = Math.max(0, Math.min(100, display)) / 100;
  const orb   = orbState(display);
  const color = ray.color;

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      paddingBottom: isLast || isCore ? 0 : 10,
      marginBottom: isLast || isCore ? 0 : 10,
      borderBottom: isLast || isCore ? 'none' : '1px solid color-mix(in srgb, var(--text-body) 4%, transparent)',
    }}>
      {/* Ray label */}
      <div style={{ minWidth: isCore ? 120 : 156, flexShrink: 0 }}>
        <div style={{ fontSize: isCore ? 10 : 9, fontWeight: 700, letterSpacing: '.1em',
          color, textShadow: `0 0 8px ${color}88`, lineHeight: 1 }}>
          {ray.verb}
        </div>
        <div style={{ fontSize: isCore ? 9 : 8, color: 'color-mix(in srgb, var(--text-body) 50%, transparent)',
          letterSpacing: '.05em', marginTop: 2, fontFamily: "'Space Grotesk',sans-serif" }}>
          {ray.name}
        </div>
      </div>

      {/* Moon (east) */}
      <div style={{ flexShrink: 0, width: 28, height: 28, position: 'relative' }}>
        <Image src="/images/purple-moon-143.svg" alt="moon" fill
               style={{ opacity: 0.7, filter: 'drop-shadow(0 0 4px var(--text-body))' }}/>
      </div>

      {/* Track */}
      <div style={{ flex: 1, position: 'relative', height: 36, display: 'flex', alignItems: 'center' }}>
        {/* Rail bg */}
        <div style={{
          position: 'absolute', left: 0, right: 0, height: 4, borderRadius: 99,
          background: `linear-gradient(90deg, var(--surface-border) 0%, ${color}22 50%, ${color}55 100%)`,
          boxShadow: `inset 0 0 0 1px color-mix(in srgb, var(--neon-cyan) 20%, transparent)`,
          backgroundImage: `repeating-linear-gradient(180deg, color-mix(in srgb, var(--ink-950) 0%, transparent) 0px, color-mix(in srgb, var(--ink-950) 0%, transparent) 1px, color-mix(in srgb, var(--ink-950) 25%, transparent) 2px)`,
        }} />
        {/* Filled progress */}
        {pct > 0 && <div style={{
          position: 'absolute', left: 0, height: 4, borderRadius: 99,
          width: `${pct * 100}%`,
          background: `linear-gradient(90deg, var(--surface-border), ${color})`,
          boxShadow: `0 0 8px ${color}88`,
          transition: 'width 0.05s linear',
        }} />}

        {/* Tick marks */}
        {[20,40,60,80].map(t => (
          <div key={t} style={{
            position: 'absolute', left: `${t}%`, top: '50%', transform: 'translate(-50%,-50%)',
            width: 1, height: 8, background: 'color-mix(in srgb, var(--text-body) 10%, transparent)',
          }} />
        ))}

        {/* Orb */}
        <div style={{
          position: 'absolute',
          left: `calc(${pct * 100}% - ${orb.r}px)`,
          top: '50%', transform: 'translateY(-50%)',
          width: orb.r * 2, height: orb.r * 2, borderRadius: '50%',
          background: display >= 68
            ? `radial-gradient(circle at 40% 35%, var(--text-body), ${color})`
            : `radial-gradient(circle at 40% 35%, ${color}, var(--surface-border))`,
          boxShadow: `0 0 ${orb.bloom}px ${color}, 0 0 ${orb.bloom*2}px ${color}44`,
          transition: 'left 0.05s linear',
          zIndex: 5,
        }} />

        {/* Score label */}
        <div style={{
          position: 'absolute', left: `${pct * 100}%`, top: -14,
          transform: 'translateX(-50%)', fontSize: 8, fontWeight: 700,
          color, textShadow: `0 0 6px ${color}`,
          whiteSpace: 'nowrap',
        }}>
          {Math.round(display)}
        </div>
      </div>

      {/* Sun (west) — glows in RAY'S color */}
      <div style={{ flexShrink: 0, width: 36, height: 36, position: 'relative' }}>
        {/* Glow halo in ray color */}
        <div style={{
          position: 'absolute', inset: -8, borderRadius: '50%',
          background: color,
          opacity: 0.15 + (display / 100) * 0.4,
          filter: `blur(8px)`,
          animation: 'illum-pulse 3s ease-in-out infinite',
        }} />
        <Image src="/images/sun-143.svg" alt="sun" fill
               style={{
                 filter: `drop-shadow(0 0 ${6 + display / 8}px ${color}) drop-shadow(0 0 ${12 + display/5}px ${color}88)`,
                 opacity: 0.6 + (display / 100) * 0.4,
               }}/>
      </div>

      {/* Score badge */}
      <div style={{
        minWidth: 42, textAlign: 'right', fontSize: 11, fontWeight: 700,
        color, textShadow: `0 0 8px ${color}`,
        fontFamily: "'Orbitron',sans-serif",
      }}>
        {Math.round(display)}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   CONIC GAUGE — weekly average ring
══════════════════════════════════════════════════════════ */
function ConicGauge({ value, phase }: { value: number; phase: string }) {
  const r = 48, cx = 60, cy = 60;
  const circ = 2 * Math.PI * r;
  const arc  = circ * (value / 100);
  const pColor = phase === 'RADIANT' ? GOLD : phase === 'DAWN' ? AMBER : MAGENTA;

  return (
    <div style={{ position: 'relative', width: 120, height: 120, flexShrink: 0 }}>
      <svg viewBox="0 0 120 120" style={{ width: '100%', height: '100%' }}>
        <defs>
          <linearGradient id="gArc" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor={MAGENTA} />
            <stop offset="100%" stopColor={MAGENTA}/>
          </linearGradient>
        </defs>
        {/* Track */}
        <circle cx={cx} cy={cy} r={r} fill="none"
                stroke="color-mix(in srgb, var(--text-body) 7%, transparent)" strokeWidth="10"/>
        {/* Arc */}
        <circle cx={cx} cy={cy} r={r} fill="none"
                stroke="url(#gArc)" strokeWidth="10"
                strokeDasharray={`${arc} ${circ}`}
                strokeLinecap="round"
                transform={`rotate(-90 ${cx} ${cy})`}
                style={{ filter: `drop-shadow(0 0 10px ${MAGENTA}) drop-shadow(0 0 22px ${MAGENTA})`, animation: 'gaugeSweep 4s linear infinite' }}/>
        {/* Value */}
        <text x={cx} y={cy - 5} textAnchor="middle" fill={GOLD}
              fontSize="22" fontWeight="900"
              style={{ filter: `drop-shadow(0 0 14px ${GOLD})` }}>
          {value}
        </text>
        <text x={cx} y={cy + 10} textAnchor="middle"
              fill="color-mix(in srgb, var(--text-body) 35%, transparent)" fontSize="7" letterSpacing=".1em">
          WEEKLY AVG
        </text>
        <text x={cx} y={cy + 24} textAnchor="middle"
              fill={pColor} fontSize="8" fontWeight="700" letterSpacing=".15em"
              style={{ filter: `drop-shadow(0 0 6px ${pColor})` }}>
          {phase}
        </text>
      </svg>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   MECH BUTTON — 3D physical button
══════════════════════════════════════════════════════════ */
function MechButton({
  label, sub, icon, color, glowColor, ghost = false, onClick,
}: {
  label: string; sub: string; icon: string;
  color: string; glowColor: string;
  ghost?: boolean; onClick?: () => void;
}) {
  const [pressed, setPressed] = useState(false);

  return (
    <button
      className="illum-btn"
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      onClick={onClick}
      style={{
        flex: 1,
        border: 'none',
        borderRadius: 12,
        padding: '0',
        cursor: 'pointer',
        outline: 'none',
        userSelect: 'none',
        position: 'relative',
        background: 'transparent',
      }}
    >
      {/* Button body */}
      <div style={{
        borderRadius: 12,
        padding: '12px 10px 8px',
        background: ghost
          ? 'color-mix(in srgb, var(--ink-950) 10%, transparent)'
          : `radial-gradient(ellipse at 50% 20%, ${color}33 0%, var(--surface-border) 70%)`,
        border: `2px solid ${color}`,
        boxShadow: pressed
          ? `inset 0 6px 16px color-mix(in srgb, var(--ink-950) 90%, transparent), 0 0 8px ${glowColor}`
          : `0 6px 0 color-mix(in srgb, var(--ink-950) 70%, transparent), 0 0 24px ${glowColor}, inset 0 1px 0 color-mix(in srgb, var(--text-body) 15%, transparent), inset 0 -1px 0 color-mix(in srgb, var(--ink-950) 50%, transparent)`,
        transform: pressed ? 'translateY(5px)' : 'translateY(0)',
        transition: 'transform 0.07s ease, box-shadow 0.07s ease',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
      }}>
        {/* Icon */}
        <div style={{
          fontSize: 18, color,
          textShadow: `0 0 12px ${color}`,
          lineHeight: 1,
        }}>
          {icon}
        </div>
        {/* Label */}
        <div style={{
          fontSize: 11, fontWeight: 900, letterSpacing: '.16em',
          color, textShadow: `0 0 12px ${color}`,
          fontFamily: "'Orbitron',sans-serif", lineHeight: 1.1,
        }}>
          {label}
        </div>
        {/* Sub */}
        <div style={{
          fontSize: 7.5, letterSpacing: '.1em',
          color: 'color-mix(in srgb, var(--text-body) 38%, transparent)',
          fontFamily: "'Space Grotesk',sans-serif",
        }}>
          {sub}
        </div>
      </div>
    </button>
  );
}
