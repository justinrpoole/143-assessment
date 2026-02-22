'use client';

import { useEffect, useState } from 'react';

export default function IntentionRecall() {
  const [intention, setIntention] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/portal/intention')
      .then((r) => r.json())
      .then((data) => {
        if (data.intention) setIntention(data.intention);
      })
      .catch(() => {});
  }, []);

  if (!intention) return null;

  return (
    <p
      className="mt-3 text-sm italic leading-relaxed"
      style={{ color: 'var(--text-on-dark-secondary)' }}
    >
      You wanted to understand: &ldquo;{intention}&rdquo; — here is what the data shows.
    </p>
  );
}
