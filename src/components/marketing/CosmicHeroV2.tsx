'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import './cosmic-hero-v2.css';

const REVELATION_TEXT = 'LIVE JUST IN A RAY OF LIGHT';

export default function CosmicHeroV2() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    /* ============================================================
       CONFIG — the five acts
       ============================================================
       Act 1  RADIANCE     0.00 → 0.34   Sun shines, warm and full
       Act 2  APPROACH     0.34 → 0.44   Moon enters, tension
       Act 3  ECLIPSE      0.44 → 0.56   Total darkness, corona
       Act 4  EMERGENCE    0.56 → 0.66   Diamond ring, light returns
       Act 5  CELEBRATION  0.66 → 0.88   Nebula bloom, you are MORE
       Act 6  PEACE        0.88 → 1.00   Settle, ready again
       ============================================================ */
    const ECLIPSE_DUR = 18;
    const SUN_FRAC = 0.72;
    const MOON_FRAC = 0.72;

    /* ===== PERLIN NOISE ===== */
    const _p = new Uint8Array(512);
    for (let i = 0; i < 256; i++) _p[i] = _p[i + 256] = (Math.random() * 256) | 0;
    const _fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
    const _lerp = (a: number, b: number, t: number) => a + t * (b - a);
    const _grad = (h: number, x: number, y: number) => ((h & 1) ? -x : x) + ((h & 2) ? -y : y);

    function noise2(x: number, y: number) {
      const X = ~~x & 255, Y = ~~y & 255;
      x -= ~~x; y -= ~~y;
      const u = _fade(x), v = _fade(y);
      const a = _p[X] + Y, b = _p[X + 1] + Y;
      return _lerp(
        _lerp(_grad(_p[a], x, y), _grad(_p[b], x - 1, y), u),
        _lerp(_grad(_p[a + 1], x, y - 1), _grad(_p[b + 1], x - 1, y - 1), u), v
      );
    }

    function fbm(x: number, y: number, oct: number) {
      let v = 0, a = 1, f = 1, m = 0;
      for (let i = 0; i < oct; i++) { v += noise2(x * f, y * f) * a; m += a; a *= 0.5; f *= 2; }
      return v / m;
    }

    /* ===== PRE-COMPUTED NOISE TABLE ===== */
    /* Instead of computing FBM per-frame, build a 256-entry lookup.
       Frame loops index into this with (i + frameCounter) to get variation. */
    const NOISE_TABLE_SIZE = 256;
    const noiseTable = new Float32Array(NOISE_TABLE_SIZE);
    for (let i = 0; i < NOISE_TABLE_SIZE; i++) {
      noiseTable[i] = fbm(i * 0.5, i * 0.3, 3) * 0.5 + 0.5;
    }

    /* ===== DOM — all queries scoped to root ===== */
    const starCvs   = root.querySelector('.starfield') as HTMLCanvasElement;
    const starCtx   = starCvs.getContext('2d', { alpha: true })!;
    const sunCvs    = root.querySelector('.sun-canvas') as HTMLCanvasElement;
    const sunCtx    = sunCvs.getContext('2d', { alpha: true })!;
    const cosmoCvs  = root.querySelector('.cosmo-canvas') as HTMLCanvasElement;
    const cosmoCtx  = cosmoCvs.getContext('2d', { alpha: true })!;
    const grainCvs  = root.querySelector('.grain') as HTMLCanvasElement;
    const sunSvg    = root.querySelector('.sun-svg') as HTMLImageElement;
    const sunnovaEl = root.querySelector('.sunnova-svg') as HTMLImageElement;
    const moonEl    = root.querySelector('.moon') as HTMLImageElement;
    const brand     = root.querySelector('.brand-143') as HTMLElement;
    const darkEl    = root.querySelector('.eclipse-darkness') as HTMLElement;
    const stageEl   = root.querySelector('.eclipse-stage') as HTMLElement;
    const nebEl     = root.querySelector('.nebula') as HTMLElement;
    const ambEl     = root.querySelector('.sun-ambient') as HTMLElement;
    const washEl    = root.querySelector('.celebration-wash') as HTMLElement;
    const row1El    = root.querySelector('.row-1') as HTMLElement;
    const row2El    = root.querySelector('.row-2') as HTMLElement;
    const vigEl     = root.querySelector('.vignette') as HTMLElement;
    const revelationChars = Array.from(
      root.querySelectorAll('.revelation-text span')
    ) as HTMLElement[];

    /* ===== STARFIELD ===== */
    let sw = 0, sh = 0, sdpr = 1;
    const LAYERS = [
      { count: 140, maxR: 0.9,  speed: 0.03, tw: 0.18 },
      { count: 90,  maxR: 1.4,  speed: 0.06, tw: 0.24 },
      { count: 40,  maxR: 2.0,  speed: 0.10, tw: 0.30 },
    ];
    interface Star {
      li: number; x: number; y: number; r: number;
      a0: number; ph: number; dr: number; hue: number;
    }
    let stars: Star[] = [];

    function resizeStars() {
      sdpr = Math.min(1.5, devicePixelRatio || 1);
      sw = starCvs.clientWidth; sh = starCvs.clientHeight;
      starCvs.width = Math.floor(sw * sdpr);
      starCvs.height = Math.floor(sh * sdpr);
      starCtx.setTransform(sdpr, 0, 0, sdpr, 0, 0);
    }

    function seedStars() {
      stars = [];
      for (let li = 0; li < LAYERS.length; li++) {
        const L = LAYERS[li];
        for (let i = 0; i < L.count; i++) {
          stars.push({
            li, x: Math.random() * sw, y: Math.random() * sh,
            r: Math.random() * L.maxR + 0.12,
            a0: Math.random() * 0.45 + 0.06,
            ph: Math.random() * Math.PI * 2,
            dr: (Math.random() * 2 - 1) * L.speed,
            hue: Math.random()
          });
        }
      }
    }

    /* Leo constellation */
    const LEO = [
      { n: 'Regulus',  x: 0.64, y: 0.42, m: 1.36 },
      { n: 'Eta',      x: 0.63, y: 0.32, m: 3.48 },
      { n: 'Algieba',  x: 0.66, y: 0.24, m: 2.08 },
      { n: 'Adhafera', x: 0.65, y: 0.18, m: 3.33 },
      { n: 'Rasalas',  x: 0.60, y: 0.13, m: 3.88 },
      { n: 'Epsilon',  x: 0.72, y: 0.15, m: 2.98 },
      { n: 'Zosma',    x: 0.78, y: 0.20, m: 2.56 },
      { n: 'Chertan',  x: 0.78, y: 0.30, m: 3.32 },
      { n: 'Denebola', x: 0.88, y: 0.25, m: 2.14 },
    ];
    const LEO_LINES: [string, string][] = [
      ['Regulus','Eta'],['Eta','Algieba'],['Algieba','Adhafera'],
      ['Adhafera','Rasalas'],['Rasalas','Epsilon'],['Epsilon','Algieba'],
      ['Algieba','Zosma'],['Zosma','Chertan'],['Chertan','Regulus'],
      ['Zosma','Denebola'],['Chertan','Denebola'],
    ];
    /* Pre-compute Leo star pixel positions */
    const leoMap = new Map<string, { x: number; y: number; m: number }>();
    for (const s of LEO) leoMap.set(s.n, s);

    function drawStars(t: number, eclBright: number, celebI: number) {
      starCtx.clearRect(0, 0, sw, sh);
      const vis = Math.max(0, 0.35 + eclBright * 0.65 - celebI * 0.50);
      if (vis < 0.01) return; // Skip entirely when stars invisible

      for (const s of stars) {
        const L = LAYERS[s.li];
        s.x += s.dr;
        if (s.x < -4) s.x = sw + 4;
        if (s.x > sw + 4) s.x = -4;
        const tw = s.a0 + Math.sin(t * (0.9 + L.tw) + s.ph) * 0.14;
        const a = Math.max(0, Math.min(1, tw)) * vis;
        if (a < 0.02) continue;
        const c = s.hue < 0.06 ? `rgba(180,210,255,${a})`
                : s.hue > 0.96 ? `rgba(255,220,180,${a})`
                : `rgba(255,255,255,${a})`;
        starCtx.beginPath();
        starCtx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        starCtx.fillStyle = c;
        starCtx.fill();
      }

      starCtx.strokeStyle = `rgba(255,255,255,${0.04 * vis})`;
      starCtx.lineWidth = 0.5;
      for (const [a, b] of LEO_LINES) {
        const sa = leoMap.get(a), sb = leoMap.get(b);
        if (sa && sb) {
          starCtx.beginPath();
          starCtx.moveTo(sa.x * sw, sa.y * sh);
          starCtx.lineTo(sb.x * sw, sb.y * sh);
          starCtx.stroke();
        }
      }
      for (const s of LEO) {
        const x = s.x * sw, y = s.y * sh;
        const r = Math.max(1.0, (5 - s.m) * 0.8);
        starCtx.beginPath(); starCtx.arc(x, y, r + 1.2, 0, Math.PI * 2);
        starCtx.fillStyle = `rgba(255,245,220,${0.06 * vis})`; starCtx.fill();
        starCtx.beginPath(); starCtx.arc(x, y, r, 0, Math.PI * 2);
        starCtx.fillStyle = `rgba(255,250,235,${Math.min(0.80, 0.35 + (5 - s.m) * 0.11) * vis})`; starCtx.fill();
      }
    }

    /* ===== COSMO CANVAS (full-viewport celebration) ===== */
    let cW = 0, cH = 0;

    function resizeCosmo() {
      /* DPR capped at 1.0 — celebration effects are soft glows that don't need retina.
         This alone saves 75% pixel fill on 2x displays. */
      cW = cosmoCvs.clientWidth; cH = cosmoCvs.clientHeight;
      cosmoCvs.width = cW;
      cosmoCvs.height = cH;
      cosmoCtx.setTransform(1, 0, 0, 1, 0, 0);
    }

    /* ===== SUN CANVAS ===== */
    let scW = 0, scH = 0, scDpr = 1;

    function resizeSun() {
      scDpr = Math.min(1.5, devicePixelRatio || 1);
      scW = sunCvs.clientWidth; scH = sunCvs.clientHeight;
      sunCvs.width = Math.floor(scW * scDpr);
      sunCvs.height = Math.floor(scH * scDpr);
      sunCtx.setTransform(scDpr, 0, 0, scDpr, 0, 0);
    }

    function drawSunScene(time: number, bright: number, eclI: number, celebI: number, progress: number) {
      sunCtx.clearRect(0, 0, scW, scH);
      const cx = scW / 2, cy = scH / 2;
      const R = (stageEl.clientWidth * SUN_FRAC) / 2;

      /* Atmospheric glow — base warmth */
      const glowMult = bright + celebI * 0.6;
      const g1r = R * 4.5;
      const g1 = sunCtx.createRadialGradient(cx, cy, R * 0.3, cx, cy, g1r);
      g1.addColorStop(0, `rgba(255,200,80,${0.16 * glowMult})`);
      g1.addColorStop(0.1, `rgba(255,180,60,${0.10 * glowMult})`);
      g1.addColorStop(0.3, `rgba(255,150,40,${0.05 * glowMult})`);
      g1.addColorStop(0.55, `rgba(255,120,20,${0.018 * glowMult})`);
      g1.addColorStop(1, 'transparent');
      sunCtx.fillStyle = g1;
      sunCtx.beginPath(); sunCtx.arc(cx, cy, g1r, 0, Math.PI * 2); sunCtx.fill();

      /* Tighter hot core */
      const g2r = R * 1.8;
      const g2 = sunCtx.createRadialGradient(cx, cy, R * 0.3, cx, cy, g2r);
      g2.addColorStop(0, `rgba(255,220,130,${0.20 * glowMult})`);
      g2.addColorStop(0.4, `rgba(255,190,80,${0.10 * glowMult})`);
      g2.addColorStop(1, 'transparent');
      sunCtx.fillStyle = g2;
      sunCtx.beginPath(); sunCtx.arc(cx, cy, g2r, 0, Math.PI * 2); sunCtx.fill();

      /* Corona streamers during eclipse */
      if (eclI > 0.08) drawStreamers(cx, cy, R, eclI, time);

      /* Diamond ring */
      drawDiamondRing(cx, cy, R, progress);
    }

    /* ===== CORONA STREAMERS (eclipse) ===== */
    function drawStreamers(cx: number, cy: number, R: number, intensity: number, time: number) {
      const N = 32; // Reduced from 48
      const base = R * 0.9;
      sunCtx.save();
      sunCtx.globalCompositeOperation = 'screen';

      for (let i = 0; i < N; i++) {
        const angle = (i / N) * Math.PI * 2 + Math.sin(time * 0.1) * 0.02;
        const n1 = noiseTable[(i * 7 + (~~(time * 4))) & 255];
        const len = base * (0.4 + n1 * 2.0);
        const w = R * 0.03 * (0.3 + n1 * 0.7);
        const startR = R * 0.85;
        const x1 = cx + Math.cos(angle) * startR;
        const y1 = cy + Math.sin(angle) * startR;
        const x2 = cx + Math.cos(angle) * (startR + len);
        const y2 = cy + Math.sin(angle) * (startR + len);
        const drift = Math.sin(angle * 3 + time * 0.3) * w * 4;
        const ctrlX = (x1 + x2) / 2 - Math.sin(angle) * drift;
        const ctrlY = (y1 + y2) / 2 + Math.cos(angle) * drift;

        const sg = sunCtx.createLinearGradient(x1, y1, x2, y2);
        sg.addColorStop(0, `rgba(255,240,220,${0.50 * intensity})`);
        sg.addColorStop(0.12, `rgba(255,210,140,${0.35 * intensity})`);
        sg.addColorStop(0.35, `rgba(200,120,255,${0.28 * intensity})`);
        sg.addColorStop(0.6, `rgba(147,64,255,${0.18 * intensity})`);
        sg.addColorStop(1, 'transparent');

        sunCtx.strokeStyle = sg;
        sunCtx.lineWidth = w;
        sunCtx.lineCap = 'round';
        sunCtx.beginPath();
        sunCtx.moveTo(x1, y1);
        sunCtx.quadraticCurveTo(ctrlX, ctrlY, x2, y2);
        sunCtx.stroke();
      }

      const rg = sunCtx.createRadialGradient(cx, cy, R * 0.75, cx, cy, R * 1.6);
      rg.addColorStop(0, `rgba(255,200,120,${0.25 * intensity})`);
      rg.addColorStop(0.25, `rgba(200,120,255,${0.22 * intensity})`);
      rg.addColorStop(0.5, `rgba(147,64,255,${0.14 * intensity})`);
      rg.addColorStop(1, 'transparent');
      sunCtx.fillStyle = rg;
      sunCtx.beginPath(); sunCtx.arc(cx, cy, R * 1.4, 0, Math.PI * 2); sunCtx.fill();
      sunCtx.restore();
    }

    /* ===== DIAMOND RING ===== */
    function drawDiamondRing(cx: number, cy: number, R: number, progress: number) {
      const c1 = 0.44, c2 = 0.56, w = 0.025;
      let I = 0;
      if (Math.abs(progress - c1) < w) I = 1 - Math.abs(progress - c1) / w;
      else if (Math.abs(progress - c2) < w) I = 1 - Math.abs(progress - c2) / w;
      if (I < 0.01) return;
      I *= I;

      const side = progress < 0.5 ? -1 : 1;
      const dx = cx + side * R * 0.80, dy = cy;

      sunCtx.save();
      sunCtx.globalCompositeOperation = 'screen';
      const fl = sunCtx.createRadialGradient(dx, dy, 0, dx, dy, R * 0.4);
      fl.addColorStop(0, `rgba(255,255,255,${I})`);
      fl.addColorStop(0.06, `rgba(255,250,230,${I * 0.85})`);
      fl.addColorStop(0.2, `rgba(255,220,160,${I * 0.35})`);
      fl.addColorStop(0.5, `rgba(255,180,80,${I * 0.10})`);
      fl.addColorStop(1, 'transparent');
      sunCtx.fillStyle = fl;
      sunCtx.fillRect(0, 0, scW, scH);
      sunCtx.globalAlpha = I * 0.40;
      sunCtx.fillStyle = 'rgba(255,240,210,0.5)';
      sunCtx.fillRect(0, dy - 1, scW, 2);
      sunCtx.restore();
    }

    /* =============================================================
       ACT 5: CELEBRATION — FULL VIEWPORT COSMIC EXPLOSION
       ============================================================= */

    const COSMIC_COLORS: [number, number, number][] = [
      [255, 200, 80],   // gold
      [255, 140, 60],   // amber
      [220, 60, 140],   // magenta
      [147, 64, 255],   // brand purple
      [60, 120, 255],   // electric blue
      [30, 200, 180],   // teal
      [180, 50, 220],   // violet
      [255, 100, 180],  // hot pink
    ];

    /* --- Radiant streaks — reduced from 64 to 28 --- */
    function drawNebulaBloom(cx: number, cy: number, maxR: number, intensity: number, time: number) {
      cosmoCtx.save();
      cosmoCtx.globalCompositeOperation = 'screen';

      const numStreaks = 28;
      const tIdx = ~~(time * 3);
      for (let i = 0; i < numStreaks; i++) {
        const baseAngle = (i / numStreaks) * Math.PI * 2;
        const wave = noiseTable[(i * 9 + tIdx) & 255];
        const angle = baseAngle + Math.sin(time * 0.2 + i * 0.4) * 0.05;
        const len = maxR * (0.3 + wave * 0.7) * intensity;
        const baseWidth = maxR * (0.010 + wave * 0.030);

        const startR = maxR * 0.04;
        const x1 = cx + Math.cos(angle) * startR;
        const y1 = cy + Math.sin(angle) * startR;
        const x2 = cx + Math.cos(angle) * (startR + len);
        const y2 = cy + Math.sin(angle) * (startR + len);

        const drift = Math.sin(angle * 5 + time * 0.3) * baseWidth * 6;
        const midX = (x1 + x2) / 2 - Math.sin(angle) * drift;
        const midY = (y1 + y2) / 2 + Math.cos(angle) * drift;

        const ci = i % COSMIC_COLORS.length;
        const [cr, cg, cb] = COSMIC_COLORS[ci];

        const sg = cosmoCtx.createLinearGradient(x1, y1, x2, y2);
        sg.addColorStop(0, `rgba(255,250,220,${(0.35 * intensity).toFixed(2)})`);
        sg.addColorStop(0.08, `rgba(255,230,160,${(0.25 * intensity).toFixed(2)})`);
        sg.addColorStop(0.25, `rgba(${cr},${cg},${cb},${(0.18 * intensity).toFixed(2)})`);
        sg.addColorStop(0.55, `rgba(${cr},${cg},${cb},${(0.09 * intensity).toFixed(2)})`);
        sg.addColorStop(1, 'transparent');

        cosmoCtx.strokeStyle = sg;
        cosmoCtx.lineWidth = baseWidth * (1 - wave * 0.3);
        cosmoCtx.lineCap = 'round';
        cosmoCtx.beginPath();
        cosmoCtx.moveTo(x1, y1);
        cosmoCtx.quadraticCurveTo(midX, midY, x2, y2);
        cosmoCtx.stroke();
      }

      /* Warm radial wash */
      const bloomR = maxR * (0.5 + intensity * 0.6);
      const bloom = cosmoCtx.createRadialGradient(cx, cy, 0, cx, cy, bloomR);
      bloom.addColorStop(0, `rgba(255,240,180,${0.35 * intensity})`);
      bloom.addColorStop(0.12, `rgba(255,210,110,${0.22 * intensity})`);
      bloom.addColorStop(0.3, `rgba(200,100,180,${0.12 * intensity})`);
      bloom.addColorStop(0.5, `rgba(120,60,255,${0.08 * intensity})`);
      bloom.addColorStop(0.7, `rgba(40,120,220,${0.05 * intensity})`);
      bloom.addColorStop(1, 'transparent');
      cosmoCtx.fillStyle = bloom;
      cosmoCtx.fillRect(0, 0, cW, cH);

      cosmoCtx.restore();
    }

    /* --- God rays — reduced from 48 to 20 --- */
    function drawGodRays(cx: number, cy: number, maxR: number, intensity: number, time: number) {
      if (intensity < 0.05) return;
      cosmoCtx.save();
      cosmoCtx.globalCompositeOperation = 'screen';

      /* Blinding center flash */
      const flashI = Math.pow(intensity, 0.6);
      const flashR = maxR * (0.25 + flashI * 0.45);
      const flash = cosmoCtx.createRadialGradient(cx, cy, 0, cx, cy, flashR);
      flash.addColorStop(0, `rgba(255,255,240,${(0.70 * flashI).toFixed(2)})`);
      flash.addColorStop(0.15, `rgba(255,245,200,${(0.50 * flashI).toFixed(2)})`);
      flash.addColorStop(0.35, `rgba(255,220,140,${(0.30 * flashI).toFixed(2)})`);
      flash.addColorStop(0.6, `rgba(255,190,80,${(0.12 * flashI).toFixed(2)})`);
      flash.addColorStop(1, 'transparent');
      cosmoCtx.fillStyle = flash;
      cosmoCtx.fillRect(0, 0, cW, cH);

      /* Radiant beams — reduced from 48 to 20, made wider to compensate */
      const numRays = 20;
      const tIdx = ~~(time * 2);
      for (let i = 0; i < numRays; i++) {
        const baseAngle = (i / numRays) * Math.PI * 2;
        const angle = baseAngle + Math.sin(time * 0.10 + i * 0.6) * 0.04;
        const n = noiseTable[(i * 13 + tIdx) & 255];
        const len = maxR * (0.6 + n * 0.5) * intensity;
        const beamWidth = maxR * (0.018 + n * 0.038); // Wider to compensate fewer rays

        const startR = maxR * 0.03;
        const x1 = cx + Math.cos(angle) * startR;
        const y1 = cy + Math.sin(angle) * startR;
        const x2 = cx + Math.cos(angle) * (startR + len);
        const y2 = cy + Math.sin(angle) * (startR + len);

        const ci = i % COSMIC_COLORS.length;
        const [cr, cg, cb] = COSMIC_COLORS[ci];

        const grad = cosmoCtx.createLinearGradient(x1, y1, x2, y2);
        grad.addColorStop(0, `rgba(255,255,230,${(0.60 * intensity).toFixed(2)})`);
        grad.addColorStop(0.06, `rgba(255,245,190,${(0.45 * intensity).toFixed(2)})`);
        grad.addColorStop(0.18, `rgba(255,220,130,${(0.30 * intensity).toFixed(2)})`);
        grad.addColorStop(0.35, `rgba(${cr},${cg},${cb},${(0.18 * intensity).toFixed(2)})`);
        grad.addColorStop(0.65, `rgba(${cr},${cg},${cb},${(0.06 * intensity).toFixed(2)})`);
        grad.addColorStop(1, 'transparent');

        cosmoCtx.strokeStyle = grad;
        cosmoCtx.lineWidth = beamWidth;
        cosmoCtx.lineCap = 'round';
        cosmoCtx.beginPath();
        cosmoCtx.moveTo(x1, y1);
        cosmoCtx.lineTo(x2, y2);
        cosmoCtx.stroke();
      }

      cosmoCtx.restore();
    }

    /* --- Embers — reduced from 180 to 70 --- */
    interface Ember {
      angle: number; speed: number; delay: number; size: number;
      sparklePhase: number; sparkleSpeed: number; colorIdx: number; drift: number;
    }
    const EMBERS: Ember[] = [];
    for (let i = 0; i < 70; i++) {
      EMBERS.push({
        angle: Math.random() * Math.PI * 2,
        speed: 0.3 + Math.random() * 1.6,
        delay: Math.random() * 0.35,
        size: 0.5 + Math.random() * 2.5,
        sparklePhase: Math.random() * Math.PI * 2,
        sparkleSpeed: 2.5 + Math.random() * 4,
        colorIdx: Math.floor(Math.random() * COSMIC_COLORS.length),
        drift: (Math.random() - 0.5) * 0.4
      });
    }

    function drawEmbers(cx: number, cy: number, maxR: number, intensity: number, time: number) {
      if (intensity < 0.03) return;
      cosmoCtx.save();
      cosmoCtx.globalCompositeOperation = 'screen';

      for (const e of EMBERS) {
        const localI = Math.max(0, (intensity - e.delay) / (1 - e.delay));
        if (localI <= 0) continue;

        const expand = 1 - Math.pow(1 - localI, 2);
        const dist = maxR * (0.05 + expand * e.speed * 0.7);
        const driftAngle = e.angle + e.drift * localI * 2;
        const x = cx + Math.cos(driftAngle + time * 0.04) * dist;
        const y = cy + Math.sin(driftAngle + time * 0.04) * dist;

        if (x < -20 || x > cW + 20 || y < -20 || y > cH + 20) continue;

        const sparkle = 0.4 + 0.6 * Math.sin(time * e.sparkleSpeed + e.sparklePhase);
        const alpha = localI * sparkle * (1 - expand * 0.4);
        if (alpha < 0.02) continue;

        const [cr, cg, cb] = COSMIC_COLORS[e.colorIdx];

        /* Glow halo */
        cosmoCtx.beginPath();
        cosmoCtx.arc(x, y, e.size * 5, 0, Math.PI * 2);
        cosmoCtx.fillStyle = `rgba(${cr},${cg},${cb},${(alpha * 0.15).toFixed(3)})`;
        cosmoCtx.fill();

        /* Core point */
        cosmoCtx.beginPath();
        cosmoCtx.arc(x, y, e.size * (0.5 + localI * 0.7), 0, Math.PI * 2);
        cosmoCtx.fillStyle = `rgba(${cr},${cg},${cb},${(alpha * 0.85).toFixed(3)})`;
        cosmoCtx.fill();
      }

      cosmoCtx.restore();
    }

    /* --- Sparkle stars — reduced from 120 to 50 --- */
    interface SparkleStar {
      x: number; y: number; size: number; twinkleSpeed: number;
      twinklePhase: number; delay: number; hue: number;
    }
    const SPARKLE_STARS: SparkleStar[] = [];
    for (let i = 0; i < 50; i++) {
      SPARKLE_STARS.push({
        x: Math.random(),
        y: Math.random(),
        size: 0.4 + Math.random() * 1.8,
        twinkleSpeed: 3 + Math.random() * 8,
        twinklePhase: Math.random() * Math.PI * 2,
        delay: Math.random() * 0.4,
        hue: Math.random()
      });
    }

    function drawSparkleStars(intensity: number, time: number) {
      if (intensity < 0.05) return;
      cosmoCtx.save();
      cosmoCtx.globalCompositeOperation = 'screen';

      for (const s of SPARKLE_STARS) {
        const localI = Math.max(0, (intensity - s.delay) / (1 - s.delay));
        if (localI <= 0) continue;

        const x = s.x * cW;
        const y = s.y * cH;

        const twinkle = 0.15 + 0.85 * Math.pow(Math.max(0, Math.sin(time * s.twinkleSpeed + s.twinklePhase)), 3);
        const alpha = localI * twinkle;
        if (alpha < 0.02) continue;

        let r: number, g: number, b: number;
        if (s.hue < 0.35) { r = 200; g = 210; b = 255; }
        else if (s.hue < 0.55) { r = 200; g = 170; b = 255; }
        else if (s.hue < 0.70) { r = 180; g = 220; b = 255; }
        else { r = 255; g = 250; b = 240; }

        const sz = s.size * (0.8 + twinkle * 0.6);
        const armLen = sz * 4;

        cosmoCtx.strokeStyle = `rgba(${r},${g},${b},${(alpha * 0.7).toFixed(3)})`;
        cosmoCtx.lineWidth = sz * 0.3;
        cosmoCtx.beginPath();
        cosmoCtx.moveTo(x - armLen, y); cosmoCtx.lineTo(x + armLen, y);
        cosmoCtx.moveTo(x, y - armLen); cosmoCtx.lineTo(x, y + armLen);
        cosmoCtx.stroke();

        cosmoCtx.beginPath();
        cosmoCtx.arc(x, y, sz * 0.6, 0, Math.PI * 2);
        cosmoCtx.fillStyle = `rgba(${r},${g},${b},${(alpha * 0.95).toFixed(3)})`;
        cosmoCtx.fill();

        cosmoCtx.beginPath();
        cosmoCtx.arc(x, y, sz * 3.5, 0, Math.PI * 2);
        cosmoCtx.fillStyle = `rgba(${r},${g},${b},${(alpha * 0.08).toFixed(3)})`;
        cosmoCtx.fill();
      }

      cosmoCtx.restore();
    }

    /* --- Nebula clouds — reduced cloud count, fewer fillRect calls --- */
    function drawNebulaGlows(cx: number, cy: number, maxR: number, intensity: number, time: number) {
      if (intensity < 0.05) return;
      cosmoCtx.save();
      cosmoCtx.globalCompositeOperation = 'screen';

      const clouds = [
        { ox: -0.25, oy: -0.15, r: 147, g: 64,  b: 255, size: 0.55, drift: 0.08 },
        { ox:  0.30, oy:  0.20, r: 60,  g: 120, b: 255, size: 0.50, drift: 0.06 },
        { ox: -0.15, oy:  0.30, r: 100, g: 60,  b: 220, size: 0.45, drift: 0.10 },
        { ox:  0.20, oy: -0.25, r: 80,  g: 150, b: 255, size: 0.40, drift: 0.07 },
      ];

      for (let i = 0; i < clouds.length; i++) {
        const c = clouds[i];
        const driftX = Math.sin(time * c.drift + i * 1.7) * maxR * 0.08;
        const driftY = Math.cos(time * c.drift * 0.7 + i * 2.3) * maxR * 0.06;
        const cloudCx = cx + c.ox * cW + driftX;
        const cloudCy = cy + c.oy * cH + driftY;
        const cloudR = maxR * c.size;

        const ng = cosmoCtx.createRadialGradient(cloudCx, cloudCy, 0, cloudCx, cloudCy, cloudR);
        ng.addColorStop(0,   `rgba(${c.r},${c.g},${c.b},${(0.12 * intensity).toFixed(3)})`);
        ng.addColorStop(0.3, `rgba(${c.r},${c.g},${c.b},${(0.06 * intensity).toFixed(3)})`);
        ng.addColorStop(0.6, `rgba(${c.r},${c.g},${c.b},${(0.02 * intensity).toFixed(3)})`);
        ng.addColorStop(1,   'transparent');
        cosmoCtx.fillStyle = ng;
        cosmoCtx.fillRect(0, 0, cW, cH);
      }

      cosmoCtx.restore();
    }

    /* --- Orchestrator: draws all celebration on cosmo canvas --- */
    function drawCosmoScene(time: number, celebI: number) {
      cosmoCtx.clearRect(0, 0, cW, cH);
      if (celebI < 0.01) return;

      const cx = cW / 2, cy = cH / 2;
      const maxR = Math.sqrt(cW * cW + cH * cH) / 2;

      drawNebulaGlows(cx, cy, maxR, celebI, time);
      drawNebulaBloom(cx, cy, maxR, celebI, time);
      drawGodRays(cx, cy, maxR, celebI, time);
      drawEmbers(cx, cy, maxR, celebI, time);
      drawSparkleStars(celebI, time);
    }

    /* ===== MOON PATH ===== */
    function moonPos(p: number) {
      const enter = 0.06, exit = 0.94;
      if (p < enter || p > exit) return { x: -0.2, y: 0.85, o: 0 };
      const t = (p - enter) / (exit - enter);
      const x = -0.08 + 1.16 * t;
      const y = 0.80 - 0.32 * Math.sin(Math.PI * t);
      let o = 1;
      if (t < 0.06) o = t / 0.06;
      if (t > 0.94) o = (1 - t) / 0.06;
      return { x, y, o };
    }

    function clamp01(v: number) {
      return Math.max(0, Math.min(1, v));
    }

    function smoothStep(edge0: number, edge1: number, x: number) {
      const t = clamp01((x - edge0) / (edge1 - edge0));
      return t * t * (3 - 2 * t);
    }

    function easeOutBack(t: number) {
      const c1 = 1.70158;
      const c3 = c1 + 1;
      const x = t - 1;
      return 1 + c3 * x * x * x + c1 * x * x;
    }

    function eclipseIntensity(p: number) {
      if (p < 0.34 || p > 0.70) return 0;
      if (p <= 0.50) return Math.pow(smoothStep(0.34, 0.50, p), 1.1);
      const tail = 1 - smoothStep(0.50, 0.70, p);
      return tail * tail;
    }

    function celebrationIntensity(p: number) {
      if (p < 0.66 || p > 0.88) return 0;
      if (p <= 0.73) return Math.pow((p - 0.66) / 0.07, 1.6);
      if (p <= 0.78) return 1;
      return Math.pow((0.88 - p) / 0.10, 1.3);
    }

    /* ===== MOUSE PARALLAX ===== */
    let mTx = 0, mTy = 0, mX = 0, mY = 0;

    const onMouseMove = (e: MouseEvent) => {
      mTx = (e.clientX / innerWidth - 0.5) * 2;
      mTy = (e.clientY / innerHeight - 0.5) * 2;
    };
    document.addEventListener('mousemove', onMouseMove, { passive: true });

    const onDeviceOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma != null) mTx = Math.max(-1, Math.min(1, e.gamma / 30));
      if (e.beta != null) mTy = Math.max(-1, Math.min(1, (e.beta - 45) / 30));
    };
    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', onDeviceOrientation, { passive: true });
    }

    /* ===== FILM GRAIN ===== */
    (function () {
      const ctx = grainCvs.getContext('2d')!;
      const S = 128; // Reduced from 256 — grain doesn't need resolution
      grainCvs.width = grainCvs.height = S;
      const img = ctx.createImageData(S, S);
      for (let i = 0; i < img.data.length; i += 4) {
        const v = Math.random() * 255;
        img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
        img.data[i + 3] = 255;
      }
      ctx.putImageData(img, 0, 0);
    })();

    /* ===== RESIZE — single observer ===== */
    function onResize() {
      resizeStars();
      seedStars();
      resizeSun();
      resizeCosmo();
    }

    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(root.querySelector('.hero')!);
    onResize();

    /* ===== STYLE CACHE — avoid redundant DOM writes ===== */
    const styleCache = new WeakMap<HTMLElement, Record<string, string>>();
    function setStyle(el: HTMLElement, prop: string, val: string) {
      let cache = styleCache.get(el);
      if (!cache) { cache = {}; styleCache.set(el, cache); }
      if (cache[prop] === val) return;
      cache[prop] = val;
      (el.style as unknown as Record<string, string>)[prop] = val;
    }

    /* ===== MAIN LOOP ===== */
    const t0 = performance.now();
    /* Track previous phase to avoid redundant filter updates */
    let prevPhase = '';

    function frame(now: number) {
      const t = (now - t0) / 1000;
      const progress = (t % ECLIPSE_DUR) / ECLIPSE_DUR;
      const eclI = eclipseIntensity(progress);
      const celebI = celebrationIntensity(progress);
      const eclipseRecovery = smoothStep(0.64, 0.70, progress);
      const sunBase = _lerp(1 - eclI * 0.94, 1, eclipseRecovery);
      const sunBright = clamp01(sunBase + celebI * 0.24);
      const celebrationElapsedMs = Math.max(0, (progress - 0.66) * ECLIPSE_DUR * 1000);

      /* Determine phase for throttling expensive updates */
      const phase = celebI > 0.02 ? 'celeb' : eclI > 0.08 ? 'eclipse' : 'radiance';

      /* Parallax — composite-only transforms */
      mX += (mTx - mX) * 0.03;
      mY += (mTy - mY) * 0.03;
      setStyle(starCvs, 'transform', `translate(${mX * -2}px, ${mY * -2}px)`);
      setStyle(nebEl, 'transform', `translate(${mX * -5}px, ${mY * -5}px)`);
      setStyle(stageEl, 'transform', `translate(${mX * -8}px, ${mY * -8}px)`);

      /* Starfield */
      drawStars(t, eclI, celebI);

      /* Sun canvas */
      drawSunScene(t, sunBright, eclI, celebI, progress);

      /* Cosmo celebration canvas */
      drawCosmoScene(t, celebI);

      /* Sun ↔ nova opacity swap follows celebration intensity. */
      const swapT = Math.min(1, celebI * 5);

      /* Sun SVG filter — expensive, only on phase change */
      if (phase !== prevPhase) {
        if (phase === 'celeb') {
          sunSvg.style.filter = `brightness(1.3) drop-shadow(0 0 40px rgba(255,200,70,0.50)) drop-shadow(0 0 80px rgba(255,160,40,0.25))`;
        } else if (phase === 'eclipse') {
          sunSvg.style.filter = `brightness(0.4) drop-shadow(0 0 15px rgba(255,200,70,0.20))`;
        } else {
          sunSvg.style.filter = '';
        }
      }

      /* Sun: gentle celebration pulse + fade out during swap */
      const celebScale = 1 + celebI * 0.04;
      setStyle(sunSvg, 'transform', `translate(-50%, -50%) scale(${celebScale.toFixed(4)})`);
      setStyle(sunSvg, 'opacity', (sunBright * (1 - swapT)).toFixed(3));

      /* Sunnova: fade in during swap, smooth S-curve growth */
      setStyle(sunnovaEl, 'opacity', swapT.toFixed(3));

      const burstT = clamp01(celebrationElapsedMs / 800);
      let novaScale = 0.3;
      if (burstT < 0.65) {
        const up = burstT / 0.65;
        novaScale = 0.3 + (1.25 - 0.3) * easeOutBack(up);
      } else {
        const settleT = (burstT - 0.65) / 0.35;
        const settle = 1 - Math.pow(1 - settleT, 3);
        novaScale = 1.25 + (1.0 - 1.25) * settle;
      }
      setStyle(sunnovaEl, 'transform', `translate(-50%, -50%) scale(${novaScale.toFixed(4)})`);

      /* Sunnova filter — expensive, only on phase change */
      if (phase !== prevPhase) {
        if (celebI > 0.01) {
          sunnovaEl.style.filter = `brightness(2.0) drop-shadow(0 0 80px rgba(255,230,100,0.70)) drop-shadow(0 0 180px rgba(255,200,60,0.40))`;
        } else {
          sunnovaEl.style.filter = '';
        }
      }

      prevPhase = phase;

      /* Simple opacity/transform updates — cheap */
      setStyle(ambEl, 'opacity', Math.min(1, sunBright + celebI * 0.5).toFixed(3));
      setStyle(washEl, 'opacity', (celebI * 1.0).toFixed(3));
      setStyle(nebEl, 'opacity', (0.85 + celebI * 0.15).toFixed(3));
      setStyle(vigEl, 'opacity', Math.max(0.08, 1 - celebI * 0.92).toFixed(3));

      /* Moon */
      const mp = moonPos(progress);
      const stW = stageEl.clientWidth, stH = stageEl.clientHeight;
      const mSize = MOON_FRAC * stW;
      moonEl.style.left = (mp.x * stW - mSize / 2) + 'px';
      moonEl.style.top  = (mp.y * stH - mSize / 2) + 'px';
      const moonFade = Math.max(0, mp.o * (1 - celebI * 3));
      setStyle(moonEl, 'opacity', moonFade.toFixed(3));

      /* Moon filter — only update on phase change */
      if (phase !== prevPhase || phase === 'eclipse') {
        if (eclI > 0.1) {
          moonEl.style.filter = `drop-shadow(0 0 ${(12 + eclI * 30).toFixed(0)}px rgba(160,100,255,${(0.35 + eclI * 0.45).toFixed(2)})) drop-shadow(0 0 ${(40 + eclI * 120).toFixed(0)}px rgba(130,60,240,${(0.15 + eclI * 0.50).toFixed(2)}))`;
        } else {
          moonEl.style.filter = 'drop-shadow(0 0 10px rgba(160,100,255,0.30)) drop-shadow(0 0 25px rgba(130,60,240,0.12))';
        }
      }

      /* Eclipse darkness */
      setStyle(darkEl, 'opacity', eclI.toFixed(3));

      /* 143 brand text */
      setStyle(brand, 'transform', `translate(-50%, -50%) scale(${celebScale.toFixed(4)})`);
      /* Only update filter on phase changes */
      if (phase !== prevPhase) {
        brand.style.filter = `brightness(${(sunBright + celebI * 0.2).toFixed(3)})`;
      }

      /* Supernova text treatment */
      if (celebI > 0.05) {
        const sn = Math.min(1, (celebI - 0.05) / 0.45);

        row1El.style.color = `rgba(255,255,240,${(0.10 * sn).toFixed(2)})`;
        row1El.style.webkitTextStroke = `${(3.5 * sn).toFixed(1)}px rgba(255,255,255,${(0.98 * sn).toFixed(2)})`;
        row1El.style.textShadow = [
          `0 0 ${(6 + sn * 12).toFixed(0)}px rgba(255,255,255,${(0.80 * sn).toFixed(2)})`,
          `0 0 ${(18 + sn * 30).toFixed(0)}px rgba(255,240,180,${(0.50 * sn).toFixed(2)})`,
          `0 0 ${(40 + sn * 50).toFixed(0)}px rgba(255,210,100,${(0.30 * sn).toFixed(2)})`,
          `0 0 ${(70 + sn * 80).toFixed(0)}px rgba(255,180,60,${(0.18 * sn).toFixed(2)})`,
          `0 0 ${(sn * 130).toFixed(0)}px rgba(147,64,255,${(sn * 0.14).toFixed(2)})`
        ].join(', ');

        const r2scale = 1 + sn * 2.2;
        const r2lift  = sn * -35;
        row2El.style.transform     = `translateY(${r2lift.toFixed(1)}px) scale(${r2scale.toFixed(3)})`;
        row2El.style.fontWeight    = sn > 0.2 ? '900' : '300';
        row2El.style.letterSpacing = `${(0.22 - sn * 0.10).toFixed(2)}em`;
        row2El.style.color         = `rgba(${Math.round(147 + sn * 40)},${Math.round(64 + sn * 30)},255,1)`;
        row2El.style.textShadow    = [
          `0 0 ${(8 + sn * 25).toFixed(0)}px rgba(200,140,255,${(0.80 * sn).toFixed(2)})`,
          `0 0 ${(25 + sn * 55).toFixed(0)}px rgba(168,85,255,${(0.65 + sn * 0.30).toFixed(2)})`,
          `0 0 ${(55 + sn * 90).toFixed(0)}px rgba(147,64,255,${(0.40 + sn * 0.45).toFixed(2)})`,
          `0 0 ${(90 + sn * 130).toFixed(0)}px rgba(120,40,255,${(sn * 0.35).toFixed(2)})`,
          `0 0 ${(sn * 180).toFixed(0)}px rgba(100,20,220,${(sn * 0.20).toFixed(2)})`,
          `0 0 ${(sn * 50).toFixed(0)}px rgba(255,255,255,${(sn * 0.25).toFixed(2)})`
        ].join(', ');
      } else {
        row1El.style.color            = '';
        row1El.style.webkitTextStroke = '';
        row1El.style.textShadow       = '';
        row2El.style.transform        = '';
        row2El.style.fontWeight       = '';
        row2El.style.letterSpacing    = '';
        row2El.style.color            = '';
        row2El.style.textShadow       = '';
      }

      if (revelationChars.length) {
        if (celebI > 0.1) {
          for (let i = 0; i < revelationChars.length; i++) {
            const el = revelationChars[i];
            const charStart = i * 60;
            const localT = clamp01((celebrationElapsedMs - charStart) / 280);
            const alpha = smoothStep(0, 1, localT);
            setStyle(el, 'opacity', alpha.toFixed(3));
            setStyle(el, 'transform', `translateY(${((1 - alpha) * 14).toFixed(1)}px)`);
          }
        } else {
          for (const el of revelationChars) {
            setStyle(el, 'opacity', '0');
            setStyle(el, 'transform', 'translateY(14px)');
          }
        }
      }

      /* Film grain — cheap transform */
      setStyle(grainCvs, 'opacity', (0.018 + eclI * 0.03 + celebI * 0.01).toFixed(3));
      setStyle(grainCvs, 'transform', `translate(${(Math.sin(t * 3.8) * 2).toFixed(1)}%, ${(Math.cos(t * 3.2) * 2).toFixed(1)}%)`);

      rafRef.current = requestAnimationFrame(frame);
    }

    rafRef.current = requestAnimationFrame(frame);

    /* ===== CLEANUP ===== */
    return () => {
      cancelAnimationFrame(rafRef.current);
      document.removeEventListener('mousemove', onMouseMove);
      if (window.DeviceOrientationEvent) {
        window.removeEventListener('deviceorientation', onDeviceOrientation);
      }
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef} data-cosmic-hero-v2>
      <section className="hero" aria-label="143 Leadership hero">
        <canvas className="starfield" aria-hidden="true" />
        <div className="sun-ambient" aria-hidden="true" />
        <div className="nebula" aria-hidden="true" />
        <div className="shooting-star shooting-star--1" aria-hidden="true" />
        <div className="shooting-star shooting-star--2" aria-hidden="true" />
        <div className="vignette" aria-hidden="true" />
        <canvas className="cosmo-canvas" aria-hidden="true" />
        <div className="celebration-wash" aria-hidden="true" />
        <div className="eclipse-darkness" aria-hidden="true" />
        <canvas className="grain" aria-hidden="true" />

        <div className="eclipse-stage" aria-hidden="true">
          <canvas className="sun-canvas" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="sun-svg" src="/marketing/Sun-143.svg" alt="" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="sunnova-svg" src="/marketing/143-sun-nova.png" alt="" />
          <span className="brand-143">143</span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="moon" src="/marketing/Purple-Moon-143.svg" alt="" />
          <div className="revelation-text">
            {REVELATION_TEXT.split('').map((char, index) => (
              <span key={`${char}-${index}`}>{char === ' ' ? '\u00A0' : char}</span>
            ))}
          </div>
        </div>

        <div className="hero-copy">
          <h1 className="row-1">Your light was never gone.</h1>
          <p className="row-2">It was eclipsed.</p>
          <p className="row-3">143 questions to find it again.</p>
          <div className="row-cta">
            <Link href="/preview" className="hero-cta-primary">
              Check My Stability
            </Link>
            <Link href="/sample-report" className="hero-cta-secondary">
              See a sample map
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
