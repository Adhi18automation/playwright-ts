import { BasePage } from './basepage';
import { AntdDropdownUtil } from '../utils/AntdDropdownUtil.ts';

export class TwelfthInformationPage extends BasePage {
  
async fillBoardDropdownByIndex(
  boardText: string,
  index: number // 0 = 10th, 1 = 12th
): Promise<void> {

  const boardSelector = this.page
    .locator("//span[normalize-space()='Board *']/../..//div[contains(@class,'ant-select-selector')]")
    .nth(index);

  const boardInput = this.page
    .locator("//span[normalize-space()='Board *']/../..//input[@role='combobox']")
    .nth(index);

  // 1️⃣ Open dropdown
  await boardSelector.waitFor({ state: 'visible', timeout: 10000 });
  await boardSelector.click();

  // 2️⃣ Type value
  await boardInput.type(boardText, { delay: 80 });

  // 3️⃣ Pick visible option
  const option = this.page.locator(
    ".ant-select-dropdown:not(.ant-select-dropdown-hidden) .ant-select-item-option-content",
    { hasText: boardText }
  );

  await option.first().waitFor({ state: 'visible', timeout: 5000 });
  await option.first().click();
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

  async fill12thMarks(marks: string | number) {
  const marksInput = this.page
    .locator("input[placeholder='Eg. 80.00']")
    .nth(1); // ✅ 12th marks

  await marksInput.waitFor({ state: 'visible', timeout: 10000 });
  await marksInput.click();
  await marksInput.fill(marks.toString());
}

}

