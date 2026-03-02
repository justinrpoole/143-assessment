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
      className="rounded-2xl border p-6 sm:p-8"
      style={{
        background: "rgba(12, 4, 22, 0.8)",
        borderColor: "rgba(248, 208, 17, 0.2)",
        boxShadow: "0 0 40px rgba(248,208,17,0.08)",
      }}
    >
      {status === "success" ? (
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: "#F8D011" }}>
            Application received
          </p>
          <h3 className="text-2xl font-bold" style={{ color: "var(--text-on-dark, #FFFEF5)" }}>
            You&apos;re on my waitlist.
          </h3>
          <p style={{ color: "var(--text-on-dark-secondary, rgba(255,255,255,0.78))" }}>
            I read every submission personally. If it feels like the right fit, you&apos;ll hear from me directly.
          </p>
        </div>
      ) : (
        <form className="space-y-5" onSubmit={(event) => void onSubmit(event)}>
          <h3 className="text-xl font-bold" style={{ color: "var(--text-on-dark, #FFFEF5)" }}>
            Apply for the Next Cohort
          </h3>

          <div className="space-y-2">
            <label htmlFor="group-name" className="text-sm font-semibold" style={{ color: "#F8D011" }}>
              Name
            </label>
            <input
              id="group-name"
              name="name"
              required
              className="w-full rounded-xl border px-4 py-3 text-sm"
              style={{
                borderColor: "rgba(248, 208, 17, 0.26)",
                background: "rgba(255,255,255,0.04)",
                color: "var(--text-on-dark, #FFFEF5)",
              }}
              placeholder="Your name"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="group-email" className="text-sm font-semibold" style={{ color: "#F8D011" }}>
              Email
            </label>
            <input
              id="group-email"
              name="email"
              type="email"
              required
              className="w-full rounded-xl border px-4 py-3 text-sm"
              style={{
                borderColor: "rgba(248, 208, 17, 0.26)",
                background: "rgba(255,255,255,0.04)",
                color: "var(--text-on-dark, #FFFEF5)",
              }}
              placeholder="you@example.com"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="group-why" className="text-sm font-semibold" style={{ color: "#F8D011" }}>
              Why do you want to join?
            </label>
            <textarea
              id="group-why"
              name="why"
              required
              rows={5}
              className="w-full rounded-xl border px-4 py-3 text-sm"
              style={{
                borderColor: "rgba(248, 208, 17, 0.26)",
                background: "rgba(255,255,255,0.04)",
                color: "var(--text-on-dark, #FFFEF5)",
              }}
              placeholder="What are you ready to shift in your life or leadership?"
            />
          </div>

          <button
            type="submit"
            disabled={status === "submitting"}
            className="inline-flex items-center rounded-xl px-6 py-3 text-sm font-bold transition-all"
            style={{
              background: "#F8D011",
              color: "#020202",
              opacity: status === "submitting" ? 0.8 : 1,
            }}
          >
            {status === "submitting" ? "Submitting…" : "Apply for the Next Cohort"}
          </button>

          {status === "error" && (
            <p className="text-sm" style={{ color: "#fb7185" }}>
              {error ?? "Could not submit. Please try again."}
            </p>
          )}
        </form>
      )}
    </div>
  );
}
