'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCosmicMotion } from '@/lib/motion/use-cosmic-motion';
import CosmicSkeleton from '@/components/ui/CosmicSkeleton';
import { humanizeError } from '@/lib/ui/error-messages';
import {
  ENERGY_DIMENSIONS,
  computeLoadBand,
  LOAD_GUIDANCE,
  currentWeekMonday,
  type LoadBand,
  type LoadGuidance,
} from '@/lib/retention/energy-audit';

interface AuditResult {
  totalLoad: number;
  loadBand: LoadBand;
  guidance: LoadGuidance;
  scores: Record<string, number>;
}

interface ApiResponse {
  week_of: string;
  has_audit: boolean;
  scores: Record<string, number> | null;
  total_load: number | null;
  load_band: string | null;
  guidance: LoadGuidance | null;
  error?: string;
}

// Band-specific cosmic styling
const BAND_STYLES: Record<string, { glow: string; border: string }> = {
  green: { glow: '0 0 20px rgba(34, 197, 94, 0.15)', border: 'rgba(34, 197, 94, 0.3)' },
  yellow: { glow: '0 0 20px rgba(234, 179, 8, 0.15)', border: 'rgba(234, 179, 8, 0.3)' },
  orange: { glow: '0 0 20px rgba(249, 115, 22, 0.15)', border: 'rgba(249, 115, 22, 0.3)' },
  red: { glow: '0 0 20px rgba(239, 68, 68, 0.15)', border: 'rgba(239, 68, 68, 0.3)' },
};

const RAS_INSIGHTS: Record<string, string> = {
  green: 'Your RAS is operating with capacity. This is the state where growth reps land deepest.',
  yellow: 'Your RAS is managing increased load. Be intentional about where you direct attention.',
  orange: 'Your RAS is in protection mode. Reduce inputs. The brain can\'t rewire when it\'s firefighting.',
  red: 'Your RAS is overwhelmed. Recovery isn\'t optional — it\'s the rep. Rest is how you rebuild capacity.',
};

export default function EnergyAuditClient() {
  const shouldAnimate = useCosmicMotion();

  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<AuditResult | null>(null);
  const [step, setStep] = useState(-1); // -1 = not started, 0-7 = dimensions
  const [scores, setScores] = useState<Record<string, number>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadAudit = useCallback(async () => {
    try {
      const res = await fetch(`/api/energy-audit?week_of=${currentWeekMonday()}`);
      if (!res.ok) return;
      const data = (await res.json()) as ApiResponse;
      if (data.has_audit && data.scores && data.load_band && data.guidance) {
        setResult({
          totalLoad: data.total_load ?? 0,
          loadBand: data.load_band as LoadBand,
          guidance: data.guidance,
          scores: data.scores,
        });
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadAudit();
  }, [loadAudit]);

  async function saveAudit(finalScores: Record<string, number>) {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch('/api/energy-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          week_of: currentWeekMonday(),
          scores: finalScores,
        }),
      });
      const data = (await res.json()) as ApiResponse;
      if (!res.ok) {
        setError(data.error ?? 'save_failed');
        return;
      }
      if (data.load_band && data.guidance) {
        setResult({
          totalLoad: data.total_load ?? 0,
          loadBand: data.load_band as LoadBand,
          guidance: data.guidance,
          scores: finalScores,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'save_failed');
    } finally {
      setSaving(false);
    }
  }

  function handleSelect(dimId: string, score: number) {
    const updated = { ...scores, [dimId]: score };
    setScores(updated);

    if (step < ENERGY_DIMENSIONS.length - 1) {
      setTimeout(() => setStep(step + 1), 200);
    } else {
      // Last dimension — compute and save
      let total = 0;
      for (const dim of ENERGY_DIMENSIONS) {
        total += updated[dim.id] ?? 0;
      }
      const band = computeLoadBand(total);
      const guidance = LOAD_GUIDANCE[band];
      setResult({ totalLoad: total, loadBand: band, guidance, scores: updated });
      setStep(-1);
      void saveAudit(updated);
    }
  }

  function handleRetake() {
    setResult(null);
    setScores({});
    setStep(0);
  }

  // ─── LOADING ──────────────────────────────────────────────────────────
  if (loading) {
    return <CosmicSkeleton rows={1} height="h-32" />;
  }

  // ─── RESULT STATE ──────────────────────────────────────────────────────────
  if (result) {
    const maxLoad = ENERGY_DIMENSIONS.length * 3;
    const pct = Math.round((result.totalLoad / maxLoad) * 100);
    const bandStyle = BAND_STYLES[result.loadBand] ?? BAND_STYLES.green;
    const rasInsight = RAS_INSIGHTS[result.loadBand] ?? '';

    return (
      <motion.div
        initial={shouldAnimate ? { opacity: 0, y: 12 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: shouldAnimate ? undefined : 0 }}
        className="space-y-4"
      >
        {/* Load summary */}
        <div
          className="glass-card p-5 space-y-3"
          style={{ borderColor: bandStyle.border, boxShadow: bandStyle.glow }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: result.guidance.color }}
              />
              <p className="text-sm font-semibold" style={{ color: result.guidance.color }}>
                {result.guidance.label}
              </p>
            </div>
            <p className="text-xs" style={{ color: 'var(--text-on-dark-muted)' }}>
              {result.totalLoad}/{maxLoad}
            </p>
          </div>

          {/* Load bar */}
          <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
            <motion.div
              initial={shouldAnimate ? { width: 0 } : false}
              animate={{ width: `${pct}%` }}
              transition={{ duration: shouldAnimate ? 0.8 : 0, ease: 'easeOut' }}
              className="h-full rounded-full"
              style={{ backgroundColor: result.guidance.color }}
            />
          </div>

          <p className="text-sm" style={{ color: 'var(--text-on-dark-secondary)' }}>
            {result.guidance.message}
          </p>

          {/* Action card */}
          <div className="glass-card p-3" style={{ borderColor: 'rgba(96, 5, 141, 0.2)' }}>
            <p className="text-xs font-medium uppercase tracking-widest mb-1"
              style={{ color: 'var(--brand-gold, #F8D011)' }}>
              This week&apos;s protocol
            </p>
            <p className="text-sm" style={{ color: 'var(--text-on-dark)' }}>
              {result.guidance.action}
            </p>
          </div>

          {/* RAS insight */}
          {rasInsight && (
            <div className="flex items-start gap-2 pt-1">
              <span className="text-sm">🧠</span>
              <p className="text-xs italic" style={{ color: 'var(--text-on-dark-muted)' }}>
                {rasInsight}
              </p>
            </div>
          )}
        </div>

        {/* Dimension breakdown */}
        <div className="glass-card p-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-widest"
              style={{ color: 'var(--brand-gold, #F8D011)' }}>
              Dimension Breakdown
            </p>
            <button
              type="button"
              onClick={handleRetake}
              className="text-xs underline"
              style={{ color: 'var(--text-on-dark-muted)' }}
            >
              Retake
            </button>
          </div>
          {ENERGY_DIMENSIONS.map((dim, i) => {
            const score = result.scores[dim.id] ?? 0;
            const width = score === 0 ? 2 : Math.round((score / 3) * 100);
            const barColor =
              score <= 1 ? '#22C55E' : score === 2 ? '#EAB308' : '#EF4444';
            return (
              <motion.div
                key={dim.id}
                initial={shouldAnimate ? { opacity: 0, x: -8 } : false}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: shouldAnimate ? i * 0.05 : 0, duration: shouldAnimate ? undefined : 0 }}
                className="flex items-center gap-3"
              >
                <p className="text-xs w-24 flex-shrink-0" style={{ color: 'var(--text-on-dark-secondary)' }}>
                  {dim.label}
                </p>
                <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                  <motion.div
                    initial={shouldAnimate ? { width: 0 } : false}
                    animate={{ width: `${width}%` }}
                    transition={{ duration: shouldAnimate ? 0.5 : 0, delay: shouldAnimate ? i * 0.05 : 0 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: barColor }}
                  />
                </div>
                <p className="text-xs w-4 text-right" style={{ color: 'var(--text-on-dark-muted)' }}>{score}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Contextual links */}
        <div className="flex justify-center gap-4 pt-1">
          <a href="/reps" className="text-xs underline" style={{ color: 'var(--text-on-dark-muted)' }}>
            Log a recovery rep →
          </a>
          <a href="/plan" className="text-xs underline" style={{ color: 'var(--text-on-dark-muted)' }}>
            Create an If/Then plan →
          </a>
        </div>
      </motion.div>
    );
  }

  // ─── QUESTION FLOW ─────────────────────────────────────────────────────────
  if (step >= 0 && step < ENERGY_DIMENSIONS.length) {
    const dim = ENERGY_DIMENSIONS[step];

    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={shouldAnimate ? { opacity: 0, x: 20 } : false}
          animate={{ opacity: 1, x: 0 }}
          exit={shouldAnimate ? { opacity: 0, x: -20 } : undefined}
          transition={{ duration: shouldAnimate ? 0.2 : 0 }}
          className="glass-card p-5 space-y-4"
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium" style={{ color: 'var(--text-on-dark-muted)' }}>
              {step + 1} of {ENERGY_DIMENSIONS.length}
            </p>
            <div className="flex gap-0.5">
              {ENERGY_DIMENSIONS.map((_, i) => (
                <div
                  key={i}
                  className="h-1 w-3 rounded-full transition-colors duration-200"
                  style={{
                    backgroundColor: i <= step ? '#60058D' : 'rgba(255,255,255,0.1)',
                  }}
                />
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-widest"
              style={{ color: 'var(--brand-gold, #F8D011)' }}>
              {dim.label}
            </p>
            <p className="text-base font-semibold mt-1" style={{ color: 'var(--text-on-dark)' }}>
              {dim.prompt}
            </p>
          </div>

          <div className="space-y-2">
            {dim.levels.map((level, levelIndex) => {
              const isSelected = scores[dim.id] === levelIndex;
              return (
                <button
                  key={levelIndex}
                  type="button"
                  onClick={() => handleSelect(dim.id, levelIndex)}
                  disabled={saving}
                  className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all duration-150 ${
                    isSelected ? 'shadow-[0_0_12px_rgba(96,5,141,0.3)]' : ''
                  }`}
                  style={{
                    background: isSelected ? 'rgba(96, 5, 141, 0.2)' : 'rgba(255,255,255,0.03)',
                    borderColor: isSelected ? '#60058D' : 'var(--surface-border)',
                    color: isSelected ? 'var(--text-on-dark)' : 'var(--text-on-dark-secondary)',
                  }}
                >
                  {level}
                </button>
              );
            })}
          </div>

          {step > 0 && (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="text-xs"
              style={{ color: 'var(--text-on-dark-muted)' }}
            >
              ← Back
            </button>
          )}

          {error && (
            <div className="rounded-lg px-4 py-3"
              style={{ background: 'rgba(220, 38, 38, 0.15)', border: '1px solid rgba(220, 38, 38, 0.3)' }}>
              <p className="text-xs" style={{ color: '#FCA5A5' }} role="alert">{humanizeError(error)}</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    );
  }

  // ─── INITIAL STATE ─────────────────────────────────────────────────────────
  return (
    <div className="glass-card p-5">
      <div className="flex items-start gap-3">
        <span className="text-2xl">⚡</span>
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <p className="font-semibold" style={{ color: 'var(--text-on-dark)' }}>Energy Audit</p>
            <span className="text-xs" style={{ color: 'var(--text-on-dark-muted)' }}>Weekly</span>
          </div>
          <p className="text-sm" style={{ color: 'var(--text-on-dark-secondary)' }}>
            8 dimensions of load. Track where your system is borrowing energy and what needs recovery.
            Your RAS can&apos;t rewire effectively when your load is too high.
          </p>
          <button
            type="button"
            onClick={() => setStep(0)}
            className="btn-primary text-sm py-2 px-5 mt-1"
          >
            Start audit
          </button>
        </div>
      </div>
    </div>
  );
}
