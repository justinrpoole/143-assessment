export const FEEDBACK_TYPES = [
  "question_clarity",
  "report_resonance",
  "next_step_confidence",
  "upgrade_clarity",
  "checkout_friction",
  "morning_value",
  "microjoy_value",
  "share_motivation",
  "overall_experience",
  "coaching_inquiry",
] as const;

export type FeedbackType = (typeof FEEDBACK_TYPES)[number];

const FEEDBACK_TYPE_SET = new Set<string>(FEEDBACK_TYPES);

export function isFeedbackType(value: unknown): value is FeedbackType {
  return typeof value === "string" && FEEDBACK_TYPE_SET.has(value);
}
