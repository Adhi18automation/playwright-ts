import { Page, Locator } from '@playwright/test';
import { BasePage } from './basepage';
import { AntdDropdownUtil } from '../utils/AntdDropdownUtil';
import { AntdMonthPickerUtil } from '../utils/AntdMonthPickerUtil';
import { AntdMultiSelectUtil } from '../utils/AntdMultiSelectUtil';

export class WorkExperiencePage extends BasePage {
  private readonly addWorkExperienceButton: Locator;
  private readonly roleDropdown: Locator;
  private readonly industryTextfield: Locator;
  private readonly fullTimeRadio: Locator;
  private readonly partTimeRadio: Locator;
  private readonly titleTextfield: Locator;
  private readonly submitButton: Locator;

  constructor(page: Page) {
    super(page);
    
    this.addWorkExperienceButton = this.page
      .getByTestId('add-work-experience-button')
      .or(this.page.locator('[role="dialog"]').getByRole('button', { name: /add work experience/i }).first())
      .or(this.page.locator('[role="dialog"] button:has-text("Add Work Experience")').first());
    
    this.roleDropdown = this.page
      .getByTestId('work-role-dropdown')
      .or(this.page.locator('[role="dialog"]').locator('span:has-text("Role *")').locator('..').locator('div[class*="ant-select-selector"]').first());
    
    this.industryTextfield = this.page
      .getByTestId('work-industry-textfield')
      .or(this.page.locator('#experience_0_industry'));
    
    this.fullTimeRadio = this.page
      .getByTestId('full-time-radio')
      .or(this.page.locator('input[value="FULL_TIME"]'));
    
    this.partTimeRadio = this.page
      .getByTestId('part-time-radio')
      .or(this.page.locator('input[value="PART_TIME"]'));
    
    this.titleTextfield = this.page
      .getByTestId('work-title-textfield')
      .or(this.page.locator('#experience_0_title'));
    
    this.submitButton = this.page
      .getByTestId('submit-button')
      .or(this.page.getByRole('button', { name: /submit/i }))
      .or(this.page.locator('button[type="submit"]'));
  }

  async clickAddWorkExperienceButton(): Promise<void> {
    await this.safeClick(this.addWorkExperienceButton, 'Add Work Experience button');
    console.log('Add Work Experience button clicked');
    
    // Wait for the form dialog to load
    await this.page.waitForSelector('[role="dialog"]', { state: 'visible', timeout: 5000 });
    await this.page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {
      console.log('Network idle timeout, continuing...');
    });
    await this.page.waitForTimeout(1000);
    console.log('Work Experience form loaded');
  }

  async fillRoleDropdown(roleText: string): Promise<void> {
    console.log(`[WorkExperiencePage] fillRoleDropdown called with: "${roleText}"`);
    console.log(`[WorkExperiencePage] Type of roleText: ${typeof roleText}`);
    console.log(`[WorkExperiencePage] Is undefined: ${roleText === undefined}`);
    console.log(`[WorkExperiencePage] Is null: ${roleText === null}`);
    
    if (!roleText || roleText === 'undefined' || roleText === 'null') {
      throw new Error(`Invalid role text provided: "${roleText}"`);
    }
    
    this.log(`Filling Role dropdown with: ${roleText}`);
    
    const dialog = this.page.locator('[role="dialog"]');
    const selector = dialog
      .getByTestId('role-dropdown')
      .or(dialog.locator('span:has-text("Role *")').locator('..').locator('..').locator('div[class*="ant-select-selector"]'));
    
    await this.safeClick(selector, 'Role dropdown selector');
    
    // Wait for dropdown to open
    await this.page.waitForSelector('.ant-select-dropdown:not(.ant-select-dropdown-hidden)', { 
      state: 'visible', 
      timeout: 3000 
    });
    
    // Role is the FIRST dropdown, so use .first() not .last()
    const input = dialog.locator('input[role="combobox"]:not([readonly])').first();
    console.log(`[WorkExperiencePage] About to fill input with: "${roleText}"`);
    await this.safeFill(input, roleText, 'Role dropdown input', { validate: false });
    
    // Wait for filtering to complete
    await this.page.waitForTimeout(800);
    
    // Wait for options to be visible
    await this.page.waitForSelector(
      '.ant-select-dropdown:not(.ant-select-dropdown-hidden) .ant-select-item-option',
      { state: 'visible', timeout: 3000 }
    );
    
    // Select first visible option - use direct click
    const option = this.page.locator(
      '.ant-select-dropdown:not(.ant-select-dropdown-hidden) .ant-select-item-option'
    ).first();
    
    await option.click({ timeout: 3000 });
    this.log(`Successfully clicked: Role option: ${roleText}`);
    
    await this.page.locator('.ant-select-dropdown:not(.ant-select-dropdown-hidden)')
      .waitFor({ state: 'hidden', timeout: 3000 })
      .catch(() => {});
  }

  async fillCompanyDropdownByIndex(
    companyName: string,
    index: number
  ): Promise<void> {
    this.log(`Filling Company dropdown (index ${index}) with: ${companyName}`);
    
    const dialog = this.page.locator('[role="dialog"]');

    const companySelector = dialog
      .getByTestId(`work-company-dropdown-${index}`)
      .or(dialog.locator('span:has-text("Company Name *")').locator('..').locator('..').locator('div[class*="ant-select-selector"]').nth(index));

    await this.safeClick(companySelector, `Company dropdown selector (index ${index})`);
    
    await this.page.waitForSelector('.ant-select-dropdown:not(.ant-select-dropdown-hidden)', { 
      state: 'visible', 
      timeout: 3000 
    });
    
    // Company is the SECOND dropdown (after Role), so use nth(1) not .last()
    const input = dialog.locator('input[role="combobox"]:not([readonly])').nth(1);
    await this.safeFill(input, companyName, `Company dropdown input (index ${index})`, { validate: false });
    
    // Wait for filtering to complete
    await this.page.waitForTimeout(800);
    
    // Wait for options to be visible
    await this.page.waitForSelector(
      '.ant-select-dropdown:not(.ant-select-dropdown-hidden) .ant-select-item-option',
      { state: 'visible', timeout: 3000 }
    );
    
    // Select first visible option after filtering - use direct click
    const option = this.page.locator(
      '.ant-select-dropdown:not(.ant-select-dropdown-hidden) .ant-select-item-option'
    ).first();
    
    await option.click({ timeout: 3000 });
    this.log(`Successfully clicked: Company option: ${companyName}`);
    
    await this.page.locator('.ant-select-dropdown:not(.ant-select-dropdown-hidden)')
      .waitFor({ state: 'hidden', timeout: 3000 })
      .catch(() => {});
  }

  async fillFunctionDropdown(functionName: string): Promise<void> {
    console.log(`Looking for function: "${functionName}"`);
    
    const dialog = this.page.locator('[role="dialog"]');

    const selector = dialog
      .getByTestId('work-function-dropdown')
      .or(dialog.locator('span:has-text("Function *")').locator('..').locator('..').locator('div[class*="ant-select-selector"]'));

    await this.safeClick(selector, 'Function dropdown selector');
    
    await this.page.waitForSelector('.ant-select-dropdown:not(.ant-select-dropdown-hidden)', { 
      state: 'visible', 
      timeout: 3000 
    });
    
    // Function is the THIRD dropdown (Role=0, Company=1, Function=2), so use nth(2) not .last()
    const input = dialog.locator('input[role="combobox"]:not([readonly])').nth(2);
    await this.safeFill(input, functionName, 'Function dropdown input', { validate: false });
    
    // Wait for filtering to complete
    await this.page.waitForTimeout(800);
    
    // Wait for options to be visible
    await this.page.waitForSelector(
      '.ant-select-dropdown:not(.ant-select-dropdown-hidden) .ant-select-item-option',
      { state: 'visible', timeout: 3000 }
    );
    
    // Select first visible option - use direct click
    const option = this.page.locator(
      '.ant-select-dropdown:not(.ant-select-dropdown-hidden) .ant-select-item-option'
    ).first();
    
    await option.click({ timeout: 3000 });
    this.log(`Successfully clicked: Function option: ${functionName}`);
    
    await this.page.locator('.ant-select-dropdown:not(.ant-select-dropdown-hidden)')
      .waitFor({ state: 'hidden', timeout: 3000 })
      .catch(() => {});
    
    console.log(`✅ Function successfully selected: "${functionName}"`);
  }










  async fillIndustryDropdown(industryText: string): Promise<void> {
    this.log(`Filling Industry dropdown with: ${industryText}`);
    
    const dialog = this.page.locator('[role="dialog"]');

    const selector = dialog
      .getByTestId('work-industry-dropdown')
      .or(dialog.locator('span:has-text("Industry *")').locator('..').locator('..').locator('div[class*="ant-select-selector"]'));

    await this.safeClick(selector, 'Industry dropdown selector');
    
    await this.page.waitForSelector('.ant-select-dropdown:not(.ant-select-dropdown-hidden)', { 
      state: 'visible', 
      timeout: 3000 
    });
    
    const input = this.page.locator('input[role="combobox"]:not([readonly])').last();
    await this.safeFill(input, industryText, 'Industry dropdown input', { validate: false });
    
    // Wait for filtering to complete
    await this.page.waitForTimeout(800);
    
    // Wait for options to be visible
    await this.page.waitForSelector(
      '.ant-select-dropdown:not(.ant-select-dropdown-hidden) .ant-select-item-option',
      { state: 'visible', timeout: 3000 }
    );
    
    // Log available options for debugging
    const allOptions = await this.page.locator(
      '.ant-select-dropdown:not(.ant-select-dropdown-hidden) .ant-select-item-option'
    ).allTextContents();
    console.log(`Available industry options after filtering "${industryText}":`, allOptions);
    
    // Select first visible option - use direct click
    const option = this.page.locator(
      '.ant-select-dropdown:not(.ant-select-dropdown-hidden) .ant-select-item-option'
    ).first();
    
    const selectedText = await option.textContent();
    console.log(`Selecting industry option: "${selectedText}"`);
    
    await option.click({ timeout: 3000 });
    this.log(`Successfully clicked: Industry option: ${industryText}`);
    
    await this.page.locator('.ant-select-dropdown:not(.ant-select-dropdown-hidden)')
      .waitFor({ state: 'hidden', timeout: 3000 })
      .catch(() => {});
  }

  async fillIndustryTextfield(industry: string): Promise<void> {
    console.log(`\n========== INDUSTRY TEXTFIELD DEBUG ==========`);
    console.log(`Starting fillIndustryTextfield with: "${industry}"`);
    console.log(`Data type: ${typeof industry}`);
    console.log(`Data length: ${industry?.length}`);
    console.log(`Is empty: ${!industry || industry.trim() === ''}`);
    
    // Check if industry data is empty or undefined
    if (!industry || industry.trim() === '') {
      console.log(`⚠️ WARNING: Industry textfield data is empty or undefined!`);
      console.log(`Skipping industry textfield fill.`);
      return;
    }
    
    // Wait for the textfield to appear after selecting "Other" in Industry dropdown
    await this.page.waitForTimeout(1000);
    
    const dialog = this.page.locator('[role="dialog"]');
    const textfield = dialog.locator('input#experience_0_industry[type="text"]').or(dialog.getByPlaceholder('Enter the Industry name'));
    
    // Check if textfield exists in DOM
    const textfieldCount = await textfield.count();
    console.log(`Textfield elements found: ${textfieldCount}`);
    
    const isVisible = await textfield.isVisible().catch(() => false);
    console.log(`Textfield visible: ${isVisible}`);
    
    // Take screenshot BEFORE attempting to fill
    await this.page.screenshot({
      path: `test-results/screenshots/industry-textfield-before-${Date.now()}.png`,
      fullPage: true
    });
    console.log(`📸 Screenshot captured: industry-textfield-before`);
    
    try {
      // Wait for textfield to be visible
      await textfield.waitFor({ state: 'visible', timeout: 5000 });
      console.log(`✅ Textfield is visible! Taking screenshot...`);
      
      // Take screenshot when textfield is visible
      await this.page.screenshot({
        path: `test-results/screenshots/industry-textfield-visible-${Date.now()}.png`,
        fullPage: true
      });
      console.log(`📸 Screenshot captured: industry-textfield-visible`);
      
      // Highlight the textfield
      await textfield.evaluate(el => {
        el.style.border = '3px solid red';
        el.style.backgroundColor = 'yellow';
      });
      
      await this.page.screenshot({
        path: `test-results/screenshots/industry-textfield-highlighted-${Date.now()}.png`,
        fullPage: true
      });
      console.log(`📸 Screenshot captured: industry-textfield-highlighted`);
      
      // Fill the textfield
      await textfield.fill(industry);
      console.log(`✅ Successfully filled industry textfield with: "${industry}"`);
      
      // Verify the value was filled
      const filledValue = await textfield.inputValue();
      console.log(`Verified filled value: "${filledValue}"`);
      
      // Take screenshot after filling
      await this.page.screenshot({
        path: `test-results/screenshots/industry-textfield-filled-${Date.now()}.png`,
        fullPage: true
      });
      console.log(`📸 Screenshot captured: industry-textfield-filled`);
    } catch (error) {
      console.log(`❌ Error filling industry textfield: ${error}`);
      console.log(`This usually means the textfield is not visible (Industry dropdown != "Other")`);
      
      // Take screenshot of error state
      await this.page.screenshot({
        path: `test-results/screenshots/industry-textfield-not-visible-${Date.now()}.png`,
        fullPage: true
      });
      console.log(`📸 Screenshot captured: industry-textfield-not-visible`);
      
      // Try alternative approach - click and type
      try {
        await textfield.click({ timeout: 3000 });
        await textfield.clear();
        await textfield.pressSequentially(industry, { delay: 50 });
        console.log(`✅ Filled industry textfield with alternative approach: "${industry}"`);
        
        // Take screenshot after alternative fill
        await this.page.screenshot({
          path: `test-results/screenshots/industry-textfield-alternative-filled-${Date.now()}.png`,
          fullPage: true
        });
        console.log(`📸 Screenshot captured: industry-textfield-alternative-filled`);
      } catch (retryError) {
        console.log(`❌ Retry also failed: ${retryError}`);
        console.log(`Industry textfield not available - continuing without it`);
        // Don't throw - let the test continue
      }
    }
    
    console.log(`Industry textfield completed`);
    console.log(`========== END INDUSTRY TEXTFIELD DEBUG ==========\n`);
  }

  async selectWorkExperienceStartDate(month: string): Promise<void> {
    console.log(`[WorkExperiencePage] selectWorkExperienceStartDate called with: "${month}"`);
    
    const dialog = this.page.locator('[role="dialog"]');
    const startDateInput = dialog.locator("input[placeholder='Please Select the year']").first();
    
    // Click to open the picker
    await startDateInput.click();
    await this.page.waitForTimeout(800);
    
    // Wait for picker to open
    const picker = this.page.locator('.ant-picker-dropdown:visible').last();
    await picker.waitFor({ state: 'visible', timeout: 3000 });
    
    // Parse the month (format: YYYY-MM)
    const [year, monthNum] = month.split('-');
    const targetYear = parseInt(year);
    
    // Navigate to correct year
    const header = picker.locator('.ant-picker-header-view');
    let currentYearText = await header.textContent();
    let currentYear = parseInt(currentYearText || '0');
    
    console.log(`Target year: ${targetYear}, Current year: ${currentYear}`);
    
    // Click year to navigate if needed
    while (currentYear !== targetYear) {
      await header.click();
      await this.page.waitForTimeout(300);
      
      // Find and click the target year
      const yearCell = picker.locator(`.ant-picker-cell .ant-picker-cell-inner:text("${targetYear}")`).first();
      if (await yearCell.isVisible()) {
        await yearCell.click({ force: true });
        await this.page.waitForTimeout(300);
        break;
      }
      
      // If year not visible, navigate using super prev/next buttons
      const superPrevBtn = picker.locator('.ant-picker-header-super-prev-btn');
      const superNextBtn = picker.locator('.ant-picker-header-super-next-btn');
      
      if (targetYear < currentYear) {
        await superPrevBtn.click();
      } else {
        await superNextBtn.click();
      }
      await this.page.waitForTimeout(300);
      
      currentYearText = await header.textContent();
      currentYear = parseInt(currentYearText || '0');
    }
    
    // Month names for matching
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthName = monthNames[parseInt(monthNum) - 1];
    
    console.log(`Looking for month: ${monthName}`);
    
    // Click on the month cell
    const monthCell = picker.locator(`.ant-picker-cell .ant-picker-cell-inner:text("${monthName}")`).first();
    await monthCell.click({ timeout: 3000, force: true });
    
    // Wait for picker to close
    await this.page.waitForTimeout(500);
  }

  async selectWorkExperienceEndDate(month: string): Promise<void> {
    console.log(`[WorkExperiencePage] selectWorkExperienceEndDate called with: "${month}"`);
    
    const dialog = this.page.locator('[role="dialog"]');
    const endDateInput = dialog.locator("input[placeholder='Please Select the year']").nth(1);
    
    // Click to open the picker
    await endDateInput.click();
    await this.page.waitForTimeout(800);
    
    // Wait for picker to open
    const picker = this.page.locator('.ant-picker-dropdown:visible').last();
    await picker.waitFor({ state: 'visible', timeout: 3000 });
    
    // Parse the month (format: YYYY-MM)
    const [year, monthNum] = month.split('-');
    const targetYear = parseInt(year);
    
    // Navigate to correct year
    const header = picker.locator('.ant-picker-header-view');
    let currentYearText = await header.textContent();
    let currentYear = parseInt(currentYearText || '0');
    
    console.log(`Target year: ${targetYear}, Current year: ${currentYear}`);
    
    // Click year to navigate if needed
    while (currentYear !== targetYear) {
      await header.click();
      await this.page.waitForTimeout(300);
      
      // Find and click the target year
      const yearCell = picker.locator(`.ant-picker-cell .ant-picker-cell-inner:text("${targetYear}")`).first();
      if (await yearCell.isVisible()) {
        await yearCell.click({ force: true });
        await this.page.waitForTimeout(300);
        break;
      }
      
      // If year not visible, navigate using super prev/next buttons
      const superPrevBtn = picker.locator('.ant-picker-header-super-prev-btn');
      const superNextBtn = picker.locator('.ant-picker-header-super-next-btn');
      
      if (targetYear < currentYear) {
        await superPrevBtn.click();
      } else {
        await superNextBtn.click();
      }
      await this.page.waitForTimeout(300);
      
      currentYearText = await header.textContent();
      currentYear = parseInt(currentYearText || '0');
    }
    
    // Month names for matching
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthName = monthNames[parseInt(monthNum) - 1];
    
    console.log(`Looking for month: ${monthName}`);
    
    // Click on the month cell
    const monthCell = picker.locator(`.ant-picker-cell .ant-picker-cell-inner:text("${monthName}")`).first();
    await monthCell.click({ timeout: 3000, force: true });
    
    // Wait for picker to close
    await this.page.waitForTimeout(500);
  }

  async selectFullTimeEmployment(): Promise<void> {
    console.log('Selecting Full-time employment');
    
    const fullTimeLabel = this.page
      .getByTestId('full-time-label')
      .or(this.page.getByLabel(/full-time/i))
      .or(this.page.locator('label:has-text("Full-time")'));
    
    try {
      await this.safeClick(this.fullTimeRadio, 'Full-time radio');
    } catch {
      await this.safeClick(fullTimeLabel, 'Full-time label');
    }
    
    console.log('Selected Full-time employment');
  }

  async selectPartTimeEmployment(): Promise<void> {
    console.log('Selecting Part-time employment');
    
    const partTimeLabel = this.page
      .getByTestId('part-time-label')
      .or(this.page.getByLabel(/part-time/i))
      .or(this.page.locator('label:has-text("Part-time")'));
    
    try {
      await this.safeClick(this.partTimeRadio, 'Part-time radio');
    } catch {
      await this.safeClick(partTimeLabel, 'Part-time label');
    }
    
    console.log('Selected Part-time employment');
  }

  async fillTitleTextfield(title: string): Promise<void> {
    console.log(`Starting fillTitleTextfield with: "${title}"`);
    
    // Wait for the textfield to appear
    await this.page.waitForTimeout(1000);
    
    const dialog = this.page.locator('[role="dialog"]');
    const textfield = dialog.locator('input#experience_0_title').or(this.titleTextfield);
    
    try {
      // Wait for textfield to be visible
      await textfield.waitFor({ state: 'visible', timeout: 5000 });
      
      // Fill the textfield
      await textfield.fill(title);
      console.log(`Successfully filled title textfield with: "${title}"`);
    } catch (error) {
      console.log(`Error filling title textfield: ${error}`);
      
      // Try alternative approach - click and type
      try {
        await textfield.click({ timeout: 3000 });
        await textfield.clear();
        await textfield.pressSequentially(title, { delay: 50 });
        console.log(`Filled title textfield with alternative approach: "${title}"`);
      } catch (retryError) {
        console.log(`Retry also failed: ${retryError}`);
        // Don't throw - let the test continue
      }
    }
    
    console.log('Industry textfield completed');
  }

  async fillSingleSkill(skill: string): Promise<void> {
    console.log(`Starting fillSingleSkill with: "${skill}"`);
    
    await AntdMultiSelectUtil.selectMultiple(
      this.page,
      'Skills',
      [skill],
      1,
      true
    );
    
    console.log('Single skill selection completed');
  }

  async clickSubmitButton(): Promise<void> {
    console.log('Starting clickSubmitButton');
    
    try {
      await this.safeClick(this.submitButton, 'Submit button');
      console.log('Submit button clicked successfully');
    } catch (error) {
      console.log(`Error clicking submit button: ${error}`);
      const fallbackButton = this.page.locator('button[type="submit"]');
      await this.safeClick(fallbackButton, 'Submit button (fallback)');
      console.log('Submit button clicked with fallback approach');
    }
    
    console.log('Submit button completed');
  }
}
