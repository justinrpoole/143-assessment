'use client';

/**
 * CosmicStarfield — CSS-only animated star background.
 * Generates deterministic star positions rendered with GPU-accelerated transforms.
 * Used as a subtle background layer in the footer and sparse pages.
 */

const STAR_COUNT = 30;

// Deterministic pseudo-random positions seeded from index
function starPositions(count: number, seed: number) {
  const stars: { x: number; y: number; size: number; delay: number; duration: number }[] = [];
  for (let i = 0; i < count; i++) {
    const s = ((i + seed) * 2654435761) % 4294967296;
    stars.push({
      x: (s % 1000) / 10,
      y: ((s >> 10) % 1000) / 10,
      size: 0.5 + ((s >> 20) % 3) * 0.5,
      delay: ((s >> 8) % 50) / 10,
      duration: 3 + ((s >> 16) % 40) / 10,
    });
  }
  return stars;
}

const STARS = starPositions(STAR_COUNT, 143);

interface CosmicStarfieldProps {
  className?: string;
}

export default function CosmicStarfield({ className }: CosmicStarfieldProps) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className ?? ''}`}
      aria-hidden="true"
    >
      {STARS.map((star, i) => (
        <span
          key={i}
          className="absolute rounded-full will-change-transform"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
            background: star.size > 1 ? '#F8D011' : 'rgba(255, 255, 255, 0.8)',
            animation: `star-twinkle ${star.duration}s ease-in-out ${star.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}
