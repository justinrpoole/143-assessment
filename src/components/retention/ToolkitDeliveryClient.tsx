"use client";

import Link from "next/link";
import { useState } from "react";

interface ToolkitDeliveryClientProps {
  isAuthenticated: boolean;
}

interface ToolkitDeliverResponse {
  status?: string;
  email_job_id?: string;
  error?: string;
  detail?: string;
}

export function ToolkitDeliveryClient({ isAuthenticated }: ToolkitDeliveryClientProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);

  async function onDeliver() {
    setLoading(true);
    setError(null);
    setJobId(null);
    try {
      const response = await fetch("/api/toolkit/deliver", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source_route: "/toolkit",
          toolkit_version: "v1",
        }),
      });
      const payload = (await response.json().catch(() => ({}))) as ToolkitDeliverResponse;
      if (!response.ok) {
        setError(payload.error ?? "toolkit_delivery_failed");
        return;
      }
      setJobId(payload.email_job_id ?? null);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "toolkit_delivery_failed",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="glass-card p-6 sm:p-8 space-y-4">
      <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--brand-gold, #F8D011)' }}>Challenge Kit</p>
      <h2 className="text-xl font-semibold" style={{ color: 'var(--text-on-dark)' }}>Get Your 143 Challenge Kit</h2>
      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>Confirm delivery to activate reminders and follow-up guidance.</p>
      {isAuthenticated ? (
        <button
          type="button"
          className="btn-primary mt-4"
          disabled={loading}
          onClick={() => void onDeliver()}
        >
          {loading ? "Sending..." : "Send My Challenge Kit"}
        </button>
      ) : (
        <p className="mt-4 text-sm text-[var(--ink-soft)]">
          <Link href="/login" className="text-[var(--ray-purple)] underline">
            Log in
          </Link>{" "}
          to receive the kit by email.
        </p>
      )}
      {jobId ? (
        <p className="mt-3 text-sm text-emerald-700">
          Kit delivery confirmed. Email job queued: <code>{jobId}</code>
        </p>
      ) : null}
      {error ? (
        <p className="mt-3 text-sm text-rose-700" role="alert">
          {error}
        </p>
      ) : null}
    </section>
  );
}
