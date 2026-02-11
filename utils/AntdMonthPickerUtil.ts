import { Page, Locator } from '@playwright/test';

export class AntdMonthPickerUtil {

  /**
   * Select month in Ant Design Month Picker
   * @param page Playwright Page
   * @param inputLocator XPath/CSS for input field
   * @param month YYYY-MM (example: 2025-01)
   */
  static async selectMonth(
    page: Page,
    inputLocator: string,
    month: string
  ): Promise<void> {

    const targetYear = Number(month.split('-')[0]);

    // 1️⃣ Open picker
    const input = page.locator(inputLocator);
    await input.waitFor({ state: 'visible' });
    await input.click();

    // 2️⃣ Always use LAST visible picker (🔥 critical fix)
    const picker = page.locator('.ant-picker-dropdown').last();
    await picker.waitFor({ state: 'visible' });

    const header = picker.locator('.ant-picker-header-view');

    // 3️⃣ Navigate year
    for (let i = 0; i < 12; i++) {
      const headerText = await header.innerText();
      const currentYear = Number(headerText.replace(/\D/g, ''));

      if (currentYear === targetYear) break;

      if (currentYear < targetYear) {
        await picker.locator('.ant-picker-header-super-next-btn').click();
      } else {
        await picker.locator('.ant-picker-header-super-prev-btn').click();
      }

      await page.waitForTimeout(200);
    }

    // 4️⃣ Select month cell
    const monthCell = picker.locator(
      `//td[@title='${month}' and not(contains(@class,'disabled'))]`
    );

    await monthCell.waitFor({ state: 'visible' });
    await monthCell.click();

    // 5️⃣ Ensure picker closed
    await picker.waitFor({ state: 'hidden' });
  }
}
