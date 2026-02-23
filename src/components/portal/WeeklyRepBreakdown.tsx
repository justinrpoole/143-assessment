'use client';

import { useState, useEffect } from 'react';

interface RepEntry {
  tool_name: string;
  logged_at: string;
}

interface Props {
  weeklyTarget: number;
  repsThisWeek: number;
}

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

/**
 * Expandable weekly rep breakdown showing day-by-day activity,
 * tool distribution, and on-track prediction.
 */
export default function WeeklyRepBreakdown({ weeklyTarget, repsThisWeek }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [reps, setReps] = useState<RepEntry[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!expanded) return;
    setLoading(true);
    fetch('/api/portal/reps-this-week')
      .then((r) => (r.ok ? r.json() : { reps: [] }))
      .then((data: { reps?: RepEntry[] }) => setReps(data.reps ?? []))
      .catch(() => setReps([]))
      .finally(() => setLoading(false));
  }, [expanded]);

  // Compute day-by-day distribution
  const dayBuckets: Record<number, number> = {};
  const toolCounts: Record<string, number> = {};

  for (const rep of reps) {
    const d = new Date(rep.logged_at);
    // getDay: 0=Sun, 1=Mon..6=Sat → remap to Mon=0..Sun=6
    const dayIdx = (d.getDay() + 6) % 7;
    dayBuckets[dayIdx] = (dayBuckets[dayIdx] ?? 0) + 1;
    toolCounts[rep.tool_name] = (toolCounts[rep.tool_name] ?? 0) + 1;
  }

  // Current day index (Mon=0)
  const today = new Date();
  const todayIdx = (today.getDay() + 6) % 7;
  const daysRemaining = 6 - todayIdx; // days left in the week
  const repsNeeded = weeklyTarget - repsThisWeek;

  const prediction = repsNeeded <= 0
    ? 'on-track'
    : daysRemaining >= repsNeeded
      ? 'achievable'
      : 'stretch';

  const predictionMessages = {
    'on-track': 'You hit your weekly target. Keep the momentum.',
    'achievable': `${repsNeeded} more rep${repsNeeded > 1 ? 's' : ''} needed. ${daysRemaining} day${daysRemaining > 1 ? 's' : ''} left — you have got this.`,
    'stretch': `${repsNeeded} reps needed with ${daysRemaining} day${daysRemaining > 1 ? 's' : ''} left. Stack two reps today to stay on track.`,
  };

  const predictionColors = {
    'on-track': '#34D399',
    'achievable': '#F8D011',
    'stretch': '#FB923C',
  };

  // Top tools sorted by count
  const topTools = Object.entries(toolCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  const maxDayCount = Math.max(1, ...Object.values(dayBuckets));

  return (
    <div className="space-y-2">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left text-xs font-medium flex items-center gap-1 transition-colors"
        style={{ color: 'var(--text-on-dark-muted)' }}
        aria-expanded={expanded}
      >
        <span style={{ transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 150ms', display: 'inline-block' }}>
          &#9654;
        </span>
        Week breakdown
      </button>

      {expanded && (
        <div className="space-y-3 pt-1">
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 animate-spin rounded-full border-2 border-brand-gold border-t-transparent" />
              <span className="text-xs" style={{ color: 'var(--text-on-dark-muted)' }}>Loading...</span>
            </div>
          ) : (
            <>
              {/* Day-by-day bar chart */}
              <div className="flex items-end gap-1" style={{ height: '40px' }}>
                {DAY_LABELS.map((label, i) => {
                  const count = dayBuckets[i] ?? 0;
                  const heightPct = count > 0 ? Math.max(15, (count / maxDayCount) * 100) : 4;
                  const isPast = i < todayIdx;
                  const isToday = i === todayIdx;
                  const isFuture = i > todayIdx;

                  return (
                    <div key={label} className="flex-1 flex flex-col items-center gap-0.5">
                      {count > 0 && (
                        <span className="text-[9px] font-bold" style={{ color: 'var(--brand-gold)' }}>{count}</span>
                      )}
                      <div
                        className="w-full rounded-sm transition-all"
                        style={{
                          height: `${heightPct}%`,
                          minHeight: '2px',
                          background: count > 0
                            ? (isToday ? 'var(--brand-gold)' : '#9450C8')
                            : isFuture
                              ? 'rgba(148, 80, 200, 0.15)'
                              : 'rgba(248, 113, 113, 0.2)',
                        }}
                      />
                      <span
                        className="text-[9px]"
                        style={{
                          color: isToday ? 'var(--brand-gold)' : 'var(--text-on-dark-muted)',
                          fontWeight: isToday ? 700 : 400,
                        }}
                      >
                        {label}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Prediction */}
              <p className="text-xs" style={{ color: predictionColors[prediction] }}>
                {predictionMessages[prediction]}
              </p>

              {/* Top tools */}
              {topTools.length > 0 && (
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--brand-gold)' }}>Most Used</p>
                  {topTools.map(([tool, count]) => (
                    <div key={tool} className="flex items-center justify-between text-xs">
                      <span style={{ color: 'var(--text-on-dark-secondary)' }}>{tool}</span>
                      <span style={{ color: 'var(--text-on-dark-muted)' }}>{count}x</span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
