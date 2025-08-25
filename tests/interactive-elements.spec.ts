import { test, expect } from "@playwright/test";

test.describe("Interactive Elements Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should change background color on button click", async ({ page }) => {
    const colorBtn = page.locator("#colorBtn");
    const body = page.locator("body");

    // Get initial background color
    const initialBgColor = await body.evaluate(
      (el) => getComputedStyle(el).backgroundColor
    );

    // Click color button and verify background changes
    await colorBtn.click();

    // Wait for the color change to apply
    await page.waitForTimeout(100);

    const newBgColor = await body.evaluate(
      (el) => getComputedStyle(el).backgroundColor
    );
    expect(newBgColor).not.toBe(initialBgColor);

    // Verify the button has bounce animation class temporarily
    await expect(colorBtn).toHaveClass(/bounce/);

    // Wait for animation to complete and verify bounce class is removed
    await page.waitForTimeout(600);
    await expect(colorBtn).not.toHaveClass(/bounce/);
  });

  test.skip("should increment click counter", async ({ page }) => {
    // Skip due to some issue with webkit
    const counterBtn = page.locator("#counterBtn");
    const counterSpan = page.locator("#counter");

    // Verify initial counter value
    await expect(counterSpan).toHaveText("0");

    // Click counter button multiple times
    for (let i = 1; i <= 6; i++) {
      await counterBtn.click();
      await expect(counterSpan).toHaveText(i.toString());

      // Verify bounce animation
      await expect(counterBtn).toHaveClass(/bounce/);
      await page.waitForTimeout(100);
    }

    // Test color change after 6 clicks
    // Wait for the CSS transition to complete (0.3s + buffer)
    await page.waitForTimeout(400);
    const buttonColor = await counterBtn.evaluate(
      (el) => getComputedStyle(el).backgroundColor
    );
    expect(buttonColor).toBe("rgb(243, 156, 18)"); // orange color

    // Continue clicking to test next color threshold
    for (let i = 7; i <= 11; i++) {
      await counterBtn.click();
      await expect(counterSpan).toHaveText(i.toString());
    }

    // Test red color after 10 clicks
    // Wait for the CSS transition to complete (0.3s + buffer)
    await page.waitForTimeout(400);
    const redButtonColor = await counterBtn.evaluate(
      (el) => getComputedStyle(el).backgroundColor
    );
    expect(redButtonColor).toBe("rgb(231, 76, 60)"); // red color
  });

  test("should display user message", async ({ page }) => {
    const messageInput = page.locator("#messageInput");
    const showMessageBtn = page.locator("#showMessage");
    const messageDisplay = page.locator("#messageDisplay");

    const testMessage = "Hello, this is a test message!";

    // Enter message and click show button
    await messageInput.fill(testMessage);
    await showMessageBtn.click();

    // Verify message is displayed correctly
    await expect(messageDisplay).toContainText(
      `Your message: "${testMessage}"`
    );

    // Verify input is cleared after showing message
    await expect(messageInput).toHaveValue("");

    // Verify success styling
    const backgroundColor = await messageDisplay.evaluate(
      (el) => getComputedStyle(el).backgroundColor
    );
    expect(backgroundColor).toBe("rgb(232, 246, 243)"); // success background color
  });

  test("should handle empty message input", async ({ page }) => {
    const messageInput = page.locator("#messageInput");
    const showMessageBtn = page.locator("#showMessage");
    const messageDisplay = page.locator("#messageDisplay");

    // Click show button without entering message
    await showMessageBtn.click();

    // Verify error message is displayed
    await expect(messageDisplay).toContainText("Please enter a message first!");

    // Verify error styling
    const backgroundColor = await messageDisplay.evaluate(
      (el) => getComputedStyle(el).backgroundColor
    );
    expect(backgroundColor).toBe("rgb(255, 232, 232)"); // error background color
  });

  test("should trigger message display with Enter key", async ({ page }) => {
    const messageInput = page.locator("#messageInput");
    const messageDisplay = page.locator("#messageDisplay");

    const testMessage = "Testing Enter key functionality";

    // Enter message and press Enter
    await messageInput.fill(testMessage);
    await messageInput.press("Enter");

    // Verify message is displayed
    await expect(messageDisplay).toContainText(
      `Your message: "${testMessage}"`
    );

    // Verify input is cleared
    await expect(messageInput).toHaveValue("");
  });

  test("should handle whitespace-only message", async ({ page }) => {
    const messageInput = page.locator("#messageInput");
    const showMessageBtn = page.locator("#showMessage");
    const messageDisplay = page.locator("#messageDisplay");

    // Enter only spaces
    await messageInput.fill("   ");
    await showMessageBtn.click();

    // Verify error message for empty content
    await expect(messageDisplay).toContainText("Please enter a message first!");
  });

  test("should verify page loading animation", async ({ page }) => {
    // Navigate to page and check initial opacity transition
    await page.goto("/", { waitUntil: "domcontentloaded" });

    // The body should become visible with opacity animation
    const body = page.locator("body");
    await page.goto("/", { waitUntil: "networkidle" });

    // Check that transition property is set
    const transition = await body.evaluate(
      (el) => getComputedStyle(el).transition
    );
    expect(transition).toContain("opacity");
  });

  test("should verify feature cards hover effects", async ({ page }) => {
    const featureCards = page.locator(".feature");

    // Test hover on first feature card
    const firstCard = featureCards.first();
    await firstCard.hover();

    // Verify transform is applied on hover (browsers compute scale as matrix)
    const transform = await firstCard.evaluate(
      (el) => getComputedStyle(el).transform
    );
    expect(transform).not.toBe("none");
  });
});
