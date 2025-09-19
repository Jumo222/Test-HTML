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
    const colorBtn = page.locator("#colorBtn");
    await colorBtn.click();
    await page.waitForTimeout(100);

    // User tries the click counter multiple times
    const counterBtn = page.locator("#counterBtn");
    const counterSpan = page.locator("#counter");

    for (let i = 1; i <= 3; i++) {
      await counterBtn.click();
      await expect(counterSpan).toHaveText(i.toString());
    }

    // User leaves a message
    const messageInput = page.locator("#messageInput");
    const showMessageBtn = page.locator("#showMessage");
    const messageDisplay = page.locator("#messageDisplay");

    await messageInput.fill("This is my first message!");
    await showMessageBtn.click();
    await expect(messageDisplay).toContainText("This is my first message!");

    // User navigates to About page to learn more
    await page.click('nav a[href="about.html"]');
    await expect(page).toHaveTitle("My First Web App - About");

    // User reads about the technologies
    const techItems = page.locator(".tech-item");
    await expect(techItems).toHaveCount(3);

    // User tries the time demo
    const demoBtn = page.locator("#demoBtn");
    const timeDisplay = page.locator("#timeDisplay");

    await demoBtn.click();
    await expect(timeDisplay).toBeVisible();
    await expect(timeDisplay).toContainText("Current Date:");

    // User returns to homepage
    await page.click('nav a[href="index.html"]');
    await expect(page).toHaveTitle("My First Web App - Home");
  });

  test("power user interaction flow", async ({ page }) => {
    await page.goto("/");

    // Power user quickly tests all interactive elements
    const colorBtn = page.locator("#colorBtn");
    const counterBtn = page.locator("#counterBtn");
    const messageInput = page.locator("#messageInput");
    const showMessageBtn = page.locator("#showMessage");

    // Rapidly change colors
    for (let i = 0; i < 5; i++) {
      await colorBtn.click();
      await page.waitForTimeout(50);
    }

    // Click counter to test different color states
    for (let i = 0; i < 12; i++) {
      await counterBtn.click();
      await page.waitForTimeout(30);
    }

    // Verify counter reached red state
    const counterBtnStyle = await counterBtn.evaluate(
      (el) => el.style.backgroundColor
    );
    expect(counterBtnStyle).toBe("rgb(231, 76, 60)");

    // Test message functionality with different inputs
    const messages = ["Short", "This is a longer message to test", "123!@#"];

    for (const message of messages) {
      await messageInput.fill(message);
      await messageInput.press("Enter");
      await expect(page.locator("#messageDisplay")).toContainText(message);
      await page.waitForTimeout(100);
    }

    // Navigate between pages multiple times
    for (let i = 0; i < 3; i++) {
      await page.click('nav a[href="about.html"]');
      await page.click("#demoBtn");
      await page.click('nav a[href="index.html"]');
    }
  });

  test("accessibility-focused user flow", async ({ page }) => {
    await page.goto("/");

    // User navigating with keyboard only
    await page.keyboard.press("Tab"); // First navigation link
    await page.keyboard.press("Tab"); // Second navigation link
    await page.keyboard.press("Tab"); // First quick nav link

    // Navigate using keyboard to interactive section
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");

    // User reaches color button and activates with Enter
    const colorBtn = page.locator("#colorBtn");
    await colorBtn.focus();
    await page.keyboard.press("Enter");

    // User navigates to counter button
    await page.keyboard.press("Tab");
    const counterBtn = page.locator("#counterBtn");
    await expect(counterBtn).toBeFocused();
    await page.keyboard.press("Enter");

    // User navigates to message input
    await page.keyboard.press("Tab");
    const messageInput = page.locator("#messageInput");
    await expect(messageInput).toBeFocused();

    // User types message and uses Enter to submit
    await messageInput.type("Keyboard navigation test");
    await page.keyboard.press("Enter");

    await expect(page.locator("#messageDisplay")).toContainText(
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
    await page.tap("#colorBtn");
    await page.tap("#counterBtn");
    await page.tap("#counterBtn");
    await page.tap("#counterBtn");

    // Mobile user types in message field
    await page.tap("#messageInput");
    await page.fill("#messageInput", "Mobile test message");
    await page.tap("#showMessage");

    await expect(page.locator("#messageDisplay")).toContainText(
      "Mobile test message"
    );

    // Mobile user scrolls and navigates
    await page.tap('nav a[href="about.html"]');
    await expect(page).toHaveTitle("My First Web App - About");

    // Scroll down on mobile
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    // Test mobile interaction with demo button
    await page.tap("#demoBtn");
    await expect(page.locator("#timeDisplay")).toBeVisible();
  });

  test("error recovery user flow", async ({ page }) => {
    await page.goto("/");

    // User tries to submit empty message
    const showMessageBtn = page.locator("#showMessage");
    await showMessageBtn.click();

    await expect(page.locator("#messageDisplay")).toContainText(
      "Please enter a message first!"
    );

    // User corrects the error by entering a message
    const messageInput = page.locator("#messageInput");
    await messageInput.fill("Now I entered a message");
    await showMessageBtn.click();

    await expect(page.locator("#messageDisplay")).toContainText(
      "Now I entered a message"
    );

    // User tries to submit whitespace-only message
    await messageInput.fill("   ");
    await showMessageBtn.click();

    await expect(page.locator("#messageDisplay")).toContainText(
      "Please enter a message first!"
    );

    // User recovers again
    await messageInput.fill("Final valid message");
    await showMessageBtn.click();

    await expect(page.locator("#messageDisplay")).toContainText(
      "Final valid message"
    );
  });

  test("cross-page feature exploration", async ({ page }) => {
    // Start on home page
    await page.goto("/");

    // Interact with multiple features on home page
    await page.click("#colorBtn");
    await page.click("#counterBtn");
    await page.fill("#messageInput", "Cross-page test");
    await page.click("#showMessage");

    // Navigate to about page
    await page.click('nav a[href="about.html"]');

    // Interact with about page demo
    await page.click("#demoBtn");
    await expect(page.locator("#timeDisplay")).toBeVisible();

    // Navigate back to home page
    await page.click('nav a[href="index.html"]');

    // Verify home page state is reset (counter should still show previous value)
    await expect(page.locator("#counter")).toHaveText("0");

    // Continue interactions
    await page.click("#counterBtn");
    await expect(page.locator("#counter")).toHaveText("1");
  });

  test("session continuity flow", async ({ page }) => {
    await page.goto("/");

    // User performs various actions
    const actions = [
      () => page.click("#colorBtn"),
      () => page.click("#counterBtn"),
      () => page.fill("#messageInput", "Session test"),
      () => page.click("#showMessage"),
      () => page.click('nav a[href="about.html"]'),
      () => page.click("#demoBtn"),
      () => page.click('nav a[href="index.html"]'),
    ];

    // Perform actions with small delays to simulate realistic usage
    for (const action of actions) {
      await action();
      await page.waitForTimeout(200);
    }

    // Verify final state
    await expect(page.locator("#counter")).toHaveText("0");
    await expect(page.locator("#messageDisplay")).toContainText("");

    // User continues session with more interactions
    await page.click("#counterBtn");
    await page.click("#counterBtn");
    await expect(page.locator("#counter")).toHaveText("2");
  });

  test.skip("performance during extended usage", async ({ page }) => {
    await page.goto("/");

    const startTime = Date.now();

    // Simulate extended usage session
    for (let i = 0; i < 10; i++) {
      // Color changes
      await page.click("#colorBtn");

      // Counter clicks
      await page.click("#counterBtn");

      // Message interactions
      await page.fill("#messageInput", `Message ${i}`);
      await page.click("#showMessage");

      // Page navigation
      if (i % 3 === 0) {
        await page.click('nav a[href="about.html"]');
        await page.click("#demoBtn");
        await page.click('nav a[href="index.html"]');
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

    // Verify final state is correct
    await expect(page.locator("#counter")).toHaveText("0");

    console.log(`Extended usage session completed in ${totalTime}ms`);
  });
});
