'use client';

import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import dynamic from 'next/dynamic';

import archetypeData from '@/data/archetype_public.json';
import type { ArchetypePublic } from '@/lib/types';
import ConstellationDot from './ConstellationDot';

const ArchetypeShareCard = dynamic(() => import('./ArchetypeShareCard'), {
  ssr: false,
});

const allArchetypes = archetypeData as ArchetypePublic[];

const ALL_RAY_NAMES = [
  'Intention',
  'Joy',
  'Presence',
  'Power',
  'Purpose',
  'Authenticity',
  'Connection',
  'Possibility',
  'Be The Light',
];

/* Internal mapping — R-codes exist in JS memory only, never rendered */
const PAIR_TO_INDEX: Record<string, number> = {
  'R1-R2': 1, 'R1-R3': 2, 'R1-R4': 3, 'R1-R5': 4, 'R1-R6': 5,
  'R1-R7': 6, 'R1-R8': 7, 'R1-R9': 8,
  'R2-R3': 9, 'R2-R4': 10, 'R2-R5': 11, 'R2-R6': 12,
  'R2-R7': 13, 'R2-R8': 14, 'R2-R9': 15,
  'R3-R4': 16, 'R3-R5': 17, 'R3-R6': 18, 'R3-R7': 19,
  'R3-R8': 20, 'R3-R9': 21,
  'R4-R5': 22, 'R4-R6': 23, 'R4-R7': 24, 'R4-R8': 25, 'R4-R9': 26,
  'R5-R6': 27, 'R5-R7': 28, 'R5-R8': 29, 'R5-R9': 30,
  'R6-R7': 31, 'R6-R8': 32, 'R6-R9': 33,
  'R7-R8': 34, 'R7-R9': 35,
  'R8-R9': 36,
};

const MAX_RESONANCES = 3;
const LS_KEY = '143-resonances';

function loadResonances(): number[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(LS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveResonances(indices: number[]) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(indices));
  } catch {
    /* noop */
  }
}

/* ═══════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════ */

export default function ArchetypeLibraryClient() {
  const prefersReduced = useReducedMotion();
  const [filterRay, setFilterRay] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [userArchetypeIndex, setUserArchetypeIndex] = useState<number | null>(
    null,
  );
  const [resonances, setResonances] = useState<number[]>([]);
  const [shareArchetype, setShareArchetype] = useState<ArchetypePublic | null>(
    null,
  );
  const [swipeMode, setSwipeMode] = useState(false);
  const swipeRef = useRef<HTMLDivElement>(null);

  // Load resonances from localStorage
  useEffect(() => {
    setResonances(loadResonances());
  }, []);

  // Check URL hash for direct link
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.startsWith('#sig-')) {
      const idx = parseInt(hash.replace('#sig-', ''), 10);
      if (idx >= 1 && idx <= 36) {
        setExpandedIndex(idx);
        setTimeout(() => {
          document
            .getElementById(`archetype-${idx}`)
            ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
      }
    }
  }, []);

  // Sync URL hash to expanded state (deferred to avoid Router conflict)
  useEffect(() => {
    requestAnimationFrame(() => {
      if (expandedIndex) {
        window.history.replaceState(null, '', `#sig-${expandedIndex}`);
      } else if (window.location.hash) {
        window.history.replaceState(null, '', window.location.pathname);
      }
    });
  }, [expandedIndex]);

  // Fetch user archetype for gold highlight
  useEffect(() => {
    fetch('/api/portal/summary')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.ray_pair_id) {
          const idx = PAIR_TO_INDEX[data.ray_pair_id as string];
          if (idx) setUserArchetypeIndex(idx);
        }
      })
      .catch(() => {
        /* unauthenticated */
      });
  }, []);

  const filtered = useMemo(() => {
    let result = allArchetypes;
    if (filterRay) {
      result = result.filter((a) => a.rays.includes(filterRay));
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.tagline.toLowerCase().includes(q) ||
          a.vibe.toLowerCase().includes(q) ||
          a.rays.some((r) => r.toLowerCase().includes(q)),
      );
    }
    return result;
  }, [filterRay, search]);

  const toggleExpand = useCallback((index: number) => {
    setExpandedIndex((prev) => (prev === index ? null : index));
  }, []);

  const toggleResonance = useCallback((index: number) => {
    setResonances((prev) => {
      let next: number[];
      if (prev.includes(index)) {
        next = prev.filter((i) => i !== index);
      } else if (prev.length < MAX_RESONANCES) {
        next = [...prev, index];
      } else {
        return prev;
      }
      saveResonances(next);
      return next;
    });
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <p
          className="text-xs uppercase tracking-[0.25em] font-semibold"
          style={{ color: 'var(--brand-gold)' }}
        >
          36 Light Signatures
        </p>
        <h2
          className="text-3xl sm:text-4xl font-bold"
          style={{
            fontFamily: 'var(--font-display)',
            color: 'var(--text-on-dark)',
          }}
        >
          The Signal Library
        </h2>
        <p
          className="text-sm max-w-xl mx-auto leading-relaxed"
          style={{ color: 'var(--text-on-dark-secondary)' }}
        >
          Every leader has a Light Signature — the unique combination of their
          two strongest signals. Browse all 36 below. One of them is going to
          feel uncomfortably accurate.
        </p>
      </div>

      {/* Filters */}
      <div className="space-y-3">
        <div className="max-w-sm mx-auto">
          <input
            type="text"
            placeholder="Search by name or signal..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search Light Signatures"
            className="w-full rounded-xl px-4 py-2.5 text-sm outline-none transition-colors"
            style={{
              background: 'var(--surface-glass)',
              border: '1px solid var(--surface-border)',
              color: 'var(--text-on-dark)',
            }}
          />
        </div>

        {/* Ray filter chips */}
        <div className="flex flex-wrap justify-center gap-2">
          <button
            type="button"
            onClick={() => setFilterRay(null)}
            className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
            style={{
              background:
                filterRay === null ? 'var(--brand-gold)' : 'var(--surface-glass)',
              color:
                filterRay === null
                  ? 'var(--brand-black)'
                  : 'var(--text-on-dark-secondary)',
              border:
                '1px solid ' +
                (filterRay === null
                  ? 'var(--brand-gold)'
                  : 'var(--surface-border)'),
            }}
          >
            All
          </button>
          {ALL_RAY_NAMES.map((name) => (
            <button
              key={name}
              type="button"
              onClick={() =>
                setFilterRay(filterRay === name ? null : name)
              }
              className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
              style={{
                background:
                  filterRay === name
                    ? 'var(--brand-gold)'
                    : 'var(--surface-glass)',
                color:
                  filterRay === name
                    ? 'var(--brand-black)'
                    : 'var(--text-on-dark-secondary)',
                border:
                  '1px solid ' +
                  (filterRay === name
                    ? 'var(--brand-gold)'
                    : 'var(--surface-border)'),
              }}
            >
              {name}
            </button>
          ))}
        </div>

        {/* Mobile swipe toggle */}
        <div className="flex justify-center sm:hidden">
          <button
            type="button"
            onClick={() => setSwipeMode(!swipeMode)}
            className="text-[10px] uppercase tracking-wider font-medium px-3 py-1"
            style={{ color: 'var(--text-on-dark-muted)' }}
          >
            {swipeMode ? 'Grid view' : 'Swipe mode'}
          </button>
        </div>
      </div>

      {/* Count + resonance */}
      <div className="flex items-center justify-center gap-4">
        <p
          className="text-xs"
          style={{ color: 'var(--text-on-dark-muted)' }}
        >
          {filtered.length} of 36 signatures
        </p>
        {resonances.length > 0 && (
          <p className="text-xs" style={{ color: 'var(--brand-gold)' }}>
            {resonances.length}/{MAX_RESONANCES} resonating
          </p>
        )}
      </div>

      {/* ─── SWIPE MODE (mobile horizontal scroll) ─── */}
      {swipeMode ? (
        <div
          ref={swipeRef}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 -mx-5 px-5"
          style={{
            scrollbarWidth: 'none',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; }`}</style>
          {filtered.map((a) => (
            <div
              key={a.index}
              className="snap-center flex-shrink-0 w-[85vw] max-w-[340px]"
            >
              <ArchetypeCard
                archetype={a}
                isOwn={userArchetypeIndex === a.index}
                isExpanded={expandedIndex === a.index}
                isResonating={resonances.includes(a.index)}
                canResonate={resonances.length < MAX_RESONANCES}
                onToggle={() => toggleExpand(a.index)}
                onResonance={() => toggleResonance(a.index)}
                onShare={() => setShareArchetype(a)}
                prefersReduced={!!prefersReduced}
              />
            </div>
          ))}
        </div>
      ) : (
        /* ─── GRID MODE ─── */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((a) => (
            <ArchetypeCard
              key={a.index}
              archetype={a}
              isOwn={userArchetypeIndex === a.index}
              isExpanded={expandedIndex === a.index}
              isResonating={resonances.includes(a.index)}
              canResonate={resonances.length < MAX_RESONANCES}
              onToggle={() => toggleExpand(a.index)}
              onResonance={() => toggleResonance(a.index)}
              onShare={() => setShareArchetype(a)}
              prefersReduced={!!prefersReduced}
            />
          ))}
        </div>
      )}

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="text-center py-12 space-y-2">
          <p
            className="text-sm"
            style={{ color: 'var(--text-on-dark-secondary)' }}
          >
            No signatures match your search.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearch('');
              setFilterRay(null);
            }}
            className="text-xs font-medium"
            style={{ color: 'var(--brand-gold)' }}
          >
            Clear filters
          </button>
        </div>
      )}

      {/* CTA */}
      <div className="text-center space-y-3 pt-4">
        <p
          className="text-sm"
          style={{ color: 'var(--text-on-dark-secondary)' }}
        >
          Which one made you stop scrolling? The full assessment maps all 9
          signals to reveal yours.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/quiz"
            className="inline-block rounded-xl px-5 py-2.5 text-sm font-semibold transition-all hover:brightness-110 no-underline"
            style={{
              background: 'var(--surface-glass)',
              border: '1px solid var(--surface-border)',
              color: 'var(--text-on-dark)',
            }}
          >
            Find My Signal (60 sec)
          </Link>
          <Link
            href="/upgrade-your-os"
            className="inline-block rounded-xl px-5 py-2.5 text-sm font-bold transition-all hover:brightness-110 no-underline"
            style={{
              background: 'var(--brand-gold)',
              color: 'var(--brand-black)',
            }}
          >
            Map My Full Light Signature
          </Link>
        </div>
      </div>

      {/* Share modal */}
      {shareArchetype && (
        <ArchetypeShareCard
          archetype={shareArchetype}
          onClose={() => setShareArchetype(null)}
        />
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   ARCHETYPE CARD (collapsed + expandable)
   ═══════════════════════════════════════════ */

function ArchetypeCard({
  archetype,
  isOwn,
  isExpanded,
  isResonating,
  canResonate,
  onToggle,
  onResonance,
  onShare,
  prefersReduced,
}: {
  archetype: ArchetypePublic;
  isOwn: boolean;
  isExpanded: boolean;
  isResonating: boolean;
  canResonate: boolean;
  onToggle: () => void;
  onResonance: () => void;
  onShare: () => void;
  prefersReduced: boolean;
}) {
  const a = archetype;
  const borderHighlight = isOwn
    ? '2px solid var(--brand-gold)'
    : isResonating
      ? `2px solid ${a.neon_color}60`
      : '1px solid var(--surface-border)';
  const shadowHighlight = isOwn
    ? '0 0 20px rgba(248, 208, 17, 0.12)'
    : isResonating
      ? `0 0 20px ${a.neon_color}15`
      : 'none';

  return (
    <div id={`archetype-${a.index}`}>
      {/* Collapsed card */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full text-left rounded-2xl p-5 transition-all group relative overflow-hidden"
        style={{
          background: 'var(--surface-glass)',
          border: borderHighlight,
          boxShadow: shadowHighlight,
        }}
        onMouseEnter={(e) => {
          if (!isOwn && !isResonating) {
            const el = e.currentTarget;
            el.style.boxShadow = `0 0 24px ${a.neon_color}18`;
            el.style.borderColor = `${a.neon_color}40`;
          }
        }}
        onMouseLeave={(e) => {
          if (!isOwn && !isResonating) {
            const el = e.currentTarget;
            el.style.boxShadow = 'none';
            el.style.borderColor = 'rgba(148, 80, 200, 0.30)';
          }
        }}
      >
        {isOwn && (
          <p
            className="text-[10px] uppercase tracking-[0.2em] font-bold mb-2"
            style={{ color: 'var(--brand-gold)' }}
          >
            &#9733; Your Light Signature
          </p>
        )}

        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3
              className="text-base font-bold mb-1 transition-all"
              style={{ color: 'var(--text-on-dark)' }}
            >
              {a.name}
            </h3>
            <p
              className="text-xs leading-relaxed mb-2"
              style={{ color: 'var(--text-on-dark-secondary)' }}
            >
              {a.tagline}
            </p>
            <span
              className="inline-block text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-[0.15em]"
              style={{
                background: `${a.neon_color}12`,
                color: a.neon_color,
                border: `1px solid ${a.neon_color}25`,
              }}
            >
              {a.identity_code}
            </span>
          </div>
          <ConstellationDot
            index={a.index}
            neonColor={a.neon_color}
            size={40}
          />
        </div>

        <p
          className="text-[10px] mt-3 font-medium uppercase tracking-wider opacity-40 group-hover:opacity-80 transition-opacity"
          style={{ color: 'var(--text-on-dark-muted)' }}
        >
          {isExpanded ? '\u25B4 Collapse' : '\u25BE Read more'}
        </p>
      </button>

      {/* Expanded detail */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            key={`detail-${a.index}`}
            initial={
              prefersReduced ? { opacity: 1 } : { opacity: 0, height: 0 }
            }
            animate={{ opacity: 1, height: 'auto' }}
            exit={
              prefersReduced ? { opacity: 0 } : { opacity: 0, height: 0 }
            }
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <ArchetypeDetail
              archetype={a}
              isResonating={isResonating}
              canResonate={canResonate}
              onResonance={onResonance}
              onShare={onShare}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════
   EXPANDED DETAIL
   ═══════════════════════════════════════════ */

function ArchetypeDetail({
  archetype,
  isResonating,
  canResonate,
  onResonance,
  onShare,
}: {
  archetype: ArchetypePublic;
  isResonating: boolean;
  canResonate: boolean;
  onResonance: () => void;
  onShare: () => void;
}) {
  const a = archetype;

  return (
    <div
      className="rounded-b-2xl p-5 space-y-5 -mt-2"
      style={{
        background: 'var(--surface-glass)',
        borderTop: '1px solid var(--surface-border)',
      }}
    >
      {/* Vibe */}
      <p
        className="text-sm italic leading-relaxed"
        style={{ color: 'var(--text-on-dark-secondary)' }}
      >
        {a.vibe}
      </p>

      {/* People Say */}
      <div
        className="rounded-xl p-3"
        style={{
          background: `${a.neon_color}08`,
          border: `1px solid ${a.neon_color}15`,
        }}
      >
        <p
          className="text-[10px] uppercase tracking-wider font-bold mb-1"
          style={{ color: 'var(--text-on-dark-muted)' }}
        >
          What People Say
        </p>
        <p
          className="text-sm italic leading-relaxed"
          style={{ color: 'var(--text-on-dark)' }}
        >
          &ldquo;{a.people_say}&rdquo;
        </p>
      </div>

      {/* The Question */}
      <div className="text-center py-2">
        <p
          className="text-[10px] uppercase tracking-wider font-bold mb-2"
          style={{ color: a.neon_color }}
        >
          The Question You Keep Asking
        </p>
        <p
          className="text-base font-semibold"
          style={{ color: 'var(--text-on-dark)' }}
        >
          {a.the_question}
        </p>
      </div>

      {/* You Might Be This If */}
      <div>
        <p
          className="text-[10px] uppercase tracking-wider font-bold mb-2"
          style={{ color: a.neon_color }}
        >
          You Might Be This If...
        </p>
        <ul className="space-y-1.5">
          {a.you_might_be_this_if.map((item, i) => (
            <li
              key={i}
              className="flex items-start gap-2 text-xs leading-relaxed"
              style={{ color: 'var(--text-on-dark-secondary)' }}
            >
              <span
                className="mt-0.5 flex-shrink-0"
                style={{ color: a.neon_color }}
              >
                &#9656;
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* At Your Best */}
      <div>
        <p
          className="text-[10px] uppercase tracking-wider font-bold mb-1.5"
          style={{ color: a.neon_color }}
        >
          At Your Best
        </p>
        <p
          className="text-xs leading-relaxed"
          style={{ color: 'var(--text-on-dark-secondary)' }}
        >
          {a.at_your_best}
        </p>
      </div>

      {/* What You're Afraid Of */}
      <div className="py-2 text-center">
        <p
          className="text-[10px] uppercase tracking-wider font-bold mb-2"
          style={{ color: 'var(--text-on-dark-muted)' }}
        >
          What You&apos;re Afraid Of
        </p>
        <p
          className="text-sm font-medium leading-relaxed"
          style={{ color: 'var(--text-on-dark)' }}
        >
          {a.what_youre_afraid_of}
        </p>
      </div>

      {/* When Your Signal Goes Dark */}
      <div
        className="rounded-xl p-4"
        style={{
          background: 'rgba(0, 0, 0, 0.25)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
        }}
      >
        <p
          className="text-[10px] uppercase tracking-wider font-bold mb-1.5"
          style={{ color: 'var(--text-on-dark-muted)' }}
        >
          When Your Signal Goes Dark
        </p>
        <p
          className="text-xs leading-relaxed"
          style={{ color: 'var(--text-on-dark-secondary)' }}
        >
          {a.when_your_signal_goes_dark}
        </p>
      </div>

      {/* In the Wild */}
      <div>
        <p
          className="text-[10px] uppercase tracking-wider font-bold mb-1"
          style={{ color: 'var(--text-on-dark-muted)' }}
        >
          In the Wild
        </p>
        <p
          className="text-xs italic leading-relaxed"
          style={{ color: 'var(--text-on-dark-secondary)' }}
        >
          {a.in_the_wild}
        </p>
      </div>

      {/* Counter Signal */}
      <div
        className="rounded-xl p-3"
        style={{
          background: 'rgba(148, 80, 200, 0.10)',
          border: '1px solid rgba(148, 80, 200, 0.20)',
        }}
      >
        <p
          className="text-[10px] uppercase tracking-wider font-bold mb-1"
          style={{ color: 'var(--cosmic-purple-light)' }}
        >
          Your Counter Signal
        </p>
        <p
          className="text-xs leading-relaxed"
          style={{ color: 'var(--text-on-dark-secondary)' }}
        >
          {a.your_counter_signal}
        </p>
      </div>

      {/* THE LINE — pull quote */}
      <div className="py-3 text-center">
        <p
          className="text-lg font-bold leading-snug"
          style={{
            color: a.neon_color,
            textShadow: `0 0 20px ${a.neon_color}25`,
          }}
        >
          &ldquo;{a.the_line}&rdquo;
        </p>
      </div>

      {/* First Rep */}
      <div
        className="rounded-xl p-4"
        style={{
          background: 'rgba(248, 208, 17, 0.06)',
          border: '1px solid rgba(248, 208, 17, 0.15)',
        }}
      >
        <p
          className="text-[10px] uppercase tracking-wider font-bold mb-1.5"
          style={{ color: 'var(--brand-gold)' }}
        >
          Your First Rep
        </p>
        <p
          className="text-xs leading-relaxed"
          style={{ color: 'var(--text-on-dark)' }}
        >
          {a.first_rep}
        </p>
      </div>

      {/* Pop culture + Soundtrack */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <p
            className="text-[10px] uppercase tracking-wider font-bold mb-1"
            style={{ color: 'var(--text-on-dark-muted)' }}
          >
            Famous Signal
          </p>
          <p
            className="text-xs leading-relaxed"
            style={{ color: 'var(--text-on-dark-secondary)' }}
          >
            {a.famous_signal}
          </p>
        </div>
        <div>
          <p
            className="text-[10px] uppercase tracking-wider font-bold mb-1"
            style={{ color: 'var(--text-on-dark-muted)' }}
          >
            Soundtrack
          </p>
          <p
            className="text-xs leading-relaxed"
            style={{ color: 'var(--text-on-dark-secondary)' }}
          >
            {a.soundtrack}
          </p>
        </div>
      </div>

      {/* Ray tags */}
      <div className="flex items-center justify-center gap-2 pt-1">
        {a.rays.map((ray) => (
          <span
            key={ray}
            className="text-[10px] px-2.5 py-0.5 rounded-full font-medium"
            style={{
              background: `${a.neon_color}12`,
              color: a.neon_color,
              border: `1px solid ${a.neon_color}25`,
            }}
          >
            {ray}
          </span>
        ))}
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 pt-2">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onResonance();
          }}
          disabled={!isResonating && !canResonate}
          className="flex-1 py-2.5 rounded-xl text-xs font-medium transition-all disabled:opacity-30"
          style={{
            background: isResonating
              ? `${a.neon_color}20`
              : 'var(--surface-glass)',
            border: isResonating
              ? `1px solid ${a.neon_color}40`
              : '1px solid var(--surface-border)',
            color: isResonating ? a.neon_color : 'var(--text-on-dark-secondary)',
          }}
        >
          {isResonating ? 'This One Resonates' : 'This One Resonates'}
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onShare();
          }}
          className="px-4 py-2.5 rounded-xl text-xs font-medium transition-all"
          style={{
            background: 'var(--surface-glass)',
            border: '1px solid var(--surface-border)',
            color: 'var(--text-on-dark-secondary)',
          }}
        >
          Share
        </button>
      </div>

      {/* CTA */}
      <div className="pt-1 text-center">
        <Link
          href="/upgrade-your-os"
          className="text-xs font-medium transition-colors hover:brightness-110 no-underline"
          style={{ color: 'var(--brand-gold)' }}
        >
          Take the full assessment to see if this is your signature &rarr;
        </Link>
      </div>
    </div>
  );
}
