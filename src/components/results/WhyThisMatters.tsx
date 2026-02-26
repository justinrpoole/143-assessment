'use client';

import type { RayOutput, EclipseOutput } from '@/lib/types';
import { rayHex } from '@/lib/ui/ray-colors';

interface Props {
  rays: Record<string, RayOutput>;
  eclipse?: EclipseOutput;
}

/**
 * State-aware "Why This Matters Today" narrative for each ray.
 * Shows a contextual paragraph per ray that changes based on
 * whether the ray is HIGH/LOW access and STABILIZE/GROW gate.
 */

const RAY_CONTEXT: Record<string, {
  high: string;
  low: string;
  eclipsed: string;
}> = {
  R1: {
    high: 'Intention is online. You are setting direction before the day sets it for you. Protect this — it is the upstream capacity that makes every other rep stick.',
    low: 'Intention is accessible but not yet automatic. The rep is simple: before opening your phone, name one thing that matters today. That single act trains the filter.',
    eclipsed: 'Intention is temporarily covered by load. When the system is overworked, direction-setting is the first thing to go. Start with one priority written down. That is the whole rep.',
  },
  R2: {
    high: 'Joy is accessible and active. You are finding micro-recovery independent of conditions. This protects your nervous system and makes hard weeks survivable.',
    low: 'Joy access is reduced right now. This does not mean you lost it — it means load has narrowed what your RAS scans for. One deliberate moment of noticing what is working rewires the default.',
    eclipsed: 'Joy is temporarily eclipsed. Under high load, the brain stops scanning for positive signals. This is protective, not permanent. The micro-rep: name one thing that worked today. That is enough.',
  },
  R3: {
    high: 'Presence is strong. You are staying with tasks and people without fragmenting. This capacity compounds — attention is the foundation everything else is built on.',
    low: 'Presence is available but fragmenting under load. The rep is a Presence Pause: one exhale, feet on the floor, name what you feel. Ten seconds rebuilds the circuit.',
    eclipsed: 'Presence is temporarily covered. When the system is flooded, attention splinters. Do not fight it. The recovery rep is body-first: one breath, one grounding moment, then return to one thing.',
  },
  R4: {
    high: 'Power is online. You are identifying fear without fusing to it and acting with courage. This is the capacity that turns insight into motion.',
    low: 'Power is accessible but hesitant under pressure. The rep is small and specific: one boundary, one honest sentence, one moment where you go first. Courage is a practice, not a mood.',
    eclipsed: 'Power is temporarily covered by load. Under eclipse, the system pulls toward freeze, flight, or forced action. The recovery path: name the fear out loud, then choose one controllable action.',
  },
  R5: {
    high: 'Purpose is clear. You are making tradeoffs from values, not urgency. This gives your decisions a backbone that outlasts any single hard day.',
    low: 'Purpose is present but quiet. When load rises, meaning gets crowded out by tasks. The rep: ask "why does this matter?" once before your biggest block of work today.',
    eclipsed: 'Purpose is temporarily covered. Under high load, everything feels urgent and nothing feels meaningful. The recovery rep is not a grand vision — it is one honest answer to "what matters most right now?"',
  },
  R6: {
    high: 'Authenticity is active. You are showing the same self across contexts. This builds trust faster than any technique and reduces the energy tax of performing.',
    low: 'Authenticity is accessible but context-dependent. The rep: notice one moment today where you adjusted your real answer. That noticing is the first half of the rep. The second half is saying the real thing next time.',
    eclipsed: 'Authenticity is temporarily covered. Under load, the system defaults to the version of you that feels safest. Recovery path: one honest sentence to one safe person. That is the whole rep.',
  },
  R7: {
    high: 'Connection is strong. You are showing up in relationships with presence and follow-through. This is the capacity that turns individual strength into collective trust.',
    low: 'Connection is available but strained. When load rises, relationships are the first thing we put on autopilot. The rep: one real question to one person today — and actually listen to the answer.',
    eclipsed: 'Connection is temporarily covered. Under high load, the system isolates to protect. This is not a character flaw — it is a survival response. The recovery rep: one text, one check-in, one moment of real contact.',
  },
  R8: {
    high: 'Possibility is open. You are seeing options, solving creatively, and staying open to change. This capacity protects against rigidity and keeps your leadership adaptive.',
    low: 'Possibility is narrowing under load. When the system is stressed, it defaults to proven patterns and stops exploring. The rep: name one thing you would try if it did not have to work perfectly.',
    eclipsed: 'Possibility is temporarily covered. Under eclipse, the brain shuts down exploration to conserve energy. Recovery path: do not force creativity. Rest first, then one small "what if" when you are ready.',
  },
  R9: {
    high: 'Be The Light is active. You are holding space for others while staying regulated yourself. This is the highest-order capacity — it requires the other eight to be accessible.',
    low: 'Be The Light is accessible but inconsistent. This ray draws on all the others — when any single ray drops, your ability to hold space contracts. The path: strengthen your Rise Path first. This one follows.',
    eclipsed: 'Be The Light is temporarily covered. Under load, the capacity to hold space for others shuts down. This is not selfishness — it is a full system. Recovery comes before service. Take care of yourself first.',
  },
};

export default function WhyThisMatters({ rays, eclipse }: Props) {
  const eclipseLevel = eclipse?.level ?? 'MODERATE';
  const sortedRays = Object.values(rays).sort(
    (a, b) => (b.net_energy ?? b.score) - (a.net_energy ?? a.score),
  );

  return (
    <section className="space-y-4">
      <div>
        <p
          className="text-xs font-bold uppercase tracking-widest"
          style={{ color: 'var(--brand-gold, #F8D011)' }}
        >
          Why This Matters Today
        </p>
        <h2
          className="mt-2 text-lg font-semibold"
          style={{ color: 'var(--text-on-dark)' }}
        >
          Your 9 Rays — what is working and what needs attention
        </h2>
      </div>

      <div className="space-y-3">
        {sortedRays.map((ray) => {
          const context = RAY_CONTEXT[ray.ray_id];
          if (!context) return null;

          const netEnergy = ray.net_energy ?? ray.score;
          const eclipseScore = ray.eclipse_score ?? 0;
          const isEclipsed =
            eclipseScore > 60 ||
            (eclipseLevel === 'HIGH' && netEnergy < 40);
          const isHigh = !isEclipsed && netEnergy >= 55;

          const narrative = isEclipsed
            ? context.eclipsed
            : isHigh
            ? context.high
            : context.low;

          // Visual indicator color — ray-specific when online, status colors under load
          const rc = rayHex(ray.ray_id);
          const indicatorColor = isEclipsed
            ? '#fb923c'
            : isHigh
            ? rc
            : 'var(--brand-gold, #F8D011)';

          return (
            <div key={ray.ray_id} className="glass-card p-4" style={{ borderLeft: `3px solid ${isEclipsed ? '#fb923c60' : `${rc}40`}` }}>
              <div className="flex items-center gap-2 mb-1.5">
                <span
                  className="inline-block h-2 w-2 rounded-full"
                  style={{ background: indicatorColor }}
                />
                <h3
                  className="text-sm font-semibold"
                  style={{ color: 'var(--text-on-dark)' }}
                >
                  {ray.ray_name}
                </h3>
                <span
                  className="text-[10px] uppercase tracking-wider"
                  style={{ color: indicatorColor }}
                >
                  {isEclipsed ? 'Under Load' : isHigh ? 'Online' : 'Building'}
                </span>
              </div>
              <p
                className="text-sm leading-relaxed"
                style={{ color: 'var(--text-on-dark-secondary)' }}
              >
                {narrative}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
