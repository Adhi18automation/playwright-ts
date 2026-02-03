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
    const startDateSelector = "[data-testid='project-start-date'], input[placeholder='Please Select the year']:nth-of-type(1)";
    
    await AntdMonthPickerUtil.selectMonth(
      this.page,
      startDateSelector,
      month
    );
  }

  async selectProjectEndDate(month: string): Promise<void> {
    const endDateSelector = "[data-testid='project-end-date'], input[placeholder='Please Select the year']:nth-of-type(2)";
    
    await AntdMonthPickerUtil.selectMonth(
      this.page,
      endDateSelector,
      month
    );
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
