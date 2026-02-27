'use client';

import { useState, useEffect, useRef } from 'react';
import { humanizeError } from '@/lib/ui/error-messages';
import { rayHex, cycleRay } from '@/lib/ui/ray-colors';

interface WinEntry {
  id: string;
  reflection_note: string;
  logged_at: string;
  tool_name: string;
}

/**
 * Micro-Wins Ledger — "Evidence Board"
 *
 * Logs moments where the user noticed a capacity in action.
 * Uses the existing reps API with tool_name = 'evidence_receipt'.
 * Each entry is one piece of evidence that a rep landed or a
 * capacity showed up. Over time, this builds the proof that
 * the system is working.
 */
export default function MicroWinsLedger() {
  const [wins, setWins] = useState<WinEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [newWin, setNewWin] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    let canceled = false;
    async function load() {
      try {
        const res = await fetch('/api/reps?limit=50');
        if (!res.ok) return;
        const data = (await res.json()) as { reps?: WinEntry[] };
        if (canceled) return;
        const evidenceReps = (data.reps ?? []).filter(
          (r) => r.tool_name === 'evidence_receipt'
        );
        setWins(evidenceReps);
      } finally {
        if (!canceled) setLoading(false);
      }
    }
    void load();
    return () => { canceled = true; };
  }, []);

  async function logWin() {
    const text = newWin.trim();
    if (!text) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch('/api/reps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tool_name: 'evidence_receipt',
          trigger_type: 'ad_hoc',
          reflection_note: text,
        }),
      });
      const data = (await res.json()) as { rep?: WinEntry; error?: string };
      if (!res.ok) {
        setError(data.error ?? 'win_save_failed');
        return;
      }
      if (data.rep) {
        setWins((prev) => [data.rep!, ...prev]);
      }
      setNewWin('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'win_save_failed');
    } finally {
      setSaving(false);
    }
  }

  const todayStr = new Date().toISOString().slice(0, 10);
  const todayWins = wins.filter((w) => w.logged_at?.startsWith(todayStr));
  const totalWins = wins.length;

  return (
    <div className="glass-card p-5 space-y-4">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest" style={{ color: rayHex('R8') }}>
          Evidence Board
        </p>
        <p className="mt-2 text-sm font-semibold" style={{ color: 'var(--text-on-dark)' }}>
          Log a receipt.
        </p>
        <p className="mt-1 text-xs" style={{ color: 'var(--text-on-dark-muted)' }}>
          One moment where you used a tool or noticed a capacity in action. That is a REP.
        </p>
      </div>

      {/* Input */}
      <div className="space-y-2">
        <textarea
          ref={inputRef}
          className="w-full rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid var(--surface-border)',
            color: 'var(--text-on-dark)',
          }}
          rows={2}
          value={newWin}
          onChange={(e) => setNewWin(e.target.value)}
          placeholder="What happened? What capacity showed up?"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              void logWin();
            }
          }}
        />
        <div className="flex items-center justify-between">
          <p className="text-xs" style={{ color: 'var(--text-on-dark-muted)' }}>
            {todayWins.length} today &middot; {totalWins} total
          </p>
          <button
            type="button"
            className="btn-primary text-sm py-2 px-5"
            disabled={saving || !newWin.trim()}
            onClick={() => void logWin()}
          >
            {saving ? 'Logging...' : 'Log It'}
          </button>
        </div>
      </div>

      {error && (
        <p className="text-xs text-rose-400" role="alert">{humanizeError(error)}</p>
      )}

      {/* Recent wins */}
      {!loading && wins.length > 0 && (
        <div className="space-y-2 pt-2" style={{ borderTop: '1px solid var(--surface-border)' }}>
          <p className="text-xs font-medium" style={{ color: 'var(--text-on-dark-muted)' }}>
            Recent receipts
          </p>
          {wins.slice(0, 7).map((win, i) => (
            <div key={win.id} className="flex gap-3 items-start">
              <div
                className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ background: rayHex(cycleRay(i)) }}
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm" style={{ color: 'var(--text-on-dark-secondary)' }}>
                  {win.reflection_note}
                </p>
                <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-on-dark-muted)' }}>
                  {formatWinDate(win.logged_at)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function formatWinDate(isoStr: string): string {
  try {
    const d = new Date(isoStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHrs < 1) return 'Just now';
    if (diffHrs < 24) return `${diffHrs}h ago`;
    const diffDays = Math.floor(diffHrs / 24);
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch {
    return '';
  }
}
