'use client';

import { useState } from 'react';

interface Props {
  /** The research mechanism or principle supporting this section */
  mechanism: string;
  /** Researcher citation, e.g. "Lieberman et al. (2007)" */
  citation?: string;
  /** Optional link to methodology page section */
  anchor?: string;
}

/**
 * A "Show the science" toggle that reveals the research mechanism
 * and citation for a results section. Designed to be placed
 * inside any results card.
 */
export function ScienceToggle({ mechanism, citation, anchor }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-3">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1.5 text-[11px] font-medium transition-opacity hover:opacity-80"
        style={{ color: 'var(--gold-primary)' }}
        aria-expanded={open}
      >
        <svg
          className="h-3 w-3 transition-transform"
          style={{ transform: open ? 'rotate(90deg)' : 'rotate(0deg)' }}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
        {open ? 'Hide the science' : 'Show the science'}
      </button>

      {open && (
        <div
          className="mt-2 rounded-lg p-3 text-xs leading-relaxed"
          style={{
            background: 'color-mix(in srgb, var(--gold-primary) 4%, transparent)',
            border: '1px solid color-mix(in srgb, var(--gold-primary) 10%, transparent)',
            color: 'var(--text-on-dark-secondary)',
          }}
        >
          <p>{mechanism}</p>
          {citation && (
            <p className="mt-1.5 italic" style={{ color: 'var(--text-on-dark-muted)' }}>
              Source: {citation}
            </p>
          )}
          {anchor && (
            <a
              href={`/methodology#${anchor}`}
              className="mt-1.5 inline-block underline underline-offset-2"
              style={{ color: 'var(--gold-primary)' }}
            >
              Full methodology
            </a>
          )}
        </div>
      )}
    </div>
  );
}
