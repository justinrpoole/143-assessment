'use client';

import { useEffect, useState } from 'react';

/**
 * LiveActivityBadge — "X leaders assessed this week" counter.
 * Fetches weekly count from /api/stats/weekly-assessments.
 * Shows nothing if fetch fails or count is zero.
 */
export default function LiveActivityBadge() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/stats/weekly-assessments')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.count > 0) setCount(data.count);
      })
      .catch(() => {});
  }, []);

  if (count === null) return null;

  return (
    <div className="live-activity-badge" aria-label={`${count} leaders assessed this week`}>
      <span className="live-activity-badge__dot" />
      <span>{count} leader{count !== 1 ? 's' : ''} assessed this week</span>
    </div>
  );
}
