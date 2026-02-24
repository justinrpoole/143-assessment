import { test, expect } from "@playwright/test";

test.describe("Lead Engine visuals", () => {
  test("upgrade-your-os hero and gold band", async ({ page }) => {
    await page.goto("/upgrade-your-os", { waitUntil: "networkidle" });
    await expect(page.getByText("The Stretched Leader")).toBeVisible();
    await expect(page.getByText("You are performing. You are delivering.")).toBeVisible();
    await expect(page.getByText("See Your Ray Snapshot")).toBeVisible();
    await expect(page.getByText("Start the 143 Challenge").first()).toBeVisible();
  });

  test("143 hero and RAS proof promise", async ({ page }) => {
    await page.goto("/143", { waitUntil: "networkidle" });
    await expect(page.getByText("Proof your RAS can be rewired in 72 hours.")).toBeVisible();
    await expect(page.getByText("Get the 72-Hour Challenge Kit (free)")).toBeVisible();
    await expect(page.getByText("Start the 143 Challenge", { exact: true })).toBeVisible();
    await expect(page.getByText("Exhausted by your own inner critic?")).toBeVisible();
  });

  test("upgrade plans visible", async ({ page }) => {
    await page.goto("/upgrade", { waitUntil: "networkidle" });
    await expect(page.getByText("Choose how you want to see the proof.")).toBeVisible();
    await expect(page.getByText("$43 one-time")).toBeVisible();
    await expect(page.getByText("$14.33/mo")).toBeVisible();
  });

  test("pricing grid and sticky CTA copy", async ({ page }) => {
    await page.goto("/pricing", { waitUntil: "networkidle" });
    await expect(page.getByText("Two ways in. Same light.")).toBeVisible();
    await expect(page.getByText("Free (start anytime)", { exact: false })).toBeVisible();
    await expect(page.getByText("Upgrade for $43 or $14.33/mo")).toBeVisible();
  });
});
