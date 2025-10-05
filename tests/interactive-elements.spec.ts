import { test, expect } from "@playwright/test";

test.describe("Interactive Elements Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should change background color on button click", async ({ page }) => {
    const colorBtn = page.locator('button:has-text("Change Background Color")');
    const interactiveSection = page.locator("#interactive");

    // Get initial background color of the interactive section
    const initialBgColor = await interactiveSection.evaluate(
      (el) => getComputedStyle(el).backgroundColor
    );

    // Click color button and verify background changes
    await colorBtn.click();

    // Wait for the color change to apply
    await page.waitForTimeout(100);

    const newBgColor = await interactiveSection.evaluate(
      (el) => getComputedStyle(el).backgroundColor
    );
    expect(newBgColor).not.toBe(initialBgColor);
  });

  test("should increment click counter", async ({ page }) => {
    const counterBtn = page.locator('button:has-text("Click Counter:")');
    const counterSpan = counterBtn.locator("span");

    // Verify initial counter value
    await expect(counterSpan).toHaveText("0");

    // Click counter button multiple times
    for (let i = 1; i <= 5; i++) {
      await counterBtn.click();
      await expect(counterSpan).toHaveText(i.toString());
    }
  });

  test("should display user message", async ({ page }) => {
    const messageInput = page.locator('input[placeholder="Type your message here..."]');
    const showMessageBtn = page.locator('.user-input button:has-text("Show Message")');
    const messageDisplay = page.locator(".message-display");

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
    const messageInput = page.locator('input[placeholder="Type your message here..."]');
    const showMessageBtn = page.locator('.user-input button:has-text("Show Message")');
    const messageDisplay = page.locator(".message-display");

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
    const messageInput = page.locator('input[placeholder="Type your message here..."]');
    const messageDisplay = page.locator(".message-display");

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
    const messageInput = page.locator('input[placeholder="Type your message here..."]');
    const showMessageBtn = page.locator('.user-input button:has-text("Show Message")');
    const messageDisplay = page.locator(".message-display");

    // Enter only spaces
    await messageInput.fill("   ");
    await showMessageBtn.click();

    // Verify error message for empty content
    await expect(messageDisplay).toContainText("Please enter a message first!");
  });

  test("should verify feature cards hover effects", async ({ page }) => {
    const featureCards = page.locator(".feature");

    // Verify feature cards exist
    await expect(featureCards.first()).toBeVisible();

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
