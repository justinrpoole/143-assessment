'use client';

import dynamic from 'next/dynamic';
import { FadeInSection } from '@/components/ui/FadeInSection';
import IdentityStory from '@/components/results/IdentityStory';
import LightSignature from '@/components/results/LightSignature';
import BottomRay from '@/components/results/BottomRay';
import WhyThisMatters from '@/components/results/WhyThisMatters';
import WeekOneChecklist from '@/components/results/WeekOneChecklist';
import ArchetypeCoachingCard from '@/components/portal/ArchetypeCoachingCard';
import GrowthSignalCard from '@/components/portal/GrowthSignalCard';
import BadgeShowcase from '@/components/portal/BadgeShowcase';
import ContextualActions from '@/components/portal/ContextualActions';
import RayDivider from '@/components/ui/RayDivider';
import type {
  RayOutput,
  EclipseOutput,
  LightSignatureOutput,
} from '@/lib/types';

const EnergyStarChart = dynamic(() => import('@/components/cosmic/EnergyStarChart'), { ssr: false });
const SolarCoreScore = dynamic(() => import('@/components/cosmic/SolarCoreScore'), { ssr: false });
const EclipseMeter = dynamic(() => import('@/components/cosmic/EclipseMeter'), { ssr: false });
const MoonToSunSlider = dynamic(() => import('@/components/cosmic/MoonToSunSlider'), { ssr: false });

// ---------------------------------------------------------------------------
// Consistent sample data — "Driven Leader" (R5-R4), same person throughout
// ---------------------------------------------------------------------------

const SAMPLE_RAYS: Record<string, RayOutput> = {
  R1: {
    ray_id: 'R1', ray_name: 'Intention', score: 72, net_energy: 72,
    access_score: 65, eclipse_score: 28, eclipse_modifier: 'NONE',
    subfacets: {
      R1a: { subfacet_id: 'R1a', label: 'Daily Intentionality', score: 78, polarity_mix: { shine: 78, eclipse: 22 }, signal_tags: [] },
      R1b: { subfacet_id: 'R1b', label: 'Time/Attention Architecture', score: 65, polarity_mix: { shine: 65, eclipse: 35 }, signal_tags: [] },
      R1c: { subfacet_id: 'R1c', label: 'Boundary Clarity', score: 70, polarity_mix: { shine: 70, eclipse: 30 }, signal_tags: [] },
      R1d: { subfacet_id: 'R1d', label: 'Pre-Decision Practice', score: 74, polarity_mix: { shine: 74, eclipse: 26 }, signal_tags: [] },
    },
  },
  R2: {
    ray_id: 'R2', ray_name: 'Joy', score: 45, net_energy: 45,
    access_score: 38, eclipse_score: 58, eclipse_modifier: 'NONE',
    subfacets: {
      R2a: { subfacet_id: 'R2a', label: 'Joy Access', score: 42, polarity_mix: { shine: 42, eclipse: 58 }, signal_tags: [] },
      R2b: { subfacet_id: 'R2b', label: 'Gratitude Practice', score: 50, polarity_mix: { shine: 50, eclipse: 50 }, signal_tags: [] },
      R2c: { subfacet_id: 'R2c', label: 'Reinforcement Behavior', score: 38, polarity_mix: { shine: 38, eclipse: 62 }, signal_tags: [] },
      R2d: { subfacet_id: 'R2d', label: 'Recovery Integration', score: 48, polarity_mix: { shine: 48, eclipse: 52 }, signal_tags: [] },
    },
  },
  R3: {
    ray_id: 'R3', ray_name: 'Presence', score: 68, net_energy: 68,
    access_score: 60, eclipse_score: 32, eclipse_modifier: 'NONE',
    subfacets: {
      R3a: { subfacet_id: 'R3a', label: 'Attention Stability', score: 72, polarity_mix: { shine: 72, eclipse: 28 }, signal_tags: [] },
      R3b: { subfacet_id: 'R3b', label: 'Cognitive Flexibility', score: 65, polarity_mix: { shine: 65, eclipse: 35 }, signal_tags: [] },
      R3c: { subfacet_id: 'R3c', label: 'Body Signal Awareness', score: 62, polarity_mix: { shine: 62, eclipse: 38 }, signal_tags: [] },
      R3d: { subfacet_id: 'R3d', label: 'Emotional Regulation', score: 70, polarity_mix: { shine: 70, eclipse: 30 }, signal_tags: [] },
    },
  },
  R4: {
    ray_id: 'R4', ray_name: 'Power', score: 85, net_energy: 85,
    access_score: 80, eclipse_score: 15, eclipse_modifier: 'NONE',
    subfacets: {
      R4a: { subfacet_id: 'R4a', label: 'Agency/Action Orientation', score: 88, polarity_mix: { shine: 88, eclipse: 12 }, signal_tags: [] },
      R4b: { subfacet_id: 'R4b', label: 'Boundary Enforcement', score: 82, polarity_mix: { shine: 82, eclipse: 18 }, signal_tags: [] },
      R4c: { subfacet_id: 'R4c', label: 'Conflict Engagement', score: 80, polarity_mix: { shine: 80, eclipse: 20 }, signal_tags: [] },
      R4d: { subfacet_id: 'R4d', label: 'Power Under Pressure', score: 90, polarity_mix: { shine: 90, eclipse: 10 }, signal_tags: [] },
    },
  },
  R5: {
    ray_id: 'R5', ray_name: 'Purpose', score: 91, net_energy: 91,
    access_score: 88, eclipse_score: 9, eclipse_modifier: 'NONE',
    subfacets: {
      R5a: { subfacet_id: 'R5a', label: 'Purpose Clarity', score: 94, polarity_mix: { shine: 94, eclipse: 6 }, signal_tags: [] },
      R5b: { subfacet_id: 'R5b', label: 'Values Alignment', score: 90, polarity_mix: { shine: 90, eclipse: 10 }, signal_tags: [] },
      R5c: { subfacet_id: 'R5c', label: 'Meaningful Contribution', score: 88, polarity_mix: { shine: 88, eclipse: 12 }, signal_tags: [] },
      R5d: { subfacet_id: 'R5d', label: 'Long-Range Thinking', score: 92, polarity_mix: { shine: 92, eclipse: 8 }, signal_tags: [] },
    },
  },
  R6: {
    ray_id: 'R6', ray_name: 'Authenticity', score: 63, net_energy: 63,
    access_score: 55, eclipse_score: 42, eclipse_modifier: 'AMPLIFIED',
    subfacets: {
      R6a: { subfacet_id: 'R6a', label: 'Self-Disclosure', score: 58, polarity_mix: { shine: 58, eclipse: 42 }, signal_tags: [] },
      R6b: { subfacet_id: 'R6b', label: 'Congruence', score: 65, polarity_mix: { shine: 65, eclipse: 35 }, signal_tags: [] },
      R6c: { subfacet_id: 'R6c', label: 'Vulnerability Tolerance', score: 55, polarity_mix: { shine: 55, eclipse: 45 }, signal_tags: [] },
      R6d: { subfacet_id: 'R6d', label: 'Identity Integration', score: 72, polarity_mix: { shine: 72, eclipse: 28 }, signal_tags: [] },
    },
  },
  R7: {
    ray_id: 'R7', ray_name: 'Connection', score: 78, net_energy: 78,
    access_score: 72, eclipse_score: 22, eclipse_modifier: 'NONE',
    subfacets: {
      R7a: { subfacet_id: 'R7a', label: 'Relational Safety Creation', score: 80, polarity_mix: { shine: 80, eclipse: 20 }, signal_tags: [] },
      R7b: { subfacet_id: 'R7b', label: 'Empathic Accuracy', score: 75, polarity_mix: { shine: 75, eclipse: 25 }, signal_tags: [] },
      R7c: { subfacet_id: 'R7c', label: 'Repair Initiation', score: 72, polarity_mix: { shine: 72, eclipse: 28 }, signal_tags: [] },
      R7d: { subfacet_id: 'R7d', label: 'Trust Building', score: 84, polarity_mix: { shine: 84, eclipse: 16 }, signal_tags: [] },
    },
  },
  R8: {
    ray_id: 'R8', ray_name: 'Possibility', score: 56, net_energy: 56,
    access_score: 48, eclipse_score: 46, eclipse_modifier: 'NONE',
    subfacets: {
      R8a: { subfacet_id: 'R8a', label: 'Cognitive Openness', score: 60, polarity_mix: { shine: 60, eclipse: 40 }, signal_tags: [] },
      R8b: { subfacet_id: 'R8b', label: 'Divergent Thinking', score: 52, polarity_mix: { shine: 52, eclipse: 48 }, signal_tags: [] },
      R8c: { subfacet_id: 'R8c', label: 'Adaptive Flexibility', score: 50, polarity_mix: { shine: 50, eclipse: 50 }, signal_tags: [] },
      R8d: { subfacet_id: 'R8d', label: 'Creative Problem-Solving', score: 62, polarity_mix: { shine: 62, eclipse: 38 }, signal_tags: [] },
    },
  },
  R9: {
    ray_id: 'R9', ray_name: 'Be The Light', score: 82, net_energy: 82,
    access_score: 78, eclipse_score: 18, eclipse_modifier: 'NONE',
    subfacets: {
      R9a: { subfacet_id: 'R9a', label: 'Behavioral Modeling', score: 85, polarity_mix: { shine: 85, eclipse: 15 }, signal_tags: [] },
      R9b: { subfacet_id: 'R9b', label: 'Standard Setting', score: 80, polarity_mix: { shine: 80, eclipse: 20 }, signal_tags: [] },
      R9c: { subfacet_id: 'R9c', label: 'Generative Impact', score: 78, polarity_mix: { shine: 78, eclipse: 22 }, signal_tags: [] },
      R9d: { subfacet_id: 'R9d', label: 'Legacy Orientation', score: 84, polarity_mix: { shine: 84, eclipse: 16 }, signal_tags: [] },
    },
  },
};

const SAMPLE_ECLIPSE: EclipseOutput = {
  level: 'MODERATE',
  dimensions: {
    emotional_load: { score: 2.1, note: 'Moderate emotional processing demand' },
    cognitive_load: { score: 1.8, note: 'Normal cognitive strain' },
    relational_load: { score: 1.5, note: 'Low relational friction' },
  },
  derived_metrics: {
    recovery_access: 68,
    load_pressure: 42,
    eer: 1.4,
    bri: 2,
  },
  gating: {
    mode: 'BUILD_RANGE',
    reason: 'You have room to build — stay intentional about load.',
  },
};

const SAMPLE_LIGHT_SIGNATURE: LightSignatureOutput = {
  archetype: {
    name: 'Driven Leader',
    pair_code: 'R5-R4',
    essence: 'You lead with mission clarity and decisive action. When the moment demands it, you step forward — not because it is easy, but because you know it matters.',
    work_expression: 'Sets direction quickly, drives results, holds the team to a clear standard.',
    life_expression: 'Lives with intentionality. When you commit, the people around you feel it.',
    strengths: 'Strategic clarity, follow-through under pressure, natural authority that does not need a title.',
    stress_distortion: 'Under load, your drive can narrow your view. You push harder when stepping back would serve better.',
    coaching_logic: 'Joy is your growth edge — not because you lack it, but because your system rations it when resources get tight.',
    starting_tools: '**Presence Pause** | Cue: Before your 3rd meeting | Micro-Rep: Close eyes, 3 breaths, name one sensation\n**Micro-Joy Protocol** | Cue: Before lunch | Micro-Rep: Notice one thing that feels genuinely good, hold it 10 seconds\n**Recovery Window** | Cue: Friday afternoon | Micro-Rep: 15 min — no phone, no tasks, no optimization',
    micro_reps: 'One moment of genuine pleasure before your next decision. That is the rep.',
    reflection_prompts: 'When did I last feel genuinely energized — not productive, energized? What would change if I let Joy lead for one hour this week?',
  },
  top_two: [
    {
      ray_id: 'R5',
      ray_name: 'Purpose',
      why_resourced: 'Clear mission alignment and values-driven action. This ray fires automatically under pressure.',
      under_load_distortion: 'Can become rigidity — holding to a plan when conditions have changed.',
    },
    {
      ray_id: 'R4',
      ray_name: 'Power',
      why_resourced: 'Agency and boundary enforcement. You move when others hesitate.',
      under_load_distortion: 'Can override emotional signals from self and others. Pushing through becomes default.',
    },
  ],
  just_in_ray: {
    ray_id: 'R2',
    ray_name: 'Joy',
    why_this_is_next: 'Your system runs on discipline, not vitality. Joy is not missing — it is rationed. One micro-rep per day shifts the fuel source from willpower to renewable energy.',
    work_rep: 'Before your next important meeting, notice one thing that genuinely makes you smile. Not gratitude practice — real pleasure. That is the rep.',
    life_rep: 'Tonight, do one thing purely because it feels good — not productive, not useful, just enjoyable. Let yourself feel it for 30 seconds.',
    move_score: 45,
    routing: 'STANDARD',
  },
  bottom_ray_selection_basis: [
    'Lowest net energy score across all 9 rays (45/100)',
    'Highest eclipse-to-access ratio (58/38)',
    'Phase 1 (Reconnect) ray — foundational capacity affects downstream performance',
    'Joy subfacets show consistent suppression pattern, not skill deficit',
  ],
};

/** Average net_energy across all rays (0-100) */
function computeOverallScore(rays: Record<string, RayOutput>): number {
  const values = Object.values(rays)
    .map((r) => r.net_energy ?? r.score)
    .filter((v) => v != null);
  if (values.length === 0) return 50;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

// ---------------------------------------------------------------------------
// Unified Portal Preview — 5-phase story-driven layout
// ---------------------------------------------------------------------------

export default function PortalPreviewClient() {
  const overallScore = computeOverallScore(SAMPLE_RAYS);

  return (
    <div className="space-y-8">
      {/* ══════════════════════════════════════════════════════════════
          PHASE 1: IDENTITY ANCHOR — "Who you are in one glance"
          16Personalities pattern: archetype name + visual = "I am this"
         ══════════════════════════════════════════════════════════════ */}

      <p
        className="text-center text-[10px] uppercase tracking-[0.3em] font-bold"
        style={{ color: 'var(--neon-amber)' }}
      >
        Sample Light Signature Map — Preview Data
      </p>

      <FadeInSection delay={0.04}>
        <IdentityStory
          lightSignature={SAMPLE_LIGHT_SIGNATURE}
          eclipse={SAMPLE_ECLIPSE}
          rays={SAMPLE_RAYS}
        />
      </FadeInSection>

      <RayDivider ray="R5" />

      {/* ══════════════════════════════════════════════════════════════
          PHASE 2: TRAIT LANDSCAPE — "The full picture"
          CliftonStrengths pattern: ranked visual + radial + overall
         ══════════════════════════════════════════════════════════════ */}

      {/* 2a. Energy Star Chart — 9 rays at a glance */}
      <FadeInSection delay={0.08}>
        <div className="glass-card rounded-2xl p-4 overflow-hidden">
          <p
            className="text-xs font-bold uppercase tracking-widest mb-3 px-2"
            style={{ color: 'var(--gold-primary)' }}
          >
            Your 9-Ray Energy Map
          </p>
          <EnergyStarChart
            mode="preview"
            rays={SAMPLE_RAYS}
            eclipse={SAMPLE_ECLIPSE}
          />
        </div>
      </FadeInSection>

      {/* 2b. Gravitational Stability — radial visualization */}
      <FadeInSection delay={0.1}>
        <SolarCoreScore
          rays={SAMPLE_RAYS}
          topTwo={['R5', 'R4']}
          bottomRay="R2"
        />
      </FadeInSection>

      {/* 2c. Moon-to-Sun Slider — overall score */}
      <FadeInSection delay={0.12}>
        <MoonToSunSlider
          score={overallScore}
          label="Your stability today"
        />
      </FadeInSection>

      <RayDivider ray="R4" />

      {/* ══════════════════════════════════════════════════════════════
          PHASE 3: DEEP NARRATIVE — "What it means in your life"
          Hogan pattern: bright side + dark side + motivations
         ══════════════════════════════════════════════════════════════ */}

      {/* 3a. Light Signature Detail — archetype expressions, strengths */}
      <FadeInSection delay={0.14}>
        <LightSignature lightSignature={SAMPLE_LIGHT_SIGNATURE} />
      </FadeInSection>

      {/* 3b. Rise Path — growth edge */}
      <FadeInSection delay={0.16}>
        <BottomRay
          justInRay={SAMPLE_LIGHT_SIGNATURE.just_in_ray!}
          selectionBasis={SAMPLE_LIGHT_SIGNATURE.bottom_ray_selection_basis}
        />
      </FadeInSection>

      {/* 3c. Per-ray context — state-aware "why this matters" */}
      <FadeInSection delay={0.18}>
        <WhyThisMatters rays={SAMPLE_RAYS} eclipse={SAMPLE_ECLIPSE} />
      </FadeInSection>

      <RayDivider ray="R2" />

      {/* ══════════════════════════════════════════════════════════════
          PHASE 4: CONTEXT — "What is happening right now"
          Enneagram pattern: levels of health, eclipse as state
         ══════════════════════════════════════════════════════════════ */}

      {/* 4a. Eclipse Meter — system load visualization */}
      <FadeInSection delay={0.2}>
        <EclipseMeter eclipse={SAMPLE_ECLIPSE} />
      </FadeInSection>

      {/* 4b. Eclipse coaching note */}
      <FadeInSection delay={0.22}>
        <div className="glass-card p-5">
          <p
            className="text-xs font-bold uppercase tracking-widest"
            style={{ color: 'var(--gold-primary)' }}
          >
            Coaching Note
          </p>
          <p
            className="mt-2 text-sm leading-relaxed"
            style={{ color: 'var(--text-on-dark)' }}
          >
            Your system is holding steady. That means your capacity for growth work
            is high right now — the tools will land deeper when your nervous system
            is not in protection mode.
          </p>
          <p
            className="mt-2 text-xs leading-relaxed"
            style={{ color: 'var(--text-on-dark-muted)' }}
          >
            Current mode:{' '}
            <strong style={{ color: 'var(--text-on-dark-secondary)' }}>
              build range
            </strong>{' '}
            — You have room to build — stay intentional about load.
          </p>
        </div>
      </FadeInSection>

      <RayDivider ray="R9" />

      {/* ══════════════════════════════════════════════════════════════
          PHASE 5: ACTION & GROWTH — "Now what do I do"
          BetterUp pattern: coaching interleaved with identity
          Calm/Headspace: "do the next thing" as primary CTA
         ══════════════════════════════════════════════════════════════ */}

      {/* 5a. Week 1 Installation Plan */}
      <FadeInSection delay={0.24}>
        <WeekOneChecklist lightSignature={SAMPLE_LIGHT_SIGNATURE} />
      </FadeInSection>

      {/* 5b. Today's Coaching — archetype-driven Watch Me / Go First */}
      <FadeInSection delay={0.26}>
        <ArchetypeCoachingCard
          archetypeName="Driven Leader"
          startingTools={SAMPLE_LIGHT_SIGNATURE.archetype!.starting_tools ?? ''}
          bottomRayName="Joy"
          onOpenWatchMe={() => {}}
          onOpenGoFirst={() => {}}
        />
      </FadeInSection>

      {/* 5c. Time-of-day smart actions */}
      <FadeInSection delay={0.28}>
        <ContextualActions eclipseLevel="low" />
      </FadeInSection>

      {/* 5d. Growth Signal — streaks + reps */}
      <FadeInSection delay={0.3}>
        <GrowthSignalCard
          streakDays={42}
          repsThisWeek={4}
          totalReps={187}
          loopStreak={28}
          reflectionStreak={14}
          mostPracticedTool="watch_me"
          runNumber={3}
        />
      </FadeInSection>

      {/* 5e. Badge showcase */}
      <FadeInSection delay={0.32}>
        <BadgeShowcase
          streakDays={42}
          repsThisWeek={4}
          totalRuns={3}
          hasRetake={true}
          eclipseLevel="LOW"
        />
      </FadeInSection>

      {/* ── Closing ── */}
      <FadeInSection delay={0.34}>
        <div className="glass-card rounded-2xl p-6 text-center space-y-3">
          <p
            className="text-xs font-bold uppercase tracking-widest"
            style={{ color: 'var(--gold-primary)' }}
          >
            Your Map
          </p>
          <p
            className="text-lg font-semibold"
            style={{ color: 'var(--text-on-dark)' }}
          >
            Every score is a starting point, not a sentence.
          </p>
          <p
            className="text-sm leading-relaxed"
            style={{ color: 'var(--text-on-dark-secondary)' }}
          >
            What you see here is where you are. What you do next determines where
            you go.
          </p>
        </div>
      </FadeInSection>
    </div>
  );
}
