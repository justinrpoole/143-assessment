"use client";

import { FormEvent, useState } from "react";

export default function RayDetailGateClient({
  rayName,
  children,
}: {
  rayName: string;
  children: React.ReactNode;
}) {
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
          tag: "ray-detail-gate",
          context: rayName,
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
          : "Could not unlock this page. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (!unlocked) {
    return (
      <section className="mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="glass-card p-8 text-center space-y-4">
          <p className="text-xs font-bold uppercase tracking-[0.16em]" style={{ color: "#F8D011" }}>
            Discover your Rays
          </p>
          <h1 className="text-2xl font-bold sm:text-4xl" style={{ color: "var(--text-on-dark, #FFFEF5)" }}>
            Unlock the full {rayName} breakdown.
          </h1>
          <p className="text-sm" style={{ color: "var(--text-on-dark-secondary, rgba(255,255,255,0.75))" }}>
            Get a quick Stability Check first, then access the full ray science and coaching reps.
          </p>

          <form onSubmit={(event) => void onSubmit(event)} className="mx-auto mt-5 max-w-md space-y-3 text-left">
            <input
              type="text"
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full rounded-xl border px-4 py-3 text-sm"
              style={{
                borderColor: "rgba(248, 208, 17, 0.26)",
                background: "rgba(255,255,255,0.04)",
                color: "var(--text-on-dark, #FFFEF5)",
              }}
              placeholder="Your name"
            />
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl border px-4 py-3 text-sm"
              style={{
                borderColor: "rgba(248, 208, 17, 0.26)",
                background: "rgba(255,255,255,0.04)",
                color: "var(--text-on-dark, #FFFEF5)",
              }}
              placeholder="you@example.com"
            />
            <button
              type="submit"
              disabled={submitting || !name.trim() || !email.trim()}
              className="w-full rounded-xl px-5 py-3 text-sm font-bold"
              style={{ background: "#F8D011", color: "#020202", opacity: submitting ? 0.8 : 1 }}
            >
              {submitting ? "Unlocking…" : "Discover your Rays — free Stability Check"}
            </button>
            {error && (
              <p className="text-sm text-center" style={{ color: "#fb7185" }}>
                {error}
              </p>
            )}
          </form>
        </div>
      </section>
    );
  }

  return <>{children}</>;
}
