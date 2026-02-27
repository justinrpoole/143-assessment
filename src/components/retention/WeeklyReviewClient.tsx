'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useCosmicMotion } from '@/lib/motion/use-cosmic-motion';
import CosmicSkeleton from '@/components/ui/CosmicSkeleton';

const PHASE_LABELS: Record<string, { label: string; color: string }> = {
  orbit: { label: 'Orbit', color: '#22C55E' },
  gravity_shift: { label: 'Gravity Shift', color: '#EAB308' },
  eclipse_onset: { label: 'Eclipse Onset', color: '#F97316' },
  full_eclipse: { label: 'Full Eclipse', color: '#EF4444' },
};

const QUALITY_LABELS = ['—', 'Surface', 'Specific', 'Actionable'];

const RAS_WEEKLY_NUDGE: Record<string, string> = {
  high: 'Five or more days active. Your Reticular Activating System is building real grooves. This is where practice becomes identity.',
  mid: 'Three days is a real pattern. Your RAS is starting to expect these reps. One more day deepens the wiring.',
  low: 'You started. That counts. Every rep tells your RAS what matters. One more day this week strengthens the signal.',
  none: 'Every practice starts with the first rep. Your RAS is waiting for direction — open your check-in tomorrow morning.',
};

interface WeeklyData {
  week_of: string;
  reps: {
    count_this_week: number;
    streak_days: number;
    total_count: number;
    most_practiced_tool: string | null;
    top_tools: Array<{ name: string; count: number }>;
  };
  check_ins: {
    count: number;
    phase_distribution: Record<string, number>;
  };
  daily_loops: {
    count: number;
  };
  reflections: {
    count: number;
    avg_quality: number | null;
  };
  engagement: {
    days_active: number;
  };
}

export default function WeeklyReviewClient() {
  const shouldAnimate = useCosmicMotion();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<WeeklyData | null>(null);

  useEffect(() => {
    let canceled = false;
    async function load() {
      try {
        const res = await fetch('/api/weekly-review');
        if (!res.ok) return;
        const json = (await res.json()) as WeeklyData;
        if (!canceled) setData(json);
      } finally {
        if (!canceled) setLoading(false);
      }
    }
    void load();
    return () => { canceled = true; };
  }, []);

  if (loading) {
    return <CosmicSkeleton rows={3} height="h-20" />;
  }

  if (!data) {
    return (
      <div className="glass-card p-8 text-center space-y-2">
        <p className="text-2xl">📊</p>
        <p className="text-sm font-medium" style={{ color: 'var(--text-on-dark)' }}>
          No data yet this week.
        </p>
        <p className="text-sm" style={{ color: 'var(--text-on-dark-secondary)' }}>
          Start with a check-in or rep. Your RAS needs data to build patterns.
        </p>
        <div className="flex justify-center gap-3 pt-2">
          <a href="/reps" className="btn-primary text-sm py-2 px-4">Log a rep</a>
          <a href="/morning" className="btn-watch text-sm py-2 px-4">Morning check-in</a>
        </div>
      </div>
    );
  }

  const totalActivities =
    data.reps.count_this_week +
    data.check_ins.count +
    data.daily_loops.count +
    data.reflections.count;

  const engagementKey =
    data.engagement.days_active >= 5 ? 'high'
    : data.engagement.days_active >= 3 ? 'mid'
    : data.engagement.days_active >= 1 ? 'low'
    : 'none';

  // Compute a "consistency score" — % of 7 days active
  const consistencyPct = Math.round((data.engagement.days_active / 7) * 100);

  return (
    <motion.div
      initial={shouldAnimate ? { opacity: 0, y: 12 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: shouldAnimate ? undefined : 0 }}
      className="space-y-4"
    >
      {/* Engagement summary */}
      <div
        className="glass-card p-6 space-y-4"
        style={{ borderColor: 'rgba(248, 208, 17, 0.2)', boxShadow: '0 0 30px rgba(96, 5, 141, 0.1)' }}
      >
        <div className="flex items-center justify-between">
          <span className="gold-tag text-xs font-bold">
            Week of {new Date(data.week_of + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
          <p className="text-xs" style={{ color: 'var(--text-on-dark-muted)' }}>
            {consistencyPct}% consistency
          </p>
        </div>

        {/* Consistency bar */}
        <div className="space-y-1">
          <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
            <motion.div
              initial={shouldAnimate ? { width: 0 } : false}
              animate={{ width: `${consistencyPct}%` }}
              transition={{ duration: shouldAnimate ? 0.8 : 0, ease: 'easeOut' }}
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #60058D, #F8D011)' }}
            />
          </div>
          <div className="flex justify-between">
            {[1, 2, 3, 4, 5, 6, 7].map((d) => (
              <div
                key={d}
                className="w-2 h-2 rounded-full"
                style={{
                  background: d <= data.engagement.days_active
                    ? 'var(--brand-gold, #F8D011)'
                    : 'rgba(255,255,255,0.1)',
                }}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold" style={{ color: 'var(--text-on-dark)' }}>
              {data.engagement.days_active}
            </p>
            <p className="text-xs" style={{ color: 'var(--text-on-dark-muted)' }}>days active</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold" style={{ color: 'var(--text-on-dark)' }}>
              {totalActivities}
            </p>
            <p className="text-xs" style={{ color: 'var(--text-on-dark-muted)' }}>activities</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold" style={{ color: 'var(--brand-gold, #F8D011)' }}>
              {data.reps.streak_days > 0 ? `🔥 ${data.reps.streak_days}` : '—'}
            </p>
            <p className="text-xs" style={{ color: 'var(--text-on-dark-muted)' }}>day streak</p>
          </div>
        </div>
      </div>

      {/* REPs breakdown */}
      <div className="glass-card p-5 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold" style={{ color: 'var(--text-on-dark)' }}>Reps</p>
          <span className="text-sm font-bold" style={{ color: 'var(--brand-gold, #F8D011)' }}>
            {data.reps.count_this_week}
          </span>
        </div>
        {data.reps.top_tools.length > 0 && (
          <div className="space-y-2">
            {data.reps.top_tools.map((tool, i) => (
              <motion.div
                key={tool.name}
                initial={shouldAnimate ? { opacity: 0, x: -8 } : false}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: shouldAnimate ? i * 0.05 : 0, duration: shouldAnimate ? undefined : 0 }}
                className="flex items-center justify-between"
              >
                <p className="text-sm" style={{ color: 'var(--text-on-dark-secondary)' }}>{tool.name}</p>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-1.5 rounded-full overflow-hidden"
                    style={{ background: 'rgba(255,255,255,0.08)' }}>
                    <motion.div
                      initial={shouldAnimate ? { width: 0 } : false}
                      animate={{ width: `${Math.round((tool.count / Math.max(data.reps.count_this_week, 1)) * 100)}%` }}
                      transition={{ duration: shouldAnimate ? 0.5 : 0, delay: shouldAnimate ? i * 0.05 : 0 }}
                      className="h-full rounded-full"
                      style={{ background: 'var(--brand-gold, #F8D011)' }}
                    />
                  </div>
                  <span className="text-xs w-6 text-right" style={{ color: 'var(--text-on-dark-muted)' }}>
                    {tool.count}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
        {data.reps.count_this_week === 0 && (
          <div className="flex items-center gap-2">
            <p className="text-sm" style={{ color: 'var(--text-on-dark-muted)' }}>No reps logged this week yet.</p>
            <a href="/reps" className="text-xs underline" style={{ color: 'var(--brand-gold, #F8D011)' }}>
              Log one →
            </a>
          </div>
        )}
      </div>

      {/* Phase check-ins */}
      {data.check_ins.count > 0 && (
        <div className="glass-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold" style={{ color: 'var(--text-on-dark)' }}>Phase Check-Ins</p>
            <span className="text-sm" style={{ color: 'var(--text-on-dark-muted)' }}>
              {data.check_ins.count} this week
            </span>
          </div>
          <div className="flex gap-2 flex-wrap">
            {Object.entries(data.check_ins.phase_distribution).map(([phase, count]) => {
              const info = PHASE_LABELS[phase];
              if (!info) return null;
              return (
                <span
                  key={phase}
                  className="text-xs px-2.5 py-1 rounded-full font-medium"
                  style={{
                    backgroundColor: info.color + '22',
                    color: info.color,
                    border: `1px solid ${info.color}44`,
                  }}
                >
                  {info.label}: {count}
                </span>
              );
            })}
          </div>
          {/* Phase pattern insight */}
          {Object.keys(data.check_ins.phase_distribution).length > 1 && (
            <p className="text-xs italic" style={{ color: 'var(--text-on-dark-muted)' }}>
              🧠 Your phase shifts this week are data — not judgments. Your RAS is tracking the pattern.
            </p>
          )}
        </div>
      )}

      {/* Practice summary row */}
      <div className="grid grid-cols-2 gap-3">
        <div className="glass-card glass-card--interactive p-4 space-y-1">
          <p className="text-xs font-medium" style={{ color: 'var(--text-on-dark-muted)' }}>Daily Loops</p>
          <p className="text-xl font-bold" style={{ color: 'var(--text-on-dark)' }}>
            {data.daily_loops.count}
          </p>
          <p className="text-xs" style={{ color: 'var(--text-on-dark-muted)' }}>this week</p>
        </div>
        <div className="glass-card p-4 space-y-1">
          <p className="text-xs font-medium" style={{ color: 'var(--text-on-dark-muted)' }}>Reflections</p>
          <p className="text-xl font-bold" style={{ color: 'var(--text-on-dark)' }}>
            {data.reflections.count}
          </p>
          {data.reflections.avg_quality !== null && (
            <p className="text-xs" style={{ color: 'var(--text-on-dark-muted)' }}>
              Avg: {QUALITY_LABELS[Math.round(data.reflections.avg_quality)] ?? '—'}
            </p>
          )}
        </div>
      </div>

      {/* RAS coaching nudge */}
      <div className="glass-card gold-accent-left p-4 space-y-2" style={{ borderColor: 'rgba(96, 5, 141, 0.3)' }}>
        <span className="gold-tag inline-block text-xs font-bold">
          The pattern
        </span>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
          {RAS_WEEKLY_NUDGE[engagementKey]}
        </p>
      </div>

      {/* Navigation */}
      <div className="flex justify-center gap-4 pt-1">
        <a href="/reps" className="text-xs underline" style={{ color: 'var(--text-on-dark-muted)' }}>
          Log a rep →
        </a>
        <a href="/energy" className="text-xs underline" style={{ color: 'var(--text-on-dark-muted)' }}>
          Energy audit →
        </a>
        <a href="/portal" className="text-xs underline" style={{ color: 'var(--text-on-dark-muted)' }}>
          Portal →
        </a>
      </div>
    </motion.div>
  );
}
