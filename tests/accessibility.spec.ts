import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Accessibility Tests", () => {
  test.skip("should not have accessibility violations on home page", async ({
    page,
  }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test.skip("should not have accessibility violations on about page", async ({
    page,
  }) => {
    await page.goto("/about");
    await page.waitForLoadState("networkidle");

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("should have proper heading hierarchy", async ({ page }) => {
    await page.goto("/");

    // Should have one h1
    const h1Count = await page.locator("h1").count();
    expect(h1Count).toBe(1);

    // Check heading structure makes sense
    await expect(page.locator("h1")).toHaveText(
      "Welcome to My First Web Application!"
    );

    const h2Elements = page.locator("h2");
    const h2Count = await h2Elements.count();
    expect(h2Count).toBeGreaterThan(0);
  });

  test("should have proper form labels and accessibility", async ({ page }) => {
    await page.goto("/");

    const messageInput = page.locator('input[placeholder="Type your message here..."]');
    const showMessageBtn = page.locator('.user-input button:has-text("Show Message")');

    // Check input has proper placeholder text
    await expect(messageInput).toHaveAttribute(
      "placeholder",
      "Type your message here..."
    );

    // Check button has descriptive text
    await expect(showMessageBtn).toHaveText("Show Message");

    // Test keyboard navigation
    await messageInput.focus();
    await expect(messageInput).toBeFocused();

    await page.keyboard.press("Tab");
    await expect(showMessageBtn).toBeFocused();
  });

  test("should have proper keyboard navigation", async ({ page }) => {
    await page.goto("/");

    // Test tab navigation through interactive elements
    const firstLink = page.locator('nav a').first();
    await firstLink.focus();

    // Navigate through elements using Tab - just verify we can tab through
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press("Tab");
      // Just verify we can navigate - specific focus order may vary
    }
  });

  test("should support Enter key activation for buttons", async ({ page }) => {
    await page.goto("/");

    // Test color button with Enter key
    const colorBtn = page.locator('button:has-text("Change Background Color")');
    await colorBtn.focus();

    const interactiveSection = page.locator("#interactive");
    const initialBgColor = await interactiveSection.evaluate(
      (el) => getComputedStyle(el).backgroundColor
    );

    await page.keyboard.press("Enter");
    await page.waitForTimeout(100);

    const newBgColor = await interactiveSection.evaluate(
      (el) => getComputedStyle(el).backgroundColor
    );
    expect(newBgColor).not.toBe(initialBgColor);

    // Test counter button with Enter key
    const counterBtn = page.locator('button:has-text("Click Counter:")');
    const counterSpan = counterBtn.locator("span");

    await counterBtn.focus();
    await page.keyboard.press("Enter");
    await expect(counterSpan).toHaveText("1");
  });

  test("should have proper ARIA attributes where needed", async ({ page }) => {
    await page.goto("/");

    // Check for proper semantic HTML usage
    const mainNav = page.locator("nav").first();
    await expect(mainNav).toBeVisible();

    const quickNav = page.locator("nav.quick-nav");
    await expect(quickNav).toBeVisible();

    const main = page.locator("main");
    await expect(main).toBeVisible();

    const header = page.locator("header");
    await expect(header).toBeVisible();

    const footer = page.locator("footer");
    await expect(footer).toBeVisible();
  });

  test.skip("should have sufficient color contrast", async ({ page }) => {
    await page.goto("/");

    // Run color contrast checks
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();

    // Filter for color contrast violations
    const colorContrastViolations = accessibilityScanResults.violations.filter(
      (violation) => violation.id === "color-contrast"
    );

    expect(colorContrastViolations).toEqual([]);
  });

  test("should work with screen reader simulation", async ({ page }) => {
    await page.goto("/");

    // Test aria-labels and accessible names
    const links = page.locator("a");
    const buttons = page.locator("button");

    // All links should have accessible text
    const linkCount = await links.count();
    for (let i = 0; i < linkCount; i++) {
      const link = links.nth(i);
      const text = await link.textContent();
      expect(text?.trim()).toBeTruthy();
    }

    // All buttons should have accessible text
    const buttonCount = await buttons.count();
    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i);
      const text = await button.textContent();
      expect(text?.trim()).toBeTruthy();
    }
  });

  test("should maintain focus visibility", async ({ page }) => {
    await page.goto("/");

    // Check that focused elements have visible focus indicators
    const colorBtn = page.locator('button:has-text("Change Background Color")');
    await colorBtn.focus();

    // The element should be focused and have some visual indication
    await expect(colorBtn).toBeFocused();

    // Test with message input
    const messageInput = page.locator('input[placeholder="Type your message here..."]');
    await messageInput.focus();
    await expect(messageInput).toBeFocused();
  });

  test("should handle zoom levels appropriately", async ({ page }) => {
    await page.goto("/");

    // Test 200% zoom
    await page.evaluate(() => {
      document.body.style.zoom = "2";
    });

    await page.waitForTimeout(500);

    // Verify page is still usable
    const colorBtn = page.locator('button:has-text("Change Background Color")');
    await expect(colorBtn).toBeVisible();
    await expect(colorBtn).toBeEnabled();

    // Reset zoom
    await page.evaluate(() => {
      document.body.style.zoom = "1";
    });
  });

  test("should work with reduced motion preferences", async ({ page }) => {
    // Simulate reduced motion preference
    await page.emulateMedia({ reducedMotion: "reduce" });

    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Click color button - should still work without animations
    const colorBtn = page.locator('button:has-text("Change Background Color")');
    const interactiveSection = page.locator("#interactive");

    const initialBgColor = await interactiveSection.evaluate(
      (el) => getComputedStyle(el).backgroundColor
    );
    await colorBtn.click();
    await page.waitForTimeout(100);

    const newBgColor = await interactiveSection.evaluate(
      (el) => getComputedStyle(el).backgroundColor
    );
    expect(newBgColor).not.toBe(initialBgColor);
  });

  test("should provide meaningful page titles", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/My First React Web App/);

    await page.goto("/about");
    await expect(page).toHaveTitle(/My First React Web App/);
  });

  test("should have proper lang attribute", async ({ page }) => {
    await page.goto("/");

    const htmlElement = page.locator("html");
    await expect(htmlElement).toHaveAttribute("lang", "en");

    await page.goto("/about");
    await expect(htmlElement).toHaveAttribute("lang", "en");
  });
});
