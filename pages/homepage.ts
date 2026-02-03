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

  private get resumeButtonAlt() {
    return this.page.locator("//button[contains(text(),'My Resume')]");
  }

  private get resumeButtonAlt2() {
    return this.page.locator("//a[contains(text(),'My Resume')]");
  }

  private get resumeButtonAlt3() {
    return this.page.locator("[data-testid='my-resume-button']");
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
      console.log('Looking for My Resume button...');
      
      const resumeButton = this.page.locator("//div[text()='My Resume']");
      const count = await resumeButton.count();
      console.log(`My Resume button found: ${count} elements`);
      
      if (count === 0) {
        throw new Error('My Resume button not found with locator //div[text()="My Resume"]');
      }
      
      // Wait for the button to be visible
      await resumeButton.first().waitFor({ state: 'visible', timeout: 15000 });
      const isVisible = await resumeButton.first().isVisible();
      console.log(`My Resume button visibility: ${isVisible}`);
      
      if (!isVisible) {
        throw new Error('My Resume button is not visible');
      }
      
      console.log('Clicking My Resume button...');
      await resumeButton.first().click();
      
      // Wait for navigation after clicking
      console.log('Waiting for page to stabilize after clicking My Resume button...');
      await this.page.waitForTimeout(3000);
      
      console.log('My Resume button clicked successfully');
    } catch (error) {
      console.error('Error clicking My Resume button:', error);
      throw new Error('My Resume button was not found or not clickable');
    }
  }

    private get rolesIcon() {
    return this.page.locator("//a[normalize-space()='Roles']");
  }

  async clickRolesIcon(): Promise<void> {
    await this.rolesIcon.click();
  }
 
}
