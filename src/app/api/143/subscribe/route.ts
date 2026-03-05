import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import {
  buildCodeFromToken,
  createEmailHint,
  saveUnlockRecord,
} from '@/lib/server/unlock-store';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getOrigin(request: NextRequest): string {
  const base = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_APP_URL;
  if (base) return base.replace(/\/$/, '');
  const proto = request.headers.get('x-forwarded-proto') || 'https';
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || 'localhost:3000';
  return `${proto}://${host}`.replace(/\/$/, '');
}

async function trySendEmail({ to, unlockUrl, code, pdfUrl }: {
  to: string;
  unlockUrl: string;
  code: string;
  pdfUrl: string;
}) {
  const resendApiKey = process.env.RESEND_API_KEY || process.env.EMAIL_PROVIDER_API_KEY;
  const from = process.env.EMAIL_FROM || '143 Leadership <onboarding@resend.dev>';

  if (!resendApiKey) {
    return { sent: false, provider: 'none', reason: 'missing_provider_key' };
  }

  const html = `
<!DOCTYPE html>
<html>
<body style="font-family:Inter,Segoe UI,Arial,sans-serif;background:#0b0620;color:#fff;padding:24px;">
  <div style="max-width:560px;margin:0 auto;border-radius:18px;padding:22px;border:1px solid rgba(255,43,214,.35);background:linear-gradient(180deg,rgba(130,70,210,.24),rgba(130,70,210,.12));">
    <p style="font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#ffe75a;margin:0 0 10px;">143 Workbook Delivery</p>
    <h1 style="font-size:24px;margin:0 0 10px;color:rgba(255,255,255,.96);">Your workbook and unlock link are ready.</h1>
    <p style="margin:0 0 14px;color:rgba(255,255,255,.86);line-height:1.55;">Use the workbook first, then unlock full /143 access with the secure link below.</p>
    <p style="margin:0 0 14px;"><a href="${pdfUrl}" style="display:inline-block;padding:10px 14px;border-radius:10px;background:#ffe75a;color:#15120c;text-decoration:none;font-weight:700;">Open Workbook PDF</a></p>
    <p style="margin:0 0 12px;"><a href="${unlockUrl}" style="display:inline-block;padding:10px 14px;border-radius:10px;border:1px solid rgba(46,233,255,.55);color:#dffbff;text-decoration:none;font-weight:600;">Unlock Full /143</a></p>
    <p style="margin:0;color:rgba(255,255,255,.72);font-size:13px;">Fallback code: <strong style="letter-spacing:.06em;color:#fff;">${code}</strong></p>
  </div>
</body>
</html>`;

  try {
    const resp = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject: 'Your 143 workbook + unlock link',
        html,
      }),
    });

    if (!resp.ok) {
      const message = await resp.text().catch(() => 'resend_error');
      return { sent: false, provider: 'resend', reason: message || `status_${resp.status}` };
    }

    return { sent: true, provider: 'resend' };
  } catch (error) {
    return {
      sent: false,
      provider: 'resend',
      reason: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      email?: string;
      source?: string;
      redirect?: string;
    };

    const email = String(body.email || '').trim().toLowerCase();
    const source = String(body.source || '143').trim();
    const redirect = String(body.redirect || '/143').trim() || '/143';

    if (!EMAIL_RE.test(email)) {
      return NextResponse.json(
        { ok: false, error: 'invalid_email', message: 'Please enter a valid email.' },
        { status: 400 }
      );
    }

    const token = crypto.randomBytes(24).toString('base64url');
    const code = buildCodeFromToken(token);
    const origin = getOrigin(request);
    const unlockPath = `/143/unlock?token=${encodeURIComponent(token)}`;
    const unlockUrl = `${origin}${unlockPath}`;
    const pdfUrl = `${origin}/marketing/143-challenge-workbook.pdf`;

    saveUnlockRecord({ token, code, email, source, redirect, unlockUrl, pdfUrl });

    const emailResult = await trySendEmail({ to: email, unlockUrl, code, pdfUrl });
    const devOnly = !emailResult.sent;

    return NextResponse.json({
      ok: true,
      emailHint: createEmailHint(email),
      tokenHint: code,
      unlockUrl: unlockPath,
      unlockAbsoluteUrl: unlockUrl,
      pdfUrl,
      devOnly,
      provider: emailResult.provider,
      message: emailResult.sent
        ? 'Check your email for the workbook PDF and unlock link.'
        : 'DEV ONLY: Email provider not configured. Use unlockUrl/tokenHint below.',
      dev: devOnly ? { unlockUrl: unlockPath, unlockAbsoluteUrl: unlockUrl, tokenHint: code } : undefined,
    });
  } catch (error) {
    console.error('[143:subscribe]', error);
    return NextResponse.json(
      { error: 'subscribe_failed', message: 'Unable to process subscription.' },
      { status: 500 }
    );
  }
}
