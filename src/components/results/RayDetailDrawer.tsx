'use client';

import { useEffect, useRef } from 'react';
import { getRayCosmicLabel, getRayExplanation } from '@/lib/cosmic-copy';
import type { RayOutput } from '@/lib/types';

interface RayDetailDrawerProps {
  ray: RayOutput | null;
  onClose: () => void;
}

const PHASE: Record<string, string> = {
  R1: 'Reconnect', R2: 'Reconnect', R3: 'Reconnect',
  R4: 'Radiate', R5: 'Radiate', R6: 'Radiate',
  R7: 'Become', R8: 'Become', R9: 'Become',
};

/**
 * Slide-up drawer (mobile) / side panel (desktop) showing
 * full ray details: subfacets, shine/eclipse bars, coaching reps.
 */
export default function RayDetailDrawer({ ray, onClose }: RayDetailDrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    if (!ray) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [ray, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (!ray) return;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [ray]);

  if (!ray) return null;

  const explanation = getRayExplanation(ray.ray_id);
  const cosmicLabel = getRayCosmicLabel(ray.ray_id);
  const phase = PHASE[ray.ray_id] ?? '';
  const subfacets = Object.values(ray.subfacets ?? {});

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50"
        style={{ background: 'rgba(2, 2, 2, 0.7)' }}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-label={`${ray.ray_name} details`}
        className="fixed z-50 overflow-y-auto
          bottom-0 left-0 right-0 max-h-[85vh] rounded-t-2xl
          md:bottom-auto md:top-0 md:left-auto md:right-0 md:w-[420px] md:h-full md:max-h-full md:rounded-t-none md:rounded-l-2xl"
        style={{
          background: 'linear-gradient(180deg, #2D1450 0%, #1A0A2E 100%)',
          borderTop: '1px solid rgba(148, 80, 200, 0.3)',
          borderLeft: '1px solid rgba(148, 80, 200, 0.3)',
        }}
      >
        {/* Drag handle (mobile) */}
        <div className="flex justify-center pt-3 md:hidden">
          <div className="h-1 w-10 rounded-full" style={{ background: 'rgba(255,255,255,0.2)' }} />
        </div>

        <div className="p-5 space-y-5">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#F8D011' }}>
                {phase} &middot; {ray.ray_id}
              </p>
              <h2 className="text-xl font-semibold mt-1" style={{ color: 'var(--text-on-dark)' }}>
                {ray.ray_name}
              </h2>
              {cosmicLabel && (
                <p className="text-xs mt-1" style={{ color: 'var(--text-on-dark-muted)' }}>{cosmicLabel}</p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg transition-colors"
              style={{ color: 'var(--text-on-dark-muted)' }}
              aria-label="Close"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="6" y1="6" x2="18" y2="18" />
                <line x1="18" y1="6" x2="6" y2="18" />
              </svg>
            </button>
          </div>

          {/* Score summary */}
          <div className="grid grid-cols-3 gap-3">
            <ScoreBlock label="Shine" value={ray.score} color="#F8D011" />
            <ScoreBlock label="Eclipse" value={ray.eclipse_score ?? 0} color="#FB923C" />
            <ScoreBlock label="Net Energy" value={ray.net_energy ?? ray.score} color="#A78BFA" />
          </div>

          {/* Definition */}
          {explanation && (
            <div className="glass-card p-4 space-y-2" style={{ borderColor: 'rgba(248, 208, 17, 0.15)' }}>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-on-dark)' }}>
                {explanation.definition}
              </p>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
                {explanation.science}
              </p>
            </div>
          )}

          {/* Subfacets */}
          {subfacets.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-on-dark-muted)' }}>
                Subfacets
              </p>
              {subfacets.map((sf) => (
                <div key={sf.subfacet_id} className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-sm" style={{ color: 'var(--text-on-dark)' }}>{sf.label}</span>
                    <span className="text-sm font-semibold" style={{ color: '#F8D011' }}>{sf.score}</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${sf.score}%`,
                        background: sf.score >= 70 ? '#F8D011' : sf.score >= 40 ? '#F59E0B' : '#FB923C',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Coaching reps */}
          {explanation && explanation.coachingReps.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-on-dark-muted)' }}>
                Coaching Reps
              </p>
              {explanation.coachingReps.map((rep, i) => (
                <div
                  key={i}
                  className="glass-card p-3 text-sm leading-relaxed"
                  style={{ color: 'var(--text-on-dark-secondary)', borderColor: 'rgba(96, 5, 141, 0.2)' }}
                >
                  {rep}
                </div>
              ))}
            </div>
          )}

          {/* When strong / eclipsed */}
          {explanation && (
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#F8D011' }}>
                  When Resourced
                </p>
                {explanation.whenStrong.map((item, i) => (
                  <p key={i} className="text-xs leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
                    {item}
                  </p>
                ))}
              </div>
              <div className="space-y-1.5">
                <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#FB923C' }}>
                  When Eclipsed
                </p>
                {explanation.whenEclipsed.map((item, i) => (
                  <p key={i} className="text-xs leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
                    {item}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Bottom padding for mobile safe area */}
          <div className="h-8 md:h-4" />
        </div>
      </div>
    </>
  );
}

function ScoreBlock({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="glass-card p-3 text-center space-y-0.5" style={{ borderColor: `${color}20` }}>
      <p className="text-lg font-bold" style={{ color }}>{Math.round(value)}</p>
      <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-on-dark-muted)' }}>
        {label}
      </p>
    </div>
  );
}
