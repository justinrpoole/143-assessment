import { Suspense } from "react";
import CinematicCompleteClient from "@/components/assessment/CinematicCompleteClient";

export const dynamic = "force-dynamic";

/**
 * /assessment/complete — plays the LightSignatureReveal cinematic then
 * redirects to /results. The Suspense wrapper is required because
 * CinematicCompleteClient calls useSearchParams().
 */
export default function AssessmentCompletePage() {
  return (
    <Suspense fallback={null}>
      <CinematicCompleteClient />
    </Suspense>
  );
}
