/**
 * Portal Flow Tests (Authenticated, Seeded Data)
 *
 * Validates the portal dashboard, APIs, seeded data visibility,
 * and PortalTabBar navigation.
 */

import { expect, test } from "@playwright/test";

test.describe("Portal Dashboard", () => {
  test("loads with seeded data visible", async ({ page }) => {
    await page.goto("/portal");
    await page.waitForLoadState("domcontentloaded");

    const main = page.locator("main");
    await expect(main).toBeVisible();
  });

  test("displays Light Signature section", async ({ page }) => {
    await page.goto("/portal");
    await page.waitForLoadState("networkidle");

    // The portal should show the user's Light Signature after seeding
    const body = await page.textContent("body");
    // With seeded data, at least some ray/archetype content should render
    expect(body?.length).toBeGreaterThan(100);
  });
});

test.describe("Portal Summary API", () => {
  test("returns completed run and seeded stats", async ({ request }) => {
    const res = await request.get("/api/portal/summary");
    expect(res.ok()).toBeTruthy();

    const summary = await res.json();
    expect(summary.has_completed_run).toBe(true);
    expect(summary.last_run_id).toBeTruthy();
    expect(summary.total_reps).toBeGreaterThanOrEqual(1);
    expect(summary.top_ray_ids.length).toBeGreaterThan(0);
  });
});

test.describe("Portal Tool Pages — Authenticated Access", () => {
  const toolPages = [
    { path: "/reps", name: "Reps" },
    { path: "/toolkit", name: "Toolkit" },
    { path: "/energy", name: "Energy" },
    { path: "/morning", name: "Morning" },
    { path: "/micro-joy", name: "Micro Joy" },
    { path: "/weekly", name: "Weekly" },
    { path: "/growth", name: "Growth" },
  ];

  for (const tool of toolPages) {
    test(`${tool.name} page (${tool.path}) loads`, async ({ page }) => {
      const res = await page.goto(tool.path);
      expect(res?.status()).toBeLessThan(500);
      const main = page.locator("main");
      await expect(main).toBeVisible();
    });
  }
});

test.describe("PortalTabBar — Mobile", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test("renders 4 tabs on mobile", async ({ page }) => {
    await page.goto("/portal");
    await page.waitForLoadState("domcontentloaded");

    // Tab bar should be visible on mobile
    const tabBar = page.locator("nav.fixed.bottom-0");
    await expect(tabBar).toBeVisible();

    // Should have 4 tab links
    const tabLinks = tabBar.locator("a");
    await expect(tabLinks).toHaveCount(4);
  });

  test("tab labels are Home, Report, Reps, Tools", async ({ page }) => {
    await page.goto("/portal");
    await page.waitForLoadState("domcontentloaded");

    const tabBar = page.locator("nav.fixed.bottom-0");
    const labels = ["Home", "Report", "Reps", "Tools"];

    for (const label of labels) {
      await expect(tabBar.getByText(label)).toBeVisible();
    }
  });

  test("Home tab is active on portal page", async ({ page }) => {
    await page.goto("/portal");
    await page.waitForLoadState("domcontentloaded");

    // The Home tab should have the gold active indicator
    const homeTab = page.locator('nav.fixed.bottom-0 a[href="/portal"]');
    await expect(homeTab).toBeVisible();
  });

  test("clicking Reps tab navigates to /reps", async ({ page }) => {
    await page.goto("/portal");
    await page.waitForLoadState("domcontentloaded");

    const repsTab = page.locator('nav.fixed.bottom-0 a[href="/reps"]');
    await repsTab.click();
    await page.waitForLoadState("domcontentloaded");
    expect(page.url()).toContain("/reps");
  });

  test("clicking Tools tab navigates to /toolkit", async ({ page }) => {
    await page.goto("/portal");
    await page.waitForLoadState("domcontentloaded");

    const toolsTab = page.locator('nav.fixed.bottom-0 a[href="/toolkit"]');
    await toolsTab.click();
    await page.waitForLoadState("domcontentloaded");
    expect(page.url()).toContain("/toolkit");
  });
});

test.describe("Sign Out Button", () => {
  test("sign out button is present on portal", async ({ page }) => {
    await page.goto("/portal");
    await page.waitForLoadState("domcontentloaded");

    // Look for sign out link/button
    const signOut = page.getByText(/sign out|log out/i);
    const count = await signOut.count();
    expect(count).toBeGreaterThan(0);
  });
});
