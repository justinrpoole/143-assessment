'use client';

import { useState, useEffect, useRef } from 'react';

interface CommunityStats {
  today_active: number;
  week_reps: number;
  total_assessments: number;
}

/**
 * SocialProofBadge — Anonymous aggregate community stats.
 *
 * Research: Insight Timer's "12 others meditating now" badges
 * drive 15-25% engagement lift via social proof. All data is
 * anonymous aggregates — no individual identification.
 */
export default function SocialProofBadge() {
  const [stats, setStats] = useState<CommunityStats | null>(null);
  const animatedRef = useRef(false);

  useEffect(() => {
    let canceled = false;
    async function load() {
      try {
        const res = await fetch('/api/stats/community');
        if (!res.ok) return;
        const data = (await res.json()) as CommunityStats;
        if (!canceled) setStats(data);
      } catch {
        // Silently fail — social proof is non-critical
      }
    }
    void load();
    return () => { canceled = true; };
  }, []);

  // Don't render if no stats or all zeros
  if (!stats || (stats.today_active === 0 && stats.week_reps === 0 && stats.total_assessments === 0)) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
      {stats.today_active > 0 && (
        <StatPill
          value={stats.today_active}
          label="practicing today"
          animated={!animatedRef.current}
        />
      )}
      {stats.week_reps > 0 && (
        <StatPill
          value={stats.week_reps}
          label="reps this week"
          animated={!animatedRef.current}
        />
      )}
      {stats.total_assessments > 0 && (
        <StatPill
          value={stats.total_assessments}
          label="assessments taken"
          animated={!animatedRef.current}
          onAnimEnd={() => { animatedRef.current = true; }}
        />
      )}
    </div>
  );
}

function StatPill({
  value,
  label,
  animated,
  onAnimEnd,
}: {
  value: number;
  label: string;
  animated: boolean;
  onAnimEnd?: () => void;
}) {
  const [display, setDisplay] = useState(animated ? 0 : value);

  useEffect(() => {
    if (!animated) {
      setDisplay(value);
      return;
    }
    // Count-up animation over 600ms
    const duration = 600;
    const start = performance.now();
    let frame: number;

    function tick(now: number) {
      const pct = Math.min((now - start) / duration, 1);
      setDisplay(Math.round(pct * value));
      if (pct < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        onAnimEnd?.();
      }
    }

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, animated, onAnimEnd]);

  return (
    <p className="text-xs" style={{ color: 'var(--text-on-dark-muted)' }}>
      <span
        className="font-semibold"
        style={{ color: 'var(--brand-gold, #F8D011)' }}
      >
        {display}
      </span>{' '}
      {label}
    </p>
  );
}
