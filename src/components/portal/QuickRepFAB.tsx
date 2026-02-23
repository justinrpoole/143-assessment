'use client';

import { useState, useCallback } from 'react';
import { haptic } from '@/lib/haptics';

const QUICK_TOOLS = [
  { name: 'presence_pause', label: 'Presence Pause' },
  { name: '90_second_window', label: '90-Second Window' },
  { name: 'watch_me', label: 'Watch Me' },
  { name: 'go_first', label: 'Go First' },
  { name: 'i_rise', label: 'I Rise' },
  { name: 'ras_reset', label: 'RAS Reset' },
] as const;

export default function QuickRepFAB() {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [flash, setFlash] = useState<string | null>(null);

  const logRep = useCallback(async (toolName: string, label: string) => {
    setSaving(true);
    try {
      const res = await fetch('/api/reps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tool_name: toolName,
          trigger_type: 'quick_fab',
        }),
      });
      if (!res.ok) throw new Error('rep_failed');
      haptic('medium');
      setFlash(label);
      setOpen(false);
      setTimeout(() => setFlash(null), 2000);
    } catch {
      // Silently fail — rep logging is non-critical
    } finally {
      setSaving(false);
    }
  }, []);

  return (
    <>
      {/* Overlay backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40"
          style={{ background: 'rgba(2, 2, 2, 0.6)' }}
          onClick={() => setOpen(false)}
        />
      )}

      {/* Quick-select popover */}
      {open && (
        <div
          className="fixed bottom-20 right-5 z-50 glass-card p-3 space-y-1.5 w-52"
          style={{ borderColor: 'var(--surface-border)' }}
        >
          <p className="text-xs font-bold uppercase tracking-widest px-2 pb-1" style={{ color: 'var(--brand-gold, #F8D011)' }}>
            Log a Rep
          </p>
          {QUICK_TOOLS.map((tool) => (
            <button
              key={tool.name}
              type="button"
              disabled={saving}
              onClick={() => void logRep(tool.name, tool.label)}
              className="w-full text-left rounded-lg px-3 py-2 text-sm transition-colors disabled:opacity-50"
              style={{
                color: 'var(--text-on-dark, #FFFEF5)',
                background: 'transparent',
              }}
              onMouseEnter={(e) => { (e.target as HTMLElement).style.background = 'rgba(248, 208, 17, 0.1)'; }}
              onMouseLeave={(e) => { (e.target as HTMLElement).style.background = 'transparent'; }}
            >
              {tool.label}
            </button>
          ))}
        </div>
      )}

      {/* Flash confirmation */}
      {flash && (
        <div
          className="fixed bottom-20 right-5 z-50 rounded-xl px-4 py-2 text-sm font-semibold"
          style={{
            background: 'rgba(248, 208, 17, 0.15)',
            border: '1px solid rgba(248, 208, 17, 0.3)',
            color: 'var(--brand-gold, #F8D011)',
          }}
        >
          {flash} logged
        </div>
      )}

      {/* FAB button */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-transform active:scale-95"
        style={{
          background: 'var(--brand-gold, #F8D011)',
          boxShadow: '0 4px 20px rgba(248, 208, 17, 0.3)',
        }}
        aria-label={open ? 'Close rep menu' : 'Quick log a rep'}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          {open ? (
            <>
              <line x1="6" y1="6" x2="18" y2="18" stroke="var(--ink-dark, #020202)" strokeWidth="2" strokeLinecap="round" />
              <line x1="18" y1="6" x2="6" y2="18" stroke="var(--ink-dark, #020202)" strokeWidth="2" strokeLinecap="round" />
            </>
          ) : (
            <>
              <line x1="12" y1="5" x2="12" y2="19" stroke="var(--ink-dark, #020202)" strokeWidth="2" strokeLinecap="round" />
              <line x1="5" y1="12" x2="19" y2="12" stroke="var(--ink-dark, #020202)" strokeWidth="2" strokeLinecap="round" />
            </>
          )}
        </svg>
      </button>
    </>
  );
}
