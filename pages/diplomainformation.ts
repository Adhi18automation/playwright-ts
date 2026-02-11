import { Page, Locator } from '@playwright/test';
import { BasePage } from './basepage';
import { AntdCollegeUtil } from '../utils/AntdCollegeUtil.ts';
import { AntdDropdownUtil } from '../utils/AntdDropdownUtil.ts';

export class DiplomaInformationPage extends BasePage {
  private readonly stateDropdown: Locator;
  private readonly cityDropdown: Locator;
  private readonly collegeDropdown: Locator;
  private readonly institutionInput: Locator;
  private readonly marksTypeDropdown: Locator;
  private readonly percentageMarksInput: Locator;
  private readonly cgpaMarksInput: Locator;
  private readonly cgpaOutOfInput: Locator;
  private readonly degreeDropdown: Locator;

  constructor(page: Page) {
    super(page);
    
    const dialog = this.page.locator('[role="dialog"]');
    
    this.stateDropdown = dialog
      .getByTestId('diploma-state-dropdown')
      .or(dialog.locator('span:has-text("State")').locator('..').locator('..').locator('div[class*="ant-select-selector"]').nth(1));
    
    this.cityDropdown = dialog
      .getByTestId('diploma-city-dropdown')
      .or(dialog.locator('span:has-text("City")').locator('..').locator('..').locator('div[class*="ant-select-selector"]').nth(1));
    
    this.collegeDropdown = dialog
      .getByTestId('diploma-college-dropdown')
      .or(dialog.locator('span:has-text("College Name *")').locator('..').locator('input[type="search"]').nth(1));
    
    this.institutionInput = this.page
      .getByTestId('diploma-institution-input')
      .or(this.page.locator('#diploma_0_institutionName'))
      .or(this.page.locator("input[placeholder*='Institution']").first());
    
    this.marksTypeDropdown = dialog
      .getByTestId('diploma-marks-type-dropdown')
      .or(dialog.locator('span:has-text("Marks (percentage) *")').locator('..').locator('..').locator('span[class*="ant-select-selection-item"]').nth(1));
    
    this.percentageMarksInput = this.page
      .getByTestId('diploma-percentage-marks')
      .or(this.page.locator('#diploma_0_marks'));
    
    this.cgpaMarksInput = this.page
      .getByTestId('diploma-cgpa-marks')
      .or(this.page.locator('#diploma_0_cgpaValue'));
    
    this.cgpaOutOfInput = this.page
      .getByTestId('diploma-cgpa-outof')
      .or(this.page.locator('#diploma_0_cgpaOutof'));
    
    this.degreeDropdown = dialog
      .getByTestId('diploma-degree-dropdown')
      .or(dialog.locator('span:has-text("Degree")').locator('..').locator('..').locator('div[class*="ant-select-selector"]').nth(1));
  }

  async fillStateDropdown(stateText: string): Promise<void> {
    await this.selectAntdDropdown(this.stateDropdown, stateText, 'Diploma State dropdown');
  }

  async fillCityDropdown(cityText: string): Promise<void> {
    await this.selectAntdDropdown(this.cityDropdown, cityText, 'Diploma City dropdown');
  }

  async fillCollegeDropdown(collegeText: string): Promise<void> {
    await AntdCollegeUtil.selectCollegeWithFallback(
      this.page,
      this.collegeDropdown,
      collegeText
    );
  }

  async fillInstitutionName(institutionName: string): Promise<void> {
    await this.waitForNavigation();
    
    const primaryInput = this.page
      .getByTestId('diploma-institution-input')
      .or(this.page.locator('#diploma_0_institutionName'));
    
    const fallback1 = this.page.locator("input[placeholder*='Institution']").first();
    const fallback2 = this.page.locator("label:has-text('Institution Name') + input").first();
    
    try {
      await this.safeFill(primaryInput, institutionName, 'Institution name input', { timeout: 5000 });
    } catch (error) {
      try {
        await this.safeFill(fallback1, institutionName, 'Institution name input (fallback 1)', { timeout: 3000 });
      } catch (error2) {
        await this.safeFill(fallback2, institutionName, 'Institution name input (fallback 2)', { timeout: 3000 });
      }
    }
  }

  async selectDiplomaYear(year: number | string): Promise<void> {
    const yearInput = this.page
      .getByTestId('diploma-year-input')
      .or(this.page.locator("input[placeholder='Please Select the year']").nth(2));

    await this.safeClick(yearInput, 'Diploma year input');

    const picker = this.page.locator('.ant-picker-dropdown:visible');
    await this.waitForVisible(picker);

    const yearCell = picker.locator(`.ant-picker-cell-inner:text-is("${year}")`);

    if (await yearCell.isVisible()) {
      await this.safeClick(yearCell, `Year cell: ${year}`);
    } else {
      const decadeStart = Math.floor(Number(year) / 10) * 10;
      const decadeLabel = `${decadeStart}-${decadeStart + 9}`;

      await this.safeClick(picker.locator('.ant-picker-header-view'), 'Decade view header');
      await this.safeClick(picker.locator(`.ant-picker-cell-inner:text-is("${decadeLabel}")`), `Decade: ${decadeLabel}`);
      await this.safeClick(picker.locator(`.ant-picker-cell-inner:text-is("${year}")`), `Year: ${year}`);
    }

    await picker.waitFor({ state: 'hidden' });
  }

  async clickMarksTypeDropdown(): Promise<void> {
    await this.safeClick(this.marksTypeDropdown, 'Marks type dropdown');
  }

  async selectPercentageOption(): Promise<void> {
    const percentageOption = this.page
      .getByTestId('percentage-option')
      .or(this.page.locator('#Percentage'))
      .or(this.page.getByRole('option', { name: /percentage/i }));
    
    await this.safeClick(percentageOption, 'Percentage option');
  }

  async selectCGPAOption(): Promise<void> {
    const cgpaOption = this.page
      .getByTestId('cgpa-option')
      .or(this.page.locator('#CGPA'))
      .or(this.page.getByRole('option', { name: /cgpa/i }));
    
    await this.safeClick(cgpaOption, 'CGPA option');
  }

  async fillPercentageMarks(marks: string): Promise<void> {
    await this.safeFill(this.percentageMarksInput, marks, 'Percentage marks input');
    await this.percentageMarksInput.blur();
  }

  async fillCGPAMarks(marks: string): Promise<void> {
    await this.safeFill(this.cgpaMarksInput, marks, 'CGPA marks input');
    await this.cgpaMarksInput.blur();
  }

  async fillCGPAOutOf(cgpaOutOf: string): Promise<void> {
    await this.safeFill(this.cgpaOutOfInput, cgpaOutOf, 'CGPA out of input');
    await this.cgpaOutOfInput.blur();
  }

  async fillDegreeDropdown(degreeText: string): Promise<void> {
    await this.selectAntdDropdown(this.degreeDropdown, degreeText, 'Diploma Degree dropdown');
  }

  async fillDepartmentDropdown(departmentText: string): Promise<void> {
    const departmentDropdown = this.page.locator('[role="dialog"]')
      .getByTestId('diploma-department-dropdown')
      .or(this.page.locator('[role="dialog"]').locator('span:has-text("Department")').locator('..').locator('..').locator('div[class*="ant-select-selector"]').nth(1));
    
    await this.selectAntdDropdown(departmentDropdown, departmentText, 'Diploma Department dropdown');
  }
}
