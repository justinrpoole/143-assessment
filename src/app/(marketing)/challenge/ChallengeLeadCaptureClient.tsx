"use client";

import { type FormEvent, useState } from "react";

type Status = "idle" | "submitting" | "success" | "error";

export default function ChallengeLeadCaptureClient() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setError(null);

    try {
      const response = await fetch("/api/email/capture", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          tag: "143-challenge",
        }),
      });

      const payload = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) {
        throw new Error(payload.error ?? "capture_failed");
      }

      setStatus("success");
    } catch (submitError) {
      setStatus("error");
      setError(
        submitError instanceof Error
          ? submitError.message.replaceAll("_", " ")
          : "Could not capture your email. Please try again.",
      );
    }
  }

  if (status === "success") {
    return (
      <div
        className="rounded-2xl border p-6 sm:p-8"
        style={{
          borderColor: "rgba(248, 208, 17, 0.35)",
          background: "rgba(248, 208, 17, 0.08)",
        }}
      >
        <p className="text-sm font-semibold uppercase tracking-[0.16em]" style={{ color: "#F8D011" }}>
          You&apos;re in.
        </p>
        <h2 className="mt-2 text-2xl font-bold" style={{ color: "var(--text-on-dark, #FFFEF5)" }}>
          Your workbook is ready.
        </h2>
        <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--text-on-dark-secondary, rgba(255,255,255,0.78))" }}>
          Download your 143 Challenge workbook and start today.
        </p>
        <a
          href="/marketing/143-challenge-workbook.pdf"
          className="mt-6 inline-flex items-center rounded-xl px-5 py-3 text-sm font-bold no-underline transition-all hover:brightness-105"
          style={{
            background: "#F8D011",
            color: "#020202",
            boxShadow: "0 0 24px rgba(248,208,17,0.2)",
          }}
        >
          Download Workbook (PDF)
        </a>
      </div>
    );
  }

  return (
    <form
      onSubmit={(event) => void onSubmit(event)}
      className="rounded-2xl border p-6 sm:p-8 space-y-5"
      style={{
        borderColor: "rgba(248, 208, 17, 0.18)",
        background: "rgba(11, 2, 18, 0.72)",
      }}
    >
      <div>
        <label htmlFor="challenge-name" className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: "#F8D011" }}>
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
            borderColor: "rgba(248, 208, 17, 0.25)",
            background: "rgba(255, 255, 255, 0.03)",
            color: "var(--text-on-dark, #FFFEF5)",
          }}
          placeholder="Your first name"
        />
      </div>

      <div>
        <label htmlFor="challenge-email" className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: "#F8D011" }}>
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
            borderColor: "rgba(248, 208, 17, 0.25)",
            background: "rgba(255, 255, 255, 0.03)",
            color: "var(--text-on-dark, #FFFEF5)",
          }}
          placeholder="you@example.com"
        />
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex items-center rounded-xl px-5 py-3 text-sm font-bold transition-all"
        style={{
          background: "#F8D011",
          color: "#020202",
          opacity: status === "submitting" ? 0.85 : 1,
          cursor: status === "submitting" ? "wait" : "pointer",
          boxShadow: "0 0 24px rgba(248,208,17,0.2)",
        }}
      >
        {status === "submitting" ? "Unlocking workbook…" : "Unlock the 143 Workbook"}
      </button>

      {status === "error" && (
        <p className="text-sm" style={{ color: "#fb7185" }}>
          {error ?? "Could not capture your email. Please try again."}
        </p>
      )}
    </form>
  );
}
