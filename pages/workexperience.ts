import { Page } from '@playwright/test';
import { BasePage } from './basepage';
import { AntdDropdownUtil } from '../utils/AntdDropdownUtil';
import { AntdMonthPickerUtil } from '../utils/AntdMonthPickerUtil';

export class WorkExperiencePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  private get addWorkExperienceButton() {
    return this.page.locator("//div[text()='Add Work Experience']");
  }

  private get roleDropdown() {
    return this.page.locator("//span[normalize-space()='Role *']/..//input[@type='search']");
  }

  private get companyNameDropdown() {
    return this.page.locator("//span[normalize-space()='Company Name *']/..//input[@type='search']");
  }

  private get functionDropdown() {
    return this.page.locator("//span[normalize-space()='Function *']/..//input[@type='search']");
  }

  private get industryDropdown() {
    return this.page.locator("//span[normalize-space()='Industry *']/..//input[@type='search']");
  }

  private get industryTextfield() {
    return this.page.locator("//input[@id='experience_0_industry']");
  }

  private get startDateInput() {
    return "(//input[@placeholder='Please Select the year'])[1]";
  }

  private get endDateInput() {
    return "(//input[@placeholder='Please Select the year'])[2]";
  }

  private get fullTimeRadio() {
    return this.page.locator("//input[@value='FULL_TIME']");
  }

  private get partTimeRadio() {
    return this.page.locator("//input[@value='PART_TIME']");
  }

  private get titleTextfield() {
    return this.page.locator("//input[@id='experience_0_title']");
  }

  private get skillsDropdown() {
    return this.page.locator("//span[text()='Skills *']/../..//input[@class='ant-select-selection-search-input']");
  }

  private get submitButton() {
    return this.page.locator("//button[@type='submit']");
  }

  async clickAddWorkExperienceButton(): Promise<void> {
    await this.addWorkExperienceButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.addWorkExperienceButton.click();
    console.log('Add Work Experience button clicked');
  }

  async fillRoleDropdown(role: string): Promise<void> {
    console.log(`Starting fillRoleDropdown with: "${role}"`);
    
    // Use AntdDropdownUtil for role selection
    await AntdDropdownUtil.fillGenericSearchDropdown(
      this.page,
      'Role',
      role,
      1,
      true
    );
    
    console.log('Role dropdown completed');
  }

  async fillTitleTextfield(title: string): Promise<void> {
    console.log(`Starting fillTitleTextfield with: "${title}"`);
    
    try {
      // Wait for textfield and fill title data
      await this.titleTextfield.waitFor({ state: 'visible', timeout: 10000 });
      await this.titleTextfield.clear();
      await this.titleTextfield.fill(title);
      console.log(`Successfully filled title textfield with: "${title}"`);
    } catch (error) {
      console.log(`Error filling title textfield: ${error}`);
      // Try alternative approach - click first then fill
      await this.titleTextfield.click();
      await this.titleTextfield.clear();
      await this.titleTextfield.fill(title);
      console.log(`Filled title textfield with alternative approach: "${title}"`);
    }
    
    console.log('Title textfield completed');
  }

  async fillCompanyNameDropdown(company: string): Promise<void> {
    console.log(`Starting fillCompanyNameDropdown with: "${company}"`);
    
    // Use AntdDropdownUtil.fillCompanyDropdown for company selection
    await AntdDropdownUtil.fillCompanyDropdown(
      this.page,
      company,
      1,
      true
    );
    
    console.log('Company Name dropdown completed');
  }

  async fillFunctionDropdown(functionText: string): Promise<void> {
  console.log(`Starting fillFunctionDropdown with: "${functionText}"`);
  
  const dialog = this.page.locator('[role="dialog"]');
  const selector = dialog.locator("(//span[normalize-space()='Function *'])[1]/..//div[contains(@class,'ant-select-selector')]");
  const input = dialog.locator("(//span[normalize-space()='Function *'])[1]/..//input[@type='search']");

  // Open dropdown and type
  await selector.waitFor({ state: 'visible', timeout: 5000 });
  await selector.click();
  await input.waitFor({ state: 'visible', timeout: 5000 });
  await input.clear();
  await input.type(functionText, { delay: 50 });

  // Wait for options
  await this.page.waitForTimeout(1000);
  const dropdown = this.page.locator('.ant-select-dropdown:visible');
  
  if (await dropdown.isVisible()) {
    const options = dropdown.locator('.ant-select-item-option-content');
    const optionCount = await options.count();
    
    if (optionCount > 0) {
      // Try exact match first
      try {
        const exactOption = dropdown.locator(`.ant-select-item-option-content:has-text("${functionText}")`);
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
  
  console.log('Function dropdown completed');
}

async fillIndustryDropdown(industryText: string): Promise<void> {
  console.log(`Starting fillIndustryDropdown with: "${industryText}"`);
  
  const dialog = this.page.locator('[role="dialog"]');
  const selector = dialog.locator("(//span[normalize-space()='Industry *'])[1]/..//div[contains(@class,'ant-select-selector')]");
  const input = dialog.locator("(//span[normalize-space()='Industry *'])[1]/..//input[@type='search']");

  // Open dropdown
  await selector.waitFor({ state: 'visible', timeout: 5000 });
  await selector.click();

  // Type industry text
  await input.waitFor({ state: 'visible', timeout: 5000 });
  await input.clear();
  await input.type(industryText, { delay: 50 });

  // Wait for options
  await this.page.waitForTimeout(1000);
  const dropdown = this.page.locator('.ant-select-dropdown:visible');
  
  if (await dropdown.isVisible()) {
    const options = dropdown.locator('.ant-select-item-option-content');
    const optionCount = await options.count();
    
    if (optionCount > 0) {
      // Try exact match first
      try {
        const exactOption = dropdown.locator(`.ant-select-item-option-content:has-text("${industryText}")`);
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
  
  console.log('Industry dropdown completed');
}

async fillIndustryTextfield(industry: string): Promise<void> {
  console.log(`Starting fillIndustryTextfield with: "${industry}"`);
  
  try {
    // Wait for textfield and fill industry data
    await this.industryTextfield.waitFor({ state: 'visible', timeout: 10000 });
    await this.industryTextfield.clear();
    await this.industryTextfield.fill(industry);
    console.log(`Successfully filled industry textfield with: "${industry}"`);
  } catch (error) {
    console.log(`Error filling industry textfield: ${error}`);
    // Try alternative approach - click first then fill
    await this.industryTextfield.click();
    await this.industryTextfield.clear();
    await this.industryTextfield.fill(industry);
    console.log(`Filled industry textfield with alternative approach: "${industry}"`);
  }
  
  console.log('Industry textfield completed');
}

async selectWorkExperienceStartDate(month: string): Promise<void> {
  await AntdMonthPickerUtil.selectMonth(
    this.page,
    this.startDateInput,
    month
  );
}

async selectWorkExperienceEndDate(month: string): Promise<void> {
  await AntdMonthPickerUtil.selectMonth(
    this.page,
    this.endDateInput,
    month
  );
}

async selectFullTimeEmployment(): Promise<void> {
  console.log('Selecting Full-time employment');
  
  try {
    await this.fullTimeRadio.waitFor({ state: 'visible', timeout: 10000 });
    await this.fullTimeRadio.click();
  } catch {
    // Fallback: click the label
    await this.page.locator("//label[contains(text(),'Full-time')]").click();
  }
  
  console.log('Selected Full-time employment');
}

async selectPartTimeEmployment(): Promise<void> {
  console.log('Selecting Part-time employment');
  
  try {
    await this.partTimeRadio.waitFor({ state: 'visible', timeout: 10000 });
    await this.partTimeRadio.click();
  } catch {
    // Fallback: click the label
    await this.page.locator("//label[contains(text(),'Part-time')]").click();
  }
  
  console.log('Selected Part-time employment');
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
