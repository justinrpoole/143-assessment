'use client';

import { useEffect, useState } from 'react';

interface DimmingResult {
  score: number;
  level: string;
  primaryRay: string;
  primaryRayName: string;
  timestamp: number;
}

const LEVEL_COPY: Record<string, string> = {
  LOW: 'mild coverage — your capacity is mostly online but narrowing under load',
  MODERATE: 'moderate coverage — sustained stress is starting to mask your strongest rays',
  ELEVATED: 'elevated coverage — your system is compensating hard. The assessment will show exactly where',
  HIGH: 'significant coverage — your light is not gone, it is covered. This maps what is underneath',
};

export default function DimmingCarryForwardCard() {
  const [result, setResult] = useState<DimmingResult | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('143_dimming_result');
      if (!raw) return;
      const parsed = JSON.parse(raw) as DimmingResult;
      // Only use results from the last 24 hours
      if (Date.now() - parsed.timestamp > 24 * 60 * 60 * 1000) return;
      setResult(parsed);
    } catch {
      // Silent
    }
  }, []);

  if (!result) return null;

  const levelText = LEVEL_COPY[result.level] ?? LEVEL_COPY.MODERATE;

  return (
    <div
      className="glass-card mb-6 p-5"
      style={{ borderLeft: '3px solid var(--brand-gold, #F8D011)' }}
    >
      <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--brand-gold, #F8D011)' }}>
        Your Light Check Result
      </p>
      <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-on-dark, #FFFEF5)' }}>
        Your check found <strong style={{ color: 'var(--brand-gold, #F8D011)' }}>{result.level.toLowerCase()}</strong> eclipse
        on <strong>{result.primaryRayName}</strong> — {levelText}.
      </p>
      <p className="mt-2 text-xs leading-relaxed" style={{ color: 'var(--text-on-dark-muted, rgba(255,255,255,0.5))' }}>
        The full assessment maps all 9 rays and shows you exactly what is underneath — and what to do first.
      </p>
    </div>
  );
}
