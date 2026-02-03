import { Page } from '@playwright/test';
import { BasePage } from './basepage';
import { AntdMonthPickerUtil } from '../utils/AntdMonthPickerUtil';

export class CertificatePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  private get addCertificationButton() {
    return this.page.locator("//div[text()='Add Certification']");
  }

  private get organizationField() {
    return this.page.locator("//input[@id='course_1_organization']");
  }

  private get titleField() {
    return this.page.locator("//input[@id='course_1_title']");
  }

  private get startDateInput() {
    return "(//input[@placeholder='Please Select the year'])[1]";
  }

  private get endDateInput() {
    return "(//input[@placeholder='Please Select the year'])[2]";
  }

  private get skillsDropdown() {
    return this.page.locator("//span[text()='Skills *']/../..//input[@class='ant-select-selection-search-input']");
  }

  private get submitButton() {
    return this.page.locator("//button[@type='submit']");
  }

  async clickAddCertificationButton(): Promise<void> {
    await this.addCertificationButton.click();
  }

  async fillOrganizationField(organization: string): Promise<void> {
    await this.organizationField.fill(organization);
  }

  async fillTitleField(title: string): Promise<void> {
    await this.titleField.fill(title);
  }

  async selectStartDate(month: string): Promise<void> {
    await AntdMonthPickerUtil.selectMonth(
      this.page,
      this.startDateInput,
      month
    );
  }

  async selectEndDate(month: string): Promise<void> {
    await AntdMonthPickerUtil.selectMonth(
      this.page,
      this.endDateInput,
      month
    );
  }

  async fillSkillsDropdown(skillsText: string): Promise<void> {
    console.log(`Starting fillSkillsDropdown with: "${skillsText}"`);
    
    const dialog = this.page.locator('[role="dialog"]');
    const selector = dialog.locator("//span[text()='Skills *']/../..//div[contains(@class,'ant-select-selector')]");
    const input = dialog.locator("//span[text()='Skills *']/../..//input[@class='ant-select-selection-search-input']");

    // Open dropdown
    await selector.waitFor({ state: 'visible', timeout: 5000 });
    await selector.click();

    // Type skills text
    await input.waitFor({ state: 'visible', timeout: 5000 });
    await input.clear();
    await input.type(skillsText, { delay: 50 });

    // Wait for options
    await this.page.waitForTimeout(1000);
    const dropdown = this.page.locator('.ant-select-dropdown:visible');
    
    if (await dropdown.isVisible()) {
      const options = dropdown.locator('.ant-select-item-option-content');
      const optionCount = await options.count();
      
      if (optionCount > 0) {
        // Try exact match first
        try {
          const exactOption = dropdown.locator(`.ant-select-item-option-content:has-text("${skillsText}")`);
          if (await exactOption.isVisible()) {
            await exactOption.click();
          } else {
            await options.first().click();
          }
        } catch {
          await options.first().click();
        }
      } else {
        // Keyboard fallback
        await this.page.keyboard.press('ArrowDown');
        await this.page.keyboard.press('Enter');
      }
    } else {
      // Keyboard fallback
      await this.page.keyboard.press('ArrowDown');
      await this.page.keyboard.press('Enter');
    }

    // Ensure dropdown closed
    try {
      await this.page.locator('.ant-select-dropdown').first().waitFor({ state: 'hidden', timeout: 3000 });
    } catch {}
    
    console.log('Skills dropdown completed');
  }

  async clickSubmitButton(): Promise<void> {
    console.log('Starting clickSubmitButton');
    
    try {
      await this.submitButton.waitFor({ state: 'visible', timeout: 10000 });
      await this.submitButton.click();
      console.log('Submit button clicked successfully');
    } catch (error) {
      console.log(`Error clicking submit button: ${error}`);
      // Fallback: try clicking by text content
      await this.page.locator("button[type='submit']").click();
      console.log('Submit button clicked with fallback approach');
    }
    
    console.log('Submit button completed');
  }
}
