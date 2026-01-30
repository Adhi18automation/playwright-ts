import { expect, Page } from '@playwright/test';
import { BasePage } from './basepage';
import { AntdDropdownUtil } from '../utils/AntdDropdownUtil';


export class PersonalInformationPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // ✅ Additional Info dialog (IMPORTANT)
  private get additionalInfoDialog() {
    return this.page.locator('[role="dialog"]');
  }


  private get anywhereCheckbox() {
    return this.page.locator("//div[text()='Anywhere']/../..//span[@class='ant-checkbox']");
  }

  private get sameAsPermanentAddressCheckbox() {
    return this.page.locator("//div[text()='Same as permanent address']/../..//input[@type='checkbox']");
  }

  private get updateButton() {
    return this.page.locator("//button[@type='submit']");
  }




private get pinCodeInput() {
  return this.page.locator('#permPostCode');
}



  async clickAnywhereCheckbox(): Promise<void> {
    await this.anywhereCheckbox.click();
  }

  async clickSameAsPermanentAddressCheckbox(): Promise<void> {
    await this.sameAsPermanentAddressCheckbox.click();
  }

  async clickUpdateButton(): Promise<void> {
    await this.updateButton.click();
  }

private async selectAntdDropdownByIndex(
  label: string,
  value: string,
  index = 0
): Promise<void> {

  const dialog = this.additionalInfoDialog;

  const selector = dialog
    .locator(`//span[normalize-space()='${label} *']/../..//div[contains(@class,'ant-select-selector')]`)
    .nth(index);

  const input = dialog
    .locator(`//span[normalize-space()='${label} *']/../..//input[@role='combobox']`)
    .nth(index);

  // 1️⃣ Open dropdown
  await selector.waitFor({ state: 'visible', timeout: 10000 });
  await selector.click();

  // 2️⃣ Fill FAST (no slow typing)
  await input.fill(value);

  // 3️⃣ Match option using hasText (🔥 FIX)
  const option = this.page.locator(
    '.ant-select-dropdown:not(.ant-select-dropdown-hidden) .ant-select-item-option-content',
    { hasText: value }
  );

  await option.first().waitFor({ state: 'visible', timeout: 5000 });
  await option.first().click();

  // 4️⃣ Ensure dropdown closed
  await this.page
    .locator('.ant-select-dropdown:not(.ant-select-dropdown-hidden)')
    .waitFor({ state: 'hidden' });
}



async fillCountry(country: string) {
  const dialog = this.additionalInfoDialog;

  const selector = dialog
    .locator("//span[normalize-space()='Country *']/../..//div[contains(@class,'ant-select-selector')]")
    .first();

  const input = dialog
    .locator("//span[normalize-space()='Country *']/../..//input[@role='combobox']")
    .first();

  await selector.click();
  await input.fill(country);

  const option = this.page.locator(
    '.ant-select-dropdown:not(.ant-select-dropdown-hidden) .ant-select-item-option-content',
    { hasText: country }
  );

  await option.first().click();
}




async fillState(state: string) {
  const dialog = this.additionalInfoDialog;

  const selector = dialog.locator(
    "//span[normalize-space()='State *']/../..//div[contains(@class,'ant-select-selector')]"
  ).first();

  const input = dialog.locator(
    "//span[normalize-space()='State *']/../..//input[@role='combobox']"
  ).first();

  // Wait until State dropdown becomes enabled
  await expect(input).toBeEnabled({ timeout: 15000 });

  await selector.click();
  await input.fill(state);

  const option = this.page.locator(
    '.ant-select-dropdown:not(.ant-select-dropdown-hidden) .ant-select-item-option-content',
    { hasText: state }
  );

  await option.first().click();

  // 🔥 IMPORTANT: wait until value is committed
  await dialog.locator(
    "//span[normalize-space()='State *']/../..//span[contains(@class,'ant-select-selection-item')]"
  ).waitFor({ state: 'visible', timeout: 5000 });
}




async fillCity(city: string) {
  const dialog = this.additionalInfoDialog;

  const selector = dialog
    .locator("//span[normalize-space()='City *']/../..//div[contains(@class,'ant-select-selector')]")
    .first();

  const input = dialog
    .locator("//span[normalize-space()='City *']/../..//input[@role='combobox']")
    .first();

  // 🔥 WAIT until City input is enabled (IMPORTANT)
  await this.page.waitForFunction(
    el => !el.hasAttribute('disabled'),
    await input.elementHandle(),
    { timeout: 15000 }
  );

  // Open dropdown
  await selector.click();

  // Fill text
  await input.fill(city);

  // Select option
  const option = this.page.locator(
    '.ant-select-dropdown:not(.ant-select-dropdown-hidden) .ant-select-item-option-content',
    { hasText: city }
  );

  await option.first().waitFor({ state: 'visible', timeout: 5000 });
  await option.first().click();

  // Ensure dropdown closed
  await this.page
    .locator('.ant-select-dropdown:not(.ant-select-dropdown-hidden)')
    .waitFor({ state: 'hidden' });
}



  async fillPinCode(pinCode: string | number): Promise<void> {
    const value = String(pinCode);

    await this.pinCodeInput.waitFor({ state: 'visible', timeout: 15000 });

    await this.pinCodeInput.click();
    await this.pinCodeInput.focus();

    await this.page.keyboard.press('Control+A');
    await this.page.keyboard.press('Backspace');
    await this.page.keyboard.type(value, { delay: 50 });

    // trigger validation
    await this.page.keyboard.press('Tab');

    // wait until validation clears WITHOUT expect
    await this.pinCodeInput.waitFor({ state: 'visible' });
  }

  

   
}
