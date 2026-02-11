import { Page, Locator } from '@playwright/test';

export class AIStudentPage {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigateToStudentsTab(): Promise<void> {
    await this.page.waitForTimeout(1000);
    const studentsTab = this.page.getByText('Students', { exact: false })
      .or(this.page.getByRole('link', { name: /students/i }))
      .or(this.page.getByRole('tab', { name: /students/i }))
      .or(this.page.locator('[class*="menu"], [class*="nav"], [class*="sidebar"]').getByText('Students', { exact: false }));
    await this.clickElement(studentsTab.first());
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(2000);
  }

  async openBulkUploadForm(): Promise<void> {
    await this.page.waitForTimeout(1000);
    const bulkUploadButton = this.page.getByRole('button', { name: /bulk upload/i })
      .or(this.page.getByText('Bulk Upload', { exact: false }))
      .or(this.page.locator('button:has-text("Bulk Upload")'))
      .or(this.page.locator('button:has-text("Bulk")').filter({ hasText: /upload/i }))
      .or(this.page.locator('button').filter({ hasText: /bulk.*upload/i }));
    await this.clickElement(bulkUploadButton.first());
    await this.page.waitForTimeout(1000);
    await this.page.locator('input:visible').first().waitFor({ state: 'visible', timeout: 5000 });
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
