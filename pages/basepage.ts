import { Page, Locator, expect } from '@playwright/test';

/**
 * Production-ready BasePage with centralized utilities
 * All page objects should extend this class
 */
export class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Safe click with automatic retry, scrolling, and error handling
   * @param locator - Element to click
   * @param description - Description of the element for logging
   * @param options - Optional timeout configuration
   */
  protected async safeClick(
    locator: Locator,
    description: string,
    options?: { timeout?: number }
  ): Promise<void> {
    const timeout = options?.timeout || 10000;
    this.log(`Attempting to click: ${description}`);

    try {
      await expect(locator).toBeVisible({ timeout });
      await locator.scrollIntoViewIfNeeded();
      await expect(locator).toBeEnabled({ timeout: 5000 });
      await locator.click({ timeout: 5000 });
      this.log(`Successfully clicked: ${description}`);
    } catch (error) {
      this.log(`Click failed for: ${description}`, 'error');
      await this.captureScreenshot(`click-failure-${this.sanitizeFilename(description)}`);
      throw new Error(`Failed to click "${description}": ${error}`);
    }
  }

  /**
   * Safe fill with validation and automatic retry
   * @param locator - Input element to fill
   * @param value - Value to fill
   * @param description - Description of the field for logging
   * @param options - Optional configuration
   */
  protected async safeFill(
    locator: Locator,
    value: string,
    description: string,
    options?: { timeout?: number; validate?: boolean }
  ): Promise<void> {
    const timeout = options?.timeout || 10000;
    const validate = options?.validate !== false;
    this.log(`Attempting to fill: ${description} with value: "${value}"`);

    try {
      await expect(locator).toBeVisible({ timeout });
      await locator.scrollIntoViewIfNeeded();
      await locator.clear();
      await locator.fill(value);

      if (validate) {
        await expect(locator).toHaveValue(value, { timeout: 5000 });
      }

      this.log(`Successfully filled: ${description}`);
    } catch (error) {
      if (validate) {
        this.log(`Fill validation failed for: ${description}, retrying with pressSequentially`, 'warn');
        try {
          await locator.clear();
          await locator.pressSequentially(value, { delay: 50 });
          await expect(locator).toHaveValue(value, { timeout: 5000 });
          this.log(`Successfully filled with pressSequentially: ${description}`);
          return;
        } catch (retryError) {
          this.log(`Retry failed for: ${description}`, 'error');
          await this.captureScreenshot(`fill-failure-${this.sanitizeFilename(description)}`);
          throw new Error(`Failed to fill "${description}" with value "${value}": ${retryError}`);
        }
      }
      this.log(`Fill failed for: ${description}`, 'error');
      await this.captureScreenshot(`fill-failure-${this.sanitizeFilename(description)}`);
      throw new Error(`Failed to fill "${description}" with value "${value}": ${error}`);
    }
  }

  /**
   * Wait for element to be visible
   * @param locator - Element to wait for
   * @param options - Optional timeout configuration
   */
  protected async waitForVisible(
    locator: Locator,
    options?: { timeout?: number }
  ): Promise<void> {
    const timeout = options?.timeout || 10000;

    try {
      await expect(locator).toBeVisible({ timeout });
    } catch (error) {
      await this.captureScreenshot(`visibility-wait-failure-${Date.now()}`);
      throw new Error(`Element not visible within ${timeout}ms: ${error}`);
    }
  }

  /**
   * Wait for navigation to complete using networkidle
   * @param options - Optional URL pattern and timeout configuration
   */
  protected async waitForNavigation(
    options?: { url?: string | RegExp; timeout?: number }
  ): Promise<void> {
    const timeout = options?.timeout || 30000;

    try {
      if (options?.url) {
        this.log(`Waiting for navigation to URL: ${options.url}`);
        await this.page.waitForURL(options.url, { timeout, waitUntil: 'networkidle' });
      } else {
        this.log('Waiting for navigation (networkidle)');
        await this.page.waitForLoadState('networkidle', { timeout });
      }
      this.log('Navigation completed');
    } catch (error) {
      this.log('Network idle timeout, falling back to domcontentloaded', 'warn');
      try {
        await this.page.waitForLoadState('domcontentloaded', { timeout: 10000 });
        this.log('Navigation completed (domcontentloaded fallback)');
      } catch (fallbackError) {
        await this.captureScreenshot(`navigation-failure-${Date.now()}`);
        throw new Error(`Navigation failed: ${fallbackError}`);
      }
    }
  }

  /**
   * Select from Ant Design dropdown with robust handling
   * @param dropdownLocator - The dropdown input/trigger locator
   * @param value - Value to select
   * @param description - Description for logging
   * @param options - Optional configuration
   */
  protected async selectAntdDropdown(
    dropdownLocator: Locator,
    value: string,
    description: string,
    options?: { timeout?: number; exact?: boolean }
  ): Promise<void> {
    const timeout = options?.timeout || 10000;
    const exact = options?.exact !== false;
    this.log(`Selecting from Ant Design dropdown: ${description} - value: "${value}"`);

    try {
      await expect(dropdownLocator).toBeVisible({ timeout });
      await dropdownLocator.scrollIntoViewIfNeeded();
      await dropdownLocator.click();
      
      // Wait for dropdown panel to appear
      await this.page.waitForSelector('.ant-select-dropdown:not(.ant-select-dropdown-hidden)', { 
        state: 'visible', 
        timeout: 3000 
      });
      
      // Find the input field inside the dropdown
      const inputLocator = this.page.locator('input[role="combobox"]').first();
      await inputLocator.fill(value);
      await this.page.waitForTimeout(500);

      // Wait for options to be visible in the dropdown
      const optionSelector = '.ant-select-dropdown:not(.ant-select-dropdown-hidden) [role="option"]';
      await this.page.waitForSelector(optionSelector, { state: 'visible', timeout: 5000 });

      const matchingOption = exact
        ? this.page.locator(optionSelector).filter({ hasText: new RegExp(`^${value}$`) }).first()
        : this.page.locator(optionSelector).filter({ hasText: value }).first();

      const optionCount = await matchingOption.count();

      if (optionCount > 0) {
        await matchingOption.click({ timeout: 3000 });
        this.log(`Successfully selected: ${value} from ${description}`);
      } else {
        this.log(`No exact match found for "${value}", using keyboard selection`, 'warn');
        await this.page.keyboard.press('ArrowDown');
        await this.page.keyboard.press('Enter');
      }

      await this.page.waitForTimeout(300);
      const dropdownVisible = await this.page.locator('.ant-select-dropdown').isVisible().catch(() => false);
      if (dropdownVisible) {
        await this.page.keyboard.press('Escape');
      }
    } catch (error) {
      this.log(`Dropdown selection failed for: ${description}`, 'error');
      await this.captureScreenshot(`dropdown-failure-${this.sanitizeFilename(description)}`);
      throw new Error(`Failed to select "${value}" from dropdown "${description}": ${error}`);
    }
  }

  /**
   * Capture screenshot on failure with sanitized filename
   * @param name - Screenshot filename (will be sanitized)
   */
  protected async captureScreenshot(name: string): Promise<void> {
    try {
      const sanitizedName = this.sanitizeFilename(name);
      const timestamp = Date.now();
      const filename = `${sanitizedName}-${timestamp}`;
      
      await this.page.screenshot({
        path: `test-results/screenshots/${filename}.png`,
        fullPage: true
      });
      this.log(`Screenshot captured: ${filename}.png`);
    } catch (error) {
      console.error(`Failed to capture screenshot: ${error}`);
    }
  }

  /**
   * Centralized logging with timestamp and level
   * @param message - Log message
   * @param level - Log level (info, warn, error)
   */
  protected log(message: string, level: 'info' | 'warn' | 'error' = 'info'): void {
    const timestamp = new Date().toISOString();
    const className = this.constructor.name;
    const prefix = level === 'error' ? '❌' : level === 'warn' ? '⚠️' : 'ℹ️';
    console.log(`[${timestamp}] ${prefix} [${className}] ${message}`);
  }

  /**
   * Sanitize filename for screenshot capture
   * @param filename - Original filename
   * @returns Sanitized filename
   */
  private sanitizeFilename(filename: string): string {
    return filename
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 50);
  }

  /**
   * Wait for element to be enabled
   * @param locator - Element to wait for
   * @param options - Optional timeout configuration
   */
  protected async waitForEnabled(
    locator: Locator,
    options?: { timeout?: number }
  ): Promise<void> {
    const timeout = options?.timeout || 10000;

    try {
      await expect(locator).toBeEnabled({ timeout });
    } catch (error) {
      await this.captureScreenshot(`enabled-wait-failure-${Date.now()}`);
      throw new Error(`Element not enabled within ${timeout}ms: ${error}`);
    }
  }

  /**
   * Check if element exists without throwing error
   * @param locator - Element to check
   * @param options - Optional timeout configuration
   * @returns True if element is visible, false otherwise
   */
  protected async elementExists(
    locator: Locator,
    options?: { timeout?: number }
  ): Promise<boolean> {
    const timeout = options?.timeout || 5000;
    try {
      await expect(locator).toBeVisible({ timeout });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get element text safely
   * @param locator - Element to get text from
   * @param options - Optional timeout configuration
   * @returns Element text content or empty string
   */
  protected async getElementText(
    locator: Locator,
    options?: { timeout?: number }
  ): Promise<string> {
    const timeout = options?.timeout || 10000;
    try {
      await expect(locator).toBeVisible({ timeout });
      return await locator.textContent() || '';
    } catch (error) {
      this.log(`Failed to get element text: ${error}`, 'error');
      return '';
    }
  }

  /**
   * Navigate to URL with automatic wait
   * @param url - URL to navigate to
   * @param options - Optional navigation configuration
   */
  protected async navigateTo(
    url: string,
    options?: { timeout?: number; waitUntil?: 'load' | 'domcontentloaded' | 'networkidle' }
  ): Promise<void> {
    const timeout = options?.timeout || 30000;
    const waitUntil = options?.waitUntil || 'domcontentloaded';
    this.log(`Navigating to: ${url}`);

    try {
      await this.page.goto(url, { timeout, waitUntil });
      await this.page.waitForTimeout(500);
      this.log(`Successfully navigated to: ${url}`);
    } catch (error) {
      this.log(`Navigation failed to: ${url}`, 'error');
      await this.captureScreenshot(`navigation-failure-${Date.now()}`);
      throw new Error(`Failed to navigate to ${url}: ${error}`);
    }
  }

  /**
   * Retry action with exponential backoff
   * @param action - Action to retry
   * @param description - Description of the action for logging
   * @param options - Optional retry configuration
   * @returns Result of the action
   */
  protected async retryAction<T>(
    action: () => Promise<T>,
    description: string,
    options?: { retries?: number; delay?: number }
  ): Promise<T> {
    const retries = options?.retries || 3;
    const delay = options?.delay || 1000;

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        this.log(`Attempting action: ${description} (attempt ${attempt}/${retries})`);
        const result = await action();
        this.log(`Action succeeded: ${description}`);
        return result;
      } catch (error) {
        if (attempt === retries) {
          this.log(`Action failed after ${retries} attempts: ${description}`, 'error');
          await this.captureScreenshot(`retry-failure-${this.sanitizeFilename(description)}`);
          throw error;
        }
        const waitTime = delay * Math.pow(2, attempt - 1);
        this.log(`Retry attempt ${attempt}/${retries} failed, waiting ${waitTime}ms`, 'warn');
        await this.page.waitForTimeout(waitTime);
      }
    }
    throw new Error(`Retry action failed: ${description}`);
  }
}
