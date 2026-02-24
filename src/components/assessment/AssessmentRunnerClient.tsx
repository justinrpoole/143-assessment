"use client";

import {
  type FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";

import FrequencyScale from "@/components/FrequencyScale";
import ReflectionInput from "@/components/ReflectionInput";
import ScenarioCard from "@/components/ScenarioCard";
import BreathingMoment from "@/components/assessment/BreathingMoment";
import CompletionReveal from "@/components/assessment/CompletionReveal";
import { haptic } from "@/lib/haptics";

// ── Ray metadata for section dividers ────────────────────────
const RAY_META: Record<string, { name: string; phase: string; color: string }> = {
  R1: { name: 'Intention', phase: 'Reconnect', color: '#F4C430' },
  R2: { name: 'Joy', phase: 'Reconnect', color: '#F4C430' },
  R3: { name: 'Presence', phase: 'Reconnect', color: '#8E44AD' },
  R4: { name: 'Power', phase: 'Radiate', color: '#C0392B' },
  R5: { name: 'Purpose', phase: 'Radiate', color: '#D4770B' },
  R6: { name: 'Authenticity', phase: 'Radiate', color: '#8E44AD' },
  R7: { name: 'Connection', phase: 'Become', color: '#1ABC9C' },
  R8: { name: 'Possibility', phase: 'Become', color: '#1ABC9C' },
  R9: { name: 'Be The Light', phase: 'Become', color: '#F4C430' },
};

const PHASE_TRANSITIONS: Record<string, { phaseName: string; message: string }> = {
  R4: {
    phaseName: 'Entering Radiate',
    message: 'Good. You are doing the work. The next section moves from internal capacity to external action — how you show up when it matters.',
  },
  R7: {
    phaseName: 'Entering Become',
    message: "You're in the home stretch. This last phase is about the impact you have on the people around you. Stay honest — that's what makes this real.",
  },
};

interface DynamicQuestion {
  id: string;
  ray_id: string | null;
  polarity: "normal" | "reverse";
  scale: { min: number; max: number };
  required: boolean;
  display_type: "frequency" | "scenario_card" | "reflection";
  prompt: string;
  options?: { a: string; b: string; c: string; d: string };
}

interface AssessmentRunnerClientProps {
  runId: string;
}

interface ApiError {
  error?: string;
  detail?: string;
}

type AnswersMap = Record<string, number>;

// Scenario card key ↔ numeric value mapping (A=0, B=1, C=2, D=3)
const SCENARIO_KEY_TO_VALUE: Record<string, number> = { a: 0, b: 1, c: 2, d: 3 };
const SCENARIO_VALUE_TO_KEY = ["a", "b", "c", "d"] as const;

export function AssessmentRunnerClient({ runId }: AssessmentRunnerClientProps) {
  const router = useRouter();
  const [answers, setAnswers] = useState<AnswersMap>({});
  // Reflection answers are stored as text strings, not submitted as numeric responses
  const [reflectionAnswers, setReflectionAnswers] = useState<Record<string, string>>({});
  const [runNumber, setRunNumber] = useState<number | null>(null);
  const [runQuestions, setRunQuestions] = useState<DynamicQuestion[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [answerTimestamps, setAnswerTimestamps] = useState<number[]>([]);
  const [isOnline, setIsOnline] = useState(true);
  const [paginated, setPaginated] = useState(false);
  const [pageIdx, setPageIdx] = useState(0);
  const [milestoneMsg, setMilestoneMsg] = useState<string | null>(null);
  const [revealData, setRevealData] = useState<{ runId: string; topRayNames: [string, string] } | null>(null);
  const shownMilestonesRef = useRef<Set<number>>(new Set());
  const savedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingRef = useRef<Record<string, number>>({});
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingReflectionsRef = useRef<Record<string, string>>({});
  const reflectionDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef<boolean>(true);
  const lsKey = `143_backup_${runId}`;

  const requiredIds = useMemo(
    () => runQuestions.filter((question) => question.required).map((question) => question.id),
    [runQuestions],
  );

  const answeredRequiredCount = useMemo(
    () => requiredIds.filter((questionId) => questionId in answers).length,
    [answers, requiredIds],
  );

  const progressPct = useMemo(() => {
    if (requiredIds.length === 0) return 0;
    return Math.round((answeredRequiredCount / requiredIds.length) * 100);
  }, [answeredRequiredCount, requiredIds]);

  const completionLabel = useMemo(() => {
    return `${answeredRequiredCount}/${requiredIds.length} required answered`;
  }, [answeredRequiredCount, requiredIds]);

  const timeEstimate = useMemo(() => {
    const remaining = requiredIds.length - answeredRequiredCount;
    if (remaining <= 0) return "Almost done";
    if (answerTimestamps.length < 10) return null; // Not enough data
    // Calculate median gap between consecutive answers
    const gaps: number[] = [];
    for (let i = 1; i < answerTimestamps.length; i++) {
      const gap = answerTimestamps[i] - answerTimestamps[i - 1];
      if (gap > 0 && gap < 60000) gaps.push(gap); // Ignore gaps > 60s (breaks)
    }
    if (gaps.length < 5) return null;
    gaps.sort((a, b) => a - b);
    const median = gaps[Math.floor(gaps.length / 2)];
    const estMs = remaining * median;
    const estMin = Math.ceil(estMs / 60000);
    if (estMin <= 1) return "Under a minute left";
    return `~${estMin} min remaining`;
  }, [answerTimestamps, answeredRequiredCount, requiredIds.length]);

  // Milestone celebrations at 25%, 50%, 75%
  useEffect(() => {
    const milestones: [number, string][] = [
      [25, "Quarter of the way. You're building momentum."],
      [50, "Halfway there. Your Light Signature is taking shape."],
      [75, "Three-quarters done. Almost to your results."],
    ];
    for (const [pct, msg] of milestones) {
      if (progressPct >= pct && !shownMilestonesRef.current.has(pct)) {
        shownMilestonesRef.current.add(pct);
        haptic('medium');
        setMilestoneMsg(msg);
        setTimeout(() => setMilestoneMsg(null), 3000);
        break;
      }
    }
  }, [progressPct]);

  const flushPendingResponses = useCallback(async () => {
    const pending = Object.entries(pendingRef.current).map(([questionId, value]) => ({
      question_id: questionId,
      value,
    }));
    if (pending.length === 0) {
      return;
    }

    pendingRef.current = {};
    setSaveStatus('saving');
    try {
      const response = await fetch(`/api/runs/${encodeURIComponent(runId)}/responses`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ responses: pending }),
      });
      if (!response.ok) {
        const payload = (await response.json().catch(() => ({}))) as ApiError;
        throw new Error(payload.error ?? "response_save_failed");
      }
      if (mountedRef.current) {
        setSaveStatus('saved');
        try { localStorage.removeItem(lsKey); } catch { /* silent */ }
        if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
        savedTimerRef.current = setTimeout(() => {
          if (mountedRef.current) setSaveStatus('idle');
        }, 2000);
      }
    } catch (err) {
      if (mountedRef.current) setSaveStatus('error');
      throw err;
    }
  }, [runId, lsKey]);

  const flushPendingReflections = useCallback(async () => {
    const pending = Object.entries(pendingReflectionsRef.current).map(
      ([prompt_id, response_text]) => ({ prompt_id, response_text }),
    );
    if (pending.length === 0) return;

    pendingReflectionsRef.current = {};
    try {
      const response = await fetch(
        `/api/runs/${encodeURIComponent(runId)}/reflections`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reflections: pending }),
        },
      );
      if (!response.ok) {
        const payload = (await response.json().catch(() => ({}))) as ApiError;
        throw new Error(payload.error ?? "reflection_save_failed");
      }
    } catch {
      // Silently fail — reflections are optional, don't block the assessment
    }
  }, [runId]);

  const queueReflectionSave = useCallback(
    (promptId: string, text: string) => {
      pendingReflectionsRef.current[promptId] = text;
      if (reflectionDebounceRef.current) {
        clearTimeout(reflectionDebounceRef.current);
      }
      reflectionDebounceRef.current = setTimeout(() => {
        void flushPendingReflections();
      }, 2000);
    },
    [flushPendingReflections],
  );

  const queueSave = useCallback(
    (questionId: string, value: number) => {
      pendingRef.current[questionId] = value;
      setAnswerTimestamps((prev) => [...prev, Date.now()]);
      // Always backup to localStorage as failsafe
      try { localStorage.setItem(lsKey, JSON.stringify(pendingRef.current)); } catch { /* silent */ }
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      debounceRef.current = setTimeout(() => {
        void flushPendingResponses();
      }, 350);
    },
    [flushPendingResponses, lsKey],
  );

  // Online/offline detection + localStorage sync
  useEffect(() => {
    setIsOnline(navigator.onLine);
    const goOnline = () => {
      setIsOnline(true);
      // Flush any localStorage-backed responses on reconnect
      try {
        const backed = localStorage.getItem(lsKey);
        if (backed) {
          const parsed = JSON.parse(backed) as Record<string, number>;
          Object.assign(pendingRef.current, parsed);
          localStorage.removeItem(lsKey);
          void flushPendingResponses();
        }
      } catch { /* silent */ }
    };
    const goOffline = () => setIsOnline(false);
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, [lsKey, flushPendingResponses]);

  // ── Paginated mode: find next unanswered question ──
  const jumpToNextUnanswered = useCallback(() => {
    const startFrom = pageIdx + 1;
    for (let i = startFrom; i < runQuestions.length; i++) {
      if (runQuestions[i].required && !(runQuestions[i].id in answers)) {
        setPageIdx(i);
        return;
      }
    }
    // If none after current, just advance one
    if (startFrom < runQuestions.length) {
      setPageIdx(startFrom);
    }
  }, [pageIdx, runQuestions, answers]);

  // ── Paginated mode: auto-advance after answer ──
  const autoAdvanceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scheduleAutoAdvance = useCallback(() => {
    if (!paginated) return;
    if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);
    autoAdvanceRef.current = setTimeout(() => {
      jumpToNextUnanswered();
    }, 350);
  }, [paginated, jumpToNextUnanswered]);

  // ── Paginated mode: keyboard shortcuts ──
  useEffect(() => {
    if (!paginated || runQuestions.length === 0) return;
    const currentQ = runQuestions[pageIdx];
    if (!currentQ) return;

    function onKeyDown(e: KeyboardEvent) {
      // Arrow navigation
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        setPageIdx((i) => Math.min(i + 1, runQuestions.length - 1));
        return;
      }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        setPageIdx((i) => Math.max(i - 1, 0));
        return;
      }

      // Frequency scale: 1-5 keys
      if (currentQ.display_type === 'frequency' && /^[1-5]$/.test(e.key)) {
        const value = parseInt(e.key, 10) - 1; // 1→0, 2→1, ... 5→4
        setAnswers((prev) => ({ ...prev, [currentQ.id]: value }));
        queueSave(currentQ.id, value);
        haptic('light');
        scheduleAutoAdvance();
        return;
      }

      // Scenario cards: A-D keys
      if (currentQ.display_type === 'scenario_card' && /^[a-dA-D]$/.test(e.key)) {
        const key = e.key.toLowerCase();
        const numValue = SCENARIO_KEY_TO_VALUE[key] ?? 0;
        setAnswers((prev) => ({ ...prev, [currentQ.id]: numValue }));
        queueSave(currentQ.id, numValue);
        haptic('light');
        scheduleAutoAdvance();
        return;
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [paginated, pageIdx, runQuestions, queueSave, scheduleAutoAdvance]);

  // Cleanup auto-advance timer on unmount
  useEffect(() => {
    return () => {
      if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);
    };
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    async function startRun() {
      try {
        // Step 1: start the run and get run_number
        const startResponse = await fetch(`/api/runs/${encodeURIComponent(runId)}/start`, {
          method: "POST",
        });
        const startPayload = (await startResponse.json().catch(() => ({}))) as
          | { run_number?: number; error?: string }
          | Record<string, never>;

        if (!startResponse.ok) {
          const message =
            "error" in startPayload && typeof startPayload.error === "string"
              ? startPayload.error
              : "run_start_failed";
          throw new Error(message);
        }

        const nextRunNumber =
          "run_number" in startPayload && typeof startPayload.run_number === "number"
            ? startPayload.run_number
            : null;
        if (!nextRunNumber) {
          throw new Error("run_number_missing");
        }

        // Step 2: fetch the dynamically selected question list for this run
        const questionsResponse = await fetch(
          `/api/runs/${encodeURIComponent(runId)}/questions`,
        );
        const questionsPayload = (await questionsResponse.json().catch(() => ({}))) as
          | { questions?: DynamicQuestion[]; error?: string }
          | Record<string, never>;

        if (!questionsResponse.ok) {
          throw new Error("questions_fetch_failed");
        }

        const questions =
          "questions" in questionsPayload && Array.isArray(questionsPayload.questions)
            ? (questionsPayload.questions as DynamicQuestion[])
            : [];

        // Step 3: load any previously saved responses (for resume)
        const savedResponse = await fetch(
          `/api/runs/${encodeURIComponent(runId)}/responses`,
        );
        if (savedResponse.ok) {
          const savedPayload = (await savedResponse.json().catch(() => ({}))) as
            | { responses?: Array<{ question_id: string; value: number }> }
            | Record<string, never>;
          if ("responses" in savedPayload && Array.isArray(savedPayload.responses)) {
            const restored: AnswersMap = {};
            for (const r of savedPayload.responses) {
              restored[r.question_id] = r.value;
            }
            if (mountedRef.current) {
              setAnswers(restored);
            }
          }
        }

        // Step 4: load any previously saved reflections (for resume)
        const savedReflections = await fetch(
          `/api/runs/${encodeURIComponent(runId)}/reflections`,
        );
        if (savedReflections.ok) {
          const reflPayload = (await savedReflections.json().catch(() => ({}))) as
            | { reflections?: Array<{ prompt_id: string; response_text: string }> }
            | Record<string, never>;
          if ("reflections" in reflPayload && Array.isArray(reflPayload.reflections)) {
            const restored: Record<string, string> = {};
            for (const r of reflPayload.reflections) {
              if (r.response_text) restored[r.prompt_id] = r.response_text;
            }
            if (mountedRef.current && Object.keys(restored).length > 0) {
              setReflectionAnswers(restored);
            }
          }
        }

        if (mountedRef.current) {
          setRunNumber(nextRunNumber);
          setRunQuestions(questions);
        }
      } catch (startError) {
        if (mountedRef.current) {
          setError(
            startError instanceof Error
              ? startError.message
              : "Run could not be initialized.",
          );
        }
      }
    }

    void startRun();
    return () => {
      mountedRef.current = false;
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      if (reflectionDebounceRef.current) {
        clearTimeout(reflectionDebounceRef.current);
      }
    };
  }, [runId]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (requiredIds.some((questionId) => !(questionId in answers))) {
      setError("Complete all required questions before submitting.");
      return;
    }

    setSubmitting(true);
    try {
      await flushPendingResponses();
      await flushPendingReflections();
      const response = await fetch(`/api/runs/${encodeURIComponent(runId)}/complete`, {
        method: "POST",
      });
      const payload = (await response.json().catch(() => ({}))) as
        | ApiError
        | { run_id: string; top_rays?: string[] };

      if (!response.ok) {
        const errorMessage =
          "error" in payload && typeof payload.error === "string"
            ? payload.error
            : "run_complete_failed";
        throw new Error(errorMessage);
      }

      const completedRunId =
        "run_id" in payload && typeof payload.run_id === "string"
          ? payload.run_id
          : runId;

      // Show archetype reveal overlay before redirecting
      const topRays = "top_rays" in payload && Array.isArray(payload.top_rays) ? payload.top_rays : [];
      if (topRays.length >= 2) {
        const name1 = RAY_META[topRays[0]]?.name ?? topRays[0];
        const name2 = RAY_META[topRays[1]]?.name ?? topRays[1];
        setRevealData({ runId: completedRunId, topRayNames: [name1, name2] });
      } else {
        router.push(`/results?run_id=${encodeURIComponent(completedRunId)}`);
      }
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : "Submission failed.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function onSaveAndExit() {
    await flushPendingResponses();
    await flushPendingReflections();
    router.push("/portal");
  }

  if (revealData) {
    return (
      <CompletionReveal
        topRayNames={revealData.topRayNames}
        onComplete={() => router.push(`/results?run_id=${encodeURIComponent(revealData.runId)}`)}
      />
    );
  }

  return (
    <form onSubmit={onSubmit} className="glass-card p-5 sm:p-6">
      {/* Sticky progress bar */}
      {runQuestions.length > 0 && (
        <div className="sticky top-0 z-40 -mx-5 -mt-5 mb-4 rounded-t-2xl px-5 pb-3 pt-4 sm:-mx-6 sm:-mt-6 sm:px-6" style={{ background: 'var(--overlay-heavy)', backdropFilter: 'blur(16px)' }}>
          <div className="flex items-center justify-between text-xs" style={{ color: 'var(--text-on-dark-secondary)' }}>
            <span>{completionLabel}</span>
            <div className="flex items-center gap-3">
              {timeEstimate && <span style={{ color: 'var(--text-on-dark-muted)' }}>{timeEstimate}</span>}
              <button
                type="button"
                onClick={() => {
                  setPaginated((p) => !p);
                  if (!paginated) {
                    // When switching to paginated, jump to first unanswered
                    const firstUnanswered = runQuestions.findIndex(
                      (q) => q.required && !(q.id in answers),
                    );
                    if (firstUnanswered >= 0) setPageIdx(firstUnanswered);
                  }
                }}
                className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full transition-colors"
                style={{
                  background: paginated ? 'rgba(248, 208, 17, 0.15)' : 'rgba(148, 80, 200, 0.2)',
                  color: paginated ? 'var(--brand-gold)' : 'var(--text-on-dark-muted)',
                  border: `1px solid ${paginated ? 'rgba(248, 208, 17, 0.3)' : 'rgba(148, 80, 200, 0.15)'}`,
                }}
                aria-label={paginated ? 'Switch to scroll mode' : 'Switch to one-at-a-time mode'}
              >
                {paginated ? 'Scroll' : '1-at-a-time'}
              </button>
            </div>
            <span>{progressPct}%</span>
          </div>
          <div className="mt-1.5 h-2 overflow-hidden rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }}>
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand-purple to-brand-gold transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          {(saveStatus !== 'idle' || !isOnline) && (
            <div className="mt-1.5 flex items-center gap-1.5">
              <span
                className={`inline-block h-2 w-2 rounded-full${saveStatus === 'saving' || !isOnline ? ' animate-pulse' : ''}`}
                style={{
                  background: !isOnline ? '#FB923C' :
                    saveStatus === 'saved' ? '#22C55E' :
                    saveStatus === 'saving' ? 'var(--brand-gold)' :
                    '#F43F5E',
                }}
              />
              <span className="text-[11px]" style={{ color: 'var(--text-on-dark-muted)' }}>
                {!isOnline ? 'Offline — answers saved locally' : saveStatus === 'saving' ? 'Saving' : saveStatus === 'saved' ? 'Saved' : 'Save failed — retrying'}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Milestone celebration overlay */}
      {milestoneMsg && (
        <div
          className="mb-4 rounded-xl px-5 py-4 text-center transition-opacity duration-500"
          style={{
            background: 'linear-gradient(135deg, rgba(248, 208, 17, 0.12) 0%, rgba(96, 5, 141, 0.15) 100%)',
            border: '1px solid rgba(248, 208, 17, 0.3)',
            boxShadow: '0 0 24px rgba(248, 208, 17, 0.1)',
            animation: 'milestonePopIn 400ms ease-out',
          }}
        >
          <div className="text-2xl mb-1" aria-hidden="true">
            {progressPct >= 75 ? '\u2728' : progressPct >= 50 ? '\u2600\uFE0F' : '\u2B50'}
          </div>
          <p className="text-sm font-semibold" style={{ color: 'var(--brand-gold)' }}>
            {milestoneMsg}
          </p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-on-dark-muted)' }}>
            {progressPct}% complete
          </p>
        </div>
      )}
      <style>{`
        @keyframes milestonePopIn {
          0% { opacity: 0; transform: scale(0.9); }
          60% { transform: scale(1.03); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>

      {(runNumber === null || runQuestions.length === 0) && !error ? (
        <div className="flex items-center gap-3 py-8">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-brand-gold border-t-transparent" />
          <p className="text-sm" style={{ color: 'var(--text-on-dark-secondary)' }}>Preparing your assessment...</p>
        </div>
      ) : null}
      {error ? (
        <p className="mt-2 text-sm text-rose-400" role="alert">
          {error}
        </p>
      ) : null}

      <div className="mt-4 space-y-4">
        {(paginated ? [pageIdx] : runQuestions.map((_, i) => i)).map((idx) => {
          const question = runQuestions[idx];
          if (!question) return null;
          const currentValue = answers[question.id];
          const displayType = question.display_type;
          const prevRayId = idx > 0 ? runQuestions[idx - 1].ray_id : null;
          const curRayId = question.ray_id;
          const rayChanged = curRayId && curRayId !== prevRayId;
          const meta = curRayId ? RAY_META[curRayId] : null;
          const phaseTransition = curRayId ? PHASE_TRANSITIONS[curRayId] : null;
          const showPhaseBreak = !paginated && rayChanged && phaseTransition;

          const handleFrequencySelect = (_itemId: string, value: number) => {
            setAnswers((prev) => ({ ...prev, [question.id]: value }));
            queueSave(question.id, value);
            scheduleAutoAdvance();
          };

          const handleScenarioChange = (_itemId: string, key: string) => {
            const numValue = SCENARIO_KEY_TO_VALUE[key.toLowerCase()] ?? 0;
            setAnswers((prev) => ({ ...prev, [question.id]: numValue }));
            queueSave(question.id, numValue);
            scheduleAutoAdvance();
          };

          return (
            <div key={question.id}>
              {/* Phase breathing break (R4 = Radiate, R7 = Become) — scroll mode only */}
              {showPhaseBreak && (
                <div className="mb-4">
                  <BreathingMoment
                    phaseName={phaseTransition.phaseName}
                    message={phaseTransition.message}
                  />
                </div>
              )}

              {/* Ray section divider */}
              {rayChanged && meta && (
                <div
                  className="mb-3 flex items-center gap-3 rounded-xl px-4 py-3"
                  style={{
                    background: 'rgba(96, 5, 141, 0.2)',
                    borderLeft: `3px solid ${meta.color}`,
                  }}
                >
                  <div
                    className="h-2.5 w-2.5 rounded-full flex-shrink-0"
                    style={{ background: meta.color, boxShadow: `0 0 8px ${meta.color}50` }}
                  />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest" style={{ color: meta.color }}>
                      {meta.phase} &middot; {meta.name}
                    </p>
                  </div>
                </div>
              )}

              {/* Paginated mode: question counter */}
              {paginated && (
                <p className="text-xs text-center mb-2" style={{ color: 'var(--text-on-dark-muted)' }}>
                  Question {idx + 1} of {runQuestions.length}
                  {displayType === 'frequency' && (
                    <span className="ml-2 opacity-60">Keys 1-5 to answer</span>
                  )}
                  {displayType === 'scenario_card' && (
                    <span className="ml-2 opacity-60">Keys A-D to answer</span>
                  )}
                </p>
              )}

              <article className="glass-card p-4">
                <p className="text-sm font-semibold leading-relaxed" style={{ color: 'var(--text-on-dark)' }}>
                  {question.prompt}
                </p>

                <div className="mt-3">
                  {displayType === "scenario_card" && question.options ? (
                    <ScenarioCard
                      itemId={question.id}
                      options={[
                        { key: "a", label: question.options.a },
                        { key: "b", label: question.options.b },
                        { key: "c", label: question.options.c },
                        { key: "d", label: question.options.d },
                      ]}
                      selectedKey={
                        typeof currentValue === "number"
                          ? (SCENARIO_VALUE_TO_KEY[currentValue] ?? null)
                          : null
                      }
                      onChange={handleScenarioChange}
                    />
                  ) : displayType === "reflection" ? (
                    <ReflectionInput
                      itemId={question.id}
                      value={reflectionAnswers[question.id] ?? ""}
                      onChange={(_itemId, value) => {
                        setReflectionAnswers((prev) => ({ ...prev, [question.id]: value }));
                        queueReflectionSave(question.id, value);
                      }}
                    />
                  ) : (
                    <FrequencyScale
                      itemId={question.id}
                      value={typeof currentValue === "number" ? currentValue : null}
                      onSelect={handleFrequencySelect}
                    />
                  )}
                </div>
              </article>

              {/* Paginated mode: prev/next navigation */}
              {paginated && (
                <div className="flex items-center justify-between mt-3">
                  <button
                    type="button"
                    onClick={() => setPageIdx((i) => Math.max(i - 1, 0))}
                    disabled={pageIdx === 0}
                    className="text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
                    style={{
                      background: 'rgba(96, 5, 141, 0.2)',
                      color: pageIdx === 0 ? 'var(--text-on-dark-muted)' : 'var(--text-on-dark-secondary)',
                      border: '1px solid rgba(148, 80, 200, 0.15)',
                      opacity: pageIdx === 0 ? 0.4 : 1,
                    }}
                  >
                    &larr; Prev
                  </button>
                  <span className="text-[10px]" style={{ color: 'var(--text-on-dark-muted)' }}>
                    &larr; &rarr; arrow keys
                  </span>
                  <button
                    type="button"
                    onClick={() => setPageIdx((i) => Math.min(i + 1, runQuestions.length - 1))}
                    disabled={pageIdx >= runQuestions.length - 1}
                    className="text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
                    style={{
                      background: 'rgba(96, 5, 141, 0.2)',
                      color: pageIdx >= runQuestions.length - 1 ? 'var(--text-on-dark-muted)' : 'var(--text-on-dark-secondary)',
                      border: '1px solid rgba(148, 80, 200, 0.15)',
                      opacity: pageIdx >= runQuestions.length - 1 ? 0.4 : 1,
                    }}
                  >
                    Next &rarr;
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="submit"
          className="btn-primary"
          disabled={submitting || runNumber === null}
        >
          {submitting ? "Submitting..." : "Complete Assessment"}
        </button>
        <button
          type="button"
          className="btn-watch"
          onClick={() => void onSaveAndExit()}
          disabled={submitting}
        >
          Save &amp; Exit
        </button>
      </div>
    </form>
  );
}
