import { Page } from '@playwright/test';
import { BasePage } from './basepage';

export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async openApplication(): Promise<void> {
    await this.page.goto('https://auth.uat.pluginlive.com/');
  }

  async login(email: string, password: string): Promise<void> {
    await this.page.getByPlaceholder('eg: example@mail.com').fill(email);
    await this.page.getByPlaceholder('＊＊＊＊＊＊＊＊').fill(password);
    await this.page.locator('#checked').check();
    await this.page.locator("//button[text()='Login']").click();
  }

  async verifyHomePageVisible(): Promise<void> {
    await this.page.waitForURL('**/dashboard', { timeout: 10000 });
  }
}
