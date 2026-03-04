'use client';

interface BadgeShowcaseProps {
  streakDays: number;
  repsThisWeek: number;
  totalRuns: number;
  hasRetake: boolean;
  eclipseLevel: string;
}

interface Badge {
  id: string;
  icon: string;
  name: string;
  description: string;
  earned: boolean;
}

/**
 * Gamification badges earned through assessment and practice milestones.
 * Shows earned badges as lit cosmic icons, unearned as dimmed.
 */
export default function BadgeShowcase({
  streakDays,
  repsThisWeek,
  totalRuns,
  hasRetake,
  eclipseLevel,
}: BadgeShowcaseProps) {
  const badges: Badge[] = [
    {
      id: 'first-light',
      icon: '\u2600',
      name: 'First Light',
      description: 'Completed your first assessment',
      earned: totalRuns >= 1,
    },
    {
      id: 'perfect-week',
      icon: '\u2B50',
      name: 'Perfect Week',
      description: 'Logged 5+ reps in a single week',
      earned: repsThisWeek >= 5,
    },
    {
      id: 'streak-ignition',
      icon: '\uD83D\uDD25',
      name: 'Streak Ignition',
      description: '3-day rep streak',
      earned: streakDays >= 3,
    },
    {
      id: 'sustained-flame',
      icon: '\u2728',
      name: 'Sustained Flame',
      description: '7-day rep streak',
      earned: streakDays >= 7,
    },
    {
      id: 'cosmic-fire',
      icon: '\uD83C\uDF1F',
      name: 'Cosmic Fire',
      description: '14-day rep streak',
      earned: streakDays >= 14,
    },
    {
      id: 'eternal-light',
      icon: '\u2604',
      name: 'Eternal Light',
      description: '30-day rep streak',
      earned: streakDays >= 30,
    },
    {
      id: 'growth-proof',
      icon: '\uD83D\uDCC8',
      name: 'Growth Proof',
      description: 'Completed a retake assessment',
      earned: hasRetake,
    },
    {
      id: 'low-load',
      icon: '\uD83D\uDEE1',
      name: 'Stabilized',
      description: 'Achieved LOW eclipse level',
      earned: eclipseLevel === 'LOW',
    },
  ];

  const earnedCount = badges.filter((b) => b.earned).length;

  if (earnedCount === 0) return null;

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="gold-underline text-sm font-semibold" style={{ color: 'var(--text-on-dark)' }}>
          Badges
        </h3>
        <span className="text-xs" style={{ color: 'var(--text-on-dark-muted)' }}>
          {earnedCount}/{badges.length}
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {badges.map((badge) => (
          <div
            key={badge.id}
            className={`card-bg-var card-border-var flex items-center gap-2 rounded-lg px-3 py-2 transition-opacity ${badge.earned ? 'glass-card--interactive' : ''}`}
            style={{
              '--card-bg': badge.earned ? 'var(--surface-border)' : 'color-mix(in srgb, var(--violet-650) 8%, transparent)',
              '--card-border': `1px solid ${badge.earned ? 'var(--surface-border)' : 'color-mix(in srgb, var(--stroke-400) 12%, transparent)'}`,
              opacity: badge.earned ? 1 : 0.4,
            } as { ['--card-bg']: string; ['--card-border']: string; opacity: number }}
            title={badge.earned ? `${badge.name}: ${badge.description}` : `Locked: ${badge.description}`}
          >
            <span className="text-lg" aria-hidden="true">{badge.icon}</span>
            <div>
              <p className="text-xs font-medium" style={{ color: badge.earned ? 'var(--brand-gold)' : 'var(--text-on-dark-muted)' }}>
                {badge.name}
              </p>
              <p className="text-[10px]" style={{ color: 'var(--text-on-dark-muted)' }}>
                {badge.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
