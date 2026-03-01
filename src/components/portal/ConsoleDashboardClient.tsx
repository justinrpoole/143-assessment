"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";

import IlluminateBoard from "@/components/cosmic/IlluminateBoard";
import RepLogClient from "@/components/retention/RepLogClient";
import EntryLogOverTime from "@/components/portal/EntryLogOverTime";
import RetakeInsights from "@/components/portal/RetakeInsights";
import ActivityStream from "@/components/portal/ActivityStream";
import { FadeInSection } from "@/components/ui/FadeInSection";

const WatchMeModal = dynamic(() => import("@/components/WatchMeModal"), { ssr: false });
const GoFirstModal = dynamic(() => import("@/components/GoFirstModal"), { ssr: false });

interface PortalSummary {
  has_completed_run: boolean;
  last_run_id: string | null;
  run_number: number | null;
  eclipse_level: "low" | "medium" | "high" | null;
  bottom_ray_id: string | null;
  bottom_ray_name: string | null;
  top_ray_ids: string[];
}

interface ResultsPayload {
  ray_scores: Record<string, number>;
  top_rays: string[];
  ray_pair_id: string;
}

type ActiveModal = "watch" | "go_first" | null;

export default function ConsoleDashboardClient() {
  const [summary, setSummary] = useState<PortalSummary | null>(null);
  const [rayScores, setRayScores] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);

  useEffect(() => {
    let canceled = false;
    async function load() {
      try {
        const summaryRes = await fetch("/api/portal/summary");
        if (!summaryRes.ok) return;
        const summaryJson = (await summaryRes.json()) as PortalSummary;
        if (!canceled) setSummary(summaryJson);

        if (summaryJson.has_completed_run && summaryJson.last_run_id) {
          const resultsRes = await fetch(`/api/runs/${summaryJson.last_run_id}/results`);
          if (resultsRes.ok) {
            const resultsJson = (await resultsRes.json()) as ResultsPayload;
            if (!canceled) setRayScores(resultsJson.ray_scores ?? {});
          }
        }
      } catch {
        // Graceful degradation
      } finally {
        if (!canceled) setLoading(false);
      }
    }
    void load();
    return () => {
      canceled = true;
    };
  }, []);

  const bottomRayId = summary?.bottom_ray_id ?? null;
  const bottomRayName = summary?.bottom_ray_name ?? null;

  return (
    <section className="console-shell">
      <div className="console-inner">
        <FadeInSection>
          <IlluminateBoard title="ECLIPSE CONSOLE" rayScores={rayScores} />
        </FadeInSection>

        <FadeInSection delay={0.02}>
          <section className="console-actions">
            <div className="console-action-card">
              <p className="console-action-label">Watch Me</p>
              <p className="console-action-copy">
                Refocus your signal. One rep resets the trajectory.
              </p>
              <button
                type="button"
                className="console-action-btn watch"
                onClick={() => setActiveModal("watch")}
              >
                Activate Watch Me
              </button>
            </div>

            <div className="console-action-card">
              <p className="console-action-label">Go First</p>
              <p className="console-action-copy">
                Move before fear does. That is the rep.
              </p>
              <button
                type="button"
                className="console-action-btn go-first"
                onClick={() => setActiveModal("go_first")}
              >
                Activate Go First
              </button>
            </div>
          </section>
        </FadeInSection>

        <FadeInSection delay={0.04}>
          <section className="console-reps">
            <div className="console-reps-header">
              <div>
                <p className="console-kicker">Log your reps</p>
                <p className="console-sub">
                  Be brave. Use the buttons above when you need them.
                </p>
              </div>
              <Link href="/reps" className="console-link">
                Full reps view
              </Link>
            </div>
            <RepLogClient />
          </section>
        </FadeInSection>

        <FadeInSection delay={0.06}>
          <EntryLogOverTime days={28} />
        </FadeInSection>

        <FadeInSection delay={0.08}>
          <RetakeInsights />
        </FadeInSection>

        <FadeInSection delay={0.1}>
          <ActivityStream />
        </FadeInSection>
      </div>

      {activeModal === "watch" && (
        <WatchMeModal
          onClose={() => setActiveModal(null)}
          bottomRayId={bottomRayId}
          bottomRayName={bottomRayName}
        />
      )}
      {activeModal === "go_first" && (
        <GoFirstModal
          onClose={() => setActiveModal(null)}
          bottomRayId={bottomRayId}
          bottomRayName={bottomRayName}
        />
      )}

      {!loading && !summary?.has_completed_run && (
        <div className="console-empty">
          <p className="console-empty-title">Run your assessment to power this console.</p>
          <Link href="/assessment/setup" className="console-action-btn watch">
            Start assessment
          </Link>
        </div>
      )}
    </section>
  );
}
