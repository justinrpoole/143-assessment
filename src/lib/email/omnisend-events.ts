/**
 * Fire-and-forget Omnisend event helpers.
 *
 * Matches the existing `trackEvent()` / `emitEvent()` patterns used
 * throughout the codebase — call them, don't await, and never let a
 * failure in the marketing layer break the primary user flow.
 */

import {
  addContact,
  addContactTags,
  sendEvent,
  sendOrder,
  type OmnisendContactInput,
} from "./omnisend-client";

// ---------------------------------------------------------------------------
// Tag constants — used across all capture touchpoints
// ---------------------------------------------------------------------------

/** Source-to-tag mapping for email captures */
export const SOURCE_TAGS: Record<string, string[]> = {
  homepage_mini_assessment: ["preview_completed", "funnel_awareness"],
  sample_report_gate: ["sample_report_gate", "funnel_consideration"],
  login_form: ["authenticated_user", "funnel_trial"],
  "143_challenge": ["143_challenge", "funnel_awareness"],
  "143_challenge_kit": ["143_challenge", "funnel_awareness"],
  newsletter_footer: ["newsletter_footer", "funnel_awareness"],
  exit_intent: ["exit_intent", "funnel_awareness"],
  content_scroll: ["content_scroll", "funnel_awareness"],
  unknown: ["unknown_source"],
};

/** User-state-to-tag mapping */
export const STATE_TAGS: Record<string, string> = {
  public: "state_public",
  free_email: "state_free_email",
  paid_43: "state_paid_43",
  sub_active: "state_sub_active",
  sub_canceled: "state_sub_canceled",
  past_due: "state_past_due",
};

// ---------------------------------------------------------------------------
// Contact sync (used by email-capture, login, Google OAuth)
// ---------------------------------------------------------------------------

export interface SyncContactInput {
  email: string;
  source: string;
  firstName?: string;
  userState?: string;
  extraTags?: string[];
  customProperties?: Record<string, string>;
}

/**
 * Sync a contact to Omnisend with source-based tags and user state.
 * Fire-and-forget — never throws, never blocks the caller.
 */
export function syncContactToOmnisend(input: SyncContactInput): void {
  const tags: string[] = [
    ...(SOURCE_TAGS[input.source] ?? SOURCE_TAGS.unknown),
    ...(input.userState && STATE_TAGS[input.userState]
      ? [STATE_TAGS[input.userState]]
      : []),
    ...(input.extraTags ?? []),
  ];

  const contactInput: OmnisendContactInput = {
    email: input.email,
    tags,
    ...(input.firstName ? { firstName: input.firstName } : {}),
    customProperties: {
      source: input.source,
      captured_at: new Date().toISOString(),
      ...(input.userState ? { user_state: input.userState } : {}),
      ...(input.customProperties ?? {}),
    },
  };

  void addContact(contactInput).catch((err) => {
    console.error(
      "[omnisend_sync]",
      err instanceof Error ? err.message : String(err),
    );
  });
}

// ---------------------------------------------------------------------------
// Tag updates (used when user state changes)
// ---------------------------------------------------------------------------

/**
 * Update a contact's tags in Omnisend (e.g., after payment or state change).
 * Fire-and-forget.
 */
export function updateOmnisendTags(
  email: string,
  tags: string[],
): void {
  void addContactTags(email, tags).catch((err) => {
    console.error(
      "[omnisend_tags]",
      err instanceof Error ? err.message : String(err),
    );
  });
}

// ---------------------------------------------------------------------------
// Custom events (used by assessment completion, practice milestones)
// ---------------------------------------------------------------------------

export interface OmnisendCustomEventInput {
  email: string;
  eventName: string;
  properties?: Record<string, string>;
}

/**
 * Send a custom event to Omnisend for automation triggers.
 * Fire-and-forget.
 */
export function sendOmnisendCustomEvent(
  input: OmnisendCustomEventInput,
): void {
  void sendEvent({
    email: input.email,
    eventID: input.eventName,
    fields: input.properties,
  }).catch((err) => {
    console.error(
      "[omnisend_event]",
      err instanceof Error ? err.message : String(err),
    );
  });
}

// ---------------------------------------------------------------------------
// Order events (used by Stripe webhook for revenue attribution)
// ---------------------------------------------------------------------------

export interface OmnisendOrderEventInput {
  email: string;
  orderId: string;
  amountCents: number;
  currency: string;
  productSku?: string;
  productTitle?: string;
}

/**
 * Send an order event to Omnisend for revenue attribution.
 * Fire-and-forget.
 */
export function sendOmnisendOrderEvent(
  input: OmnisendOrderEventInput,
): void {
  void sendOrder({
    email: input.email,
    orderId: input.orderId,
    currency: input.currency,
    orderSum: input.amountCents,
    createdAt: new Date().toISOString(),
    products: [
      {
        productID: input.productSku ?? "assessment_43",
        title: input.productTitle ?? "Be The Light Assessment",
        quantity: 1,
        price: input.amountCents,
      },
    ],
  }).catch((err) => {
    console.error(
      "[omnisend_order]",
      err instanceof Error ? err.message : String(err),
    );
  });
}
