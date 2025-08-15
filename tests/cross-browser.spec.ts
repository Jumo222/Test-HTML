import { test, expect } from '@playwright/test';

test.describe('Cross-Browser Compatibility Tests', () => {
  test('should work consistently across browsers', async ({ page, browserName }) => {
    await page.goto('/');
    
    console.log(`Testing on ${browserName}`);
    
    // Test basic functionality works the same across browsers
    const colorBtn = page.locator('#colorBtn');
    const body = page.locator('body');
    
    const initialBgColor = await body.evaluate(el => getComputedStyle(el).backgroundColor);
    await colorBtn.click();
    await page.waitForTimeout(100);
    
    const newBgColor = await body.evaluate(el => getComputedStyle(el).backgroundColor);
    expect(newBgColor).not.toBe(initialBgColor);
    
    // Test counter functionality
    const counterBtn = page.locator('#counterBtn');
    const counterSpan = page.locator('#counter');
    
    await counterBtn.click();
    await expect(counterSpan).toHaveText('1');
    
    // Test message functionality
    const messageInput = page.locator('#messageInput');
    const showMessageBtn = page.locator('#showMessage');
    const messageDisplay = page.locator('#messageDisplay');
    
    await messageInput.fill('Cross-browser test');
    await showMessageBtn.click();
    await expect(messageDisplay).toContainText('Cross-browser test');
  });

  test('should handle CSS features consistently', async ({ page, browserName }) => {
    await page.goto('/');
    
    // Test CSS transitions and animations work
    const colorBtn = page.locator('#colorBtn');
    await colorBtn.click();
    
    // Check that bounce class is applied (animation support)
    await expect(colorBtn).toHaveClass(/bounce/);
    
    // Test CSS transforms on hover (for feature cards)
    const featureCards = page.locator('.feature');
    if (await featureCards.count() > 0) {
      const firstCard = featureCards.first();
      await firstCard.hover();
      
      // The transform should be applied
      const transform = await firstCard.evaluate(el => getComputedStyle(el).transform);
      expect(transform).not.toBe('none');
    }
  });

  test('should support modern JavaScript features', async ({ page, browserName }) => {
    await page.goto('/');
    
    // Test that TypeScript compiled JavaScript works
    // This tests arrow functions, const/let, template literals, etc.
    const consoleMessages: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'log') {
        consoleMessages.push(msg.text());
      }
    });
    
    await page.reload();
    await page.waitForTimeout(500);
    
    // Should have console messages from the script
    expect(consoleMessages.length).toBeGreaterThan(0);
    
    // No JavaScript errors should occur
    const errors = consoleMessages.filter(msg => 
      msg.toLowerCase().includes('error') || 
      msg.toLowerCase().includes('uncaught')
    );
    expect(errors).toHaveLength(0);
  });

  test('should handle DOM manipulation consistently', async ({ page, browserName }) => {
    await page.goto('/');
    
    // Test element selection and manipulation
    const messageInput = page.locator('#messageInput');
    const showMessageBtn = page.locator('#showMessage');
    const messageDisplay = page.locator('#messageDisplay');
    
    // Test DOM content modification
    await messageInput.fill('DOM test message');
    await showMessageBtn.click();
    
    // Check innerHTML was set correctly
    const displayContent = await messageDisplay.innerHTML();
    expect(displayContent).toContain('DOM test message');
    
    // Test style manipulation
    const backgroundColor = await messageDisplay.evaluate(el => 
      getComputedStyle(el).backgroundColor
    );
    expect(backgroundColor).toBe('rgb(232, 246, 243)');
  });

  test('should handle event listeners consistently', async ({ page, browserName }) => {
    await page.goto('/');
    
    // Test click events
    const counterBtn = page.locator('#counterBtn');
    const counterSpan = page.locator('#counter');
    
    for (let i = 1; i <= 3; i++) {
      await counterBtn.click();
      await expect(counterSpan).toHaveText(i.toString());
    }
    
    // Test keyboard events
    const messageInput = page.locator('#messageInput');
    await messageInput.fill('Keyboard test');
    await messageInput.press('Enter');
    
    await expect(page.locator('#messageDisplay')).toContainText('Keyboard test');
    
    // Test hover events (mouseover/mouseout)
    const featureCards = page.locator('.feature');
    if (await featureCards.count() > 0) {
      const firstCard = featureCards.first();
      await firstCard.hover();
      
      // Border color should change on hover
      const borderColor = await firstCard.evaluate(el => 
        getComputedStyle(el).borderColor
      );
      expect(borderColor).toContain('rgb(52, 152, 219)'); // #3498db
    }
  });

  test('should render fonts and typography consistently', async ({ page, browserName }) => {
    await page.goto('/');
    
    // Check that text is rendered properly
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
    
    const headingText = await heading.textContent();
    expect(headingText).toBe('Welcome to My First Web Application!');
    
    // Check font loading (basic check)
    const computedStyle = await heading.evaluate(el => {
      const styles = getComputedStyle(el);
      return {
        fontFamily: styles.fontFamily,
        fontSize: styles.fontSize,
        fontWeight: styles.fontWeight
      };
    });
    
    expect(computedStyle.fontFamily).toBeTruthy();
    expect(computedStyle.fontSize).toBeTruthy();
  });

  test('should handle responsive design consistently', async ({ page, browserName }) => {
    // Test desktop viewport
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.goto('/');
    
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
    
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.reload();
    await expect(nav).toBeVisible();
    
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    await expect(nav).toBeVisible();
    
    // All interactive elements should remain functional
    await page.click('#colorBtn');
    await page.click('#counterBtn');
    await expect(page.locator('#counter')).toHaveText('1');
  });

  test('should handle form inputs consistently', async ({ page, browserName }) => {
    await page.goto('/');
    
    const messageInput = page.locator('#messageInput');
    
    // Test text input
    await messageInput.fill('Browser compatibility test');
    const inputValue = await messageInput.inputValue();
    expect(inputValue).toBe('Browser compatibility test');
    
    // Test input clearing
    await messageInput.clear();
    const clearedValue = await messageInput.inputValue();
    expect(clearedValue).toBe('');
    
    // Test placeholder attribute
    const placeholder = await messageInput.getAttribute('placeholder');
    expect(placeholder).toBe('Type your message here...');
  });

  test('should support date/time functionality consistently', async ({ page, browserName }) => {
    await page.goto('/about.html');
    
    const demoBtn = page.locator('#demoBtn');
    const timeDisplay = page.locator('#timeDisplay');
    
    await demoBtn.click();
    
    // Check that date object creation and formatting works
    await expect(timeDisplay).toBeVisible();
    const timeContent = await timeDisplay.textContent();
    
    // Should contain current year and time formatting
    const currentYear = new Date().getFullYear().toString();
    expect(timeContent).toContain(currentYear);
    expect(timeContent).toContain('Current Date:');
    expect(timeContent).toContain('Current Time:');
  });

  test('should handle CSS Grid/Flexbox consistently', async ({ page, browserName }) => {
    await page.goto('/');
    
    // Test feature cards layout (should use flexbox or grid)
    const featuresContainer = page.locator('.features');
    const features = page.locator('.feature');
    
    await expect(featuresContainer).toBeVisible();
    const featureCount = await features.count();
    expect(featureCount).toBe(3);
    
    // All feature cards should be visible and properly laid out
    for (let i = 0; i < featureCount; i++) {
      await expect(features.nth(i)).toBeVisible();
    }
  });

  test('should handle CSS custom properties consistently', async ({ page, browserName }) => {
    await page.goto('/');
    
    // Test that CSS custom properties (CSS variables) work if used
    const body = page.locator('body');
    
    // Check that styles are applied correctly
    const backgroundColor = await body.evaluate(el => 
      getComputedStyle(el).backgroundColor
    );
    
    // Should have initial background color
    expect(backgroundColor).toBeTruthy();
    
    // Test color changing still works (relies on CSS/JS interaction)
    await page.click('#colorBtn');
    await page.waitForTimeout(100);
    
    const newBackgroundColor = await body.evaluate(el => 
      getComputedStyle(el).backgroundColor
    );
    
    expect(newBackgroundColor).not.toBe(backgroundColor);
  });
});