"use client";
/**
 * /assessment/scoring — The "Your OS is being mapped" screen
 *
 * WHAT THIS PAGE DOES (in order):
 * 1. Reads run_id from the URL
 * 2. Immediately calls POST /api/runs/[runId]/complete — this triggers the
 *    scoring pipeline (07A-07H) and writes results to Supabase
 * 3. Shows a Ray-by-Ray animation while the API call runs
 * 4. Once scoring is done (or animation finishes, whichever is later),
 *    redirects to /results?run_id=...
 *
 * WHY: The previous version skipped the API call entirely — users saw the
 * animation but their assessment was never actually scored.
 */

import { Suspense } from "react";
import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const RAYS = [
  { name: "Intention",    color: "#F8D011" },
  { name: "Joy",          color: "#FF6B35" },
  { name: "Presence",     color: "#7C3AED" },
  { name: "Power",        color: "#EC4899" },
  { name: "Purpose",      color: "#06B6D4" },
  { name: "Authenticity", color: "#10B981" },
  { name: "Connection",   color: "#F59E0B" },
  { name: "Possibility",  color: "#8B5CF6" },
  { name: "Be The Light", color: "#FFFFFF" },
];

// How long each Ray "lights up" during the animation (ms)
const RAY_INTERVAL_MS = 350;
// Minimum time to show the animation before redirecting (ms)
const MIN_DISPLAY_MS = RAYS.length * RAY_INTERVAL_MS + 900;

type ScoringStatus = "scoring" | "done" | "error";

function ScoringInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const runId = searchParams.get("run_id");

  // How many Rays have "lit up" in the animation
  const [visible, setVisible] = useState(0);

  // Whether the animation sequence is complete
  const [animDone, setAnimDone] = useState(false);

  // Whether the API call has finished
  const [scoringStatus, setScoringStatus] = useState<ScoringStatus>("scoring");

  // Error message if scoring failed
  const [errorMsg, setErrorMsg] = useState<string>("");

  // Prevent double-calling the API
  const hasCalled = useRef(false);

  // ── Step 1: Call the scoring API immediately on mount ──────────────────────
  useEffect(() => {
    if (!runId || hasCalled.current) return;
    hasCalled.current = true;

    async function scoreRun() {
      try {
        const res = await fetch(`/api/runs/${runId}/complete`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          // "completed_run_missing_results" means it was already scored — that's OK
          if (body.error === "completed_run_missing_results") {
            setScoringStatus("error");
            setErrorMsg("Your results were saved but something went wrong retrieving them. Try refreshing.");
            return;
          }
          // Any other error
          setErrorMsg(body.error ?? `Server error (${res.status})`);
          setScoringStatus("error");
          return;
        }

        // Scoring succeeded
        setScoringStatus("done");
      } catch (err) {
        setErrorMsg(err instanceof Error ? err.message : "Network error");
        setScoringStatus("error");
      }
    }

    void scoreRun();
  }, [runId]);

  // ── Step 2: Animate Rays lighting up one by one ───────────────────────────
  useEffect(() => {
    const t = setInterval(() => {
      setVisible((p) => {
        if (p >= RAYS.length) {
          clearInterval(t);
          setAnimDone(true);
          return p;
        }
        return p + 1;
      });
    }, RAY_INTERVAL_MS);
    return () => clearInterval(t);
  }, []);

  // ── Step 3: Redirect once BOTH animation AND scoring are done ─────────────
  useEffect(() => {
    if (!animDone || scoringStatus === "scoring") return;
    if (scoringStatus === "error") return; // Stay on page to show error

    // Small pause so "Your map is ready" message is readable
    const t = setTimeout(() => {
      router.push(runId ? `/results?run_id=${runId}` : "/results");
    }, 900);
    return () => clearTimeout(t);
  }, [animDone, scoringStatus, runId, router]);

  const isReady = animDone && scoringStatus === "done";

  // ── Error state ───────────────────────────────────────────────────────────
  if (scoringStatus === "error") {
    return (
      <main className="cosmic-page-bg min-h-screen flex items-center justify-center px-5">
        <div className="text-center max-w-sm space-y-5">
          <p className="text-2xl">⚠️</p>
          <h1 className="text-xl font-bold text-white">Something went wrong</h1>
          <p className="text-sm" style={{ color: "var(--text-on-dark-secondary)" }}>
            {errorMsg || "Your responses were saved. We hit an issue scoring them."}
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => {
                hasCalled.current = false;
                setScoringStatus("scoring");
                setErrorMsg("");
              }}
              className="btn-primary px-6 py-3 text-sm"
            >
              Try Again
            </button>
            {runId && (
              <button
                onClick={() => router.push(`/results?run_id=${runId}`)}
                className="btn-secondary px-6 py-3 text-sm"
              >
                View Results Anyway
              </button>
            )}
          </div>
        </div>
      </main>
    );
  }

  // ── Normal scoring animation ───────────────────────────────────────────────
  return (
    <main className="cosmic-page-bg min-h-screen flex items-center justify-center">
      <div className="text-center px-6 py-16 max-w-sm mx-auto">
        <p className="gold-tag inline-block mb-6">Calibrating</p>

        <h1 className="text-2xl font-bold text-white mb-2">
          {isReady ? "Your map is ready." : "Reading your signal..."}
        </h1>

        <p className="text-sm mb-8" style={{ color: "var(--text-on-dark-secondary)" }}>
          {isReady
            ? "Revealing your 9 Rays now."
            : scoringStatus === "scoring"
            ? "Calculating your 9 capacities."
            : "Processing your results."}
        </p>

        {/* Ray-by-Ray animation */}
        <div className="space-y-3">
          {RAYS.map((ray, i) => (
            <div
              key={ray.name}
              className="flex items-center gap-3 glass-card px-4 py-2.5 transition-all duration-400"
              style={{
                opacity: i < visible ? 1 : 0,
                transform: i < visible ? "none" : "translateX(-10px)",
              }}
            >
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{
                  backgroundColor: ray.color,
                  boxShadow: `0 0 8px ${ray.color}`,
                }}
              />
              <span className="text-sm font-medium" style={{ color: ray.color }}>
                {ray.name}
              </span>
              {i < visible && (
                <span className="ml-auto text-xs text-green-400">✓</span>
              )}
            </div>
          ))}
        </div>

        {isReady && (
          <p className="mt-8 text-sm font-semibold" style={{ color: "#FFD35A" }}>
            Opening your results...
          </p>
        )}

        {/* Show a subtle "still working" state if scoring takes longer than animation */}
        {animDone && scoringStatus === "scoring" && (
          <p className="mt-8 text-xs animate-pulse" style={{ color: "var(--text-on-dark-secondary)" }}>
            Finalizing your profile...
          </p>
        )}
      </div>
    </main>
  );
}

export default function AssessmentScoringPage() {
  return (
    <Suspense fallback={<main className="cosmic-page-bg min-h-screen" />}>
      <ScoringInner />
    </Suspense>
  );
}
