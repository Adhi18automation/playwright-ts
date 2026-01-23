import { Page } from '@playwright/test';
import { BasePage } from './basepage';

export class HomePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  private get completeNowButton() {
    return this.page.locator("//div[text()='Complete Now']");
  }

  private get resumeButton() {
    return this.page.locator("//div[text()='My Resume']");
  }

  async waitForCompleteNowButton(): Promise<void> {
    try {
      await this.completeNowButton.waitFor({ 
        state: 'visible', 
        timeout: 10000 
      });
    } catch (error) {
      throw new Error('Complete Now button was not found or not visible within 10 seconds');
    }
  }

  async clickCompleteNowButton(): Promise<void> {
    await this.waitForCompleteNowButton();
    
    const isVisible = await this.completeNowButton.isVisible();
    if (!isVisible) {
      throw new Error('Complete Now button is not visible');
    }
    
    await this.completeNowButton.click();
  }

  async clickResumeButton(): Promise<void> {
    try {
      await this.resumeButton.waitFor({ 
        state: 'visible', 
        timeout: 10000 
      });
      
      const isVisible = await this.resumeButton.isVisible();
      if (!isVisible) {
        throw new Error('My Resume button is not visible');
      }
      
      await this.resumeButton.click();
    } catch (error) {
      throw new Error('My Resume button was not found or not visible within 10 seconds');
    }
  }
}
