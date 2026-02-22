'use client';

import { useState } from 'react';

export interface TocEntry {
  id: string;
  label: string;
}

interface Props {
  entries: TocEntry[];
}

export default function ReportTableOfContents({ entries }: Props) {
  const [open, setOpen] = useState(false);

  if (entries.length === 0) return null;

  function scrollTo(id: string) {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setOpen(false);
    }
  }

  return (
    <div className="glass-card mb-6 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between px-5 py-3 text-left"
        style={{ color: 'var(--text-on-dark, #FFFEF5)' }}
      >
        <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--brand-gold, #F8D011)' }}>
          Jump to Section
        </span>
        <svg
          className={`h-4 w-4 shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          viewBox="0 0 16 16"
          fill="none"
          style={{ color: 'var(--brand-gold, #F8D011)' }}
          aria-hidden="true"
        >
          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div className="grid grid-cols-2 gap-1 px-5 pb-4 sm:grid-cols-3">
          {entries.map((entry) => (
            <button
              key={entry.id}
              type="button"
              onClick={() => scrollTo(entry.id)}
              className="rounded-lg px-3 py-2 text-left text-xs transition-colors"
              style={{ color: 'var(--text-on-dark-secondary, rgba(255,255,255,0.7))' }}
              onMouseEnter={(e) => { (e.target as HTMLElement).style.background = 'rgba(248, 208, 17, 0.08)'; }}
              onMouseLeave={(e) => { (e.target as HTMLElement).style.background = 'transparent'; }}
            >
              {entry.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
