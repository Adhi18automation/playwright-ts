import { Page } from '@playwright/test';

export async function closeUi(page: Page) {

  // 1️⃣ Press ESC (closes AntD popups safely)
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);

  // 2️⃣ Wait until dialog is completely gone
  await page.locator('[role="dialog"]')
    .waitFor({ state: 'detached', timeout: 5000 })
    .catch(() => {});

  // 3️⃣ Remove dropdowns
  await page.locator('.ant-select-dropdown')
    .waitFor({ state: 'detached', timeout: 5000 })
    .catch(() => {});

  // 4️⃣ Remove date pickers
  await page.locator('.ant-picker-dropdown')
    .waitFor({ state: 'detached', timeout: 5000 })
    .catch(() => {});

  // 5️⃣ Click outside (reset focus)
  await page.mouse.click(5, 5);
  await page.waitForTimeout(300);
}
