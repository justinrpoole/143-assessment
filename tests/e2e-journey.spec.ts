/**
 * E2E Journey Tests (Playwright)
 *
 * Validates that core user-facing pages load correctly:
 * 1. Marketing pages render without errors
 * 2. Assessment flow pages are accessible
 * 3. Auth pages render
 * 4. Results and portal pages handle unauthenticated gracefully
 * 5. Coaching program page renders
 * 6. Glossary page renders with metric definitions
 *
 * Run: npm run qa:e2e
 */

import { expect, test } from "@playwright/test";

test.describe("Marketing Pages", () => {
  test("home page loads", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/143/i);
  });

  test("how it works page loads", async ({ page }) => {
    await page.goto("/how-it-works");
    await expect(page.locator("main")).toBeVisible();
  });

  test("sample report page loads", async ({ page }) => {
    await page.goto("/sample-report");
    await expect(page.locator("main")).toBeVisible();
  });

  test("outcomes page loads", async ({ page }) => {
    await page.goto("/outcomes");
    await expect(page.locator("main")).toBeVisible();
  });
});

test.describe("Assessment Flow Pages", () => {
  test("assessment landing page loads", async ({ page }) => {
    await page.goto("/assessment");
    await expect(page.locator("main")).toBeVisible();
  });

  test("assessment instructions page loads", async ({ page }) => {
    await page.goto("/assessment/instructions");
    await expect(page.locator("main")).toBeVisible();
    await expect(page.getByText("Before You Begin")).toBeVisible();
  });

  test("assessment setup page loads", async ({ page }) => {
    await page.goto("/assessment/setup");
    await expect(page.locator("main")).toBeVisible();
  });
});

test.describe("Auth Pages", () => {
  test("sign-in page loads", async ({ page }) => {
    await page.goto("/auth/signin");
    await expect(page.locator("main")).toBeVisible();
  });
});

test.describe("Coaching Program", () => {
  test("coaching page loads with program content", async ({ page }) => {
    await page.goto("/coaches");
    await expect(page.locator("main")).toBeVisible();
    await expect(page.getByText("Light Activation Program")).toBeVisible();
  });

  test("coaching page has 10 weekly sections", async ({ page }) => {
    await page.goto("/coaches");
    const weekNumbers = page.locator("details summary");
    await expect(weekNumbers).toHaveCount(10);
  });
});

test.describe("Glossary", () => {
  test("glossary page loads", async ({ page }) => {
    await page.goto("/glossary");
    await expect(page.locator("main")).toBeVisible();
  });
});

test.describe("Protected Pages (Unauthenticated)", () => {
  test("portal redirects or shows auth prompt", async ({ page }) => {
    const response = await page.goto("/portal");
    // Should either redirect to sign-in or show the page
    // (middleware may redirect, or page may render an auth prompt)
    expect(response?.status()).toBeLessThan(500);
  });

  test("results page handles missing run gracefully", async ({ page }) => {
    const response = await page.goto("/results");
    expect(response?.status()).toBeLessThan(500);
  });
});

test.describe("Cosmic Design System", () => {
  test("pages use cosmic-page-bg class", async ({ page }) => {
    await page.goto("/assessment/instructions");
    const main = page.locator("main.cosmic-page-bg");
    await expect(main).toBeVisible();
  });

  test("glass cards render", async ({ page }) => {
    await page.goto("/assessment/instructions");
    const glassCards = page.locator(".glass-card");
    const count = await glassCards.count();
    expect(count).toBeGreaterThan(0);
  });
});
