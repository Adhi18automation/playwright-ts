import { Page, Locator } from '@playwright/test';
import { BasePage } from './basepage';
import { AntdDropdownUtil } from '../utils/AntdDropdownUtil.ts';

export class TwelfthInformationPage extends BasePage {
  private readonly marksInput: Locator;

  constructor(page: Page) {
    super(page);
    
    this.marksInput = this.page
      .getByTestId('twelfth-marks-input')
      .or(this.page.locator('#twelfth_marks'));
  }

  async fillBoardDropdownByIndex(
    boardText: string,
    index: number
  ): Promise<void> {
    this.log(`Filling Board dropdown (index ${index}) with: ${boardText}`);
    
    const boardSelector = this.page
      .getByTestId(`board-dropdown-${index}`)
      .or(this.page.locator('span:has-text("Board *")').locator('..').locator('..').locator('div[class*="ant-select-selector"]').nth(index));

    // Click the dropdown selector
    await this.safeClick(boardSelector, `Board dropdown selector (index ${index})`);
    
    // Wait for dropdown panel to open
    await this.page.waitForSelector('.ant-select-dropdown:not(.ant-select-dropdown-hidden)', { 
      state: 'visible', 
      timeout: 3000 
    });
    
    // Find the visible editable input within the opened dropdown area
    const input = this.page.locator('input[role="combobox"]:not([readonly])').last();
    await this.safeFill(input, boardText, `Board dropdown input (index ${index})`, { validate: false });
    
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

  async select12thYear(year: number | string): Promise<void> {
    const yearInput = this.page
      .getByTestId('twelfth-year-input')
      .or(this.page.locator("input[placeholder='Please Select the year']").nth(2));

    await this.safeClick(yearInput, '12th year input');

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

  async fill12thMarks(marks: string | number) {
    await this.safeFill(this.marksInput, marks.toString(), '12th marks input');
  }
}

