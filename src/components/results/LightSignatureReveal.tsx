'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import type { AssessmentOutputV1 } from '@/lib/types';
import { RAY_COLORS } from '@/lib/ui/ray-colors';

interface Props {
  output: AssessmentOutputV1;
  runId: string;
  onComplete: () => void;
}

const STORAGE_KEY = 'reveal-seen';

function hasSeenReveal(runId: string): boolean {
  try {
    const seen = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    return Array.isArray(seen) && seen.includes(runId);
  } catch {
    return false;
  }
}

function markRevealSeen(runId: string) {
  try {
    const seen = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    if (Array.isArray(seen) && !seen.includes(runId)) {
      seen.push(runId);
      // Keep only last 20 entries
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seen.slice(-20)));
    }
  } catch {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([runId]));
  }
}

/** Resolve ray ID to color hex */
function rayColor(rayId: string): string {
  return RAY_COLORS[rayId]?.hex ?? '#F8D011';
}

/*──────────────────────────────────────────────────────────────────────
 * Slide variants — each screen fades + slides in
 *────────────────────────────────────────────────────────────────────*/
const slideVariants = {
  enter: { opacity: 0, y: 40, scale: 0.96 },
  center: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -30, scale: 0.98 },
};

const slideTransition = {
  type: 'spring' as const,
  stiffness: 80,
  damping: 22,
  mass: 0.8,
};

/*──────────────────────────────────────────────────────────────────────
 * Progress dots
 *────────────────────────────────────────────────────────────────────*/
function ProgressDots({ total, current }: { total: number; current: number }) {
  return (
    <div className="flex gap-2 justify-center">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className="rounded-full transition-all duration-300"
          style={{
            width: i === current ? 24 : 8,
            height: 8,
            background:
              i === current
                ? 'var(--brand-gold, #F8D011)'
                : 'rgba(255,255,255,0.2)',
            boxShadow:
              i === current ? '0 0 12px rgba(248, 208, 17, 0.4)' : 'none',
          }}
        />
      ))}
    </div>
  );
}

/*──────────────────────────────────────────────────────────────────────
 * Individual screens
 *────────────────────────────────────────────────────────────────────*/
function ScreenWelcome() {
  return (
    <div className="flex flex-col items-center justify-center text-center px-8 min-h-[60vh]">
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="text-xs tracking-[0.3em] uppercase mb-6"
        style={{ color: 'var(--brand-gold, #F8D011)' }}
      >
        Your results are in
      </motion.p>
      <motion.h1
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, type: 'spring', stiffness: 60, damping: 20 }}
        className="text-4xl sm:text-5xl font-bold leading-tight"
        style={{
          fontFamily: 'var(--font-display)',
          color: 'var(--text-on-dark)',
        }}
      >
        Your Light Signature
        <br />
        <span style={{ color: 'var(--brand-gold, #F8D011)' }}>is ready.</span>
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="mt-6 text-sm max-w-xs"
        style={{ color: 'var(--text-on-dark-muted)' }}
      >
        Tap anywhere to begin your reveal
      </motion.p>
    </div>
  );
}

function ScreenTopRay({
  rayId,
  rayName,
  insight,
  ordinal,
}: {
  rayId: string;
  rayName: string;
  insight: string;
  ordinal: string;
}) {
  const hex = rayColor(rayId);
  return (
    <div className="flex flex-col items-center justify-center text-center px-8 min-h-[60vh]">
      {/* Glow orb */}
      <motion.div
        initial={{ opacity: 0, scale: 0.4 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 50, damping: 15 }}
        className="mb-8 rounded-full"
        style={{
          width: 120,
          height: 120,
          background: `radial-gradient(circle, ${hex}44 0%, ${hex}11 50%, transparent 70%)`,
          boxShadow: `0 0 60px ${hex}33, 0 0 120px ${hex}18`,
        }}
      />
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="text-xs tracking-[0.3em] uppercase mb-3"
        style={{ color: `${hex}cc` }}
      >
        {ordinal} primary ray
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, type: 'spring', stiffness: 70, damping: 20 }}
        className="text-3xl sm:text-4xl font-bold"
        style={{
          fontFamily: 'var(--font-display)',
          color: hex,
          textShadow: `0 0 30px ${hex}40`,
        }}
      >
        {rayName}
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="mt-6 text-sm leading-relaxed max-w-sm"
        style={{ color: 'var(--text-on-dark-secondary)' }}
      >
        {insight}
      </motion.p>
    </div>
  );
}

function ScreenArchetype({
  name,
  essence,
}: {
  name: string;
  essence: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center px-8 min-h-[60vh]">
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="text-xs tracking-[0.3em] uppercase mb-4"
        style={{ color: 'var(--brand-gold, #F8D011)' }}
      >
        Your Light Signature
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, scale: 0.8, filter: 'blur(8px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        transition={{
          delay: 0.6,
          type: 'spring',
          stiffness: 50,
          damping: 18,
          mass: 1.2,
        }}
        className="text-4xl sm:text-6xl font-bold"
        style={{
          fontFamily: 'var(--font-display)',
          color: 'var(--text-on-dark)',
          textShadow:
            '0 0 40px rgba(248, 208, 17, 0.3), 0 0 80px rgba(96, 5, 141, 0.2)',
        }}
      >
        {name}
      </motion.h2>
      <motion.div
        initial={{ opacity: 0, width: 0 }}
        animate={{ opacity: 1, width: 120 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="h-px mt-6"
        style={{
          background:
            'linear-gradient(90deg, transparent, var(--brand-gold), transparent)',
        }}
      />
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        className="mt-6 text-base leading-relaxed max-w-md"
        style={{ color: 'var(--text-on-dark-secondary)' }}
      >
        {essence}
      </motion.p>
    </div>
  );
}

function ScreenEclipse({ level, gateMode }: { level: string; gateMode?: string }) {
  const levelLabels: Record<string, string> = {
    LOW: 'Clear skies',
    MODERATE: 'Partial cloud cover',
    ELEVATED: 'Heavy cloud cover',
    HIGH: 'Full eclipse',
  };
  const levelInsights: Record<string, string> = {
    LOW: 'Your system is steady. Capacity for growth work is high right now. This is a window — use it.',
    MODERATE: 'You are carrying some load. That is normal — your strongest capacities remain online.',
    ELEVATED: 'Your system is working hard. The load is real but temporary. Recovery is the rep right now.',
    HIGH: 'Significant load detected. What you see is protection, not limitation. Every capacity is still in you.',
  };
  const levelColors: Record<string, string> = {
    LOW: '#A78BFA',
    MODERATE: '#F8D011',
    ELEVATED: '#F59E0B',
    HIGH: '#FB923C',
  };
  const color = levelColors[level] ?? '#F8D011';

  return (
    <div className="flex flex-col items-center justify-center text-center px-8 min-h-[60vh]">
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-xs tracking-[0.3em] uppercase mb-4"
        style={{ color: `${color}cc` }}
      >
        Eclipse Weather
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 70, damping: 20 }}
        className="text-3xl sm:text-4xl font-bold"
        style={{
          fontFamily: 'var(--font-display)',
          color,
          textShadow: `0 0 30px ${color}30`,
        }}
      >
        {levelLabels[level] ?? level}
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.6 }}
        className="mt-6 text-sm leading-relaxed max-w-sm"
        style={{ color: 'var(--text-on-dark-secondary)' }}
      >
        {levelInsights[level] ?? ''}
      </motion.p>
      {gateMode && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3, duration: 0.5 }}
          className="mt-4 text-xs"
          style={{ color: 'var(--text-on-dark-muted)' }}
        >
          Mode: {gateMode.replace(/_/g, ' ').toLowerCase()}
        </motion.p>
      )}
    </div>
  );
}

function ScreenRisePath({
  rayName,
  insight,
  rayId,
}: {
  rayName: string;
  insight: string;
  rayId: string;
}) {
  const hex = rayColor(rayId);
  return (
    <div className="flex flex-col items-center justify-center text-center px-8 min-h-[60vh]">
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-xs tracking-[0.3em] uppercase mb-4"
        style={{ color: `${hex}cc` }}
      >
        Your Rise Path
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 70, damping: 20 }}
        className="text-3xl sm:text-4xl font-bold"
        style={{
          fontFamily: 'var(--font-display)',
          color: hex,
          textShadow: `0 0 30px ${hex}40`,
        }}
      >
        {rayName}
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.6 }}
        className="mt-6 text-sm leading-relaxed max-w-sm"
        style={{ color: 'var(--text-on-dark-secondary)' }}
      >
        {insight}
      </motion.p>
    </div>
  );
}

function ScreenFinal({ onContinue }: { onContinue: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center text-center px-8 min-h-[60vh]">
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-xs tracking-[0.3em] uppercase mb-4"
        style={{ color: 'var(--brand-gold, #F8D011)' }}
      >
        Your map is ready
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 70, damping: 20 }}
        className="text-2xl sm:text-3xl font-bold"
        style={{
          fontFamily: 'var(--font-display)',
          color: 'var(--text-on-dark)',
        }}
      >
        Nothing here is beyond you.
        <br />
        <span style={{ color: 'var(--brand-gold, #F8D011)' }}>
          Something here is ready.
        </span>
      </motion.h2>
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        onClick={(e) => {
          e.stopPropagation();
          onContinue();
        }}
        className="mt-10 px-8 py-3 rounded-full font-semibold text-sm"
        style={{
          background:
            'linear-gradient(135deg, var(--brand-purple, #60058D), var(--brand-gold, #F8D011))',
          color: '#fff',
          boxShadow:
            '0 0 20px rgba(96, 5, 141, 0.4), 0 0 40px rgba(248, 208, 17, 0.2)',
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
      >
        See your full report
      </motion.button>
    </div>
  );
}

/*──────────────────────────────────────────────────────────────────────
 * Main Reveal Component
 *────────────────────────────────────────────────────────────────────*/
export default function LightSignatureReveal({ output, runId, onComplete }: Props) {
  const prefersReduced = useReducedMotion();
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!hasSeenReveal(runId)) {
      setVisible(true);
    }
  }, [runId]);

  const finish = useCallback(() => {
    markRevealSeen(runId);
    setVisible(false);
    onComplete();
  }, [runId, onComplete]);

  // Build screens from assessment data
  const topTwo = output.light_signature?.top_two ?? [];
  const archetype = output.light_signature?.archetype;
  const eclipse = output.eclipse;
  const justIn = output.light_signature?.just_in_ray;

  const screens: React.ReactNode[] = [
    <ScreenWelcome key="welcome" />,
  ];

  if (topTwo[0]) {
    screens.push(
      <ScreenTopRay
        key="ray1"
        rayId={topTwo[0].ray_id}
        rayName={topTwo[0].ray_name}
        insight={topTwo[0].why_resourced || 'This ray is your most accessible capacity right now.'}
        ordinal="Your first"
      />,
    );
  }

  if (topTwo[1]) {
    screens.push(
      <ScreenTopRay
        key="ray2"
        rayId={topTwo[1].ray_id}
        rayName={topTwo[1].ray_name}
        insight={topTwo[1].why_resourced || 'This ray is your second most accessible capacity.'}
        ordinal="Your second"
      />,
    );
  }

  if (archetype) {
    screens.push(
      <ScreenArchetype
        key="archetype"
        name={archetype.name}
        essence={archetype.essence || 'A unique combination of leadership capacities.'}
      />,
    );
  }

  if (eclipse) {
    screens.push(
      <ScreenEclipse
        key="eclipse"
        level={eclipse.level}
        gateMode={eclipse.gating?.mode}
      />,
    );
  }

  if (justIn) {
    screens.push(
      <ScreenRisePath
        key="rise"
        rayName={justIn.ray_name}
        rayId={justIn.ray_id}
        insight={
          justIn.why_this_is_next ||
          'This is the capacity with the most room to move. One rep today teaches your brain that change is underway.'
        }
      />,
    );
  }

  screens.push(<ScreenFinal key="final" onContinue={finish} />);

  const totalScreens = screens.length;
  const isLastScreen = step === totalScreens - 1;

  const advance = useCallback(() => {
    if (isLastScreen) return;
    setStep((s) => Math.min(s + 1, totalScreens - 1));
  }, [isLastScreen, totalScreens]);

  // Skip for reduced motion
  if (prefersReduced && visible) {
    markRevealSeen(runId);
    setVisible(false);
    onComplete();
    return null;
  }

  if (!visible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col"
      style={{
        background:
          'radial-gradient(ellipse at 50% 30%, rgba(96, 5, 141, 0.35) 0%, transparent 60%), linear-gradient(180deg, #0a0420 0%, #1E0E35 50%, #0a0420 100%)',
      }}
      onClick={advance}
    >
      {/* Skip button */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={(e) => {
            e.stopPropagation();
            finish();
          }}
          className="text-xs px-4 py-2 rounded-full"
          style={{
            color: 'var(--text-on-dark-muted)',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          Skip
        </button>
      </div>

      {/* Screen content */}
      <div className="flex-1 flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={slideTransition}
            className="w-full max-w-lg mx-auto"
          >
            {screens[step]}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress */}
      <div className="pb-8 pt-4">
        <ProgressDots total={totalScreens} current={step} />
        {!isLastScreen && (
          <p
            className="text-center text-xs mt-3"
            style={{ color: 'var(--text-on-dark-muted)' }}
          >
            Tap to continue
          </p>
        )}
      </div>
    </motion.div>
  );
}
