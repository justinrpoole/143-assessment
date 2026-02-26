'use client';

import { useEffect, useState } from 'react';

interface CelebrationToastProps {
  /** Message to display */
  message: string;
  /** Whether to show the toast */
  show: boolean;
  /** Duration in ms before auto-dismiss (default 2500) */
  duration?: number;
  /** Called when toast finishes */
  onDone?: () => void;
}

/**
 * CelebrationToast — Brief gold-bordered toast on action completion.
 * Auto-dismisses after duration.
 */
export default function CelebrationToast({
  message,
  show,
  duration = 2500,
  onDone,
}: CelebrationToastProps) {
  const [exiting, setExiting] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      setExiting(false);
      const exitTimer = setTimeout(() => setExiting(true), duration - 300);
      const hideTimer = setTimeout(() => {
        setVisible(false);
        setExiting(false);
        onDone?.();
      }, duration);
      return () => {
        clearTimeout(exitTimer);
        clearTimeout(hideTimer);
      };
    }
  }, [show, duration, onDone]);

  if (!visible) return null;

  return (
    <div
      className={`celebration-toast ${exiting ? 'celebration-toast--exit' : ''}`}
      role="status"
      aria-live="polite"
    >
      {message}
    </div>
  );
}
