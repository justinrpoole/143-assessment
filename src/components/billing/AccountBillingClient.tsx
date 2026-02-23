"use client";

import { useState } from "react";

import type { UserState } from "@/lib/auth/user-state";
import { humanizeError } from "@/lib/ui/error-messages";

interface AccountBillingClientProps {
  userState: UserState;
  hasStripeCustomer: boolean;
}

interface PortalResponse {
  url?: string;
  error?: string;
  detail?: string;
}

export function AccountBillingClient({
  userState,
  hasStripeCustomer,
}: AccountBillingClientProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  async function openPortal() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/stripe/portal", {
        method: "POST",
      });
      const payload = (await response.json().catch(() => ({}))) as PortalResponse;
      if (!response.ok || typeof payload.url !== "string") {
        setError(payload.error ?? "portal_open_failed");
        return;
      }
      window.location.href = payload.url;
    } catch (requestError) {
      setError(
        requestError instanceof Error ? requestError.message : "portal_open_failed",
      );
    } finally {
      setLoading(false);
    }
  }

  const canOpenPortal =
    hasStripeCustomer &&
    (userState === "sub_active" ||
      userState === "sub_canceled" ||
      userState === "past_due");

  return (
    <section className="glass-card p-6 sm:p-8 space-y-4">
      <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--brand-gold, #F8D011)' }}>Billing</p>
      <h2 className="text-xl font-semibold" style={{ color: 'var(--text-on-dark)' }}>Manage Your Subscription</h2>
      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
        Current plan: <code className="rounded px-1.5 py-0.5 text-xs" style={{ background: 'rgba(96, 5, 141, 0.25)', color: 'var(--text-on-dark)' }}>{userState}</code>
      </p>
      {error ? (
        <p className="mt-3 text-sm text-rose-700" role="alert">
          {humanizeError(error)}
        </p>
      ) : null}
      {canOpenPortal ? (
        <button
          type="button"
          className="btn-primary mt-4"
          onClick={() => void openPortal()}
          disabled={loading}
        >
          {loading ? "Opening..." : "Manage subscription"}
        </button>
      ) : (
        <p className="mt-3 text-sm text-[var(--ink-soft)]">
          Stripe portal will appear once a subscription customer profile is available.
        </p>
      )}
    </section>
  );
}
