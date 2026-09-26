import { test, expect } from "@playwright/test";

const BASE = "/cinehub";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    if (!localStorage.getItem("cinehub:v1:library")) {
      localStorage.setItem(
        "cinehub:v1:library",
        JSON.stringify({
          watchlist: [],
          favorites: [],
          taste: { likedIds: [], skippedIds: [] },
          onboarded: true,
        })
      );
    }
  });
});

test.describe("CineHub smoke", () => {
  test("home renders hero and rails", async ({ page }) => {
    await page.goto(BASE + "/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.locator("section").first()).toBeVisible();
  });

  test("movies page loads a grid", async ({ page }) => {
    await page.goto(BASE + "/movies");
    await expect(page.getByRole("heading", { name: "Movies" })).toBeVisible();
    await expect(page.locator("img").first()).toBeVisible({ timeout: 10000 });
  });

  test("tv shows page loads a grid", async ({ page }) => {
    await page.goto(BASE + "/tvshows");
    await expect(page.getByRole("heading", { name: "TV Shows" })).toBeVisible();
    await expect(page.locator("img").first()).toBeVisible({ timeout: 10000 });
  });

  test("search returns results", async ({ page }) => {
    await page.goto(BASE + "/search?q=dune");
    await expect(page.getByText(/result/i).first()).toBeVisible({ timeout: 10000 });
  });

  test("detail page opens from a poster", async ({ page }) => {
    await page.goto(BASE + "/movies");
    await expect(page.locator("img").first()).toBeVisible({ timeout: 10000 });
    await page.locator('main a[href*="/movie/"], main a[href*="/tv/"]').first().click();
    await expect(page).toHaveURL(/\/(movie|tv)\/\d+/);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("watchlist toggles and persists", async ({ page }) => {
    await page.goto(BASE + "/movie/969681");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible({ timeout: 10000 });
    await page.getByRole("button", { name: "Watchlist", exact: true }).click();
    await page.goto(BASE + "/library?tab=watchlist");
    await expect(page.locator("img").first()).toBeVisible({ timeout: 10000 });
  });

  test("library stats render", async ({ page }) => {
    await page.goto(BASE + "/library");
    await expect(page.getByRole("heading", { name: "Your Library", level: 1 })).toBeVisible();
    await expect(page.getByText("Watch hours")).toBeVisible();
  });

  test("404 page renders", async ({ page }) => {
    await page.goto(BASE + "/definitely-not-a-real-page");
    await expect(page.getByText("404")).toBeVisible();
  });
});
