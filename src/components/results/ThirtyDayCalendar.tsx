'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

interface ThirtyDayCalendarProps {
  /** Week 1 plan text */
  week1: string;
  /** Weeks 2-4 plan text */
  weeks24: string;
  /** Bottom ray name (training focus) */
  rayName?: string;
  /** Unique key for persistence */
  runId?: string;
}

const WEEKDAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

function getLsKey(runId?: string): string {
  return `143_calendar_${runId ?? 'default'}`;
}

export default function ThirtyDayCalendar({
  week1,
  weeks24,
  rayName,
  runId,
}: ThirtyDayCalendarProps) {
  const [checkedDays, setCheckedDays] = useState<Set<number>>(new Set());

  // Load from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(getLsKey(runId));
      if (stored) {
        const parsed = JSON.parse(stored) as number[];
        queueMicrotask(() => setCheckedDays(new Set(parsed)));
      }
    } catch { /* silent */ }
  }, [runId]);

  // Persist to localStorage
  const toggleDay = useCallback((day: number) => {
    setCheckedDays((prev) => {
      const next = new Set(prev);
      if (next.has(day)) {
        next.delete(day);
      } else {
        next.add(day);
      }
      try { localStorage.setItem(getLsKey(runId), JSON.stringify([...next])); } catch { /* silent */ }
      return next;
    });
  }, [runId]);

  // Build 30-day grid starting from the assessment date (or today)
  const days = useMemo(() => {
    const today = new Date();
    const startDate = new Date(today);
    // Start from beginning of the current week (Monday)
    const dayOfWeek = startDate.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    startDate.setDate(startDate.getDate() + mondayOffset);

    return Array.from({ length: 35 }, (_, i) => {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const dayNum = i - (-mondayOffset) + 1; // 1-indexed from today
      const isPast = date < today && date.toDateString() !== today.toDateString();
      const isToday = date.toDateString() === today.toDateString();
      const isFuture = dayNum > 30;
      const isWeek1 = dayNum >= 1 && dayNum <= 7;

      return {
        index: i,
        dayNum,
        date,
        dateLabel: date.getDate().toString(),
        isPast,
        isToday,
        isFuture: isFuture || dayNum < 1,
        isWeek1,
        checked: checkedDays.has(dayNum),
      };
    });
  }, [checkedDays]);

  const completedCount = checkedDays.size;
  const streak = useMemo(() => {
    let count = 0;
    for (let d = 30; d >= 1; d--) {
      if (checkedDays.has(d)) count++;
      else break;
    }
    return count;
  }, [checkedDays]);

  return (
    <div className="space-y-4">
      {/* Progress header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-on-dark-muted)' }}>
            30-Day Tracker
          </p>
          {rayName && (
            <p className="text-xs mt-0.5" style={{ color: 'var(--brand-gold)' }}>
              Training: {rayName}
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-lg font-bold" style={{ color: 'var(--brand-gold)' }}>{completedCount}/30</p>
            <p className="text-[10px]" style={{ color: 'var(--text-on-dark-muted)' }}>days practiced</p>
          </div>
          {streak > 0 && (
            <div className="text-right">
              <p className="text-lg font-bold" style={{ color: '#34D399' }}>{streak}</p>
              <p className="text-[10px]" style={{ color: 'var(--text-on-dark-muted)' }}>day streak</p>
            </div>
          )}
        </div>
      </div>

      {/* Phase indicators */}
      <div className="flex gap-2">
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded" style={{ background: 'rgba(248, 208, 17, 0.4)' }} />
          <span className="text-[10px]" style={{ color: 'var(--text-on-dark-muted)' }}>Week 1 — Install</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded" style={{ background: 'rgba(148, 80, 200, 0.4)' }} />
          <span className="text-[10px]" style={{ color: 'var(--text-on-dark-muted)' }}>Weeks 2-4 — Build</span>
        </div>
      </div>

      {/* Calendar grid */}
      <div className="glass-card p-3">
        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-1 mb-1">
          {WEEKDAY_LABELS.map((label, i) => (
            <div key={i} className="text-center">
              <span className="text-[9px] font-bold uppercase" style={{ color: 'var(--text-on-dark-muted)' }}>
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day) => {
            if (day.isFuture) {
              return (
                <div key={day.index} className="aspect-square rounded-lg" style={{ background: 'rgba(96, 5, 141, 0.05)' }} />
              );
            }

            const phaseColor = day.isWeek1
              ? 'rgba(248, 208, 17, 0.08)'
              : 'rgba(148, 80, 200, 0.08)';

            return (
              <button
                key={day.index}
                onClick={() => { if (day.dayNum >= 1 && day.dayNum <= 30) toggleDay(day.dayNum); }}
                className="aspect-square rounded-lg flex flex-col items-center justify-center transition-all text-center"
                style={{
                  background: day.checked
                    ? 'rgba(248, 208, 17, 0.2)'
                    : phaseColor,
                  border: day.isToday
                    ? '2px solid var(--brand-gold)'
                    : day.checked
                      ? '1px solid rgba(248, 208, 17, 0.3)'
                      : '1px solid rgba(148, 80, 200, 0.1)',
                  opacity: day.dayNum < 1 ? 0.3 : 1,
                }}
                aria-label={`Day ${day.dayNum}${day.checked ? ' — completed' : ''}`}
                disabled={day.dayNum < 1}
              >
                <span
                  className="text-[10px] leading-none"
                  style={{ color: day.isToday ? 'var(--brand-gold)' : 'var(--text-on-dark-muted)' }}
                >
                  {day.dateLabel}
                </span>
                {day.checked && (
                  <span className="text-[10px] leading-none mt-0.5" style={{ color: 'var(--brand-gold)' }}>
                    &#10003;
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Plan text below calendar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="glass-card p-3" style={{ borderLeft: '3px solid rgba(248, 208, 17, 0.4)' }}>
          <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--brand-gold)' }}>
            Week 1 — Install
          </p>
          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>{week1}</p>
        </div>
        <div className="glass-card p-3" style={{ borderLeft: '3px solid rgba(148, 80, 200, 0.4)' }}>
          <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: 'rgba(148, 80, 200, 0.8)' }}>
            Weeks 2-4 — Build
          </p>
          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>{weeks24}</p>
        </div>
      </div>
    </div>
  );
}
