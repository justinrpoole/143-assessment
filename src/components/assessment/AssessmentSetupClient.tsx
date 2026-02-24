"use client";

import { type FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface DimmingResult {
  score: number;
  level: string;
  primaryRay: string;
  primaryRayName: string;
  timestamp: number;
}

function loadDimmingResult(): DimmingResult | null {
  try {
    const raw = localStorage.getItem("143_dimming_result");
    if (!raw) return null;
    const parsed = JSON.parse(raw) as DimmingResult;
    // Only use results from the last 24 hours
    if (Date.now() - parsed.timestamp > 24 * 60 * 60 * 1000) return null;
    return parsed;
  } catch {
    return null;
  }
}

const CONTEXT_OPTIONS = [
  { value: "work", label: "Work" },
  { value: "home", label: "Life" },
  { value: "mixed", label: "Both" },
] as const;

const FOCUS_OPTIONS = [
  { value: "confidence", label: "Confidence" },
  { value: "clarity", label: "Clarity" },
  { value: "energy", label: "Energy" },
  { value: "connection", label: "Connection" },
] as const;

type LockReason = "needs_upgrade" | "paid_43_run1_used" | "reactivation_required";

interface DraftApiResponse {
  run_id: string;
  run_number: number;
  status: string;
}

function lockCopy(reason: LockReason): string {
  if (reason === "paid_43_run1_used") {
    return "You already completed your first run — that data is yours forever. Weekly access unlocks retakes so you can track real change over time.";
  }
  if (reason === "reactivation_required") {
    return "Your subscription access needs a refresh before you can start a new run. Your existing results are still available.";
  }
  return "The full assessment requires paid access. Your sample report and Stability Check results are still available to review.";
}

export function AssessmentSetupClient() {
  const router = useRouter();
  const [contextScope, setContextScope] = useState<string>("work");
  const [focusArea, setFocusArea] = useState<string>("confidence");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lockReason, setLockReason] = useState<LockReason | null>(null);
  const [dimmingResult, setDimmingResult] = useState<DimmingResult | null>(null);

  useEffect(() => {
    setDimmingResult(loadDimmingResult());
  }, []);

  const lockMessage = useMemo(
    () => (lockReason ? lockCopy(lockReason) : null),
    [lockReason],
  );

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    setLockReason(null);

    try {
      const draftResponse = await fetch("/api/runs/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          context_scope: contextScope,
          focus_area: focusArea,
          source_route: "/assessment/setup",
        }),
      });
      const draftData = (await draftResponse.json().catch(() => ({}))) as
        | DraftApiResponse
        | { error?: string; reason?: string };

      if (!draftResponse.ok) {
        const reasonValue =
          "reason" in draftData && typeof draftData.reason === "string"
            ? draftData.reason
            : null;
        if (
          draftResponse.status === 403 &&
          (reasonValue === "needs_upgrade" ||
            reasonValue === "paid_43_run1_used" ||
            reasonValue === "reactivation_required")
        ) {
          setLockReason(reasonValue);
          return;
        }

        const errorValue =
          "error" in draftData && typeof draftData.error === "string"
            ? draftData.error
            : null;
        setError(
          errorValue ?? "Something went sideways setting up your run. Try again — if it persists, reach out.",
        );
        return;
      }

      if (!("run_id" in draftData) || typeof draftData.run_id !== "string") {
        setError("The response came back in an unexpected format. Try refreshing and starting again.");
        return;
      }

      const runId = draftData.run_id;
      const startResponse = await fetch(`/api/runs/${runId}/start`, {
        method: "POST",
      });
      if (!startResponse.ok) {
        const startData = (await startResponse
          .json()
          .catch(() => ({}))) as { error?: string };
        setError(startData.error ?? "Your run couldn't start right now. Give it another try.");
        return;
      }

      router.push(`/assessment?run_id=${encodeURIComponent(runId)}`);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Something unexpected happened. Refresh and try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      {lockMessage ? (
        <section className="glass-card p-6">
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--brand-gold, #F8D011)' }}>Access Restricted</p>
          <h2 className="mt-2 text-lg font-semibold" style={{ color: 'var(--text-on-dark, #FFFEF5)' }}>Run Access Locked</h2>
          <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary, rgba(255,255,255,0.75))' }}>{lockMessage}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/upgrade" className="btn-primary">
              Go to Upgrade
            </Link>
            <Link href="/portal" className="btn-watch">
              Back to Portal
            </Link>
          </div>
        </section>
      ) : null}

      {/* Dimming carry-forward card (#11) */}
      {dimmingResult && !lockMessage && (
        <section
          className="glass-card p-5 mb-4"
          style={{ borderColor: 'rgba(248, 208, 17, 0.25)' }}
        >
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--brand-gold, #F8D011)' }}>
            Your Stability Check
          </p>
          <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-on-dark, #FFFEF5)' }}>
            Your check found{' '}
            <span style={{ color: 'var(--brand-gold, #F8D011)' }}>
              {dimmingResult.level.toLowerCase()} coverage
            </span>
            {' '}on{' '}
            <span style={{ color: 'var(--brand-gold, #F8D011)' }}>
              {dimmingResult.primaryRayName}
            </span>
            . The full assessment maps all 9 rays — not just the three from the quick check.
          </p>
        </section>
      )}

      {/* Time estimate + proof framing (#12) */}
      {!lockMessage && (
        <section className="glass-card p-5 mb-4">
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--brand-gold, #F8D011)' }}>
            What You Are About To Get
          </p>
          <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary, rgba(255,255,255,0.75))' }}>
            143 questions. Most finish in 12–18 minutes. Auto-saves — close and come back anytime.
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {[
              { num: '143', label: 'behavioural data points' },
              { num: '36', label: 'subfacets mapped' },
              { num: '9', label: 'trainable capacities scored' },
              { num: '1', label: 'personalized Rise Path' },
            ].map((item) => (
              <div key={item.label} className="flex items-baseline gap-2">
                <span className="text-lg font-bold tabular-nums" style={{ color: 'var(--brand-gold, #F8D011)' }}>{item.num}</span>
                <span className="text-xs" style={{ color: 'var(--text-on-dark-muted, rgba(255,255,255,0.5))' }}>{item.label}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      <form onSubmit={onSubmit} className="glass-card p-6">
        <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--brand-gold, #F8D011)' }}>Configure</p>
        <h2 className="mt-2 text-lg font-semibold" style={{ color: 'var(--text-on-dark, #FFFEF5)' }}>Set Your Context</h2>
        <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary, rgba(255,255,255,0.75))' }}>
          Choose the lens for your assessment. Your first run maps all 143 behavioural
          capacities across the 9 Rays. Weekly retakes use the focused 43-question
          tracking set to measure real change over time.
        </p>

        {error ? (
          <p className="mt-3 text-sm text-rose-400" role="alert">
            {error}
          </p>
        ) : null}

        <label
          className="mt-5 block text-xs font-bold uppercase tracking-widest"
          style={{ color: 'var(--brand-gold, #F8D011)' }}
          htmlFor="context_scope"
        >
          Context
        </label>
        <p className="mt-1 text-xs" style={{ color: 'var(--text-on-dark-muted, rgba(255,255,255,0.5))' }}>
          Are you reflecting on work behaviours, life behaviours, or both?
        </p>
        <select
          id="context_scope"
          name="context_scope"
          className="mt-2 w-full rounded-xl px-4 py-2.5 text-sm outline-none transition-colors focus:ring-2 focus:ring-brand-gold/40"
          style={{
            background: 'var(--surface-glass, rgba(255,255,255,0.06))',
            border: '1px solid var(--surface-border, rgba(255,255,255,0.10))',
            color: 'var(--text-on-dark, #FFFEF5)',
          }}
          value={contextScope}
          onChange={(event) => setContextScope(event.target.value)}
          disabled={submitting}
        >
          {CONTEXT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value} style={{ background: 'var(--bg-deep)', color: 'var(--color-outline-white)' }}>
              {option.label}
            </option>
          ))}
        </select>

        <label
          className="mt-5 block text-xs font-bold uppercase tracking-widest"
          style={{ color: 'var(--brand-gold, #F8D011)' }}
          htmlFor="focus_area"
        >
          Focus Area
        </label>
        <p className="mt-1 text-xs" style={{ color: 'var(--text-on-dark-muted, rgba(255,255,255,0.5))' }}>
          What matters most to you right now? This shapes your Rise Path recommendations.
        </p>
        <select
          id="focus_area"
          name="focus_area"
          className="mt-2 w-full rounded-xl px-4 py-2.5 text-sm outline-none transition-colors focus:ring-2 focus:ring-brand-gold/40"
          style={{
            background: 'var(--surface-glass, rgba(255,255,255,0.06))',
            border: '1px solid var(--surface-border, rgba(255,255,255,0.10))',
            color: 'var(--text-on-dark, #FFFEF5)',
          }}
          value={focusArea}
          onChange={(event) => setFocusArea(event.target.value)}
          disabled={submitting}
        >
          {FOCUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value} style={{ background: 'var(--bg-deep)', color: 'var(--color-outline-white)' }}>
              {option.label}
            </option>
          ))}
        </select>

        <div className="mt-6 flex flex-wrap gap-3">
          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? "Starting..." : "Start Assessment"}
          </button>
          <Link href="/portal" className="btn-watch">
            Back to Portal
          </Link>
        </div>
      </form>
    </>
  );
}
