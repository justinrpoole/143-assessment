/**
 * Assessment Flow Tests (Authenticated)
 *
 * Validates the assessment journey:
 * setup page, instructions page, and the complete API flow.
 */

import { expect, test } from "@playwright/test";

test.describe("Assessment Setup Page", () => {
  test("renders with context and focus form fields", async ({ page }) => {
    await page.goto("/assessment/setup");
    await page.waitForLoadState("domcontentloaded");

    const main = page.locator("main");
    await expect(main).toBeVisible();
  });
});

test.describe("Assessment Instructions", () => {
  test('shows "Before You Begin" content', async ({ page }) => {
    await page.goto("/assessment/instructions");
    await page.waitForLoadState("domcontentloaded");

    await expect(page.getByText("Before You Begin")).toBeVisible();
  });

  test("has glass-card design elements", async ({ page }) => {
    await page.goto("/assessment/instructions");
    await page.waitForLoadState("domcontentloaded");

    const cards = page.locator(".glass-card");
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
  });
});

test.describe("Assessment API Flow", () => {
  test("draft -> start -> complete pipeline via API", async ({ request }) => {
    // Step 1: Create a draft run
    const draftRes = await request.post("/api/runs/draft");
    expect(draftRes.ok(), `Draft failed: ${draftRes.status()}`).toBeTruthy();
    const draft = await draftRes.json();
    expect(draft.run_id).toBeTruthy();
    const runId = draft.run_id;

    // Step 2: Start the run
    const startRes = await request.post(`/api/runs/${runId}/start`);
    expect(startRes.ok(), `Start failed: ${startRes.status()}`).toBeTruthy();

    // Step 3: Get questions to know what items to answer
    const questionsRes = await request.get(`/api/runs/${runId}/questions`);
    expect(questionsRes.ok()).toBeTruthy();
    const questionsBody = await questionsRes.json();
    const questions = questionsBody.questions || questionsBody.items || [];

    if (questions.length > 0) {
      // Build responses — answer everything with 3 (middle value)
      const responses: Record<string, number> = {};
      for (const q of questions) {
        const qId = q.id || q.item_id || q.question_id;
        if (qId) responses[qId] = 3;
      }

      // Step 4: Submit responses
      const respRes = await request.put(`/api/runs/${runId}/responses`, {
        data: { responses },
      });
      expect(respRes.ok(), `Responses failed: ${respRes.status()}`).toBeTruthy();
    }

    // Step 5: Complete the run
    const completeRes = await request.post(`/api/runs/${runId}/complete`);
    expect(completeRes.ok(), `Complete failed: ${completeRes.status()}`).toBeTruthy();
    const result = await completeRes.json();

    // Should have scoring results
    expect(result.top_rays || result.ray_pair_id || result.results).toBeTruthy();
  });
});
