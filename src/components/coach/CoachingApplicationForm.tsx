'use client';

import { type FormEvent, useMemo, useState } from 'react';

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';

export function CoachingApplicationForm() {
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    role: '',
    organization: '',
    focus: 'regulation',
    commitment: '8-weeks',
    timezone: '',
    note: '',
  });

  const canSubmit = useMemo(() => {
    return (
      form.name.trim().length > 1 &&
      form.email.trim().length > 5 &&
      form.role.trim().length > 1
    );
  }, [form.email, form.name, form.role]);

  function updateField(key: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) {
      setError('Please complete name, email, and role.');
      return;
    }
    setStatus('submitting');
    setError(null);

    const payloadLines = [
      `Name: ${form.name.trim()}`,
      `Email: ${form.email.trim()}`,
      `Role: ${form.role.trim()}`,
      `Organization: ${form.organization.trim() || '—'}`,
      `Focus: ${form.focus}`,
      `Commitment: ${form.commitment}`,
      `Timezone: ${form.timezone.trim() || '—'}`,
      `Why now: ${form.note.trim() || '—'}`,
    ];

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          feedback_type: 'coaching_inquiry',
          source_route: '/os-coaching',
          free_text: payloadLines.join('\n'),
        }),
      });
      const data = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) {
        throw new Error(data.error ?? 'inquiry_submit_failed');
      }
      setStatus('success');
    } catch (requestError) {
      setStatus('error');
      setError(
        requestError instanceof Error ? requestError.message : 'Submission failed.',
      );
    }
  }

  return (
    <section className="glass-card p-6 space-y-4">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--brand-gold, #F8D011)' }}>
          Coaching Application
        </p>
        <h3 className="mt-2 text-lg font-semibold" style={{ color: 'var(--text-on-dark)' }}>
          Apply for 1-on-1 OS Coaching
        </h3>
        <p className="mt-1 text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
          Short form. Clear signal. Justin reviews every application and replies by email.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="space-y-1 text-xs" style={{ color: 'var(--text-on-dark-secondary)' }}>
            Full name
            <input
              value={form.name}
              onChange={(event) => updateField('name', event.target.value)}
              className="mt-1 w-full rounded-xl px-3 py-2 text-sm outline-none transition-colors focus:ring-2 focus:ring-[#F8D011]/40"
              style={{
                background: 'var(--surface-glass, rgba(255,255,255,0.06))',
                border: '1px solid var(--surface-border, rgba(255,255,255,0.10))',
                color: 'var(--text-on-dark, #FFFEF5)',
              }}
              placeholder="Your name"
              required
            />
          </label>
          <label className="space-y-1 text-xs" style={{ color: 'var(--text-on-dark-secondary)' }}>
            Email
            <input
              type="email"
              value={form.email}
              onChange={(event) => updateField('email', event.target.value)}
              className="mt-1 w-full rounded-xl px-3 py-2 text-sm outline-none transition-colors focus:ring-2 focus:ring-[#F8D011]/40"
              style={{
                background: 'var(--surface-glass, rgba(255,255,255,0.06))',
                border: '1px solid var(--surface-border, rgba(255,255,255,0.10))',
                color: 'var(--text-on-dark, #FFFEF5)',
              }}
              placeholder="you@email.com"
              required
            />
          </label>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="space-y-1 text-xs" style={{ color: 'var(--text-on-dark-secondary)' }}>
            Role
            <input
              value={form.role}
              onChange={(event) => updateField('role', event.target.value)}
              className="mt-1 w-full rounded-xl px-3 py-2 text-sm outline-none transition-colors focus:ring-2 focus:ring-[#F8D011]/40"
              style={{
                background: 'var(--surface-glass, rgba(255,255,255,0.06))',
                border: '1px solid var(--surface-border, rgba(255,255,255,0.10))',
                color: 'var(--text-on-dark, #FFFEF5)',
              }}
              placeholder="Founder, VP, Director..."
              required
            />
          </label>
          <label className="space-y-1 text-xs" style={{ color: 'var(--text-on-dark-secondary)' }}>
            Organization
            <input
              value={form.organization}
              onChange={(event) => updateField('organization', event.target.value)}
              className="mt-1 w-full rounded-xl px-3 py-2 text-sm outline-none transition-colors focus:ring-2 focus:ring-[#F8D011]/40"
              style={{
                background: 'var(--surface-glass, rgba(255,255,255,0.06))',
                border: '1px solid var(--surface-border, rgba(255,255,255,0.10))',
                color: 'var(--text-on-dark, #FFFEF5)',
              }}
              placeholder="Company or team"
            />
          </label>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="space-y-1 text-xs" style={{ color: 'var(--text-on-dark-secondary)' }}>
            Focus
            <select
              value={form.focus}
              onChange={(event) => updateField('focus', event.target.value)}
              className="mt-1 w-full rounded-xl px-3 py-2 text-sm outline-none transition-colors focus:ring-2 focus:ring-[#F8D011]/40"
              style={{
                background: 'var(--surface-glass, rgba(255,255,255,0.06))',
                border: '1px solid var(--surface-border, rgba(255,255,255,0.10))',
                color: 'var(--text-on-dark, #FFFEF5)',
              }}
            >
              <option value="regulation">Regulation + stability</option>
              <option value="leadership">Leadership capacity</option>
              <option value="team">Team dynamics</option>
              <option value="clarity">Clarity + decisions</option>
              <option value="other">Other</option>
            </select>
          </label>
          <label className="space-y-1 text-xs" style={{ color: 'var(--text-on-dark-secondary)' }}>
            Commitment window
            <select
              value={form.commitment}
              onChange={(event) => updateField('commitment', event.target.value)}
              className="mt-1 w-full rounded-xl px-3 py-2 text-sm outline-none transition-colors focus:ring-2 focus:ring-[#F8D011]/40"
              style={{
                background: 'var(--surface-glass, rgba(255,255,255,0.06))',
                border: '1px solid var(--surface-border, rgba(255,255,255,0.10))',
                color: 'var(--text-on-dark, #FFFEF5)',
              }}
            >
              <option value="4-weeks">4 weeks</option>
              <option value="8-weeks">8 weeks</option>
              <option value="12-weeks">12 weeks</option>
              <option value="flexible">Flexible</option>
            </select>
          </label>
        </div>

        <label className="space-y-1 text-xs" style={{ color: 'var(--text-on-dark-secondary)' }}>
          Time zone
          <input
            value={form.timezone}
            onChange={(event) => updateField('timezone', event.target.value)}
            className="mt-1 w-full rounded-xl px-3 py-2 text-sm outline-none transition-colors focus:ring-2 focus:ring-[#F8D011]/40"
            style={{
              background: 'var(--surface-glass, rgba(255,255,255,0.06))',
              border: '1px solid var(--surface-border, rgba(255,255,255,0.10))',
              color: 'var(--text-on-dark, #FFFEF5)',
            }}
            placeholder="Pacific, Eastern, GMT+1"
          />
        </label>

        <label className="space-y-1 text-xs" style={{ color: 'var(--text-on-dark-secondary)' }}>
          Why now
          <textarea
            value={form.note}
            onChange={(event) => updateField('note', event.target.value)}
            className="mt-1 w-full rounded-xl px-3 py-2 text-sm outline-none transition-colors focus:ring-2 focus:ring-[#F8D011]/40"
            style={{
              background: 'var(--surface-glass, rgba(255,255,255,0.06))',
              border: '1px solid var(--surface-border, rgba(255,255,255,0.10))',
              color: 'var(--text-on-dark, #FFFEF5)',
            }}
            rows={4}
            placeholder="One paragraph is enough."
          />
        </label>

        {error ? (
          <p className="text-sm text-rose-400" role="alert">
            {error}
          </p>
        ) : null}

        {status === 'success' ? (
          <p className="text-sm text-emerald-300">
            Application received. Expect a reply by email.
          </p>
        ) : null}

        <button type="submit" className="btn-primary" disabled={!canSubmit || status === 'submitting'}>
          {status === 'submitting' ? 'Submitting…' : 'Submit application'}
        </button>
      </form>
    </section>
  );
}
