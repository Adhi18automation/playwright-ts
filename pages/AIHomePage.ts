import { Page, Locator } from '@playwright/test';

export class AIHomePage {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigateToInstitutes(): Promise<void> {
    await this.page.waitForTimeout(2000);
    const institutesTab = this.page.getByText('Institutes', { exact: false }).first();
    await this.clickElement(institutesTab);
    await this.page.waitForTimeout(1000);
  }

  private async clickElement(locator: Locator): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout: 10000 });
    await locator.scrollIntoViewIfNeeded();
    try {
      await locator.click({ timeout: 2000 });
    } catch {
      await locator.click({ force: true });
    }
  }
}
