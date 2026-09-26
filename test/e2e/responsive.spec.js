import { test, expect } from "@playwright/test";

const BASE = "/cinehub";

test.describe("Responsive verification", () => {
  test("desktop 1440px renders correctly", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(BASE + "/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    const imgs = await page.locator("img").count();
    console.log("DESKTOP_IMAGES:", imgs);
    await page.screenshot({ path: "test-results/desktop.png", fullPage: false });
  });

  test("mobile 390px renders correctly", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(BASE + "/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    const imgs = await page.locator("img").count();
    console.log("MOBILE_IMAGES:", imgs);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    console.log("MOBILE_OVERFLOW:", overflow);
    await page.screenshot({ path: "test-results/mobile.png", fullPage: false });
  });

  test("tablet 768px renders correctly", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto(BASE + "/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await page.screenshot({ path: "test-results/tablet.png", fullPage: false });
  });

  test("mobile movies page", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(BASE + "/movies");
    await expect(page.getByRole("heading", { name: "Movies" })).toBeVisible();
    const imgs = await page.locator("img").count();
    console.log("MOBILE_MOVIES_IMAGES:", imgs);
    await page.screenshot({ path: "test-results/mobile-movies.png", fullPage: false });
  });

  test("mobile detail page", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(BASE + "/movie/969681");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible({ timeout: 10000 });
    await page.screenshot({ path: "test-results/mobile-detail.png", fullPage: false });
  });

  test("mobile menu button exists", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(BASE + "/");
    const menuBtn = page.locator('button[aria-label="Open menu"]');
    await expect(menuBtn).toBeVisible();
    await page.screenshot({ path: "test-results/mobile-menu.png", fullPage: false });
  });
});
