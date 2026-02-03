import { Page } from '@playwright/test';

export class AntdDropdownUtil {

  static async selectAntdDropdownByLabel(
    page: Page,
    labelText: string,
    value: string,
    index = 1
  ): Promise<void> {

    // 🔹 CLICK TARGET (selector container)
    const selector = page.locator(
      `(//span[normalize-space()='${labelText} *'])[${index}]/../..//div[contains(@class,'ant-select-selector')]`
    );

    // 🔹 TYPE TARGET (input)
    const input = page.locator(
      `(//span[normalize-space()='${labelText} *'])[${index}]/../..//input[@role='combobox']`
    );

    // 1️⃣ Open dropdown
    await selector.waitFor({ state: 'visible', timeout: 10000 });
    await selector.click();

    // 2️⃣ Type value
    await input.waitFor({ state: 'visible' });
    await input.fill('');
    await input.type(value, { delay: 80 });

    // 3️⃣ Select from visible dropdown only
    const option = page.locator(
      `.ant-select-dropdown:not(.ant-select-dropdown-hidden)
       .ant-select-item-option-content`,
      { hasText: value }
    );

    await option.first().waitFor({ state: 'visible', timeout: 5000 });
    await option.first().click();

    // 4️⃣ Ensure dropdown closed
    await page
      .locator('.ant-select-dropdown:not(.ant-select-dropdown-hidden)')
      .waitFor({ state: 'hidden' });
  }
}
