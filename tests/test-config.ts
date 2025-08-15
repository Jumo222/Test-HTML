// Test configuration and shared utilities

export const TEST_CONFIG = {
  // Timeouts
  pageLoadTimeout: 30000,
  animationTimeout: 1000,
  shortTimeout: 500,
  
  // Test data
  testMessages: [
    'Test message',
    'Hello, World!',
    'This is a longer message to test input handling',
    '123 !@# Special characters',
    'Unicode: 😀 🎉 ✨'
  ],
  
  // Viewports
  viewports: {
    mobile: { width: 375, height: 667 },
    tablet: { width: 768, height: 1024 },
    desktop: { width: 1200, height: 800 },
    largeDesktop: { width: 1920, height: 1080 }
  },
  
  // Color values (expected CSS colors)
  colors: {
    backgrounds: [
      'rgb(244, 244, 244)', // #f4f4f4
      'rgb(232, 245, 232)', // #e8f5e8
      'rgb(255, 242, 232)', // #fff2e8
      'rgb(240, 232, 255)', // #f0e8ff
      'rgb(232, 244, 253)'  // #e8f4fd
    ],
    counterButton: {
      default: 'rgba(0, 0, 0, 0)', // transparent
      orange: 'rgb(243, 156, 18)',  // #f39c12
      red: 'rgb(231, 76, 60)'       // #e74c3c
    },
    messageDisplay: {
      success: 'rgb(232, 246, 243)', // #e8f6f3
      error: 'rgb(255, 232, 232)'    // #ffe8e8
    }
  },
  
  // URLs
  baseUrls: {
    home: '/',
    about: '/about.html'
  }
};

// Utility functions for tests
export class TestUtils {
  static async waitForAnimation(page: any, timeout: number = TEST_CONFIG.animationTimeout) {
    await page.waitForTimeout(timeout);
  }
  
  static async waitForPageLoad(page: any) {
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(TEST_CONFIG.shortTimeout);
  }
  
  static async performMultipleClicks(page: any, selector: string, count: number, delay: number = 50) {
    for (let i = 0; i < count; i++) {
      await page.click(selector);
      if (delay > 0) {
        await page.waitForTimeout(delay);
      }
    }
  }
  
  static async getComputedStyle(page: any, selector: string, property: string) {
    return await page.locator(selector).evaluate((el: Element, prop: string) => 
      getComputedStyle(el).getPropertyValue(prop), property
    );
  }
  
  static async scrollToElement(page: any, selector: string) {
    await page.locator(selector).scrollIntoViewIfNeeded();
  }
  
  static generateRandomMessage(length: number = 20): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 ';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result.trim();
  }
  
  static async takeElementScreenshot(page: any, selector: string, name: string) {
    await page.locator(selector).screenshot({ path: `test-results/${name}.png` });
  }
  
  static async mockDate(page: any, date: string = '2025-01-15T12:00:00.000Z') {
    await page.addInitScript((mockDate: string) => {
      const fixedDate = new Date(mockDate);
      // @ts-ignore
      Date = class extends Date {
        constructor(...args: any[]) {
          if (args.length === 0) {
            super(fixedDate);
          } else {
            super(...args);
          }
        }
        
        static now() {
          return fixedDate.getTime();
        }
      };
    }, date);
  }
}

// Page Object Model classes
export class HomePage {
  constructor(private page: any) {}
  
  async goto() {
    await this.page.goto(TEST_CONFIG.baseUrls.home);
    await TestUtils.waitForPageLoad(this.page);
  }
  
  async clickColorButton() {
    await this.page.click('#colorBtn');
    await TestUtils.waitForAnimation(this.page, 100);
  }
  
  async clickCounter(times: number = 1) {
    await TestUtils.performMultipleClicks(this.page, '#counterBtn', times);
  }
  
  async sendMessage(message: string) {
    await this.page.fill('#messageInput', message);
    await this.page.click('#showMessage');
    await TestUtils.waitForAnimation(this.page, 200);
  }
  
  async sendMessageWithEnter(message: string) {
    await this.page.fill('#messageInput', message);
    await this.page.press('#messageInput', 'Enter');
    await TestUtils.waitForAnimation(this.page, 200);
  }
  
  async getCounterValue(): Promise<string> {
    return await this.page.locator('#counter').textContent();
  }
  
  async getMessageDisplay(): Promise<string> {
    return await this.page.locator('#messageDisplay').textContent();
  }
  
  async getBackgroundColor(): Promise<string> {
    return await TestUtils.getComputedStyle(this.page, 'body', 'background-color');
  }
  
  async navigateToAbout() {
    await this.page.click('nav a[href="about.html"]');
    await TestUtils.waitForPageLoad(this.page);
  }
}

export class AboutPage {
  constructor(private page: any) {}
  
  async goto() {
    await this.page.goto(TEST_CONFIG.baseUrls.about);
    await TestUtils.waitForPageLoad(this.page);
  }
  
  async clickTimeDemo() {
    await this.page.click('#demoBtn');
    await TestUtils.waitForAnimation(this.page, 200);
  }
  
  async getTimeDisplay(): Promise<string> {
    return await this.page.locator('#timeDisplay').textContent();
  }
  
  async navigateToHome() {
    await this.page.click('nav a[href="index.html"]');
    await TestUtils.waitForPageLoad(this.page);
  }
}

// Test fixtures and data
export const TEST_SCENARIOS = {
  counterColorThresholds: [
    { clicks: 5, expectedColor: 'default' },
    { clicks: 6, expectedColor: 'orange' },
    { clicks: 11, expectedColor: 'red' }
  ],
  
  messageValidationCases: [
    { input: '', expectedError: true },
    { input: '   ', expectedError: true },
    { input: 'Valid message', expectedError: false },
    { input: '123!@#', expectedError: false }
  ],
  
  navigationPaths: [
    { from: 'home', to: 'about', selector: 'nav a[href="about.html"]' },
    { from: 'about', to: 'home', selector: 'nav a[href="index.html"]' }
  ]
};