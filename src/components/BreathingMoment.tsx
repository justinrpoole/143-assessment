'use client';

import { useState, useEffect } from 'react';

interface BreathingMomentProps {
  message: string;
  onContinue: () => void;
}

export default function BreathingMoment({ message, onContinue }: BreathingMomentProps) {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowButton(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--soft)]">
      <div className="max-w-md mx-auto px-8 text-center fade-in">
        <div className="mb-8 flex justify-center">
          <div
            className="w-16 h-16 rounded-full animate-breathe"
            style={{
              background: 'radial-gradient(circle, #ffad47 0%, #0d1e3e 72%)',
            }}
          />
        </div>

        <p className="text-xl font-medium text-[var(--ink)] leading-relaxed mb-4">
          {message}
        </p>

        <p className="text-sm text-[var(--ink-soft)] mb-10">
          One clean breath. Then next action.
        </p>

        <div className={`transition-all duration-700 ${showButton ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <button
            onClick={onContinue}
            disabled={!showButton}
            className="px-8 py-3 rounded-xl text-base font-semibold transition
              bg-[var(--ink)] text-white hover:brightness-110 shadow-[0_10px_26px_rgba(13,30,62,0.25)]"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
