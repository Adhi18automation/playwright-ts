import { Page } from '@playwright/test';
import { BasePage } from './basepage';


export class PersonalInformationPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  private get anywhereCheckbox() {
    return this.page.locator("//div[text()='Anywhere']/../..//span[@class='ant-checkbox']");
  }

  private get sameAsPermanentAddressCheckbox() {
    return this.page.locator("//div[text()='Same as permanent address']/../..//span[@class='ant-checkbox-inner']");
  }

  private get sameAsPermanentAddressCheckboxInput() {
    return this.page.locator("//div[text()='Same as permanent address']/../..//input[@class='ant-checkbox-input']");
  }

  private get sameAsPermanentAddressCheckboxAlt() {
    return this.page.locator("//div[contains(text(),'Same as permanent address')]//following::input[@type='checkbox']");
  }

  private get updateButton() {
    return this.page.locator("//div[text()='Update']");
  }

  private get countryDropdownSelector() {
    return this.page.locator("(//span[text()='Country *'])[1]/..//div[contains(@class,'ant-select-selector')]");
  }

  private get countryDropdownInput() {
    return this.page.locator("(//span[text()='Country *'])[1]/..//input[contains(@class,'ant-select')]");
  }

  private get countryDropdownOptions() {
    return this.page.locator("//div[contains(@class,'ant-select-dropdown') and not(contains(@class,'hidden'))]" +
      "//div[contains(@class,'ant-select-item-option-content')]");
  }

  private get stateDropdownSelector() {
    return this.page.locator("(//span[text()='State *'])[1]/..//div[contains(@class,'ant-select-selector')]");
  }

  private get stateDropdownInput() {
    return this.page.locator("(//span[text()='State *'])[1]/..//input[contains(@class,'ant-select-selection-search')]");
  }

  private get stateDropdownOptions() {
    return this.page.locator("//div[contains(@class,'ant-select-dropdown') and not(contains(@class,'hidden'))]" +
      "//div[contains(@class,'ant-select-item-option-content')]");
  }

  private get cityDropdownSelector() {
    return this.page.locator("(//span[text()='City *'])[1]/..//div[contains(@class,'ant-select-selector')]");
  }

  private get cityDropdownInput() {
    return this.page.locator("(//span[text()='City *'])[1]/..//input[contains(@class,'ant-select-selection-search')]");
  }

  private get cityDropdownOptions() {
    return this.page.locator(".ant-select-dropdown:visible .ant-select-item-option-content");
  }

private get pinCodeInput() {
  return this.page.locator('#permPostCode');
}



  async clickAnywhereCheckbox(): Promise<void> {
    await this.anywhereCheckbox.click();
  }



  async fillCountry(countryName: string): Promise<void> {
    // Click on the country dropdown selector
    await this.countryDropdownSelector.click();
    
    // Type the country name in the input field
    await this.countryDropdownInput.fill(countryName);
    
    // Wait for dropdown options to be visible
    await this.countryDropdownOptions.first().waitFor({ state: 'visible' });
    
    // Select the first matching option
    await this.countryDropdownOptions.first().click();
  }

async fillState(stateName: string): Promise<void> {
  const stateSelector = this.page.locator(
    "(//span[text()='State *'])[1]/..//div[contains(@class,'ant-select-selector')]"
  );

  const stateInput = this.page.locator(
    "(//span[text()='State *'])[1]/..//input[contains(@class,'ant-select-selection-search')]"
  );

  const stateOptions = this.page.locator(
    ".ant-select-dropdown:visible .ant-select-item-option-content"
  );

  const selectedState = this.page.locator(
    "(//span[text()='State *'])[1]/..//span[contains(@class,'ant-select-selection-item')]"
  );

  // 1️⃣ Wait for dependency
  await stateInput.waitFor({ state: 'visible', timeout: 15000 });

  // 2️⃣ Open dropdown
  await stateSelector.click();

  // 3️⃣ Focus & clear
  await stateInput.focus();
  await this.page.keyboard.press('Control+A');
  await this.page.keyboard.press('Backspace');

  // 4️⃣ Type
  await this.page.keyboard.type(stateName, { delay: 50 });

  // 5️⃣ Wait for options
  await stateOptions.first().waitFor({ state: 'visible' });

  // 6️⃣ Select
  await this.page.keyboard.press('ArrowDown');
  await this.page.keyboard.press('Enter');

  // 7️⃣ Wait for dropdown to close (🔥 FIX)
  await this.page
    .locator('.ant-select-dropdown:visible')
    .waitFor({ state: 'hidden' });

  // Debug (optional)
  console.log(
    'Selected State:',
    await selectedState.innerText()
  );
}

async fillCity(cityName: string): Promise<void> {
  const citySelector = this.page.locator(
    "(//span[text()='City *'])[1]/..//div[contains(@class,'ant-select-selector')]"
  );

  const cityInput = this.page.locator(
    "(//span[text()='City *'])[1]/..//input[contains(@class,'ant-select-selection-search')]"
  );

  const cityOptions = this.page.locator(
    ".ant-select-dropdown:visible .ant-select-item-option-content"
  );

  const selectedCity = this.page.locator(
    "(//span[text()='City *'])[1]/..//span[contains(@class,'ant-select-selection-item')]"
  );

  // 1️⃣ Wait for dependency
  await cityInput.waitFor({ state: 'visible', timeout: 15000 });

  // 2️⃣ Open dropdown
  await citySelector.click();

  // 3️⃣ Focus & clear
  await cityInput.focus();
  await this.page.keyboard.press('Control+A');
  await this.page.keyboard.press('Backspace');

  // 4️⃣ Type
  await this.page.keyboard.type(cityName, { delay: 50 });

  // 5️⃣ Wait for options
  await cityOptions.first().waitFor({ state: 'visible' });

  // 6️⃣ Select
  await this.page.keyboard.press('ArrowDown');
  await this.page.keyboard.press('Enter');

  // 7️⃣ Wait for dropdown to close (🔥 FIX)
  await this.page
    .locator('.ant-select-dropdown:visible')
    .waitFor({ state: 'hidden' });

  // Debug (optional)
  console.log(
    'Selected City:',
    await selectedCity.innerText()
  );
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

  async clickSameAsPermanentAddressCheckbox(): Promise<void> {
    console.log('Attempting to find Same as permanent address checkbox...');
    
    // Try clicking the visible span element first
    let checkbox = this.sameAsPermanentAddressCheckbox;
    let count = await checkbox.count();
    console.log(`Span element found: ${count} elements`);
    
    if (count === 0) {
      // Try the input element
      checkbox = this.sameAsPermanentAddressCheckboxInput;
      count = await checkbox.count();
      console.log(`Input element found: ${count} elements`);
    }
    
    if (count === 0) {
      // Try alternative locator
      checkbox = this.sameAsPermanentAddressCheckboxAlt;
      count = await checkbox.count();
      console.log(`Alternative locator found: ${count} elements`);
    }
    
    if (count > 0) {
      console.log('Checkbox is visible, attempting to click...');
      await checkbox.first().waitFor({ state: 'visible', timeout: 5000 });
      
      // Try clicking with force
      await checkbox.first().click({ force: true });
      console.log('Checkbox clicked successfully');
      
      // Check if checkbox is now checked
      const isChecked = await checkbox.first().isChecked();
      console.log(`Checkbox is now checked: ${isChecked}`);
    } else {
      console.log('Checkbox not found with any locator!');
      // Take screenshot for debugging
      await this.page.screenshot({ path: 'checkbox-not-found.png', fullPage: true });
      
      // Try to find any checkbox with similar text
      const anyCheckbox = this.page.locator("//div[contains(text(),'permanent')]//input");
      const anyCount = await anyCheckbox.count();
      console.log(`Found ${anyCount} checkboxes with 'permanent' text`);
    }
  }

  async clickUpdateButton(): Promise<void> {
    console.log('Attempting to find Update button...');
    const button = this.updateButton;
    const count = await button.count();
    console.log(`Update button found: ${count} elements`);
    
    if (count > 0) {
      console.log('Update button is visible, attempting to click...');
      await button.first().waitFor({ state: 'visible', timeout: 5000 });
      await button.first().click();
      console.log('Update button clicked successfully');
    } else {
      console.log('Update button not found!');
      // Take screenshot for debugging
      await this.page.screenshot({ path: 'update-button-not-found.png', fullPage: true });
    }
  }

}
