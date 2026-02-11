import { Page, Locator } from '@playwright/test';
import { BasePage } from './basepage';
import { AntdDropdownUtil } from '../utils/AntdDropdownUtil.ts';

export class EducationalPage extends BasePage {
  private readonly boardDropdown: Locator;
  private readonly marksInput: Locator;
  private readonly updateButton: Locator;

  constructor(page: Page) {
    super(page);
    
    this.boardDropdown = this.page
      .getByTestId('board-dropdown')
      .or(this.page.locator('span:has-text("Board *")').locator('..').locator('..').locator('div[class*="ant-select-selector"]'));
    
    this.marksInput = this.page.locator('#tenth_marks');
    
    this.updateButton = this.page
      .getByTestId('update-button')
      .or(this.page.getByRole('button', { name: /update/i }))
      .or(this.page.locator('button[type="submit"]'));
  }

  async fillBoardDropdown(boardText: string): Promise<void> {
    this.log(`Filling Board dropdown with: ${boardText}`);
    
    // Click the dropdown selector
    await this.safeClick(this.boardDropdown, 'Board dropdown selector');
    
    // Wait for dropdown to open and find the input
    const input = this.page.locator('input[role="combobox"]').first();
    await this.safeFill(input, boardText, 'Board dropdown input', { validate: false });
    
    // Wait for and click the matching option
    const option = this.page.locator(
      '.ant-select-dropdown:not(.ant-select-dropdown-hidden) .ant-select-item-option-content',
      { hasText: boardText }
    );
    
    await this.safeClick(option.first(), `Board option: ${boardText}`);
    
    // Wait for dropdown to close
    await this.page.locator('.ant-select-dropdown:not(.ant-select-dropdown-hidden)')
      .waitFor({ state: 'hidden', timeout: 3000 })
      .catch(() => {});
  }


  async selectYear(year: number): Promise<void> {
    const dialog = this.page.locator('[role="dialog"]');

    const yearInput = dialog
      .getByTestId('year-input')
      .or(dialog.locator("input[placeholder='Please Select the year']:not([disabled])"))
      .first();

    await this.safeClick(yearInput, 'Year input');

    const picker = this.page.locator('.ant-picker-dropdown:visible');
    await this.waitForVisible(picker);

    const yearCell = picker.locator(`.ant-picker-cell-inner:text-is("${year}")`);

    if (await yearCell.isVisible()) {
      await this.safeClick(yearCell, `Year cell: ${year}`);
    } else {
      const decadeStart = Math.floor(year / 10) * 10;
      const decadeLabel = `${decadeStart}-${decadeStart + 9}`;

      await this.safeClick(picker.locator('.ant-picker-header-view'), 'Decade view header');
      await this.safeClick(picker.locator(`.ant-picker-cell-inner:text-is("${decadeLabel}")`), `Decade: ${decadeLabel}`);
      await this.safeClick(picker.locator(`.ant-picker-cell-inner:text-is("${year}")`), `Year: ${year}`);
    }

    await picker.waitFor({ state: 'hidden' });
  }

  async fillMarks(marks: string | number) {
    await this.safeFill(this.marksInput, marks.toString(), 'Marks input');
  }

  async clickUpdateButton(): Promise<void> {
    await this.safeClick(this.updateButton, 'Update button');
  }

  async clickQualification12thButton(): Promise<void> {
    const dialog = this.page.locator('[role="dialog"]');

    const container = dialog
      .getByTestId('qualification-12th-button')
      .or(dialog.locator('div.sc-iLWXdy.iduwOU'));

    await this.waitForVisible(container);
    await container.scrollIntoViewIfNeeded();

    const box = await container.boundingBox();
    if (!box) {
      throw new Error('12th or Diploma container not found');
    }

    await this.page.mouse.click(
      box.x + box.width / 2,
      box.y + box.height / 2
    );
    this.log('Clicked qualification 12th button');
  }

  async click12thOption(): Promise<void> {
    const option12th = this.page
      .getByTestId('12th-option')
      .or(this.page.locator('.ant-select-dropdown:visible .ant-select-item-option:has-text("12th")'));

    await this.safeClick(option12th, '12th option', { timeout: 5000 });
  }

  async clickDiplomaOption(): Promise<void> {
    const optionDiploma = this.page
      .getByTestId('diploma-option')
      .or(this.page.locator('.ant-select-dropdown:visible .ant-select-item-option:has-text("Diploma")'));

    await this.safeClick(optionDiploma, 'Diploma option', { timeout: 5000 });
  }
}
