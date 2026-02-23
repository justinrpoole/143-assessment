/**
 * Navigation Tests
 *
 * Validates every link in MarketingNav, SiteFooter, and that
 * all marketing pages load without 500 errors.
 */

import { expect, test } from "@playwright/test";

// ── MarketingNav Links ──

const NAV_LINKS = [
  { href: "/upgrade-your-os", label: "Upgrade Your OS" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/outcomes", label: "Outcomes" },
  { href: "/pricing", label: "Pricing" },
  { href: "/143", label: "143 Challenge" },
  { href: "/corporate", label: "For Teams" },
  { href: "/about", label: "About" },
];

test.describe("MarketingNav — Desktop", () => {
  test("logo links to home", async ({ page }) => {
    await page.goto("/about");
    const logo = page.locator('nav[aria-label="Primary"] a').first();
    await expect(logo).toHaveAttribute("href", "/");
  });

  for (const link of NAV_LINKS) {
    test(`nav link "${link.label}" loads ${link.href}`, async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("domcontentloaded");
      // Click the desktop nav link
      const navLink = page.locator(`nav[aria-label="Primary"] a[href="${link.href}"]`).first();
      await navLink.click();
      await page.waitForLoadState("domcontentloaded");
      expect(page.url()).toContain(link.href);
      const main = page.locator("main");
      await expect(main).toBeVisible();
    });
  }

  test('"Start 143 Challenge" CTA is clickable', async ({ page }) => {
    await page.goto("/about");
    const cta = page.locator('nav[aria-label="Primary"] a[href="/143"]').last();
    await expect(cta).toBeVisible();
    await cta.click();
    await page.waitForLoadState("domcontentloaded");
    expect(page.url()).toContain("/143");
  });

  test('"Sign In" link is visible for unauthenticated user', async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");
    const signIn = page.locator('nav[aria-label="Primary"] a[href="/login"]');
    await expect(signIn).toBeVisible();
    await expect(signIn).toContainText("Sign In");
  });
});

test.describe("MarketingNav — Mobile Hamburger", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test("hamburger opens overlay with all nav links", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");
    const hamburger = page.locator('button[aria-label="Open menu"]');
    await expect(hamburger).toBeVisible();
    await hamburger.click();

    // All nav links should be visible in overlay
    for (const link of NAV_LINKS) {
      await expect(page.locator(`a[href="${link.href}"]`).first()).toBeVisible();
    }
  });

  test("clicking a mobile nav link navigates and closes menu", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");
    const hamburger = page.locator('button[aria-label="Open menu"]');
    await hamburger.click();

    // Click the "About" link in the overlay
    const aboutLink = page.locator('a[href="/about"]').last();
    await aboutLink.click();
    await page.waitForLoadState("domcontentloaded");
    expect(page.url()).toContain("/about");
  });
});

// ── SiteFooter Links ──

const FOOTER_LINKS = [
  // Product
  { href: "/upgrade-your-os", label: "Upgrade Your OS" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/sample-report", label: "Sample Report" },
  { href: "/outcomes", label: "Outcomes" },
  { href: "/pricing", label: "Pricing" },
  // Practice
  { href: "/framework", label: "The Framework" },
  { href: "/143", label: "143 Challenge" },
  { href: "/coaches", label: "Coaching Program" },
  { href: "/resources", label: "Resources" },
  { href: "/glossary", label: "Glossary" },
  { href: "/faq", label: "FAQ" },
  // Company
  { href: "/about", label: "About" },
  { href: "/justin", label: "Justin Ray" },
  { href: "/corporate", label: "For Teams" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
];

test.describe("SiteFooter Links", () => {
  for (const link of FOOTER_LINKS) {
    test(`footer "${link.label}" -> ${link.href} loads without 500`, async ({ page }) => {
      await page.goto(link.href);
      const response = await page.waitForLoadState("domcontentloaded");
      const main = page.locator("main");
      await expect(main).toBeVisible();
    });
  }
});

// ── All Marketing Pages Load ──

const MARKETING_PAGES = [
  "/",
  "/upgrade-your-os",
  "/143",
  "/143-challenge",
  "/about",
  "/archetypes",
  "/assessment",
  "/assessment/instructions",
  "/assessment/setup",
  "/coaches",
  "/cohorts",
  "/corporate",
  "/enterprise",
  "/faq",
  "/framework",
  "/glossary",
  "/how-it-works",
  "/justin",
  "/login",
  "/organizations",
  "/os-coaching",
  "/outcomes",
  "/plan",
  "/pricing",
  "/privacy",
  "/quiz",
  "/resources",
  "/sample-report",
  "/terms",
  "/upgrade",
];

test.describe("All Marketing Pages — No 500s", () => {
  for (const path of MARKETING_PAGES) {
    test(`${path} loads without error`, async ({ page }) => {
      const res = await page.goto(path);
      expect(res?.status()).toBeLessThan(500);
    });
  }
});
