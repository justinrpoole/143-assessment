'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCosmicMotion } from '@/lib/motion/use-cosmic-motion';
import { humanizeError } from '@/lib/ui/error-messages';

interface Plan {
  id: string;
  if_cue: string;
  then_action: string;
  tool_name: string | null;
  completed_count: number;
}

interface PlansResponse {
  plans: Plan[];
  error?: string;
}

// Common cue starters to help people get specific
const CUE_PROMPTS = [
  'I feel my chest tighten in a meeting',
  'Someone interrupts me while I\u2019m focused',
  'I catch myself scrolling instead of resting',
  'I notice I\u2019m rehearsing a conversation',
  'I feel the urge to say yes when I mean no',
];

export default function IfThenPlanClient() {
  const shouldAnimate = useCosmicMotion();

  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [creating, setCreating] = useState(false);
  const [ifCue, setIfCue] = useState('');
  const [thenAction, setThenAction] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPlans = useCallback(async () => {
    try {
      const res = await fetch('/api/if-then-plans');
      if (res.ok) {
        const data = (await res.json()) as PlansResponse;
        setPlans(data.plans ?? []);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadPlans();
  }, [loadPlans]);

  async function savePlan() {
    if (!ifCue.trim() || !thenAction.trim()) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch('/api/if-then-plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          if_cue: ifCue.trim(),
          then_action: thenAction.trim(),
        }),
      });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        setError(data.error ?? 'save_failed');
        return;
      }
      setIfCue('');
      setThenAction('');
      setCreating(false);
      void loadPlans();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'save_failed');
    } finally {
      setSaving(false);
    }
  }

  async function completePlan(planId: string) {
    try {
      await fetch('/api/if-then-plans', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'complete', plan_id: planId }),
      });
      void loadPlans();
    } catch {
      // Silently refresh
    }
  }

  async function removePlan(planId: string) {
    try {
      await fetch('/api/if-then-plans', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'deactivate', plan_id: planId }),
      });
      void loadPlans();
    } catch {
      // Silently refresh
    }
  }

  if (loading) {
    return (
      <div className="glass-card p-6 flex items-center justify-center">
        <div
          className="w-5 h-5 border-2 rounded-full animate-spin"
          style={{ borderColor: 'var(--surface-border)', borderTopColor: 'var(--brand-gold, #F8D011)' }}
        />
      </div>
    );
  }

  return (
    <div className="glass-card p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold" style={{ color: 'var(--text-on-dark)' }}>If / Then Plans</p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-on-dark-muted)' }}>
            Pre-commit your response before the moment arrives. Your RAS executes pre-loaded plans faster than live decisions.
          </p>
        </div>
        {!creating && plans.length < 5 && (
          <button
            type="button"
            onClick={() => setCreating(true)}
            className="text-xs font-medium px-3 py-1.5 rounded-full transition-colors"
            style={{
              color: 'var(--brand-gold, #F8D011)',
              border: '1px solid rgba(248, 208, 17, 0.3)',
              background: 'rgba(248, 208, 17, 0.08)',
            }}
          >
            + New plan
          </button>
        )}
        {plans.length >= 5 && !creating && (
          <span className="text-[10px]" style={{ color: 'var(--text-on-dark-muted)' }}>
            5/5 active
          </span>
        )}
      </div>

      {/* Create form */}
      <AnimatePresence>
        {creating && (
          <motion.div
            initial={shouldAnimate ? { opacity: 0, height: 0 } : false}
            animate={{ opacity: 1, height: 'auto' }}
            exit={shouldAnimate ? { opacity: 0, height: 0 } : undefined}
            transition={{ duration: shouldAnimate ? 0.2 : 0 }}
            className="overflow-hidden"
          >
            <div className="glass-card p-4 space-y-3" style={{ borderColor: 'rgba(96, 5, 141, 0.3)' }}>
              <div>
                <label className="text-xs font-medium block mb-1"
                  style={{ color: 'var(--text-on-dark-muted)' }}>
                  If I notice...
                </label>
                <input
                  type="text"
                  value={ifCue}
                  onChange={(e) => setIfCue(e.target.value)}
                  placeholder="the cue or trigger"
                  className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none transition-colors"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid var(--surface-border)',
                    color: 'var(--text-on-dark)',
                  }}
                />
                {plans.length === 0 && (
                  <div className="mt-2 flex gap-1.5 flex-wrap">
                    {CUE_PROMPTS.slice(0, 3).map((cue) => (
                      <button
                        key={cue}
                        type="button"
                        onClick={() => setIfCue(cue)}
                        className="text-xs px-2 py-1 rounded-full transition-colors"
                        style={{
                          background: 'rgba(255,255,255,0.04)',
                          border: '1px solid var(--surface-border)',
                          color: 'var(--text-on-dark-muted)',
                        }}
                      >
                        {cue}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs font-medium block mb-1"
                  style={{ color: 'var(--text-on-dark-muted)' }}>
                  Then I will...
                </label>
                <input
                  type="text"
                  value={thenAction}
                  onChange={(e) => setThenAction(e.target.value)}
                  placeholder="the specific action or tool"
                  className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none transition-colors"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid var(--surface-border)',
                    color: 'var(--text-on-dark)',
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      void savePlan();
                    }
                  }}
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => void savePlan()}
                  disabled={!ifCue.trim() || !thenAction.trim() || saving}
                  className="btn-primary text-sm py-2 px-4 disabled:opacity-40"
                >
                  {saving ? 'Saving...' : 'Save plan'}
                </button>
                <button
                  type="button"
                  onClick={() => { setCreating(false); setIfCue(''); setThenAction(''); setError(null); }}
                  className="text-sm px-3 transition-colors"
                  style={{ color: 'var(--text-on-dark-muted)' }}
                >
                  Cancel
                </button>
              </div>

              {error && (
                <div className="rounded-lg px-3 py-2"
                  style={{ background: 'rgba(220, 38, 38, 0.15)', border: '1px solid rgba(220, 38, 38, 0.3)' }}>
                  <p className="text-xs" style={{ color: '#FCA5A5' }} role="alert">{humanizeError(error)}</p>
                </div>
              )}

              <p className="text-xs italic" style={{ color: 'var(--text-on-dark-muted)' }}>
                🧠 Implementation intentions (Gollwitzer) double follow-through rates. Your RAS pre-loads the response so it fires before the amygdala takes over.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active plans */}
      {plans.length > 0 && (
        <div className="space-y-2">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={shouldAnimate ? { opacity: 0, y: 8 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: shouldAnimate ? i * 0.05 : 0, duration: shouldAnimate ? undefined : 0 }}
              className="glass-card flex items-start gap-3 p-3 group"
              style={{ borderColor: plan.completed_count >= 3 ? 'rgba(248, 208, 17, 0.2)' : undefined }}
            >
              <button
                type="button"
                onClick={() => void completePlan(plan.id)}
                className="mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors"
                style={{
                  borderColor: 'var(--brand-gold, #F8D011)',
                }}
                title="Mark completed"
              >
                <span className="opacity-0 group-hover:opacity-100 text-xs"
                  style={{ color: 'var(--brand-gold, #F8D011)' }}>
                  &#10003;
                </span>
              </button>
              <div className="flex-1 min-w-0 space-y-1.5">
                <div className="flex items-start gap-2">
                  <span
                    className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded shrink-0 mt-0.5"
                    style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B' }}
                  >If</span>
                  <p className="text-sm" style={{ color: 'var(--text-on-dark)' }}>{plan.if_cue}</p>
                </div>
                <div className="flex items-start gap-2">
                  <span
                    className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded shrink-0 mt-0.5"
                    style={{ background: 'rgba(248, 208, 17, 0.15)', color: 'var(--brand-gold)' }}
                  >Then</span>
                  <p className="text-sm" style={{ color: 'var(--text-on-dark)' }}>{plan.then_action}</p>
                </div>
                {plan.completed_count > 0 && (
                  <p className="text-xs" style={{ color: 'var(--text-on-dark-muted)' }}>
                    Fired {plan.completed_count} time{plan.completed_count !== 1 ? 's' : ''}
                    {plan.completed_count >= 5 && ' — this pattern is wiring in'}
                    {plan.completed_count >= 3 && plan.completed_count < 5 && ' — building the groove'}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => void removePlan(plan.id)}
                className="text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ color: 'var(--text-on-dark-muted)' }}
                title="Remove plan"
              >
                &#10005;
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {plans.length === 0 && !creating && (
        <div className="text-center py-2 space-y-1">
          <p className="text-sm" style={{ color: 'var(--text-on-dark-muted)' }}>
            Your friction points become your training ground.
          </p>
          <p className="text-xs italic" style={{ color: 'var(--text-on-dark-muted)' }}>
            Tap &ldquo;+ New plan&rdquo; to pre-commit a response before the pressure arrives.
          </p>
        </div>
      )}
    </div>
  );
}
