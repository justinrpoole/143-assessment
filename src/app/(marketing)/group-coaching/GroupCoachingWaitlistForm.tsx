"use client";

import { type FormEvent, useState } from "react";

type FormStatus = "idle" | "submitting" | "success" | "error";

export default function GroupCoachingWaitlistForm({ onSuccess }: { onSuccess?: () => void }) {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setError(null);

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const why = String(formData.get("why") ?? "").trim();

    try {
      const response = await fetch("/api/email/capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          why,
          tag: "group-coaching-waitlist",
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => ({}))) as { error?: string };
        throw new Error(payload.error ?? "capture_failed");
      }

      setStatus("success");
      event.currentTarget.reset();
      onSuccess?.();
    } catch (submitError) {
      setStatus("error");
      setError(
        submitError instanceof Error
          ? submitError.message.replaceAll("_", " ")
          : "Something broke. Please try again.",
      );
    }
  }

  return (
    <div
      className="glass-card glass-card--glow card-border-gold-soft p-6 sm:p-8"
    >
      {status === "success" ? (
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: "var(--gold-primary)" }}>
            Application received
          </p>
          <h3 className="text-2xl font-bold" style={{ color: "var(--text-body)" }}>
            You&apos;re on my waitlist.
          </h3>
          <p style={{ color: "var(--text-on-dark-secondary, color-mix(in srgb, var(--text-body) 78%, transparent))" }}>
            I read every submission personally. If it feels like the right fit, you&apos;ll hear from me directly.
          </p>
        </div>
      ) : (
        <form className="space-y-5" onSubmit={(event) => void onSubmit(event)}>
          <h3 className="text-xl font-bold" style={{ color: "var(--text-body)" }}>
            Apply for the Next Cohort
          </h3>

          <div className="space-y-2">
            <label htmlFor="group-name" className="text-sm font-semibold" style={{ color: "var(--gold-primary)" }}>
              Name
            </label>
            <input
              id="group-name"
              name="name"
              required
              className="w-full rounded-xl border px-4 py-3 text-sm"
              style={{
                borderColor: "color-mix(in srgb, var(--gold-primary) 26%, transparent)",
                background: "color-mix(in srgb, var(--text-body) 4%, transparent)",
                color: "var(--text-body)",
              }}
              placeholder="Your name"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="group-email" className="text-sm font-semibold" style={{ color: "var(--gold-primary)" }}>
              Email
            </label>
            <input
              id="group-email"
              name="email"
              type="email"
              required
              className="w-full rounded-xl border px-4 py-3 text-sm"
              style={{
                borderColor: "color-mix(in srgb, var(--gold-primary) 26%, transparent)",
                background: "color-mix(in srgb, var(--text-body) 4%, transparent)",
                color: "var(--text-body)",
              }}
              placeholder="you@example.com"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="group-why" className="text-sm font-semibold" style={{ color: "var(--gold-primary)" }}>
              Why do you want to join?
            </label>
            <textarea
              id="group-why"
              name="why"
              required
              rows={5}
              className="w-full rounded-xl border px-4 py-3 text-sm"
              style={{
                borderColor: "color-mix(in srgb, var(--gold-primary) 26%, transparent)",
                background: "color-mix(in srgb, var(--text-body) 4%, transparent)",
                color: "var(--text-body)",
              }}
              placeholder="What are you ready to shift in your life or leadership?"
            />
          </div>

          <button
            type="submit"
            disabled={status === "submitting"}
            className="inline-flex items-center rounded-xl px-6 py-3 text-sm font-bold transition-all"
            style={{
              background: "var(--gold-primary)",
              color: "var(--ink-950)",
              opacity: status === "submitting" ? 0.8 : 1,
            }}
          >
            {status === "submitting" ? "Submitting…" : "Apply for the Next Cohort"}
          </button>

          {status === "error" && (
            <p className="text-sm" style={{ color: "var(--text-body)" }}>
              {error ?? "Could not submit. Please try again."}
            </p>
          )}
        </form>
      )}
    </div>
  );
}
