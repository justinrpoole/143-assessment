"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { RETAKE_REMINDER_DAYS } from "@/lib/notifications/triggers";

interface EntryCounts {
  morning: number;
  micro_joy: number;
  daily_loop: number;
  reflection: number;
}

interface LogCounts {
  reps: number;
}

interface ActivityDay {
  date: string;
  entries: EntryCounts;
  logs: LogCounts;
  assessments: number;
  totals: {
    entries: number;
    logs: number;
  };
}

interface RunSummary {
  id: string;
  run_number: number;
  completed_at: string | null;
}

interface ActivityResponse {
  timezone: string;
  range: { start: string; end: string; days: number };
  days: ActivityDay[];
  runs: RunSummary[];
}

type EntryFilter = "all" | "morning" | "micro_joy" | "daily_loop" | "reflection";

interface PinnedSnapshot {
  id: string;
  saved_at: string;
  range_days: number;
  entry_total: number;
  log_total: number;
  entry_delta: number;
  log_delta: number;
}

const STORAGE_KEY = "portal_entry_log_settings_v1";
const PINNED_KEY = "portal_entry_log_pins_v1";
const RANGE_OPTIONS = [7, 21, 66, 90];
const DEFAULT_ENTRY_TARGET = 5;
const DEFAULT_LOG_TARGET = 5;

function sumRange(days: ActivityDay[], selector: (d: ActivityDay) => number): number {
  return days.reduce((acc, day) => acc + selector(day), 0);
}

function formatShortDate(dateStr: string): string {
  return new Date(`${dateStr}T12:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function formatTimestamp(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function dayDiff(a: Date, b: Date): number {
  const diff = Math.abs(a.getTime() - b.getTime());
  return Math.max(0, Math.round(diff / (1000 * 60 * 60 * 24)));
}

function entryCount(day: ActivityDay, filter: EntryFilter): number {
  if (filter === "morning") return day.entries.morning;
  if (filter === "micro_joy") return day.entries.micro_joy;
  if (filter === "daily_loop") return day.entries.daily_loop;
  if (filter === "reflection") return day.entries.reflection;
  return day.totals.entries;
}

function buildEntryBreakdown(days: ActivityDay[]) {
  return days.reduce(
    (acc, day) => {
      acc.morning += day.entries.morning;
      acc.micro_joy += day.entries.micro_joy;
      acc.daily_loop += day.entries.daily_loop;
      acc.reflection += day.entries.reflection;
      return acc;
    },
    { morning: 0, micro_joy: 0, daily_loop: 0, reflection: 0 },
  );
}

function longestStreak(days: ActivityDay[], predicate: (day: ActivityDay) => boolean): number {
  let max = 0;
  let current = 0;
  for (const day of days) {
    if (predicate(day)) {
      current += 1;
      max = Math.max(max, current);
    } else {
      current = 0;
    }
  }
  return max;
}

function buildCsv(days: ActivityDay[], runs: RunSummary[]): string {
  const header = [
    "date",
    "morning",
    "micro_joy",
    "daily_loop",
    "reflection",
    "entries_total",
    "reps",
    "assessments",
  ].join(",");

  const rows = days.map((day) => [
    day.date,
    day.entries.morning,
    day.entries.micro_joy,
    day.entries.daily_loop,
    day.entries.reflection,
    day.totals.entries,
    day.logs.reps,
    day.assessments,
  ].join(","));

  const runHeader = "run_number,completed_at";
  const runRows = runs.map((run) => `${run.run_number},${run.completed_at ?? ""}`);

  return [header, ...rows, "", runHeader, ...runRows].join("\n");
}

function downloadCsv(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function Heatmap({
  days,
  valueFor,
  color,
}: {
  days: ActivityDay[];
  valueFor: (day: ActivityDay) => number;
  color: string;
}) {
  const maxValue = Math.max(1, ...days.map(valueFor));
  const columns = Math.min(14, days.length || 1);
  return (
    <div
      className="grid gap-1"
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
    >
      {days.map((day) => {
        const value = valueFor(day);
        const intensity = value / maxValue;
        const bg = value > 0
          ? `color-mix(in srgb, ${color} ${Math.round(intensity * 100)}%, rgba(255,255,255,0.05))`
          : "rgba(255,255,255,0.05)";
        return (
          <div
            key={`heat-${day.date}`}
            className="h-3 rounded-sm"
            style={{ background: bg }}
            title={`${formatShortDate(day.date)} - ${value}`}
          />
        );
      })}
    </div>
  );
}

function BarRow({
  days,
  maxValue,
  valueFor,
  accent,
  muted,
}: {
  days: ActivityDay[];
  maxValue: number;
  valueFor: (day: ActivityDay) => number;
  accent: string;
  muted?: boolean;
}) {
  const columns = days.length || 1;
  return (
    <div
      className="grid items-end gap-1"
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
    >
      {days.map((day) => {
        const value = valueFor(day);
        const height = maxValue > 0 ? Math.max(4, Math.round((value / maxValue) * 48)) : 4;
        return (
          <div key={`bar-${day.date}`} className="flex flex-col items-center gap-1">
            <div
              className="w-full rounded-sm"
              style={{
                height,
                background: value > 0 ? accent : "rgba(255,255,255,0.08)",
                opacity: muted ? 0.45 : 1,
                boxShadow: value > 0 ? "0 0 8px rgba(248, 208, 17, 0.25)" : "none",
              }}
              title={`${formatShortDate(day.date)} - ${value}`}
              aria-hidden="true"
            />
            {day.assessments > 0 && !muted && (
              <span
                className="h-1 w-1 rounded-full"
                style={{ background: "var(--brand-gold)" }}
                title={`Assessment completed on ${formatShortDate(day.date)}`}
                aria-hidden="true"
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function EntryLogOverTime({ days = 28 }: { days?: number }) {
  const [data, setData] = useState<ActivityResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [rangeDays, setRangeDays] = useState(days);
  const [compareMode, setCompareMode] = useState(true);
  const [entryFilter, setEntryFilter] = useState<EntryFilter>("all");
  const [entryTarget, setEntryTarget] = useState(DEFAULT_ENTRY_TARGET);
  const [logTarget, setLogTarget] = useState(DEFAULT_LOG_TARGET);
  const [focusMode, setFocusMode] = useState(false);
  const [pinned, setPinned] = useState<PinnedSnapshot[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as {
          rangeDays?: number;
          compareMode?: boolean;
          entryFilter?: EntryFilter;
          entryTarget?: number;
          logTarget?: number;
          focusMode?: boolean;
        };
        if (parsed.rangeDays) setRangeDays(parsed.rangeDays);
        if (typeof parsed.compareMode === "boolean") setCompareMode(parsed.compareMode);
        if (parsed.entryFilter) setEntryFilter(parsed.entryFilter);
        if (parsed.entryTarget) setEntryTarget(parsed.entryTarget);
        if (parsed.logTarget) setLogTarget(parsed.logTarget);
        if (typeof parsed.focusMode === "boolean") setFocusMode(parsed.focusMode);
      }
      const rawPins = localStorage.getItem(PINNED_KEY);
      if (rawPins) {
        const parsedPins = JSON.parse(rawPins) as PinnedSnapshot[];
        setPinned(parsedPins);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          rangeDays,
          compareMode,
          entryFilter,
          entryTarget,
          logTarget,
          focusMode,
        }),
      );
    } catch {
      // ignore
    }
  }, [rangeDays, compareMode, entryFilter, entryTarget, logTarget, focusMode]);

  useEffect(() => {
    try {
      localStorage.setItem(PINNED_KEY, JSON.stringify(pinned));
    } catch {
      // ignore
    }
  }, [pinned]);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const fetchDays = compareMode ? Math.min(rangeDays * 2, 90) : rangeDays;
        const res = await fetch(`/api/portal/activity-series?days=${fetchDays}`);
        if (!res.ok) return;
        const json = (await res.json()) as ActivityResponse;
        if (active) setData(json);
      } finally {
        if (active) setLoading(false);
      }
    }
    void load();
    return () => {
      active = false;
    };
  }, [rangeDays, compareMode]);

  const view = useMemo(() => {
    if (!data) return null;
    const series = data.days ?? [];
    const currentSpan = Math.min(rangeDays, series.length);
    const current = series.slice(-currentSpan);
    const prevSpan = compareMode ? Math.min(currentSpan, series.length - currentSpan) : 0;
    const previous = compareMode ? series.slice(-(currentSpan + prevSpan), -currentSpan) : [];

    const entryTotals = sumRange(current, (d) => entryCount(d, entryFilter));
    const entryTotalsPrev = sumRange(previous, (d) => entryCount(d, entryFilter));
    const logTotals = sumRange(current, (d) => d.totals.logs);
    const logTotalsPrev = sumRange(previous, (d) => d.totals.logs);

    const maxEntries = Math.max(1, ...series.map((d) => entryCount(d, entryFilter)));
    const maxLogs = Math.max(1, ...series.map((d) => d.totals.logs));

    const runs = data.runs ?? [];
    const lastRun = runs[0];
    const lastRunDate = lastRun?.completed_at ? new Date(lastRun.completed_at) : null;
    const daysSinceLast = lastRunDate ? dayDiff(new Date(), lastRunDate) : null;
    const nextCheckpoint = daysSinceLast != null
      ? RETAKE_REMINDER_DAYS.find((d) => d > daysSinceLast) ?? null
      : null;

    const entryBreakdown = buildEntryBreakdown(current);
    const entryDaysWithActivity = current.filter((d) => d.totals.entries > 0).length;
    const logDaysWithActivity = current.filter((d) => d.totals.logs > 0).length;
    const weekSlice = current.slice(-7);
    const weekBreakdown = buildEntryBreakdown(weekSlice);
    const weekEntryTotals = sumRange(weekSlice, (d) => d.totals.entries);
    const weekLogTotals = sumRange(weekSlice, (d) => d.totals.logs);

    const entryConsistency = current.length > 0 ? Math.round((entryDaysWithActivity / current.length) * 100) : 0;
    const entryTargetExpected = Math.max(1, Math.round((current.length / 7) * entryTarget));
    const entryTargetProgress = Math.round((entryTotals / entryTargetExpected) * 100);
    const logTargetExpected = Math.max(1, Math.round((current.length / 7) * logTarget));
    const logConsistency = current.length > 0
      ? Math.round((logTotals / logTargetExpected) * 100)
      : 0;
    const logTargetProgress = logConsistency;

    const latestDay = current[current.length - 1] ?? null;
    const sameDayLastWeek = current.length >= 8 ? current[current.length - 8] : null;
    const latestEntries = latestDay ? entryCount(latestDay, entryFilter) : 0;
    const latestLogs = latestDay ? latestDay.totals.logs : 0;
    const latestAssessments = latestDay ? latestDay.assessments : 0;
    const sameDayEntries = sameDayLastWeek ? entryCount(sameDayLastWeek, entryFilter) : null;
    const sameDayLogs = sameDayLastWeek ? sameDayLastWeek.totals.logs : null;
    const dailyEntryDelta = sameDayEntries == null ? null : latestEntries - sameDayEntries;
    const dailyLogDelta = sameDayLogs == null ? null : latestLogs - sameDayLogs;

    const zeroDays = current.filter((d) => d.totals.entries + d.totals.logs === 0).length;
    const mixTag = entryTotals + logTotals === 0
      ? "No activity yet"
      : entryTotals >= logTotals * 1.5
        ? "Entry-led window"
        : logTotals >= entryTotals * 1.5
          ? "Log-led window"
          : "Balanced window";

    const entryStreaks = {
      morning: longestStreak(current, (d) => d.entries.morning > 0),
      micro_joy: longestStreak(current, (d) => d.entries.micro_joy > 0),
      daily_loop: longestStreak(current, (d) => d.entries.daily_loop > 0),
      reflection: longestStreak(current, (d) => d.entries.reflection > 0),
      reps: longestStreak(current, (d) => d.totals.logs > 0),
    };

    const retakeReady = daysSinceLast != null && daysSinceLast >= 21 && logTotals >= logTarget;

    return {
      series,
      current,
      previous,
      entryTotals,
      entryTotalsPrev,
      logTotals,
      logTotalsPrev,
      maxEntries,
      maxLogs,
      runs,
      lastRunDate,
      daysSinceLast,
      nextCheckpoint,
      entryBreakdown,
      weekBreakdown,
      weekEntryTotals,
      weekLogTotals,
      entryConsistency,
      entryTargetExpected,
      entryTargetProgress,
      logConsistency,
      logTargetExpected,
      logTargetProgress,
      latestDay,
      latestEntries,
      latestLogs,
      latestAssessments,
      sameDayLastWeek,
      sameDayEntries,
      sameDayLogs,
      dailyEntryDelta,
      dailyLogDelta,
      zeroDays,
      mixTag,
      entryStreaks,
      retakeReady,
    };
  }, [data, rangeDays, compareMode, entryFilter, entryTarget, logTarget]);

  if (loading) {
    return (
      <div className="glass-card p-5 space-y-3 animate-pulse">
        <div className="h-3 w-40 rounded" style={{ background: "rgba(255,255,255,0.12)" }} />
        <div className="h-2 w-56 rounded" style={{ background: "rgba(255,255,255,0.08)" }} />
        <div className="h-14 rounded" style={{ background: "rgba(255,255,255,0.06)" }} />
        <div className="h-20 rounded" style={{ background: "rgba(255,255,255,0.06)" }} />
      </div>
    );
  }

  if (!view || view.series.length === 0) {
    return (
      <div className="glass-card p-5 space-y-2">
        <p className="text-sm font-semibold" style={{ color: "var(--text-on-dark)" }}>
          Entry + Log Momentum
        </p>
        <p className="text-sm" style={{ color: "var(--text-on-dark-secondary)" }}>
          Your entry and log history will appear here once you log a morning check-in,
          micro-joy, loop, reflection, or rep.
        </p>
        <div className="flex flex-wrap gap-2 pt-1">
          <Link href="/morning" className="btn-watch text-xs">Morning check-in</Link>
          <Link href="/micro-joy" className="btn-watch text-xs">Micro Joy</Link>
          <Link href="/reps" className="btn-primary text-xs">Log a rep</Link>
        </div>
      </div>
    );
  }

  const entryDelta = view.entryTotals - view.entryTotalsPrev;
  const logDelta = view.logTotals - view.logTotalsPrev;

  const pinnedSnapshot = () => {
    setPinned((prev) => [
      {
        id: `snap-${Date.now()}`,
        saved_at: new Date().toISOString(),
        range_days: rangeDays,
        entry_total: view.entryTotals,
        log_total: view.logTotals,
        entry_delta: entryDelta,
        log_delta: logDelta,
      },
      ...prev,
    ].slice(0, 6));
  };

  return (
    <div
      className={`glass-card p-5 space-y-5 ${focusMode ? "ring-2 ring-brand-gold" : ""}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest font-semibold" style={{ color: "var(--brand-gold)" }}>
            Entry + Log Momentum
          </p>
          <p className="text-sm mt-1" style={{ color: "var(--text-on-dark-secondary)" }}>
            {formatShortDate(view.current[0].date)} to {formatShortDate(view.current[view.current.length - 1].date)}
          </p>
        </div>
        <div className="text-right space-y-1">
          <p className="text-xs" style={{ color: "var(--text-on-dark-muted)" }}>
            {rangeDays}-day view
          </p>
          <p className="text-sm font-semibold" style={{ color: "var(--text-on-dark)" }}>
            {view.entryTotals + view.logTotals} total actions
          </p>
          <button
            type="button"
            className="text-[11px] underline underline-offset-2"
            style={{ color: "var(--brand-gold)" }}
            onClick={() => setFocusMode((prev) => !prev)}
          >
            {focusMode ? "Exit focus" : "Focus mode"}
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <label className="text-xs" style={{ color: "var(--text-on-dark-secondary)" }}>
          Range
          <select
            value={rangeDays}
            onChange={(e) => setRangeDays(Number(e.target.value))}
            className="ml-2 text-xs rounded-lg px-2 py-1"
            style={{ background: "rgba(96, 5, 141, 0.3)", color: "var(--text-on-dark-secondary)", border: "1px solid rgba(148, 80, 200, 0.2)" }}
          >
            {RANGE_OPTIONS.map((option) => (
              <option key={option} value={option}>{option} days</option>
            ))}
          </select>
        </label>

        <label className="text-xs" style={{ color: "var(--text-on-dark-secondary)" }}>
          Entry filter
          <select
            value={entryFilter}
            onChange={(e) => setEntryFilter(e.target.value as EntryFilter)}
            className="ml-2 text-xs rounded-lg px-2 py-1"
            style={{ background: "rgba(96, 5, 141, 0.3)", color: "var(--text-on-dark-secondary)", border: "1px solid rgba(148, 80, 200, 0.2)" }}
          >
            <option value="all">All entries</option>
            <option value="morning">Morning</option>
            <option value="micro_joy">Micro-Joy</option>
            <option value="daily_loop">Daily loop</option>
            <option value="reflection">Reflection</option>
          </select>
        </label>

        <label className="text-xs" style={{ color: "var(--text-on-dark-secondary)" }}>
          Entry target / week
          <input
            type="number"
            min={1}
            max={21}
            value={entryTarget}
            onChange={(e) => {
              const next = Math.max(1, Math.min(21, Number(e.target.value) || 1));
              setEntryTarget(next);
            }}
            className="ml-2 text-xs rounded-lg px-2 py-1 w-16"
            style={{ background: "rgba(96, 5, 141, 0.3)", color: "var(--text-on-dark-secondary)", border: "1px solid rgba(148, 80, 200, 0.2)" }}
          />
        </label>

        <label className="text-xs" style={{ color: "var(--text-on-dark-secondary)" }}>
          Log target / week
          <input
            type="number"
            min={1}
            max={35}
            value={logTarget}
            onChange={(e) => {
              const next = Math.max(1, Math.min(35, Number(e.target.value) || 1));
              setLogTarget(next);
            }}
            className="ml-2 text-xs rounded-lg px-2 py-1 w-16"
            style={{ background: "rgba(96, 5, 141, 0.3)", color: "var(--text-on-dark-secondary)", border: "1px solid rgba(148, 80, 200, 0.2)" }}
          />
        </label>

        <label className="text-xs" style={{ color: "var(--text-on-dark-secondary)" }}>
          Compare
          <input
            type="checkbox"
            className="ml-2"
            checked={compareMode}
            onChange={(e) => setCompareMode(e.target.checked)}
          />
        </label>

        <button
          type="button"
          className="text-[11px] underline underline-offset-2"
          style={{ color: "var(--brand-gold)" }}
          onClick={pinnedSnapshot}
        >
          Pin snapshot
        </button>

        <button
          type="button"
          className="text-[11px] underline underline-offset-2"
          style={{ color: "var(--brand-gold)" }}
          onClick={() => downloadCsv(`entry-log-${Date.now()}.csv`, buildCsv(view.current, view.runs))}
        >
          Download CSV
        </button>
      </div>

      <div className="text-xs" style={{ color: "var(--text-on-dark-muted)" }}>
        Summary: {view.entryTotals} entries ({view.entryBreakdown.morning} morning, {view.entryBreakdown.micro_joy} micro-joy, {view.entryBreakdown.daily_loop} loops, {view.entryBreakdown.reflection} reflections) and {view.logTotals} reps in this window.
      </div>

      <div className="flex flex-wrap items-center gap-2 text-[11px]" style={{ color: "var(--text-on-dark-muted)" }}>
        <span className="px-2 py-1 rounded-full" style={{ background: "rgba(248, 208, 17, 0.12)", color: "var(--brand-gold)" }}>
          Impact: {view.mixTag}
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full" style={{ background: "rgba(248,208,17,0.9)" }} />
          Morning
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full" style={{ background: "rgba(52,211,153,0.9)" }} />
          Micro-Joy
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full" style={{ background: "rgba(139,91,255,0.9)" }} />
          Daily loop
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full" style={{ background: "rgba(251,146,60,0.9)" }} />
          Reflection
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full" style={{ background: "rgba(96,5,141,0.9)" }} />
          REPs
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full" style={{ background: "var(--brand-gold)" }} />
          Assessment
        </span>
        <span>Zero days are shown as dark bars.</span>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="glass-card p-3 space-y-1">
          <p className="text-[11px] uppercase tracking-widest" style={{ color: "var(--text-on-dark-muted)" }}>
            Today snapshot
          </p>
          <p className="text-sm font-semibold" style={{ color: "var(--text-on-dark)" }}>
            {view.latestEntries} entries · {view.latestLogs} reps
          </p>
          <p className="text-xs" style={{ color: "var(--text-on-dark-secondary)" }}>
            Morning {view.latestDay?.entries.morning ?? 0} · Micro-Joy {view.latestDay?.entries.micro_joy ?? 0} · Loop {view.latestDay?.entries.daily_loop ?? 0} · Reflection {view.latestDay?.entries.reflection ?? 0}
          </p>
          <p className="text-[11px]" style={{ color: "var(--text-on-dark-muted)" }}>
            {view.latestAssessments > 0 ? "Assessment completed today." : "No assessment today."}
          </p>
        </div>
        <div className="glass-card p-3 space-y-1">
          <p className="text-[11px] uppercase tracking-widest" style={{ color: "var(--text-on-dark-muted)" }}>
            Same day last week
          </p>
          {view.sameDayEntries == null ? (
            <p className="text-xs" style={{ color: "var(--text-on-dark-secondary)" }}>
              Need 8+ days of history to compare.
            </p>
          ) : (
            <>
              <p className="text-sm font-semibold" style={{ color: view.dailyEntryDelta != null && view.dailyEntryDelta >= 0 ? "#34D399" : "#F87171" }}>
                Entries {view.dailyEntryDelta != null && view.dailyEntryDelta >= 0 ? "+" : ""}{view.dailyEntryDelta}
              </p>
              <p className="text-xs" style={{ color: view.dailyLogDelta != null && view.dailyLogDelta >= 0 ? "#34D399" : "#F87171" }}>
                Logs {view.dailyLogDelta != null && view.dailyLogDelta >= 0 ? "+" : ""}{view.dailyLogDelta}
              </p>
            </>
          )}
        </div>
        <div className="glass-card p-3 space-y-1">
          <p className="text-[11px] uppercase tracking-widest" style={{ color: "var(--text-on-dark-muted)" }}>
            Weekly mix (last 7 days)
          </p>
          <p className="text-sm font-semibold" style={{ color: "var(--text-on-dark)" }}>
            {view.weekEntryTotals} entries · {view.weekLogTotals} reps
          </p>
          <p className="text-xs" style={{ color: "var(--text-on-dark-secondary)" }}>
            Morning {view.weekBreakdown.morning} · Micro-Joy {view.weekBreakdown.micro_joy} · Loop {view.weekBreakdown.daily_loop} · Reflection {view.weekBreakdown.reflection}
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="glass-card p-3">
          <p className="text-[11px] uppercase tracking-widest" style={{ color: "var(--text-on-dark-muted)" }}>
            Entry consistency
          </p>
          <p className="text-lg font-semibold" style={{ color: "var(--text-on-dark)" }}>{view.entryConsistency}%</p>
          <p className="text-xs" style={{ color: "var(--text-on-dark-secondary)" }}>
            Days with entries in this window
          </p>
          <p className="text-[11px]" style={{ color: "var(--text-on-dark-muted)" }}>
            Target pace: {Math.min(view.entryTargetProgress, 200)}% (goal {entryTarget}/week)
          </p>
        </div>
        <div className="glass-card p-3">
          <p className="text-[11px] uppercase tracking-widest" style={{ color: "var(--text-on-dark-muted)" }}>
            Log consistency
          </p>
          <p className="text-lg font-semibold" style={{ color: "var(--text-on-dark)" }}>{Math.min(view.logConsistency, 200)}%</p>
          <p className="text-xs" style={{ color: "var(--text-on-dark-secondary)" }}>
            Reps vs target ({logTarget}/week)
          </p>
          <p className="text-[11px]" style={{ color: "var(--text-on-dark-muted)" }}>
            Target pace: {Math.min(view.logTargetProgress, 200)}%
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold" style={{ color: "var(--text-on-dark-secondary)" }}>
            Entry over entry
          </p>
          <p className="text-xs" style={{ color: entryDelta >= 0 ? "#34D399" : "#F87171" }}>
            {entryDelta >= 0 ? "+" : ""}{entryDelta} vs prior window
          </p>
        </div>
        <BarRow
          days={view.current}
          maxValue={view.maxEntries}
          valueFor={(d) => entryCount(d, entryFilter)}
          accent="linear-gradient(180deg, rgba(248,208,17,0.9), rgba(248,208,17,0.2))"
        />
        {compareMode && view.previous.length > 0 && (
          <BarRow
            days={view.previous}
            maxValue={view.maxEntries}
            valueFor={(d) => entryCount(d, entryFilter)}
            accent="linear-gradient(180deg, rgba(248,208,17,0.6), rgba(248,208,17,0.1))"
            muted
          />
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold" style={{ color: "var(--text-on-dark-secondary)" }}>
            Log over log (REPs)
          </p>
          <p className="text-xs" style={{ color: logDelta >= 0 ? "#34D399" : "#F87171" }}>
            {logDelta >= 0 ? "+" : ""}{logDelta} vs prior window
          </p>
        </div>
        <BarRow
          days={view.current}
          maxValue={view.maxLogs}
          valueFor={(d) => d.totals.logs}
          accent="linear-gradient(180deg, rgba(96,5,141,0.9), rgba(96,5,141,0.2))"
        />
        {compareMode && view.previous.length > 0 && (
          <BarRow
            days={view.previous}
            maxValue={view.maxLogs}
            valueFor={(d) => d.totals.logs}
            accent="linear-gradient(180deg, rgba(96,5,141,0.6), rgba(96,5,141,0.1))"
            muted
          />
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-2">
          <p className="text-xs font-semibold" style={{ color: "var(--text-on-dark-secondary)" }}>
            Daily entry heatmap
          </p>
          <Heatmap
            days={view.current}
            valueFor={(d) => d.totals.entries}
            color="rgba(248,208,17,0.9)"
          />
        </div>
        <div className="space-y-2">
          <p className="text-xs font-semibold" style={{ color: "var(--text-on-dark-secondary)" }}>
            Log density heatmap
          </p>
          <Heatmap
            days={view.current}
            valueFor={(d) => d.totals.logs}
            color="rgba(96,5,141,0.9)"
          />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="glass-card p-3 space-y-2">
          <p className="text-[11px] uppercase tracking-widest" style={{ color: "var(--text-on-dark-muted)" }}>
            Streak ladder
          </p>
          <div className="text-xs" style={{ color: "var(--text-on-dark-secondary)" }}>
            Morning {view.entryStreaks.morning}d · Micro-Joy {view.entryStreaks.micro_joy}d · Loop {view.entryStreaks.daily_loop}d · Reflection {view.entryStreaks.reflection}d · Reps {view.entryStreaks.reps}d
          </div>
        </div>
        <div className="glass-card p-3 space-y-2">
          <p className="text-[11px] uppercase tracking-widest" style={{ color: "var(--text-on-dark-muted)" }}>
            Entry mix (this window)
          </p>
          <div className="text-xs" style={{ color: "var(--text-on-dark-secondary)" }}>
            Morning {view.entryBreakdown.morning} · Micro-Joy {view.entryBreakdown.micro_joy} · Loop {view.entryBreakdown.daily_loop} · Reflection {view.entryBreakdown.reflection}
          </div>
        </div>
      </div>

      <div className="border-t pt-4 space-y-3" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold" style={{ color: "var(--text-on-dark-secondary)" }}>
              Assessments + Retakes
            </p>
            <p className="text-sm" style={{ color: "var(--text-on-dark-muted)" }}>
              {view.runs.length > 0 ? `${view.runs.length} completed runs` : "No completed assessments yet"}
            </p>
          </div>
          {view.daysSinceLast != null && (
            <div className="text-right">
              <p className="text-xs" style={{ color: "var(--text-on-dark-muted)" }}>Days since last</p>
              <p className="text-sm font-semibold" style={{ color: "var(--text-on-dark)" }}>
                {view.daysSinceLast}
              </p>
            </div>
          )}
        </div>

        {view.lastRunDate && (
          <p className="text-xs" style={{ color: "var(--text-on-dark-secondary)" }}>
            Last completed: {formatTimestamp(view.lastRunDate.toISOString())}
            {view.nextCheckpoint != null && ` - Next checkpoint: Day ${view.nextCheckpoint}`}
          </p>
        )}

        {view.retakeReady && (
          <div className="glass-card p-3" style={{ borderColor: "rgba(52, 211, 153, 0.35)" }}>
            <p className="text-xs font-semibold" style={{ color: "#34D399" }}>
              Retake window open
            </p>
            <p className="text-xs" style={{ color: "var(--text-on-dark-secondary)" }}>
              You have enough reps in this window to see movement. Run a retake when you are ready.
            </p>
          </div>
        )}

        {view.runs.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {view.runs.map((run) => (
              <span
                key={run.id}
                className="px-2 py-1 rounded-full text-[11px] font-semibold"
                style={{ background: "rgba(96,5,141,0.2)", color: "var(--text-on-dark-secondary)" }}
              >
                Run {run.run_number}
              </span>
            ))}
          </div>
        )}
      </div>

      {pinned.length > 0 && (
        <div className="glass-card p-3 space-y-2">
          <p className="text-[11px] uppercase tracking-widest" style={{ color: "var(--text-on-dark-muted)" }}>
            Pinned insights
          </p>
          <div className="space-y-1 text-xs" style={{ color: "var(--text-on-dark-secondary)" }}>
            {pinned.map((snap) => (
              <div key={snap.id} className="flex items-center justify-between">
                <span>{formatTimestamp(snap.saved_at)} · {snap.range_days}d</span>
                <span>Entries {snap.entry_total} ({snap.entry_delta >= 0 ? "+" : ""}{snap.entry_delta}) · Logs {snap.log_total} ({snap.log_delta >= 0 ? "+" : ""}{snap.log_delta})</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="text-[11px]" style={{ color: "var(--text-on-dark-muted)" }}>
        Data sources: morning_entries, micro_joy_entries (selected), daily_loops, evening_reflections, reps, assessment_runs.
      </div>
    </div>
  );
}
