"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { RAY_SHORT_NAMES } from "@/lib/types";
import { rayHex } from "@/lib/ui/ray-colors";

const RAY_KEYS = ["R1", "R2", "R3", "R4", "R5", "R6", "R7", "R8", "R9"] as const;

type RayKey = typeof RAY_KEYS[number];

interface IlluminateBoardProps {
  rayScores?: Record<string, number>;
  title?: string;
}

function clamp(value: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

function toPct(value: number) {
  return `${Math.round(value)}%`;
}

export default function IlluminateBoard({
  rayScores = {},
  title = "Eclipse Console",
}: IlluminateBoardProps) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dotRefs = useRef<Array<HTMLDivElement | null>>([]);
  const moonRefs = useRef<Array<HTMLImageElement | null>>([]);
  const sunRefs = useRef<Array<HTMLImageElement | null>>([]);
  const glowRefs = useRef<Array<HTMLDivElement | null>>([]);

  const [reducedMotion, setReducedMotion] = useState(false);

  const values = useMemo(() => {
    return RAY_KEYS.map((key) => clamp(Number(rayScores[key] ?? 0)));
  }, [rayScores]);

  const avg = useMemo(() => {
    if (values.length === 0) return 0;
    return values.reduce((sum, v) => sum + v, 0) / values.length;
  }, [values]);

  const radiance = Math.round(avg);
  const phase = radiance >= 70 ? "RADIANT" : radiance >= 45 ? "DAWN" : "ECLIPSE";

  const leftX = 82;
  const rightX = 678;
  const topY = 64;
  const gapY = 32;

  const railY = (index: number) => topY + index * gapY;
  const valueToX = (value: number) => leftX + (rightX - leftX) * (clamp(value) / 100);

  const targetsRef = useRef<number[]>(values.map((v) => valueToX(v)));

  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReducedMotion(media.matches);
    apply();
    media.addEventListener?.("change", apply);
    return () => media.removeEventListener?.("change", apply);
  }, []);

  useEffect(() => {
    targetsRef.current = values.map((v) => valueToX(v));
  }, [values]);

  useEffect(() => {
    const panel = panelRef.current;
    const canvas = canvasRef.current;
    if (!panel || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let dpr = 1;
    let width = 0;
    let height = 0;

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      age: number;
      life: number;
      hue: number;
    }> = [];

    const positions = targetsRef.current.map((x) => ({ x, vx: 0 }));

    function resize() {
      if (!panel || !canvas) return;
      const rect = panel.getBoundingClientRect();
      dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
    }

    function emitParticle(x: number, y: number, hue: number) {
      if (reducedMotion) return;
      for (let i = 0; i < 2; i += 1) {
        particles.push({
          x: x + (Math.random() * 6 - 3),
          y: y + (Math.random() * 6 - 3),
          vx: Math.random() * 24 - 12,
          vy: Math.random() * 24 - 12,
          age: 0,
          life: 0.6 + Math.random() * 0.3,
          hue,
        });
      }
    }

    function updateDot(index: number, x: number, y: number, cross: number, hue: number) {
      const dot = dotRefs.current[index];
      const moon = moonRefs.current[index];
      const sun = sunRefs.current[index];
      const glow = glowRefs.current[index];
      if (!dot || !moon || !sun || !glow) return;

      dot.style.transform = `translate(${x - 14}px, ${y - 14}px)`;
      moon.style.opacity = String(1 - cross);
      sun.style.opacity = String(cross);
      glow.style.opacity = String(0.25 + cross * 0.5);
      glow.style.boxShadow = `0 0 20px hsla(${hue}, 90%, 60%, 0.45)`;
    }

    function renderParticles(dt: number) {
      if (!ctx) return;
      ctx.save();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "rgba(0,0,0,0.18)";
      ctx.fillRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";

      for (let i = particles.length - 1; i >= 0; i -= 1) {
        const p = particles[i];
        p.age += dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vy += 10 * dt;

        const t = 1 - p.age / p.life;
        if (t <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.globalAlpha = 0.35 * t;
        ctx.fillStyle = `hsla(${p.hue}, 95%, 65%, 1)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.1 * (0.6 + 0.8 * t), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    function loop(last = performance.now()) {
      const now = performance.now();
      const dt = Math.min(0.033, (now - last) / 1000);

      if (!panel) return;
      const rect = panel.getBoundingClientRect();
      const scaleX = rect.width / 760;
      const scaleY = rect.height / 520;

      for (let i = 0; i < RAY_KEYS.length; i += 1) {
        const target = targetsRef.current[i] ?? leftX;
        const pos = positions[i];
        const v = values[i] ?? 0;

        if (reducedMotion) {
          pos.x = target;
          pos.vx = 0;
        } else {
          const k = 0.18;
          const damp = 0.78;
          const dx = target - pos.x;
          pos.vx += dx * k;
          pos.vx *= damp;
          pos.x += pos.vx;
        }

        const cross = clamp((v - 45) / 10, 0, 1);
        const hue = 265 + cross * (45 - 265);

        const px = pos.x * scaleX;
        const py = railY(i) * scaleY;
        updateDot(i, px, py, cross, hue);
        emitParticle(px, py, hue);
      }

      renderParticles(dt);
      raf = requestAnimationFrame(() => loop(now));
    }

    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(panel);
    raf = requestAnimationFrame(() => loop());

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
    };
  }, [reducedMotion, values]);

  return (
    <section className="console-panel" ref={panelRef}>
      <div className="console-hud">
        <span className="console-tag">{title}</span>
        <span className="console-tag on">Live</span>
      </div>

      <canvas ref={canvasRef} className="console-fx" aria-hidden="true" />

      <svg viewBox="0 0 760 520" className="console-board" aria-label="Eclipse to Radiant Board">
        <defs>
          <linearGradient id="consoleRailGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#7c2cff" stopOpacity="0.95" />
            <stop offset="0.55" stopColor="#7c2cff" stopOpacity="0.95" />
            <stop offset="0.55" stopColor="#ff7a18" stopOpacity="0.95" />
            <stop offset="1" stopColor="#ffd35a" stopOpacity="0.95" />
          </linearGradient>
          <linearGradient id="consoleBorder" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ff2bd6" stopOpacity="0.9" />
            <stop offset="1" stopColor="#ff7a18" stopOpacity="0.9" />
          </linearGradient>
          <linearGradient id="consoleCapFill" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor="rgba(124,44,255,.75)" />
            <stop offset="0.55" stopColor="rgba(255,43,214,.65)" />
            <stop offset="1" stopColor="rgba(255,211,90,.92)" />
          </linearGradient>
        </defs>

        <rect x="22" y="18" width="716" height="360" rx="26" fill="rgba(0,0,0,0)" stroke="url(#consoleBorder)" strokeWidth="4" />
        <rect x="34" y="30" width="692" height="336" rx="22" fill="rgba(0,0,0,0)" stroke="rgba(255,122,24,.25)" strokeWidth="2" />

        {/* Rails */}
        {RAY_KEYS.map((key, index) => {
          const value = values[index] ?? 0;
          const y = railY(index);
          const x = valueToX(value);
          const cross = clamp((value - 45) / 10, 0, 1);
          const color = rayHex(key);

          return (
            <g key={key}>
              <line
                x1={leftX}
                y1={y}
                x2={rightX}
                y2={y}
                stroke="url(#consoleRailGrad)"
                strokeWidth="6"
                strokeLinecap="round"
                opacity="0.9"
              />
              <line
                x1={leftX}
                y1={y}
                x2={rightX}
                y2={y}
                stroke="rgba(255,255,255,.10)"
                strokeWidth="2"
                strokeLinecap="round"
                opacity="0.5"
              />
              <circle
                cx={leftX}
                cy={y}
                r={9}
                fill="rgba(124,44,255,.25)"
                stroke="rgba(124,44,255,.85)"
                strokeWidth={2}
              />
              <circle
                cx={rightX}
                cy={y}
                r={9}
                fill="rgba(255,211,90,.18)"
                stroke="rgba(255,211,90,.70)"
                strokeWidth={2}
              />
              <circle
                cx={x}
                cy={y}
                r={10}
                fill={`color-mix(in srgb, ${color} 40%, rgba(6,3,20,0.8))`}
                stroke={`color-mix(in srgb, ${color} 70%, rgba(255,255,255,0.2))`}
                strokeWidth={2}
                opacity={0.25}
              />
            </g>
          );
        })}

        {/* Console */}
        <g transform="translate(70 392)">
          <rect x="0" y="0" width="620" height="132" rx="18" fill="rgba(6,3,20,.78)" stroke="rgba(124,44,255,.22)" strokeWidth="2" />
          <rect x="10" y="10" width="600" height="112" rx="14" fill="rgba(124,44,255,0.10)" stroke="rgba(255,255,255,.06)" strokeWidth="1" />

          <text x="310" y="30" textAnchor="middle" className="consolePhase">{phase}</text>
          <text x="310" y="64" textAnchor="middle" className="consoleRadiance">{toPct(radiance)}</text>

          <image href="/marketing/Purple-Moon-143.svg" x="16" y="20" width="36" height="36" opacity={phase === "ECLIPSE" ? 1 : 0.3} />
          <image href="/marketing/Sun-143.svg" x="568" y="20" width="36" height="36" opacity={phase === "RADIANT" ? 1 : 0.4} />

          {/* Capacity bars */}
          {RAY_KEYS.map((key, index) => {
            const chartX = 76;
            const chartY = 54;
            const chartW = 468;
            const trackH = 44;
            const spacing = chartW / (RAY_KEYS.length - 1);
            const trackW = 18;
            const fillPad = 2;
            const x = chartX + index * spacing;
            const v = values[index] ?? 0;
            const usableH = trackH - fillPad * 2;
            const fillH = (v / 100) * usableH;
            const fillY = chartY + fillPad + (usableH - fillH);

            return (
              <g key={`cap-${key}`}>
                <text x={x} y={chartY - 4} textAnchor="middle" className="capValue">{Math.round(v)}</text>
                <rect x={x - trackW / 2} y={chartY} width={trackW} height={trackH} rx={trackW / 2} className="capTrack" />
                <rect
                  x={x - trackW / 2 + fillPad}
                  y={fillY}
                  width={trackW - fillPad * 2}
                  height={fillH}
                  rx={(trackW - fillPad * 2) / 2}
                  fill="url(#consoleCapFill)"
                />
                <circle cx={x} cy={fillY} r={10} className="capHandle" />
                <text x={x} y={110} textAnchor="middle" className="capLabel">
                  {(RAY_SHORT_NAMES[key] ?? key).slice(0, 6).toUpperCase()}
                </text>
              </g>
            );
          })}

          <text x="20" y="112" className="consoleHint">Moon → Eclipse → Sun</text>
          <text x="600" y="112" textAnchor="end" className="consoleHint">9 capacities</text>
        </g>
      </svg>

      <div className="console-dots" aria-hidden="true">
        {RAY_KEYS.map((key, index) => (
          <div
            key={`dot-${key}`}
            ref={(el) => {
              dotRefs.current[index] = el;
            }}
            className="console-dot"
          >
            <div
              className="console-dot-glow"
              ref={(el) => {
                glowRefs.current[index] = el;
              }}
            />
            <img
              ref={(el) => {
                moonRefs.current[index] = el;
              }}
              className="console-dot-moon"
              src="/marketing/Purple-Moon-143.svg"
              alt=""
            />
            <img
              ref={(el) => {
                sunRefs.current[index] = el;
              }}
              className="console-dot-sun"
              src="/marketing/Sun-143.svg"
              alt=""
            />
          </div>
        ))}
      </div>
    </section>
  );
}
