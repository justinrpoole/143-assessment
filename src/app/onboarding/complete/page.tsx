/**
 * /onboarding/complete — Final onboarding step
 *
 * Routes based on whether the user has a completed run:
 * - Has a completed run → /results (show their results)
 * - No run yet → /assessment/setup (start the assessment)
 */
import { redirect } from "next/navigation";
import { getRequestAuthContext } from "@/lib/auth/request-context";
import { getCompletedRunsCount } from "@/lib/db/assessment-runs";

export const dynamic = "force-dynamic";

export default async function OnboardingCompletePage() {
  const auth = await getRequestAuthContext();

  // If authenticated and has at least one completed run, send to results
  if (auth.isAuthenticated && auth.userId) {
    const completedCount = await getCompletedRunsCount(auth.userId).catch(() => 0);
    if (completedCount > 0) {
      redirect("/results");
    }
  }

  // Otherwise start the assessment
  redirect("/assessment/setup");
}

