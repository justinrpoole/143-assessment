import { createHash } from "crypto";

import { supabaseRestFetch } from "@/lib/db/supabase-rest";

export interface SignaturePair {
  input_hash: string;
  output_hash: string;
  scorer_version: string;
}

/**
 * Compute SHA-256 hash of sorted assessment responses.
 * Deterministic: same responses always produce the same hash.
 */
export function computeInputHash(
  responses: Record<string, number>,
): string {
  const sorted = Object.entries(responses)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([questionId, value]) => ({ q: questionId, v: value }));
  const json = JSON.stringify(sorted);
  return createHash("sha256").update(json, "utf8").digest("hex");
}

/**
 * Compute SHA-256 hash of the scoring output.
 * Uses canonical JSON stringification (sorted keys) for determinism.
 */
export function computeOutputHash(
  output: Record<string, unknown>,
): string {
  const json = JSON.stringify(output, Object.keys(output).sort());
  return createHash("sha256").update(json, "utf8").digest("hex");
}

/**
 * Generate a complete signature pair from responses and scoring output.
 */
export function generateSignaturePair(
  responses: Record<string, number>,
  output: Record<string, unknown>,
  scorerVersion: string,
): SignaturePair {
  return {
    input_hash: computeInputHash(responses),
    output_hash: computeOutputHash(output),
    scorer_version: scorerVersion,
  };
}

/**
 * Persist a signature pair to the database.
 */
export async function insertSignaturePair(params: {
  assessmentRunId: string;
  signaturePair: SignaturePair;
}): Promise<void> {
  const response = await supabaseRestFetch<unknown>({
    restPath: "signature_pairs",
    method: "POST",
    query: {
      on_conflict: "assessment_run_id,scorer_version",
    },
    prefer: "resolution=merge-duplicates,return=minimal",
    body: {
      assessment_run_id: params.assessmentRunId,
      scorer_version: params.signaturePair.scorer_version,
      input_hash: params.signaturePair.input_hash,
      output_hash: params.signaturePair.output_hash,
    },
  });

  if (!response.ok) {
    throw new Error(response.error ?? "failed_to_insert_signature_pair");
  }
}

/**
 * Load the signature pair for a given run.
 */
export async function getSignaturePair(
  assessmentRunId: string,
): Promise<SignaturePair | null> {
  const response = await supabaseRestFetch<
    Array<{
      scorer_version: string;
      input_hash: string;
      output_hash: string;
    }>
  >({
    restPath: "signature_pairs",
    query: {
      select: "scorer_version,input_hash,output_hash",
      assessment_run_id: `eq.${assessmentRunId}`,
      limit: 1,
    },
  });

  if (!response.ok) {
    throw new Error(response.error ?? "failed_to_load_signature_pair");
  }

  const row = response.data?.[0];
  if (!row) return null;

  return {
    scorer_version: row.scorer_version,
    input_hash: row.input_hash,
    output_hash: row.output_hash,
  };
}
