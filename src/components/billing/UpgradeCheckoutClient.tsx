"use client";

import Link from "next/link";
import { useState } from "react";
import { humanizeError } from "@/lib/ui/error-messages";

type CheckoutMode = "paid_43" | "subscription";

interface CheckoutResponse {
  url?: string;
  error?: string;
  detail?: string;
}

async function startCheckout(mode: CheckoutMode): Promise<CheckoutResponse> {
  const response = await fetch("/api/stripe/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      mode,
      successUrl: "/welcome",
      cancelUrl: "/upgrade",
    }),
  });

  const payload = (await response.json().catch(() => ({}))) as CheckoutResponse;
  if (!response.ok) {
    return {
      error: payload.error ?? "checkout_start_failed",
      detail: payload.detail,
    };
  }

  return payload;
}

export function UpgradeCheckoutClient() {
  const [loadingMode, setLoadingMode] = useState<CheckoutMode | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onCheckout(mode: CheckoutMode) {
    setLoadingMode(mode);
    setError(null);
    try {
      const payload = await startCheckout(mode);
      if (typeof payload.url !== "string") {
        setError(payload.error ?? "checkout_url_missing");
        return;
      }
      window.location.href = payload.url;
    } finally {
      setLoadingMode(null);
    }
  }

  return (
    <section className="module-placeholder">
      <h2>Checkout</h2>
      <p className="text-sm text-[var(--ink-soft)]">
        Unlock the full 143-question Run #1 for $43 one-time, or start the
        $14.33/month plan for monthly 43-question retakes and growth tracking.
      </p>
      {error ? (
        <p className="mt-3 text-sm text-rose-700" role="alert">
          {humanizeError(error)}
        </p>
      ) : null}
      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          className="btn-primary"
          onClick={() => void onCheckout("paid_43")}
          disabled={loadingMode !== null}
        >
          {loadingMode === "paid_43" ? "Opening..." : "Unlock Run #1 ($43)"}
        </button>
        <button
          type="button"
          className="btn-watch"
          onClick={() => void onCheckout("subscription")}
          disabled={loadingMode !== null}
        >
          {loadingMode === "subscription"
            ? "Opening..."
            : "Monthly 43-question retakes ($14.33/mo)"}
        </button>
      </div>
      <p className="mt-3 text-xs text-[var(--ink-soft)]">
        Not signed in yet? <Link href="/login">Use magic link login first.</Link>
      </p>

      {/* Trust strip */}
      <div
        className="mt-6 rounded-lg p-4"
        style={{
          background: 'rgba(96, 5, 141, 0.15)',
          border: '1px solid rgba(248, 208, 17, 0.15)',
        }}
      >
        <div className="flex items-start gap-3">
          <span className="shrink-0 text-lg" aria-hidden="true">&#x1F6E1;</span>
          <div>
            <p className="text-sm font-semibold" style={{ color: 'var(--text-on-dark, #FFFEF5)' }}>
              The Justin Ray Guarantee
            </p>
            <p className="mt-1 text-xs leading-relaxed" style={{ color: 'var(--text-on-dark-secondary, rgba(255,255,255,0.75))' }}>
              If this report does not name a pattern you recognise in your own leadership, I
              will refund you. No questions. No hoops. Your data stays yours either way.
            </p>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-4 text-[10px] font-medium uppercase tracking-widest" style={{ color: 'var(--text-on-dark-muted, rgba(255,255,255,0.45))' }}>
          <span>Secure checkout via Stripe</span>
          <span aria-hidden="true">&#x2022;</span>
          <span>256-bit SSL encryption</span>
        </div>
      </div>
    </section>
  );
}
