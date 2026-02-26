'use client';

import { useEffect, useState } from 'react';

/**
 * StreakBadge — Flame icon + current streak count for daily-practice pages.
 * Fetches streak from /api/stats/streak. Shows nothing if no streak.
 */
export default function StreakBadge() {
  const [streak, setStreak] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/stats/streak')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.streak > 0) setStreak(data.streak);
      })
      .catch(() => {});
  }, []);

  if (streak === null) return null;

  return (
    <span className="streak-badge" aria-label={`${streak} day streak`}>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path
          d="M8 1C8 1 3 6 3 9.5C3 12 5.2 14 8 14C10.8 14 13 12 13 9.5C13 6 8 1 8 1ZM8 12.5C6.3 12.5 5 11.2 5 9.8C5 7.8 8 4 8 4C8 4 11 7.8 11 9.8C11 11.2 9.7 12.5 8 12.5Z"
          fill="url(#flame-grad)"
        />
        <defs>
          <linearGradient id="flame-grad" x1="8" y1="1" x2="8" y2="14" gradientUnits="userSpaceOnUse">
            <stop stopColor="#F8D011" />
            <stop offset="1" stopColor="#FF8C00" />
          </linearGradient>
        </defs>
      </svg>
      <span>{streak}</span>
    </span>
  );
}
