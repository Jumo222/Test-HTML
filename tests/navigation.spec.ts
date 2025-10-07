import { test, expect } from '@playwright/test';

test.describe('Navigation Tests', () => {
  test('should navigate between pages', async ({ page }) => {
    await page.goto('/');

    // Check initial page is home
    await expect(page).toHaveTitle('My First React Web App');
    await expect(page.locator('nav a.active')).toHaveText('Home');

    // Navigate to About page
    await page.click('nav a:has-text("About")');
    await expect(page).toHaveURL('/about');
    await expect(page.locator('nav a.active')).toHaveText('About');

    // Navigate to Calculation page
    await page.click('nav a:has-text("Calculation")');
    await expect(page).toHaveURL('/calculation');
    await expect(page.locator('nav a.active')).toHaveText('Calculation');

    // Navigate back to Home
    await page.click('nav a:has-text("Home")');
    await expect(page).toHaveURL('/');
    await expect(page.locator('nav a.active')).toHaveText('Home');
  });

  test('should navigate using internal links on home page', async ({ page }) => {
    await page.goto('/');

    // Test quick navigation links
    await page.click('a[href="#learn"]');
    await expect(page.locator('#learn')).toBeInViewport();

    await page.click('a[href="#interactive"]');
    await expect(page.locator('#interactive')).toBeInViewport();

    await page.click('a[href="#resources"]');
    await expect(page.locator('#resources')).toBeInViewport();

    await page.click('a[href="#contact"]');
    await expect(page.locator('#contact')).toBeInViewport();

    // Test back to top link
    await page.click('a[href="#top"]');
    await expect(page.locator('#top')).toBeInViewport();
  });

  test('should handle direct URL access', async ({ page }) => {
    // Test direct access to about page
    await page.goto('/about');
    await expect(page.locator('h1')).toHaveText('About This Web Application');

    // Test direct access to calculation page
    await page.goto('/calculation');
    await expect(page.locator('h1')).toContainText('Calculation Page');

    // Test direct access to home page
    await page.goto('/');
    await expect(page.locator('h1')).toHaveText('Welcome to My First Web Application!');
  });
});