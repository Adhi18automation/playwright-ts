import { Page, Locator } from '@playwright/test';

export class AntdCollegeUtil {

  static async selectCollege(
    page: Page,
    collegeInput: Locator,
    collegeName: string
  ): Promise<void> {

    // 1️⃣ Click & type college name
    await collegeInput.waitFor({ state: 'visible' });
    await collegeInput.click();
    await collegeInput.fill(collegeName);

    // 2️⃣ Wait for AntD dropdown
    const dropdown = page.locator('.ant-select-dropdown:visible');
    await dropdown.waitFor({ state: 'visible' });

    // 3️⃣ Select EXACT matching college (no wrong selection)
    const option = dropdown.locator(
      `.ant-select-item-option:has-text("${collegeName}")`
    );

    await option.waitFor({ state: 'visible' });
    await option.click();

    // 4️⃣ Ensure dropdown closed
    await dropdown.waitFor({ state: 'hidden' });
  }

  static async selectCollegeWithFallback(
    page: Page,
    collegeInput: Locator,
    collegeName: string
  ): Promise<void> {
    // 1️⃣ Click & type college name
    await collegeInput.waitFor({ state: 'visible' });
    await collegeInput.click();
    await collegeInput.fill(collegeName);

    // 2️⃣ Wait for AntD dropdown
    const dropdown = page.locator('.ant-select-dropdown:visible');
    await dropdown.waitFor({ state: 'visible' });

    // 3️⃣ Try exact match first
    try {
      const option = dropdown.locator(
        `.ant-select-item-option:has-text("${collegeName}")`
      );
      await option.waitFor({ state: 'visible', timeout: 3000 });
      await option.click();
    } catch (error) {
      // Fallback: Use keyboard selection
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('Enter');
    }

    // 4️⃣ Ensure dropdown closed
    await dropdown.waitFor({ state: 'hidden' });
  }
}
