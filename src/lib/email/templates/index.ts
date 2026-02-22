export const EMAIL_TEMPLATE_IDS = [
  "magic_link_login",
  "challenge_kit_delivery",
  "preview_nudge",
  "upgrade_nudge",
  "post_report_followup",
  "subscription_renewal",
  "subscription_reactivation",
  "subscription_past_due",
] as const;

export type EmailTemplateId = (typeof EMAIL_TEMPLATE_IDS)[number];

export interface EmailTemplateMeta {
  id: EmailTemplateId;
  requiredVariables: string[];
}

export const EMAIL_TEMPLATE_LIBRARY: Record<EmailTemplateId, EmailTemplateMeta> = {
  magic_link_login: {
    id: "magic_link_login",
    requiredVariables: ["magic_link_url", "email"],
  },
  challenge_kit_delivery: {
    id: "challenge_kit_delivery",
    requiredVariables: ["source_route", "toolkit_version", "next_route"],
  },
  preview_nudge: {
    id: "preview_nudge",
    requiredVariables: ["preview_run_id", "next_route", "delay_hours"],
  },
  upgrade_nudge: {
    id: "upgrade_nudge",
    requiredVariables: ["next_route", "offer_context"],
  },
  post_report_followup: {
    id: "post_report_followup",
    requiredVariables: ["run_id", "results_route", "reports_route"],
  },
  subscription_renewal: {
    id: "subscription_renewal",
    requiredVariables: ["account_route", "billing_state"],
  },
  subscription_reactivation: {
    id: "subscription_reactivation",
    requiredVariables: ["account_route", "upgrade_route"],
  },
  subscription_past_due: {
    id: "subscription_past_due",
    requiredVariables: ["account_route", "upgrade_route"],
  },
};

export function validateTemplatePayload(
  templateId: EmailTemplateId,
  payload: Record<string, unknown>,
): string[] {
  const template = EMAIL_TEMPLATE_LIBRARY[templateId];
  return template.requiredVariables.filter((variableName) => !(variableName in payload));
}
