import { test } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

test("take full page screenshot of about page", async ({ page }, testInfo) => {
  await page.goto("/about.html");

  // Wait for the page to fully load
  await page.waitForLoadState("networkidle");

  // Delete previous about screenshots for this project
  const screenshotDir = "Screenshot";
  const pattern = `_about-screenshot_${testInfo.project.name}.png`;

  if (fs.existsSync(screenshotDir)) {
    const files = fs.readdirSync(screenshotDir);
    files.forEach(file => {
      if (file.includes(pattern)) {
        fs.unlinkSync(path.join(screenshotDir, file));
      }
    });
  }

  // Generate timestamp in YYMMDD_hh:mm format
  const now = new Date();
  const timestamp = `${now.getFullYear().toString().slice(-2)}${(
    now.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}${now.getDate().toString().padStart(2, "0")}_${now
    .getHours()
    .toString()
    .padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;

  // Take a full page screenshot
  await page.screenshot({
    path: `Screenshot/${timestamp}_about-screenshot_${testInfo.project.name}.png`,
    fullPage: true,
  });
});

test("take full page screenshot of index page", async ({ page }, testInfo) => {
  await page.goto("/index.html");

  // Wait for the page to fully load
  await page.waitForLoadState("networkidle");

  // Delete previous index screenshots for this project
  const screenshotDir = "Screenshot";
  const pattern = `_index-screenshot_${testInfo.project.name}.png`;

  if (fs.existsSync(screenshotDir)) {
    const files = fs.readdirSync(screenshotDir);
    files.forEach(file => {
      if (file.includes(pattern)) {
        fs.unlinkSync(path.join(screenshotDir, file));
      }
    });
  }

  // Generate timestamp in YYMMDD_hh:mm format
  const now = new Date();
  const timestamp = `${now.getFullYear().toString().slice(-2)}${(
    now.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}${now.getDate().toString().padStart(2, "0")}_${now
    .getHours()
    .toString()
    .padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;

  // Take a full page screenshot
  await page.screenshot({
    path: `Screenshot/${timestamp}_index-screenshot_${testInfo.project.name}.png`,
    fullPage: true,
  });
});
