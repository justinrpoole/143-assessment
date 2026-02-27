"use client";

import { useState, useMemo } from "react";

/**
 * Growth Trajectory Visualization (#17)
 *
 * Shows the user's leadership growth trajectory over time — not just
 * current scores, but the DIRECTION and VELOCITY of change.
 *
 * "Your Presence is at 68 and accelerating. Your Joy hit a plateau
 * at 55 — here's a targeted practice to break through."
 *
 * This is Strava's fitness tracking applied to leadership capacity —
 * showing not just where you are, but where you're headed.
 */

/* ── Types ─────────────────────────────────────────────────── */

interface RayDataPoint {
  run_number: number;
  completed_at: string;
  net_energy: number;
}

interface RayTrajectory {
  ray_number: number;
  ray_name: string;
  data: RayDataPoint[];
  current: number;
  delta: number;
  direction: "accelerating" | "steady" | "plateau" | "declining";
  velocity: number; // points per run
}

interface GrowthTrajectoryProps {
  runs: Array<{
    run_number: number;
    completed_at: string;
    ray_scores: Record<string, number>;
  }>;
}

/* ── Constants ─────────────────────────────────────────────── */

const RAY_NAMES: Record<string, string> = {
  R1: "Intention",
  R2: "Joy",
  R3: "Presence",
  R4: "Power",
  R5: "Purpose",
  R6: "Authenticity",
  R7: "Connection",
  R8: "Possibility",
  R9: "Be The Light",
};

const DIRECTION_LABELS: Record<string, { label: string; color: string }> = {
  accelerating: { label: "Accelerating", color: "#22c55e" },
  steady: { label: "Steady", color: "#F8D011" },
  plateau: { label: "Plateau", color: "rgba(255,255,255,0.4)" },
  declining: { label: "Declining", color: "#ef4444" },
};

/* ── Component ─────────────────────────────────────────────── */

export default function GrowthTrajectory({ runs }: GrowthTrajectoryProps) {
  const [selectedRay, setSelectedRay] = useState<string | null>(null);

  const trajectories = useMemo(() => {
    if (runs.length < 2) return [];

    const sorted = [...runs].sort((a, b) => a.run_number - b.run_number);

    return Object.keys(RAY_NAMES).map((rayKey) => {
      const data: RayDataPoint[] = sorted.map((run) => ({
        run_number: run.run_number,
        completed_at: run.completed_at,
        net_energy: run.ray_scores[rayKey] ?? 0,
      }));

      const scores = data.map((d) => d.net_energy);
      const current = scores[scores.length - 1];
      const previous = scores.length >= 2 ? scores[scores.length - 2] : current;
      const delta = current - previous;

      // Calculate velocity (average change per run over last 3 runs)
      const recentScores = scores.slice(-3);
      let velocity = 0;
      if (recentScores.length >= 2) {
        const deltas = [];
        for (let i = 1; i < recentScores.length; i++) {
          deltas.push(recentScores[i] - recentScores[i - 1]);
        }
        velocity = deltas.reduce((a, b) => a + b, 0) / deltas.length;
      }

      // Determine direction
      let direction: RayTrajectory["direction"];
      if (velocity > 2) direction = "accelerating";
      else if (velocity > 0.5) direction = "steady";
      else if (velocity > -1) direction = "plateau";
      else direction = "declining";

      return {
        ray_number: parseInt(rayKey.slice(1)),
        ray_name: RAY_NAMES[rayKey],
        data,
        current,
        delta,
        direction,
        velocity,
      } as RayTrajectory;
    });
  }, [runs]);

  if (runs.length < 2) {
    return (
      <div className="glass-card p-6 text-center space-y-3">
        <p
          className="text-xs font-bold uppercase tracking-widest"
          style={{ color: "var(--brand-gold, #F8D011)" }}
        >
          Light Trajectory
        </p>
        <p
          className="text-sm leading-relaxed"
          style={{ color: "var(--text-on-dark-muted, rgba(255,255,255,0.5))" }}
        >
          Complete your second assessment to unlock trajectory tracking.
          One data point shows where you are. Two show where you are headed.
        </p>
      </div>
    );
  }

  const active = selectedRay
    ? trajectories.find((t) => `R${t.ray_number}` === selectedRay)
    : null;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p
          className="text-xs font-bold uppercase tracking-widest"
          style={{ color: "var(--brand-gold, #F8D011)" }}
        >
          Light Trajectory
        </p>
        <p
          className="text-sm leading-relaxed"
          style={{ color: "var(--text-on-dark-secondary, rgba(255,255,255,0.75))" }}
        >
          Not just where you are — where you are headed.
        </p>
      </div>

      {/* ── Ray Grid ───────────────────────────────────────── */}
      <div className="grid gap-2 sm:grid-cols-3">
        {trajectories.map((t) => {
          const dir = DIRECTION_LABELS[t.direction];
          const isSelected = selectedRay === `R${t.ray_number}`;

          return (
            <button
              key={t.ray_number}
              onClick={() =>
                setSelectedRay(isSelected ? null : `R${t.ray_number}`)
              }
              className="glass-card p-3 text-left transition-all"
              style={{
                borderColor: isSelected
                  ? "var(--brand-gold, #F8D011)"
                  : "transparent",
                borderWidth: "1px",
                borderStyle: "solid",
              }}
            >
              <div className="flex items-center justify-between">
                <span
                  className="text-xs font-bold"
                  style={{ color: "var(--brand-gold, #F8D011)" }}
                >
                  {t.ray_name}
                </span>
                <span
                  className="text-[10px] font-medium px-1.5 py-0.5 rounded-full"
                  style={{
                    color: dir.color,
                    background: `${dir.color}15`,
                  }}
                >
                  {dir.label}
                </span>
              </div>
              <div className="mt-1 flex items-baseline gap-2">
                <span
                  className="text-lg font-bold"
                  style={{
                    color: "var(--text-on-dark, #FFFEF5)",
                    fontFamily: "var(--font-cosmic-display)",
                  }}
                >
                  {Math.round(t.current)}
                </span>
                <span
                  className="text-xs font-medium"
                  style={{
                    color:
                      t.delta > 0
                        ? "#22c55e"
                        : t.delta < 0
                          ? "#ef4444"
                          : "rgba(255,255,255,0.4)",
                  }}
                >
                  {t.delta > 0 ? "+" : ""}
                  {Math.round(t.delta)}
                </span>
              </div>

              {/* Mini sparkline */}
              <div className="mt-2 h-[24px]">
                <MiniSparkline data={t.data.map((d) => d.net_energy)} />
              </div>
            </button>
          );
        })}
      </div>

      {/* ── Detail Panel ───────────────────────────────────── */}
      {active && (
        <div
          className="glass-card p-5 space-y-3"
          style={{ borderLeft: "3px solid var(--brand-gold, #F8D011)" }}
        >
          <div className="flex items-center justify-between">
            <p
              className="text-sm font-bold"
              style={{ color: "var(--brand-gold, #F8D011)" }}
            >
              {active.ray_name} — Detailed Trajectory
            </p>
            <span
              className="text-xs font-medium"
              style={{ color: DIRECTION_LABELS[active.direction].color }}
            >
              {active.velocity > 0 ? "+" : ""}
              {active.velocity.toFixed(1)} pts/run
            </span>
          </div>

          {/* Run-by-run data */}
          <div className="space-y-1">
            {active.data.map((point, i) => {
              const prev = i > 0 ? active.data[i - 1].net_energy : null;
              const change = prev !== null ? point.net_energy - prev : null;

              return (
                <div
                  key={point.run_number}
                  className="flex items-center gap-3 text-xs"
                >
                  <span
                    className="w-12 shrink-0 font-medium"
                    style={{ color: "rgba(255,255,255,0.4)" }}
                  >
                    Run {point.run_number}
                  </span>
                  <div
                    className="h-2 rounded-full"
                    style={{
                      width: `${Math.max(8, point.net_energy * 0.6)}%`,
                      background:
                        "linear-gradient(90deg, var(--brand-gold) 0%, rgba(248,208,17,0.3) 100%)",
                    }}
                  />
                  <span
                    className="w-8 shrink-0 text-right"
                    style={{ color: "var(--text-on-dark, #FFFEF5)" }}
                  >
                    {Math.round(point.net_energy)}
                  </span>
                  {change !== null && (
                    <span
                      className="w-10 shrink-0 text-right"
                      style={{
                        color:
                          change > 0
                            ? "#22c55e"
                            : change < 0
                              ? "#ef4444"
                              : "rgba(255,255,255,0.3)",
                      }}
                    >
                      {change > 0 ? "+" : ""}
                      {Math.round(change)}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <p
            className="text-xs leading-relaxed italic"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            {active.direction === "accelerating" &&
              `${active.ray_name} is gaining momentum. Your practice is landing. Keep going.`}
            {active.direction === "steady" &&
              `${active.ray_name} is improving at a steady pace. Consistency is working.`}
            {active.direction === "plateau" &&
              `${active.ray_name} has stabilized. Try a new practice variation to break through.`}
            {active.direction === "declining" &&
              `${active.ray_name} needs attention. Focus your daily practice here this week.`}
          </p>
        </div>
      )}
    </div>
  );
}

/* ── Mini Sparkline ────────────────────────────────────────── */

function MiniSparkline({ data }: { data: number[] }) {
  if (data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const w = 100;
  const h = 24;
  const padding = 2;

  const points = data
    .map((v, i) => {
      const x = padding + (i / (data.length - 1)) * (w - padding * 2);
      const y = h - padding - ((v - min) / range) * (h - padding * 2);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className="w-full h-full"
      preserveAspectRatio="none"
    >
      <polyline
        points={points}
        fill="none"
        stroke="#F8D011"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
