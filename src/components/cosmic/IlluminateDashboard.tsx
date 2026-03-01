'use client';

/**
 * IlluminateDashboard — 80s neon portal dashboard
 * Ported faithfully from illuminate/index.html prototype
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import { rayHex } from '@/lib/ui/ray-colors';

const RAY_KEYS  = ['R1','R2','R3','R4','R5','R6','R7','R8'] as const;
const ALL_KEYS  = ['R1','R2','R3','R4','R5','R6','R7','R8','R9'] as const;
const RAY_NAMES: Record<string,string> = {
  R1:'Intention', R2:'Joy', R3:'Presence', R4:'Power',
  R5:'Purpose',   R6:'Authenticity', R7:'Connection',
  R8:'Possibility', R9:'Be The Light',
};

const LX = 82, RX = 678, TY = 76, GY = 36;
const ry  = (i:number) => TY + i * GY;
const toX = (v:number) => LX + (RX - LX) * Math.max(0,Math.min(100,v)) / 100;

interface Props {
  scores?: Partial<Record<string,number>>;
  eclipseLevel?: number;
  phase?: 'ECLIPSE'|'DAWN'|'RADIANT';
  className?: string;
}

export default function IlluminateDashboard({scores={}, eclipseLevel=0, phase='ECLIPSE', className}: Props) {
  const [pos, setPos] = useState<number[]>(RAY_KEYS.map(()=>LX));
  const tgt = useRef<number[]>(RAY_KEYS.map(k=>toX(scores[k]??0)));
  const cur = useRef<number[]>(RAY_KEYS.map(()=>LX));
  const vel = useRef<number[]>(RAY_KEYS.map(()=>0));
  const raf = useRef<number>(0);

  useEffect(()=>{ tgt.current=RAY_KEYS.map(k=>toX(scores[k]??0)); },[scores]);

  useEffect(()=>{
    function tick(){
      let busy=false;
      const next=cur.current.map((x,i)=>{
        const d=tgt.current[i]-x;
        vel.current[i]=vel.current[i]*.78+d*.06;
        const nx=x+vel.current[i];
        if(Math.abs(d)>.1) busy=true;
        return nx;
      });
      cur.current=next;
      setPos([...next]);
      if(busy) raf.current=requestAnimationFrame(tick);
    }
    raf.current=requestAnimationFrame(tick);
    return ()=>cancelAnimationFrame(raf.current);
  },[]);

  const radiance=useMemo(()=>{
    const v=ALL_KEYS.map(k=>scores[k]??0);
    return Math.round(v.reduce((a,b)=>a+b,0)/v.length);
  },[scores]);

  const pColor = phase==='RADIANT'?'#ffd35a':phase==='DAWN'?'#ff7a18':'#ff2bd6';
  const pFilter= phase==='RADIANT'?'drop-shadow(0 0 8px #ffd35a)':'drop-shadow(0 0 6px #ff2bd6)';

  // Star dots
  const dots=useMemo(()=>{
    const C=['#60A5FA','#F4C430','#8E44AD','#2ECC71','#E74C8B','#1ABC9C','#F8D011','#D4770B','#ff2bd6'];
    return Array.from({length:55},(_,i)=>{
      const a=((i*1597+143)*6364136223846793)%4294967296;
      const b=((a*1597+3)*2654435761)%4294967296;
      const c=((b+i*37)*1664525)%4294967296;
      const d=((c*1597+7)*2246822519)%4294967296;
      const n=(c%10)<3;
      return {x:(a%10000)/100,y:(b%10000)/100,size:n?1.5+(c%20)/10:.8,color:n?C[d%C.length]:'rgba(255,255,255,0.2)',glow:n?3+(d%5):0,opacity:n?.7:.15+(c%30)/100};
    });
  },[]);

  return (
    <div className={`relative w-full select-none ${className??''}`}
         style={{background:'#08041a',borderRadius:24,overflow:'hidden',padding:'16px 8px 12px'}}>

      {/* Star field */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{zIndex:1}}>
        {dots.map((d,i)=>(
          <span key={i} className="absolute rounded-full" style={{
            left:`${d.x}%`,top:`${d.y}%`,width:d.size,height:d.size,
            background:d.color,opacity:d.opacity,
            boxShadow:d.glow?`0 0 ${d.glow}px ${d.glow/2}px ${d.color}`:'none',
          }}/>
        ))}
      </div>

      {/* Eclipse badge */}
      <div style={{position:'absolute',top:12,right:16,background:'rgba(6,3,20,.9)',
        border:'1px solid rgba(255,43,214,.4)',borderRadius:12,padding:'4px 10px',
        fontSize:11,fontWeight:700,color:'#ff2bd6',letterSpacing:'.1em',
        textShadow:'0 0 8px #ff2bd6',zIndex:20}}>
        ECLIPSE {eclipseLevel}%
      </div>

      {/* Main SVG */}
      <svg viewBox="0 0 760 555" preserveAspectRatio="xMidYMid meet"
           style={{width:'100%',display:'block',position:'relative',zIndex:5}}>
        <defs>
          <filter id="idGM" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="2.4" result="b"/>
            <feColorMatrix in="b" type="matrix" values="1 0 0 0 0  0 0.2 0 0 0  0 0 1 0 0  0 0 0 .92 0" result="c"/>
            <feMerge><feMergeNode in="c"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="idGG" x="-70%" y="-70%" width="240%" height="240%">
            <feGaussianBlur stdDeviation="3" result="b"/>
            <feColorMatrix in="b" type="matrix" values="1 0 0 0 0  0 0.75 0 0 0  0 0 0.20 0 0  0 0 0 1 0" result="c"/>
            <feMerge><feMergeNode in="c"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <linearGradient id="idRail" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0"    stopColor="#7c2cff" stopOpacity=".95"/>
            <stop offset=".5"   stopColor="#7c2cff" stopOpacity=".95"/>
            <stop offset=".5"   stopColor="#ff7a18" stopOpacity=".95"/>
            <stop offset="1"    stopColor="#ffd35a" stopOpacity=".95"/>
          </linearGradient>
          <linearGradient id="idBorder" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ff2bd6" stopOpacity=".9"/>
            <stop offset="1" stopColor="#ff7a18" stopOpacity=".9"/>
          </linearGradient>
          <linearGradient id="idConsole" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0"   stopColor="rgba(124,44,255,.18)"/>
            <stop offset=".5"  stopColor="rgba(255,43,214,.10)"/>
            <stop offset="1"   stopColor="rgba(255,211,90,.14)"/>
          </linearGradient>
          <linearGradient id="idCapFill" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0"    stopColor="rgba(124,44,255,.75)"/>
            <stop offset=".55"  stopColor="rgba(255,43,214,.65)"/>
            <stop offset="1"    stopColor="rgba(255,211,90,.92)"/>
          </linearGradient>
        </defs>

        {/* Neon border */}
        <rect x="22" y="18" width="716" height="365" rx="26"
              fill="rgba(0,0,0,0)" stroke="url(#idBorder)" strokeWidth="4" filter="url(#idGM)"/>
        <rect x="34" y="30" width="692" height="341" rx="22"
              fill="rgba(0,0,0,.65)" stroke="rgba(255,122,24,.22)" strokeWidth="2"/>

        {/* Ray tracks */}
        {RAY_KEYS.map((k,i)=>{
          const y=ry(i), px=pos[i]??LX;
          const pct=(px-LX)/(RX-LX);
          const isSun=pct>.85;
          return (
            <g key={k}>
              {/* Ray label */}
              <text x={LX-10} y={y+4} textAnchor="end" fill={rayHex(k)} fontSize="8.5"
                    fontWeight="bold" letterSpacing=".06em"
                    style={{filter:`drop-shadow(0 0 4px ${rayHex(k)})`}}>
                {RAY_NAMES[k].substring(0,5).toUpperCase()}
              </text>
              {/* Rail */}
              <line x1={LX} y1={y} x2={RX} y2={y}
                    stroke="url(#idRail)" strokeWidth="2.5" strokeLinecap="round" opacity=".5"/>
              {/* Progress */}
              <line x1={LX} y1={y} x2={px} y2={y}
                    stroke={rayHex(k)} strokeWidth="3" strokeLinecap="round" opacity=".9"
                    style={{filter:`drop-shadow(0 0 4px ${rayHex(k)})`}}/>
              {/* Moon anchor */}
              <circle cx={LX} cy={y} r={9} fill="rgba(0,0,0,.3)"
                      stroke="#7c2cff" strokeWidth="1.5" filter="url(#idGM)" opacity=".7"/>
              <image href="/images/purple-moon-143.svg"
                     x={LX-9} y={y-9} width="18" height="18" opacity=".9" filter="url(#idGM)"/>
              {/* Sun anchor */}
              <circle cx={RX} cy={y} r={9} fill="rgba(0,0,0,.3)"
                      stroke="#ffd35a" strokeWidth="1.5" filter="url(#idGG)" opacity=".7"/>
              <image href="/images/sun-143.svg"
                     x={RX-9} y={y-9} width="18" height="18" opacity=".9" filter="url(#idGG)"/>
              {/* Slider */}
              <circle cx={px} cy={y} r={isSun?13:11}
                      fill={isSun?'#ffd35a':'#7c2cff'}
                      stroke={isSun?'#ffd35a':'#ff2bd6'} strokeWidth="2"
                      filter={isSun?"url(#idGG)":"url(#idGM)"} opacity=".95"/>
              {/* Score */}
              <text x={px} y={y-15} textAnchor="middle" fill={rayHex(k)}
                    fontSize="8.5" fontWeight="bold"
                    style={{filter:`drop-shadow(0 0 3px ${rayHex(k)})`}}>
                {Math.round(scores[k]??0)}
              </text>
            </g>
          );
        })}

        {/* Radiant sun (high score) */}
        {radiance>75&&(
          <image href="/images/sun-143.svg"
                 x="300" y="94" width="160" height="160"
                 opacity={(radiance-75)/25*.6} filter="url(#idGG)"
                 preserveAspectRatio="xMidYMid meet" style={{pointerEvents:'none'}}/>
        )}

        {/* Bottom console */}
        <g transform="translate(70 403)">
          <rect x="0" y="0" width="620" height="136" rx="18"
                fill="rgba(6,3,20,.82)" stroke="rgba(124,44,255,.3)" strokeWidth="2" filter="url(#idGM)"/>
          <rect x="10" y="10" width="600" height="116" rx="14"
                fill="url(#idConsole)" stroke="rgba(255,255,255,.06)" strokeWidth="1"/>

          <text x="310" y="32" textAnchor="middle" fill={pColor}
                fontSize="13" fontWeight="bold" letterSpacing=".2em"
                style={{filter:pFilter}}>
            {phase}
          </text>
          <text x="310" y="62" textAnchor="middle"
                fill={phase==='RADIANT'?'#ffd35a':'#e8e0f0'} fontSize="22" fontWeight="bold"
                style={{filter:'drop-shadow(0 0 4px rgba(255,211,90,.4))'}}>
            {radiance}%
          </text>

          <image href="/images/purple-moon-143.svg" x="16" y="20" width="36" height="36"
                 opacity=".9" filter="url(#idGM)"/>
          <image href="/images/sun-143.svg" x="568" y="20" width="36" height="36"
                 opacity=".85" filter="url(#idGG)"/>

          {/* 9 capacity bars */}
          {ALL_KEYS.map((k,i)=>{
            const sw=600/9, cx=10+sw*i+sw/2;
            const v=scores[k]??0, bh=32, by=78;
            const filled=bh*(v/100);
            const isCore=k==='R9';
            return (
              <g key={k}>
                <rect x={cx-5} y={by} width={10} height={bh} rx="5" fill="rgba(255,255,255,.06)"/>
                <rect x={cx-5} y={by+bh-filled} width={10} height={filled} rx="5"
                      fill={isCore?"url(#idCapFill)":rayHex(k)} opacity=".85"
                      style={{filter:`drop-shadow(0 0 4px ${rayHex(k)})`}}/>
                <text x={cx} y={by-4} textAnchor="middle" fill={rayHex(k)}
                      fontSize="8" fontWeight="bold" opacity=".9">
                  {Math.round(v)}
                </text>
                <text x={cx} y={by+bh+11} textAnchor="middle"
                      fill={isCore?'#ffd35a':'rgba(255,255,255,.4)'}
                      fontSize={isCore?'8':'7'} fontWeight={isCore?'bold':'normal'}>
                  {isCore?'CORE':k}
                </text>
              </g>
            );
          })}

          <text x="20"  y="126" fill="rgba(255,255,255,.3)" fontSize="8">Moon → Eclipse → Sun</text>
          <text x="600" y="126" textAnchor="end" fill="rgba(255,255,255,.3)" fontSize="8">9 capacities</text>
        </g>
      </svg>
    </div>
  );
}
