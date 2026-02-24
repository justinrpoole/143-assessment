'use client';

import { useState, useCallback } from 'react';
import MiniAssessmentPreview from './MiniAssessmentPreview';
import LightCheckResultPanel from './LightCheckResultPanel';
import { useLightCheckAnalytics } from '@/hooks/useLightCheckAnalytics';

/**
 * Single client boundary for the /preview page interactive sections.
 * Coordinates: analytics hook, MiniAssessmentPreview (light-check mode),
 * and LightCheckResultPanel (coaching debrief).
 *
 * Keeps server/client boundary clean — one 'use client' for all
 * interactive parts of the Gravitational Stability Check flow.
 */
export default function LightCheckOrchestrator() {
  const { startPreview, completePreview } = useLightCheckAnalytics();
  const [completedAnswers, setCompletedAnswers] = useState<Record<string, number> | null>(null);

  const handleFirstAnswer = useCallback(() => {
    startPreview();
  }, [startPreview]);

  const handleComplete = useCallback(
    (answers: Record<string, number>) => {
      setCompletedAnswers(answers);
      completePreview();
    },
    [completePreview],
  );

  return (
    <>
      <MiniAssessmentPreview
        mode="light-check"
        onFirstAnswer={handleFirstAnswer}
        onComplete={handleComplete}
      />
      <LightCheckResultPanel
        answers={completedAnswers ?? {}}
        visible={completedAnswers !== null}
      />
    </>
  );
}
