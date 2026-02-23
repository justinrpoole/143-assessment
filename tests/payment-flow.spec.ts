/**
 * Payment Flow Tests
 *
 * Validates upgrade page rendering, pricing display,
 * and upgrade CTAs.
 */

import { expect, test } from "@playwright/test";

test.describe("Upgrade Page", () => {
  test("renders with pricing information", async ({ page }) => {
    await page.goto("/upgrade");
    await page.waitForLoadState("domcontentloaded");

    const main = page.locator("main");
    await expect(main).toBeVisible();

    // Should display the $43 one-time price or $14.33/mo subscription
    const body = await page.textContent("body");
    const hasPricing = body?.includes("43") || body?.includes("14.33");
    expect(hasPricing).toBeTruthy();
  });

  test("has upgrade CTA button", async ({ page }) => {
    await page.goto("/upgrade");
    await page.waitForLoadState("domcontentloaded");

    // Look for an upgrade/purchase/subscribe button or link
    const cta = page.getByRole("link", { name: /upgrade|purchase|subscribe|get access|begin|start/i });
    const count = await cta.count();
    // At least one CTA should be present
    expect(count).toBeGreaterThan(0);
  });
});

test.describe("Pricing Page", () => {
  test("loads with pricing details", async ({ page }) => {
    await page.goto("/pricing");
    await page.waitForLoadState("domcontentloaded");

    const main = page.locator("main");
    await expect(main).toBeVisible();

    // Should have pricing content
    const body = await page.textContent("body");
    expect(body?.length).toBeGreaterThan(100);
  });
});

test.describe("Upgrade-Your-OS Page", () => {
  test("renders as primary landing page", async ({ page }) => {
    await page.goto("/upgrade-your-os");
    await page.waitForLoadState("domcontentloaded");

    const main = page.locator("main");
    await expect(main).toBeVisible();
  });

  test("has clear call-to-action", async ({ page }) => {
    await page.goto("/upgrade-your-os");
    await page.waitForLoadState("domcontentloaded");

    // Should have at least one CTA link
    const ctaLinks = page.locator('a[href="/assessment"], a[href="/upgrade"], a[href="/pricing"]');
    const count = await ctaLinks.count();
    expect(count).toBeGreaterThan(0);
  });
});
