'use client';

import { useCallback, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  angle: number;
  distance: number;
  color: string;
}

/**
 * GoldParticleBurst — 8-12 tiny gold particles radiate outward on click.
 * Wrap around any clickable element. Pure CSS animation, no canvas.
 */
export default function GoldParticleBurst({ children }: { children: React.ReactNode }) {
  const [particles, setParticles] = useState<Particle[]>([]);

  const burst = useCallback((e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const count = 8 + Math.floor(Math.random() * 5);
    const neonColors = ['#F8D011', '#F8D011', '#F8D011', '#25f6ff', '#ff3fb4', '#c6ff4d', '#8b5bff'];
    const batch = Array.from({ length: count }, (_, i) => ({
      id: Date.now() + i,
      x: cx,
      y: cy,
      angle: (360 / count) * i + Math.random() * 20 - 10,
      distance: 30 + Math.random() * 40,
      color: neonColors[Math.floor(Math.random() * neonColors.length)],
    }));
    setParticles(batch);
    setTimeout(() => setParticles([]), 600);
  }, []);

  return (
    <span style={{ position: 'relative', display: 'inline-flex' }} onClick={burst}>
      {children}
      {particles.map((p) => (
        <span
          key={p.id}
          className="gold-particle"
          style={{
            '--angle': `${p.angle}deg`,
            '--distance': `${p.distance}px`,
            background: p.color,
          } as React.CSSProperties}
        />
      ))}
    </span>
  );
}
