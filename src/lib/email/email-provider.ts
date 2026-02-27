import type { EmailTemplateId } from "@/lib/email/templates";
import { validateTemplatePayload } from "@/lib/email/templates";

interface SendEmailInput {
  to: string;
  templateId: EmailTemplateId;
  payload: Record<string, unknown>;
}

interface SendEmailResult {
  ok: boolean;
  provider: "stub" | "resend";
  messageId?: string;
  error?: string;
}

function getResendApiKey(): string | null {
  return process.env.RESEND_API_KEY ?? process.env.EMAIL_PROVIDER_API_KEY ?? null;
}

function getFromAddress(): string {
  return process.env.EMAIL_FROM ?? "143 Leadership <onboarding@resend.dev>";
}

/**
 * Render an email template to subject + HTML.
 * For now, only magic_link_login is implemented.
 * Add more templates here as needed.
 */
function renderTemplate(
  templateId: EmailTemplateId,
  payload: Record<string, unknown>,
): { subject: string; html: string } {
  switch (templateId) {
    case "magic_link_login":
      return {
        subject: "Your sign-in link — 143 Leadership",
        html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #1a1025; color: #fffef5; padding: 40px 20px;">
  <div style="max-width: 480px; margin: 0 auto; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.10); border-radius: 16px; padding: 32px;">
    <h1 style="font-size: 20px; margin: 0 0 8px;">Sign in to 143 Leadership</h1>
    <p style="color: rgba(255,255,255,0.75); font-size: 14px; line-height: 1.6; margin: 0 0 24px;">
      Click the button below to sign in. This link expires in 15 minutes.
    </p>
    <a href="${payload.magic_link_url}" style="display: inline-block; background: #F8D011; color: #1a1025; font-weight: 600; font-size: 14px; padding: 12px 24px; border-radius: 10px; text-decoration: none;">
      Sign In
    </a>
    <p style="color: rgba(255,255,255,0.4); font-size: 12px; line-height: 1.5; margin: 24px 0 0;">
      If you didn't request this, you can safely ignore this email.<br />
      This link was sent to ${payload.email}.
    </p>
  </div>
</body>
</html>`.trim(),
      };

    default:
      return {
        subject: `143 Leadership — ${templateId}`,
        html: `<p>Template "${templateId}" is not yet configured. Payload: ${JSON.stringify(payload)}</p>`,
      };
  }
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

  const apiKey = getResendApiKey();
  if (!apiKey) {
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

  const { subject, html } = renderTemplate(input.templateId, input.payload);

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: getFromAddress(),
        to: [input.to],
        subject,
        html,
      }),
      cache: "no-store",
    });

    const data = (await response.json().catch(() => ({}))) as {
      id?: string;
      message?: string;
    };

    if (!response.ok) {
      return {
        ok: false,
        provider: "resend",
        error: data.message ?? `resend_error:${response.status}`,
      };
    }

    return {
      ok: true,
      provider: "resend",
      messageId: data.id ?? "resend_sent",
    };
  } catch (error) {
    return {
      ok: false,
      provider: "resend",
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
