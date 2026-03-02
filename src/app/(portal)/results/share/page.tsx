import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { cookies } from "next/headers";

import { ShareCardClient } from "@/components/sharecards/ShareCardClient";
import PortalBreadcrumb from "@/components/portal/PortalBreadcrumb";
import { supabaseRestFetch } from "@/lib/db/supabase-rest";
import { getUserStateFromRequest } from "@/lib/auth/user-state";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Share Your Light Signature | 143 Leadership",
  description: "Download your Light Signature card and share it with the world.",
};

interface AssessmentResult {
  results_payload: {
    light_signature?: {
      archetype?: {
        name?: string;
        essence?: string;
      };
      top_two?: Array<{ ray_name: string }>;
    };
  };
}

interface AssessmentRun {
  id: string;
}

export default async function SharePage() {
  // Auth check — middleware gates /results/* but we double-check here
  const userState = await getUserStateFromRequest();
  if (userState === "public") {
    redirect("/login?source_route=/results/share");
  }

  const store = await cookies();
  const userId = store.get("user_id")?.value;

  if (!userId) {
    redirect("/login?source_route=/results/share");
  }

  // Fetch latest completed run
  let runId: string | null = null;
  try {
    const runsRes = await supabaseRestFetch<AssessmentRun[]>({
      restPath: "assessment_runs",
      query: {
        select: "id",
        user_id: `eq.${userId}`,
        status: "eq.completed",
        order: "created_at.desc",
        limit: 1,
      },
    });
    runId = runsRes.data?.[0]?.id ?? null;
  } catch {
    // Fall through to redirect
  }

  if (!runId) {
    redirect("/assessment/setup");
  }

  // Fetch results payload to extract light_signature
  let signatureName = "Be The Light";
  let topRays: string[] = [];
  let essence: string | undefined;

  try {
    const resultsRes = await supabaseRestFetch<AssessmentResult[]>({
      restPath: "assessment_results",
      query: {
        select: "results_payload",
        run_id: `eq.${runId}`,
        limit: 1,
      },
    });

    const payload = resultsRes.data?.[0]?.results_payload;
    const sig = payload?.light_signature;

    if (sig?.archetype?.name) {
      signatureName = sig.archetype.name;
    }
    if (sig?.archetype?.essence) {
      essence = sig.archetype.essence;
    }
    if (Array.isArray(sig?.top_two)) {
      topRays = sig.top_two.slice(0, 2).map((r) => r.ray_name).filter(Boolean);
    }
  } catch {
    // Use fallbacks
  }

  const tweetText = encodeURIComponent(
    `Just discovered my Light Signature: ${signatureName}. 143 questions. 15 minutes. Your turn. 143leadership.com/preview #BeTheLight #143Leadership`
  );

  return (
    <>
      <PortalBreadcrumb current="Share" />
      <ShareCardClient
        signatureName={signatureName}
        topRays={topRays as [string, string]}
        essence={essence}
        runId={runId}
        tweetText={tweetText}
      />
    </>
  );
}
