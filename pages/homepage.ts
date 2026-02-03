import { Page, Locator } from '@playwright/test';
import { BasePage } from './basepage';

export class HomePage extends BasePage {
  private readonly completeNowButton: Locator;
  private readonly resumeButton: Locator;
  private readonly rolesIcon: Locator;

  constructor(page: Page) {
    super(page);
    this.completeNowButton = this.page
      .getByTestId('complete-now-button')
      .or(this.page.getByRole('button', { name: /complete now/i }))
      .or(this.page.locator('div:has-text("Complete Now")').first());

    this.resumeButton = this.page
      .getByTestId('my-resume-button')
      .or(this.page.getByRole('link', { name: 'My Resume', exact: true }))
      .or(this.page.locator('a[href="/resume"]'));

    this.rolesIcon = this.page
      .getByTestId('roles-link')
      .or(this.page.getByRole('link', { name: /roles/i }))
      .or(this.page.locator('a:has-text("Roles")'));
  }

  async waitForCompleteNowButton(): Promise<void> {
    this.log('Waiting for Complete Now button');
    await this.waitForVisible(this.completeNowButton, { timeout: 10000 });
  }

  async clickCompleteNowButton(): Promise<void> {
    await this.waitForCompleteNowButton();
    await this.safeClick(this.completeNowButton, 'Complete Now button');
  }

  async clickResumeButton(): Promise<void> {
    this.log('Looking for My Resume button');
    await this.safeClick(this.resumeButton, 'My Resume button', { timeout: 15000 });
    await this.waitForNavigation();
    this.log('My Resume button clicked successfully');
  }

  async clickRolesIcon(): Promise<void> {
    await this.safeClick(this.rolesIcon, 'Roles icon');
  }
}
