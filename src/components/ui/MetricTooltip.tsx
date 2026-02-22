'use client';

import { useState, useRef, useEffect, type ReactNode } from 'react';
import { getMetricById } from '@/lib/metrics/registry';

interface MetricTooltipProps {
  metricId: string;
  children: ReactNode;
}

export function MetricTooltip({ metricId, children }: MetricTooltipProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const metric = getMetricById(metricId);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  if (!metric) return <>{children}</>;

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        type="button"
        className="inline-flex items-center gap-1 underline decoration-dotted underline-offset-2 cursor-help"
        onClick={() => setOpen((prev) => !prev)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        aria-describedby={`tooltip-${metricId}`}
      >
        {children}
        <svg
          width="14"
          height="14"
          viewBox="0 0 16 16"
          fill="none"
          className="inline-block opacity-50"
          aria-hidden="true"
        >
          <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
          <text
            x="8"
            y="12"
            textAnchor="middle"
            fill="currentColor"
            fontSize="10"
            fontWeight="600"
          >
            ?
          </text>
        </svg>
      </button>

      {open && (
        <div
          id={`tooltip-${metricId}`}
          role="tooltip"
          className="absolute bottom-full left-1/2 z-50 mb-2 w-72 -translate-x-1/2 rounded-xl border border-[rgba(96,5,141,0.3)] bg-[#1A0A2E] p-4 text-left shadow-xl"
        >
          <p className="text-xs font-bold uppercase tracking-wider text-[#F8D011]">
            {metric.label}
          </p>
          <p className="mt-1.5 text-xs leading-relaxed text-white/90">
            {metric.longDescription}
          </p>
          <p className="mt-2 text-[11px] leading-relaxed text-white/60">
            {metric.interpretation}
          </p>
          <div className="mt-2 flex items-center justify-between text-[10px] text-white/40">
            <span>Scale: {metric.scale}</span>
            <a
              href={`/glossary#metric-${metricId}`}
              className="text-[#F8D011]/70 underline underline-offset-2 transition-colors hover:text-[#F8D011]"
              onClick={(e) => e.stopPropagation()}
            >
              Glossary
            </a>
          </div>
          <div className="absolute -bottom-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-b border-r border-[rgba(96,5,141,0.3)] bg-[#1A0A2E]" />
        </div>
      )}
    </div>
  );
}
