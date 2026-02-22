/**
 * Brand-voice error messages.
 *
 * Raw error codes from API responses get mapped to human-readable
 * messages in Justin Ray's voice — calm, clear, non-clinical.
 */

const ERROR_MAP: Record<string, string> = {
  // Morning entry
  morning_entry_fetch_failed:
    "Could not load your morning entry. Refresh and try again — your data is safe.",
  morning_entry_save_failed:
    "Could not save your intention. Try once more — your words are not lost.",

  // Energy audit
  save_failed:
    "Could not save right now. Try again in a moment.",
  energy_audit_fetch_failed:
    "Could not load your energy audit. Refresh to try again.",

  // Phase check-in
  phase_checkin_save_failed:
    "Could not save your check-in. Try again — your signal is still here.",

  // Reps
  rep_log_failed:
    "Could not log that rep. Give it another try.",

  // Daily loop
  daily_loop_fetch_failed:
    "Could not load your daily loop. Refresh to continue.",
  daily_loop_save_failed:
    "Could not save your loop entry. Try again.",

  // Evening reflection
  evening_reflection_fetch_failed:
    "Could not load your reflection. Refresh to try again.",
  evening_reflection_save_failed:
    "Could not save your reflection. Try once more.",

  // Weekly review
  weekly_review_fetch_failed:
    "Could not load your weekly review. Refresh to try again.",

  // If/Then plans
  if_then_save_failed:
    "Could not save your plan. Try again.",

  // Micro joy
  micro_joy_save_failed:
    "Could not save your micro joy. Try again.",

  // Assessment
  run_start_failed:
    "Could not start the assessment. Refresh and try again.",
  questions_fetch_failed:
    "Could not load the questions. Refresh to continue.",
  run_complete_failed:
    "Could not complete the assessment. Try submitting again — your responses are saved.",

  // Auth
  invalid_email:
    "That email does not look right. Double-check and try again.",

  // Checkout
  checkout_start_failed:
    "Could not start checkout. Try again in a moment.",
  checkout_url_missing:
    "Something went wrong with checkout. Try again.",

  // Portal
  portal_open_failed:
    "Could not open the billing portal. Try again.",

  // Generic
  server_error:
    "Something went wrong on our end. Try again in a moment.",
  fetch_failed:
    "Connection interrupted. Check your signal and try again.",
};

/**
 * Converts raw error codes or messages into brand-voice text.
 * If the error is already a sentence (contains spaces and starts
 * with a capital letter), it passes through unchanged.
 */
export function humanizeError(raw: string): string {
  // Check the map first
  const mapped = ERROR_MAP[raw];
  if (mapped) return mapped;

  // If it already looks like a sentence, pass through
  if (raw.includes(" ") && /^[A-Z]/.test(raw)) return raw;

  // Fallback for unknown codes
  return "Something went wrong. Try again in a moment.";
}
