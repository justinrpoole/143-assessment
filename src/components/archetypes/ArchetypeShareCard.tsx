'use client';

import { useState, useCallback, useEffect } from 'react';
import type { ArchetypePublic } from '@/lib/types';

/**
 * ArchetypeShareCard — Neon-glow modal card for sharing a Light Signature.
 * Uses Web Share API with clipboard fallback.
 */
export default function ArchetypeShareCard({
  archetype,
  onClose,
}: {
  archetype: ArchetypePublic;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const shareUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/archetypes#sig-${archetype.index}`
      : '';
  const shareText = `I'm a ${archetype.name}. "${archetype.tagline}" — Find your Light Signature at 143 Leadership.`;

  const handleShare = useCallback(async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `${archetype.name} — 143 Leadership`,
          text: shareText,
          url: shareUrl,
        });
      } catch {
        /* user cancelled */
      }
    } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [archetype.name, shareText, shareUrl]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Share ${archetype.name}`}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-sm rounded-3xl p-8 text-center space-y-5"
        style={{
          background:
            'linear-gradient(135deg, rgba(11,2,18,0.96) 0%, rgba(26,10,46,0.96) 100%)',
          border: `2px solid ${archetype.neon_color}40`,
          boxShadow: `0 0 60px ${archetype.neon_color}20, 0 0 120px ${archetype.neon_color}10`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Identity code */}
        <p
          className="text-[10px] font-bold uppercase tracking-[0.3em]"
          style={{ color: archetype.neon_color }}
        >
          {archetype.identity_code}
        </p>

        {/* Name */}
        <h2
          className="text-2xl font-bold"
          style={{
            color: 'var(--text-on-dark)',
            textShadow: `0 0 30px ${archetype.neon_color}30`,
          }}
        >
          {archetype.name}
        </h2>

        {/* Tagline */}
        <p
          className="text-sm leading-relaxed"
          style={{ color: 'var(--text-on-dark-secondary)' }}
        >
          {archetype.tagline}
        </p>

        {/* The Line — pull quote */}
        <div className="py-2">
          <p
            className="text-base font-semibold italic leading-relaxed"
            style={{ color: archetype.neon_color }}
          >
            &ldquo;{archetype.the_line}&rdquo;
          </p>
        </div>

        {/* Rays */}
        <div className="flex items-center justify-center gap-2">
          {archetype.rays.map((ray) => (
            <span
              key={ray}
              className="text-[10px] px-2.5 py-1 rounded-full font-medium"
              style={{
                background: `${archetype.neon_color}15`,
                color: archetype.neon_color,
                border: `1px solid ${archetype.neon_color}30`,
              }}
            >
              {ray}
            </span>
          ))}
        </div>

        {/* 143 branding */}
        <p
          className="text-[10px] uppercase tracking-[0.2em] pt-2"
          style={{ color: 'var(--text-on-dark-muted)' }}
        >
          143 Leadership
        </p>

        {/* Actions */}
        <div className="flex gap-3 justify-center pt-1">
          <button
            type="button"
            onClick={handleShare}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:brightness-110"
            style={{ background: archetype.neon_color, color: '#020202' }}
          >
            {copied ? 'Copied!' : 'Share This'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-medium transition-colors"
            style={{
              background: 'var(--surface-glass)',
              border: '1px solid var(--surface-border)',
              color: 'var(--text-on-dark-secondary)',
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
