'use client';

import { useState, useCallback, useRef, type ReactNode } from 'react';

interface HighlightableProps {
  /** Unique block identifier within the report */
  blockId: string;
  /** The text content (used when saving highlight) */
  text: string;
  /** Whether this block is currently highlighted */
  isHighlighted: boolean;
  /** Callback when user toggles the highlight */
  onToggle: (blockId: string, text: string) => void;
  children: ReactNode;
  className?: string;
}

/**
 * Wraps report text blocks to make them highlightable.
 * - Desktop: double-click to toggle
 * - Mobile: long-press (500ms) to toggle
 *
 * Highlighted state shows a gold underline glow.
 */
export default function Highlightable({
  blockId,
  text,
  isHighlighted,
  onToggle,
  children,
  className = '',
}: HighlightableProps) {
  const [pressing, setPressing] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleDoubleClick = useCallback(() => {
    onToggle(blockId, text);
  }, [blockId, text, onToggle]);

  const handleTouchStart = useCallback(() => {
    setPressing(true);
    timerRef.current = setTimeout(() => {
      onToggle(blockId, text);
      setPressing(false);
    }, 500);
  }, [blockId, text, onToggle]);

  const handleTouchEnd = useCallback(() => {
    setPressing(false);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  return (
    <div
      className={`relative transition-all duration-200 rounded-lg ${className}`}
      onDoubleClick={handleDoubleClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      style={{
        cursor: 'pointer',
        borderLeft: isHighlighted ? '3px solid var(--brand-gold)' : '3px solid transparent',
        paddingLeft: isHighlighted ? '12px' : '12px',
        boxShadow: isHighlighted
          ? '0 0 12px rgba(248, 208, 17, 0.15)'
          : 'none',
        background: isHighlighted
          ? 'rgba(248, 208, 17, 0.04)'
          : pressing
            ? 'rgba(248, 208, 17, 0.02)'
            : 'transparent',
      }}
      role="button"
      tabIndex={0}
      aria-pressed={isHighlighted}
      aria-label={isHighlighted ? 'Remove highlight' : 'Double-click to highlight'}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onToggle(blockId, text);
        }
      }}
    >
      {children}
      {isHighlighted && (
        <span
          className="absolute top-1 right-2 text-xs select-none"
          style={{ color: 'var(--brand-gold)' }}
          aria-hidden="true"
        >
          ★
        </span>
      )}
    </div>
  );
}
