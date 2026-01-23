import { Page } from '@playwright/test';
import { BasePage } from './basepage';
import { AntdDropdownUtil } from '../utils/AntdDropdownUtil';
import { AntdMonthPickerUtil } from '../utils/AntdMonthPickerUtil';
import { AntdMultiSelectUtil } from '../utils/AntdMultiSelectUtil';


export class InternshipPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  private get addInternshipButton() {
    return this.page.locator("//div[normalize-space()='Add internship']").first();
  }

  private get roleDropdown() {
    return this.page.locator("//span[text()='Role *']/..//input[@type='search']");
  }

  private get functionDropdown() {
    return this.page.locator("//span[text()='Function *']/..//input[@type='search']");
  }

  private get industryDropdown() {
    return this.page.locator("//span[text()='Industry *']/..//input[@type='search']");
  }

  private get skillsDropdown() {
    return this.page.locator("//span[text()='Skills *']/..//input[contains(@class,'ant-select-selection-search-input')]");
  }

    private get startDateInput() {
    return "(//input[@placeholder='Please Select the year'])[1]";
  }

  private get endDateInput() {
    return "(//input[@placeholder='Please Select the year'])[2]";
  }

async clickAddInternshipButton(): Promise<void> {
  await this.addInternshipButton.waitFor({ state: 'visible', timeout: 10000 });
  await this.addInternshipButton.click();
}



async fillFunctionDropdown(functionText: string): Promise<void> {
  console.log(`Starting fillFunctionDropdown with: "${functionText}"`);
  
  const dialog = this.page.locator('[role="dialog"]');

  const selector = dialog.locator(
    "(//span[normalize-space()='Function *'])[1]/..//div[contains(@class,'ant-select-selector')]"
  );
  const input = dialog.locator(
    "(//span[normalize-space()='Function *'])[1]/..//input[@type='search']"
  );

  // 1️⃣ Open dropdown
  console.log('Opening dropdown...');
  await selector.waitFor({ state: 'visible', timeout: 5000 });
  await selector.click();
  console.log('Dropdown clicked');

  // 2️⃣ Type the full function text
  console.log('Typing function text...');
  await input.waitFor({ state: 'visible', timeout: 5000 });
  await input.clear();
  await input.type(functionText, { delay: 50 });
  console.log('Function text typed');

  // 3️⃣ Wait for dropdown and options (reduced timeout)
  console.log('Waiting for options...');
  await this.page.waitForTimeout(1000);
  
  // Debug: Check if dropdown is visible
  const dropdown = this.page.locator('.ant-select-dropdown:visible');
  const isDropdownVisible = await dropdown.isVisible();
  console.log(`Dropdown visible: ${isDropdownVisible}`);
  
  if (isDropdownVisible) {
    // Debug: Count available options
    const options = dropdown.locator('.ant-select-item-option-content');
    const optionCount = await options.count();
    console.log(`Found ${optionCount} options`);
    
    // Debug: Print first few options
    for (let i = 0; i < Math.min(optionCount, 3); i++) {
      const optionText = await options.nth(i).textContent();
      console.log(`Option ${i + 1}: "${optionText}"`);
    }
    
    if (optionCount > 0) {
      // Simple approach: Select first option
      console.log('Selecting first option');
      await options.first().click();
    } else {
      // No options found, try keyboard
      console.log('No options found, using keyboard selection');
      await this.page.keyboard.press('ArrowDown');
      await this.page.waitForTimeout(300);
      await this.page.keyboard.press('Enter');
    }
  } else {
    // Dropdown not visible, try keyboard anyway
    console.log('Dropdown not visible, trying keyboard selection');
    await this.page.keyboard.press('ArrowDown');
    await this.page.waitForTimeout(300);
    await this.page.keyboard.press('Enter');
  }

  // 4️⃣ Ensure dropdown closed
  try {
    await this.page
      .locator('.ant-select-dropdown')
      .first()
      .waitFor({ state: 'hidden', timeout: 3000 });
  } catch (error) {
    // Ignore if already hidden
  }
  
  console.log('Function dropdown completed');
}

async fillIndustryDropdown(industryText: string): Promise<void> {
  console.log(`Starting fillIndustryDropdown with: "${industryText}"`);
  
  const dialog = this.page.locator('[role="dialog"]');

  const selector = dialog.locator(
    "(//span[normalize-space()='Industry *'])[1]/..//div[contains(@class,'ant-select-selector')]"
  );
  const input = dialog.locator(
    "(//span[normalize-space()='Industry *'])[1]/..//input[@type='search']"
  );

  // 1️⃣ Open dropdown
  console.log('Opening Industry dropdown...');
  await selector.waitFor({ state: 'visible', timeout: 5000 });
  await selector.click();
  console.log('Industry dropdown clicked');

  // 2️⃣ Type the full industry text
  console.log('Typing industry text...');
  await input.waitFor({ state: 'visible', timeout: 5000 });
  await input.clear();
  await input.type(industryText, { delay: 50 });
  console.log('Industry text typed');

  // 3️⃣ Wait for dropdown and options
  console.log('Waiting for Industry options...');
  await this.page.waitForTimeout(1000);
  
  // Debug: Check if dropdown is visible
  const dropdown = this.page.locator('.ant-select-dropdown:visible');
  const isDropdownVisible = await dropdown.isVisible();
  console.log(`Industry dropdown visible: ${isDropdownVisible}`);
  
  if (isDropdownVisible) {
    // Debug: Count available options
    const options = dropdown.locator('.ant-select-item-option-content');
    const optionCount = await options.count();
    console.log(`Found ${optionCount} Industry options`);
    
    // Debug: Print first few options
    for (let i = 0; i < Math.min(optionCount, 3); i++) {
      const optionText = await options.nth(i).textContent();
      console.log(`Industry Option ${i + 1}: "${optionText}"`);
    }
    
    if (optionCount > 0) {
      // Try to find exact match first
      try {
        const exactOption = dropdown.locator(
          `.ant-select-item-option-content:has-text("${industryText}")`
        );
        if (await exactOption.isVisible()) {
          console.log('Selecting exact Industry match');
          await exactOption.click();
        } else {
          console.log('No exact Industry match, selecting first option');
          await options.first().click();
        }
      } catch (error) {
        console.log('Exact Industry match failed, selecting first option');
        await options.first().click();
      }
    } else {
      // No options found, try keyboard
      console.log('No Industry options found, using keyboard selection');
      await this.page.keyboard.press('ArrowDown');
      await this.page.waitForTimeout(300);
      await this.page.keyboard.press('Enter');
    }
  } else {
    // Dropdown not visible, try keyboard anyway
    console.log('Industry dropdown not visible, trying keyboard selection');
    await this.page.keyboard.press('ArrowDown');
    await this.page.waitForTimeout(300);
    await this.page.keyboard.press('Enter');
  }

  // 4️⃣ Ensure dropdown closed
  try {
    await this.page
      .locator('.ant-select-dropdown')
      .first()
      .waitFor({ state: 'hidden', timeout: 3000 });
  } catch (error) {
    // Ignore if already hidden
  }
  
  console.log('Industry dropdown completed');
}

async fillSkillsDropdown(skills: string | string[]): Promise<void> {
  // Convert single skill to array if needed
  const skillsArray = Array.isArray(skills) ? skills : [skills];
  
  console.log(`Starting fillSkillsDropdown with ${skillsArray.length} skills:`, skillsArray);
  
  const dialog = this.page.locator('[role="dialog"]');
  
  // Get the skills dropdown container
  const selector = dialog.locator(
    "(//span[normalize-space()='Skills *'])[1]/..//div[contains(@class,'ant-select-selector')]"
  );
  
  // 1️⃣ Open dropdown
  console.log('Opening Skills dropdown...');
  await selector.waitFor({ state: 'visible', timeout: 5000 });
  await selector.click();
  console.log('Skills dropdown clicked');

  // 2️⃣ Process each skill one by one
  for (let i = 0; i < skillsArray.length; i++) {
    const skill = skillsArray[i].trim();
    console.log(`Processing skill ${i + 1}/${skillsArray.length}: "${skill}"`);
    
    // For multi-select, we need to click on the dropdown area again to focus input
    if (i > 0) {
      await selector.click();
      await this.page.waitForTimeout(300);
    }
    
    // Get the input field
    const input = dialog.locator(
      "(//span[normalize-space()='Skills *'])[1]/..//input[contains(@class,'ant-select-selection-search-input')]"
    );
    
    await input.waitFor({ state: 'visible', timeout: 5000 });
    
    // For multi-select, don't clear if we already have selected items
    if (i === 0) {
      await input.clear();
    }
    
    await input.type(skill, { delay: 50 });
    
    // Wait for dropdown options
    await this.page.waitForTimeout(1000);
    
    const dropdown = this.page.locator('.ant-select-dropdown:visible');
    const isDropdownVisible = await dropdown.isVisible();
    
    if (isDropdownVisible) {
      // Count available options
      const options = dropdown.locator('.ant-select-item-option-content');
      const optionCount = await options.count();
      console.log(`Found ${optionCount} options for skill: "${skill}"`);
      
      // Try to find exact match
      let skillSelected = false;
      
      try {
        const exactOption = dropdown.locator(
          `.ant-select-item-option-content:has-text("${skill}")`
        );
        if (await exactOption.isVisible()) {
          console.log(`Selecting exact match for skill: "${skill}"`);
          await exactOption.click();
          skillSelected = true;
        }
      } catch (error) {
        console.log(`Exact match failed for skill: "${skill}"`);
      }
      
      // If exact match failed, try case insensitive
      if (!skillSelected) {
        try {
          const allOptions = await options.all();
          for (const option of allOptions) {
            const optionText = await option.textContent();
            if (optionText && optionText.toLowerCase().includes(skill.toLowerCase())) {
              console.log(`Selecting case insensitive match: "${optionText}"`);
              await option.click();
              skillSelected = true;
              break;
            }
          }
        } catch (error) {
          console.log(`Case insensitive match failed for skill: "${skill}"`);
        }
      }
      
      // If still not selected, use keyboard
      if (!skillSelected) {
        console.log(`Using keyboard selection for skill: "${skill}"`);
        await this.page.keyboard.press('ArrowDown');
        await this.page.waitForTimeout(300);
        await this.page.keyboard.press('Enter');
      }
      
      // Wait a bit between skills for multi-select
      await this.page.waitForTimeout(800);
      
    } else {
      console.log(`Dropdown not visible for skill: "${skill}", trying keyboard`);
      await this.page.keyboard.press('ArrowDown');
      await this.page.waitForTimeout(300);
      await this.page.keyboard.press('Enter');
    }
  }
  
  // 3️⃣ Close dropdown by pressing Escape or clicking outside
  await this.page.keyboard.press('Escape');
  await this.page.waitForTimeout(300);
  
  console.log('Skills dropdown completed');
}







  async fillRoleDropdown(role: string): Promise<void> {
    await AntdDropdownUtil.fillGenericSearchDropdown(
      this.page,
      'Role',
      role,
      1,
      true
    );
  }

  async fillCompanyNameDropdown(company: string): Promise<void> {
    await AntdDropdownUtil.fillCompanyDropdown(
      this.page,
      company,
      1,
      true
    );
  }

 async selectInternshipStartDate(month: string): Promise<void> {
    await AntdMonthPickerUtil.selectMonth(
      this.page,
      this.startDateInput,
      month
    );
  }

  async selectInternshipEndDate(month: string): Promise<void> {
    await AntdMonthPickerUtil.selectMonth(
      this.page,
      this.endDateInput,
      month
    );
  }

  async fillSingleSkill(skill: string): Promise<void> {
    console.log(`Starting fillSingleSkill with: "${skill}"`);
    
    // Use the AntdMultiSelectUtil for single skill selection
    await AntdMultiSelectUtil.selectMultiple(
      this.page,
      'Skills',
      [skill],
      1,
      true
    );
    
    console.log('Single skill selection completed');
  }

  async clickUpdateButton(): Promise<void> {
    const updateButton = this.page.locator("//div[text()='Update']");
    await updateButton.waitFor({ state: 'visible', timeout: 10000 });
    await updateButton.click();
    console.log('Update button clicked');
  }





  
}
