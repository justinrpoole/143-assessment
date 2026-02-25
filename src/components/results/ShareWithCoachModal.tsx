'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

interface ShareWithCoachModalProps {
  runId: string;
  onClose: () => void;
}

export default function ShareWithCoachModal({ runId, onClose }: ShareWithCoachModalProps) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSending(true);

    try {
      const res = await fetch('/api/reports/share-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          run_id: runId,
          recipient_email: email || undefined,
          message: message || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({})) as { error?: string };
        throw new Error(data.error ?? 'Failed to create share link');
      }

      const data = await res.json() as { share_url: string; expires_at: string };
      setShareUrl(data.share_url);
      setExpiresAt(data.expires_at);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSending(false);
    }
  }

  async function copyLink() {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback: select the text
    }
  }

  const expiresLabel = expiresAt
    ? new Date(expiresAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      })
    : '48 hours';

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: 'var(--overlay-heavy)' }}
        initial={prefersReduced ? {} : { opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="glass-card w-full max-w-md p-6 space-y-5"
          style={{ borderColor: 'rgba(248, 208, 17, 0.25)' }}
          initial={prefersReduced ? {} : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-label="Share report with coach"
        >
          {!shareUrl ? (
            <>
              <div>
                <h2 className="text-lg font-semibold" style={{ color: 'var(--text-on-dark)' }}>
                  Share with Your Coach
                </h2>
                <p className="text-sm mt-1" style={{ color: 'var(--text-on-dark-secondary)' }}>
                  Generate a read-only link to your report. It expires in 48 hours and does not require an account.
                </p>
              </div>

              <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
                <div>
                  <label htmlFor="coach-email" className="text-xs font-medium block mb-1" style={{ color: 'var(--text-on-dark-muted)' }}>
                    Coach&apos;s email (optional)
                  </label>
                  <input
                    ref={emailRef}
                    id="coach-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="yourcoach@company.com"
                    className="w-full rounded-lg px-4 py-2.5 text-sm outline-none transition-all focus:ring-2 focus:ring-brand-gold/40"
                    style={{
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid var(--surface-border)',
                      color: 'var(--text-on-dark)',
                    }}
                  />
                </div>

                <div>
                  <label htmlFor="coach-message" className="text-xs font-medium block mb-1" style={{ color: 'var(--text-on-dark-muted)' }}>
                    Message (optional)
                  </label>
                  <textarea
                    id="coach-message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Here are my assessment results — I would love to discuss what came up."
                    rows={3}
                    className="w-full rounded-lg px-4 py-2.5 text-sm outline-none transition-all resize-none focus:ring-2 focus:ring-brand-gold/40"
                    style={{
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid var(--surface-border)',
                      color: 'var(--text-on-dark)',
                    }}
                  />
                </div>

                {error && (
                  <p className="text-sm" style={{ color: 'rgb(251, 146, 60)' }}>{error}</p>
                )}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors"
                    style={{
                      background: 'var(--surface-glass)',
                      border: '1px solid var(--surface-border)',
                      color: 'var(--text-on-dark-secondary)',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={sending}
                    className="flex-1 py-2.5 rounded-lg text-sm font-bold transition-all hover:brightness-110 disabled:opacity-50"
                    style={{ background: 'var(--brand-gold)', color: 'var(--brand-black)' }}
                  >
                    {sending ? 'Creating link...' : 'Create share link'}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <>
              <div className="text-center space-y-2">
                <p className="text-2xl">&#10003;</p>
                <h2 className="text-lg font-semibold" style={{ color: 'var(--text-on-dark)' }}>
                  Link Created
                </h2>
                <p className="text-sm" style={{ color: 'var(--text-on-dark-secondary)' }}>
                  Share this link with your coach. It expires {expiresLabel}.
                </p>
              </div>

              <div
                className="rounded-lg p-3 text-xs break-all"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid var(--surface-border)',
                  color: 'var(--text-on-dark)',
                }}
              >
                {shareUrl}
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => void copyLink()}
                  className="flex-1 py-2.5 rounded-lg text-sm font-bold transition-all hover:brightness-110"
                  style={{ background: 'var(--brand-gold)', color: 'var(--brand-black)' }}
                >
                  {copied ? 'Copied!' : 'Copy link'}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors"
                  style={{
                    background: 'var(--surface-glass)',
                    border: '1px solid var(--surface-border)',
                    color: 'var(--text-on-dark-secondary)',
                  }}
                >
                  Done
                </button>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
