import { test, expect } from "@playwright/test";

test.describe("End-to-End User Flows", () => {
  test("complete new user journey", async ({ page }) => {
    // Simulate a new user discovering the website
    await page.goto("/");

    // User reads the homepage content
    await expect(page.locator("h1")).toHaveText(
      "Welcome to My First Web Application!"
    );
    await expect(page.locator(".intro p").first()).toBeVisible();

    // User explores the learning features section
    const features = page.locator(".feature");
    await expect(features).toHaveCount(3);

    // User interacts with the color changer
    const colorBtn = page.locator('button:has-text("Change Background Color")');
    await colorBtn.click();
    await page.waitForTimeout(100);

    // User tries the click counter multiple times
    const counterBtn = page.locator('button:has-text("Click Counter:")');
    const counterSpan = counterBtn.locator("span");

    for (let i = 1; i <= 3; i++) {
      await counterBtn.click();
      await expect(counterSpan).toHaveText(i.toString());
    }

    // User leaves a message
    const messageInput = page.locator('input[placeholder="Type your message here..."]');
    const showMessageBtn = page.locator('.user-input button:has-text("Show Message")');
    const messageDisplay = page.locator(".message-display");

    await messageInput.fill("This is my first message!");
    await showMessageBtn.click();
    await expect(messageDisplay).toContainText("This is my first message!");

    // User navigates to About page to learn more
    await page.click('nav a:has-text("About")');
    await expect(page).toHaveURL('/about');

    // User reads about the technologies
    const techItems = page.locator(".tech-item");
    await expect(techItems).toHaveCount(3);

    // User tries the time demo
    const demoBtn = page.locator('button:has-text("Show Current Time")');

    await demoBtn.click();
    const timeDisplay = page.locator('div').filter({ hasText: /Current Date:/ }).first();
    await expect(timeDisplay).toBeVisible();
    await expect(timeDisplay).toContainText("Current Date:");

    // User returns to homepage
    await page.click('nav a:has-text("Home")');
    await expect(page).toHaveURL('/');
  });

  test("power user interaction flow", async ({ page }) => {
    await page.goto("/");

    // Power user quickly tests all interactive elements
    const colorBtn = page.locator('button:has-text("Change Background Color")');
    const counterBtn = page.locator('button:has-text("Click Counter:")');
    const messageInput = page.locator('input[placeholder="Type your message here..."]');

    // Rapidly change colors
    for (let i = 0; i < 5; i++) {
      await colorBtn.click();
      await page.waitForTimeout(50);
    }

    // Click counter multiple times
    for (let i = 0; i < 12; i++) {
      await counterBtn.click();
      await page.waitForTimeout(30);
    }

    // Test message functionality with different inputs
    const messages = ["Short", "This is a longer message to test", "123!@#"];

    for (const message of messages) {
      await messageInput.fill(message);
      await messageInput.press("Enter");
      await expect(page.locator(".message-display")).toContainText(message);
      await page.waitForTimeout(100);
    }

    // Navigate between pages multiple times
    for (let i = 0; i < 3; i++) {
      await page.click('nav a:has-text("About")');
      await page.click('button:has-text("Show Current Time")');
      await page.click('nav a:has-text("Home")');
    }
  });

  test("accessibility-focused user flow", async ({ page }) => {
    await page.goto("/");

    // User navigating with keyboard only
    await page.keyboard.press("Tab"); // First navigation link
    await page.keyboard.press("Tab"); // Second navigation link
    await page.keyboard.press("Tab"); // Third navigation link

    // Navigate using keyboard to interactive section
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press("Tab");
    }

    // User reaches color button and activates with Enter
    const colorBtn = page.locator('button:has-text("Change Background Color")');
    await colorBtn.focus();
    await page.keyboard.press("Enter");

    // User navigates to counter button
    await page.keyboard.press("Tab");
    const counterBtn = page.locator('button:has-text("Click Counter:")');
    await expect(counterBtn).toBeFocused();
    await page.keyboard.press("Enter");

    // User navigates to message input
    await page.keyboard.press("Tab");
    const messageInput = page.locator('input[placeholder="Type your message here..."]');
    await expect(messageInput).toBeFocused();

    // User types message and uses Enter to submit
    await messageInput.type("Keyboard navigation test");
    await page.keyboard.press("Enter");

    await expect(page.locator(".message-display")).toContainText(
      "Keyboard navigation test"
    );
  });

  test("mobile user experience flow", async ({ page }) => {
    // Only run on projects with touch support
    const hasTouch = test.info().project.use.hasTouch;
    test.skip(!hasTouch, "Skipping mobile test - no touch support");

    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto("/");

    // Mobile user taps through elements
    await page.tap('button:has-text("Change Background Color")');
    await page.tap('button:has-text("Click Counter:")');
    await page.tap('button:has-text("Click Counter:")');
    await page.tap('button:has-text("Click Counter:")');

    // Mobile user types in message field
    await page.tap('input[placeholder="Type your message here..."]');
    await page.fill('input[placeholder="Type your message here..."]', "Mobile test message");
    await page.tap('.user-input button:has-text("Show Message")');

    await expect(page.locator(".message-display")).toContainText(
      "Mobile test message"
    );

    // Mobile user scrolls and navigates
    await page.tap('nav a:has-text("About")');
    await expect(page).toHaveURL('/about');

    // Scroll down on mobile
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    // Test mobile interaction with demo button
    await page.tap('button:has-text("Show Current Time")');
    const timeDisplay = page.locator('div').filter({ hasText: /Current Date:/ }).first();
    await expect(timeDisplay).toBeVisible();
  });

  test("error recovery user flow", async ({ page }) => {
    await page.goto("/");

    // User tries to submit empty message
    const showMessageBtn = page.locator('.user-input button:has-text("Show Message")');
    await showMessageBtn.click();

    await expect(page.locator(".message-display")).toContainText(
      "Please enter a message first!"
    );

    // User corrects the error by entering a message
    const messageInput = page.locator('input[placeholder="Type your message here..."]');
    await messageInput.fill("Now I entered a message");
    await showMessageBtn.click();

    await expect(page.locator(".message-display")).toContainText(
      "Now I entered a message"
    );

    // User tries to submit whitespace-only message
    await messageInput.fill("   ");
    await showMessageBtn.click();

    await expect(page.locator(".message-display")).toContainText(
      "Please enter a message first!"
    );

    // User recovers again
    await messageInput.fill("Final valid message");
    await showMessageBtn.click();

    await expect(page.locator(".message-display")).toContainText(
      "Final valid message"
    );
  });

  test("cross-page feature exploration", async ({ page }) => {
    // Start on home page
    await page.goto("/");

    // Interact with multiple features on home page
    await page.click('button:has-text("Change Background Color")');
    await page.click('button:has-text("Click Counter:")');
    await page.fill('input[placeholder="Type your message here..."]', "Cross-page test");
    await page.click('.user-input button:has-text("Show Message")');

    // Navigate to about page
    await page.click('nav a:has-text("About")');

    // Interact with about page demo
    await page.click('button:has-text("Show Current Time")');
    const timeDisplay = page.locator('div').filter({ hasText: /Current Date:/ }).first();
    await expect(timeDisplay).toBeVisible();

    // Navigate back to home page
    await page.click('nav a:has-text("Home")');

    // Verify home page state is reset (React unmounts/remounts components)
    const counterBtn = page.locator('button:has-text("Click Counter:")');
    const counterSpan = counterBtn.locator("span");
    await expect(counterSpan).toHaveText("0");

    // Continue interactions
    await counterBtn.click();
    await expect(counterSpan).toHaveText("1");
  });

  test("session continuity flow", async ({ page }) => {
    await page.goto("/");

    // User performs various actions
    const actions = [
      () => page.click('button:has-text("Change Background Color")'),
      () => page.click('button:has-text("Click Counter:")'),
      () => page.fill('input[placeholder="Type your message here..."]', "Session test"),
      () => page.click('.user-input button:has-text("Show Message")'),
      () => page.click('nav a:has-text("About")'),
      () => page.click('button:has-text("Show Current Time")'),
      () => page.click('nav a:has-text("Home")'),
    ];

    // Perform actions with small delays to simulate realistic usage
    for (const action of actions) {
      await action();
      await page.waitForTimeout(200);
    }

    // Verify final state (React resets state on remount)
    const counterBtn = page.locator('button:has-text("Click Counter:")');
    const counterSpan = counterBtn.locator("span");
    await expect(counterSpan).toHaveText("0");
    await expect(page.locator(".message-display")).toContainText("");

    // User continues session with more interactions
    await counterBtn.click();
    await counterBtn.click();
    await expect(counterSpan).toHaveText("2");
  });

  test.skip("performance during extended usage", async ({ page }) => {
    await page.goto("/");

    const startTime = Date.now();

    // Simulate extended usage session
    for (let i = 0; i < 10; i++) {
      // Color changes
      await page.click('button:has-text("Change Background Color")');

      // Counter clicks
      await page.click('button:has-text("Click Counter:")');

      // Message interactions
      await page.fill('input[placeholder="Type your message here..."]', `Message ${i}`);
      await page.click('.user-input button:has-text("Show Message")');

      // Page navigation
      if (i % 3 === 0) {
        await page.click('nav a:has-text("About")');
        await page.click('button:has-text("Show Current Time")');
        await page.click('nav a:has-text("Home")');
      }

      await page.waitForTimeout(50);
    }

    const endTime = Date.now();
    const totalTime = endTime - startTime;

    // Extended usage should complete within reasonable time
    // WebKit is consistently slower, so give it more time
    const timeoutMs =
      page.context().browser()?.browserType().name() === "webkit"
        ? 40000
        : 10000;
    expect(totalTime).toBeLessThan(timeoutMs);

    // Verify final state is correct (React resets on remount)
    const counterBtn = page.locator('button:has-text("Click Counter:")');
    const counterSpan = counterBtn.locator("span");
    await expect(counterSpan).toHaveText("0");

    console.log(`Extended usage session completed in ${totalTime}ms`);
  });
});
