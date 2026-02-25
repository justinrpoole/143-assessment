import { NextResponse, type NextRequest } from "next/server";

import { createMagicLinkToken } from "@/lib/auth/magic-link";
import { sendEmail } from "@/lib/email/email-provider";
import { trackEvent } from "@/lib/events";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      email?: string;
      next?: string;
    };

    const email = body.email?.toLowerCase().trim();
    if (!email || !EMAIL_RE.test(email)) {
      return NextResponse.json(
        { error: "invalid_email", message: "Please provide a valid email address." },
        { status: 400 },
      );
    }

    const next = body.next ?? "/portal";

    // Create a signed magic link token (15-minute TTL)
    const token = createMagicLinkToken(email, next);
    const baseUrl = getBaseUrl();
    const magicLinkUrl = `${baseUrl}/api/auth/login/verify?token=${encodeURIComponent(token)}`;

    // Send the magic link email
    const emailResult = await sendEmail({
      to: email,
      templateId: "magic_link_login",
      payload: {
        magic_link_url: magicLinkUrl,
        email,
      },
    });

    if (!emailResult.ok) {
      console.error("[auth:login:request] email_send_failed", {
        error: emailResult.error,
        provider: emailResult.provider,
      });

      // In development stub mode, log the link to console so you can test
      if (emailResult.provider === "stub") {
        console.info("[auth:login:request] DEV MAGIC LINK:", magicLinkUrl);
      }
    }

    // Track auth analytics events (fire-and-forget)
    void trackEvent({ userId: "anonymous", eventType: "email_captured", eventData: { source: "login_form" } });
    void trackEvent({ userId: "anonymous", eventType: "magic_link_sent", eventData: { provider: emailResult.provider } });

    // Always return success to avoid leaking whether an email exists
    // In stub mode (no email provider configured), the link is logged to console
    return NextResponse.json({
      ok: true,
      message: "If an account exists for this email, a sign-in link has been sent.",
      // Expose the link in development for testing
      ...(process.env.NODE_ENV !== "production" && emailResult.provider === "stub"
        ? { dev_magic_link: magicLinkUrl }
        : {}),
    });
  } catch (error) {
    console.error("[auth:login:request] unexpected_error", error);
    return NextResponse.json(
      { error: "server_error", message: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
