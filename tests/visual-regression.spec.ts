import { test, expect } from "@playwright/test";

test.describe("Visual Regression Tests", () => {
  test("should match home page screenshot", async ({ page }) => {
    await page.goto("/");

    // Wait for page to fully load and animations to complete
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000);

    // Take screenshot and compare
    await expect(page).toHaveScreenshot("home-page.png", {
      fullPage: true,
      animations: "disabled",
    });
  });

  test("should match about page screenshot", async ({ page }) => {
    await page.goto("/about.html");

    // Wait for page to fully load
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000);

    // Take screenshot and compare
    await expect(page).toHaveScreenshot("about-page.png", {
      fullPage: true,
      animations: "disabled",
    });
  });

  test("should match home page with different background colors", async ({
    page,
  }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const colorBtn = page.locator("#colorBtn");

    // Test different background color states
    for (let i = 1; i <= 3; i++) {
      await colorBtn.click();
      await page.waitForTimeout(500); // Wait for color transition

      await expect(page).toHaveScreenshot(`home-page-color-${i}.png`, {
        fullPage: true,
        animations: "disabled",
      });
    }
  });

  test("should match counter states", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const counterBtn = page.locator("#counterBtn");

    // Take screenshot at count 0
    await expect(page.locator("#interactive")).toHaveScreenshot(
      "counter-state-0.png",
      {
        animations: "disabled",
      }
    );

    // Click 6 times to get orange color
    for (let i = 0; i < 6; i++) {
      await counterBtn.click();
      await page.waitForTimeout(100);
    }

    await expect(page.locator("#interactive")).toHaveScreenshot(
      "counter-state-6-orange.png",
      {
        animations: "disabled",
      }
    );

    // Click 6 more times to get red color (total 12)
    for (let i = 0; i < 6; i++) {
      await counterBtn.click();
      await page.waitForTimeout(100);
    }

    await expect(page.locator("#interactive")).toHaveScreenshot(
      "counter-state-12-red.png",
      {
        animations: "disabled",
      }
    );
  });

  test("should match message display states", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const messageInput = page.locator("#messageInput");
    const showMessageBtn = page.locator("#showMessage");
    const userInputSection = page.locator(".user-input");

    // Test empty message error state
    await showMessageBtn.click();
    await page.waitForTimeout(200);

    await expect(userInputSection).toHaveScreenshot("message-error-state.png", {
      animations: "disabled",
    });

    // Test success message state
    await messageInput.fill("Test message for visual regression");
    await showMessageBtn.click();
    await page.waitForTimeout(200);

    await expect(userInputSection).toHaveScreenshot(
      "message-success-state.png",
      {
        animations: "disabled",
      }
    );
  });

  test.skip("should match about page time display", async ({ page }) => {
    await page.goto("/about.html");
    await page.waitForLoadState("networkidle");

    // Mock date to ensure consistent screenshots
    await page.addInitScript(() => {
      const mockDate = new Date("2025-01-15T12:00:00.000Z");
      const OriginalDate = Date;
      // @ts-ignore
      Date = class extends OriginalDate {
        constructor(value?: string | number | Date) {
          if (arguments.length === 0) {
            super(mockDate.getTime());
          } else {
            super(value!);
          }
        }

        static now() {
          return mockDate.getTime();
        }
      };
    });

    const demoBtn = page.locator("#demoBtn");
    const demoSection = page.locator(".demo-section");

    // Take screenshot before time display
    await expect(demoSection).toHaveScreenshot("about-demo-before.png", {
      animations: "disabled",
    });

    // Click demo button and take screenshot with time display
    await demoBtn.click();
    await page.waitForTimeout(200);

    await expect(demoSection).toHaveScreenshot("about-demo-after.png", {
      animations: "disabled",
    });
  });

  test.skip("should match navigation states", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Test navigation hover states
    const aboutLink = page.locator('nav a[href="about.html"]');
    const nav = page.locator("nav");

    // Normal state
    await expect(nav).toHaveScreenshot("nav-normal-state.png", {
      animations: "disabled",
    });

    // Hover state
    await aboutLink.hover();
    await page.waitForTimeout(100);

    await expect(nav).toHaveScreenshot("nav-hover-state.png", {
      animations: "disabled",
    });
  });
});
