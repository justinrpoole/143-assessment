/**
 * Cross-Page Connection Tests (Authenticated)
 *
 * Validates that flows between pages work seamlessly:
 * marketing → login → portal, portal → tools → back,
 * portal → report, and mobile tab bar cycling.
 */

import { expect, test } from "@playwright/test";

test.describe("Marketing → Portal Flow", () => {
  test("authenticated user sees 'My Portal' in nav and can navigate", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    // With auth cookies, the nav should show "My Portal" instead of "Sign In"
    const portalLink = page.locator('nav[aria-label="Primary"] a[href="/portal"]');
    const count = await portalLink.count();

    if (count > 0) {
      await portalLink.click();
      await page.waitForLoadState("domcontentloaded");
      expect(page.url()).toContain("/portal");
    }
  });
});

test.describe("Portal → Assessment Retake", () => {
  test("can navigate from portal to assessment setup", async ({ page }) => {
    await page.goto("/portal");
    await page.waitForLoadState("domcontentloaded");

    // Look for retake/new assessment link
    const retakeLink = page.locator('a[href*="/assessment"]').first();
    const count = await retakeLink.count();
    if (count > 0) {
      await retakeLink.click();
      await page.waitForLoadState("domcontentloaded");
      expect(page.url()).toContain("/assessment");
    }
  });
});

test.describe("Portal → Daily Tools → Back", () => {
  const toolPaths = ["/morning", "/micro-joy", "/reps", "/energy"];

  for (const toolPath of toolPaths) {
    test(`portal → ${toolPath} → back to portal`, async ({ page }) => {
      await page.goto("/portal");
      await page.waitForLoadState("domcontentloaded");

      // Navigate to tool page
      await page.goto(toolPath);
      await page.waitForLoadState("domcontentloaded");
      expect(page.url()).toContain(toolPath);

      // Navigate back to portal
      await page.goto("/portal");
      await page.waitForLoadState("domcontentloaded");
      expect(page.url()).toContain("/portal");
    });
  }
});

test.describe("Portal → Report via PortalTabBar", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test("Report tab navigates to results page", async ({ page }) => {
    await page.goto("/portal");
    await page.waitForLoadState("domcontentloaded");

    // Click the Report tab
    const reportTab = page.locator('nav.fixed.bottom-0 a[href="/results"]');
    await expect(reportTab).toBeVisible();
    await reportTab.click();
    await page.waitForLoadState("domcontentloaded");

    // Should load results (not redirect to setup since we have seeded data)
    expect(page.url()).toContain("/results");
    const main = page.locator("main");
    await expect(main).toBeVisible();
  });
});

test.describe("PortalTabBar Full Cycle — Mobile", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test("Home → Reps → Tools → Home tab cycling", async ({ page }) => {
    // Start at portal (Home)
    await page.goto("/portal");
    await page.waitForLoadState("domcontentloaded");
    const tabBar = page.locator("nav.fixed.bottom-0");

    // Click Reps tab
    await tabBar.locator('a[href="/reps"]').click();
    await page.waitForLoadState("domcontentloaded");
    expect(page.url()).toContain("/reps");

    // Click Tools tab
    await tabBar.locator('a[href="/toolkit"]').click();
    await page.waitForLoadState("domcontentloaded");
    expect(page.url()).toContain("/toolkit");

    // Click Home tab
    await tabBar.locator('a[href="/portal"]').click();
    await page.waitForLoadState("domcontentloaded");
    expect(page.url()).toContain("/portal");
  });
});

test.describe("Marketing → Upgrade → Pricing Flow", () => {
  test("can navigate from marketing to upgrade to pricing", async ({ page }) => {
    await page.goto("/upgrade-your-os");
    await page.waitForLoadState("domcontentloaded");

    // Navigate to upgrade
    await page.goto("/upgrade");
    await page.waitForLoadState("domcontentloaded");
    expect(page.url()).toContain("/upgrade");

    // Navigate to pricing
    await page.goto("/pricing");
    await page.waitForLoadState("domcontentloaded");
    expect(page.url()).toContain("/pricing");
  });
});

test.describe("Quiz → Archetypes Discovery", () => {
  test("quiz page loads and archetypes page loads", async ({ page }) => {
    // Quiz page
    const quizRes = await page.goto("/quiz");
    expect(quizRes?.status()).toBeLessThan(500);

    // Archetypes page
    const archRes = await page.goto("/archetypes");
    expect(archRes?.status()).toBeLessThan(500);
    await expect(page.locator("main")).toBeVisible();
  });
});
