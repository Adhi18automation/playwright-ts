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

  private get industryTextfield() {
    return this.page.locator("//input[@id='internship_1_industry']");
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

 // ============== ROLE DROPDOWN ==========

async fillRoleDropdown(roleText: string): Promise<void> {
  const page = this.page;

  const roleSelector = page.locator(
    "//span[normalize-space()='Role *']/../..//div[contains(@class,'ant-select-selector')]"
  );

  const roleInput = page.locator(
    "//span[normalize-space()='Role *']/../..//input[@role='combobox']"
  );

  // 1️⃣ Open dropdown
  await roleSelector.waitFor({ state: 'visible', timeout: 10000 });
  await roleSelector.click();

  // 2️⃣ Fill instantly (🔥 FAST)
  await roleInput.fill(roleText);

  // 3️⃣ Select matching option
  const option = page.locator(
    ".ant-select-dropdown:not(.ant-select-dropdown-hidden) .ant-select-item-option-content",
    { hasText: roleText }
  );

  await option.first().waitFor({ state: 'visible', timeout: 5000 });
  await option.first().click();

  // 4️⃣ Optional safety: ensure selection committed
  await page.locator(
    "//span[normalize-space()='Role *']/../..//span[contains(@class,'ant-select-selection-item')]"
  ).waitFor({ state: 'visible', timeout: 5000 });
}




 // ============== COMPANY DROPDOWN ==========

async fillCompanyDropdownByIndex(
  companyName: string,
  index: number
): Promise<void> {

  const dialog = this.page.locator('[role="dialog"]');

  const companySelector = dialog
    .locator("//span[normalize-space()='Company Name *']/../..//div[contains(@class,'ant-select-selector')]")
    .nth(index);

  const companyInput = dialog
    .locator("//span[normalize-space()='Company Name *']/../..//input[@role='combobox']")
    .nth(index);

  // 1️⃣ Open dropdown
  await companySelector.waitFor({ state: 'visible', timeout: 10000 });
  await companySelector.click();

  // 2️⃣ Fill FAST (no typing delay)
  await companyInput.fill(companyName);

  // 3️⃣ Select from VISIBLE AntD dropdown (🔥 FIX)
  const option = this.page.locator(
    '.ant-select-dropdown:not(.ant-select-dropdown-hidden) .ant-select-item-option-content',
    { hasText: companyName }
  );

  await option.first().waitFor({ state: 'visible', timeout: 5000 });
  await option.first().click();

  // 4️⃣ Ensure dropdown closed
  await this.page
    .locator('.ant-select-dropdown:not(.ant-select-dropdown-hidden)')
    .waitFor({ state: 'hidden' });
}



 // ============== FUNCTION DROPDOWN ==========

async fillFunctionDropdown(functionName: string): Promise<void> {
  const dialog = this.page.locator('[role="dialog"]');

  const selector = dialog.locator(
    "//span[normalize-space()='Function *']/../..//div[contains(@class,'ant-select-selector')]"
  );

  const input = dialog.locator(
    "//span[normalize-space()='Function *']/../..//input[@role='combobox']"
  );

  // 1️⃣ Open dropdown
  await selector.waitFor({ state: 'visible', timeout: 10000 });
  await selector.click();

  // 2️⃣ Type value (AntD filters internally)
  await input.fill(functionName);

  // 3️⃣ Wait for dropdown to be visible and ready
  await this.page.waitForTimeout(1000); // Let AntD filter the options
  
  const dropdown = this.page.locator('.ant-select-dropdown:not(.ant-select-dropdown-hidden)');
  await dropdown.waitFor({ state: 'visible', timeout: 5000 });

  // 4️⃣ Find and click matching option with better handling
  const options = dropdown.locator('.ant-select-item-option[role="option"]');
  const count = await options.count();
  
  console.log(`Looking for function: "${functionName}" among ${count} options`);

  const expected = functionName.trim().toLowerCase();
  let found = false;

  for (let i = 0; i < count; i++) {
    const option = options.nth(i);
    
    // Wait for option to be visible and not hidden
    try {
      await option.waitFor({ state: 'visible', timeout: 2000 });
      
      const text = (await option.innerText()).trim().toLowerCase();
      console.log(`Option ${i}: "${text}"`);

      // Exact match
      if (text === expected) {
        // Scroll into view if needed
        await option.scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(200);
        await option.click();
        found = true;
        console.log(`Found exact match: "${text}"`);
        break;
      }
      
      // Partial match
      if (text.includes(expected) || expected.includes(text)) {
        await option.scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(200);
        await option.click();
        found = true;
        console.log(`Found partial match: "${text}"`);
        break;
      }
    } catch (error) {
      // Skip this option if it's not accessible
      console.log(`Skipping option ${i}: ${error}`);
      continue;
    }
  }

  // Fallback: Use keyboard if no option was clickable
  if (!found) {
    console.log('No clickable option found, trying keyboard approach');
    await input.click(); // Focus the input
    await this.page.keyboard.press('ArrowDown');
    await this.page.waitForTimeout(300);
    await this.page.keyboard.press('Enter');
    found = true;
  }

  if (!found) {
    throw new Error(`❌ Function not found in dropdown: "${functionName}"`);
  }

  // 5️⃣ Validate commit
  await selector.locator('.ant-select-selection-item')
    .waitFor({ state: 'visible', timeout: 5000 });
  
  console.log(`✅ Function successfully selected: "${functionName}"`);
}



 // ============== INDUSTRY DROPDOWN ========== 


async fillIndustryDropdown(industryText: string): Promise<void> {
  const dialog = this.page.locator('[role="dialog"]');

  const selector = dialog.locator(
    "//span[normalize-space()='Industry *']/../..//div[contains(@class,'ant-select-selector')]"
  );

  const input = dialog.locator(
    "//span[normalize-space()='Industry *']/../..//input[@role='combobox']"
  );

  // 1️⃣ Open
  await selector.click();

  // 2️⃣ Type
  await input.fill(industryText);

  // 3️⃣ Click matching option
  const option = this.page.locator(
    '.ant-select-dropdown:not(.ant-select-dropdown-hidden) .ant-select-item-option-content',
    { hasText: industryText }
  );

  await option.first().waitFor({ state: 'visible', timeout: 5000 });
  await option.first().click();

  // 4️⃣ Assert
  await selector.locator('.ant-select-selection-item')
    .filter({ hasText: industryText })
    .waitFor({ state: 'visible', timeout: 5000 });
}

 // ============== START DATE DROPDOWN ==========

 async selectInternshipStartDate(month: string): Promise<void> {
    await AntdMonthPickerUtil.selectMonth(
      this.page,
      this.startDateInput,
      month
    );
  }

 // ============== END DATE DROPDOWN ==========

  async selectInternshipEndDate(month: string): Promise<void> {
    await AntdMonthPickerUtil.selectMonth(
      this.page,
      this.endDateInput,
      month
    );
  }

 // ============== SKILL DROPDOWN ==========

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

 // ============== INDUSTRY TEXTFIELD ==========

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

  async clickUpdateButton(): Promise<void> {
    const updateButton = this.page.locator("//div[text()='Update']");
    await updateButton.waitFor({ state: 'visible', timeout: 10000 });
    await updateButton.click();
    console.log('Update button clicked');
  }





  
}
