"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { ShareCardButton } from "@/components/sharecards/ShareCardButton";
import CosmicEmptyState from "@/components/ui/CosmicEmptyState";
import RunComparisonView from "@/components/retention/RunComparisonView";
import SparklineChart from "@/components/retention/SparklineChart";
import { humanizeError } from "@/lib/ui/error-messages";

interface GrowthRun {
  run_id: string;
  run_number: number;
  completed_at: string;
  ray_pair_id: string;
  top_rays: string[];
  ray_scores: Record<string, number>;
}

interface GrowthSummaryPayload {
  runs?: GrowthRun[];
  error?: string;
}

function checkpointStatus(runCount: number, target: number): string {
  if (runCount === 0) {
    return "Not started";
  }
  if (runCount >= target) {
    return "Reached";
  }
  return "In progress";
}

export function GrowthSummaryClient() {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [runs, setRuns] = useState<GrowthRun[]>([]);

  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let canceled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/growth/summary");
        const payload = (await response.json().catch(() => ({}))) as GrowthSummaryPayload;
        if (!response.ok) {
          throw new Error(payload.error ?? "growth_summary_fetch_failed");
        }
        if (!canceled) {
          setRuns(Array.isArray(payload.runs) ? payload.runs : []);
        }
      } catch (requestError) {
        if (!canceled) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "growth_summary_fetch_failed",
          );
        }
      } finally {
        if (!canceled) {
          setLoading(false);
        }
      }
    }
    void load();
    return () => {
      canceled = true;
    };
  }, [retryKey]);

  const latestRun = runs[0] ?? null;

  return (
    <section className="glass-card p-6 sm:p-8">
      <h2 className="text-2xl font-semibold" style={{ color: 'var(--text-on-dark)' }}>Growth trendline</h2>
      <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
        This is your proof layer: what shifted, what held, and what needs one more
        intentional REP.
      </p>

      {loading ? <p className="mt-4 text-sm" style={{ color: 'var(--text-on-dark-muted)' }}>Loading run history...</p> : null}
      {error ? (
        <div className="mt-4 rounded-lg px-4 py-3 flex items-center justify-between gap-3" role="alert"
          style={{ background: 'rgba(220, 38, 38, 0.15)', border: '1px solid rgba(220, 38, 38, 0.3)' }}
        >
          <p className="text-sm" style={{ color: '#FCA5A5' }}>{humanizeError(error)}</p>
          <button type="button" onClick={() => setRetryKey((k) => k + 1)} className="btn-primary text-xs py-1.5 px-4 flex-shrink-0">
            Try Again
          </button>
        </div>
      ) : null}

      {!loading && !error && runs.length === 0 ? (
        <CosmicEmptyState
          message="Your growth story starts with the assessment."
          detail="Complete your first run to unlock trend tracking, score deltas, and retake comparisons."
          actionLabel="Take the Assessment"
          actionHref="/assessment/setup"
        />
      ) : null}

      {!loading && !error && runs.length > 0 ? (
        <>
          <section className="mt-5 grid gap-3 md:grid-cols-3">
            <article className="glass-card p-4 text-sm">
              <h3 className="font-semibold" style={{ color: 'var(--text-on-dark)' }}>Day 7 checkpoint</h3>
              <p className="mt-1" style={{ color: 'var(--text-on-dark-secondary)' }}>{checkpointStatus(runs.length, 1)}</p>
            </article>
            <article className="glass-card p-4 text-sm">
              <h3 className="font-semibold" style={{ color: 'var(--text-on-dark)' }}>Day 21 checkpoint</h3>
              <p className="mt-1" style={{ color: 'var(--text-on-dark-secondary)' }}>{checkpointStatus(runs.length, 2)}</p>
            </article>
            <article className="glass-card p-4 text-sm">
              <h3 className="font-semibold" style={{ color: 'var(--text-on-dark)' }}>Day 66 checkpoint</h3>
              <p className="mt-1" style={{ color: 'var(--text-on-dark-secondary)' }}>{checkpointStatus(runs.length, 3)}</p>
            </article>
          </section>

          <section className="mt-5">
            <h3 className="text-base font-semibold mb-3" style={{ color: 'var(--text-on-dark)' }}>Score Trends</h3>
            <SparklineChart runs={runs} />
          </section>

          <section className="mt-5 glass-card p-4 text-sm">
            <h3 className="text-base font-semibold" style={{ color: 'var(--text-on-dark)' }}>Run history</h3>
            <ul className="mt-2 space-y-2" style={{ color: 'var(--text-on-dark-secondary)' }}>
              {runs.map((run) => (
                <li key={run.run_id}>
                  Run #{run.run_number} • {new Date(run.completed_at).toLocaleDateString()} • pair <code>{run.ray_pair_id}</code> • top rays <code>{run.top_rays.join(", ")}</code>
                </li>
              ))}
              {runs.length === 0 ? (
                <li>No completed runs yet. Start your first run to access trend tracking.</li>
              ) : null}
            </ul>
          </section>

          <section className="mt-5">
            <h3 className="text-base font-semibold mb-3" style={{ color: 'var(--text-on-dark)' }}>Before / After</h3>
            <RunComparisonView runs={runs} />
          </section>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/assessment/setup" className="btn-primary">
              Start Next Run
            </Link>
            <Link
              href={
                latestRun
                  ? `/results?run_id=${encodeURIComponent(latestRun.run_id)}`
                  : "/assessment/setup"
              }
              className="btn-watch"
            >
              Back to Results
            </Link>
          </div>

          <ShareCardButton
            type="growth"
            runId={latestRun?.run_id}
            rayPairId={latestRun?.ray_pair_id}
            topRays={latestRun?.top_rays}
            shortLine="Your growth shows up in your reps."
            buttonLabel="Generate Growth Light Card"
          />
        </>
      ) : null}
    </section>
  );
}
