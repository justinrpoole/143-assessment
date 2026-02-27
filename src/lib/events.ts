/**
 * Progressive event capture (Enhancement 8).
 *
 * Server-side: writes directly to user_events via Supabase REST.
 * Client-side: fires POST to /api/events (fire-and-forget).
 *
 * Events are captured now and surfaced later for behavioral patterns,
 * AI coaching, and personalization.
 */

import { supabaseRestFetch } from "@/lib/db/supabase-rest";

// ── Canonical event types ──────────────────────────────────────────────────
export type EventType =
  | "assessment_started"
  | "assessment_completed"
  | "question_answered"
  | "report_viewed"
  | "section_expanded"
  | "coaching_question_reflected"
  | "rep_logged"
  | "streak_day"
  | "daily_loop_completed"
  | "evening_reflection_completed"
  | "morning_entry_completed"
  | "phase_checkin_completed"
  | "portal_visited"
  | "intention_set"
  | "email_captured"
  | "magic_link_sent"
  | "magic_link_verified"
  | "google_oauth_verified";

// ── Server-side track ──────────────────────────────────────────────────────
export async function trackEvent(params: {
  userId: string;
  eventType: EventType;
  eventData?: Record<string, unknown>;
}): Promise<void> {
  try {
    await supabaseRestFetch({
      restPath: "user_events",
      method: "POST",
      prefer: "return=minimal",
      body: {
        user_id: params.userId,
        event_type: params.eventType,
        event_data: params.eventData ?? {},
      },
    });
  } catch {
    // Fire-and-forget: never block the main flow for analytics
  }
}

// ── Client-side track (browser) ────────────────────────────────────────────
export function trackEventClient(
  eventType: EventType,
  eventData?: Record<string, unknown>,
): void {
  try {
    void fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event_type: eventType, event_data: eventData }),
      keepalive: true,
    });
  } catch {
    // Silent — never break UX for analytics
  }
}
