'use client';

import type { LightSignatureOutput, EclipseOutput, RayOutput } from '@/lib/types';
import { ScienceToggle } from './ScienceToggle';

interface Props {
  lightSignature: LightSignatureOutput;
  eclipse?: EclipseOutput;
  rays?: Record<string, RayOutput>;
}

/**
 * The opening narrative of the results page. Identity story first,
 * numbers nowhere. This tells the user who they are in this moment —
 * what capacities are online, what is under load, and what comes next.
 *
 * Written in second person, warm-direct tone. No clinical language.
 */
export default function IdentityStory({ lightSignature, eclipse, rays }: Props) {
  const { archetype, top_two, just_in_ray } = lightSignature;
  const topRayNames = top_two.map((r) => r.ray_name);
  const bottomRayName = just_in_ray?.ray_name;
  const eclipseLevel = eclipse?.level ?? 'MODERATE';
  const gateMode = eclipse?.gating?.mode;

  // Determine overall energy state for narrative tone
  const avgNetEnergy = rays
    ? Object.values(rays).reduce((sum, r) => sum + (r.net_energy ?? r.score), 0) /
      Object.values(rays).length
    : 50;
  const energyState = avgNetEnergy >= 60 ? 'resourced' : avgNetEnergy >= 45 ? 'mixed' : 'under-load';

  return (
    <section className="space-y-6">
      {/* Identity Headline */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ boxShadow: 'var(--shadow-glow-md)' }}
      >
        <div
          className="px-6 py-10 text-center"
          style={{
            background:
              'linear-gradient(135deg, var(--bg-deep-mid) 0%, rgba(114, 21, 184, 0.30) 50%, var(--bg-deep) 100%)',
            borderBottom: '1px solid var(--surface-border)',
          }}
        >
          <p
            className="text-xs tracking-widest uppercase mb-3"
            style={{ color: 'var(--brand-gold, #F8D011)' }}
          >
            Your Light Signature
          </p>
          {archetype && (
            <h2
              className="text-3xl font-bold"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--text-on-dark)' }}
            >
              {archetype.name}
            </h2>
          )}
          {topRayNames.length >= 2 && (
            <p
              className="mt-2 text-sm"
              style={{ color: 'var(--text-on-dark-secondary)' }}
            >
              {topRayNames[0]} + {topRayNames[1]}
            </p>
          )}
        </div>

        {/* Narrative Story — The Heart of the Component */}
        <div
          className="px-6 py-6 space-y-4"
          style={{ background: 'var(--surface-glass)' }}
        >
          {/* Paragraph 1: What is working */}
          <p
            className="text-sm leading-relaxed"
            style={{ color: 'var(--text-on-dark)' }}
          >
            {topRayNames.length >= 2
              ? `Right now, ${topRayNames[0]} and ${topRayNames[1]} are your most accessible capacities. These are not aspirations. They are active — your nervous system reaches for them first, especially when things get hard.`
              : topRayNames.length === 1
              ? `Right now, ${topRayNames[0]} is your most accessible capacity. This is not aspiration. It is active — your nervous system reaches for it first, especially when things get hard.`
              : 'Your capacities are real and present. This report maps where they are right now.'}
          </p>

          {/* Paragraph 2: Eclipse context */}
          <p
            className="text-sm leading-relaxed"
            style={{ color: 'var(--text-on-dark-secondary)' }}
          >
            {eclipseLevel === 'LOW'
              ? 'Your system is steady. Load is low, which means your capacity for growth work is high. The tools will land deeper when your nervous system is not in protection mode. This is a window — use it.'
              : eclipseLevel === 'MODERATE'
              ? 'You are carrying some load right now. That is normal — it does not erase what is working. Your strongest capacities remain online. The data will show you where load is sitting so you can work with it, not against it.'
              : eclipseLevel === 'ELEVATED'
              ? 'Your system is working hard right now. The load is real, and it is temporarily covering some of what you can do. None of it is gone. Recovery is the rep before growth — start there.'
              : 'Your system is under significant load. What you are seeing is protection, not limitation. Every capacity you have is still in you — the path right now is recovery first, then one small rep when you are ready.'}
          </p>

          {/* Paragraph 3: Rise Path preview */}
          {bottomRayName && (
            <p
              className="text-sm leading-relaxed"
              style={{ color: 'var(--text-on-dark-secondary)' }}
            >
              {gateMode === 'STABILIZE'
                ? `Your Rise Path points to ${bottomRayName}. Right now, the system recommends stabilizing before building range. That means recovery tools and micro-reps — not a push. The reps will be small on purpose.`
                : `Your Rise Path points to ${bottomRayName}. This is the capacity with the most room to move. One rep today — not ten — teaches your brain that change is underway. The plan below will show you exactly where to start.`}
            </p>
          )}

          {/* Paragraph 4: Energy state */}
          <p
            className="text-sm leading-relaxed italic"
            style={{ color: 'var(--text-on-dark-muted)' }}
          >
            {energyState === 'resourced'
              ? 'Nothing here is beyond you. Something here is ready.'
              : energyState === 'mixed'
              ? 'Your capacity is not gone. It is right here, in the data, waiting for you to use it.'
              : 'This is a starting line, not a verdict. Every number in this report can move.'}
          </p>
        </div>
      </div>

      <ScienceToggle
        mechanism="Your Light Signature is determined by Net Energy — the balance between Shine (baseline capacity) and Eclipse (current load) across all 9 Rays. Your two Power Sources — the Rays with the highest net energy — form your archetype pair. There are 36 possible combinations."
        anchor="scoring-model"
      />
    </section>
  );
}
