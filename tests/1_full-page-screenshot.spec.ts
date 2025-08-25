import { test } from "@playwright/test";

test("take full page screenshot of about page", async ({ page }) => {
  await page.goto("/about.html");

  // Wait for the page to fully load
  await page.waitForLoadState("networkidle");

  // Take a full page screenshot
  await page.screenshot({
    path: "about-full-page-screenshot.png",
    fullPage: true,
  });
});

test("take full page screenshot of index page", async ({ page }) => {
  await page.goto("/index.html");

  // Wait for the page to fully load
  await page.waitForLoadState("networkidle");

  // Take a full page screenshot
  await page.screenshot({
    path: "index-full-page-screenshot.png",
    fullPage: true,
  });
});
