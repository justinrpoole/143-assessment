'use client';

import { useState, useEffect } from 'react';
import { haptic } from '@/lib/haptics';

interface FrequencyScaleProps {
  itemId: string;
  value: number | null;
  onSelect: (itemId: string, value: number) => void;
}

const LABELS = [
  { value: 0, label: 'Never' },
  { value: 1, label: 'Rarely' },
  { value: 2, label: 'Sometimes' },
  { value: 3, label: 'Often' },
  { value: 4, label: 'Almost always' },
];

export default function FrequencyScale({ itemId, value, onSelect }: FrequencyScaleProps) {
  const [justSelected, setJustSelected] = useState<number | null>(null);

  // Clear the pulse after animation completes
  useEffect(() => {
    if (justSelected === null) return;
    const timer = setTimeout(() => setJustSelected(null), 300);
    return () => clearTimeout(timer);
  }, [justSelected]);

  function handleSelect(optValue: number) {
    setJustSelected(optValue);
    haptic('light');
    onSelect(itemId, optValue);
  }

  return (
    <div className="grid w-full gap-2 sm:grid-cols-5">
      {LABELS.map((opt) => {
        const isSelected = value === opt.value;
        const isPulsing = justSelected === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => handleSelect(opt.value)}
            className={`
              min-h-[52px] rounded-xl border px-3 py-2 text-sm font-semibold
              transition-all duration-200 ease-out
              ${isSelected
                ? 'border-[#F8D011] bg-[#F8D011] text-[#020202] shadow-[0_0_16px_rgba(248,208,17,0.3)]'
                : 'border-[rgba(148,80,200,0.3)] bg-[rgba(96,5,141,0.35)] text-[rgba(255,255,255,0.92)] hover:border-[rgba(148,80,200,0.5)] hover:bg-[rgba(96,5,141,0.5)]'
              }
            `}
            style={{
              transform: isPulsing ? 'scale(1.06)' : 'scale(1)',
            }}
            aria-pressed={isSelected}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
