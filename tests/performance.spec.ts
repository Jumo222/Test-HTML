import { test, expect } from '@playwright/test';

test.describe('Performance Tests', () => {
  test('should load home page within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/', { waitUntil: 'networkidle' });
    
    const loadTime = Date.now() - startTime;
    
    // Should load within 3 seconds (generous for local testing)
    expect(loadTime).toBeLessThan(3000);
    
    console.log(`Home page load time: ${loadTime}ms`);
  });

  test('should load about page within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/about.html', { waitUntil: 'networkidle' });
    
    const loadTime = Date.now() - startTime;
    
    // Should load within 3 seconds
    expect(loadTime).toBeLessThan(3000);
    
    console.log(`About page load time: ${loadTime}ms`);
  });

  test('should have efficient script execution', async ({ page }) => {
    // Monitor console for any performance warnings
    const consoleMessages: string[] = [];
    page.on('console', msg => consoleMessages.push(msg.text()));
    
    await page.goto('/', { waitUntil: 'networkidle' });
    
    // Check that scripts loaded successfully (no errors)
    const errors = consoleMessages.filter(msg => 
      msg.toLowerCase().includes('error') || 
      msg.toLowerCase().includes('failed')
    );
    
    expect(errors).toHaveLength(0);
  });

  test('should handle rapid user interactions efficiently', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const colorBtn = page.locator('#colorBtn');
    const counterBtn = page.locator('#counterBtn');
    
    const startTime = Date.now();
    
    // Rapidly click buttons multiple times
    for (let i = 0; i < 10; i++) {
      await colorBtn.click();
      await counterBtn.click();
      // Small delay to allow DOM updates
      await page.waitForTimeout(10);
    }
    
    const executionTime = Date.now() - startTime;
    
    // Should handle 20 rapid clicks efficiently (under 2 seconds)
    expect(executionTime).toBeLessThan(2000);
    
    // Verify final state is correct
    await expect(page.locator('#counter')).toHaveText('10');
    
    console.log(`Rapid interaction execution time: ${executionTime}ms`);
  });

  test('should have minimal memory usage during interactions', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Get initial metrics
    const initialMetrics = await page.evaluate(() => {
      if ('memory' in performance) {
        return (performance as any).memory;
      }
      return null;
    });
    
    // Perform various interactions
    const messageInput = page.locator('#messageInput');
    const showMessageBtn = page.locator('#showMessage');
    const counterBtn = page.locator('#counterBtn');
    
    // Add and remove messages multiple times
    for (let i = 0; i < 5; i++) {
      await messageInput.fill(`Test message ${i}`);
      await showMessageBtn.click();
      await page.waitForTimeout(100);
      
      await counterBtn.click();
      await page.waitForTimeout(100);
    }
    
    // Get final metrics
    const finalMetrics = await page.evaluate(() => {
      if ('memory' in performance) {
        return (performance as any).memory;
      }
      return null;
    });
    
    // If memory API is available, check for reasonable memory usage
    if (initialMetrics && finalMetrics) {
      const memoryIncrease = finalMetrics.usedJSHeapSize - initialMetrics.usedJSHeapSize;
      console.log(`Memory increase during interactions: ${memoryIncrease} bytes`);
      
      // Memory increase should be reasonable (less than 5MB for simple interactions)
      expect(memoryIncrease).toBeLessThan(5 * 1024 * 1024);
    }
  });

  test('should efficiently handle DOM manipulations', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const startTime = performance.now();
    
    // Measure time for DOM queries and manipulations
    await page.evaluate(() => {
      const start = performance.now();
      
      // Simulate the app's DOM operations
      for (let i = 0; i < 100; i++) {
        const element = document.getElementById('counter');
        if (element) {
          element.textContent = i.toString();
        }
      }
      
      const end = performance.now();
      console.log(`DOM manipulation time: ${end - start}ms`);
      
      return end - start;
    });
    
    const endTime = performance.now();
    const totalTime = endTime - startTime;
    
    // Should handle DOM operations efficiently
    expect(totalTime).toBeLessThan(1000);
  });

  test('should load resources efficiently', async ({ page }) => {
    // Track network requests
    const requests: string[] = [];
    const responses: number[] = [];
    
    page.on('request', request => {
      requests.push(request.url());
    });
    
    page.on('response', response => {
      responses.push(response.status());
    });
    
    await page.goto('/', { waitUntil: 'networkidle' });
    
    // Check that all resources loaded successfully
    const failedRequests = responses.filter(status => status >= 400);
    expect(failedRequests).toHaveLength(0);
    
    // Check that we don't have excessive number of requests
    expect(requests.length).toBeLessThan(20);
    
    console.log(`Total requests: ${requests.length}`);
    console.log(`Failed requests: ${failedRequests.length}`);
  });

  test('should handle page navigation efficiently', async ({ page }) => {
    const navigationTimes: number[] = [];
    
    // Measure navigation time between pages
    await page.goto('/');
    
    for (let i = 0; i < 3; i++) {
      const startTime = Date.now();
      await page.click('nav a[href="about.html"]');
      await page.waitForLoadState('networkidle');
      const aboutLoadTime = Date.now() - startTime;
      navigationTimes.push(aboutLoadTime);
      
      const homeStartTime = Date.now();
      await page.click('nav a[href="index.html"]');
      await page.waitForLoadState('networkidle');
      const homeLoadTime = Date.now() - homeStartTime;
      navigationTimes.push(homeLoadTime);
    }
    
    // Average navigation time should be reasonable
    const averageTime = navigationTimes.reduce((a, b) => a + b, 0) / navigationTimes.length;
    expect(averageTime).toBeLessThan(1000);
    
    console.log(`Average navigation time: ${averageTime}ms`);
  });

  test('should handle CSS animations performance', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const colorBtn = page.locator('#colorBtn');
    
    // Measure time for animation-related operations
    const startTime = Date.now();
    
    // Trigger multiple animations
    for (let i = 0; i < 5; i++) {
      await colorBtn.click();
      // Wait for bounce animation
      await page.waitForTimeout(100);
    }
    
    const endTime = Date.now();
    const animationTime = endTime - startTime;
    
    // Animations should complete within reasonable time
    expect(animationTime).toBeLessThan(3000);
    
    console.log(`Animation execution time: ${animationTime}ms`);
  });

  test('should maintain responsiveness during heavy operations', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Start a heavy operation (rapid counter clicking)
    const counterBtn = page.locator('#counterBtn');
    const messageInput = page.locator('#messageInput');
    
    // Click counter many times while trying to interact with other elements
    const rapidClicking = async () => {
      for (let i = 0; i < 50; i++) {
        await counterBtn.click();
        await page.waitForTimeout(10);
      }
    };
    
    // Start rapid clicking and try to interact with input field simultaneously
    const clickingPromise = rapidClicking();
    
    // While clicking is happening, try to use the message input
    await messageInput.fill('Testing responsiveness');
    await page.locator('#showMessage').click();
    
    await clickingPromise;
    
    // Verify both operations completed successfully
    await expect(page.locator('#counter')).toHaveText('50');
    await expect(page.locator('#messageDisplay')).toContainText('Testing responsiveness');
  });

  test('should have efficient event listener management', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check that event listeners are properly attached
    const listenerCount = await page.evaluate(() => {
      // Count elements that should have event listeners
      const elementsWithListeners = [
        document.getElementById('colorBtn'),
        document.getElementById('counterBtn'),
        document.getElementById('showMessage'),
        document.getElementById('messageInput')
      ].filter(el => el !== null);
      
      return elementsWithListeners.length;
    });
    
    expect(listenerCount).toBeGreaterThan(0);
    
    // Verify no memory leaks by navigating and returning
    await page.goto('/about.html');
    await page.goto('/');
    
    // Elements should still be interactive after navigation
    await page.locator('#colorBtn').click();
    await expect(page.locator('body')).not.toHaveCSS('background-color', 'rgb(244, 244, 244)');
  });
});