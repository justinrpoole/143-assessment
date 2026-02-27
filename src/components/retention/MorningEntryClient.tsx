"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useCosmicMotion } from '@/lib/motion/use-cosmic-motion';
import CosmicSkeleton from "@/components/ui/CosmicSkeleton";
import CelebrationToast from "@/components/ui/CelebrationToast";
import { ShareCardButton } from "@/components/sharecards/ShareCardButton";
import { humanizeError } from "@/lib/ui/error-messages";
import { MORNING_ENTRY_SAVED, maybeVariableReward, type CelebrationTrigger } from "@/lib/celebrations/triggers";
import { haptic } from "@/lib/haptics";
import { useOfflineQueue } from '@/hooks/useOfflineQueue';
import { rayHex } from '@/lib/ui/ray-colors';

interface MorningEntryResponse {
  entry_date: string;
  affirmation_text: string;
  reps_logged: number;
  entry_id: string | null;
  is_saved: boolean;
  error?: string;
}

export function MorningEntryClient() {
  const shouldAnimate = useCosmicMotion();

  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [entryDate, setEntryDate] = useState<string>("");
  const { enqueue } = useOfflineQueue();
  const [affirmation, setAffirmation] = useState<string>("");
  const [repsLogged, setRepsLogged] = useState<number>(1);
  const [saved, setSaved] = useState<boolean>(false);
  const [celebration, setCelebration] = useState<CelebrationTrigger | null>(null);

  useEffect(() => {
    let canceled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/morning/entry");
        const payload = (await response.json().catch(() => ({}))) as MorningEntryResponse;
        if (!response.ok) {
          throw new Error(payload.error ?? "morning_entry_fetch_failed");
        }
        if (canceled) {
          return;
        }
        setEntryDate(payload.entry_date);
        setAffirmation(payload.affirmation_text);
        setRepsLogged(payload.reps_logged > 0 ? payload.reps_logged : 1);
        setSaved(payload.is_saved);
      } catch (requestError) {
        if (!canceled) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "morning_entry_fetch_failed",
          );
        }
      } finally {
        if (!canceled) {
          setLoading(false);
        }
      }
    }
    void load();
    return () => {
      canceled = true;
    };
  }, []);

  async function onSave() {
    setSaving(true);
    setError(null);
    try {
      const response = await fetch("/api/morning/entry", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entry_date: entryDate,
          affirmation_text: affirmation,
          reps_logged: repsLogged,
        }),
      });
      const payload = (await response.json().catch(() => ({}))) as {
        error?: string;
      };
      if (!response.ok) {
        setError(payload.error ?? "morning_entry_save_failed");
        return;
      }
      setSaved(true);
      // Celebration
      const trigger = maybeVariableReward() ?? MORNING_ENTRY_SAVED;
      setCelebration(trigger);
      if (trigger.haptic) haptic('medium');
    } catch (requestError) {
      // Queue for offline retry if network is down
      if (!navigator.onLine) {
        enqueue('/api/morning/entry', 'PUT', {
          entry_date: entryDate,
          affirmation_text: affirmation,
          reps_logged: repsLogged,
        });
        setSaved(true);
        setError(null);
      } else {
        setError(
          requestError instanceof Error
            ? requestError.message
            : "morning_entry_save_failed",
        );
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <CelebrationToast
        message={celebration?.message ?? ''}
        show={!!celebration}
        duration={celebration?.duration ?? 2500}
        onDone={() => setCelebration(null)}
      />
      {/* Header */}
      <div className="glass-card p-5 space-y-2" style={{ borderColor: "rgba(248, 208, 17, 0.2)" }}>
        <p className="text-sm font-semibold" style={{ color: "var(--text-on-dark)" }}>
          ☀️ Morning Affirmation
        </p>
        <p className="text-sm leading-relaxed" style={{ color: "var(--text-on-dark-secondary)" }}>
          Your first words set the filter. What you tell your RAS in the morning is what it looks for all day.
          This is the priming rep — one clear statement that anchors your attention.
        </p>
      </div>

      {loading ? (
        <CosmicSkeleton rows={2} height="h-24" />
      ) : (
        <motion.div
          initial={shouldAnimate ? { opacity: 0, y: 12 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: shouldAnimate ? undefined : 0 }}
          className="space-y-5"
        >
          {/* Date indicator */}
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ background: "var(--brand-gold, #F8D011)" }} />
            <p className="text-xs" style={{ color: "var(--text-on-dark-muted)" }}>
              {new Date(entryDate + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
            </p>
          </div>

          {/* Affirmation input */}
          <div className="glass-card p-5 space-y-3">
            <label className="block text-xs font-bold uppercase tracking-widest"
              style={{ color: rayHex('R1') }}
              htmlFor="morning_affirmation">
              Today&apos;s affirmation
            </label>
            <textarea
              id="morning_affirmation"
              className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/40 resize-none"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid var(--surface-border)",
                color: "var(--text-on-dark)",
              }}
              rows={3}
              value={affirmation}
              onChange={(event) => setAffirmation(event.target.value)}
              placeholder="I am..."
            />
            <p className="text-xs italic" style={{ color: "var(--text-on-dark-muted)" }}>
              🧠 Speak to your RAS directly. &ldquo;I am...&rdquo; statements prime the filter most effectively.
            </p>
          </div>

          {/* Reps target */}
          <div className="glass-card p-5 space-y-3">
            <label className="block text-xs font-bold uppercase tracking-widest"
              style={{ color: rayHex('R1') }}
              htmlFor="morning_reps">
              Reps planned today
            </label>
            <div className="flex items-center gap-4">
              <input
                id="morning_reps"
                type="number"
                min={0}
                className="w-20 rounded-lg px-3 py-2 text-sm text-center focus:outline-none"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid var(--surface-border)",
                  color: "var(--text-on-dark)",
                }}
                value={repsLogged}
                onChange={(event) => setRepsLogged(Math.max(0, Number(event.target.value) || 0))}
              />
              <p className="text-xs" style={{ color: "var(--text-on-dark-muted)" }}>
                Even 1 rep counts. Consistency beats intensity.
              </p>
            </div>
          </div>

          {/* Save */}
          <button
            type="button"
            className="btn-primary w-full"
            disabled={saving}
            onClick={() => void onSave()}
          >
            {saving ? "Saving..." : "Set today\u2019s intention ✓"}
          </button>

          {/* Saved confirmation */}
          {saved && (
            <motion.div
              initial={shouldAnimate ? { opacity: 0 } : false}
              animate={{ opacity: 1 }}
              transition={{ duration: shouldAnimate ? undefined : 0 }}
              className="glass-card p-4 text-center"
              style={{ borderColor: "rgba(34, 197, 94, 0.3)" }}
            >
              <p className="text-sm font-medium" style={{ color: "#22C55E" }}>
                ✓ Morning intention set. Your RAS is primed.
              </p>
              <p className="text-xs mt-1" style={{ color: "var(--text-on-dark-muted)" }}>
                Come back tonight for your reflection loop. Growth is a delta.
              </p>
            </motion.div>
          )}

          <ShareCardButton
            type="morning"
            shortLine="One clear rep sets the tone for the day."
            buttonLabel="Generate Morning Share Card"
          />
        </motion.div>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-lg px-4 py-3 flex items-center justify-between gap-3" role="alert"
          style={{ background: "rgba(220, 38, 38, 0.15)", border: "1px solid rgba(220, 38, 38, 0.3)" }}>
          <p className="text-sm" style={{ color: "#FCA5A5" }}>{humanizeError(error)}</p>
          <button
            type="button"
            onClick={() => void onSave()}
            disabled={saving}
            className="btn-primary text-xs py-1.5 px-4 flex-shrink-0"
          >
            {saving ? 'Retrying\u2026' : 'Try Again'}
          </button>
        </div>
      )}
    </div>
  );
}
