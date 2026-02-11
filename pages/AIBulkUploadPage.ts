import { Page } from '@playwright/test';
import path from 'path';
import { AIclickByText, AIselectFromDropdown } from '../utils/AIuihelper';

export class AIBulkUploadPage {
  constructor(private page: Page) {}

  async open() {
    await AIclickByText(this.page, /bulk upload/i);
  }

  async fillForm(degree: string, department: string) {
    await AIselectFromDropdown(this.page, /degree/i, degree);
    await AIselectFromDropdown(this.page, /department/i, department);
  }

  async uploadFile(filePath: string) {
    await this.page
      .locator('input[type="file"]')
      .setInputFiles(path.resolve(filePath));
  }

  async submit() {
    await this.page.getByRole('button', { name: /^upload$/i }).click();
  }
}
