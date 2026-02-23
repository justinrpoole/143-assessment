/**
 * build-response-packet.ts
 *
 * Converts DB rows (assessment_responses + assessment_reflections)
 * into the ResponsePacket shape expected by the scoring pipeline.
 *
 * Critical: scenario responses are stored as 0-3 integers in the DB
 * but the pipeline expects "A"/"B"/"C"/"D" string values.
 */

import type { BaseItem, ResponsePacket, ItemResponse } from "@/lib/types";
import type { AssessmentRunRow, AssessmentResponseRow } from "@/lib/db/assessment-runs";

const NUM_TO_LETTER: Record<number, string> = {
  0: "A",
  1: "B",
  2: "C",
  3: "D",
};

interface BuildParams {
  run: AssessmentRunRow;
  responseRows: AssessmentResponseRow[];
  reflections: Record<string, string>; // prompt_id -> text
  allItems: BaseItem[]; // all item banks concatenated, used for format lookup
}

export function buildResponsePacket({
  run,
  responseRows,
  reflections,
  allItems,
}: BuildParams): ResponsePacket {
  // Build item lookup for Response_Format detection
  const formatByItemId = new Map<string, string>();
  for (const item of allItems) {
    formatByItemId.set(item.Item_ID, item.Response_Format);
  }

  // Determine tier from item count
  const itemCount = run.item_ids?.length ?? responseRows.length;
  const tier: ResponsePacket["tier"] = itemCount <= 50 ? "QUICK_43" : "FULL_143";

  // Convert response rows to ItemResponse records
  const responses: Record<string, ItemResponse> = {};
  for (const row of responseRows) {
    const format = formatByItemId.get(row.question_id);
    let value: number | string | null = row.value;

    // Map numeric 0-3 to letter for ForcedChoice scenarios
    if (format === "ForcedChoice_A_D" && typeof value === "number") {
      value = NUM_TO_LETTER[value] ?? String(value);
    }

    responses[row.question_id] = {
      item_id: row.question_id,
      value,
      timestamp: 0, // DB rows don't store per-item timestamps
    };
  }

  return {
    run_id: run.id,
    tier,
    start_ts: run.started_at ?? run.created_at,
    end_ts: new Date().toISOString(),
    responses,
    reflection_responses:
      Object.keys(reflections).length > 0 ? reflections : undefined,
  };
}
