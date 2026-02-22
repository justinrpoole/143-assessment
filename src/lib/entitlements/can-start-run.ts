import type { UserState } from "@/lib/auth/user-state";
import { isBetaFreeMode } from "@/lib/config/beta";

export type CanStartRunReason =
  | "needs_upgrade"
  | "paid_43_run1_used"
  | "reactivation_required"
  | "allowed";

export interface CanStartRunResult {
  allowed: boolean;
  reason: CanStartRunReason;
}

interface CanStartRunInput {
  user_state: UserState;
  existing_completed_runs_count: number;
  /** ISO timestamp of when the current subscription period ends (for grace period). */
  sub_current_period_end?: string | null;
}

/** Grace period after subscription cancellation: 7 days past billing period end. */
const GRACE_PERIOD_MS = 7 * 24 * 60 * 60 * 1000;

function isWithinGracePeriod(periodEnd: string | null | undefined): boolean {
  if (!periodEnd) return false;
  const endMs = new Date(periodEnd).getTime();
  if (isNaN(endMs)) return false;
  return Date.now() < endMs + GRACE_PERIOD_MS;
}

export function canStartRun(input: CanStartRunInput): CanStartRunResult {
  if (isBetaFreeMode()) {
    return { allowed: true, reason: "allowed" };
  }

  if (input.user_state === "paid_43") {
    if (input.existing_completed_runs_count === 0) {
      return { allowed: true, reason: "allowed" };
    }
    return { allowed: false, reason: "paid_43_run1_used" };
  }

  if (input.user_state === "sub_active") {
    return { allowed: true, reason: "allowed" };
  }

  // Grace period: allow sub_canceled users to still start runs if their
  // billing period hasn't fully expired + 7-day buffer. Prevents wall-slam
  // on the day of cancellation when the user already paid for the period.
  if (input.user_state === "sub_canceled") {
    if (isWithinGracePeriod(input.sub_current_period_end)) {
      return { allowed: true, reason: "allowed" };
    }
    return { allowed: false, reason: "reactivation_required" };
  }

  if (input.user_state === "past_due") {
    return { allowed: false, reason: "reactivation_required" };
  }

  return { allowed: false, reason: "needs_upgrade" };
}
