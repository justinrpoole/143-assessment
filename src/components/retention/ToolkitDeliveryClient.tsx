"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

interface ToolkitDeliveryClientProps {
  isAuthenticated: boolean;
}

const COOKIE_KEY = "143_email_captured";

function hasCapturedEmail(): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie.includes(COOKIE_KEY);
}

function setCapturedCookie() {
  document.cookie = `${COOKIE_KEY}=1; path=/; max-age=${60 * 60 * 24 * 90}`; // 90 days
}

export function ToolkitDeliveryClient(_props: ToolkitDeliveryClientProps) {
  const [captured, setCaptured] = useState(false);
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (hasCapturedEmail()) setCaptured(true);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !trimmed.includes("@")) {
      setError("That email doesn't look right — double check it.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      // Single endpoint: captures email + queues kit delivery (no auth required)
      const res = await fetch("/api/toolkit/deliver-anonymous", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed, source_route: "/143", toolkit_version: "v1" }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error ?? "delivery_failed");
      }

      setCapturedCookie();
      setCaptured(true);
    } catch {
      setError("We could not send the workbook email right now. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (captured) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold/10">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 13l4 4L19 7" stroke="var(--gold-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-body">
              Your 143 Challenge Kit is confirmed.
            </p>
            <p className="text-xs text-muted">
              Check your inbox for the workbook PDF + your /143 unlock link.
            </p>
          </div>
        </div>
        <p className="text-sm leading-relaxed text-secondary">
          Start the protocol above while you wait. When you are ready to see
          your full pattern, the Stability Check takes 3 minutes.
        </p>
        <Link href="/preview" className="btn-watch inline-block">
          Take the Free Stability Check
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm leading-relaxed text-secondary">
        Enter your email and we will send you the full Challenge Kit —
        daily instructions, the RAS Reset audio guide, printable tracker,
        and the science brief, plus your secure unlock link. One follow-up.
        Nothing else unless you ask.
      </p>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          className="flex-1 rounded-xl border border-stroke bg-surface/35 px-4 py-2.5 text-sm text-body outline-none transition-colors focus:ring-2 focus:ring-brand-gold/40"
          disabled={submitting}
        />
        <button
          type="submit"
          className="btn-primary shrink-0"
          disabled={submitting || !email.trim()}
        >
          {submitting ? "Sending..." : "Send My Challenge Kit"}
        </button>
      </form>
      {error && (
        <p className="text-sm text-rose-400" role="alert">{error}</p>
      )}
    </div>
  );
}
