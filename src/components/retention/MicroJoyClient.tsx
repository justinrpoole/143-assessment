"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCosmicMotion } from '@/lib/motion/use-cosmic-motion';
import { humanizeError } from "@/lib/ui/error-messages";

type JoyCategory = "default" | "focus" | "energy" | "connection";

interface SuggestionPayload {
  entry_id?: string;
  suggestion_text?: string;
  template_key?: string;
  category?: string;
  generation_index?: number;
  remaining_swaps?: number;
  error?: string;
}

interface EntryListPayload {
  entries?: Array<{
    id: string;
    suggestion_text: string;
    selected: boolean;
    notes: string | null;
    template_key: string | null;
    local_date: string;
    created_at: string;
  }>;
  error?: string;
}

const CATEGORY_OPTIONS: { key: JoyCategory; label: string; emoji: string; description: string }[] = [
  { key: "default", label: "Any", emoji: "✨", description: "Surprise me with something small and good." },
  { key: "focus", label: "Focus", emoji: "🎯", description: "Something to sharpen attention." },
  { key: "energy", label: "Energy", emoji: "⚡", description: "Something to restore or shift energy." },
  { key: "connection", label: "Connection", emoji: "💛", description: "Something that reconnects me to others." },
];

export function MicroJoyClient() {
  const shouldAnimate = useCosmicMotion();

  const [category, setCategory] = useState<JoyCategory>("default");
  const [loadingSuggestion, setLoadingSuggestion] = useState<boolean>(false);
  const [savingSelection, setSavingSelection] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [entryId, setEntryId] = useState<string | null>(null);
  const [suggestionText, setSuggestionText] = useState<string | null>(null);
  const [templateKey, setTemplateKey] = useState<string | null>(null);
  const [remainingSwaps, setRemainingSwaps] = useState<number>(3);
  const [notes, setNotes] = useState<string>("");
  const [recentEntries, setRecentEntries] = useState<EntryListPayload["entries"]>([]);
  const [saved, setSaved] = useState<boolean>(false);

  const canSwap = useMemo(() => remainingSwaps > 0, [remainingSwaps]);

  async function loadRecent() {
    const response = await fetch("/api/micro-joy/entry");
    const payload = (await response.json().catch(() => ({}))) as EntryListPayload;
    if (!response.ok) {
      throw new Error(payload.error ?? "microjoy_entries_fetch_failed");
    }
    setRecentEntries(payload.entries ?? []);
  }

  useEffect(() => {
    let canceled = false;
    async function boot() {
      try {
        await loadRecent();
      } catch (requestError) {
        if (!canceled) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "microjoy_entries_fetch_failed",
          );
        }
      }
    }
    void boot();
    return () => {
      canceled = true;
    };
  }, []);

  async function generateSuggestion(isSwap: boolean) {
    setLoadingSuggestion(true);
    setError(null);
    setSaved(false);
    try {
      const response = await fetch("/api/micro-joy/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          previous_template_key: isSwap ? templateKey : undefined,
        }),
      });
      const payload = (await response.json().catch(() => ({}))) as SuggestionPayload;
      if (!response.ok) {
        setError(payload.error ?? "microjoy_generate_failed");
        return;
      }
      setEntryId(payload.entry_id ?? null);
      setSuggestionText(payload.suggestion_text ?? null);
      setTemplateKey(payload.template_key ?? null);
      setRemainingSwaps(
        typeof payload.remaining_swaps === "number" ? payload.remaining_swaps : 0,
      );
      await loadRecent();
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "microjoy_generate_failed",
      );
    } finally {
      setLoadingSuggestion(false);
    }
  }

  async function saveSelection() {
    if (!entryId) {
      setError("Generate a suggestion first.");
      return;
    }
    setSavingSelection(true);
    setError(null);
    try {
      const response = await fetch("/api/micro-joy/entry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entry_id: entryId,
          notes,
          save_to_favorites: notes.trim().length > 0,
        }),
      });
      const payload = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) {
        setError(payload.error ?? "microjoy_entry_save_failed");
        return;
      }
      setSaved(true);
      await loadRecent();
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "microjoy_entry_save_failed",
      );
    } finally {
      setSavingSelection(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card p-5 space-y-2" style={{ borderColor: "color-mix(in srgb, var(--violet-650) 30%, transparent)" }}>
        <div className="flex items-center gap-2">
          <span className="neon-tag text-xs font-bold">JOY</span>
          <p className="text-sm font-semibold" style={{ color: "var(--text-on-dark)" }}>
            Micro Joy Generator
          </p>
        </div>
        <p className="text-sm leading-relaxed" style={{ color: "var(--text-on-dark-secondary)" }}>
          Generate one small reset for today. Joy isn&apos;t a luxury — it&apos;s a signal to your RAS
          that the world has good in it. That signal changes what your brain looks for next.
        </p>
      </div>

      {/* Category selector */}
      <div className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-widest"
          style={{ color: "var(--gold-primary)" }}>
          What do you need?
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {CATEGORY_OPTIONS.map((opt) => {
            const active = category === opt.key;
            return (
              <button
                key={opt.key}
                type="button"
                onClick={() => setCategory(opt.key)}
                className={`glass-card glass-card--interactive p-3 text-center transition-all ${
                  active ? "shadow-[0_0_12px_color-mix(in srgb, var(--violet-650) 30%, transparent)]" : ""
                }`}
                style={{
                  borderColor: active ? "var(--text-body)" : "var(--surface-border)",
                }}
              >
                <span className="text-lg">{opt.emoji}</span>
                <p className="text-xs font-medium mt-1" style={{ color: "var(--text-on-dark)" }}>
                  {opt.label}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Generate / Swap */}
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          className="btn-primary"
          disabled={loadingSuggestion}
          onClick={() => void generateSuggestion(false)}
        >
          {loadingSuggestion ? "Generating..." : "Generate"}
        </button>
        <button
          type="button"
          className="btn-watch"
          disabled={loadingSuggestion || !canSwap}
          onClick={() => void generateSuggestion(true)}
        >
          Swap ({remainingSwaps} left)
        </button>
      </div>

      {/* Suggestion card */}
      <AnimatePresence mode="wait">
        {suggestionText && (
          <motion.div
            key={suggestionText}
            initial={shouldAnimate ? { opacity: 0, y: 12 } : false}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldAnimate ? { opacity: 0, y: -8 } : undefined}
            transition={{ duration: shouldAnimate ? undefined : 0 }}
            className="glass-card p-5 space-y-4"
            style={{ borderColor: "color-mix(in srgb, var(--gold-primary) 20%, transparent)", boxShadow: "0 0 20px color-mix(in srgb, var(--gold-primary) 6%, transparent)" }}
          >
            <p className="text-base font-medium leading-relaxed" style={{ color: "var(--text-on-dark)" }}>
              {suggestionText}
            </p>

            <div className="space-y-2">
              <label className="block text-xs font-medium"
                style={{ color: "var(--text-on-dark-muted)" }}
                htmlFor="joy_notes">
                How did it land? <span className="font-normal">(optional)</span>
              </label>
              <textarea
                id="joy_notes"
                className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/40 resize-none"
                style={{
                  background: "color-mix(in srgb, var(--text-body) 6%, transparent)",
                  border: "1px solid var(--surface-border)",
                  color: "var(--text-on-dark)",
                }}
                rows={2}
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="What did you notice? Even one word."
              />
            </div>

            <button
              type="button"
              className="btn-primary"
              disabled={savingSelection}
              onClick={() => void saveSelection()}
            >
              {savingSelection ? "Saving..." : "Done — I did this ✓"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Saved confirmation */}
      {saved && (
        <motion.div
          initial={shouldAnimate ? { opacity: 0 } : false}
          animate={{ opacity: 1 }}
          transition={{ duration: shouldAnimate ? undefined : 0 }}
          className="glass-card p-4 text-center"
          style={{ borderColor: "var(--surface-border)" }}
        >
          <p className="text-sm font-medium" style={{ color: "var(--ray-authenticity)" }}>
            ✓ Micro joy logged. Your RAS noticed.
          </p>
          <p className="text-xs mt-1" style={{ color: "var(--text-on-dark-muted)" }}>
            Small joys compound. Your brain is learning to look for them.
          </p>
        </motion.div>
      )}

      {/* Recent picks */}
      {(recentEntries ?? []).length > 0 && (
        <div className="glass-card p-4 space-y-3">
          <p className="gold-tag inline-block text-xs font-bold">
            Recent picks
          </p>
          <div className="gold-rule my-2" />
          <ul className="space-y-2">
            {(recentEntries ?? []).map((entry) => (
              <li key={entry.id} className="flex items-start gap-2">
                <span className="text-xs mt-0.5" style={{ color: entry.selected ? "var(--ray-authenticity)" : "var(--text-on-dark-muted)" }}>
                  {entry.selected ? "✓" : "○"}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm" style={{ color: "var(--text-on-dark-secondary)" }}>
                    {entry.suggestion_text}
                  </p>
                  <p className="text-xs" style={{ color: "var(--text-on-dark-muted)" }}>
                    {entry.local_date}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-lg px-4 py-3"
          style={{ background: "var(--surface-border)", border: "1px solid var(--surface-border)" }}>
          <p className="text-sm" style={{ color: "var(--ray-power)" }} role="alert">{humanizeError(error)}</p>
        </div>
      )}
    </div>
  );
}
