"use client";

import Link from "next/link";

/**
 * CosmicEmptyState — branded empty state card with one clear action.
 *
 * Usage:
 *   <CosmicEmptyState
 *     message="Your Light Signature is waiting."
 *     actionLabel="Take the Assessment"
 *     actionHref="/assessment/setup"
 *   />
 */

interface CosmicEmptyStateProps {
  /** Primary message displayed in gold */
  message: string;
  /** Optional supporting detail below the message */
  detail?: string;
  /** CTA button label */
  actionLabel?: string;
  /** CTA link destination */
  actionHref?: string;
  /** CTA click handler (alternative to href) */
  onAction?: () => void;
}

export default function CosmicEmptyState({
  message,
  detail,
  actionLabel,
  actionHref,
  onAction,
}: CosmicEmptyStateProps) {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-2xl px-6 py-10 text-center"
      style={{
        background: "var(--surface-glass)",
        border: "1px solid var(--surface-border)",
      }}
    >
      {/* Decorative dot cluster */}
      <div className="mb-4 flex gap-1.5">
        <span className="block h-1.5 w-1.5 rounded-full" style={{ background: "var(--cosmic-purple-light)" }} />
        <span className="block h-1.5 w-1.5 rounded-full" style={{ background: "var(--cosmic-gold)" }} />
        <span className="block h-1.5 w-1.5 rounded-full" style={{ background: "var(--cosmic-purple-light)" }} />
      </div>

      <p className="text-sm font-medium" style={{ color: "var(--cosmic-gold)" }}>
        {message}
      </p>

      {detail && (
        <p className="mt-1.5 max-w-xs text-xs" style={{ color: "var(--text-on-dark-muted)" }}>
          {detail}
        </p>
      )}

      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="btn-primary mt-5 inline-block rounded-xl px-5 py-2 text-xs font-semibold"
        >
          {actionLabel}
        </Link>
      )}

      {actionLabel && onAction && !actionHref && (
        <button
          onClick={onAction}
          className="btn-primary mt-5 rounded-xl px-5 py-2 text-xs font-semibold"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
