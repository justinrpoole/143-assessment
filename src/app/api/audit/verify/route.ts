import { NextResponse } from "next/server";

import {
  computeInputHash,
  computeOutputHash,
  getSignaturePair,
} from "@/lib/audit/signature";
import { getRequestAuthContext } from "@/lib/auth/request-context";
import {
  getResponsesForRun,
  getResultForRun,
} from "@/lib/db/assessment-runs";

interface VerifyBody {
  run_id?: string;
}

export async function POST(request: Request) {
  const auth = await getRequestAuthContext();
  if (!auth.isAuthenticated || !auth.userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: VerifyBody;
  try {
    body = (await request.json()) as VerifyBody;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  if (typeof body.run_id !== "string") {
    return NextResponse.json({ error: "run_id_required" }, { status: 400 });
  }

  const runId = body.run_id;

  try {
    const storedPair = await getSignaturePair(runId);
    if (!storedPair) {
      return NextResponse.json(
        { error: "no_signature_pair_found" },
        { status: 404 },
      );
    }

    // Re-compute from stored data
    const responseRows = await getResponsesForRun({
      runId,
      userId: auth.userId,
    });
    if (responseRows.length === 0) {
      return NextResponse.json(
        { error: "no_responses_found" },
        { status: 404 },
      );
    }

    const responseMap = Object.fromEntries(
      responseRows.map((r) => [r.question_id, r.value]),
    );
    const recomputedInputHash = computeInputHash(responseMap);

    const result = await getResultForRun({ runId, userId: auth.userId });
    const recomputedOutputHash = result
      ? computeOutputHash(result.results_payload)
      : null;

    const inputMatch = recomputedInputHash === storedPair.input_hash;
    const outputMatch = recomputedOutputHash === storedPair.output_hash;

    return NextResponse.json({
      match: inputMatch && outputMatch,
      input_match: inputMatch,
      output_match: outputMatch,
      stored_input_hash: storedPair.input_hash,
      stored_output_hash: storedPair.output_hash,
      recomputed_input_hash: recomputedInputHash,
      recomputed_output_hash: recomputedOutputHash,
      scorer_version: storedPair.scorer_version,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "verification_failed",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
