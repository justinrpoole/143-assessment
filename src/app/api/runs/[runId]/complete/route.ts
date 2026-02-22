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
import {
  scoreAssessment,
  SCORER_VERSION,
} from "@/lib/scoring/score-assessment.mjs";
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
): string[] {
  return getQuestionIdsForRun(runNumber)
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

    const scoring = scoreAssessment({
      responses: responsesByQuestion,
      metadata: { user_state: auth.userState },
      questionIds: getQuestionIdsForRun(run.run_number),
    });

    const resultsPayload = {
      run_id: run.id,
      run_number: run.run_number,
      assessment_mode: questionSetForRun(run.run_number),
      computed_at: new Date().toISOString(),
      user_state_at_start: run.user_state_at_start,
      context_scope: run.context_scope,
      focus_area: run.focus_area,
      source_route: run.source_route,
      ...scoring,
    };

    const html = renderReportHtml({
      resultsPayload,
      firstName: "Leader",
    });

    await upsertResult({
      runId: run.id,
      userId: auth.userId,
      rayScores: scoring.ray_scores_by_id,
      topRays: scoring.top_rays,
      rayPairId: scoring.ray_pair_id,
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
      SCORER_VERSION,
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
        top_rays: scoring.top_rays,
        ray_pair_id: scoring.ray_pair_id,
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
      ray_pair_id: scoring.ray_pair_id,
      top_rays: scoring.top_rays,
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
