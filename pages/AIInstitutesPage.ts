import { Page } from '@playwright/test';
import { AIclickByText } from '../utils/AIuihelper';

export class AIInstitutesPage {
  constructor(private page: Page) {}

  async open() {
    await AIclickByText(this.page, /institutes/i);
  }

  async openCollege(college: string) {
    await this.page.getByPlaceholder(/search/i).fill(college);
    await this.page.getByRole('button', { name: /view/i }).first().click();
  }

  async openStudents() {
    await AIclickByText(this.page, /students/i);
  }
}
