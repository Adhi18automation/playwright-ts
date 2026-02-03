import { Page } from '@playwright/test';
import { AIwaitForUI } from '../utils/AIuihelper';

export class AILoginPage {
  constructor(private page: Page) {}

  async login(email: string, password: string) {
    await this.page.goto('https://auth.uat.pluginlive.com');
    await this.page.getByPlaceholder(/email/i).fill(email);
    await this.page.getByPlaceholder(/password/i).fill(password);
    await this.page.getByRole('checkbox').check();
    await this.page.getByRole('button', { name: /login/i }).click();
    await AIwaitForUI(this.page);
  }
}
