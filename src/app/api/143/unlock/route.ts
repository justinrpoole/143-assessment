import { NextRequest, NextResponse } from 'next/server';
import { findByCode, findByToken } from '@/lib/server/unlock-store';

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      token?: string;
      code?: string;
      email?: string;
    };

    const token = String(body.token || '').trim();
    const code = String(body.code || '').trim();
    const email = String(body.email || '').trim().toLowerCase();

    let record = null;

    if (token) {
      record = findByToken(token);
    }

    if (!record && code) {
      record = findByCode({ code, email });
    }

    if (!record) {
      return NextResponse.json(
        {
          ok: false,
          error: 'invalid_or_expired_unlock',
          message: 'Unlock failed. Request a fresh workbook email to get a new link/code.',
        },
        { status: 401 }
      );
    }

    return NextResponse.json({
      ok: true,
      unlocked: true,
      redirect: '/143',
      emailHint: record.email
        ? `${record.email.slice(0, 1)}***@${record.email.split('@')[1] || ''}`
        : '',
      source: record.source,
      expiresAt: record.expiresAt,
    });
  } catch (error) {
    console.error('[143:unlock]', error);
    return NextResponse.json(
      { error: 'unlock_failed', message: 'Unable to process unlock request.' },
      { status: 500 }
    );
  }
}
