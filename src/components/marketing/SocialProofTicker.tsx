'use client';

import { useState, useEffect, useCallback } from 'react';

const PROOF_ITEMS = [
  { text: 'VP of Operations just completed their assessment.', type: 'activity' as const },
  { text: '"This showed me what MBTI and Enneagram never could."', type: 'quote' as const },
  { text: 'Senior Director tracked score movement over 90 days.', type: 'activity' as const },
  { text: '"My team noticed the change before I did."', type: 'quote' as const },
  { text: 'Engineering Lead mapped all 9 capacities.', type: 'activity' as const },
];

export default function SocialProofTicker() {
  const [index, setIndex] = useState(0);
  const [fading, setFading] = useState(false);

  const advance = useCallback(() => {
    setFading(true);
    setTimeout(() => {
      setIndex((prev) => (prev + 1) % PROOF_ITEMS.length);
      setFading(false);
    }, 400);
  }, []);

  useEffect(() => {
    const timer = setInterval(advance, 5000);
    return () => clearInterval(timer);
  }, [advance]);

  const item = PROOF_ITEMS[index];

  return (
    <div
      className="glass-card mx-auto max-w-[720px] px-5 py-3 text-center"
      role="status"
      aria-live="polite"
    >
      <p
        className="text-sm transition-opacity duration-300"
        style={{
          opacity: fading ? 0 : 1,
          color: item.type === 'quote'
            ? 'var(--brand-gold, #F8D011)'
            : 'var(--text-on-dark-secondary, rgba(255,255,255,0.75))',
          fontStyle: item.type === 'quote' ? 'italic' : 'normal',
        }}
      >
        {item.text}
      </p>
    </div>
  );
}
