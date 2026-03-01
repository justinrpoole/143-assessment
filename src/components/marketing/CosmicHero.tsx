'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

/*
 * CosmicHero — 143 Leadership
 *
 * THE ECLIPSE SEQUENCE (18s loop):
 *   0.00–0.25  RADIANCE   Sun shines, 9 rings rotate
 *   0.25–0.42  APPROACH   Moon slides from right → sun center
 *   0.42–0.55  TOTALITY   Moon === Sun size, perfectly overlapping → total darkness
 *                         "Live Just in a Ray of Light" emerges from the dark
 *   0.55–0.65  EMERGENCE  Diamond ring flash, corona blazes
 *   0.65–0.85  RETURN     Moon retreats, sun blooms back
 *   0.85–1.00  PEACE      Settle, hold, loop
 *
 * KEY ECLIPSE PHYSICS: MOON_R === SUN_R and moon center → sun center exactly.
 */

const RAYS = [
  '#60A5FA','#F4C430','#8E44AD','#C0392B','#D4770B',
  '#2ECC71','#E74C8B','#1ABC9C','#F8D011',
];

const eio = (t: number) => t < 0.5 ? 2*t*t : -1+(4-2*t)*t;
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const lerp = (a: number, b: number, t: number) => a + (b-a)*clamp(t,0,1);
const prog = (t: number, s: number, e: number) => clamp((t-s)/(e-s),0,1);

export default function CosmicHero({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prefersReduced = useReducedMotion();
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let W=0, H=0, CX=0, CY=0, SUN_R=0, startTime=0;

    function resize() {
      const r = canvas!.parentElement!.getBoundingClientRect();
      W = canvas!.width  = Math.floor(r.width);
      H = canvas!.height = Math.floor(Math.min(r.width*0.56, 520));
      canvas!.style.height = H+'px';
      CX = W*0.5; CY = H*0.46;
      SUN_R = Math.min(W,H)*0.135;
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement!);

    // 90 stars
    const STARS = Array.from({length:90}, ()=>({
      x: Math.random(), y: Math.random(),
      r: Math.random()*1.4+0.4,
      op: Math.random()*0.45+0.1,
      color: Math.random()>0.72 ? '#F4C430' : '#fff',
    }));

    function drawStars(brighten: number) {
      for (const s of STARS) {
        ctx.beginPath();
        ctx.arc(s.x*W, s.y*H, s.r, 0, Math.PI*2);
        ctx.fillStyle = s.color;
        ctx.globalAlpha = s.op * (1 + brighten*1.8);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    function drawSun(phase: number, bloom: number) {
      const g1 = ctx.createRadialGradient(CX,CY,SUN_R*0.4,CX,CY,SUN_R*(3+bloom));
      g1.addColorStop(0,'rgba(244,196,48,0.5)');
      g1.addColorStop(0.5,'rgba(210,120,10,0.18)');
      g1.addColorStop(1,'rgba(0,0,0,0)');
      ctx.beginPath(); ctx.arc(CX,CY,SUN_R*(3+bloom),0,Math.PI*2);
      ctx.fillStyle=g1; ctx.fill();

      const g2 = ctx.createRadialGradient(CX-SUN_R*.2,CY-SUN_R*.2,SUN_R*.1,CX,CY,SUN_R);
      g2.addColorStop(0,'#FFFBAA'); g2.addColorStop(.4,'#F4C430');
      g2.addColorStop(.75,'#D4770B'); g2.addColorStop(1,'#7B2F00');
      ctx.beginPath(); ctx.arc(CX,CY,SUN_R,0,Math.PI*2);
      ctx.fillStyle=g2; ctx.fill();

      ctx.beginPath(); ctx.arc(CX,CY,SUN_R,0,Math.PI*2);
      ctx.strokeStyle=`rgba(255,240,100,${.25+.15*Math.sin(phase*2.8)})`;
      ctx.lineWidth=2; ctx.stroke();
    }

    function drawMoon(mx: number, my: number) {
      // Same radius as sun — this is what creates total eclipse
      const g = ctx.createRadialGradient(mx-SUN_R*.15,my-SUN_R*.15,SUN_R*.04,mx,my,SUN_R);
      g.addColorStop(0,'#3D0860'); g.addColorStop(.55,'#18032A'); g.addColorStop(1,'#04010A');
      ctx.beginPath(); ctx.arc(mx, my, SUN_R, 0, Math.PI*2);
      ctx.fillStyle=g; ctx.fill();
    }

    function drawCorona(op: number, phase: number) {
      for (let i=0; i<16; i++) {
        const angle = (i/16)*Math.PI*2;
        const len = SUN_R*(1.9+0.7*Math.sin(angle*5+phase*.5));
        const g = ctx.createLinearGradient(
          CX+Math.cos(angle)*SUN_R, CY+Math.sin(angle)*SUN_R,
          CX+Math.cos(angle)*len, CY+Math.sin(angle)*len
        );
        g.addColorStop(0,`rgba(255,240,120,${op*.8})`);
        g.addColorStop(1,'rgba(255,200,50,0)');
        ctx.beginPath();
        ctx.moveTo(CX+Math.cos(angle)*SUN_R,CY+Math.sin(angle)*SUN_R);
        ctx.lineTo(CX+Math.cos(angle)*len,CY+Math.sin(angle)*len);
        ctx.strokeStyle=g; ctx.lineWidth=2.2;
        ctx.globalAlpha=op; ctx.stroke(); ctx.globalAlpha=1;
      }
    }

    function drawDiamond(t: number) {
      const bx=CX-SUN_R*.85, by=CY+SUN_R*.52;
      const g=ctx.createRadialGradient(bx,by,0,bx,by,SUN_R*.55);
      g.addColorStop(0,`rgba(255,255,255,${t})`);
      g.addColorStop(.35,`rgba(255,245,100,${t*.7})`);
      g.addColorStop(1,'rgba(0,0,0,0)');
      ctx.beginPath(); ctx.arc(bx,by,SUN_R*.55,0,Math.PI*2);
      ctx.fillStyle=g; ctx.fill();
      ctx.beginPath(); ctx.arc(CX,CY,SUN_R*1.05,0,Math.PI*2);
      ctx.strokeStyle=`rgba(255,248,150,${t*.95})`;
      ctx.lineWidth=3; ctx.shadowColor='#FFF7A0'; ctx.shadowBlur=20*t;
      ctx.stroke(); ctx.shadowBlur=0;
    }

    function drawRings(t: number, phase: number, eclipseT: number) {
      const dimmed = lerp(1, 0.12, eio(eclipseT));
      for (let i=0; i<9; i++) {
        const r = SUN_R*(1.72+i*.4);
        const op = (0.62-i*.055)*dimmed;
        const angle = phase*(0.00009*(1-i*.065))*60000;
        ctx.save(); ctx.translate(CX,CY); ctx.rotate(angle);
        ctx.beginPath();
        ctx.ellipse(0,0,r,r*.2,0,0,Math.PI*2);
        ctx.strokeStyle=RAYS[i]; ctx.globalAlpha=op;
        ctx.lineWidth = i<2 ? 2.2 : 1.4; ctx.stroke();
        ctx.globalAlpha=1; ctx.restore();
        if (i<2 && eclipseT<.25) {
          ctx.save(); ctx.translate(CX,CY); ctx.rotate(angle);
          ctx.beginPath(); ctx.ellipse(0,0,r,r*.2,0,0,Math.PI*2);
          ctx.strokeStyle=RAYS[i]; ctx.globalAlpha=.2*(1-eclipseT*4);
          ctx.lineWidth=7; ctx.shadowColor=RAYS[i]; ctx.shadowBlur=14;
          ctx.stroke(); ctx.shadowBlur=0; ctx.globalAlpha=1; ctx.restore();
        }
      }
    }

    function drawRevealText(op: number) {
      if (op<=0.01) return;
      ctx.save(); ctx.globalAlpha=op; ctx.textAlign='center'; ctx.textBaseline='middle';

      // Sub-label
      const labelSize = Math.max(11, SUN_R*.26);
      ctx.font=`${labelSize}px "Space Grotesk",sans-serif`;
      ctx.fillStyle='rgba(200,150,255,0.85)';
      ctx.fillText('YOUR NAME IS YOUR DIRECTION', CX, CY - SUN_R*1.3);

      // Main reveal — "Live Just in a Ray of Light"
      const mainSize = Math.max(14, SUN_R*.48);
      ctx.font=`bold ${mainSize}px "Orbitron","Space Grotesk",sans-serif`;
      ctx.fillStyle='#F4C430';
      ctx.shadowColor='#F4C430'; ctx.shadowBlur=22*op;
      ctx.fillText('Live Just in a Ray of Light', CX, CY + SUN_R*1.65);
      ctx.shadowBlur=0; ctx.restore();
    }

    function frame(now: number) {
      if (!startTime) startTime=now;
      const t = ((now-startTime) % 18000) / 18000;
      const phase = (now-startTime)/1000;

      ctx.clearRect(0,0,W,H);

      const approachT  = eio(prog(t,0.25,0.42));
      const totalityT  = eio(prog(t,0.42,0.55));
      const retreatProg = prog(t,0.65,0.82);
      const retreatT   = eio(retreatProg);
      const diamondT   = eio(prog(t,0.55,0.63))*(1-eio(prog(t,0.63,0.69)));
      const bloom      = eio(prog(t,0.65,0.82))*(1-prog(t,0.88,1.0)*.4);

      // Moon travels from W*1.35 → CX on approach, CX → W*1.35 on retreat
      const moonX = prefersReduced ? W*1.5 :
        retreatProg > 0 ?
          lerp(CX, W*1.35, retreatT) :
          lerp(W*1.35, CX, approachT);
      const moonY = CY;

      drawStars(totalityT);
      drawRings(t, phase, totalityT);

      // Sun — fully hidden at totality (moon is same size, same center)
      ctx.save();
      ctx.globalAlpha = lerp(1, 0.01, eio(clamp(totalityT*1.4,0,1)));
      drawSun(phase, bloom);
      ctx.restore();

      // Corona
      if (!prefersReduced && totalityT > 0.05) {
        const cop = eio(Math.min(totalityT*1.2, 1-prog(t,0.55,0.63)));
        drawCorona(cop, phase);
      }

      // Moon
      if (!prefersReduced && approachT > 0.02) {
        const mop = clamp(approachT*6,0,1)*clamp(1-retreatT*5,0,1);
        ctx.save(); ctx.globalAlpha=mop;
        drawMoon(moonX, moonY);
        ctx.restore();
      }

      // Diamond ring
      if (!prefersReduced && diamondT > 0.01) drawDiamond(diamondT);

      // "Live Just in a Ray of Light" text from the darkness
      const textOp = prefersReduced ? 0 :
        eio(prog(t,0.44,0.53))*(1-eio(prog(t,0.60,0.68)));
      drawRevealText(textOp);

      rafRef.current = requestAnimationFrame(frame);
    }

    if (prefersReduced) {
      ctx.clearRect(0,0,W,H);
      drawStars(0); drawRings(0,0,0); drawSun(0,0);
    } else {
      rafRef.current = requestAnimationFrame(frame);
    }

    return () => { cancelAnimationFrame(rafRef.current); ro.disconnect(); };
  }, [prefersReduced]);

  return (
    <div
      className={className}
      role="img"
      aria-label="143 Leadership eclipse animation — 9 Rays of leadership, total eclipse reveal, Live Just in a Ray of Light"
      style={{ position:'relative', width:'100%', background:'transparent' }}
    >
      <canvas ref={canvasRef} style={{ display:'block', width:'100%' }} />
    </div>
  );
}
