"use client";

import { type FormEvent, useState } from "react";
import { useSearchParams } from "next/navigation";

const DEV_TEST_EMAIL = process.env.NODE_ENV === "development" ? "test@143leadership.com" : "";
const PREVIEW_EMAIL = process.env.NEXT_PUBLIC_BETA_PREVIEW_EMAIL ?? "";
const DEFAULT_BETA_EMAIL = PREVIEW_EMAIL || DEV_TEST_EMAIL;

type FormState = "idle" | "sending" | "sent" | "error";

export function MagicLinkFormClient() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? searchParams.get("source_route") ?? "/portal";
  const [email, setEmail] = useState("");
  const [state, setState] = useState<FormState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim()) return;

    setState("sending");
    setErrorMessage(null);

    try {
      const response = await fetch("/api/auth/login/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), next }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => ({}))) as { error?: string };
        throw new Error(
          typeof data.error === "string" ? data.error : "Could not send sign-in link.",
        );
      }

      setState("sent");
    } catch (err) {
      setState("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (state === "sent") {
    return (
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full" style={{ background: 'rgba(248,208,17,0.15)', boxShadow: '0 0 20px rgba(248, 208, 17, 0.15)' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M3 8l9 6 9-6" stroke="#F8D011" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="3" y="6" width="18" height="12" rx="2" stroke="#F8D011" strokeWidth="1.5" />
          </svg>
        </div>
        <p className="score-reveal text-sm font-semibold" style={{ color: 'var(--text-on-dark, #FFFEF5)' }}>
          Check your email.
        </p>
        <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary, rgba(255,255,255,0.75))' }}>
          We sent a secure sign-in link to <strong style={{ color: 'var(--brand-gold, #F8D011)', textShadow: '0 0 8px rgba(248, 208, 17, 0.3)' }}>{email}</strong>.
          Click the link in the email to sign in. The link expires in 15 minutes.
        </p>
        <button
          type="button"
          className="mt-4 text-sm font-semibold underline underline-offset-2 transition-colors hover:text-brand-gold"
          style={{ color: 'var(--text-on-dark-muted, rgba(255,255,255,0.5))' }}
          onClick={() => {
            setState("idle");
            setEmail("");
          }}
        >
          Use a different email
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit}>
      <label
        htmlFor="login-email"
        className="block text-xs font-bold uppercase tracking-widest"
        style={{ color: 'var(--brand-gold, #F8D011)' }}
      >
        Email Address
      </label>
      <input
        id="login-email"
        type="email"
        required
        autoComplete="email"
        placeholder="you@yourcompany.com"
        className="mt-2 w-full rounded-xl px-4 py-3 text-sm outline-none transition-colors focus:ring-2 focus:ring-brand-gold/40"
        style={{
          background: 'var(--surface-glass, rgba(255,255,255,0.06))',
          border: '1px solid var(--surface-border, rgba(255,255,255,0.10))',
          color: 'var(--text-on-dark, #FFFEF5)',
        }}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={state === "sending"}
      />

      {errorMessage && (
        <p className="mt-2 text-sm text-rose-400" role="alert">
          {errorMessage}
        </p>
      )}

      <button
        type="submit"
        className="btn-primary mt-4 w-full"
        disabled={state === "sending" || !email.trim()}
      >
        {state === "sending" ? "Sending..." : "Send Sign-In Link"}
      </button>

      {/* Beta login — works in production when BETA_FREE_MODE=true */}
      <button
        type="button"
        className="mt-3 w-full rounded-xl border border-dashed px-4 py-3 text-sm font-medium transition-colors"
        style={{ borderColor: 'rgba(248, 208, 17, 0.3)', background: 'rgba(248, 208, 17, 0.05)', color: 'var(--brand-gold)' }}
        disabled={state === "sending"}
        onClick={async () => {
          const loginEmail = email.trim() || DEFAULT_BETA_EMAIL;
          setState("sending");
          setErrorMessage(null);
          try {
            // Try beta-login endpoint first (works in production with BETA_FREE_MODE=true)
            const res = await fetch("/api/auth/beta-login", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email: loginEmail, next }),
            });
            const data = await res.json();
            if (data.verify_url) {
              window.location.href = data.verify_url;
              return;
            }
            // Fallback: try dev magic link (local dev only)
            const devRes = await fetch("/api/auth/login/request", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email: loginEmail, next }),
            });
            const devData = await devRes.json();
            if (devData.dev_magic_link) {
              window.location.href = devData.dev_magic_link;
            } else {
              throw new Error("Beta login not available. Check BETA_FREE_MODE setting.");
            }
          } catch (err) {
            setState("error");
            setErrorMessage(err instanceof Error ? err.message : "Beta login failed.");
          }
        }}
      >
        {state === "sending"
          ? "Logging in..."
          : (() => {
              const labelEmail = email.trim() || DEFAULT_BETA_EMAIL;
              return labelEmail ? `Beta Login (${labelEmail})` : "Beta Login";
            })()}
      </button>
    </form>
  );
}
