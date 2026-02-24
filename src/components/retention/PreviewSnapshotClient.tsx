/**
 * @deprecated — Replaced by useLightCheckAnalytics hook + LightCheckOrchestrator.
 * Analytics logic extracted to src/hooks/useLightCheckAnalytics.ts (headless).
 * UI replaced by MiniAssessmentPreview (light-check mode) + LightCheckResultPanel.
 * Kept for reference only — safe to delete once /preview overhaul is verified.
 */
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

interface PreviewStartPayload {
  preview_run_id?: string;
  snapshot?: {
    signal?: string;
    next_step?: string;
  };
  error?: string;
}

interface PreviewCompletePayload {
  status?: string;
  next_route?: string;
  error?: string;
}

export function PreviewSnapshotClient() {
  const [loadingStart, setLoadingStart] = useState<boolean>(false);
  const [loadingComplete, setLoadingComplete] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [previewRunId, setPreviewRunId] = useState<string | null>(null);
  const [startedAtMs, setStartedAtMs] = useState<number | null>(null);
  const [snapshotSignal, setSnapshotSignal] = useState<string | null>(null);
  const [snapshotNext, setSnapshotNext] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState<boolean>(false);

  const elapsedSeconds = useMemo(() => {
    if (!startedAtMs) {
      return 0;
    }
    return Math.max(0, Math.round((Date.now() - startedAtMs) / 1000));
  }, [startedAtMs]);

  async function onStartPreview() {
    setLoadingStart(true);
    setError(null);
    try {
      const response = await fetch("/api/preview/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source_route: "/preview" }),
      });
      const payload = (await response.json().catch(() => ({}))) as PreviewStartPayload;
      if (!response.ok || typeof payload.preview_run_id !== "string") {
        setError(payload.error ?? "preview_start_failed");
        return;
      }
      setPreviewRunId(payload.preview_run_id);
      setSnapshotSignal(payload.snapshot?.signal ?? "Preview started.");
      setSnapshotNext(payload.snapshot?.next_step ?? "Continue to next step.");
      setStartedAtMs(Date.now());
      setIsComplete(false);
    } catch (requestError) {
      setError(
        requestError instanceof Error ? requestError.message : "preview_start_failed",
      );
    } finally {
      setLoadingStart(false);
    }
  }

  async function onCompletePreview() {
    if (!previewRunId) {
      return;
    }
    setLoadingComplete(true);
    setError(null);
    try {
      const response = await fetch("/api/preview/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          preview_run_id: previewRunId,
          completion_seconds: elapsedSeconds,
          source_route: "/preview",
        }),
      });
      const payload = (await response.json().catch(() => ({}))) as PreviewCompletePayload;
      if (!response.ok) {
        setError(payload.error ?? "preview_complete_failed");
        return;
      }
      setIsComplete(true);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "preview_complete_failed",
      );
    } finally {
      setLoadingComplete(false);
    }
  }

  return (
    <section className="glass-card p-6 sm:p-8 space-y-4">
      <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--brand-gold, #F8D011)' }}>Gravitational Stability Check</p>
      <h2 className="text-xl font-semibold" style={{ color: 'var(--text-on-dark)' }}>Your OS Snapshot</h2>
      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>Start your preview and get a focused signal before upgrading.</p>

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          className="btn-primary"
          disabled={loadingStart}
          onClick={() => void onStartPreview()}
        >
          {loadingStart ? "Starting..." : "Start Preview"}
        </button>
        {previewRunId ? (
          <button
            type="button"
            className="btn-watch"
            disabled={loadingComplete}
            onClick={() => void onCompletePreview()}
          >
            {loadingComplete ? "Completing..." : "Complete Preview"}
          </button>
        ) : null}
      </div>

      {previewRunId ? (
        <article className="mt-4 glass-card p-4 text-sm">
          <p style={{ color: 'var(--text-on-dark-muted)' }}>
            preview_run_id: <code>{previewRunId}</code>
          </p>
          <p className="mt-2" style={{ color: 'var(--text-on-dark)' }}>{snapshotSignal}</p>
          <p style={{ color: 'var(--text-on-dark-secondary)' }}>{snapshotNext}</p>
          {isComplete ? (
            <p className="mt-2 text-emerald-400">Preview complete. Ready for the full map.</p>
          ) : null}
        </article>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-3">
        <Link href="/sample-report" className="btn-watch">
          View Sample Report
        </Link>
        <Link href="/upgrade" className="btn-watch">
          Upgrade to Full Assessment
        </Link>
      </div>

      {error ? (
        <p className="mt-3 text-sm text-rose-700" role="alert">
          {error}
        </p>
      ) : null}
    </section>
  );
}
