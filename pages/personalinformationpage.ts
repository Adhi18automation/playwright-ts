import { expect, Page, Locator } from '@playwright/test';
import { BasePage } from './basepage';
import { AntdDropdownUtil } from '../utils/AntdDropdownUtil';

export class PersonalInformationPage extends BasePage {
  private readonly additionalInfoDialog: Locator;
  private readonly anywhereCheckbox: Locator;
  private readonly sameAsPermanentAddressCheckbox: Locator;
  private readonly updateButton: Locator;
  private readonly pinCodeInput: Locator;

  constructor(page: Page) {
    super(page);
    
    this.additionalInfoDialog = this.page.locator('[role="dialog"]');
    
    this.anywhereCheckbox = this.page
      .getByTestId('anywhere-checkbox')
      .or(this.page.getByRole('checkbox', { name: 'Anywhere', exact: true }))
      .or(this.page.locator('div:has-text("Anywhere")').locator('..').locator('..').locator('input[type="checkbox"]').first());
    
    this.sameAsPermanentAddressCheckbox = this.page
      .getByTestId('same-as-permanent-checkbox')
      .or(this.page.getByRole('checkbox', { name: 'Same as permanent address', exact: true }))
      .or(this.page.locator('div:has-text("Same as permanent address")').locator('..').locator('..').locator('input[type="checkbox"]').first());
    
    this.updateButton = this.page
      .getByTestId('update-button')
      .or(this.page.getByRole('button', { name: /update/i }))
      .or(this.page.locator('button[type="submit"]'));
    
    this.pinCodeInput = this.page.locator('#permPostCode');
  }



  async clickAnywhereCheckbox(): Promise<void> {
    await this.safeClick(this.anywhereCheckbox, 'Anywhere checkbox');
  }

  async clickSameAsPermanentAddressCheckbox(): Promise<void> {
    this.log('Attempting to click "Same as permanent address" checkbox');
    
    // Try multiple approaches to find and click the checkbox
    const locators = [
      // Approach 1: Try the checkbox input directly
      this.sameAsPermanentAddressCheckbox,
      
      // Approach 2: Try clicking the label wrapper
      this.page.locator('label:has-text("Same as permanent address")').first(),
      
      // Approach 3: Try the checkbox wrapper
      this.page.locator('.ant-checkbox-wrapper:has-text("Same as permanent address")').first(),
      
      // Approach 4: Try finding by the text and going up to the wrapper
      this.page.locator('span:has-text("Same as permanent address")').locator('..').first()
    ];
    
    for (let i = 0; i < locators.length; i++) {
      try {
        await this.safeClick(locators[i], `Same as permanent address checkbox (attempt ${i + 1})`, { timeout: 3000 });
        this.log('Successfully clicked "Same as permanent address" checkbox');
        return;
      } catch (error) {
        this.log(`Attempt ${i + 1} failed, trying next approach...`, 'warn');
      }
    }
    
    this.log('All locator attempts failed for "Same as permanent address" checkbox', 'error');
    throw new Error('Could not find or click "Same as permanent address" checkbox');
  }

  async clickUpdateButton(): Promise<void> {
    this.log('Attempting to click Update button');
    
    await this.waitForVisible(this.updateButton, { timeout: 5000 });
    await this.waitForEnabled(this.updateButton, { timeout: 10000 });
    await this.safeClick(this.updateButton, 'Update button');
    this.log('Successfully clicked Update button');
    
    await this.page.waitForTimeout(2000);
    
    const isDialogVisible = await this.additionalInfoDialog.isVisible().catch(() => false);
    this.log(`Dialog still visible after update: ${isDialogVisible}`);
    
    if (!isDialogVisible) {
      this.log('Form appears to have been submitted successfully (dialog closed)');
    } else {
      this.log('Dialog still open, checking for any validation messages');
      const errorElements = this.additionalInfoDialog.locator('.ant-form-item-explain-error');
      const errorCount = await errorElements.count();
      if (errorCount > 0) {
        this.log(`Found ${errorCount} validation error messages`, 'warn');
        for (let i = 0; i < errorCount; i++) {
          const errorText = await errorElements.nth(i).textContent();
          this.log(`Error ${i + 1}: ${errorText}`, 'warn');
        }
      }
    }
  }

  

private async selectAntdDropdownByIndex(
  label: string,
  value: string,
  index = 0
): Promise<void> {
  const dialog = this.additionalInfoDialog;

  const selector = dialog
    .locator(`span:has-text("${label} *")`)
    .locator('..')
    .locator('..')
    .locator('div[class*="ant-select-selector"]')
    .nth(index);

  const input = dialog
    .locator(`span:has-text("${label} *")`)
    .locator('..')
    .locator('..')
    .locator('input[role="combobox"]')
    .nth(index);

  await this.waitForVisible(selector, { timeout: 10000 });
  await this.safeClick(selector, `${label} dropdown selector`);
  await this.safeFill(input, value, `${label} dropdown input`, { validate: false });

  const option = this.page.locator(
    '.ant-select-dropdown:not(.ant-select-dropdown-hidden) .ant-select-item-option-content',
    { hasText: value }
  );

  await this.waitForVisible(option.first(), { timeout: 5000 });
  await this.safeClick(option.first(), `${label} dropdown option: ${value}`);

  await this.page
    .locator('.ant-select-dropdown:not(.ant-select-dropdown-hidden)')
    .waitFor({ state: 'hidden' });
}



async fillCountry(country: string) {
  const dialog = this.additionalInfoDialog;

  const selector = dialog
    .locator('span:has-text("Country *")')
    .locator('..')
    .locator('..')
    .locator('div[class*="ant-select-selector"]')
    .first();

  const input = dialog
    .locator('span:has-text("Country *")')
    .locator('..')
    .locator('..')
    .locator('input[role="combobox"]')
    .first();

  await this.safeClick(selector, 'Country dropdown selector');
  await this.safeFill(input, country, 'Country dropdown input', { validate: false });

  const option = this.page.locator(
    '.ant-select-dropdown:not(.ant-select-dropdown-hidden) .ant-select-item-option-content',
    { hasText: country }
  );

  await this.safeClick(option.first(), `Country option: ${country}`);
}

async fillState(state: string) {
  const dialog = this.additionalInfoDialog;

  const selector = dialog
    .locator('span:has-text("State *")')
    .locator('..')
    .locator('..')
    .locator('div[class*="ant-select-selector"]')
    .first();

  const input = dialog
    .locator('span:has-text("State *")')
    .locator('..')
    .locator('..')
    .locator('input[role="combobox"]')
    .first();

  await expect(input).toBeEnabled({ timeout: 15000 });

  await this.safeClick(selector, 'State dropdown selector');
  await this.safeFill(input, state, 'State dropdown input', { validate: false });

  const option = this.page.locator(
    '.ant-select-dropdown:not(.ant-select-dropdown-hidden) .ant-select-item-option-content',
    { hasText: state }
  );

  await this.safeClick(option.first(), `State option: ${state}`);

  await dialog
    .locator('span:has-text("State *")')
    .locator('..')
    .locator('..')
    .locator('span[class*="ant-select-selection-item"]')
    .first()
    .waitFor({ state: 'visible', timeout: 5000 });
}

async fillCity(city: string) {
  const dialog = this.additionalInfoDialog;

  const selector = dialog
    .locator('span:has-text("City *")')
    .locator('..')
    .locator('..')
    .locator('div[class*="ant-select-selector"]')
    .first();

  const input = dialog
    .locator('span:has-text("City *")')
    .locator('..')
    .locator('..')
    .locator('input[role="combobox"]')
    .first();

  await expect(input).toBeEnabled({ timeout: 15000 });

  await this.safeClick(selector, 'City dropdown selector');
  await this.safeFill(input, city, 'City dropdown input', { validate: false });

  const option = this.page.locator(
    '.ant-select-dropdown:not(.ant-select-dropdown-hidden) .ant-select-item-option-content',
    { hasText: city }
  );

  await this.waitForVisible(option.first(), { timeout: 5000 });
  await this.safeClick(option.first(), `City option: ${city}`);

  await this.page
    .locator('.ant-select-dropdown:not(.ant-select-dropdown-hidden)')
    .waitFor({ state: 'hidden' });
}



  async fillPinCode(pinCode: string | number): Promise<void> {
    const value = String(pinCode);

    await this.waitForVisible(this.pinCodeInput, { timeout: 15000 });
    await this.safeClick(this.pinCodeInput, 'Pin code input');
    
    await this.page.keyboard.press('Control+A');
    await this.page.keyboard.press('Backspace');
    await this.page.keyboard.type(value, { delay: 50 });
    await this.page.keyboard.press('Tab');

    await this.waitForVisible(this.pinCodeInput);
  }

  

   
}
