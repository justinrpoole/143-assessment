'use client';

import { useState, useEffect, useCallback } from 'react';
import CosmicSkeleton from '@/components/ui/CosmicSkeleton';
import { rayHex } from '@/lib/ui/ray-colors';

interface JournalEntry {
  id: string;
  entry_date: string;
  what_happened: string;
  what_i_did: string;
  what_next: string;
  quality_score: number;
  created_at: string;
}

const QUALITY_LABELS = ['—', 'Surface', 'Specific', 'Actionable'];
const PAGE_SIZE = 14;

function formatDate(iso: string): string {
  const d = new Date(iso + 'T12:00:00Z');
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

function daysAgo(iso: string): string {
  const now = new Date();
  const d = new Date(iso + 'T12:00:00Z');
  const diff = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  return `${diff}d ago`;
}

/**
 * JournalBrowser — paginated view of past evening reflections.
 *
 * Shows a timeline of all reflections with quality badges,
 * expandable entries, and "load more" pagination.
 */
export default function JournalBrowser() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const loadEntries = useCallback(async (offset: number) => {
    const isMore = offset > 0;
    if (isMore) setLoadingMore(true);
    try {
      const res = await fetch(`/api/journal/history?limit=${PAGE_SIZE}&offset=${offset}`);
      if (!res.ok) return;
      const data = (await res.json()) as { entries?: JournalEntry[]; hasMore?: boolean };
      if (isMore) {
        setEntries((prev) => [...prev, ...(data.entries ?? [])]);
      } else {
        setEntries(data.entries ?? []);
      }
      setHasMore(data.hasMore ?? false);
    } finally {
      if (isMore) setLoadingMore(false);
      else setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadEntries(0);
  }, [loadEntries]);

  if (loading) {
    return <CosmicSkeleton rows={3} height="h-20" />;
  }

  if (entries.length === 0) {
    return (
      <div className="glass-card p-5 text-center">
        <p className="text-sm" style={{ color: 'var(--text-on-dark-muted)' }}>
          No reflections yet. Complete your first evening reflection to start your journal.
        </p>
      </div>
    );
  }

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--brand-gold, #F8D011)' }}>
          Reflection Journal
        </p>
        <p className="text-xs" style={{ color: 'var(--text-on-dark-muted)' }}>
          {entries.length} entries
        </p>
      </div>

      <div className="space-y-2">
        {entries.map((entry) => {
          const isExpanded = expandedId === entry.id;

          return (
            <button
              key={entry.id}
              type="button"
              onClick={() => setExpandedId(isExpanded ? null : entry.id)}
              className="w-full text-left glass-card p-4 transition-all"
              style={{ borderColor: isExpanded ? 'rgba(248, 208, 17, 0.2)' : undefined }}
            >
              {/* Header row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium" style={{ color: 'var(--text-on-dark)' }}>
                    {formatDate(entry.entry_date)}
                  </span>
                  <span className="text-xs" style={{ color: 'var(--text-on-dark-muted)' }}>
                    {daysAgo(entry.entry_date)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {entry.quality_score > 0 && (
                    <span
                      className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                      style={{
                        background: entry.quality_score >= 3
                          ? 'rgba(52, 211, 153, 0.15)'
                          : 'rgba(248, 208, 17, 0.15)',
                        color: entry.quality_score >= 3 ? '#34D399' : 'var(--brand-gold)',
                      }}
                    >
                      {QUALITY_LABELS[entry.quality_score]}
                    </span>
                  )}
                  <span
                    className="text-xs transition-transform"
                    style={{
                      color: 'var(--text-on-dark-muted)',
                      transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)',
                    }}
                  >
                    ▾
                  </span>
                </div>
              </div>

              {/* Preview (collapsed) */}
              {!isExpanded && (
                <p
                  className="mt-1 text-xs truncate"
                  style={{ color: 'var(--text-on-dark-secondary)' }}
                >
                  {entry.what_happened}
                </p>
              )}

              {/* Full entry (expanded) */}
              {isExpanded && (
                <div className="mt-3 space-y-3">
                  {[
                    { label: 'Notice', text: entry.what_happened },
                    { label: 'Own It', text: entry.what_i_did },
                    { label: 'Next', text: entry.what_next },
                  ].map((section) => (
                    <div key={section.label} className="flex gap-3">
                      <div
                        className="w-1 rounded-full flex-shrink-0"
                        style={{ background: 'var(--brand-purple)' }}
                      />
                      <div>
                        <p className="text-xs font-medium" style={{ color: 'var(--text-on-dark-muted)' }}>
                          {section.label}
                        </p>
                        <p className="text-sm" style={{ color: 'var(--text-on-dark-secondary)' }}>
                          {section.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {hasMore && (
        <button
          type="button"
          onClick={() => void loadEntries(entries.length)}
          disabled={loadingMore}
          className="w-full text-center py-2 text-xs hover:underline"
          style={{ color: 'var(--text-on-dark-muted)' }}
        >
          {loadingMore ? 'Loading...' : 'Load more'}
        </button>
      )}
    </section>
  );
}
