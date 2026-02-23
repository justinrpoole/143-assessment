'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import Link from 'next/link';

import archetypeBlocks from '@/data/archetype_blocks.json';
import { RAY_SHORT_NAMES, RAY_VERBS } from '@/lib/types';
import type { ArchetypeBlock } from '@/lib/types';

const allBlocks = archetypeBlocks as ArchetypeBlock[];

const RAY_IDS = ['R1', 'R2', 'R3', 'R4', 'R5', 'R6', 'R7', 'R8', 'R9'];

/** Extract first paragraph from markdown-ish essence field */
function firstParagraph(text: string): string {
  const stripped = text.replace(/\*\*/g, '');
  const paragraphs = stripped.split(/\n\n+/);
  const first = paragraphs[0]?.trim() ?? '';
  return first.length > 200 ? first.slice(0, 197) + '...' : first;
}

export default function ArchetypeLibraryClient() {
  const prefersReduced = useReducedMotion();
  const [filterRay, setFilterRay] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [userPairCode, setUserPairCode] = useState<string | null>(null);

  // Try to load the user's own archetype from their latest assessment
  useEffect(() => {
    fetch('/api/portal/summary')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.ray_pair_id) {
          setUserPairCode(data.ray_pair_id as string);
        }
      })
      .catch(() => { /* unauthenticated — fine */ });
  }, []);

  const filtered = useMemo(() => {
    let result = allBlocks;
    if (filterRay) {
      result = result.filter((b) => b.ray_a === filterRay || b.ray_b === filterRay);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.essence.toLowerCase().includes(q) ||
          (RAY_SHORT_NAMES[b.ray_a] ?? '').toLowerCase().includes(q) ||
          (RAY_SHORT_NAMES[b.ray_b] ?? '').toLowerCase().includes(q),
      );
    }
    return result;
  }, [filterRay, search]);

  const toggleExpand = useCallback((index: number) => {
    setExpandedIndex((prev) => (prev === index ? null : index));
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
        <h1
          className="text-3xl sm:text-4xl font-bold"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--text-on-dark)' }}
        >
          The Archetype Library
        </h1>
        <p
          className="text-sm max-w-xl mx-auto leading-relaxed"
          style={{ color: 'var(--text-on-dark-secondary)' }}
        >
          Every leader has a Light Signature — the unique combination of their two strongest rays.
          Browse all 36 archetypes below. Your combination creates strengths, patterns,
          and growth edges that no single ray can explain.
        </p>
      </div>

      {/* Filters */}
      <div className="space-y-3">
        {/* Search */}
        <div className="max-w-sm mx-auto">
          <input
            type="text"
            placeholder="Search by name or ray..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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
              background: filterRay === null ? 'var(--brand-gold)' : 'var(--surface-glass)',
              color: filterRay === null ? 'var(--brand-black)' : 'var(--text-on-dark-secondary)',
              border: '1px solid ' + (filterRay === null ? 'var(--brand-gold)' : 'var(--surface-border)'),
            }}
          >
            All
          </button>
          {RAY_IDS.map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => setFilterRay(filterRay === id ? null : id)}
              className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
              style={{
                background: filterRay === id ? 'var(--brand-gold)' : 'var(--surface-glass)',
                color: filterRay === id ? 'var(--brand-black)' : 'var(--text-on-dark-secondary)',
                border: '1px solid ' + (filterRay === id ? 'var(--brand-gold)' : 'var(--surface-border)'),
              }}
            >
              {RAY_SHORT_NAMES[id]}
            </button>
          ))}
        </div>
      </div>

      {/* Count */}
      <p className="text-center text-xs" style={{ color: 'var(--text-on-dark-muted)' }}>
        {filtered.length} of 36 signatures
      </p>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((block) => {
          const isOwn = userPairCode === block.pair_code;
          const isExpanded = expandedIndex === block.index;

          return (
            <div key={block.index}>
              {/* Card */}
              <button
                type="button"
                onClick={() => toggleExpand(block.index)}
                className="w-full text-left rounded-2xl p-5 transition-all group"
                style={{
                  background: 'var(--surface-glass)',
                  border: isOwn
                    ? '2px solid var(--brand-gold)'
                    : '1px solid var(--surface-border)',
                  boxShadow: isOwn ? '0 0 20px rgba(248, 208, 17, 0.12)' : 'none',
                }}
              >
                {/* Own badge */}
                {isOwn && (
                  <p
                    className="text-[10px] uppercase tracking-[0.2em] font-bold mb-2"
                    style={{ color: 'var(--brand-gold)' }}
                  >
                    &#9733; Your Light Signature
                  </p>
                )}

                {/* Name */}
                <h3
                  className="text-base font-bold mb-1 group-hover:brightness-110 transition-all"
                  style={{ color: 'var(--text-on-dark)' }}
                >
                  {block.name}
                </h3>

                {/* Ray tags */}
                <div className="flex gap-2 mb-3">
                  <span
                    className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                    style={{
                      background: 'rgba(248, 208, 17, 0.1)',
                      color: 'var(--brand-gold)',
                    }}
                  >
                    {RAY_SHORT_NAMES[block.ray_a]} — {RAY_VERBS[block.ray_a]}
                  </span>
                  <span
                    className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                    style={{
                      background: 'rgba(148, 80, 200, 0.15)',
                      color: 'var(--cosmic-purple-light)',
                    }}
                  >
                    {RAY_SHORT_NAMES[block.ray_b]} — {RAY_VERBS[block.ray_b]}
                  </span>
                </div>

                {/* Essence preview */}
                <p
                  className="text-xs leading-relaxed"
                  style={{ color: 'var(--text-on-dark-secondary)' }}
                >
                  {firstParagraph(block.essence)}
                </p>

                {/* Expand hint */}
                <p
                  className="text-[10px] mt-3 font-medium uppercase tracking-wider opacity-50 group-hover:opacity-100 transition-opacity"
                  style={{ color: 'var(--text-on-dark-muted)' }}
                >
                  {isExpanded ? 'Collapse' : 'Read more'}
                </p>
              </button>

              {/* Expanded detail */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    key={`detail-${block.index}`}
                    initial={prefersReduced ? { opacity: 1 } : { opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={prefersReduced ? { opacity: 0 } : { opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="overflow-hidden"
                  >
                    <ArchetypeDetail block={block} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="text-center py-12 space-y-2">
          <p className="text-sm" style={{ color: 'var(--text-on-dark-secondary)' }}>
            No signatures match your search.
          </p>
          <button
            type="button"
            onClick={() => { setSearch(''); setFilterRay(null); }}
            className="text-xs font-medium"
            style={{ color: 'var(--brand-gold)' }}
          >
            Clear filters
          </button>
        </div>
      )}

      {/* CTA */}
      <div className="text-center space-y-3 pt-4">
        <p className="text-sm" style={{ color: 'var(--text-on-dark-secondary)' }}>
          Which one are you? The full 143 Assessment maps all 9 rays to reveal your Light Signature.
        </p>
        <div className="flex justify-center gap-3">
          <Link
            href="/quiz"
            className="inline-block rounded-xl px-5 py-2.5 text-sm font-semibold transition-all hover:brightness-110"
            style={{
              background: 'var(--surface-glass)',
              border: '1px solid var(--surface-border)',
              color: 'var(--text-on-dark)',
            }}
          >
            Take the Quick Quiz
          </Link>
          <Link
            href="/upgrade-your-os"
            className="inline-block rounded-xl px-5 py-2.5 text-sm font-bold transition-all hover:brightness-110"
            style={{ background: 'var(--brand-gold)', color: 'var(--brand-black)' }}
          >
            Full Assessment
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ─── Detail Expansion ─── */

function ArchetypeDetail({ block }: { block: ArchetypeBlock }) {
  return (
    <div
      className="rounded-b-2xl p-5 space-y-4 -mt-2"
      style={{
        background: 'var(--surface-glass)',
        borderTop: '1px solid var(--surface-border)',
      }}
    >
      {/* Strengths */}
      {block.strengths && (
        <div>
          <p
            className="text-xs uppercase tracking-wider font-bold mb-1.5"
            style={{ color: 'var(--brand-gold)' }}
          >
            What This Combination Creates
          </p>
          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
            {block.strengths}
          </p>
        </div>
      )}

      {/* Work + Life Expressions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {block.work_expression && (
          <div>
            <p
              className="text-[10px] uppercase tracking-wider font-bold mb-1"
              style={{ color: 'var(--brand-gold)' }}
            >
              At Work
            </p>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
              {block.work_expression}
            </p>
          </div>
        )}
        {block.life_expression && (
          <div>
            <p
              className="text-[10px] uppercase tracking-wider font-bold mb-1"
              style={{ color: 'var(--brand-gold)' }}
            >
              In Life
            </p>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
              {block.life_expression}
            </p>
          </div>
        )}
      </div>

      {/* Stress Distortion */}
      {block.stress_distortion && (
        <div
          className="rounded-xl p-3"
          style={{ background: 'rgba(255, 207, 0, 0.06)', border: '1px solid rgba(255, 207, 0, 0.12)' }}
        >
          <p
            className="text-[10px] uppercase tracking-wider font-bold mb-1"
            style={{ color: 'var(--brand-gold)' }}
          >
            Under Load
          </p>
          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
            {block.stress_distortion}
          </p>
        </div>
      )}

      {/* Coaching Logic */}
      {block.coaching_logic && (
        <div>
          <p
            className="text-[10px] uppercase tracking-wider font-bold mb-1"
            style={{ color: 'var(--brand-gold)' }}
          >
            Coaching Logic
          </p>
          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
            {block.coaching_logic}
          </p>
        </div>
      )}

      {/* CTA for this specific archetype */}
      <div className="pt-2">
        <Link
          href="/upgrade-your-os"
          className="text-xs font-medium transition-colors hover:brightness-110"
          style={{ color: 'var(--brand-gold)' }}
        >
          Take the full assessment to see if this is your signature &rarr;
        </Link>
      </div>
    </div>
  );
}
