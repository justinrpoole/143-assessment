import type { EmailTemplateId } from "@/lib/email/templates";
import { validateTemplatePayload } from "@/lib/email/templates";

interface SendEmailInput {
  to: string;
  templateId: EmailTemplateId;
  payload: Record<string, unknown>;
}

interface SendEmailResult {
  ok: boolean;
  provider: "stub" | "http";
  messageId?: string;
  error?: string;
}

interface EmailProviderEnv {
  apiUrl: string;
  apiKey: string;
}

function getEmailProviderEnv(): EmailProviderEnv | null {
  const apiUrl = process.env.EMAIL_PROVIDER_API_URL ?? "";
  const apiKey = process.env.EMAIL_PROVIDER_API_KEY ?? "";
  if (!apiUrl || !apiKey) {
    return null;
  }
  return { apiUrl, apiKey };
}

export async function sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
  const missingPayloadKeys = validateTemplatePayload(input.templateId, input.payload);
  if (missingPayloadKeys.length > 0) {
    return {
      ok: false,
      provider: "stub",
      error: `template_payload_missing:${missingPayloadKeys.join(",")}`,
    };
  }

  const env = getEmailProviderEnv();
  if (!env) {
    console.info(
      "[email:stub]",
      JSON.stringify({
        to: input.to,
        template_id: input.templateId,
        payload: input.payload,
      }),
    );
    return { ok: true, provider: "stub", messageId: "stubbed" };
  }

  try {
    const response = await fetch(env.apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.apiKey}`,
      },
      body: JSON.stringify({
        to: input.to,
        template_id: input.templateId,
        payload: input.payload,
      }),
      cache: "no-store",
    });

    const raw = await response.text();
    let parsed: { id?: string; error?: string } | null = null;
    try {
      parsed = raw ? (JSON.parse(raw) as { id?: string; error?: string }) : null;
    } catch {
      parsed = null;
    }

    if (!response.ok) {
      return {
        ok: false,
        provider: "http",
        error: parsed?.error ?? `provider_error:${response.status}`,
      };
    }

    return {
      ok: true,
      provider: "http",
      messageId: parsed?.id ?? "provider_sent",
    };
  } catch (error) {
    return {
      ok: false,
      provider: "http",
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
