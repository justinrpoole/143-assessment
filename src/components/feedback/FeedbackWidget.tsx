"use client";

import { useMemo, useState } from "react";

import type { FeedbackType } from "@/lib/feedback/feedback-types";
import { isFeedbackType } from "@/lib/feedback/feedback-types";

interface FeedbackWidgetProps {
  feedback_type: FeedbackType;
  source_route: string;
  run_id?: string;
  title?: string;
}

function clampText(input: string): string {
  return input.slice(0, 1000);
}

export function FeedbackWidget(props: FeedbackWidgetProps) {
  const [rating, setRating] = useState<number | null>(null);
  const [freeText, setFreeText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "ok" | "error">("idle");
  const [message, setMessage] = useState("");

  const isValidType = useMemo(
    () => isFeedbackType(props.feedback_type),
    [props.feedback_type],
  );

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isValidType) {
      setStatus("error");
      setMessage("Feedback type is not valid for this page.");
      return;
    }

    if (rating !== null && (rating < 1 || rating > 5)) {
      setStatus("error");
      setMessage("Rating must be between 1 and 5.");
      return;
    }

    setIsSubmitting(true);
    setStatus("idle");
    setMessage("");

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          feedback_type: props.feedback_type,
          rating,
          free_text: clampText(freeText),
          run_id: props.run_id ?? null,
          source_route: props.source_route,
        }),
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as
          | { error?: string }
          | null;
        setStatus("error");
        setMessage(body?.error ?? "Could not submit feedback right now.");
        return;
      }

      setStatus("ok");
      setMessage("Thanks. Your feedback was saved.");
      setRating(null);
      setFreeText("");
    } catch {
      setStatus("error");
      setMessage("Could not submit feedback right now.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section
      className="mt-8 glass-card p-4"
      aria-label="Feedback"
    >
      <h2 className="text-sm font-semibold" style={{ color: 'var(--text-on-dark)' }}>
        {props.title ?? "Quick feedback"}
      </h2>
      <p className="mt-1 text-xs" style={{ color: 'var(--text-on-dark-muted)' }}>
        Help us sharpen this experience for early testers.
      </p>

      <form className="mt-3 space-y-3" onSubmit={onSubmit}>
        <div>
          <p className="text-xs font-medium" style={{ color: 'var(--text-on-dark)' }}>Rating (optional)</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                className={`rounded px-3 py-1 text-sm transition-all ${
                  rating === value
                    ? "bg-[#F8D011] text-[#020202] font-semibold"
                    : ""
                }`}
                style={rating !== value ? { background: 'rgba(96, 5, 141, 0.35)', color: 'var(--text-on-dark-secondary)', border: '1px solid var(--surface-border)' } : undefined}
                onClick={() => setRating((previous) => (previous === value ? null : value))}
                aria-pressed={rating === value}
              >
                {value}
              </button>
            ))}
          </div>
        </div>

        <label className="block">
          <span className="text-xs font-medium" style={{ color: 'var(--text-on-dark)' }}>Comment (optional)</span>
          <textarea
            className="mt-2 w-full rounded p-2 text-sm"
            style={{ background: 'rgba(96, 5, 141, 0.25)', color: 'var(--text-on-dark)', border: '1px solid var(--surface-border)' }}
            value={freeText}
            onChange={(event) => setFreeText(clampText(event.target.value))}
            maxLength={1000}
            rows={3}
            placeholder="What landed? What should be clearer?"
          />
          <span className="mt-1 block text-xs" style={{ color: 'var(--text-on-dark-muted)' }}>
            {freeText.length}/1000
          </span>
        </label>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Send feedback"}
          </button>

          {status === "ok" ? (
            <p className="text-xs text-emerald-400" role="status">
              {message}
            </p>
          ) : null}
          {status === "error" ? (
            <p className="text-xs text-rose-400" role="alert">
              {message}
            </p>
          ) : null}
        </div>
      </form>
    </section>
  );
}
