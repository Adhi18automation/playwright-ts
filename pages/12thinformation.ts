import { BasePage } from './basepage';
import { AntdDropdownUtil } from '../utils/AntdDropdownUtil.ts';

export class TwelfthInformationPage extends BasePage {
  
  async fill12thBoardDropdown(boardText: string): Promise<void> {
    await AntdDropdownUtil.fillSearchableDropdownWithFallback(
      this.page,
      'Board',
      boardText,
      2,
      false
    );
  }

  async select12thYear(year: number | string): Promise<void> {
    // 12th year input using the specific locator
    const yearInput = this.page.locator("(//input[@placeholder='Please Select the year'])[3]");

    // 1️⃣ Open picker
    await yearInput.waitFor({ state: 'visible' });
    await yearInput.click();

    // 2️⃣ Wait for calendar dropdown to appear
    const picker = this.page.locator('.ant-picker-dropdown:visible');
    await picker.waitFor({ state: 'visible' });

    // 3️⃣ Find and click the year
    const yearCell = picker.locator(
      `.ant-picker-cell-inner:text-is("${year}")`
    );

    // 4️⃣ If year already visible, click directly
    if (await yearCell.isVisible()) {
      await yearCell.click();
    } 
    // 5️⃣ Else navigate via decade panel
    else {
      const decadeStart = Math.floor(Number(year) / 10) * 10;
      const decadeLabel = `${decadeStart}-${decadeStart + 9}`;

      // Move to decade view
      await picker.locator('.ant-picker-header-view').click();

      // Select correct decade
      await picker
        .locator(`.ant-picker-cell-inner:text-is("${decadeLabel}")`)
        .click();

      // Select year
      await picker
        .locator(`.ant-picker-cell-inner:text-is("${year}")`)
        .click();
    }

    // 6️⃣ Ensure picker closed
    await picker.waitFor({ state: 'hidden' });
  }

  async fill12thMarks(marks: string): Promise<void> {
    const marksInput = this.page.locator("(//span[text()='Marks (percentage) *'])[2]/../..//input[@type='text']");
    
    await marksInput.waitFor({ state: 'visible' });
    await marksInput.fill(marks);
  }
}
