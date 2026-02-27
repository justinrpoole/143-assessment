'use client';

/**
 * FloatingOrbs — Subtle ambient glow orbs that float between sections.
 * Positioned absolutely within a section to add depth and atmosphere.
 * Pure CSS animation — no JS overhead.
 */
export default function FloatingOrbs({
  variant = 'gold',
  className,
}: {
  variant?: 'gold' | 'purple' | 'mixed' | 'neon';
  className?: string;
}) {
  const orbs = variant === 'neon'
    ? [
        { color: 'rgba(37,246,255,0.05)', size: 260, x: '20%', y: '25%', dur: '20s', delay: '0s' },
        { color: 'rgba(255,63,180,0.04)', size: 200, x: '70%', y: '50%', dur: '16s', delay: '-4s' },
        { color: 'rgba(198,255,77,0.03)', size: 180, x: '45%', y: '75%', dur: '22s', delay: '-8s' },
      ]
    : variant === 'mixed'
    ? [
        { color: 'rgba(248,208,17,0.06)', size: 280, x: '15%', y: '20%', dur: '18s', delay: '0s' },
        { color: 'rgba(96,5,141,0.08)', size: 220, x: '75%', y: '60%', dur: '22s', delay: '-5s' },
        { color: 'rgba(37,246,255,0.03)', size: 160, x: '50%', y: '40%', dur: '17s', delay: '-9s' },
      ]
    : variant === 'purple'
    ? [
        { color: 'rgba(96,5,141,0.1)', size: 260, x: '20%', y: '30%', dur: '20s', delay: '0s' },
        { color: 'rgba(148,80,200,0.06)', size: 200, x: '70%', y: '50%', dur: '16s', delay: '-4s' },
      ]
    : [
        { color: 'rgba(248,208,17,0.06)', size: 240, x: '25%', y: '25%', dur: '19s', delay: '0s' },
        { color: 'rgba(248,208,17,0.04)', size: 190, x: '65%', y: '55%', dur: '23s', delay: '-6s' },
      ];

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className ?? ''}`} aria-hidden="true">
      {orbs.map((orb, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: orb.size,
            height: orb.size,
            left: orb.x,
            top: orb.y,
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
            animation: `orbFloat ${orb.dur} ease-in-out infinite`,
            animationDelay: orb.delay,
            filter: 'blur(40px)',
          }}
        />
      ))}
      <style>{`
        @keyframes orbFloat {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(15px, -20px) scale(1.05); }
          50% { transform: translate(-10px, 10px) scale(0.95); }
          75% { transform: translate(20px, 15px) scale(1.02); }
        }
      `}</style>
    </div>
  );
}
