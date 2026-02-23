'use client';

import {
  createContext,
  useCallback,
  useContext,
  useState,
  useEffect,
  useRef,
} from 'react';

// ── Types ────────────────────────────────────────────────────────────────────

type ToastVariant = 'success' | 'info' | 'warning' | 'error';

interface ToastItem {
  id: string;
  message: string;
  variant: ToastVariant;
  duration: number;
}

interface ToastContextValue {
  toast: (message: string, variant?: ToastVariant, duration?: number) => void;
}

// ── Context ──────────────────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return ctx;
}

// ── Variant styling ──────────────────────────────────────────────────────────

const VARIANT_STYLES: Record<ToastVariant, { border: string; accent: string }> = {
  success: {
    border: 'var(--surface-border-hover)',
    accent: 'var(--brand-gold, #F8D011)',
  },
  info: {
    border: 'var(--surface-border-hover)',
    accent: 'var(--cosmic-purple-light)',
  },
  warning: {
    border: 'rgba(251, 191, 36, 0.5)',
    accent: 'rgb(251, 191, 36)',
  },
  error: {
    border: 'rgba(244, 63, 94, 0.5)',
    accent: 'rgb(244, 63, 94)',
  },
};

const MAX_VISIBLE = 3;
let nextId = 0;

// ── Single Toast ─────────────────────────────────────────────────────────────

function ToastCard({
  item,
  onDismiss,
}: {
  item: ToastItem;
  onDismiss: (id: string) => void;
}) {
  const style = VARIANT_STYLES[item.variant];
  const [exiting, setExiting] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setExiting(true);
      setTimeout(() => onDismiss(item.id), 300);
    }, item.duration);

    return () => clearTimeout(timerRef.current);
  }, [item.id, item.duration, onDismiss]);

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-auto glass-card px-4 py-3 flex items-center gap-3 transition-all duration-300"
      style={{
        borderColor: style.border,
        opacity: exiting ? 0 : 1,
        transform: exiting ? 'translateX(100%)' : 'translateX(0)',
        maxWidth: '22rem',
      }}
    >
      <span
        className="h-2 w-2 rounded-full shrink-0"
        style={{ background: style.accent }}
      />
      <p
        className="text-sm font-medium flex-1"
        style={{ color: 'var(--text-on-dark, #FFFEF5)' }}
      >
        {item.message}
      </p>
      <button
        type="button"
        onClick={() => {
          setExiting(true);
          setTimeout(() => onDismiss(item.id), 300);
        }}
        className="text-xs opacity-50 hover:opacity-100 transition-opacity shrink-0"
        style={{ color: 'var(--text-on-dark, #FFFEF5)' }}
        aria-label="Dismiss"
      >
        &times;
      </button>
    </div>
  );
}

// ── Provider ─────────────────────────────────────────────────────────────────

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (message: string, variant: ToastVariant = 'success', duration = 4000) => {
      const id = `toast-${++nextId}`;
      setToasts((prev) => {
        const next = [...prev, { id, message, variant, duration }];
        // Keep only the most recent MAX_VISIBLE
        return next.slice(-MAX_VISIBLE);
      });
    },
    [],
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}

      {/* Toast stack — fixed bottom-right */}
      {toasts.length > 0 && (
        <div
          className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none"
          aria-label="Notifications"
        >
          {toasts.map((item) => (
            <ToastCard key={item.id} item={item} onDismiss={dismiss} />
          ))}
        </div>
      )}
    </ToastContext.Provider>
  );
}
