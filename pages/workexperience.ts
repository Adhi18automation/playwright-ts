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
      .or(this.page.getByRole('button', { name: /add work experience/i }))
      .or(this.page.locator('div:has-text("Add Work Experience")'));
    
    this.roleDropdown = this.page
      .getByTestId('work-role-dropdown')
      .or(this.page.locator('span:has-text("Role *")').locator('..').locator('div[class*="ant-select-selector"]'));
    
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
  }

  async fillRoleDropdown(roleText: string): Promise<void> {
    await this.selectAntdDropdown(this.roleDropdown, roleText, 'Work Role dropdown');
  }

  async fillCompanyDropdownByIndex(
    companyName: string,
    index: number
  ): Promise<void> {
    const dialog = this.page.locator('[role="dialog"]');

    const companySelector = dialog
      .getByTestId(`work-company-dropdown-${index}`)
      .or(dialog.locator('span:has-text("Company Name *")').locator('..').locator('..').locator('div[class*="ant-select-selector"]').nth(index));

    await this.selectAntdDropdown(companySelector, companyName, `Work Company dropdown (index ${index})`);
  }

  async fillFunctionDropdown(functionName: string): Promise<void> {
    console.log(`Looking for function: "${functionName}"`);
    
    const dialog = this.page.locator('[role="dialog"]');

    const selector = dialog
      .getByTestId('work-function-dropdown')
      .or(dialog.locator('span:has-text("Function *")').locator('..').locator('..').locator('div[class*="ant-select-selector"]'));

    try {
      await this.selectAntdDropdown(selector, functionName, 'Work Function dropdown');
      console.log(`✅ Function successfully selected: "${functionName}"`);
    } catch (error) {
      console.log(`Primary selection failed, trying keyboard approach`);
      
      const input = dialog
        .locator('span:has-text("Function *")')
        .locator('..')
        .locator('..')
        .locator('input[role="combobox"]');
      
      await this.safeClick(selector, 'Work Function dropdown selector');
      await this.safeFill(input, functionName, 'Work Function dropdown input', { validate: false });
      await this.page.keyboard.press('ArrowDown');
      await this.page.keyboard.press('Enter');
      
      console.log(`✅ Function selected via keyboard: "${functionName}"`);
    }
  }










  async fillIndustryDropdown(industryText: string): Promise<void> {
    const dialog = this.page.locator('[role="dialog"]');

    const selector = dialog
      .getByTestId('work-industry-dropdown')
      .or(dialog.locator('span:has-text("Industry *")').locator('..').locator('..').locator('div[class*="ant-select-selector"]'));

    await this.selectAntdDropdown(selector, industryText, 'Work Industry dropdown');
  }

  async fillIndustryTextfield(industry: string): Promise<void> {
    console.log(`Starting fillIndustryTextfield with: "${industry}"`);
    
    try {
      await this.safeFill(this.industryTextfield, industry, 'Work Industry textfield');
      console.log(`Successfully filled industry textfield with: "${industry}"`);
    } catch (error) {
      console.log(`Error filling industry textfield: ${error}`);
      await this.safeClick(this.industryTextfield, 'Work Industry textfield');
      await this.industryTextfield.clear();
      await this.safeFill(this.industryTextfield, industry, 'Work Industry textfield (retry)', { validate: false });
      console.log(`Filled industry textfield with alternative approach: "${industry}"`);
    }
    
    console.log('Industry textfield completed');
  }

  async selectWorkExperienceStartDate(month: string): Promise<void> {
    const startDateSelector = "[data-testid='work-start-date'], input[placeholder='Please Select the year']:nth-of-type(1)";
    
    await AntdMonthPickerUtil.selectMonth(
      this.page,
      startDateSelector,
      month
    );
  }

  async selectWorkExperienceEndDate(month: string): Promise<void> {
    const endDateSelector = "[data-testid='work-end-date'], input[placeholder='Please Select the year']:nth-of-type(2)";
    
    await AntdMonthPickerUtil.selectMonth(
      this.page,
      endDateSelector,
      month
    );
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
    
    try {
      await this.safeFill(this.titleTextfield, title, 'Work Title textfield');
      console.log(`Successfully filled title textfield with: "${title}"`);
    } catch (error) {
      console.log(`Error filling title textfield: ${error}`);
      await this.safeClick(this.titleTextfield, 'Work Title textfield');
      await this.titleTextfield.clear();
      await this.safeFill(this.titleTextfield, title, 'Work Title textfield (retry)', { validate: false });
      console.log(`Filled title textfield with alternative approach: "${title}"`);
    }
    
    console.log('Title textfield completed');
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
