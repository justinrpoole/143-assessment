'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

const STORAGE_KEY = '143-portal-welcomed';
const EASE: [number, number, number, number] = [0.2, 0.8, 0.2, 1];

/**
 * One-time welcome animation shown when user first enters the portal per session.
 * Fades in a brief "Welcome to your Light Portal" message, then dissolves away.
 * Uses sessionStorage so it only plays once per browser session.
 */
export default function PortalWelcome() {
  const prefersReduced = useReducedMotion();
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (!sessionStorage.getItem(STORAGE_KEY)) {
        setShow(true);
        sessionStorage.setItem(STORAGE_KEY, '1');
        const timer = setTimeout(() => setShow(false), 2800);
        return () => clearTimeout(timer);
      }
    } catch {
      // sessionStorage unavailable (private browsing edge cases)
    }
  }, []);

  if (prefersReduced || !show) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center pointer-events-none"
          style={{ background: 'var(--bg-deep, #1A0A2E)' }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          {/* Gold eclipse glow */}
          <motion.div
            className="absolute rounded-full"
            style={{
              width: 120,
              height: 120,
              background: 'radial-gradient(circle, rgba(248,208,17,0.25) 0%, transparent 70%)',
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 2.5, 2], opacity: [0, 0.8, 0.4] }}
            transition={{ duration: 1.8, ease: EASE }}
          />

          {/* Welcome text */}
          <motion.p
            className="text-xs font-bold uppercase tracking-widest"
            style={{ color: 'var(--brand-gold, #F8D011)' }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4, ease: EASE }}
          >
            Welcome back
          </motion.p>

          <motion.p
            className="mt-3 text-2xl font-semibold sm:text-3xl"
            style={{
              fontFamily: 'var(--font-cosmic-display)',
              color: 'var(--text-on-dark, #FFFEF5)',
            }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7, ease: EASE }}
          >
            Your Light Portal
          </motion.p>

          <motion.div
            className="mt-4 h-px"
            style={{
              width: 80,
              background: 'linear-gradient(90deg, transparent, var(--brand-gold, #F8D011), transparent)',
            }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 1.0, ease: EASE }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
