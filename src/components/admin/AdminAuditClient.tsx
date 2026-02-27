"use client";

import { useEffect, useState } from "react";
import CosmicSkeleton from "@/components/ui/CosmicSkeleton";

interface AuditRun {
  run_id: string;
  user_id: string;
  status: string;
  created_at: string;
  completed_at: string | null;
  scorer_version: string | null;
  input_hash: string | null;
  output_hash: string | null;
  has_signature: boolean;
}

interface AuditStats {
  total_runs: number;
  completed_runs: number;
  avg_completion_minutes: number | null;
}

interface AuditPayload {
  stats: AuditStats;
  runs: AuditRun[];
}

function shortHash(hash: string | null): string {
  if (!hash) return "\u2014";
  return `${hash.slice(0, 8)}\u2026${hash.slice(-6)}`;
}

function formatDate(iso: string | null): string {
  if (!iso) return "\u2014";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function AdminAuditClient() {
  const [data, setData] = useState<AuditPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let canceled = false;
    async function load() {
      try {
        const res = await fetch("/api/admin/audit");
        if (canceled) return;
        if (!res.ok) throw new Error("Failed to load audit data");
        const payload = (await res.json()) as AuditPayload;
        if (!canceled) setData(payload);
      } catch (e) {
        if (!canceled) setError(e instanceof Error ? e.message : "Unknown error");
      } finally {
        if (!canceled) setLoading(false);
      }
    }
    void load();
    return () => { canceled = true; };
  }, []);

  if (loading) {
    return <CosmicSkeleton rows={3} height="h-16" />;
  }

  if (error) {
    return (
      <div className="glass-card p-6">
        <p className="text-sm text-red-400">{error}</p>
      </div>
    );
  }

  if (!data) return null;

  const { stats, runs } = data;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="glass-surface rounded-lg p-5 text-center">
          <p className="text-3xl font-bold text-brand-gold">
            {stats.total_runs}
          </p>
          <p
            className="text-xs mt-1"
            style={{ color: "var(--text-on-dark-secondary)" }}
          >
            Total Runs
          </p>
        </div>
        <div className="glass-surface rounded-lg p-5 text-center">
          <p className="text-3xl font-bold text-brand-gold">
            {stats.completed_runs}
          </p>
          <p
            className="text-xs mt-1"
            style={{ color: "var(--text-on-dark-secondary)" }}
          >
            Completed
          </p>
        </div>
        <div className="glass-surface rounded-lg p-5 text-center">
          <p className="text-3xl font-bold text-brand-gold">
            {stats.avg_completion_minutes != null
              ? `${stats.avg_completion_minutes}m`
              : "\u2014"}
          </p>
          <p
            className="text-xs mt-1"
            style={{ color: "var(--text-on-dark-secondary)" }}
          >
            Avg Completion
          </p>
        </div>
      </div>

      {/* Runs Table */}
      <div className="glass-card overflow-hidden" style={{ borderTop: '2px solid var(--brand-gold, #F8D011)' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr
                className="border-b"
                style={{ borderColor: "var(--surface-border)", background: 'rgba(248, 208, 17, 0.03)' }}
              >
                <th
                  className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider"
                  style={{ color: "var(--text-on-dark-muted)" }}
                >
                  Run ID
                </th>
                <th
                  className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider"
                  style={{ color: "var(--text-on-dark-muted)" }}
                >
                  Completed
                </th>
                <th
                  className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider"
                  style={{ color: "var(--text-on-dark-muted)" }}
                >
                  Version
                </th>
                <th
                  className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider"
                  style={{ color: "var(--text-on-dark-muted)" }}
                >
                  Input Hash
                </th>
                <th
                  className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider"
                  style={{ color: "var(--text-on-dark-muted)" }}
                >
                  Output Hash
                </th>
                <th
                  className="text-center px-4 py-3 text-xs font-semibold uppercase tracking-wider"
                  style={{ color: "var(--text-on-dark-muted)" }}
                >
                  Verified
                </th>
              </tr>
            </thead>
            <tbody>
              {runs.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-8 text-center"
                    style={{ color: "var(--text-on-dark-muted)" }}
                  >
                    No completed runs yet.
                  </td>
                </tr>
              )}
              {runs.map((run) => (
                <tr
                  key={run.run_id}
                  className="border-b last:border-b-0 hover:bg-white/5 transition-colors"
                  style={{ borderColor: "var(--surface-border)" }}
                >
                  <td
                    className="px-4 py-3 font-mono text-xs"
                    style={{ color: "var(--text-on-dark)" }}
                  >
                    {run.run_id.slice(0, 8)}
                  </td>
                  <td
                    className="px-4 py-3 text-xs"
                    style={{ color: "var(--text-on-dark-secondary)" }}
                  >
                    {formatDate(run.completed_at)}
                  </td>
                  <td
                    className="px-4 py-3 text-xs"
                    style={{ color: "var(--text-on-dark-secondary)" }}
                  >
                    {run.scorer_version ?? "\u2014"}
                  </td>
                  <td
                    className="px-4 py-3 font-mono text-xs"
                    style={{ color: "var(--text-on-dark-muted)" }}
                  >
                    {shortHash(run.input_hash)}
                  </td>
                  <td
                    className="px-4 py-3 font-mono text-xs"
                    style={{ color: "var(--text-on-dark-muted)" }}
                  >
                    {shortHash(run.output_hash)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {run.has_signature ? (
                      <span className="gold-tag inline-block text-[10px] font-semibold">
                        Verified
                      </span>
                    ) : (
                      <span className="text-amber-400 text-xs font-semibold" style={{ opacity: 0.7 }}>
                        Pending
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
