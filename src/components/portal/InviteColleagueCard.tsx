'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

import archetypeBlocks from '@/data/archetype_blocks.json';
import { RAY_SHORT_NAMES } from '@/lib/types';
import type { ArchetypeBlock } from '@/lib/types';

const blocks = archetypeBlocks as ArchetypeBlock[];

function archetypeName(pairCode: string | null): string | null {
  if (!pairCode) return null;
  const block = blocks.find((b) => b.pair_code === pairCode);
  return block?.name ?? null;
}

function rayNames(pairCode: string | null): string {
  if (!pairCode) return '';
  const [a, b] = pairCode.split('-');
  return `${RAY_SHORT_NAMES[a] ?? a} + ${RAY_SHORT_NAMES[b] ?? b}`;
}

interface Invite {
  id: string;
  invitee_email: string;
  status: 'pending' | 'accepted' | 'completed';
  invitee_archetype: string | null;
  inviter_archetype: string | null;
  created_at: string;
}

export default function InviteColleagueCard() {
  const prefersReduced = useReducedMotion();
  const [invites, setInvites] = useState<Invite[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch('/api/invites')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.invites) setInvites(data.invites as Invite[]);
      })
      .catch(() => {});
  }, []);

  const handleInvite = useCallback(async () => {
    if (!email.trim() || sending) return;
    setSending(true);
    setError(null);

    try {
      const res = await fetch('/api/invites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), message: message.trim() }),
      });

      if (res.status === 409) {
        setError('Already invited this person.');
        return;
      }

      if (!res.ok) {
        setError('Could not send invite. Try again.');
        return;
      }

      setSuccess(true);
      setEmail('');
      setMessage('');

      // Refresh invites list
      const refreshRes = await fetch('/api/invites');
      if (refreshRes.ok) {
        const data = await refreshRes.json();
        if (data?.invites) setInvites(data.invites as Invite[]);
      }

      setTimeout(() => {
        setSuccess(false);
        setShowForm(false);
      }, 2500);
    } catch {
      setError('Network error. Try again.');
    } finally {
      setSending(false);
    }
  }, [email, message, sending]);

  const completedPairs = invites.filter((i) => i.status === 'completed' && i.invitee_archetype);

  return (
    <div className="glass-card p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold" style={{ color: 'var(--text-on-dark)' }}>
            Team Constellation
          </h3>
          <p className="text-xs" style={{ color: 'var(--text-on-dark-muted)' }}>
            Invite a colleague to discover their Light Signature
          </p>
        </div>
        {!showForm && (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="shrink-0 rounded-lg px-3 py-1.5 text-xs font-bold transition-all hover:brightness-110"
            style={{ background: 'var(--brand-gold)', color: 'var(--brand-black)' }}
          >
            Invite
          </button>
        )}
      </div>

      {/* Invite form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={prefersReduced ? { opacity: 1 } : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={prefersReduced ? { opacity: 0 } : { opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden space-y-3"
          >
            <input
              type="email"
              placeholder="Colleague's email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg px-3 py-2 text-sm outline-none"
              style={{
                background: 'var(--surface-glass)',
                border: '1px solid var(--surface-border)',
                color: 'var(--text-on-dark)',
              }}
            />
            <textarea
              placeholder="Optional message (they'll see this in the email)"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={2}
              className="w-full rounded-lg px-3 py-2 text-sm outline-none resize-none"
              style={{
                background: 'var(--surface-glass)',
                border: '1px solid var(--surface-border)',
                color: 'var(--text-on-dark)',
              }}
            />

            {error && (
              <p className="text-xs text-rose-400">{error}</p>
            )}

            {success ? (
              <p className="text-xs font-medium" style={{ color: 'var(--brand-gold)' }}>
                Invite sent! They will get a link to the quiz.
              </p>
            ) : (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleInvite}
                  disabled={sending || !email.trim()}
                  className="rounded-lg px-4 py-2 text-sm font-bold transition-all hover:brightness-110 disabled:opacity-50"
                  style={{ background: 'var(--brand-gold)', color: 'var(--brand-black)' }}
                >
                  {sending ? 'Sending...' : 'Send Invite'}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setError(null); }}
                  className="rounded-lg px-3 py-2 text-xs"
                  style={{ color: 'var(--text-on-dark-muted)' }}
                >
                  Cancel
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pending invites */}
      {invites.length > 0 && (
        <div className="space-y-2">
          {invites.slice(0, 5).map((inv) => (
            <div
              key={inv.id}
              className="flex items-center justify-between py-1.5"
              style={{ borderTop: '1px solid var(--surface-border)' }}
            >
              <div>
                <p className="text-xs" style={{ color: 'var(--text-on-dark-secondary)' }}>
                  {inv.invitee_email}
                </p>
                {inv.status === 'completed' && inv.invitee_archetype && (
                  <p className="text-[10px] font-medium" style={{ color: 'var(--brand-gold)' }}>
                    {archetypeName(inv.invitee_archetype) ?? 'Completed'} — {rayNames(inv.invitee_archetype)}
                  </p>
                )}
              </div>
              <span
                className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                style={{
                  background: inv.status === 'completed'
                    ? 'rgba(248, 208, 17, 0.12)'
                    : 'rgba(255, 255, 255, 0.06)',
                  color: inv.status === 'completed'
                    ? 'var(--brand-gold)'
                    : 'var(--text-on-dark-muted)',
                }}
              >
                {inv.status === 'completed' ? 'Matched' : inv.status === 'accepted' ? 'In progress' : 'Pending'}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Team Constellation mini-view for completed pairs */}
      {completedPairs.length > 0 && (
        <div className="pt-2 space-y-2" style={{ borderTop: '1px solid var(--surface-border)' }}>
          <p
            className="text-[10px] uppercase tracking-wider font-bold"
            style={{ color: 'var(--brand-gold)' }}
          >
            Your Constellation
          </p>
          <div className="flex flex-wrap gap-2">
            {completedPairs.map((inv) => {
              const name = archetypeName(inv.invitee_archetype);
              return (
                <div
                  key={inv.id}
                  className="rounded-lg px-3 py-2 text-center"
                  style={{ background: 'rgba(248, 208, 17, 0.06)', border: '1px solid rgba(248, 208, 17, 0.15)' }}
                >
                  <p className="text-xs font-semibold" style={{ color: 'var(--text-on-dark)' }}>
                    {name ?? 'Unknown'}
                  </p>
                  <p className="text-[10px]" style={{ color: 'var(--text-on-dark-muted)' }}>
                    {inv.invitee_email.split('@')[0]}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
