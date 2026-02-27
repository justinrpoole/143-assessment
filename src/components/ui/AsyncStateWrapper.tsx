'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import CosmicSkeleton from './CosmicSkeleton';
import CosmicEmptyState from './CosmicEmptyState';

interface AsyncStateWrapperProps {
  /** Whether data is loading */
  loading: boolean;
  /** Error message (null = no error) */
  error: string | null;
  /** Whether the data set is empty (shows empty state) */
  empty?: boolean;
  /** Called when user clicks "Try again" */
  onRetry?: () => void;
  /** Empty state messaging */
  emptyMessage?: string;
  emptyDetail?: string;
  emptyActionLabel?: string;
  emptyActionHref?: string;
  /** Skeleton config */
  skeletonRows?: number;
  skeletonHeight?: string;
  /** Children rendered when data is ready */
  children: React.ReactNode;
}

/**
 * AsyncStateWrapper — Universal loading / error / empty / retry wrapper.
 *
 * Wraps any data-fetching component and provides consistent UX for all
 * async states: skeleton loading, branded error with retry, and empty
 * state with CTA. Detects offline status and auto-retries on reconnect.
 */
export default function AsyncStateWrapper({
  loading,
  error,
  empty = false,
  onRetry,
  emptyMessage = 'Nothing here yet.',
  emptyDetail,
  emptyActionLabel,
  emptyActionHref,
  skeletonRows = 3,
  skeletonHeight = 'h-24',
  children,
}: AsyncStateWrapperProps) {
  const [isOffline, setIsOffline] = useState(false);
  const [retrying, setRetrying] = useState(false);
  const retryCountRef = useRef(0);

  // Offline detection
  useEffect(() => {
    const goOffline = () => setIsOffline(true);
    const goOnline = () => {
      setIsOffline(false);
      // Auto-retry on reconnect (max 3 attempts)
      if (error && onRetry && retryCountRef.current < 3) {
        retryCountRef.current += 1;
        onRetry();
      }
    };
    window.addEventListener('offline', goOffline);
    window.addEventListener('online', goOnline);
    setIsOffline(!navigator.onLine);
    return () => {
      window.removeEventListener('offline', goOffline);
      window.removeEventListener('online', goOnline);
    };
  }, [error, onRetry]);

  // Reset retry count when loading starts fresh
  useEffect(() => {
    if (loading) {
      retryCountRef.current = 0;
      setRetrying(false);
    }
  }, [loading]);

  const handleRetry = useCallback(() => {
    if (!onRetry) return;
    setRetrying(true);
    retryCountRef.current += 1;
    onRetry();
  }, [onRetry]);

  // Offline banner
  if (isOffline && !loading && error) {
    return (
      <div
        className="rounded-2xl px-6 py-8 text-center"
        style={{
          background: 'var(--surface-glass)',
          border: '1px solid var(--surface-border)',
        }}
        role="alert"
        aria-live="polite"
      >
        <p
          className="text-xs font-bold uppercase tracking-widest mb-2"
          style={{ color: 'var(--cosmic-amber)' }}
        >
          You&apos;re Offline
        </p>
        <p
          className="text-sm leading-relaxed max-w-sm mx-auto"
          style={{ color: 'var(--text-on-dark-secondary)' }}
        >
          Your connection dropped. We&apos;ll sync automatically when you&apos;re back online.
        </p>
      </div>
    );
  }

  // Loading
  if (loading) {
    return <CosmicSkeleton rows={skeletonRows} height={skeletonHeight} />;
  }

  // Error with retry
  if (error) {
    return (
      <div
        className="rounded-2xl px-6 py-8 text-center"
        style={{
          background: 'var(--surface-glass)',
          border: '1px solid rgba(244, 63, 94, 0.25)',
        }}
        role="alert"
        aria-live="polite"
      >
        <p
          className="text-xs font-bold uppercase tracking-widest mb-2"
          style={{ color: 'rgba(244, 63, 94, 0.8)' }}
        >
          Something went sideways
        </p>
        <p
          className="text-sm leading-relaxed max-w-sm mx-auto mb-4"
          style={{ color: 'var(--text-on-dark-secondary)' }}
        >
          {error}
        </p>
        {onRetry && retryCountRef.current < 3 && (
          <button
            type="button"
            onClick={handleRetry}
            disabled={retrying}
            className="btn-primary inline-block rounded-xl px-5 py-2 text-xs font-semibold"
          >
            {retrying ? 'Retrying…' : 'Try Again'}
          </button>
        )}
        {retryCountRef.current >= 3 && (
          <p
            className="text-xs mt-2"
            style={{ color: 'var(--text-on-dark-muted)' }}
          >
            Still not working. Try refreshing the page.
          </p>
        )}
      </div>
    );
  }

  // Empty
  if (empty) {
    return (
      <CosmicEmptyState
        message={emptyMessage}
        detail={emptyDetail}
        actionLabel={emptyActionLabel}
        actionHref={emptyActionHref}
      />
    );
  }

  // Data ready
  return <>{children}</>;
}
