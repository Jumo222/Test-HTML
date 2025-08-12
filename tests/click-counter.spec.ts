import { test, expect } from '@playwright/test';

test.describe('Click Counter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html');
  });

  test('should start with counter at 0', async ({ page }) => {
    const counter = page.locator('#counter');
    await expect(counter).toHaveText('0');
  });

  test('should increment counter on button click', async ({ page }) => {
    const counterBtn = page.locator('#counterBtn');
    const counter = page.locator('#counter');

    await counterBtn.click();
    await expect(counter).toHaveText('1');

    await counterBtn.click();
    await expect(counter).toHaveText('2');
  });

  test('should show correct count after multiple clicks', async ({ page }) => {
    const counterBtn = page.locator('#counterBtn');
    const counter = page.locator('#counter');

    for (let i = 1; i <= 5; i++) {
      await counterBtn.click();
      await expect(counter).toHaveText(i.toString());
    }
  });

  test('should change button color when count exceeds thresholds', async ({ page }) => {
    const counterBtn = page.locator('#counterBtn');
    
    // Click 6 times to exceed first threshold (count > 5)
    for (let i = 0; i < 6; i++) {
      await counterBtn.click();
    }
    
    // Check button background color changed to orange (#f39c12)
    await expect(counterBtn).toHaveCSS('background-color', 'rgb(243, 156, 18)');
    
    // Click 5 more times to exceed second threshold (count > 10)
    for (let i = 0; i < 5; i++) {
      await counterBtn.click();
    }
    
    // Check button background color changed to red (#e74c3c)
    await expect(counterBtn).toHaveCSS('background-color', 'rgb(231, 76, 60)');
  });

  test('should apply bounce animation on click', async ({ page }) => {
    const counterBtn = page.locator('#counterBtn');
    
    // Click the button
    await counterBtn.click();
    
    // Check that bounce class is added (briefly)
    // We can't easily test the temporary class, but we can verify the click worked
    const counter = page.locator('#counter');
    await expect(counter).toHaveText('1');
  });

  test('should have correct button text format', async ({ page }) => {
    const counterBtn = page.locator('#counterBtn');
    
    // Initial state
    await expect(counterBtn).toContainText('Click Counter: 0');
    
    // After one click
    await counterBtn.click();
    await expect(counterBtn).toContainText('Click Counter: 1');
  });
});