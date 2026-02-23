/**
 * Results Report Tests (Authenticated, Seeded Data)
 *
 * Validates that the results page loads with seeded run data,
 * auto-fetches latest run when no run_id provided,
 * and report API returns content.
 */

import { expect, test } from "@playwright/test";

test.describe("Results Page — Auto-Fetch Latest Run", () => {
  test("results page without run_id loads latest run instead of redirecting", async ({ page }) => {
    // After Phase 4 fix, /results should auto-fetch latest run_id
    const res = await page.goto("/results");
    await page.waitForLoadState("domcontentloaded");

    // Should NOT redirect to /assessment/setup if user has completed runs
    const url = page.url();
    expect(url).not.toContain("/assessment/setup");

    // Should render the results page
    const main = page.locator("main");
    await expect(main).toBeVisible();
  });
});

test.describe("Results Page — With run_id", () => {
  test("loads when given a valid run_id from portal summary", async ({ request, page }) => {
    // First get the latest run_id from portal summary
    const summaryRes = await request.get("/api/portal/summary");
    expect(summaryRes.ok()).toBeTruthy();
    const summary = await summaryRes.json();

    if (!summary.last_run_id) {
      test.skip(true, "No completed run found");
      return;
    }

    // Load results with the run_id
    await page.goto(`/results?run_id=${summary.last_run_id}`);
    await page.waitForLoadState("domcontentloaded");

    const main = page.locator("main");
    await expect(main).toBeVisible();

    // Should show results content (title or heading)
    await expect(page.getByText(/results|behavioural map|light signature/i).first()).toBeVisible();
  });
});

test.describe("Report API", () => {
  test("report endpoint returns data for completed run", async ({ request }) => {
    // Get run_id from portal summary
    const summaryRes = await request.get("/api/portal/summary");
    const summary = await summaryRes.json();

    if (!summary.last_run_id) {
      test.skip(true, "No completed run found");
      return;
    }

    // Fetch report
    const reportRes = await request.get(`/api/report?run_id=${summary.last_run_id}`);
    expect(reportRes.ok(), `Report API failed: ${reportRes.status()}`).toBeTruthy();

    const report = await reportRes.json();
    // Report should have content
    expect(report).toBeTruthy();
  });
});
