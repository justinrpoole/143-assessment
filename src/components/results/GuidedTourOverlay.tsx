'use client';

import { useCallback, useEffect, useState } from 'react';

interface TourStep {
  sectionId: string;
  title: string;
  explanation: string;
}

const TOUR_STEPS: TourStep[] = [
  {
    sectionId: 'rpt-overview',
    title: 'Overall Stability',
    explanation: 'This is your system-wide score — a single number that captures your overall leadership capacity right now. Think of it as your operating temperature.',
  },
  {
    sectionId: 'rpt-light-signature',
    title: 'Light Signature',
    explanation: 'Your archetype and top two power-source rays. These are the capacities that come most naturally to you — your leadership identity.',
  },
  {
    sectionId: 'rpt-solar-core',
    title: 'Solar Core Score',
    explanation: 'All 9 rays mapped as a radial chart. Longer beams = stronger capacity. Click any ray to see subfacet details. The shadow arc shows your current eclipse load.',
  },
  {
    sectionId: 'rpt-eclipse',
    title: 'Eclipse Load',
    explanation: 'How much of your natural capacity is temporarily covered by stress, fatigue, or external pressure. This isn\'t permanent — it\'s what you\'re carrying right now.',
  },
  {
    sectionId: 'rpt-exec-signals',
    title: 'Executive Signals',
    explanation: '24 behavioral signals that translate your raw scores into real-world leadership behaviors. These tell you WHERE your scores show up in practice.',
  },
  {
    sectionId: 'rpt-rise-path',
    title: 'Rise Path',
    explanation: 'Your bottom ray — the capacity with the most room to grow. This isn\'t a flaw. It\'s your highest-impact training edge. One rep here moves everything.',
  },
  {
    sectionId: 'rpt-tools',
    title: 'Tool Readiness',
    explanation: 'The specific tools matched to your current state. These are ordered by impact — the first one is your most important move right now.',
  },
  {
    sectionId: 'rpt-30day',
    title: '30-Day Plan',
    explanation: 'Your personalized roadmap. Week 1 focuses on your bottom ray. Weeks 2-4 expand to build momentum across your system.',
  },
  {
    sectionId: 'rpt-coaching',
    title: 'Coaching Questions',
    explanation: 'These are designed to surface insights your scores can\'t capture. Write your reflections — they become part of your growth record.',
  },
];

const LS_KEY = '143_tour_completed';

export default function GuidedTourOverlay() {
  const [active, setActive] = useState(false);
  const [stepIdx, setStepIdx] = useState(0);
  const [showPrompt, setShowPrompt] = useState(false);

  // Check if tour has been completed before
  useEffect(() => {
    try {
      const completed = localStorage.getItem(LS_KEY);
      if (!completed) {
        // Show the tour prompt for first-time viewers after a brief delay
        const timer = setTimeout(() => setShowPrompt(true), 1500);
        return () => clearTimeout(timer);
      }
    } catch { /* localStorage unavailable */ }
  }, []);

  const startTour = useCallback(() => {
    setShowPrompt(false);
    setActive(true);
    setStepIdx(0);
    // Scroll to first step
    scrollToSection(TOUR_STEPS[0].sectionId);
  }, []);

  const dismissTour = useCallback(() => {
    setShowPrompt(false);
    setActive(false);
    try { localStorage.setItem(LS_KEY, 'true'); } catch { /* silent */ }
  }, []);

  const goNext = useCallback(() => {
    const next = stepIdx + 1;
    if (next >= TOUR_STEPS.length) {
      // Tour complete
      setActive(false);
      try { localStorage.setItem(LS_KEY, 'true'); } catch { /* silent */ }
      return;
    }
    setStepIdx(next);
    scrollToSection(TOUR_STEPS[next].sectionId);
  }, [stepIdx]);

  const goPrev = useCallback(() => {
    const prev = Math.max(stepIdx - 1, 0);
    setStepIdx(prev);
    scrollToSection(TOUR_STEPS[prev].sectionId);
  }, [stepIdx]);

  // Tour prompt — appears for first-time viewers
  if (showPrompt && !active) {
    return (
      <div
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-sm w-[calc(100%-2rem)] rounded-xl px-5 py-4"
        style={{
          background: 'var(--overlay-heavy)',
          border: '1px solid var(--surface-border)',
          boxShadow: 'var(--shadow-depth), var(--shadow-glow-gold)',
          backdropFilter: 'blur(16px)',
          animation: 'tourSlideUp 400ms ease-out',
        }}
      >
        <p className="text-sm font-semibold" style={{ color: 'var(--brand-gold)' }}>
          First time viewing your report?
        </p>
        <p className="text-xs mt-1" style={{ color: 'var(--text-on-dark-secondary)' }}>
          Take a 60-second guided tour. Each section builds on the last.
        </p>
        <div className="flex gap-2 mt-3">
          <button
            onClick={startTour}
            className="text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
            style={{
              background: 'var(--brand-gold)',
              color: '#020202',
            }}
          >
            Start Tour
          </button>
          <button
            onClick={dismissTour}
            className="text-xs font-medium px-4 py-2 rounded-lg transition-colors"
            style={{
              background: 'rgba(148, 80, 200, 0.2)',
              color: 'var(--text-on-dark-secondary)',
            }}
          >
            Skip
          </button>
        </div>
        <style>{`
          @keyframes tourSlideUp {
            from { opacity: 0; transform: translate(-50%, 16px); }
            to { opacity: 1; transform: translate(-50%, 0); }
          }
        `}</style>
      </div>
    );
  }

  // Active tour overlay
  if (!active) return null;

  const step = TOUR_STEPS[stepIdx];
  const isLast = stepIdx >= TOUR_STEPS.length - 1;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50" style={{ pointerEvents: 'none' }}>
      {/* Tour card — fixed to bottom */}
      <div
        className="mx-auto max-w-lg w-[calc(100%-1.5rem)] mb-4 rounded-xl px-5 py-4"
        style={{
          pointerEvents: 'auto',
          background: 'var(--overlay-heavy)',
          border: '1px solid var(--surface-border)',
          boxShadow: 'var(--shadow-depth), var(--shadow-glow-gold)',
          backdropFilter: 'blur(16px)',
        }}
      >
        {/* Step counter */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            {TOUR_STEPS.map((_, i) => (
              <div
                key={i}
                className="h-1.5 rounded-full transition-all"
                style={{
                  width: i === stepIdx ? '16px' : '6px',
                  background: i <= stepIdx ? 'var(--brand-gold)' : 'rgba(148, 80, 200, 0.3)',
                }}
              />
            ))}
          </div>
          <span className="text-[10px]" style={{ color: 'var(--text-on-dark-muted)' }}>
            {stepIdx + 1}/{TOUR_STEPS.length}
          </span>
        </div>

        {/* Content */}
        <p className="text-sm font-semibold" style={{ color: 'var(--brand-gold)' }}>
          {step.title}
        </p>
        <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
          {step.explanation}
        </p>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-3">
          <button
            onClick={goPrev}
            disabled={stepIdx === 0}
            className="text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
            style={{
              background: 'rgba(96, 5, 141, 0.2)',
              color: stepIdx === 0 ? 'var(--text-on-dark-muted)' : 'var(--text-on-dark-secondary)',
              opacity: stepIdx === 0 ? 0.4 : 1,
            }}
          >
            &larr; Back
          </button>
          <button
            onClick={dismissTour}
            className="text-[10px]"
            style={{ color: 'var(--text-on-dark-muted)' }}
          >
            End tour
          </button>
          <button
            onClick={goNext}
            className="text-xs font-semibold px-4 py-1.5 rounded-lg transition-colors"
            style={{
              background: isLast ? 'var(--brand-gold)' : 'rgba(248, 208, 17, 0.15)',
              color: isLast ? '#020202' : 'var(--brand-gold)',
              border: `1px solid ${isLast ? 'var(--brand-gold)' : 'rgba(248, 208, 17, 0.3)'}`,
            }}
          >
            {isLast ? 'Finish' : 'Next \u2192'}
          </button>
        </div>
      </div>
    </div>
  );
}

function scrollToSection(sectionId: string) {
  // Small delay to let any animation complete
  setTimeout(() => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, 100);
}
