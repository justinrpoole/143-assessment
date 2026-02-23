'use client';

import Link from 'next/link';

interface ActionDef {
  href: string;
  label: string;
  description: string;
  time: string;
  icon: string;
}

const ALL_ACTIONS: ActionDef[] = [
  { href: '/reps', label: 'Log a Rep', description: 'Capture what you practiced', time: '1 min', icon: '⚡' },
  { href: '/reflect', label: 'Reflect', description: 'What did you notice today?', time: '3 min', icon: '✍️' },
  { href: '/energy', label: 'Energy Audit', description: 'Where did your energy go?', time: '2 min', icon: '🔋' },
  { href: '/plan', label: 'If/Then Plan', description: 'Set a trigger-response pair', time: '3 min', icon: '🎯' },
  { href: '/weekly', label: 'Weekly Review', description: 'Patterns from the past 7 days', time: '5 min', icon: '📊' },
  { href: '/toolkit', label: 'All Tools', description: 'Browse your full toolkit', time: '', icon: '🛠️' },
];

/** Morning = Morning Entry first. Evening = Reflect first. High eclipse = Presence Pause first. */
function getTimeOfDay(): 'morning' | 'afternoon' | 'evening' {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
}

function prioritizeActions(eclipseLevel: string | null): ActionDef[] {
  const tod = getTimeOfDay();
  const sorted = [...ALL_ACTIONS];

  // Boost certain actions based on time of day
  sorted.sort((a, b) => {
    const scoreA = getBoost(a, tod, eclipseLevel);
    const scoreB = getBoost(b, tod, eclipseLevel);
    return scoreB - scoreA;
  });

  return sorted;
}

function getBoost(action: ActionDef, tod: string, eclipseLevel: string | null): number {
  let score = 0;

  // Morning boosts
  if (tod === 'morning') {
    if (action.href === '/energy') score += 3; // Morning = set energy intention
    if (action.href === '/reps') score += 2;
  }

  // Afternoon boosts
  if (tod === 'afternoon') {
    if (action.href === '/reps') score += 3;
    if (action.href === '/plan') score += 2;
  }

  // Evening boosts
  if (tod === 'evening') {
    if (action.href === '/reflect') score += 3; // Evening = reflect
    if (action.href === '/weekly') score += 2;
  }

  // High eclipse = energy audit and reps get boosted
  if (eclipseLevel === 'high') {
    if (action.href === '/energy') score += 2;
    if (action.href === '/reps') score += 1;
  }

  // Tools always last
  if (action.href === '/toolkit') score -= 5;

  return score;
}

interface ContextualActionsProps {
  eclipseLevel: string | null;
}

export default function ContextualActions({ eclipseLevel }: ContextualActionsProps) {
  const actions = prioritizeActions(eclipseLevel);
  const primary = actions[0];
  const rest = actions.slice(1);

  return (
    <div className="space-y-3">
      <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-on-dark-muted)' }}>
        Quick Actions
      </p>

      {/* Primary action — full-width card */}
      <Link
        href={primary.href}
        className="glass-card block p-4 transition-all hover:scale-[1.01]"
        style={{ borderColor: 'rgba(248, 208, 17, 0.25)' }}
      >
        <div className="flex items-start gap-3">
          <span className="text-2xl">{primary.icon}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold" style={{ color: 'var(--text-on-dark)' }}>
                {primary.label}
              </p>
              {primary.time && (
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: 'rgba(248, 208, 17, 0.12)', color: 'var(--brand-gold)' }}>
                  {primary.time}
                </span>
              )}
            </div>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-on-dark-secondary)' }}>
              {primary.description}
            </p>
          </div>
        </div>
      </Link>

      {/* Secondary actions — compact grid */}
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
        {rest.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="glass-card flex flex-col items-center gap-1 p-3 text-center transition-all hover:scale-[1.02]"
            style={{ borderColor: 'rgba(148, 80, 200, 0.2)' }}
          >
            <span className="text-lg">{action.icon}</span>
            <span className="text-[11px] font-medium leading-tight" style={{ color: 'var(--text-on-dark-secondary)' }}>
              {action.label}
            </span>
            {action.time && (
              <span className="text-[9px]" style={{ color: 'var(--text-on-dark-muted)' }}>
                {action.time}
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
