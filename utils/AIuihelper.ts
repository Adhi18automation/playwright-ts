import { Page } from '@playwright/test';

export async function AIwaitForUI(page: Page) {
  await page.waitForLoadState('domcontentloaded');
}

export async function AIclickByText(
  page: Page,
  text: RegExp | string
) {
  const element = page.getByText(text, { exact: false }).first();
  await element.waitFor({ state: 'visible' });
  await element.scrollIntoViewIfNeeded();
  await element.click();
}

export async function AIselectFromDropdown(
  page: Page,
  label: RegExp | string,
  value: string
) {
  const input = page.getByLabel(label).first();
  await input.fill(value);
  await page.keyboard.press('Enter');
}
