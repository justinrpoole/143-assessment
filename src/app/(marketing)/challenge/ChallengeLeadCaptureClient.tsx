"use client";

import { type FormEvent, useState } from "react";

type Status = "idle" | "submitting" | "success" | "error";
type DevDetails = { unlockUrl?: string; tokenHint?: string } | null;

const UNLOCKED_KEY = "143_unlocked";
const UNLOCKED_AT_KEY = "143_unlocked_at";
const EMAIL_KEY = "143_unlock_email";

function persistUnlocked() {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(UNLOCKED_KEY, "true");
  window.localStorage.setItem(UNLOCKED_AT_KEY, Date.now().toString());
}

export default function ChallengeLeadCaptureClient() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [devDetails, setDevDetails] = useState<DevDetails>(null);
  const [code, setCode] = useState("");
  const [unlocking, setUnlocking] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setError(null);
    setMessage(null);
    setDevDetails(null);

    try {
      const normalizedEmail = email.trim().toLowerCase();
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email: normalizedEmail,
          source: "challenge-page",
          redirect: "/143",
        }),
      });

      const payload = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        message?: string;
        dev?: { unlockUrl?: string; tokenHint?: string };
        devOnly?: boolean;
      };
      if (!response.ok) {
        throw new Error(payload.message ?? payload.error ?? "capture_failed");
      }
      if (!payload.ok) {
        throw new Error(payload.message ?? "subscribe_failed");
      }

      window.localStorage.setItem(EMAIL_KEY, normalizedEmail);

      setStatus("success");
      setMessage("Check your email for the workbook PDF and your unlock link.");
      setDevDetails(payload.devOnly ? payload.dev ?? null : null);
    } catch (submitError) {
      setStatus("error");
      setError(
        submitError instanceof Error
          ? submitError.message.replaceAll("_", " ")
          : "Could not capture your email. Please try again.",
      );
    }
  }

  async function onUnlockWithCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedCode = code.trim().toUpperCase();
    if (!normalizedCode) return;

    setUnlocking(true);
    setError(null);
    setMessage("Verifying unlock code...");

    try {
      const response = await fetch("/api/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: normalizedCode,
          email: window.localStorage.getItem(EMAIL_KEY) || email.trim().toLowerCase(),
        }),
      });

      const payload = (await response.json().catch(() => ({}))) as { ok?: boolean; error?: string; message?: string };
      if (!response.ok || !payload.ok) {
        throw new Error(payload.message ?? payload.error ?? "unlock_failed");
      }

      persistUnlocked();
      window.location.href = "/143";
    } catch (unlockError) {
      setError(unlockError instanceof Error ? unlockError.message.replaceAll("_", " ") : "Unlock failed.");
      setMessage(null);
    } finally {
      setUnlocking(false);
    }
  }

  if (status === "success") {
    return (
      <div
        className="rounded-2xl border p-6 sm:p-8"
        style={{
          borderColor: "color-mix(in srgb, var(--gold-primary) 35%, transparent)",
          background: "color-mix(in srgb, var(--gold-primary) 8%, transparent)",
        }}
      >
        <p className="text-sm font-semibold uppercase tracking-[0.16em]" style={{ color: "var(--gold-primary)" }}>
          You&apos;re in.
        </p>
        <h2 className="mt-2 text-2xl font-bold" style={{ color: "var(--text-body)" }}>
          Check your email.
        </h2>
        <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--text-on-dark-secondary, color-mix(in srgb, var(--text-body) 78%, transparent))" }}>
          {message}
        </p>
        <form onSubmit={(event) => void onUnlockWithCode(event)} className="mt-5 space-y-3">
          <label htmlFor="challenge-unlock-code" className="mb-1 block text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--gold-primary)" }}>
            Enter unlock code (fallback)
          </label>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              id="challenge-unlock-code"
              type="text"
              value={code}
              onChange={(event) => setCode(event.target.value.toUpperCase())}
              placeholder="ABC123"
              maxLength={12}
              className="w-full rounded-xl border px-4 py-3 text-sm uppercase tracking-[0.08em] sm:w-56"
              style={{
                borderColor: "color-mix(in srgb, var(--gold-primary) 25%, transparent)",
                background: "color-mix(in srgb, var(--text-body) 3%, transparent)",
                color: "var(--text-body)",
              }}
            />
            <button
              type="submit"
              className="inline-flex items-center rounded-xl px-5 py-3 text-sm font-bold transition-all"
              style={{
                background: "var(--gold-primary)",
                color: "var(--ink-950)",
                opacity: unlocking ? 0.85 : 1,
                cursor: unlocking ? "wait" : "pointer",
              }}
              disabled={unlocking || !code.trim()}
            >
              {unlocking ? "Unlocking..." : "Unlock Full /143"}
            </button>
          </div>
        </form>
        {devDetails && (
          <div className="mt-5 rounded-xl border p-3" style={{ borderColor: "color-mix(in srgb, var(--neon-orange) 30%, transparent)" }}>
            <p className="text-xs font-semibold uppercase tracking-[0.12em]" style={{ color: "var(--neon-orange)" }}>
              Dev only
            </p>
            <p className="mt-1 text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              Email provider is not configured. Use the link/code below for testing.
            </p>
            {devDetails.unlockUrl && (
              <p className="mt-2 text-xs break-all">
                <a href={devDetails.unlockUrl} className="underline" style={{ color: "var(--neon-blue)" }}>
                  {devDetails.unlockUrl}
                </a>
              </p>
            )}
            {devDetails.tokenHint && (
              <p className="mt-1 text-xs" style={{ color: "var(--text-body)" }}>
                Code: <strong>{devDetails.tokenHint}</strong>
              </p>
            )}
          </div>
        )}
        {error && (
          <p className="mt-4 text-sm" style={{ color: "var(--text-body)" }}>
            {error}
          </p>
        )}
      </div>
    );
  }

  return (
    <form
      onSubmit={(event) => void onSubmit(event)}
      className="glass-card glass-card--glow p-6 sm:p-8 space-y-5"
      style={{
        borderColor: "color-mix(in srgb, var(--gold-primary) 18%, transparent)",
      }}
    >
      <div>
        <label htmlFor="challenge-name" className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--gold-primary)" }}>
          Name
        </label>
        <input
          id="challenge-name"
          type="text"
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="w-full rounded-xl border px-4 py-3 text-sm"
          style={{
            borderColor: "color-mix(in srgb, var(--gold-primary) 25%, transparent)",
            background: "color-mix(in srgb, var(--text-body) 3%, transparent)",
            color: "var(--text-body)",
          }}
          placeholder="Your first name"
        />
      </div>

      <div>
        <label htmlFor="challenge-email" className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--gold-primary)" }}>
          Email
        </label>
        <input
          id="challenge-email"
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-xl border px-4 py-3 text-sm"
          style={{
            borderColor: "color-mix(in srgb, var(--gold-primary) 25%, transparent)",
            background: "color-mix(in srgb, var(--text-body) 3%, transparent)",
            color: "var(--text-body)",
          }}
          placeholder="you@example.com"
        />
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex items-center rounded-xl px-5 py-3 text-sm font-bold transition-all"
        style={{
          background: "var(--gold-primary)",
          color: "var(--ink-950)",
          opacity: status === "submitting" ? 0.85 : 1,
          cursor: status === "submitting" ? "wait" : "pointer",
        }}
      >
        {status === "submitting" ? "Unlocking workbook…" : "Unlock the I Love Workbook"}
      </button>

      {status === "error" && (
        <p className="text-sm" style={{ color: "var(--text-body)" }}>
          {error ?? "Could not capture your email. Please try again."}
        </p>
      )}
    </form>
  );
}
