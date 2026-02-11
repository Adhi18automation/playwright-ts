import { Page } from '@playwright/test';

export class AntdMultiSelectUtil {

  static async selectMultiple(
    page: Page,
    labelText: string,
    values: string[],
    index: number = 1,
    useDialog: boolean = true
  ): Promise<void> {

    const context = useDialog ? page.locator('[role="dialog"]') : page;
    const input = context.locator(
      `(//span[text()='${labelText} *'])[${index}]/../..//input[contains(@class,'ant-select-selection-search-input')]`
    );

    await input.waitFor({ state: 'visible', timeout: 10000 });

    for (const value of values) {
      console.log(`Processing: "${value}"`);
      
      // Type and wait for dropdown
      await input.click();
      await input.fill(value);
      const dropdown = page.locator('.ant-select-dropdown').last();
      await dropdown.waitFor({ state: 'visible', timeout: 5000 });
      await page.waitForTimeout(1000);

      // Try exact match first, then case insensitive
      let selected = false;
      try {
        const exactOption = dropdown.locator(`.ant-select-item-option-content:text-is("${value}")`);
        if (await exactOption.isVisible()) {
          await exactOption.locator('..').click();
          selected = true;
        }
      } catch {}

      if (!selected) {
        try {
          const allOptions = dropdown.locator('.ant-select-item-option-content');
          const count = await allOptions.count();
          
          for (let i = 0; i < count; i++) {
            const text = await allOptions.nth(i).textContent();
            if (text && text.toLowerCase().includes(value.toLowerCase())) {
              await allOptions.nth(i).locator('..').click();
              selected = true;
              break;
            }
          }
        } catch {}
      }

      // Fallback to keyboard
      if (!selected) {
        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('Enter');
      }

      await page.waitForTimeout(500);
    }

    // Close dropdown
    await page.mouse.click(10, 10);
    await page.waitForTimeout(300);
  }
}
