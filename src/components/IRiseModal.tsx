'use client';

import { useState } from 'react';

interface Props {
  onClose: () => void;
  onRepLogged?: () => void;
}

type Step = 'name' | 'declare' | 'move' | 'receipt';

const SPIRAL_OPTIONS = [
  'Anxiety', 'Shame', 'Dread', 'Overwhelm',
  'Anger', 'Paralysis', 'The spiral',
];

const SMALL_MOVES = [
  'Feet flat on the floor',
  'One slow exhale',
  'Shoulders back, jaw unclenched',
  'Drink a glass of water',
  'Name it out loud: "I am here."',
];

export default function IRiseModal({ onClose, onRepLogged }: Props) {
  const [step, setStep] = useState<Step>('name');
  const [selectedSpiral, setSelectedSpiral] = useState<string>('');
  const [selectedMove, setSelectedMove] = useState<string>('');
  const [showScience, setShowScience] = useState(false);
  const [logging, setLogging] = useState(false);
  const [startedAt] = useState(Date.now());

  async function logRep() {
    setLogging(true);
    const elapsed = Math.round((Date.now() - startedAt) / 1000);
    try {
      await fetch('/api/reps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tool_name: 'i_rise',
          trigger_type: 'i_rise',
          duration_seconds: Math.max(elapsed, 30),
          quality: 2,
          reflection_note: [
            selectedSpiral ? `Named: ${selectedSpiral}` : null,
            selectedMove ? `Move: ${selectedMove}` : null,
          ]
            .filter(Boolean)
            .join(' | ') || null,
        }),
      });
      onRepLogged?.();
    } finally {
      setLogging(false);
      setStep('receipt');
    }
  }

  return (
    <div className="glass-modal-backdrop">
      <div className="glass-modal-panel max-w-md w-full mx-4 overflow-hidden" role="dialog" aria-modal="true" aria-label="I Rise — identity reset">

        {/* Header */}
        <div
          className="px-6 py-5"
          style={{ background: 'linear-gradient(135deg, #0F0A1E 0%, #3E1D63 100%)' }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-[#F8D011] font-semibold">
                Identity reset
              </p>
              <h2 className="text-2xl font-bold mt-1" style={{ color: 'var(--text-on-dark)' }}>I rise.</h2>
            </div>
            {step === 'name' && (
              <button
                onClick={onClose}
                className="hover:text-white text-2xl leading-none"
                style={{ color: 'var(--text-on-dark-muted)' }}
                aria-label="Close"
              >
                ×
              </button>
            )}
          </div>
          <p className="text-sm mt-2" style={{ color: 'var(--text-on-dark-secondary)' }}>
            You noticed the spiral. That&apos;s already a step.
          </p>
        </div>

        <div className="p-6">

          {/* Step 1: Name it */}
          {step === 'name' && (
            <div className="space-y-5">
              <div className="space-y-2">
                <p className="text-sm font-semibold" style={{ color: 'var(--text-on-dark)' }}>
                  Step 1 — Name it (silently, to yourself)
                </p>
                <p className="text-sm" style={{ color: 'var(--text-on-dark-muted)' }}>
                  This is ____. Naming it reduces its power over you.
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {SPIRAL_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setSelectedSpiral(opt)}
                      className={`px-3 py-1.5 rounded-full text-sm border transition-all ${
                        selectedSpiral === opt
                          ? 'bg-[#F8D011] text-[#020202] border-[#F8D011]'
                          : 'text-white/70 hover:border-[#F8D011]/50'
                      }`}
                      style={selectedSpiral !== opt ? { borderColor: 'var(--surface-border)' } : undefined}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowScience((s) => !s)}
                className="text-xs underline underline-offset-2"
                style={{ color: 'var(--cosmic-purple-light)' }}
              >
                {showScience ? 'Hide' : 'Why naming it helps'}
              </button>
              {showScience && (
                <div className="rounded-xl p-4 text-xs leading-relaxed" style={{ background: 'rgba(248, 208, 17, 0.08)', color: 'var(--text-on-dark-secondary)' }}>
                  Naming the emotion (affect labeling) reduces amygdala reactivity within seconds
                  (Lieberman et al., 2007). The declaration shifts processing to prefrontal cortex.
                  The small move cements the interrupt.
                </div>
              )}

              <button
                onClick={() => setStep('declare')}
                className="btn-primary w-full"
              >
                Named it. Next
              </button>
            </div>
          )}

          {/* Step 2: Declaration */}
          {step === 'declare' && (
            <div className="space-y-5 text-center">
              <p className="text-sm font-semibold" style={{ color: 'var(--text-on-dark)' }}>
                Step 2 — Say this (out loud if you can)
              </p>
              <div className="border-2 border-[#F8D011] rounded-2xl px-6 py-6 space-y-2" style={{ background: 'rgba(248, 208, 17, 0.08)' }}>
                <p className="text-lg font-bold leading-relaxed" style={{ color: 'var(--text-on-dark)' }}>
                  I rise like the sun —
                </p>
                <p className="text-lg font-bold leading-relaxed" style={{ color: 'var(--text-on-dark)' }}>
                  consistent, warm, and radiant.
                </p>
              </div>
              {selectedSpiral && (
                <p className="text-sm" style={{ color: 'var(--text-on-dark-muted)' }}>
                  {selectedSpiral} is present. You are still here. You can still return.
                </p>
              )}
              <button
                onClick={() => setStep('move')}
                className="btn-primary w-full"
              >
                Said it. Make a move
              </button>
            </div>
          )}

          {/* Step 3: Small move */}
          {step === 'move' && (
            <div className="space-y-5">
              <div className="space-y-2">
                <p className="text-sm font-semibold" style={{ color: 'var(--text-on-dark)' }}>
                  Step 3 — Make one small move
                </p>
                <p className="text-sm" style={{ color: 'var(--text-on-dark-muted)' }}>
                  What can you do in the next 10 seconds?
                </p>
                <div className="space-y-2 mt-3">
                  {SMALL_MOVES.map((move) => (
                    <button
                      key={move}
                      type="button"
                      onClick={() => setSelectedMove(move)}
                      className={`w-full text-left px-4 py-2.5 rounded-xl border text-sm transition-all ${
                        selectedMove === move
                          ? 'bg-[#F8D011] text-[#020202] border-[#F8D011]'
                          : 'hover:border-[#F8D011]/50'
                      }`}
                      style={selectedMove !== move ? { borderColor: 'var(--surface-border)', color: 'var(--text-on-dark-secondary)' } : undefined}
                    >
                      {move}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={logRep}
                disabled={logging}
                className="btn-primary w-full"
              >
                {logging ? 'Logging...' : 'I moved. Log this rep.'}
              </button>
              <button
                onClick={onClose}
                className="text-xs w-full text-center hover:opacity-100 transition-opacity"
                style={{ color: 'var(--text-on-dark-muted)' }}
              >
                Skip logging
              </button>
            </div>
          )}

          {/* Receipt */}
          {step === 'receipt' && (
            <div className="text-center space-y-4">
              <div className="text-4xl">&#x2600;&#xFE0F;</div>
              <p className="text-lg font-bold" style={{ color: 'var(--text-on-dark)' }}>Logged.</p>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--cosmic-purple-light)' }}>
                You came back to yourself. That&apos;s the pattern interrupt working.
                Returning faster is the skill.
              </p>
              <button onClick={onClose} className="btn-primary w-full">
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
