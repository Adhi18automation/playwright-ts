import { Page, expect } from '@playwright/test';
import { BasePage } from './basepage';

export class InstitutePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // ================= SEARCH INSTITUTE =================
  // ✅ Playwright-native & stable
  private get searchInstituteInput() {
    return this.page.getByPlaceholder('Search by Institute');
  }

  async searchInstitute(instituteName: string): Promise<void> {
    console.log(`Searching for institute: "${instituteName}"`);

    await this.searchInstituteInput.waitFor({ state: 'visible' });
    await this.searchInstituteInput.fill(''); // clear safely
    await this.searchInstituteInput.fill(instituteName);

    console.log(`Search completed for institute: "${instituteName}"`);
  }

  // ================= VERIFY SEARCH RESULTS =================
  async verifySearchResultsVisible(): Promise<void> {
    console.log('Verifying institute search results...');

    // Wait until at least one data row is visible (skip header row)
    await expect(
      this.page.getByRole('row').nth(1)
    ).toBeVisible({ timeout: 15000 });

    console.log('Search results are visible');
  }

  // ================= VIEW BUTTON =================
  // ✅ Correct locator based on DOM:
  // <button><span>View</span></button>
  private get viewButton() {
    return this.page.getByRole('button', { name: 'View' });
  }

  // ================= CLICK VIEW (FIRST ROW) =================
  async clickFirstView(): Promise<void> {
    console.log('Clicking View button for first institute...');

    await this.viewButton.first().click({ noWaitAfter: true });

    console.log('Successfully clicked View button');
  }

// ================= CHECKIN BUTTON LOCATOR =================
private get checkinButton() {
  return this.page.getByRole('button', { name: 'Checkin' });
}

// ================= CLICK CHECKIN =================
async clickCheckin(): Promise<void> {
  console.log('Clicking Checkin button...');
  await this.checkinButton.click({ noWaitAfter: true });
  console.log('Successfully clicked Checkin button');
}



}
