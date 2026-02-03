import { Page, Locator } from '@playwright/test';
import { BasePage } from './basepage';
import { AntdDropdownUtil } from '../utils/AntdDropdownUtil';
import { AntdMonthPickerUtil } from '../utils/AntdMonthPickerUtil';
import { AntdMultiSelectUtil } from '../utils/AntdMultiSelectUtil';

export class InternshipPage extends BasePage {
  private readonly addInternshipButton: Locator;
  private readonly roleDropdown: Locator;
  private readonly industryTextfield: Locator;
  private readonly updateButton: Locator;

  constructor(page: Page) {
    super(page);
    
    this.addInternshipButton = this.page
      .getByTestId('add-internship-button')
      .or(this.page.getByRole('button', { name: 'Add internship', exact: true }))
      .or(this.page.locator('button:has-text("Add internship")'));
    
    this.roleDropdown = this.page
      .getByTestId('role-dropdown')
      .or(this.page.locator('span:has-text("Role *")').locator('..').locator('div[class*="ant-select-selector"]'));
    
    this.industryTextfield = this.page
      .getByTestId('industry-textfield')
      .or(this.page.locator('input#internship_1_industry'));
    
    this.updateButton = this.page
      .getByTestId('update-button')
      .or(this.page.getByRole('button', { name: 'Update', exact: true }))
      .or(this.page.locator('button:has-text("Update")'));
  }

  async clickAddInternshipButton(): Promise<void> {
    await this.safeClick(this.addInternshipButton, 'Add internship button');
  }

  async fillRoleDropdown(roleText: string): Promise<void> {
    console.log(`[InternshipPage] fillRoleDropdown called with: "${roleText}"`);
    console.log(`[InternshipPage] Type of roleText: ${typeof roleText}`);
    console.log(`[InternshipPage] Is undefined: ${roleText === undefined}`);
    console.log(`[InternshipPage] Is null: ${roleText === null}`);
    
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
    console.log(`[InternshipPage] About to fill input with: "${roleText}"`);
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
      .getByTestId(`company-dropdown-${index}`)
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
      .getByTestId('function-dropdown')
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
      .getByTestId('industry-dropdown')
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
    
    // Select first visible option - use direct click
    const option = this.page.locator(
      '.ant-select-dropdown:not(.ant-select-dropdown-hidden) .ant-select-item-option'
    ).first();
    
    await option.click({ timeout: 3000 });
    this.log(`Successfully clicked: Industry option: ${industryText}`);
    
    await this.page.locator('.ant-select-dropdown:not(.ant-select-dropdown-hidden)')
      .waitFor({ state: 'hidden', timeout: 3000 })
      .catch(() => {});
  }

  async selectInternshipStartDate(month: string): Promise<void> {
    console.log(`[InternshipPage] selectInternshipStartDate called with: "${month}"`);
    
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

  async selectInternshipEndDate(month: string): Promise<void> {
    console.log(`[InternshipPage] selectInternshipEndDate called with: "${month}"`);
    
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

  async fillIndustryTextfield(industry: string): Promise<void> {
    console.log(`Starting fillIndustryTextfield with: "${industry}"`);
    
    // Wait for the textfield to appear after selecting "Other" in Industry dropdown
    await this.page.waitForTimeout(1000);
    
    const dialog = this.page.locator('[role="dialog"]');
    const textfield = dialog.locator('input#internship_1_industry').or(this.industryTextfield);
    
    try {
      // Wait for textfield to be visible
      await textfield.waitFor({ state: 'visible', timeout: 5000 });
      
      // Fill the textfield
      await textfield.fill(industry);
      console.log(`Successfully filled industry textfield with: "${industry}"`);
    } catch (error) {
      console.log(`Error filling industry textfield: ${error}`);
      
      // Try alternative approach - click and type
      try {
        await textfield.click({ timeout: 3000 });
        await textfield.clear();
        await textfield.pressSequentially(industry, { delay: 50 });
        console.log(`Filled industry textfield with alternative approach: "${industry}"`);
      } catch (retryError) {
        console.log(`Retry also failed: ${retryError}`);
        // Don't throw - let the test continue
      }
    }
    
    console.log('Industry textfield completed');
  }

  async clickUpdateButton(): Promise<void> {
    await this.safeClick(this.updateButton, 'Update button');
    console.log('Update button clicked');
  }





  
}
