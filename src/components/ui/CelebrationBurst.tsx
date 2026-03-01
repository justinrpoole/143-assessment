'use client';

import { useEffect, useState } from 'react';

const RAY_COLORS = ['#60A5FA','#F4C430','#8E44AD','#2ECC71','#E74C8B','#1ABC9C','#F8D011','#D4770B','#C0392B'];

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  rotation: number;
  shape: 'circle' | 'square' | 'star';
}

function makeParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2 + Math.random() * 0.5;
    const speed = 80 + Math.random() * 120;
    return {
      id: i,
      x: 50,
      y: 50,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      color: RAY_COLORS[i % RAY_COLORS.length],
      size: 4 + Math.random() * 6,
      rotation: Math.random() * 360,
      shape: (['circle','square','star'] as const)[Math.floor(Math.random() * 3)],
    };
  });
}

interface CelebrationBurstProps {
  trigger: boolean;
  className?: string;
}

export default function CelebrationBurst({ trigger, className }: CelebrationBurstProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!trigger) return;
    setParticles(makeParticles(40));
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 1500);
    return () => clearTimeout(t);
  }, [trigger]);

  if (!visible) return null;

  return (
    <div
      className={`pointer-events-none fixed inset-0 z-[200] overflow-hidden ${className ?? ''}`}
      aria-hidden="true"
    >
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: p.color,
            borderRadius: p.shape === 'circle' ? '50%' : p.shape === 'square' ? '2px' : '0',
            transform: `rotate(${p.rotation}deg)`,
            boxShadow: `0 0 6px ${p.color}`,
            animation: `burst-${p.id % 8} 1.2s cubic-bezier(0.1, 0.8, 0.2, 1) forwards`,
          }}
        />
      ))}
      <style>{`
        @keyframes burst-0 { to { transform: translate(${-60}px, ${-120}px) rotate(720deg); opacity: 0; } }
        @keyframes burst-1 { to { transform: translate(${80}px, ${-100}px) rotate(-540deg); opacity: 0; } }
        @keyframes burst-2 { to { transform: translate(${120}px, ${20}px) rotate(600deg); opacity: 0; } }
        @keyframes burst-3 { to { transform: translate(${60}px, ${110}px) rotate(-480deg); opacity: 0; } }
        @keyframes burst-4 { to { transform: translate(${-80}px, ${90}px) rotate(360deg); opacity: 0; } }
        @keyframes burst-5 { to { transform: translate(${-130}px, ${-20}px) rotate(-720deg); opacity: 0; } }
        @keyframes burst-6 { to { transform: translate(${30}px, ${-140}px) rotate(540deg); opacity: 0; } }
        @keyframes burst-7 { to { transform: translate(${-50}px, ${130}px) rotate(-360deg); opacity: 0; } }
      `}</style>
    </div>
  );
}
