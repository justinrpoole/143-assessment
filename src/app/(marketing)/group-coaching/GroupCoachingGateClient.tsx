"use client";

import { FormEvent, useState } from "react";

export default function GroupCoachingGateClient({ children }: { children: React.ReactNode }) {
  const [unlocked, setUnlocked] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/email/capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          tag: "group-coaching-gate",
        }),
      });

      const payload = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) {
        throw new Error(payload.error ?? "capture_failed");
      }

      setUnlocked(true);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message.replaceAll("_", " ")
          : "Could not unlock the cohort page. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (!unlocked) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-16 space-y-6">
        <p className="text-xs font-bold uppercase tracking-[0.18em]" style={{ color: "var(--gold-primary)" }}>
          The Light Cohort
        </p>
        <h1 className="text-3xl font-bold leading-tight sm:text-5xl" style={{ color: "var(--text-body)" }}>
          Enter your name and email to unlock full cohort details.
        </h1>
        <p className="text-base" style={{ color: "var(--text-on-dark-secondary, color-mix(in srgb, var(--text-body) 78%, transparent))" }}>
          Quick gate first. Full coaching details and application appear right after.
        </p>

        <form
          onSubmit={(event) => void onSubmit(event)}
          className="rounded-2xl border p-6 sm:p-8 space-y-5"
          style={{
            borderColor: "color-mix(in srgb, var(--gold-primary) 20%, transparent)",
            background: "var(--surface-border)",
          }}
        >
          <div>
            <label htmlFor="group-gate-name" className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--gold-primary)" }}>
              Name
            </label>
            <input
              id="group-gate-name"
              type="text"
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full rounded-xl border px-4 py-3 text-sm"
              style={{
                borderColor: "color-mix(in srgb, var(--gold-primary) 26%, transparent)",
                background: "color-mix(in srgb, var(--text-body) 4%, transparent)",
                color: "var(--text-body)",
              }}
              placeholder="Your name"
            />
          </div>

          <div>
            <label htmlFor="group-gate-email" className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--gold-primary)" }}>
              Email
            </label>
            <input
              id="group-gate-email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl border px-4 py-3 text-sm"
              style={{
                borderColor: "color-mix(in srgb, var(--gold-primary) 26%, transparent)",
                background: "color-mix(in srgb, var(--text-body) 4%, transparent)",
                color: "var(--text-body)",
              }}
              placeholder="you@example.com"
            />
          </div>

          <button
            type="submit"
            disabled={submitting || !name.trim() || !email.trim()}
            className="inline-flex items-center rounded-xl px-6 py-3 text-sm font-bold transition-all"
            style={{
              background: "var(--gold-primary)",
              color: "var(--ink-950)",
              opacity: submitting ? 0.8 : 1,
            }}
          >
            {submitting ? "Unlocking…" : "Unlock Cohort Details"}
          </button>

          {error && (
            <p className="text-sm" style={{ color: "var(--text-body)" }}>
              {error}
            </p>
          )}
        </form>
      </section>
    );
  }

  return <>{children}</>;
}
