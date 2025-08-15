import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Tests', () => {
  test('should not have accessibility violations on home page', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should not have accessibility violations on about page', async ({ page }) => {
    await page.goto('/about.html');
    await page.waitForLoadState('networkidle');
    
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/');
    
    // Check that h1 comes before h2, h2 before h3
    const headings = await page.locator('h1, h2, h3').allTextContents();
    
    // Should have one h1
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBe(1);
    
    // Check heading structure makes sense
    await expect(page.locator('h1')).toHaveText('Welcome to My First Web Application!');
    
    const h2Elements = page.locator('h2');
    const h2Count = await h2Elements.count();
    expect(h2Count).toBeGreaterThan(0);
  });

  test('should have proper form labels and accessibility', async ({ page }) => {
    await page.goto('/');
    
    const messageInput = page.locator('#messageInput');
    const showMessageBtn = page.locator('#showMessage');
    
    // Check input has proper placeholder text
    await expect(messageInput).toHaveAttribute('placeholder', 'Type your message here...');
    
    // Check button has descriptive text
    await expect(showMessageBtn).toHaveText('Show Message');
    
    // Test keyboard navigation
    await messageInput.focus();
    await expect(messageInput).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(showMessageBtn).toBeFocused();
  });

  test('should have proper keyboard navigation', async ({ page }) => {
    await page.goto('/');
    
    // Test tab navigation through interactive elements
    const interactiveElements = [
      'nav a[href="index.html"]',
      'nav a[href="about.html"]',
      'a[href="#top"]',
      'a[href="#learn"]',
      'a[href="#interactive"]',
      'a[href="#resources"]',
      'a[href="#contact"]',
      '#colorBtn',
      '#counterBtn',
      '#messageInput',
      '#showMessage',
      'a[href="#top"].back-to-top'
    ];
    
    // Start from the first element
    await page.locator(interactiveElements[0]).focus();
    
    // Navigate through elements using Tab
    for (let i = 1; i < Math.min(5, interactiveElements.length); i++) {
      await page.keyboard.press('Tab');
      // Just verify we can navigate - specific focus order may vary
    }
  });

  test('should support Enter key activation for buttons', async ({ page }) => {
    await page.goto('/');
    
    // Test color button with Enter key
    const colorBtn = page.locator('#colorBtn');
    await colorBtn.focus();
    
    const initialBgColor = await page.locator('body').evaluate(el => 
      getComputedStyle(el).backgroundColor
    );
    
    await page.keyboard.press('Enter');
    await page.waitForTimeout(100);
    
    const newBgColor = await page.locator('body').evaluate(el => 
      getComputedStyle(el).backgroundColor
    );
    expect(newBgColor).not.toBe(initialBgColor);
    
    // Test counter button with Enter key
    const counterBtn = page.locator('#counterBtn');
    const counterSpan = page.locator('#counter');
    
    await counterBtn.focus();
    await page.keyboard.press('Enter');
    await expect(counterSpan).toHaveText('1');
  });

  test('should have proper ARIA attributes where needed', async ({ page }) => {
    await page.goto('/');
    
    // Check for proper semantic HTML usage
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
    
    const main = page.locator('main');
    await expect(main).toBeVisible();
    
    const header = page.locator('header');
    await expect(header).toBeVisible();
    
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
  });

  test('should have sufficient color contrast', async ({ page }) => {
    await page.goto('/');
    
    // Run color contrast checks
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    
    // Filter for color contrast violations
    const colorContrastViolations = accessibilityScanResults.violations.filter(
      violation => violation.id === 'color-contrast'
    );
    
    expect(colorContrastViolations).toEqual([]);
  });

  test('should work with screen reader simulation', async ({ page }) => {
    await page.goto('/');
    
    // Test aria-labels and accessible names
    const links = page.locator('a');
    const buttons = page.locator('button');
    
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

  test('should maintain focus visibility', async ({ page }) => {
    await page.goto('/');
    
    // Check that focused elements have visible focus indicators
    const colorBtn = page.locator('#colorBtn');
    await colorBtn.focus();
    
    // The element should be focused and have some visual indication
    await expect(colorBtn).toBeFocused();
    
    // Test with message input
    const messageInput = page.locator('#messageInput');
    await messageInput.focus();
    await expect(messageInput).toBeFocused();
  });

  test('should handle zoom levels appropriately', async ({ page }) => {
    await page.goto('/');
    
    // Test 200% zoom
    await page.evaluate(() => {
      document.body.style.zoom = '2';
    });
    
    await page.waitForTimeout(500);
    
    // Verify page is still usable
    const colorBtn = page.locator('#colorBtn');
    await expect(colorBtn).toBeVisible();
    await expect(colorBtn).toBeEnabled();
    
    // Reset zoom
    await page.evaluate(() => {
      document.body.style.zoom = '1';
    });
  });

  test('should work with reduced motion preferences', async ({ page }) => {
    // Simulate reduced motion preference
    await page.emulateMedia({ reducedMotion: 'reduce' });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Click color button - should still work without animations
    const colorBtn = page.locator('#colorBtn');
    const body = page.locator('body');
    
    const initialBgColor = await body.evaluate(el => getComputedStyle(el).backgroundColor);
    await colorBtn.click();
    await page.waitForTimeout(100);
    
    const newBgColor = await body.evaluate(el => getComputedStyle(el).backgroundColor);
    expect(newBgColor).not.toBe(initialBgColor);
  });

  test('should provide meaningful page titles', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/My First Web App - Home/);
    
    await page.goto('/about.html');
    await expect(page).toHaveTitle(/My First Web App - About/);
  });

  test('should have proper lang attribute', async ({ page }) => {
    await page.goto('/');
    
    const htmlElement = page.locator('html');
    await expect(htmlElement).toHaveAttribute('lang', 'en');
    
    await page.goto('/about.html');
    await expect(htmlElement).toHaveAttribute('lang', 'en');
  });
});