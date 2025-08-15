import { test, expect } from "@playwright/test";

test.describe("Visual Regression Tests", () => {
  //index page
  test("index page should match baseline screenshot", async ({ page }) => {
    await page.goto("/index.html");
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveScreenshot("index-page.png");
  });

  test("index page fullscreen should match baseline screenshot", async ({
    page,
  }) => {
    await page.goto("/index.html");
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveScreenshot("index-page-fullscreen.png", {
      fullPage: true,
    });
  });

  //about page
  test("about page should match baseline screenshot", async ({ page }) => {
    await page.goto("/about.html");
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveScreenshot("about-page.png");
  });

  test("about page fullscreen should match baseline screenshot", async ({
    page,
  }) => {
    await page.goto("/about.html");
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveScreenshot("about-page-fullscreen.png", {
      fullPage: true,
    });
  });
});
