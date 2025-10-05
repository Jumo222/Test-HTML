import { test, expect } from "@playwright/test";

test.describe("About Page Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/about");
  });

  test("display current time on demo button click", async ({ page }) => {
    const demoBtn = page.locator('button:has-text("Show Current Time")');

    // Click demo button
    await demoBtn.click();

    // Verify time display is shown with inline styles (React component)
    const timeDisplay = page
      .locator("div")
      .filter({ hasText: /Current Date:/ })
      .first();
    await expect(timeDisplay).toBeVisible();
    await expect(timeDisplay).toContainText("Current Date:");
    await expect(timeDisplay).toContainText("Current Time:");

    // Verify the displayed time is reasonable (today's date)
    const currentYear = new Date().getFullYear().toString();
    await expect(timeDisplay).toContainText(currentYear);
  });

  test("display correct page content", async ({ page }) => {
    // Verify page title and header
    await expect(page).toHaveTitle("My First React Web App");
    await expect(page.locator("h1")).toHaveText("About This Web Application");

    // Verify technology explanations are present
    const techItems = page.locator(".tech-item");
    await expect(techItems).toHaveCount(3);

    // Verify HTML section
    const htmlSection = page.locator(
      '.tech-item:has(h3:text-is("HTML (HyperText Markup Language)"))'
    );
    await expect(htmlSection).toContainText("HyperText Markup Language");
    await expect(htmlSection).toContainText(
      "Semantic elements organize content meaningfully"
    );

    // Verify CSS section
    const cssSection = page.locator(
      '.tech-item:has(h3:text-is("CSS (Cascading Style Sheets)"))'
    );
    await expect(cssSection).toContainText("Cascading Style Sheets");
    await expect(cssSection).toContainText(
      "Responsive design adapts to different screen sizes"
    );

    // Verify JavaScript section
    const jsSection = page.locator('.tech-item:has(h3:text-is("JavaScript"))');
    await expect(jsSection).toContainText(
      "adds interactivity and dynamic behavior"
    );
    await expect(jsSection).toContainText("Event listeners respond to clicks");
  });

  test("display code example", async ({ page }) => {
    const codeExample = page.locator(".code-example pre code");

    // Verify code example is present and contains expected React/JavaScript
    await expect(codeExample).toBeVisible();
    await expect(codeExample).toContainText("showCurrentTime");
    await expect(codeExample).toContainText("new Date()");
    await expect(codeExample).toContainText("toLocaleTimeString()");
    await expect(codeExample).toContainText("setCurrentTime");
  });

  test("have working navigation from about page", async ({ page }) => {
    // Test navigation to home page
    await page.click('nav a:has-text("Home")');
    await expect(page).toHaveURL("/");

    // Navigate back to about
    await page.click('nav a:has-text("About")');
    await expect(page).toHaveURL("/about");
  });

  test("display footer information", async ({ page }) => {
    const footer = page.locator("footer");

    await expect(footer).toContainText("© 2025 My First Web App");
    await expect(footer).toContainText("Built for learning!");
  });

  test.skip("verify time display formatting", async ({ page }) => {
    const demoBtn = page.locator('button:has-text("Show Current Time")');

    await demoBtn.click();

    // Get the displayed content - wait for it to appear
    const timeDisplay = page
      .locator("div")
      .filter({ hasText: /Current Date:/ })
      .first();
    await expect(timeDisplay).toBeVisible();

    const timeContent = await timeDisplay.textContent();

    // Verify proper formatting (contain date and time labels)
    expect(timeContent).toMatch(/Current Date:.*\d+/);
    expect(timeContent).toMatch(/Current Time:.*\d+/);

    // Verify styling is applied (inline React styles) - wait a moment for styles to apply
    await page.waitForTimeout(100);
    const backgroundColor = await timeDisplay.evaluate(
      (el) => getComputedStyle(el).backgroundColor
    );
    expect(backgroundColor).toBe("rgb(36, 183, 151)");
  });

  test("verify demo section structure", async ({ page }) => {
    const demoSection = page.locator(".demo-section");

    await expect(demoSection).toBeVisible();
    await expect(demoSection.locator("h2")).toHaveText("Interactive Demo");
    await expect(demoSection.locator("p")).toContainText(
      "Click the button below to see JavaScript in action"
    );

    // Verify demo button is present and clickable
    const demoBtn = page.locator('button:has-text("Show Current Time")');
    await expect(demoBtn).toBeVisible();
    await expect(demoBtn).toHaveText("Show Current Time");
    await expect(demoBtn).toBeEnabled();
  });
});
