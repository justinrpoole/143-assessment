'use client';

/**
 * IlluminateDashboard v2
 * Spec: 143-LEADERSHIP-LIGHT-DASHBOARD.pptx + 143-Light-Dashboard.pptx
 *
 * Colors (corrected by Justin):
 *   Background : #4A0E78  (deep royal purple — "deep navy" = our purple)
 *   Primary    : #F4C430  (solar gold — second brand color)
 *   Signal     : #25F6FF  (neon cyan)
 *   Warmth     : #FFD166  (solar amber)
 *   Alert      : #FF3FB4  (magenta pulse)
 *   Border     : pink #ff2bd6 → orange #ff7a18 gradient
 *
 * Layout (per spec):
 *   Top 10%    — brand label left + weekly average gauge right
 *   Center 60% — 8 full-width ray tracks (the main feature)
 *   Action 15% — WATCH ME · GO FIRST · LOG REPS buttons
 *   Bottom 15% — weekly insight card + REPS TODAY counter
 *
 * Orb states (5 levels per spec):
 *   10 → 4px  dim purple-gray
 *   30 → 8px  purple-gold, thin halo
 *   50 → 16px white-gold ring forming
 *   75 → 24px white-gold core, 3 amber rings
 *   95 → 36px blazing sun, thick rings + bloom
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import { rayHex } from '@/lib/ui/ray-colors';

/* ── Constants ─────────────────────────────────────────── */
const BG      = '#4A0E78';   // deep royal purple
const GOLD    = '#F4C430';   // solar gold (brand secondary)
const CYAN    = '#25F6FF';   // neon cyan
const AMBER   = '#FFD166';   // solar amber
const MAGENTA = '#FF3FB4';   // magenta pulse
const DARK    = 'rgba(10,4,28,0.85)'; // panel overlay

const RAY8  = ['R1','R2','R3','R4','R5','R6','R7','R8'] as const;
const RAY9  = ['R1','R2','R3','R4','R5','R6','R7','R8','R9'] as const;

const RAY_LABELS: Record<string,string> = {
  R1:'CHOOSE · INTENTION', R2:'EXPAND · JOY', R3:'ANCHOR · PRESENCE',
  R4:'ACT · POWER', R5:'ALIGN · PURPOSE', R6:'REVEAL · AUTHENTICITY',
  R7:'ATTUNE · CONNECTION', R8:'EXPLORE · POSSIBILITY', R9:'INSPIRE · BE THE LIGHT',
};
const RAY_SHORT: Record<string,string> = {
  R1:'CHOOSE', R2:'EXPAND', R3:'ANCHOR', R4:'ACT',
  R5:'ALIGN',  R6:'REVEAL', R7:'ATTUNE', R8:'EXPLORE', R9:'INSPIRE',
};

/* SVG geometry */
const LX=100, RX=1100, TY=70, GY=52;
const ry=(i:number)=>TY+i*GY;
const toX=(v:number)=>LX+(RX-LX)*Math.max(0,Math.min(100,v))/100;

/* Orb spec — 5 states */
function orbSpec(score:number){ 
  if(score>=90) return {r:18,rings:3,bloom:24,fill:'#fff8e0',stroke:GOLD,glow:GOLD,opacity:.97};
  if(score>=70) return {r:12,rings:2,bloom:14,fill:'#ffe87a',stroke:AMBER,glow:AMBER,opacity:.93};
  if(score>=45) return {r:8, rings:1,bloom:8, fill:'#c8a0ff',stroke:'#d0a0ff',glow:'#b070ff',opacity:.88};
  if(score>=20) return {r:5, rings:1,bloom:4, fill:'#9060cc',stroke:'#a070dd',glow:'#8050bb',opacity:.78};
  return              {r:3, rings:0,bloom:2, fill:'#5030aa',stroke:'#6040bb',glow:'#4020aa',opacity:.55};
}

/* ── Types ─────────────────────────────────────────────── */
interface Props {
  scores?:    Partial<Record<string,number>>;
  eclipseLevel?: number;
  phase?:     'ECLIPSE'|'DAWN'|'RADIANT';
  repsToday?: number;
  insight?:   string;
  className?: string;
  onWatchMe?: ()=>void;
  onGoFirst?: ()=>void;
  onLogRep?:  ()=>void;
}

/* ── Component ─────────────────────────────────────────── */
export default function IlluminateDashboard({
  scores={}, eclipseLevel=0, phase='ECLIPSE',
  repsToday=0, insight, className,
  onWatchMe, onGoFirst, onLogRep,
}: Props) {

  /* Spring animation */
  const [pos, setPos] = useState<number[]>(RAY8.map(()=>LX));
  const tgt = useRef<number[]>(RAY8.map(k=>toX(scores[k]??0)));
  const cur = useRef<number[]>(RAY8.map(()=>LX));
  const vel = useRef<number[]>(RAY8.map(()=>0));
  const raf = useRef<number>(0);

  useEffect(()=>{ tgt.current=RAY8.map(k=>toX(scores[k]??0)); },[scores]);
  useEffect(()=>{
    function tick(){
      let busy=false;
      const next=cur.current.map((x,i)=>{
        const d=tgt.current[i]-x;
        vel.current[i]=vel.current[i]*.82+d*.055;
        const nx=x+vel.current[i];
        if(Math.abs(d)>.15) busy=true;
        return nx;
      });
      cur.current=next; setPos([...next]);
      if(busy) raf.current=requestAnimationFrame(tick);
    }
    raf.current=requestAnimationFrame(tick);
    return ()=>cancelAnimationFrame(raf.current);
  },[]);

  const radiance=useMemo(()=>{
    const v=RAY9.map(k=>scores[k]??0);
    return Math.round(v.reduce((a,b)=>a+b,0)/v.length);
  },[scores]);

  const phaseColor = phase==='RADIANT'?GOLD:phase==='DAWN'?AMBER:MAGENTA;
  const defaultInsight = phase==='RADIANT'
    ? 'The light is steady. The system is trained. Keep the reps clean.'
    : phase==='DAWN'
    ? 'The light is building. One clean rep before the week closes.'
    : 'Not gone. Covered. The light responds to clean reps, not hype.';

  const [reps, setReps] = useState(repsToday);
  function handleLogRep(){ setReps(r=>r+1); onLogRep?.(); }

  /* Star dots */
  const dots=useMemo(()=>{
    const C=[CYAN,GOLD,MAGENTA,AMBER,'#8E44AD','#2ECC71','#E74C8B','#1ABC9C'];
    return Array.from({length:60},(_,i)=>{
      const a=((i*1597+143)*6364136223)%4294967296;
      const b=((a*1597+3)*2654435761)%4294967296;
      const c=((b+i*37)*1664525)%4294967296;
      const d=((c*1597+7)*2246822519)%4294967296;
      const n=(c%10)<3;
      return {x:(a%10000)/100,y:(b%10000)/100,
        size:n?1.5+(c%25)/10:.7,color:n?C[d%C.length]:'rgba(255,255,255,0.18)',
        glow:n?3+(d%6):0,opacity:n?.75:.12+(c%25)/100};
    });
  },[]);

  return (
    <div className={`relative w-full select-none ${className??''}`}
         style={{background:BG,borderRadius:20,overflow:'hidden',fontFamily:"'Orbitron',system-ui,sans-serif"}}>

      {/* Google Font load */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Space+Grotesk:wght@400;500;600&display=swap');`}</style>

      {/* Star field */}
      <div className="absolute inset-0 pointer-events-none" style={{zIndex:1}}>
        {dots.map((d,i)=>(
          <span key={i} className="absolute rounded-full" style={{
            left:`${d.x}%`,top:`${d.y}%`,width:d.size,height:d.size,
            background:d.color,opacity:d.opacity,
            boxShadow:d.glow?`0 0 ${d.glow}px ${d.glow/2}px ${d.color}`:'none',
          }}/>
        ))}
      </div>

      {/* Scanlines overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{
        zIndex:2,opacity:.04,
        backgroundImage:'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,1) 2px,rgba(0,0,0,1) 4px)',
      }}/>

      {/* ── TOP BAR ── */}
      <div style={{position:'relative',zIndex:10,display:'flex',alignItems:'center',
        justifyContent:'space-between',padding:'16px 24px 8px',borderBottom:`1px solid rgba(244,196,48,.15)`}}>
        {/* Brand */}
        <div>
          <div style={{fontSize:11,fontWeight:900,letterSpacing:'.25em',color:GOLD,
            textShadow:`0 0 12px ${GOLD}`,lineHeight:1}}>
            143 LEADERSHIP
          </div>
          <div style={{fontSize:9,letterSpacing:'.15em',color:'rgba(255,255,255,.45)',
            marginTop:3,fontFamily:"'Space Grotesk',sans-serif"}}>
            LIGHT DASHBOARD
          </div>
        </div>

        {/* Weekly average gauge */}
        <ConicGauge value={radiance} phase={phase}/>

        {/* Eclipse badge */}
        <div style={{textAlign:'right'}}>
          <div style={{fontSize:9,letterSpacing:'.15em',color:'rgba(255,255,255,.4)',
            fontFamily:"'Space Grotesk',sans-serif"}}>ECLIPSE LOAD</div>
          <div style={{fontSize:22,fontWeight:900,color:MAGENTA,lineHeight:1,
            textShadow:`0 0 14px ${MAGENTA}`}}>
            {eclipseLevel}%
          </div>
        </div>
      </div>

      {/* ── CENTER: 8 RAY TRACKS ── */}
      <div style={{position:'relative',zIndex:10,padding:'12px 0 4px'}}>
        {/* East/West labels */}
        <div style={{display:'flex',justifyContent:'space-between',padding:'0 24px',marginBottom:4}}>
          <span style={{fontSize:8,letterSpacing:'.12em',color:'rgba(255,255,255,.3)'}}>
            EAST · WHERE LIGHT ORIGINATES
          </span>
          <span style={{fontSize:8,letterSpacing:'.12em',color:GOLD,opacity:.6}}>
            WEST · WHERE LIGHT RADIATES →
          </span>
        </div>

        <svg viewBox={`0 0 1200 ${TY*2+GY*7+20}`} preserveAspectRatio="xMidYMid meet"
             style={{width:'100%',display:'block',overflow:'visible'}}>
          <defs>
            <filter id="dGM" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="2.5" result="b"/>
              <feColorMatrix in="b" type="matrix" values="1 0 0 0 0  0 0.2 0 0 0  0 0 1 0 0  0 0 0 .9 0" result="c"/>
              <feMerge><feMergeNode in="c"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <filter id="dGG" x="-70%" y="-70%" width="240%" height="240%">
              <feGaussianBlur stdDeviation="4" result="b"/>
              <feColorMatrix in="b" type="matrix" values="1 0 0 0 0  0 0.75 0 0 0  0 0 0.1 0 0  0 0 0 1 0" result="c"/>
              <feMerge><feMergeNode in="c"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <filter id="dGC" x="-70%" y="-70%" width="240%" height="240%">
              <feGaussianBlur stdDeviation="3" result="b"/>
              <feColorMatrix in="b" type="matrix" values="0 0 0 0 0.15  0 0.9 0.9 0 0  0 0 1 0 1  0 0 0 1 0" result="c"/>
              <feMerge><feMergeNode in="c"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <linearGradient id="dBorder" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#ff2bd6" stopOpacity=".95"/>
              <stop offset="1" stopColor="#ff7a18" stopOpacity=".95"/>
            </linearGradient>
            <linearGradient id="dRail" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0"   stopColor="#7c2cff" stopOpacity=".6"/>
              <stop offset=".5"  stopColor="#7c2cff" stopOpacity=".4"/>
              <stop offset=".5"  stopColor="#ff7a18" stopOpacity=".4"/>
              <stop offset="1"   stopColor={GOLD}    stopOpacity=".6"/>
            </linearGradient>
          </defs>

          {/* Neon border */}
          <rect x="20" y="8" width="1160" height={TY*2+GY*6+30} rx="18"
                fill="rgba(0,0,0,0)" stroke="url(#dBorder)" strokeWidth="3" filter="url(#dGM)"/>
          <rect x="30" y="16" width="1140" height={TY*2+GY*6+14} rx="14"
                fill={DARK} stroke="rgba(255,122,24,.18)" strokeWidth="1.5"/>

          {/* 8 Ray tracks */}
          {RAY8.map((k,i)=>{
            const y=ry(i), px=pos[i]??LX;
            const sc=scores[k]??0;
            const orb=orbSpec(sc);
            const color=rayHex(k);
            return (
              <g key={k}>
                {/* Label */}
                <text x="44" y={y+4} fill={color} fontSize="9.5" fontWeight="700"
                      letterSpacing=".1em"
                      style={{filter:`drop-shadow(0 0 5px ${color})`}}>
                  {RAY_LABELS[k]}
                </text>

                {/* Rail */}
                <line x1={LX} y1={y+22} x2={RX} y2={y+22}
                      stroke="url(#dRail)" strokeWidth="3" strokeLinecap="round" opacity=".7"/>

                {/* Progress glow */}
                {sc>0&&<line x1={LX} y1={y+22} x2={px} y2={y+22}
                      stroke={color} strokeWidth="4" strokeLinecap="round"
                      style={{filter:`drop-shadow(0 0 6px ${color})`}} opacity=".9"/>}

                {/* Tick marks every 10 */}
                {[10,20,30,40,50,60,70,80,90].map(t=>(
                  <line key={t}
                    x1={toX(t)} y1={y+18} x2={toX(t)} y2={y+26}
                    stroke={GOLD} strokeWidth=".8" opacity=".2"/>
                ))}

                {/* Moon anchor (east) */}
                <image href="/images/purple-moon-143.svg"
                       x={LX-14} y={y+22-14} width="28" height="28"
                       opacity=".85" filter="url(#dGM)"/>

                {/* Sun anchor (west) */}
                <image href="/images/sun-143.svg"
                       x={RX-14} y={y+22-14} width="28" height="28"
                       opacity=".85" filter="url(#dGG)"/>

                {/* Orb rings */}
                {orb.rings>=3&&<circle cx={px} cy={y+22} r={orb.r+10} fill="none"
                  stroke={orb.glow} strokeWidth="1.5" opacity=".25"/>}
                {orb.rings>=2&&<circle cx={px} cy={y+22} r={orb.r+6} fill="none"
                  stroke={orb.glow} strokeWidth="2" opacity=".35"/>}
                {orb.rings>=1&&<circle cx={px} cy={y+22} r={orb.r+3} fill="none"
                  stroke={orb.glow} strokeWidth="2.5" opacity=".5"/>}

                {/* Bloom */}
                <circle cx={px} cy={y+22} r={orb.bloom}
                  fill={orb.glow} opacity=".08"/>

                {/* Orb */}
                <circle cx={px} cy={y+22} r={orb.r}
                  fill={orb.fill} stroke={orb.stroke} strokeWidth="1.5"
                  filter={sc>=70?"url(#dGG)":"url(#dGM)"} opacity={orb.opacity}/>

                {/* Score */}
                <text x={px} y={y+8} textAnchor="middle" fill={color}
                      fontSize="10" fontWeight="700"
                      style={{filter:`drop-shadow(0 0 4px ${color})`}}>
                  {Math.round(sc)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* ── ACTION BUTTONS ── */}
      <div style={{position:'relative',zIndex:10,
        display:'flex',gap:16,padding:'8px 24px 12px',
        borderTop:`1px solid rgba(244,196,48,.12)`,
        borderBottom:`1px solid rgba(244,196,48,.12)`,
        background:'rgba(0,0,0,.25)'}}>
        <MechButton label="WATCH ME" sub="COURAGE ACTIVATION" color={CYAN}
          onClick={onWatchMe}/>
        <MechButton label="GO FIRST" sub="HESITATION OVERRIDE" color={AMBER}
          onClick={onGoFirst}/>
        <MechButton label="LOG REPS" sub="CAPTURE + RECORD" color={GOLD} ghost
          onClick={handleLogRep}/>
      </div>

      {/* ── BOTTOM BAR ── */}
      <div style={{position:'relative',zIndex:10,
        display:'flex',gap:16,padding:'12px 24px 16px',alignItems:'stretch'}}>

        {/* Insight card */}
        <div style={{flex:1,background:'rgba(0,0,0,.4)',borderRadius:12,padding:'12px 16px',
          border:`1px solid rgba(255,255,255,.08)`,
          fontFamily:"'Space Grotesk',sans-serif"}}>
          <div style={{fontSize:9,letterSpacing:'.15em',color:MAGENTA,marginBottom:6,
            textShadow:`0 0 8px ${MAGENTA}`,fontFamily:"'Orbitron',sans-serif"}}>
            THIS WEEK
          </div>
          <div style={{fontSize:13,color:'rgba(255,255,255,.85)',lineHeight:1.5,fontStyle:'italic'}}>
            "{insight ?? defaultInsight}"
          </div>
        </div>

        {/* Reps counter */}
        <div style={{minWidth:120,background:'rgba(0,0,0,.5)',borderRadius:12,
          padding:'12px 16px',display:'flex',flexDirection:'column',alignItems:'center',
          justifyContent:'center',border:`1px solid ${GOLD}33`}}>
          <div style={{fontSize:9,letterSpacing:'.15em',color:'rgba(255,255,255,.4)',
            fontFamily:"'Orbitron',sans-serif",marginBottom:4}}>REPS TODAY</div>
          <div style={{fontSize:36,fontWeight:900,color:GOLD,lineHeight:1,
            textShadow:`0 0 20px ${GOLD}, 0 0 40px ${GOLD}44`}}>
            {reps}
          </div>
          <div style={{fontSize:9,color:'rgba(255,255,255,.25)',marginTop:4,
            fontFamily:"'Space Grotesk',sans-serif"}}>
            The farther west, the more you radiate.
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Conic gauge ring ─────────────────────────────────── */
function ConicGauge({value, phase}:{value:number;phase:string}){
  const r=52, cx=70, cy=70, circumference=2*Math.PI*r;
  const arc=circumference*(value/100);
  const pColor = phase==='RADIANT'?GOLD:phase==='DAWN'?AMBER:MAGENTA;
  return (
    <div style={{position:'relative',width:140,height:140,flexShrink:0}}>
      <svg viewBox="0 0 140 140" style={{width:'100%',height:'100%'}}>
        <defs>
          <linearGradient id="gArc" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor={CYAN}/>
            <stop offset="100%" stopColor={AMBER}/>
          </linearGradient>
        </defs>
        {/* Track */}
        <circle cx={cx} cy={cy} r={r} fill="none"
                stroke="rgba(255,255,255,.08)" strokeWidth="10"/>
        {/* Arc */}
        <circle cx={cx} cy={cy} r={r} fill="none"
                stroke="url(#gArc)" strokeWidth="10"
                strokeDasharray={`${arc} ${circumference}`}
                strokeLinecap="round"
                transform={`rotate(-90 ${cx} ${cy})`}
                style={{filter:`drop-shadow(0 0 8px ${CYAN})`}}/>
        {/* Score */}
        <text x={cx} y={cy-6} textAnchor="middle" fill={GOLD}
              fontSize="20" fontWeight="900"
              style={{filter:`drop-shadow(0 0 8px ${GOLD})`}}>
          {value}
        </text>
        <text x={cx} y={cy+10} textAnchor="middle"
              fill="rgba(255,255,255,.4)" fontSize="8" letterSpacing=".1em">
          WEEKLY AVG
        </text>
        {/* Phase */}
        <text x={cx} y={cy+24} textAnchor="middle"
              fill={pColor} fontSize="9" fontWeight="700" letterSpacing=".15em"
              style={{filter:`drop-shadow(0 0 6px ${pColor})`}}>
          {phase}
        </text>
      </svg>
    </div>
  );
}

/* ── Mechanical button ────────────────────────────────── */
function MechButton({label,sub,color,ghost,onClick}:{
  label:string; sub:string; color:string; ghost?:boolean; onClick?:()=>void;
}){
  const [pressed, setPressed] = useState(false);
  return (
    <button
      onMouseDown={()=>setPressed(true)}
      onMouseUp={()=>setPressed(false)}
      onMouseLeave={()=>setPressed(false)}
      onClick={onClick}
      style={{
        flex:1, cursor:'pointer', outline:'none', userSelect:'none',
        background: ghost ? 'transparent' : `radial-gradient(ellipse at 50% 30%, ${color}22, rgba(0,0,0,.7))`,
        border: `2px solid ${color}`,
        borderRadius:10,
        padding:'10px 12px',
        boxShadow: pressed
          ? `inset 0 4px 12px rgba(0,0,0,.8), 0 0 8px ${color}33`
          : `0 4px 0 rgba(0,0,0,.6), 0 0 20px ${color}44, inset 0 1px 0 rgba(255,255,255,.1)`,
        transform: pressed ? 'translateY(3px)' : 'translateY(0)',
        transition:'all .08s ease',
        textAlign:'center' as const,
      }}>
      <div style={{fontSize:11,fontWeight:900,letterSpacing:'.18em',color,
        textShadow:`0 0 12px ${color}`,fontFamily:"'Orbitron',sans-serif",lineHeight:1.2}}>
        {label}
      </div>
      <div style={{fontSize:8,letterSpacing:'.12em',color:'rgba(255,255,255,.4)',
        marginTop:4,fontFamily:"'Space Grotesk',sans-serif"}}>
        {sub}
      </div>
    </button>
  );
}
