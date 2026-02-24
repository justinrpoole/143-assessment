'use client';

import { useState, useEffect, useMemo } from 'react';

/**
 * ChallengeProgress — 30-day challenge tracker.
 *
 * Tracks daily completion using the existing rep logging system.
 * Each day the user logs a rep with tool_name='challenge_rep',
 * it counts as a completed challenge day.
 *
 * No new database tables required — piggybacks on the reps table.
 */

interface RepEntry {
  logged_at: string;
  tool_name: string;
}

const TOTAL_DAYS = 30;
const MILESTONES = [
  { day: 7, label: 'Week 1', message: 'Neural pathways forming. The RAS is recalibrating.' },
  { day: 14, label: 'Week 2', message: 'Patterns solidifying. You are building real capacity.' },
  { day: 21, label: 'Week 3', message: 'Behavioral automaticity beginning. Reps are becoming instinct.' },
  { day: 30, label: 'Complete', message: 'Your internal operating system has been upgraded.' },
];

function getDateString(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export default function ChallengeProgress() {
  const [completedDays, setCompletedDays] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState<string | null>(null);

  useEffect(() => {
    let canceled = false;
    async function load() {
      try {
        const res = await fetch('/api/reps?limit=90');
        if (!res.ok) return;
        const data = (await res.json()) as { reps?: RepEntry[] };
        if (canceled) return;

        // Find challenge reps
        const challengeReps = (data.reps ?? []).filter(
          (r) => r.tool_name === 'challenge_rep'
        );

        if (challengeReps.length === 0) return;

        // Extract unique dates
        const dates = new Set(
          challengeReps.map((r) => r.logged_at.slice(0, 10))
        );
        setCompletedDays(dates);

        // Start date = earliest challenge rep
        const sorted = [...dates].sort();
        if (sorted.length > 0) setStartDate(sorted[0]);
      } finally {
        if (!canceled) setLoading(false);
      }
    }
    void load();
    return () => { canceled = true; };
  }, []);

  const progress = useMemo(() => {
    const dayCount = completedDays.size;
    const pct = Math.min(100, Math.round((dayCount / TOTAL_DAYS) * 100));
    const currentMilestone = MILESTONES.find((m) => dayCount <= m.day) ?? MILESTONES[MILESTONES.length - 1];
    const nextMilestone = MILESTONES.find((m) => m.day > dayCount);
    return { dayCount, pct, currentMilestone, nextMilestone };
  }, [completedDays]);

  // Don't render if user hasn't started a challenge
  if (loading || completedDays.size === 0) return null;

  // Build 30-day grid
  const gridDays = Array.from({ length: TOTAL_DAYS }, (_, i) => {
    if (!startDate) return { day: i + 1, date: '', completed: false, isMilestone: false };
    const d = new Date(startDate + 'T12:00:00Z');
    d.setUTCDate(d.getUTCDate() + i);
    const dateStr = getDateString(d);
    return {
      day: i + 1,
      date: dateStr,
      completed: completedDays.has(dateStr),
      isMilestone: MILESTONES.some((m) => m.day === i + 1),
    };
  });

  return (
    <section className="glass-card p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--brand-gold, #F8D011)' }}>
            30-Day Challenge
          </p>
          <p className="mt-1 text-sm" style={{ color: 'var(--text-on-dark-muted)' }}>
            Day {progress.dayCount} of {TOTAL_DAYS}
          </p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold" style={{ color: progress.pct >= 100 ? '#34D399' : 'var(--brand-gold)' }}>
            {progress.pct}%
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${progress.pct}%`,
            background: progress.pct >= 100
              ? 'linear-gradient(90deg, #34D399, var(--brand-gold))'
              : 'var(--brand-gold)',
          }}
        />
      </div>

      {/* Milestone markers */}
      <div className="flex justify-between px-1">
        {MILESTONES.map((m) => (
          <div key={m.day} className="text-center">
            <div
              className="w-3 h-3 rounded-full mx-auto"
              style={{
                background: progress.dayCount >= m.day
                  ? '#34D399'
                  : 'rgba(255,255,255,0.12)',
                border: progress.dayCount >= m.day
                  ? 'none'
                  : '1px solid rgba(255,255,255,0.2)',
              }}
            />
            <p className="text-[10px] mt-1" style={{ color: 'var(--text-on-dark-muted)' }}>
              {m.label}
            </p>
          </div>
        ))}
      </div>

      {/* 30-day grid */}
      <div className="grid grid-cols-10 gap-1">
        {gridDays.map((gd) => (
          <div
            key={gd.day}
            className="aspect-square rounded-sm flex items-center justify-center text-[9px] font-medium"
            style={{
              background: gd.completed
                ? 'rgba(52, 211, 153, 0.3)'
                : gd.isMilestone
                  ? 'rgba(248, 208, 17, 0.08)'
                  : 'rgba(255,255,255,0.04)',
              color: gd.completed
                ? '#34D399'
                : 'var(--text-on-dark-muted)',
              border: gd.isMilestone && !gd.completed
                ? '1px solid rgba(248, 208, 17, 0.2)'
                : '1px solid transparent',
            }}
          >
            {gd.day}
          </div>
        ))}
      </div>

      {/* Current milestone message */}
      {progress.nextMilestone && (
        <p className="text-xs" style={{ color: 'var(--text-on-dark-secondary)' }}>
          Next: Day {progress.nextMilestone.day} — {progress.nextMilestone.message}
        </p>
      )}

      {progress.pct >= 100 && (
        <div className="rounded-xl p-3 text-center" style={{ background: 'rgba(52, 211, 153, 0.08)', border: '1px solid rgba(52, 211, 153, 0.2)' }}>
          <p className="text-sm font-semibold" style={{ color: '#34D399' }}>
            Challenge Complete
          </p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-on-dark-secondary)' }}>
            {MILESTONES[MILESTONES.length - 1].message}
          </p>
        </div>
      )}
    </section>
  );
}
