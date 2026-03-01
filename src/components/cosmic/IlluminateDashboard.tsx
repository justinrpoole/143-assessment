'use client';

/**
 * IlluminateDashboard v3 — The Complete Merged Dashboard
 *
 * Design spec (Justin Ray, 2026-03-01):
 * - Background: Royal Purple #4A0E78
 * - Primary accent: Solar Gold #F4C430
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
const BG      = '#4A0E78';
const GOLD    = '#F4C430';
const CYAN    = '#25F6FF';
const AMBER   = '#FFD166';
const MAGENTA = '#FF3FB4';
const PANEL   = 'rgba(8,2,22,0.88)';

/* ── Ray definitions ────────────────────────────────────── */
const RAYS = [
  { id:'R1', name:'Ray of Intention',     verb:'CHOOSE',  color:'#60A5FA' },
  { id:'R2', name:'Ray of Joy',           verb:'EXPAND',  color:'#F4C430' },
  { id:'R3', name:'Ray of Presence',      verb:'ANCHOR',  color:'#8E44AD' },
  { id:'R4', name:'Ray of Power',         verb:'ACT',     color:'#C0392B' },
  { id:'R5', name:'Ray of Purpose',       verb:'ALIGN',   color:'#D4770B' },
  { id:'R6', name:'Ray of Authenticity',  verb:'REVEAL',  color:'#2ECC71' },
  { id:'R7', name:'Ray of Connection',    verb:'ATTUNE',  color:'#E74C8B' },
  { id:'R8', name:'Ray of Possibility',   verb:'EXPLORE', color:'#1ABC9C' },
] as const;

const CORE_RAY = { id:'R9', name:'Be The Light', verb:'INSPIRE', color:'#F8D011' };

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
    const C = [CYAN, GOLD, MAGENTA, AMBER, '#8E44AD','#2ECC71','#E74C8B','#1ABC9C'];
    return Array.from({ length: 70 }, (_, i) => {
      const a = ((i * 1597 + 143) * 6364136223) % 4294967296;
      const b = ((a * 1597 + 3) * 2654435761) % 4294967296;
      const c = ((b + i * 37) * 1664525) % 4294967296;
      const d = ((c * 1597 + 7) * 2246822519) % 4294967296;
      const n = (c % 10) < 3;
      return {
        x: (a % 10000) / 100, y: (b % 10000) / 100,
        size: n ? 1.5 + (c % 25) / 10 : 0.7,
        color: n ? C[d % C.length] : 'rgba(255,255,255,0.2)',
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
        border: '1px solid rgba(255,255,255,0.06)',
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
      `}</style>

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
        backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 2px,#000 2px,#000 4px)',
      }} />

      {/* ══ TOP BAR ══════════════════════════════════════════ */}
      <div style={{
        position: 'relative', zIndex: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '18px 28px 14px',
        borderBottom: `1px solid rgba(244,196,48,0.14)`,
        background: 'rgba(0,0,0,0.25)',
      }}>
        {/* Brand */}
        <div>
          <div style={{ fontSize: 13, fontWeight: 900, letterSpacing: '.28em', color: GOLD, textShadow: `0 0 16px ${GOLD}` }}>
            143 LEADERSHIP
          </div>
          <div style={{ fontSize: 9, letterSpacing: '.18em', color: 'rgba(255,255,255,0.4)', marginTop: 3, fontFamily: "'Space Grotesk',sans-serif" }}>
            LIGHT DASHBOARD · COMMAND CENTER
          </div>
        </div>

        {/* Conic gauge */}
        <ConicGauge value={radiance} phase={phase} />

        {/* Eclipse */}
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 9, letterSpacing: '.14em', color: 'rgba(255,255,255,0.35)', fontFamily: "'Space Grotesk',sans-serif" }}>
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
          <span style={{ fontSize: 8, letterSpacing: '.14em', color: 'rgba(255,255,255,0.28)' }}>
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
          boxShadow: `0 0 0 2px ${MAGENTA}55, 0 0 40px ${MAGENTA}22, inset 0 1px 0 rgba(255,255,255,0.05)`,
          padding: '12px 16px',
          position: 'relative',
        }}>
          {/* Neon border glow overlay */}
          <div style={{
            position: 'absolute', inset: -2, borderRadius: 18, pointerEvents: 'none',
            background: `linear-gradient(160deg, ${MAGENTA}66, ${GOLD}44, ${CYAN}22)`,
            zIndex: 0, opacity: 0.6,
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
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
          background: `linear-gradient(90deg, rgba(248,208,17,0.08), rgba(248,208,17,0.03))`,
          border: `1px solid ${GOLD}33`,
        }}>
          <RayTrack ray={CORE_RAY} score={scores['R9'] ?? 0} isCore />
        </div>
      </div>

      {/* ══ ACTION BUTTONS ═══════════════════════════════════ */}
      <div style={{
        position: 'relative', zIndex: 10,
        padding: '14px 20px 14px',
        borderTop: `1px solid rgba(244,196,48,0.1)`,
        borderBottom: `1px solid rgba(244,196,48,0.1)`,
        background: 'rgba(0,0,0,0.3)',
      }}>
        <div style={{ fontSize: 8, letterSpacing: '.2em', color: 'rgba(255,255,255,0.25)', marginBottom: 10, fontFamily: "'Space Grotesk',sans-serif" }}>
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
          flex: 1, background: 'rgba(0,0,0,0.45)', borderRadius: 14,
          padding: '14px 18px', border: `1px solid ${MAGENTA}22`,
          fontFamily: "'Space Grotesk',sans-serif",
        }}>
          <div style={{ fontSize: 9, letterSpacing: '.18em', color: MAGENTA, marginBottom: 8,
            textShadow: `0 0 10px ${MAGENTA}`, fontFamily: "'Orbitron',sans-serif" }}>
            THIS WEEK
          </div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.88)', lineHeight: 1.6, fontStyle: 'italic' }}>
            &ldquo;{insight ?? defaultInsight}&rdquo;
          </div>
          <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.25)', marginTop: 10 }}>
            The light responds to clean reps, not hype.
          </div>
        </div>

        {/* Reps counter */}
        <div style={{
          minWidth: 130, background: 'rgba(0,0,0,0.55)', borderRadius: 14,
          padding: '14px 18px', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          border: `1px solid ${GOLD}44`,
          boxShadow: `0 0 20px ${GOLD}11`,
        }}>
          <div style={{ fontSize: 9, letterSpacing: '.18em', color: 'rgba(255,255,255,0.35)',
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
      borderBottom: isLast || isCore ? 'none' : '1px solid rgba(255,255,255,0.04)',
    }}>
      {/* Ray label */}
      <div style={{ minWidth: isCore ? 120 : 156, flexShrink: 0 }}>
        <div style={{ fontSize: isCore ? 10 : 9, fontWeight: 700, letterSpacing: '.1em',
          color, textShadow: `0 0 8px ${color}88`, lineHeight: 1 }}>
          {ray.verb}
        </div>
        <div style={{ fontSize: isCore ? 9 : 8, color: 'rgba(255,255,255,0.5)',
          letterSpacing: '.05em', marginTop: 2, fontFamily: "'Space Grotesk',sans-serif" }}>
          {ray.name}
        </div>
      </div>

      {/* Moon (east) */}
      <div style={{ flexShrink: 0, width: 28, height: 28, position: 'relative' }}>
        <Image src="/images/purple-moon-143.svg" alt="moon" fill
               style={{ opacity: 0.7, filter: 'drop-shadow(0 0 4px #7c2cff)' }}/>
      </div>

      {/* Track */}
      <div style={{ flex: 1, position: 'relative', height: 36, display: 'flex', alignItems: 'center' }}>
        {/* Rail bg */}
        <div style={{
          position: 'absolute', left: 0, right: 0, height: 4, borderRadius: 99,
          background: `linear-gradient(90deg, rgba(124,44,255,0.5) 0%, ${color}22 50%, ${color}55 100%)`,
        }} />
        {/* Filled progress */}
        {pct > 0 && <div style={{
          position: 'absolute', left: 0, height: 4, borderRadius: 99,
          width: `${pct * 100}%`,
          background: `linear-gradient(90deg, rgba(124,44,255,0.7), ${color})`,
          boxShadow: `0 0 8px ${color}88`,
          transition: 'width 0.05s linear',
        }} />}

        {/* Tick marks */}
        {[20,40,60,80].map(t => (
          <div key={t} style={{
            position: 'absolute', left: `${t}%`, top: '50%', transform: 'translate(-50%,-50%)',
            width: 1, height: 8, background: 'rgba(255,255,255,0.1)',
          }} />
        ))}

        {/* Orb */}
        <div style={{
          position: 'absolute',
          left: `calc(${pct * 100}% - ${orb.r}px)`,
          top: '50%', transform: 'translateY(-50%)',
          width: orb.r * 2, height: orb.r * 2, borderRadius: '50%',
          background: display >= 68
            ? `radial-gradient(circle at 40% 35%, #fff, ${color})`
            : `radial-gradient(circle at 40% 35%, ${color}, rgba(80,20,160,0.9))`,
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
            <stop offset="0%"   stopColor={CYAN} />
            <stop offset="100%" stopColor={AMBER}/>
          </linearGradient>
        </defs>
        {/* Track */}
        <circle cx={cx} cy={cy} r={r} fill="none"
                stroke="rgba(255,255,255,0.07)" strokeWidth="10"/>
        {/* Arc */}
        <circle cx={cx} cy={cy} r={r} fill="none"
                stroke="url(#gArc)" strokeWidth="10"
                strokeDasharray={`${arc} ${circ}`}
                strokeLinecap="round"
                transform={`rotate(-90 ${cx} ${cy})`}
                style={{ filter: `drop-shadow(0 0 8px ${CYAN})` }}/>
        {/* Value */}
        <text x={cx} y={cy - 5} textAnchor="middle" fill={GOLD}
              fontSize="19" fontWeight="900"
              style={{ filter: `drop-shadow(0 0 10px ${GOLD})` }}>
          {value}
        </text>
        <text x={cx} y={cy + 10} textAnchor="middle"
              fill="rgba(255,255,255,0.35)" fontSize="7" letterSpacing=".1em">
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
          ? 'rgba(0,0,0,0.1)'
          : `radial-gradient(ellipse at 50% 20%, ${color}33 0%, rgba(8,2,22,0.9) 70%)`,
        border: `2px solid ${color}`,
        boxShadow: pressed
          ? `inset 0 6px 16px rgba(0,0,0,0.9), 0 0 8px ${glowColor}`
          : `0 6px 0 rgba(0,0,0,0.7), 0 0 24px ${glowColor}, inset 0 1px 0 rgba(255,255,255,0.15), inset 0 -1px 0 rgba(0,0,0,0.5)`,
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
          color: 'rgba(255,255,255,0.38)',
          fontFamily: "'Space Grotesk',sans-serif",
        }}>
          {sub}
        </div>
      </div>
    </button>
  );
}
