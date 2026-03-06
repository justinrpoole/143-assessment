'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import ArchetypeHeroCard from '@/components/portal/ArchetypeHeroCard';
import ArchetypeCoachingCard from '@/components/portal/ArchetypeCoachingCard';
import GrowthSignalCard from '@/components/portal/GrowthSignalCard';
import { FadeInSection } from '@/components/ui/FadeInSection';
import ContextualActions from '@/components/portal/ContextualActions';
import BadgeShowcase from '@/components/portal/BadgeShowcase';
import type { RayOutput, EclipseOutput } from '@/lib/types';
import archetypeBlocksData from '@/data/archetype_blocks.json';
import archetypePublicData from '@/data/archetype_public.json';
import { VETERAN_RAYS, VETERAN_ECLIPSE } from '@/components/cosmic/energy-star-chart-data';

const EnergyStarChart = dynamic(() => import('@/components/cosmic/EnergyStarChart'), { ssr: false });

// Cycle through archetypes — one per day
function getTodayArchetype() {
  const dayIndex = Math.floor(Date.now() / 86400000) % archetypePublicData.length;
  const pub = archetypePublicData[dayIndex];
  const block = archetypeBlocksData.find((b) => b.name === pub.name);
  return { pub, block };
}

export default function PortalPreviewClient() {
  const [archetype, setArchetype] = useState<ReturnType<typeof getTodayArchetype> | null>(null);

  useEffect(() => {
    setArchetype(getTodayArchetype());
  }, []);

  if (!archetype?.pub || !archetype?.block) return null;

  const { pub, block } = archetype;

  return (
    <div className="space-y-6">
      <p className="text-center text-xs uppercase tracking-widest font-bold" style={{ color: 'var(--neon-amber)' }}>
        Portal Preview — Sample Data
      </p>

      {/* Section 1: Identity Anchor */}
      <FadeInSection delay={0.04}>
        <ArchetypeHeroCard
          name={pub.name}
          tagline={pub.tagline}
          identityCode={pub.identity_code}
          neonColor={pub.neon_color}
          rays={pub.rays}
          theLine={pub.the_line}
          eclipseLevel="low"
          streakDays={42}
          lastRunId={null}
        />
      </FadeInSection>

      {/* Section 2: Energy Star Chart */}
      <FadeInSection delay={0.08}>
        <div className="glass-card rounded-2xl p-4 overflow-hidden">
          <EnergyStarChart
            mode="preview"
            rays={VETERAN_RAYS}
            eclipse={VETERAN_ECLIPSE}
          />
        </div>
      </FadeInSection>

      {/* Section 3: Today's Coaching */}
      <FadeInSection delay={0.12}>
        <ArchetypeCoachingCard
          archetypeName={pub.name}
          startingTools={block.starting_tools ?? ''}
          bottomRayName="Purpose"
          onOpenWatchMe={() => {}}
          onOpenGoFirst={() => {}}
        />
      </FadeInSection>

      <FadeInSection delay={0.14}>
        <ContextualActions eclipseLevel="low" />
      </FadeInSection>

      {/* Section 4: Growth Signal */}
      <FadeInSection delay={0.16}>
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

      <FadeInSection delay={0.18}>
        <BadgeShowcase
          streakDays={42}
          repsThisWeek={4}
          totalRuns={3}
          hasRetake={true}
          eclipseLevel="LOW"
        />
      </FadeInSection>
    </div>
  );
}
