'use client';

import { useEffect, useRef } from 'react';

/**
 * StarfieldBackground — Renders a subtle, performant twinkling starfield
 * across the entire page background using a single canvas element.
 * Stars have varying sizes, opacities, and twinkle speeds.
 * Respects prefers-reduced-motion.
 */
export default function StarfieldBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resize handler
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };
    resize();

    // Generate stars
    const STAR_COUNT = Math.min(200, Math.floor((window.innerWidth * window.innerHeight) / 8000));

    interface Star {
      x: number;
      y: number;
      r: number;
      baseAlpha: number;
      twinkleSpeed: number;
      twinkleOffset: number;
      color: string;
    }

    const stars: Star[] = [];
    const h = window.innerHeight;
    const w = window.innerWidth;

    for (let i = 0; i < STAR_COUNT; i++) {
      const roll = Math.random();
      const color = roll < 0.12 ? '#F8D011'   // 12% gold
                  : roll < 0.17 ? '#25f6ff'   // 5% cyan
                  : roll < 0.20 ? '#ff3fb4'   // 3% pink
                  : roll < 0.22 ? '#c6ff4d'   // 2% lime
                  : '#FFFEF5';                 // 78% white
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.5 + 0.3,
        baseAlpha: Math.random() * 0.5 + 0.15,
        twinkleSpeed: Math.random() * 0.003 + 0.001,
        twinkleOffset: Math.random() * Math.PI * 2,
        color,
      });
    }

    if (prefersReduced) {
      // Static stars for reduced motion
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = s.color;
        ctx.globalAlpha = s.baseAlpha * 0.7;
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      return;
    }

    // Animation loop
    let raf: number;
    const animate = (time: number) => {
      ctx.clearRect(0, 0, w, h);

      for (const s of stars) {
        const twinkle = Math.sin(time * s.twinkleSpeed + s.twinkleOffset);
        const alpha = s.baseAlpha + twinkle * s.baseAlpha * 0.6;

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = s.color;
        ctx.globalAlpha = Math.max(0.05, Math.min(0.8, alpha));
        ctx.fill();

        // Add subtle glow for larger stars
        if (s.r > 1) {
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r * 3, 0, Math.PI * 2);
          ctx.fillStyle = s.color;
          ctx.globalAlpha = Math.max(0, alpha * 0.15);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(animate);
    };

    raf = requestAnimationFrame(animate);

    // Debounced resize
    let resizeTimer: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 200);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimer);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden="true"
      style={{ opacity: 0.6 }}
    />
  );
}
