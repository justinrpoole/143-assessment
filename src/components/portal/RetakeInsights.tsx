"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import CosmicEmptyState from "@/components/ui/CosmicEmptyState";
import RunComparisonView from "@/components/retention/RunComparisonView";
import SparklineChart from "@/components/retention/SparklineChart";
import { RAY_SHORT_NAMES } from "@/lib/types";
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

interface ActivityDay {
  date: string;
  totals: {
    entries: number;
    logs: number;
  };
}

interface ActivityResponse {
  timezone: string;
  range: { start: string; end: string; days: number };
  days: ActivityDay[];
}

const RAY_ORDER = ["R1", "R2", "R3", "R4", "R5", "R6", "R7", "R8", "R9"];
const CORRELATION_WINDOW_DAYS = 14;

function averageScore(scores: Record<string, number>): number {
  const values = Object.values(scores ?? {}).map(Number);
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatShortDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function dateKeyInZone(iso: string, timeZone: string): string {
  return new Date(iso).toLocaleDateString("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

function dayDiff(a: string, b: string): number {
  const aTime = new Date(a).getTime();
  const bTime = new Date(b).getTime();
  return Math.max(0, Math.round(Math.abs(aTime - bTime) / (1000 * 60 * 60 * 24)));
}

function pearson(xs: number[], ys: number[]): number | null {
  if (xs.length !== ys.length || xs.length < 3) return null;
  const n = xs.length;
  const meanX = xs.reduce((sum, v) => sum + v, 0) / n;
  const meanY = ys.reduce((sum, v) => sum + v, 0) / n;
  let numerator = 0;
  let denomX = 0;
  let denomY = 0;
  for (let i = 0; i < n; i += 1) {
    const dx = xs[i] - meanX;
    const dy = ys[i] - meanY;
    numerator += dx * dy;
    denomX += dx * dx;
    denomY += dy * dy;
  }
  const denom = Math.sqrt(denomX * denomY);
  if (!denom) return null;
  return numerator / denom;
}

function correlationLabel(value: number | null): { label: string; color: string } {
  if (value == null) {
    return { label: "Not enough data", color: "var(--text-on-dark-muted)" };
  }
  if (value > 0.45) return { label: "Strong positive", color: "#34D399" };
  if (value > 0.2) return { label: "Positive", color: "#86EFAC" };
  if (value < -0.45) return { label: "Strong negative", color: "#F87171" };
  if (value < -0.2) return { label: "Negative", color: "#FCA5A5" };
  return { label: "No clear signal", color: "var(--text-on-dark-muted)" };
}

export default function RetakeInsights() {
  const [runs, setRuns] = useState<GrowthRun[]>([]);
  const [activity, setActivity] = useState<ActivityResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoReplay, setAutoReplay] = useState(false);
  const [pairIndex, setPairIndex] = useState(0);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let canceled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [runRes, activityRes] = await Promise.all([
          fetch("/api/growth/summary?limit=12"),
          fetch("/api/portal/activity-series?days=90"),
        ]);

        const runPayload = (await runRes.json().catch(() => ({}))) as GrowthSummaryPayload;
        if (!runRes.ok) {
          throw new Error(runPayload.error ?? "growth_summary_fetch_failed");
        }
        if (!canceled) {
          setRuns(Array.isArray(runPayload.runs) ? runPayload.runs : []);
        }

        if (activityRes.ok) {
          const activityPayload = (await activityRes.json().catch(() => null)) as ActivityResponse | null;
          if (!canceled && activityPayload) {
            setActivity(activityPayload);
          }
        }
      } catch (requestError) {
        if (!canceled) {
          setError(requestError instanceof Error ? requestError.message : "retake_insights_failed");
        }
      } finally {
        if (!canceled) setLoading(false);
      }
    }

    void load();
    return () => {
      canceled = true;
    };
  }, [retryKey]);

  const orderedRuns = useMemo(() => runs ?? [], [runs]);
  const chronologicalRuns = useMemo(() => [...orderedRuns].reverse(), [orderedRuns]);

  const latestRun = orderedRuns[0] ?? null;
  const previousRun = orderedRuns[1] ?? null;

  const runPairsCount = Math.max(0, orderedRuns.length - 1);
  const maxPairIndex = Math.max(0, runPairsCount - 1);
  const replayRuns = orderedRuns.slice(pairIndex, pairIndex + 2);

  useEffect(() => {
    if (pairIndex > maxPairIndex) {
      setPairIndex(0);
    }
  }, [pairIndex, maxPairIndex]);

  useEffect(() => {
    if (!autoReplay || orderedRuns.length < 3) return undefined;
    const interval = setInterval(() => {
      setPairIndex((idx) => (idx + 1) % Math.max(1, orderedRuns.length - 1));
    }, 3200);
    return () => clearInterval(interval);
  }, [autoReplay, orderedRuns.length]);

  const cadence = useMemo(() => {
    if (chronologicalRuns.length === 0) return null;
    const gaps = [] as number[];
    for (let i = 1; i < chronologicalRuns.length; i += 1) {
      gaps.push(dayDiff(chronologicalRuns[i].completed_at, chronologicalRuns[i - 1].completed_at));
    }
    const avgGap = gaps.length > 0
      ? Math.round(gaps.reduce((sum, value) => sum + value, 0) / gaps.length)
      : null;
    const lastGap = gaps.length > 0 ? gaps[gaps.length - 1] : null;
    const daysSinceLast = latestRun ? dayDiff(new Date().toISOString(), latestRun.completed_at) : null;
    return { avgGap, lastGap, daysSinceLast };
  }, [chronologicalRuns, latestRun]);

  const outcome = useMemo(() => {
    if (!latestRun || !previousRun) return null;
    const deltas = RAY_ORDER.map((rayId) => {
      const before = Number(previousRun.ray_scores?.[rayId] ?? 0);
      const after = Number(latestRun.ray_scores?.[rayId] ?? 0);
      const delta = after - before;
      return {
        rayId,
        name: RAY_SHORT_NAMES[rayId] ?? rayId,
        before,
        after,
        delta,
      };
    });
    const gains = [...deltas].sort((a, b) => b.delta - a.delta).slice(0, 2);
    const bottomRay = [...deltas].sort((a, b) => a.before - b.before)[0];
    const overallDelta = averageScore(latestRun.ray_scores) - averageScore(previousRun.ray_scores);
    return { gains, bottomRay, overallDelta };
  }, [latestRun, previousRun]);

  const runDeltas = useMemo(() => {
    if (chronologicalRuns.length < 2) return [] as Array<{
      from: number;
      to: number;
      delta: number;
      gap: number;
    }>;
    const result: Array<{ from: number; to: number; delta: number; gap: number }> = [];
    for (let i = 1; i < chronologicalRuns.length; i += 1) {
      const before = chronologicalRuns[i - 1];
      const after = chronologicalRuns[i];
      result.push({
        from: before.run_number,
        to: after.run_number,
        delta: averageScore(after.ray_scores) - averageScore(before.ray_scores),
        gap: dayDiff(after.completed_at, before.completed_at),
      });
    }
    return result;
  }, [chronologicalRuns]);

  const correlation = useMemo(() => {
    if (!activity || orderedRuns.length < 2) return null;
    const dayIndex = new Map(activity.days.map((day, index) => [day.date, index]));
    const samples: Array<{ score: number; entries: number; logs: number }> = [];

    for (const run of orderedRuns) {
      const runKey = dateKeyInZone(run.completed_at, activity.timezone ?? "UTC");
      const idx = dayIndex.get(runKey);
      if (idx == null) continue;
      const startIdx = Math.max(0, idx - (CORRELATION_WINDOW_DAYS - 1));
      const window = activity.days.slice(startIdx, idx + 1);
      const entryTotal = window.reduce((sum, day) => sum + (day.totals?.entries ?? 0), 0);
      const logTotal = window.reduce((sum, day) => sum + (day.totals?.logs ?? 0), 0);
      samples.push({
        score: averageScore(run.ray_scores),
        entries: entryTotal,
        logs: logTotal,
      });
    }

    if (samples.length < 3) return { sampleCount: samples.length, entry: null, log: null, windowDays: CORRELATION_WINDOW_DAYS };

    const entryCorr = pearson(samples.map((s) => s.entries), samples.map((s) => s.score));
    const logCorr = pearson(samples.map((s) => s.logs), samples.map((s) => s.score));

    return {
      sampleCount: samples.length,
      entry: entryCorr,
      log: logCorr,
      windowDays: CORRELATION_WINDOW_DAYS,
    };
  }, [activity, orderedRuns]);

  const latestWindow = useMemo(() => {
    if (!activity || !latestRun) return null;
    const dayIndex = new Map(activity.days.map((day, index) => [day.date, index]));
    const runKey = dateKeyInZone(latestRun.completed_at, activity.timezone ?? "UTC");
    const idx = dayIndex.get(runKey);
    if (idx == null) return null;
    const startIdx = Math.max(0, idx - (CORRELATION_WINDOW_DAYS - 1));
    const window = activity.days.slice(startIdx, idx + 1);
    return {
      entries: window.reduce((sum, day) => sum + (day.totals?.entries ?? 0), 0),
      logs: window.reduce((sum, day) => sum + (day.totals?.logs ?? 0), 0),
      start: activity.days[startIdx]?.date,
      end: activity.days[idx]?.date,
    };
  }, [activity, latestRun]);

  if (loading) {
    return (
      <div className="glass-card p-5 space-y-3 animate-pulse">
        <div className="h-3 w-36 rounded" style={{ background: "rgba(255,255,255,0.12)" }} />
        <div className="h-2 w-52 rounded" style={{ background: "rgba(255,255,255,0.08)" }} />
        <div className="h-16 rounded" style={{ background: "rgba(255,255,255,0.06)" }} />
        <div className="h-24 rounded" style={{ background: "rgba(255,255,255,0.06)" }} />
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="glass-card p-5 space-y-3"
        style={{ borderColor: "rgba(248, 113, 113, 0.3)" }}
      >
        <p className="text-sm" style={{ color: "#FCA5A5" }}>
          {humanizeError(error)}
        </p>
        <button
          type="button"
          className="btn-primary text-xs"
          onClick={() => setRetryKey((value) => value + 1)}
        >
          Try again
        </button>
      </div>
    );
  }

  if (orderedRuns.length === 0) {
    return (
      <div className="glass-card p-5">
        <CosmicEmptyState
          message="Retake insights unlock after your first run."
          detail="Complete your first assessment to start tracking run-over-run shifts, cadence, and retake readiness."
          actionLabel="Start assessment"
          actionHref="/assessment/setup"
        />
      </div>
    );
  }

  const entryCorrLabel = correlationLabel(correlation?.entry ?? null);
  const logCorrLabel = correlationLabel(correlation?.log ?? null);

  return (
    <div className="glass-card p-5 space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest font-semibold" style={{ color: "var(--brand-gold)" }}>
            Retake insights
          </p>
          <p className="text-sm mt-1" style={{ color: "var(--text-on-dark-secondary)" }}>
            Run-over-run deltas, cadence, and pre-run entry volume.
          </p>
        </div>
        <Link
          href="/growth"
          className="text-[11px] underline underline-offset-2"
          style={{ color: "var(--brand-gold)" }}
        >
          Open growth
        </Link>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="glass-card p-3">
          <p className="text-[11px] uppercase tracking-widest" style={{ color: "var(--text-on-dark-muted)" }}>
            Runs completed
          </p>
          <p className="text-lg font-semibold" style={{ color: "var(--text-on-dark)" }}>
            {orderedRuns.length}
          </p>
          <p className="text-xs" style={{ color: "var(--text-on-dark-secondary)" }}>
            Latest run {latestRun ? `#${latestRun.run_number}` : "-"}
          </p>
        </div>
        <div className="glass-card p-3">
          <p className="text-[11px] uppercase tracking-widest" style={{ color: "var(--text-on-dark-muted)" }}>
            Days since last
          </p>
          <p className="text-lg font-semibold" style={{ color: "var(--text-on-dark)" }}>
            {cadence?.daysSinceLast ?? "-"}
          </p>
          <p className="text-xs" style={{ color: "var(--text-on-dark-secondary)" }}>
            Last completed {latestRun ? formatShortDate(latestRun.completed_at) : "-"}
          </p>
        </div>
        <div className="glass-card p-3">
          <p className="text-[11px] uppercase tracking-widest" style={{ color: "var(--text-on-dark-muted)" }}>
            Avg days between runs
          </p>
          <p className="text-lg font-semibold" style={{ color: "var(--text-on-dark)" }}>
            {cadence?.avgGap ?? "-"}
          </p>
          <p className="text-xs" style={{ color: "var(--text-on-dark-secondary)" }}>
            Last gap {cadence?.lastGap ?? "-"} days
          </p>
        </div>
      </div>

      {orderedRuns.length > 1 && (
        <div className="glass-card p-4 space-y-3">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <p className="text-[11px] uppercase tracking-widest" style={{ color: "var(--text-on-dark-muted)" }}>
                Retake replay
              </p>
              <p className="text-xs" style={{ color: "var(--text-on-dark-secondary)" }}>
                Comparing run #{replayRuns[1]?.run_number ?? "-"} to #{replayRuns[0]?.run_number ?? "-"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="text-[11px] underline underline-offset-2"
                style={{ color: "var(--brand-gold)" }}
                onClick={() => setPairIndex((value) => Math.max(0, value - 1))}
                disabled={pairIndex === 0}
              >
                Prev
              </button>
              <button
                type="button"
                className="text-[11px] underline underline-offset-2"
                style={{ color: "var(--brand-gold)" }}
                onClick={() => setPairIndex((value) => Math.min(maxPairIndex, value + 1))}
                disabled={pairIndex >= maxPairIndex}
              >
                Next
              </button>
              <button
                type="button"
                className="text-[11px] underline underline-offset-2"
                style={{ color: "var(--brand-gold)" }}
                onClick={() => setAutoReplay((value) => !value)}
                disabled={orderedRuns.length < 3}
              >
                {autoReplay ? "Pause replay" : "Auto replay"}
              </button>
            </div>
          </div>
          <RunComparisonView runs={replayRuns.length >= 2 ? replayRuns : orderedRuns} />
        </div>
      )}

      {orderedRuns.length > 1 && outcome && (
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="glass-card p-4 space-y-2">
            <p className="text-[11px] uppercase tracking-widest" style={{ color: "var(--text-on-dark-muted)" }}>
              Retake outcome
            </p>
            <p className="text-lg font-semibold" style={{ color: outcome.overallDelta >= 0 ? "#34D399" : "#F87171" }}>
              {outcome.overallDelta >= 0 ? "+" : ""}{outcome.overallDelta.toFixed(2)} overall
            </p>
            <div className="text-xs" style={{ color: "var(--text-on-dark-secondary)" }}>
              {outcome.gains.map((gain) => (
                <span key={gain.rayId} className="mr-3">
                  {gain.name} {gain.delta >= 0 ? "+" : ""}{gain.delta.toFixed(1)}
                </span>
              ))}
            </div>
          </div>
          <div className="glass-card p-4 space-y-2">
            <p className="text-[11px] uppercase tracking-widest" style={{ color: "var(--text-on-dark-muted)" }}>
              Bottom ray lift
            </p>
            <p className="text-lg font-semibold" style={{ color: outcome.bottomRay.delta >= 0 ? "#34D399" : "#F87171" }}>
              {outcome.bottomRay.name}
            </p>
            <p className="text-xs" style={{ color: "var(--text-on-dark-secondary)" }}>
              {outcome.bottomRay.before.toFixed(1)} to {outcome.bottomRay.after.toFixed(1)}
              {" "}({outcome.bottomRay.delta >= 0 ? "+" : ""}{outcome.bottomRay.delta.toFixed(1)})
            </p>
          </div>
        </div>
      )}

      {orderedRuns.length > 1 && runDeltas.length > 0 && (
        <div className="glass-card p-4 space-y-2">
          <p className="text-[11px] uppercase tracking-widest" style={{ color: "var(--text-on-dark-muted)" }}>
            Run-to-run deltas
          </p>
          <div className="flex flex-wrap gap-2 text-xs" style={{ color: "var(--text-on-dark-secondary)" }}>
            {runDeltas.map((delta) => (
              <span
                key={`${delta.from}-${delta.to}`}
                className="px-2 py-1 rounded-full"
                style={{
                  background: delta.delta >= 0 ? "rgba(52, 211, 153, 0.15)" : "rgba(248, 113, 113, 0.15)",
                  color: delta.delta >= 0 ? "#34D399" : "#F87171",
                }}
              >
                Run {delta.from} to {delta.to}: {delta.delta >= 0 ? "+" : ""}{delta.delta.toFixed(2)} ({delta.gap}d)
              </span>
            ))}
          </div>
        </div>
      )}

      {orderedRuns.length > 1 && (
        <div className="glass-card p-4">
          <p className="text-[11px] uppercase tracking-widest" style={{ color: "var(--text-on-dark-muted)" }}>
            Score trendline
          </p>
          <div className="mt-3">
            <SparklineChart runs={orderedRuns} />
          </div>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="glass-card p-4 space-y-2">
          <p className="text-[11px] uppercase tracking-widest" style={{ color: "var(--text-on-dark-muted)" }}>
            Entry to assessment correlation
          </p>
          <p className="text-sm" style={{ color: entryCorrLabel.color }}>
            {entryCorrLabel.label}
          </p>
          <p className="text-xs" style={{ color: "var(--text-on-dark-secondary)" }}>
            {correlation?.entry != null
              ? `r = ${correlation.entry.toFixed(2)}`
              : "Need 3+ runs inside the last 90 days"}
          </p>
          <p className="text-[11px]" style={{ color: "var(--text-on-dark-muted)" }}>
            Window: {correlation?.windowDays ?? CORRELATION_WINDOW_DAYS} days before each run.
          </p>
        </div>

        <div className="glass-card p-4 space-y-2">
          <p className="text-[11px] uppercase tracking-widest" style={{ color: "var(--text-on-dark-muted)" }}>
            Log to assessment correlation
          </p>
          <p className="text-sm" style={{ color: logCorrLabel.color }}>
            {logCorrLabel.label}
          </p>
          <p className="text-xs" style={{ color: "var(--text-on-dark-secondary)" }}>
            {correlation?.log != null
              ? `r = ${correlation.log.toFixed(2)}`
              : "Need 3+ runs inside the last 90 days"}
          </p>
          <p className="text-[11px]" style={{ color: "var(--text-on-dark-muted)" }}>
            Window: {correlation?.windowDays ?? CORRELATION_WINDOW_DAYS} days before each run.
          </p>
        </div>
      </div>

      {latestWindow && (
        <div className="glass-card p-4 space-y-2">
          <p className="text-[11px] uppercase tracking-widest" style={{ color: "var(--text-on-dark-muted)" }}>
            Pre-run volume
          </p>
          <p className="text-sm" style={{ color: "var(--text-on-dark-secondary)" }}>
            {latestWindow.entries} entries and {latestWindow.logs} reps in the {CORRELATION_WINDOW_DAYS}-day lead in.
          </p>
          {latestWindow.start && latestWindow.end && (
            <p className="text-[11px]" style={{ color: "var(--text-on-dark-muted)" }}>
              {latestWindow.start} to {latestWindow.end}
            </p>
          )}
        </div>
      )}

      <div className="glass-card p-4 space-y-2">
        <p className="text-[11px] uppercase tracking-widest" style={{ color: "var(--text-on-dark-muted)" }}>
          Retake history
        </p>
        <div className="space-y-1 text-xs" style={{ color: "var(--text-on-dark-secondary)" }}>
          {orderedRuns.map((run) => (
            <div key={run.run_id} className="flex items-center justify-between gap-2">
              <span>Run #{run.run_number} - {formatDate(run.completed_at)}</span>
              <span>Top: {run.top_rays.join(", ") || "-"}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
