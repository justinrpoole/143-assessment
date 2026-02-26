'use client';

/**
 * ConstellationDot — Mini star-pair visual per archetype.
 * Two connected dots positioned deterministically based on archetype index.
 * Purely decorative — no labels, no interactivity.
 */
export default function ConstellationDot({
  index,
  neonColor,
  size = 40,
}: {
  index: number;
  neonColor: string;
  size?: number;
}) {
  // Deterministic positions using golden angle spiral
  const goldenAngle = 2.39996323;
  const angle1 = (index * goldenAngle) % (2 * Math.PI);
  const angle2 = (index * goldenAngle + 1.2) % (2 * Math.PI);

  const r = size * 0.32;
  const cx = size / 2;
  const cy = size / 2;

  const x1 = cx + r * Math.cos(angle1);
  const y1 = cy + r * Math.sin(angle1);
  const x2 = cx + r * Math.cos(angle2);
  const y2 = cy + r * Math.sin(angle2);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      aria-hidden="true"
      className="flex-shrink-0 transition-opacity duration-200 opacity-75 group-hover:opacity-100"
    >
      {/* Connection line */}
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={neonColor}
        strokeWidth={1}
        opacity={0.5}
      />
      {/* Star dots */}
      <circle cx={x1} cy={y1} r={3} fill={neonColor} />
      <circle cx={x2} cy={y2} r={3} fill={neonColor} />
      {/* Glow halos */}
      <circle cx={x1} cy={y1} r={6} fill={neonColor} opacity={0.15} />
      <circle cx={x2} cy={y2} r={6} fill={neonColor} opacity={0.15} />
    </svg>
  );
}
