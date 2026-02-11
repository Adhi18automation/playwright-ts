import { Page } from '@playwright/test';

export class AILoginPage {
  constructor(private page: Page) {}

  async login(email: string, password: string) {
    await this.page.goto('https://auth.uat.pluginlive.com', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await this.page.waitForTimeout(1000);
    
    const emailInput = this.page.locator('input[type="email"]').first()
      .or(this.page.locator('input[type="text"]').first())
      .or(this.page.getByPlaceholder(/email/i));
    await emailInput.fill(email);
    
    const passwordInput = this.page.locator('input[type="password"]').first();
    await passwordInput.fill(password);
    
    const checkbox = this.page.locator('input[type="checkbox"]').first();
    if (!await checkbox.isChecked()) await checkbox.click();
    
    await passwordInput.press('Enter');
    await this.page.waitForLoadState('networkidle', { timeout: 30000 });
  }
}
