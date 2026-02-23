'use client';

import { useState, useEffect, useCallback } from 'react';

interface Highlight {
  id: string;
  block_id: string;
  text: string;
  created_at: string;
}

export function useHighlights(runId: string) {
  const [highlights, setHighlights] = useState<Set<string>>(new Set());
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let canceled = false;

    async function load() {
      try {
        const res = await fetch(`/api/highlights?run_id=${encodeURIComponent(runId)}`);
        if (!res.ok) return;
        const data = (await res.json()) as { highlights: Highlight[] };
        if (canceled) return;
        setHighlights(new Set(data.highlights.map((h) => h.block_id)));
      } catch {
        // silently fail — highlights are non-critical
      } finally {
        if (!canceled) setLoaded(true);
      }
    }

    void load();
    return () => { canceled = true; };
  }, [runId]);

  const toggle = useCallback(async (blockId: string, text: string) => {
    const isHighlighted = highlights.has(blockId);
    const action = isHighlighted ? 'remove' : 'add';

    // Optimistic update
    setHighlights((prev) => {
      const next = new Set(prev);
      if (isHighlighted) {
        next.delete(blockId);
      } else {
        next.add(blockId);
      }
      return next;
    });

    try {
      await fetch('/api/highlights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          run_id: runId,
          block_id: blockId,
          text,
          action,
        }),
      });
    } catch {
      // Rollback on failure
      setHighlights((prev) => {
        const next = new Set(prev);
        if (isHighlighted) {
          next.add(blockId);
        } else {
          next.delete(blockId);
        }
        return next;
      });
    }
  }, [runId, highlights]);

  return {
    highlights,
    isHighlighted: (blockId: string) => highlights.has(blockId),
    toggle,
    loaded,
  };
}
