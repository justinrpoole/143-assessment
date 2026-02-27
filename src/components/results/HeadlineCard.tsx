'use client';

import type { AssessmentOutputV1 } from '@/lib/types';
import { RAY_COLORS } from '@/lib/ui/ray-colors';

interface Props {
  output: AssessmentOutputV1;
}

function rayColor(id: string): string {
  return RAY_COLORS[id]?.hex ?? '#F8D011';
}

/**
 * Tier 1 Progressive Disclosure — the headline card.
 * One-sentence identity statement, top 2 rays as color chips,
 * eclipse weather badge, and rise path preview.
 * Designed to be scanned in under 5 seconds.
 */
export default function HeadlineCard({ output }: Props) {
  const archetype = output.light_signature?.archetype;
  const topTwo = output.light_signature?.top_two ?? [];
  const eclipse = output.eclipse;
  const justIn = output.light_signature?.just_in_ray;

  if (!archetype) return null;

  const eclipseLabels: Record<string, string> = {
    LOW: 'Low load',
    MODERATE: 'Moderate load',
    ELEVATED: 'Elevated load',
    HIGH: 'High load',
  };
  const eclipseColors: Record<string, string> = {
    LOW: '#A78BFA',
    MODERATE: '#F8D011',
    ELEVATED: '#F59E0B',
    HIGH: '#FB923C',
  };

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(96, 5, 141, 0.25) 0%, rgba(30, 14, 53, 0.9) 100%)',
        border: '1px solid var(--surface-border)',
        boxShadow: 'var(--shadow-glow-md)',
      }}
    >
      <div className="px-5 py-6 sm:px-6">
        {/* Archetype name */}
        <p
          className="text-xs tracking-[0.25em] uppercase mb-1"
          style={{ color: 'var(--brand-gold, #F8D011)' }}
        >
          Your Light Signature
        </p>
        <h2
          className="text-2xl sm:text-3xl font-bold"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--text-on-dark)' }}
        >
          {archetype.name}
        </h2>

        {/* Chip row: top rays + eclipse */}
        <div className="flex flex-wrap items-center gap-2 mt-4">
          {topTwo.map((ray) => (
            <span
              key={ray.ray_id}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full"
              style={{
                background: `${rayColor(ray.ray_id)}15`,
                border: `1px solid ${rayColor(ray.ray_id)}30`,
                color: rayColor(ray.ray_id),
              }}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: rayColor(ray.ray_id) }}
              />
              {ray.ray_name}
            </span>
          ))}
          {eclipse && (
            <span
              className="text-xs font-medium px-3 py-1 rounded-full"
              style={{
                background: `${eclipseColors[eclipse.level] ?? '#F8D011'}12`,
                border: `1px solid ${eclipseColors[eclipse.level] ?? '#F8D011'}25`,
                color: eclipseColors[eclipse.level] ?? '#F8D011',
              }}
            >
              {eclipseLabels[eclipse.level] ?? eclipse.level}
            </span>
          )}
        </div>

        {/* One-sentence identity */}
        <p
          className="mt-4 text-sm leading-relaxed"
          style={{ color: 'var(--text-on-dark-secondary)' }}
        >
          {archetype.essence || `${topTwo[0]?.ray_name ?? 'Your first ray'} and ${topTwo[1]?.ray_name ?? 'your second ray'} are your most accessible capacities right now.`}
        </p>

        {/* Rise path teaser */}
        {justIn && (
          <p
            className="mt-3 text-xs"
            style={{ color: 'var(--text-on-dark-muted)' }}
          >
            Rise Path: <span style={{ color: rayColor(justIn.ray_id) }}>{justIn.ray_name}</span>
            {' '}&mdash; the capacity with the most room to move
          </p>
        )}
      </div>
    </div>
  );
}
