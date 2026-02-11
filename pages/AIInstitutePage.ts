import { Page, Locator } from '@playwright/test';

export class AIInstitutePage {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async searchCollege(collegeName: string): Promise<void> {
    const searchInput = this.page.locator('input[type="search"]').first()
      .or(this.page.locator('input[type="text"]').first());
    await searchInput.fill(collegeName);
    await this.page.waitForTimeout(1500);
    await this.page.getByText(collegeName, { exact: false }).waitFor({ state: 'visible', timeout: 10000 });
  }

  async clickViewButton(collegeName: string): Promise<void> {
    const viewButton = this.page.locator(`tr:has-text("${collegeName}") button:has-text("View")`).first()
      .or(this.page.getByRole('button', { name: /view/i }).first());
    await this.clickElement(viewButton);
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(2000);
  }

  async clickCheckInIfPresent(): Promise<void> {
    try {
      await this.page.waitForTimeout(500);
      const checkinElement = this.page.getByText(/check-?in/i)
        .or(this.page.getByRole('link', { name: /check-?in/i }))
        .or(this.page.getByRole('button', { name: /check-?in/i }))
        .or(this.page.locator('[class*="menu"], [class*="nav"], [class*="sidebar"]').getByText(/check-?in/i));
      
      const isVisible = await checkinElement.first().isVisible({ timeout: 2000 }).catch(() => false);
      if (isVisible) {
        await this.clickElement(checkinElement.first());
        await this.page.waitForTimeout(500);
      }
    } catch {
    }
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
