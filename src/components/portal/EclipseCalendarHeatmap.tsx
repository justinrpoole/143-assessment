'use client';

import { useState, useEffect, useMemo } from 'react';

interface CalendarDay {
  date: string;
  has_loop: boolean;
  load_band: 'low' | 'moderate' | 'elevated' | 'high' | null;
}

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

/** Map state to cell color */
function cellColor(day: CalendarDay, isToday: boolean): string {
  if (isToday) return 'rgba(248, 208, 17, 0.25)'; // gold outline handled separately

  if (day.has_loop && day.load_band) {
    // Both data points available — blend based on load
    switch (day.load_band) {
      case 'low': return 'rgba(52, 211, 153, 0.5)';       // green — great day
      case 'moderate': return 'rgba(248, 208, 17, 0.35)';  // gold — normal
      case 'elevated': return 'rgba(251, 146, 60, 0.4)';   // amber — strained
      case 'high': return 'rgba(248, 113, 113, 0.4)';      // rose — heavy load
    }
  }

  if (day.has_loop) {
    return 'rgba(52, 211, 153, 0.35)'; // green — completed loop, no audit data
  }

  if (day.load_band) {
    // Energy audit exists but no loop
    switch (day.load_band) {
      case 'low': return 'rgba(52, 211, 153, 0.2)';
      case 'moderate': return 'rgba(248, 208, 17, 0.15)';
      case 'elevated': return 'rgba(251, 146, 60, 0.2)';
      case 'high': return 'rgba(248, 113, 113, 0.25)';
    }
  }

  return 'rgba(255, 255, 255, 0.04)'; // no data
}

function cellLabel(day: CalendarDay): string {
  const parts: string[] = [];
  if (day.has_loop) parts.push('Daily loop completed');
  if (day.load_band) parts.push(`Load: ${day.load_band}`);
  if (parts.length === 0) return 'No data';
  return parts.join(' | ');
}

export default function EclipseCalendarHeatmap() {
  const [days, setDays] = useState<CalendarDay[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch('/api/portal/calendar?days=28')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.days) setDays(data.days as CalendarDay[]);
      })
      .catch(() => { /* non-critical */ })
      .finally(() => setLoaded(true));
  }, []);

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  // Organize into weeks (Mon-Sun rows)
  const weeks = useMemo(() => {
    if (days.length === 0) return [];

    const result: (CalendarDay | null)[][] = [];
    let currentWeek: (CalendarDay | null)[] = [];

    // Pad the first week with nulls before the first day
    if (days[0]) {
      const firstDate = new Date(days[0].date + 'T12:00:00');
      const dow = firstDate.getDay();
      const mondayOffset = (dow + 6) % 7; // 0=Mon, 6=Sun
      for (let i = 0; i < mondayOffset; i++) {
        currentWeek.push(null);
      }
    }

    for (const day of days) {
      const d = new Date(day.date + 'T12:00:00');
      const dow = d.getDay();
      const mondayIndex = (dow + 6) % 7;

      if (mondayIndex === 0 && currentWeek.length > 0) {
        // Pad remaining days in previous week
        while (currentWeek.length < 7) currentWeek.push(null);
        result.push(currentWeek);
        currentWeek = [];
      }

      currentWeek.push(day);
    }

    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) currentWeek.push(null);
      result.push(currentWeek);
    }

    return result;
  }, [days]);

  // Count active days
  const activeDays = useMemo(() => days.filter((d) => d.has_loop).length, [days]);

  if (!loaded) return null;
  if (days.length < 7) return null; // Need at least a week of data

  return (
    <div className="glass-card p-5 space-y-3" style={{ borderTop: '2px solid var(--brand-gold, #F8D011)' }}>
      <div className="flex items-center justify-between">
        <div>
          <h3
            className="text-sm font-semibold"
            style={{ color: 'var(--text-on-dark)' }}
          >
            <span className="gold-tag inline-block text-xs mr-2">Eclipse</span>
            Calendar
          </h3>
          <p className="text-xs" style={{ color: 'var(--text-on-dark-muted)' }}>
            Last 4 weeks — {activeDays} active day{activeDays !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-[10px]" style={{ color: 'var(--text-on-dark-muted)' }}>
            <span className="inline-block w-2.5 h-2.5 rounded-sm" style={{ background: 'rgba(52, 211, 153, 0.5)' }} />
            Clear
          </span>
          <span className="flex items-center gap-1 text-[10px]" style={{ color: 'var(--text-on-dark-muted)' }}>
            <span className="inline-block w-2.5 h-2.5 rounded-sm" style={{ background: 'rgba(248, 208, 17, 0.35)' }} />
            Moderate
          </span>
          <span className="flex items-center gap-1 text-[10px]" style={{ color: 'var(--text-on-dark-muted)' }}>
            <span className="inline-block w-2.5 h-2.5 rounded-sm" style={{ background: 'rgba(248, 113, 113, 0.4)' }} />
            Heavy
          </span>
        </div>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 gap-1">
        {DAY_LABELS.map((label) => (
          <p
            key={label}
            className="text-center text-[9px] uppercase tracking-wider font-medium"
            style={{ color: 'var(--text-on-dark-muted)' }}
          >
            {label}
          </p>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="space-y-1">
        {weeks.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7 gap-1">
            {week.map((day, di) => {
              if (!day) {
                return (
                  <div
                    key={`empty-${wi}-${di}`}
                    className="aspect-square rounded-md"
                    style={{ background: 'transparent' }}
                  />
                );
              }

              const isToday = day.date === todayStr;
              const dateNum = new Date(day.date + 'T12:00:00').getDate();

              return (
                <div
                  key={day.date}
                  className="aspect-square rounded-md flex items-center justify-center relative transition-all"
                  style={{
                    background: cellColor(day, false),
                    border: isToday ? '1.5px solid var(--brand-gold)' : '1px solid transparent',
                    cursor: 'default',
                  }}
                  title={`${day.date}: ${cellLabel(day)}`}
                  aria-label={`${day.date}: ${cellLabel(day)}`}
                >
                  <span
                    className="text-[10px] font-medium"
                    style={{ color: isToday ? 'var(--brand-gold)' : 'var(--text-on-dark-muted)' }}
                  >
                    {dateNum}
                  </span>
                  {/* Loop completion dot */}
                  {day.has_loop && (
                    <span
                      className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                      style={{ background: 'var(--brand-gold)' }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <p className="text-[10px] leading-relaxed" style={{ color: 'var(--text-on-dark-muted)' }}>
        Color shows daily loop completion + energy audit load.
        Gold dots mark days you completed your daily loop.
      </p>
    </div>
  );
}
