import { Page } from '@playwright/test';

export async function waitForUIToBeStable(page: Page) {
  await page.waitForLoadState('networkidle');

  // Do NOT block waiting for dialogs to close
  const dialog = page.locator('[role="dialog"]');
  if (await dialog.count() > 0) {
    console.warn('Dialog still open — continuing test');
  }

  await page.locator('.ant-select-dropdown')
    .waitFor({ state: 'detached', timeout: 2000 })
    .catch(() => {});

  await page.locator('.ant-picker-dropdown')
    .waitFor({ state: 'detached', timeout: 2000 })
    .catch(() => {});

  await page.waitForTimeout(300);
}
