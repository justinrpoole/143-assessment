import { getAppUserById } from "@/lib/db/app-users";
import { supabaseRestFetch } from "@/lib/db/supabase-rest";
import type { EmailTemplateId } from "@/lib/email/templates";

export const EMAIL_JOB_TYPES = [
  "challenge_kit_delivery",
  "preview_nudge",
  "upgrade_nudge",
  "post_report_followup",
  "subscription_renewal",
  "subscription_reactivation",
  "subscription_past_due",
] as const;

export type EmailJobType = (typeof EMAIL_JOB_TYPES)[number];
export type EmailJobStatus =
  | "queued"
  | "processing"
  | "sent"
  | "failed"
  | "skipped"
  | "canceled";

export interface EmailJobRow {
  id: string;
  user_id: string;
  type: EmailJobType;
  payload: Record<string, unknown>;
  send_at: string;
  status: EmailJobStatus;
  attempts: number;
  last_error: string | null;
  sent_at: string | null;
}

interface QueueEmailJobInput {
  userId: string;
  type: EmailJobType;
  payload: Record<string, unknown>;
  sendAt?: Date;
}

function nowIso(): string {
  return new Date().toISOString();
}

function normalizeType(type: string): EmailJobType {
  if ((EMAIL_JOB_TYPES as readonly string[]).includes(type)) {
    return type as EmailJobType;
  }
  throw new Error(`invalid_email_job_type:${type}`);
}

export async function queueEmailJob(input: QueueEmailJobInput): Promise<EmailJobRow> {
  const recipient = await getAppUserById(input.userId).catch(() => null);
  const payload = {
    ...input.payload,
    template_id: input.type as EmailTemplateId,
    to_email:
      typeof input.payload.to_email === "string"
        ? input.payload.to_email
        : recipient?.email ?? null,
  };

  const response = await supabaseRestFetch<EmailJobRow[]>({
    restPath: "email_jobs",
    method: "POST",
    prefer: "return=representation",
    body: {
      user_id: input.userId,
      type: input.type,
      payload,
      send_at: (input.sendAt ?? new Date()).toISOString(),
      status: "queued",
      attempts: 0,
      last_error: null,
      sent_at: null,
    },
  });

  if (!response.ok) {
    throw new Error(response.error ?? "email_job_queue_failed");
  }

  const row = response.data?.[0];
  if (!row) {
    throw new Error("email_job_queue_empty_response");
  }
  row.type = normalizeType(String(row.type));
  return row;
}

export async function listDueQueuedEmailJobs(limit = 25): Promise<EmailJobRow[]> {
  const response = await supabaseRestFetch<EmailJobRow[]>({
    restPath: "email_jobs",
    query: {
      select:
        "id,user_id,type,payload,send_at,status,attempts,last_error,sent_at",
      status: "eq.queued",
      send_at: `lte.${nowIso()}`,
      order: "send_at.asc",
      limit,
    },
  });

  if (!response.ok) {
    throw new Error(response.error ?? "email_jobs_load_failed");
  }

  return (response.data ?? []).map((job) => ({
    ...job,
    type: normalizeType(String(job.type)),
  }));
}

export async function setEmailJobProcessing(jobId: string): Promise<void> {
  const response = await supabaseRestFetch<unknown>({
    restPath: "email_jobs",
    method: "PATCH",
    query: {
      id: `eq.${jobId}`,
      status: "eq.queued",
    },
    prefer: "return=minimal",
    body: {
      status: "processing",
      attempts: 1,
    },
  });
  if (!response.ok) {
    throw new Error(response.error ?? "email_job_processing_failed");
  }
}

export async function finalizeEmailJob(params: {
  jobId: string;
  status: "sent" | "failed" | "skipped" | "canceled";
  error?: string;
}): Promise<void> {
  const response = await supabaseRestFetch<unknown>({
    restPath: "email_jobs",
    method: "PATCH",
    query: {
      id: `eq.${params.jobId}`,
    },
    prefer: "return=minimal",
    body: {
      status: params.status,
      last_error: params.error ?? null,
      sent_at: params.status === "sent" ? nowIso() : null,
    },
  });
  if (!response.ok) {
    throw new Error(response.error ?? "email_job_finalize_failed");
  }
}
