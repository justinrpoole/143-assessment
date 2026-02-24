import { NextResponse } from "next/server";

import { emitEvent } from "@/lib/analytics/emitter";
import { trackEvent } from "@/lib/events";
import { getRequestAuthContext } from "@/lib/auth/request-context";
import {
  getResponsesForRun,
  getResultForRun,
  getRunForUser,
  markRunCompleted,
  upsertHtmlReport,
  upsertResult,
} from "@/lib/db/assessment-runs";
import { renderReportHtml } from "@/lib/report/render-report-html.mjs";
import { queueEmailJob } from "@/lib/email/scheduler";
import {
  generateSignaturePair,
  insertSignaturePair,
} from "@/lib/audit/signature";
import { scoreAssessment } from "@/lib/scoring/pipeline";
import { loadItemBanks } from "@/lib/scoring/load-item-banks";
import { buildResponsePacket } from "@/lib/scoring/build-response-packet";
import { getReflectionsForRun } from "@/lib/db/assessment-reflections";
import {
  getQuestionIdsForRun,
  questionSetForRun,
} from "@/lib/scoring/question-set";

interface RouteParams {
  params: Promise<{ runId: string }> | { runId: string };
}

async function queueEmailJobSafe(params: Parameters<typeof queueEmailJob>[0]) {
  try {
    await queueEmailJob(params);
  } catch (error) {
    console.error(
      "[email_job_queue_failed]",
      error instanceof Error ? error.message : String(error),
    );
  }
}

async function resolveRunId(params: RouteParams["params"]): Promise<string> {
  if (typeof (params as Promise<{ runId: string }>).then === "function") {
    const resolved = await (params as Promise<{ runId: string }>);
    return resolved.runId;
  }
  return (params as { runId: string }).runId;
}

function buildResponseMap(rows: Array<{ question_id: string; value: number }>) {
  return Object.fromEntries(rows.map((row) => [row.question_id, row.value]));
}

function missingRequiredQuestions(
  responsesByQuestion: Record<string, number>,
  runNumber: number,
  itemIds?: string[] | null,
): string[] {
  // Use the run's stored item_ids (from dynamic selection) when available;
  // fall back to the static question set for legacy runs without item_ids.
  const requiredIds = itemIds && itemIds.length > 0
    ? itemIds
    : getQuestionIdsForRun(runNumber);
  return requiredIds
    .filter((questionId: string) => !(questionId in responsesByQuestion));
}

export async function POST(_request: Request, context: RouteParams) {
  const auth = await getRequestAuthContext();
  if (!auth.isAuthenticated || !auth.userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const runId = await resolveRunId(context.params);

  try {
    const run = await getRunForUser(runId, auth.userId);
    if (!run) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }

    if (run.status === "completed") {
      const existing = await getResultForRun({ runId, userId: auth.userId });
      if (!existing) {
        return NextResponse.json(
          { error: "completed_run_missing_results" },
          { status: 409 },
        );
      }
      return NextResponse.json({
        run_id: runId,
        ray_pair_id: existing.ray_pair_id,
        top_rays: existing.top_rays,
      });
    }

    if (run.status === "canceled") {
      return NextResponse.json(
        { error: "run_not_completable", status: run.status },
        { status: 409 },
      );
    }

    const responseRows = await getResponsesForRun({
      runId,
      userId: auth.userId,
    });
    const responsesByQuestion = buildResponseMap(responseRows);
    const missingRequired = missingRequiredQuestions(
      responsesByQuestion,
      run.run_number,
      run.item_ids,
    );
    if (missingRequired.length > 0) {
      return NextResponse.json(
        {
          error: "required_questions_missing",
          missing_question_ids: missingRequired,
        },
        { status: 400 },
      );
    }

    // Fetch reflections for pipeline scoring
    const reflectionRows = await getReflectionsForRun({ runId, userId: auth.userId });
    const reflections = Object.fromEntries(
      reflectionRows.filter(r => r.response_text.trim()).map(r => [r.prompt_id, r.response_text]),
    );

    // Build pipeline inputs
    const banks = loadItemBanks();
    const allItems = [...banks.rayItems, ...banks.toolItems, ...banks.eclipseItems, ...banks.validityItems];
    const packet = buildResponsePacket({ run, responseRows, reflections, allItems });
    const pipelineOutput = scoreAssessment(packet, banks);

    // Derive legacy-compatible fields from pipeline output
    const rayScoresById: Record<string, number> = {};
    for (const [rayId, rayOut] of Object.entries(pipelineOutput.rays)) {
      rayScoresById[rayId] = rayOut.score; // 0-100 scale
    }
    const topRays = pipelineOutput.light_signature.top_two.map(t => t.ray_id);
    const rayPairId = pipelineOutput.light_signature.archetype?.pair_code
      ?? `${topRays[0]}-${topRays[1]}`;

    const resultsPayload = {
      run_id: run.id,
      run_number: run.run_number,
      assessment_mode: questionSetForRun(run.run_number),
      computed_at: new Date().toISOString(),
      user_state_at_start: run.user_state_at_start,
      context_scope: run.context_scope,
      focus_area: run.focus_area,
      source_route: run.source_route,
      // Legacy-compatible fields (consumed by render-report-html.mjs)
      ray_scores_by_id: rayScoresById,
      top_rays: topRays,
      ray_pair_id: rayPairId,
      ray_pair: rayPairId,
      confidence_band: pipelineOutput.data_quality.confidence_band,
      // Full pipeline output
      pipeline_output: pipelineOutput,
    };

    const html = renderReportHtml({
      resultsPayload,
      firstName: "Leader",
    });

    await upsertResult({
      runId: run.id,
      userId: auth.userId,
      rayScores: rayScoresById,
      topRays: topRays,
      rayPairId: rayPairId,
      resultsPayload,
    });

    await upsertHtmlReport({
      runId: run.id,
      userId: auth.userId,
      html,
      meta: {
        report_version: "v1",
        generated_by: "phase2b",
      },
    });

    // Generate and persist audit signature pair
    const signaturePair = generateSignaturePair(
      responsesByQuestion,
      resultsPayload as Record<string, unknown>,
      "pipeline-v1",
    );
    await insertSignaturePair({
      assessmentRunId: run.id,
      signaturePair,
    }).catch((sigError) => {
      console.error(
        "[signature_pair_insert_failed]",
        sigError instanceof Error ? sigError.message : String(sigError),
      );
    });

    await markRunCompleted({
      runId: run.id,
      userId: auth.userId,
    });

    emitEvent({
      eventName: "full_assessment_complete",
      sourceRoute: "/assessment",
      userState: auth.userState,
      userId: auth.userId,
      extra: {
        run_id: run.id,
        run_number: run.run_number,
        assessment_version: "v1",
        completion_seconds: null,
      },
    });

    void trackEvent({
      userId: auth.userId,
      eventType: "assessment_completed",
      eventData: {
        run_id: run.id,
        run_number: run.run_number,
        top_rays: topRays,
        ray_pair_id: rayPairId,
      },
    });

    if (run.run_number > 1) {
      emitEvent({
        eventName: "retake_complete",
        sourceRoute: "/assessment",
        userState: auth.userState,
        userId: auth.userId,
        extra: {
          run_id: run.id,
          run_number: run.run_number,
          days_since_previous_full_run: null,
        },
      });
    }

    await queueEmailJobSafe({
      userId: auth.userId,
      type: "post_report_followup",
      sendAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      payload: {
        run_id: run.id,
        results_route: `/results?run_id=${run.id}`,
        reports_route: `/reports?run_id=${run.id}`,
      },
    });

    // 7-day post-report drip — each day highlights a different report section
    const dripSchedule = [
      { day: 2, section: "Eclipse Snapshot", anchor: "rpt-eclipse" },
      { day: 3, section: "Rise Path", anchor: "rpt-rise-path" },
      { day: 4, section: "Coaching Questions", anchor: "rpt-coaching" },
      { day: 5, section: "30-Day Plan", anchor: "rpt-30day" },
      { day: 6, section: "Energy Ratio", anchor: "rpt-system-health" },
      { day: 7, section: "Portal & Retake", anchor: "" },
    ];
    for (const drip of dripSchedule) {
      await queueEmailJobSafe({
        userId: auth.userId,
        type: "post_report_drip",
        sendAt: new Date(Date.now() + drip.day * 24 * 60 * 60 * 1000),
        payload: {
          run_id: run.id,
          day_number: String(drip.day),
          section_name: drip.section,
          section_anchor: drip.anchor,
          results_route: drip.anchor
            ? `/results?run_id=${run.id}#${drip.anchor}`
            : `/portal`,
        },
      });
    }

    if (auth.userState === "paid_43") {
      await queueEmailJobSafe({
        userId: auth.userId,
        type: "upgrade_nudge",
        sendAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        payload: {
          next_route: "/upgrade",
          offer_context: "run_completed_paid_43",
        },
      });
    }

    return NextResponse.json({
      run_id: run.id,
      ray_pair_id: rayPairId,
      top_rays: topRays,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "run_complete_failed",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
