"use client";

/**
 * CosmicSkeleton — branded loading skeletons with purple→gold shimmer.
 *
 * Replaces generic grey `animate-pulse` blocks with themed shimmer
 * that uses the existing `.cosmic-skeleton` CSS class from cosmic.css.
 *
 * Usage:
 *   <CosmicSkeleton rows={5} height="h-32" />          // report cards
 *   <CosmicSkeleton rows={3} height="h-24" />          // portal cards
 *   <CosmicSkeleton rows={1} height="h-32" />          // single card
 *   <CosmicSkeleton rows={3} height="h-16" gap="gap-3" /> // compact
 */

interface CosmicSkeletonProps {
  /** Number of skeleton cards to render */
  rows?: number;
  /** Tailwind height class for each card */
  height?: string;
  /** Tailwind gap class between cards */
  gap?: string;
}

export default function CosmicSkeleton({
  rows = 3,
  height = "h-32",
  gap = "gap-4",
}: CosmicSkeletonProps) {
  return (
    <div className={`flex flex-col ${gap}`} role="status" aria-label="Loading">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className={`cosmic-skeleton ${height}`} />
      ))}
      <span className="sr-only">Loading...</span>
    </div>
  );
}
