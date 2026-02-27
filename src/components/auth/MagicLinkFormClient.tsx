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

      const data = (await response.json().catch(() => ({}))) as { dev_magic_link?: string };
      if (data.dev_magic_link) {
        window.location.href = data.dev_magic_link;
        return;
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

  const googleAuthUrl = `/api/auth/google/authorize?source_route=${encodeURIComponent(next)}`;

  return (
    <div>
      {/* Google Sign-In */}
      <a
        href={googleAuthUrl}
        className="flex w-full items-center justify-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all hover:shadow-lg"
        style={{
          background: '#ffffff',
          color: '#3c4043',
          border: '1px solid #dadce0',
        }}
      >
        <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
          <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4" />
          <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853" />
          <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.997 8.997 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05" />
          <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335" />
        </svg>
        Sign in with Google
      </a>

      {/* Divider */}
      <div className="my-5 flex items-center gap-3">
        <div className="h-px flex-1" style={{ background: 'var(--surface-border, rgba(255,255,255,0.10))' }} />
        <span className="text-xs font-medium uppercase tracking-widest" style={{ color: 'var(--text-on-dark-muted, rgba(255,255,255,0.4))' }}>
          or
        </span>
        <div className="h-px flex-1" style={{ background: 'var(--surface-border, rgba(255,255,255,0.10))' }} />
      </div>

      {/* Email Magic Link Form */}
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
    </div>
  );
}
