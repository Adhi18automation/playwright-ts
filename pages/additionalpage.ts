import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './basepage';

export class additionalPage extends BasePage {

  readonly firstDropdown: Locator;

  constructor(page: Page) {
    super(page);

    // FIRST Ant Design dropdown in Additional Info
    this.firstDropdown = page
      .locator('input.ant-select-selection-search-input')
      .first();
  }

  async selectFirstDropdownOption(value: string) {
    await this.firstDropdown.scrollIntoViewIfNeeded();
    await this.firstDropdown.click();
    await this.firstDropdown.fill(value);

    const option = this.page.locator(
      '.ant-select-item-option-content',
      { hasText: value }
    );

    await expect(option).toBeVisible({ timeout: 5000 });
    await option.first().click();
  }
}
