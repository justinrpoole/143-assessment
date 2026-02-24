'use client';

import { useRef, useState, useCallback } from 'react';

/**
 * Headless analytics hook for the Gravitational Stability Check flow.
 * Fires preview_start and preview_complete events via API
 * without rendering any UI. Preserves email nudge scheduling
 * for authenticated users (6hr preview_nudge, 24hr upgrade_nudge).
 *
 * Replaces the UI-heavy PreviewSnapshotClient component.
 */
export function useLightCheckAnalytics() {
  const [previewRunId, setPreviewRunId] = useState<string | null>(null);
  const startedAtMs = useRef<number | null>(null);
  const hasFiredStart = useRef(false);
  const hasFiredComplete = useRef(false);

  const startPreview = useCallback(async () => {
    if (hasFiredStart.current) return;
    hasFiredStart.current = true;

    try {
      const res = await fetch('/api/preview/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source_route: '/preview' }),
      });
      const payload = await res.json().catch(() => ({}));
      if (res.ok && typeof payload.preview_run_id === 'string') {
        setPreviewRunId(payload.preview_run_id);
        startedAtMs.current = Date.now();
      }
    } catch (err) {
      console.error('[LightCheck] preview_start failed:', err);
    }
  }, []);

  const completePreview = useCallback(async () => {
    if (hasFiredComplete.current || !previewRunId) return;
    hasFiredComplete.current = true;

    const elapsed = startedAtMs.current
      ? Math.max(0, Math.round((Date.now() - startedAtMs.current) / 1000))
      : 0;

    try {
      await fetch('/api/preview/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          preview_run_id: previewRunId,
          completion_seconds: elapsed,
          source_route: '/preview',
        }),
      });
    } catch (err) {
      console.error('[LightCheck] preview_complete failed:', err);
    }
  }, [previewRunId]);

  return { startPreview, completePreview, previewRunId };
}
