'use client';

import { useEffect, useMemo, useState } from 'react';

const LS_KEY = '143_portal_boot_last';

function shouldShowBoot(): boolean {
  if (typeof window === 'undefined') return false;
  const last = localStorage.getItem(LS_KEY);
  if (!last) return true;
  return new Date(last).toDateString() !== new Date().toDateString();
}

function markBootShown() {
  localStorage.setItem(LS_KEY, new Date().toISOString());
}

interface RetroBootSequenceProps {
  trainingRayName?: string | null;
}

export default function RetroBootSequence({ trainingRayName }: RetroBootSequenceProps) {
  const [visible, setVisible] = useState(false);
  const [lineCount, setLineCount] = useState(0);

  const lines = useMemo(() => {
    const base = [
      { label: 'Boot', value: '143 OS' },
      { label: 'Status', value: 'Signal scan active' },
      { label: 'Focus', value: trainingRayName ? `Training: ${trainingRayName}` : 'Training: Your next rep' },
      { label: 'Mode', value: 'Radiant by design' },
    ];
    return base;
  }, [trainingRayName]);

  useEffect(() => {
    if (!shouldShowBoot()) return;
    setVisible(true);
  }, []);

  useEffect(() => {
    if (!visible) return;
    let index = 0;
    setLineCount(0);
    const interval = window.setInterval(() => {
      index += 1;
      setLineCount(Math.min(index, lines.length));
      if (index >= lines.length) {
        window.clearInterval(interval);
      }
    }, 320);
    const timeout = window.setTimeout(() => {
      markBootShown();
      setVisible(false);
    }, lines.length * 320 + 900);
    return () => {
      window.clearInterval(interval);
      window.clearTimeout(timeout);
    };
  }, [visible, lines.length]);

  function handleClose() {
    markBootShown();
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ background: 'radial-gradient(circle at top, rgba(96, 5, 141, 0.9), rgba(2, 2, 2, 0.95))' }}
      role="dialog"
      aria-modal="true"
      aria-label="Portal boot sequence"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-md rounded-2xl border p-5"
        style={{ background: 'rgba(2, 2, 2, 0.75)', borderColor: 'rgba(248, 208, 17, 0.3)' }}
        onClick={(event) => event.stopPropagation()}
      >
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl"
          style={{
            background: 'repeating-linear-gradient(180deg, rgba(255,255,255,0.08) 0px, rgba(255,255,255,0.02) 2px, transparent 4px, transparent 8px)',
            mixBlendMode: 'screen',
            opacity: 0.25,
            animation: 'bootScan 1.6s linear infinite',
          }}
        />

        <p className="text-[10px] uppercase tracking-[0.4em]" style={{ color: 'var(--brand-gold)' }}>
          Boot Sequence
        </p>

        <div className="mt-3 space-y-1 font-mono text-xs" style={{ color: 'var(--text-on-dark)' }}>
          {lines.slice(0, lineCount).map((line) => (
            <div key={line.label} className="flex items-center justify-between gap-3">
              <span className="opacity-70">{line.label}</span>
              <span>{line.value}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <p className="text-[10px]" style={{ color: 'var(--text-on-dark-muted)' }}>
            {lineCount >= lines.length ? 'Signal locked.' : 'Calibrating...'}
          </p>
          <button
            type="button"
            onClick={handleClose}
            className="text-[10px] uppercase tracking-widest px-3 py-1 rounded-full"
            style={{ background: 'rgba(248, 208, 17, 0.16)', color: 'var(--brand-gold)' }}
          >
            Enter
          </button>
        </div>
      </div>

      <style>{`
        @keyframes bootScan {
          0% { background-position: 0 0; }
          100% { background-position: 0 18px; }
        }
      `}</style>
    </div>
  );
}
