import { Page, expect } from '@playwright/test';
import { BasePage } from './basepage';

export class StudentsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // ================= PAGE LANDMARK =================
  private get manageStudentsTitle() {
    return this.page.getByText('Manage Students', { exact: true });
  }

  // ================= BULK UPLOAD BUTTON =================
  private get bulkUploadButton() {
    return this.page.getByRole('button', { name: 'Bulk Upload' });
  }

  // ================= NEW STUDENT BUTTON =================
  private get newStudentButton() {
    return this.page.getByRole('button', { name: 'New Student' });
  }

  // ================= VERIFY STUDENTS PAGE =================
  async verifyStudentsPageVisible(): Promise<void> {
    console.log('Verifying Students page is visible...');

    await expect(this.manageStudentsTitle)
      .toBeVisible({ timeout: 15000 });

    console.log('Students page verified successfully');
  }

  // ================= CLICK BULK UPLOAD =================
  async clickBulkUpload(): Promise<void> {
    console.log('Clicking on Bulk Upload button...');

    await this.bulkUploadButton.waitFor({ state: 'visible' });
    await this.bulkUploadButton.click();

    console.log('Successfully clicked Bulk Upload');
  }

  // ================= CLICK NEW STUDENT =================
  async clickNewStudent(): Promise<void> {
    console.log('Clicking on New Student button...');

    await this.newStudentButton.waitFor({ state: 'visible' });
    await this.newStudentButton.click();

    console.log('Successfully clicked New Student');
  }
}
