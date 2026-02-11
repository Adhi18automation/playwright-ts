import { Page, Locator } from '@playwright/test';
import { BasePage } from './basepage';
import { AntdMonthPickerUtil } from '../utils/AntdMonthPickerUtil';

export class ProjectPage extends BasePage {
  private readonly addProjectButton: Locator;
  private readonly projectTitleField: Locator;
  private readonly skillsDropdown: Locator;
  private readonly submitButton: Locator;
  private readonly companyNameDropdown: Locator;

  constructor(page: Page) {
    super(page);
    
    this.addProjectButton = this.page
      .getByTestId('add-project-button')
      .or(this.page.getByRole('button', { name: 'Add Project', exact: true }))
      .or(this.page.locator('button:has-text("Add Project")'));
    
    this.projectTitleField = this.page
      .getByTestId('project-title-field')
      .or(this.page.locator('#project_1_title'));
    
    this.skillsDropdown = this.page
      .getByTestId('project-skills-dropdown')
      .or(this.page.locator('span:has-text("Skills *")').locator('..').locator('..').locator('div[class*="ant-select-selector"]'));
    
    this.submitButton = this.page
      .getByTestId('submit-button')
      .or(this.page.getByRole('button', { name: /submit/i }))
      .or(this.page.locator('button[type="submit"]'));
    
    this.companyNameDropdown = this.page
      .getByTestId('project-company-dropdown')
      .or(this.page.locator('span:has-text("Company Name")').locator('..').locator('..').locator('div[class*="ant-select-selector"]'));
  }

  async clickAddProjectButton(): Promise<void> {
    await this.safeClick(this.addProjectButton, 'Add Project button');
  }

  async fillProjectTitle(title: string): Promise<void> {
    await this.safeFill(this.projectTitleField, title, 'Project title field');
  }

  async selectProjectStartDate(month: string): Promise<void> {
    console.log(`[ProjectPage] selectProjectStartDate called with: "${month}"`);
    
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

  async selectProjectEndDate(month: string): Promise<void> {
    console.log(`[ProjectPage] selectProjectEndDate called with: "${month}"`);
    
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

  async fillSkillsDropdown(skillsText: string): Promise<void> {
    console.log(`Starting fillSkillsDropdown with: "${skillsText}"`);
    
    await this.safeClick(this.skillsDropdown, 'Project Skills dropdown');

    const dialog = this.page.locator('[role="dialog"]');
    const input = dialog
      .getByTestId('project-skills-input')
      .or(dialog.locator('span:has-text("Skills *")').locator('..').locator('..').locator('input[class*="ant-select-selection-search-input"]'));

    await this.safeFill(input, skillsText, 'Project Skills input', { validate: false });

    await this.page.waitForSelector('.ant-select-dropdown:visible', { state: 'visible', timeout: 3000 }).catch(() => {});
    
    const dropdown = this.page.locator('.ant-select-dropdown:visible');
    
    if (await dropdown.isVisible()) {
      const options = dropdown.locator('.ant-select-item-option-content');
      const optionCount = await options.count();
      
      if (optionCount > 0) {
        try {
          const exactOption = dropdown.locator(`.ant-select-item-option-content:has-text("${skillsText}")`);
          if (await exactOption.isVisible()) {
            await this.safeClick(exactOption, `Skills option: ${skillsText}`);
          } else {
            await this.safeClick(options.first(), 'Skills option (first)');
          }
        } catch {
          await this.safeClick(options.first(), 'Skills option (first fallback)');
        }
      } else {
        await this.page.keyboard.press('ArrowDown');
        await this.page.keyboard.press('Enter');
      }
    } else {
      await this.page.keyboard.press('ArrowDown');
      await this.page.keyboard.press('Enter');
    }

    await this.page.locator('.ant-select-dropdown').first().waitFor({ state: 'hidden', timeout: 3000 }).catch(() => {});
    
    console.log('Skills dropdown completed');
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

  async fillCompanyNameDropdown(companyName: string): Promise<void> {
    console.log(`Starting fillCompanyNameDropdown with: "${companyName}"`);
    
    await this.safeClick(this.companyNameDropdown, 'Project Company Name dropdown');

    const dialog = this.page.locator('[role="dialog"]');
    const input = dialog
      .getByTestId('project-company-input')
      .or(dialog.locator('span:has-text("Company Name")').locator('..').locator('input[class*="ant-select-selection-search-input"]'));

    await this.safeFill(input, companyName, 'Project Company Name input', { validate: false });

    await this.page.waitForSelector('.ant-select-dropdown:visible', { state: 'visible', timeout: 3000 }).catch(() => {});
    
    const dropdown = this.page.locator('.ant-select-dropdown:visible');
    
    if (await dropdown.isVisible()) {
      const options = dropdown.locator('.ant-select-item-option-content');
      const optionCount = await options.count();
      
      if (optionCount > 0) {
        try {
          const exactOption = dropdown.locator(`.ant-select-item-option-content:has-text("${companyName}")`);
          if (await exactOption.isVisible()) {
            await this.safeClick(exactOption, `Company Name option: ${companyName}`);
          } else {
            await this.safeClick(options.first(), 'Company Name option (first)');
          }
        } catch {
          await this.safeClick(options.first(), 'Company Name option (first fallback)');
        }
      } else {
        await this.page.keyboard.press('ArrowDown');
        await this.page.keyboard.press('Enter');
      }
    } else {
      await this.page.keyboard.press('ArrowDown');
      await this.page.keyboard.press('Enter');
    }

    await this.page.locator('.ant-select-dropdown').first().waitFor({ state: 'hidden', timeout: 3000 }).catch(() => {});
    
    console.log('Company Name dropdown completed');
  }
}
