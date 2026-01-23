import { BasePage } from './basepage';
import { AntdDropdownUtil } from '../utils/AntdDropdownUtil.ts';

export class EducationalPage extends BasePage {
async fillBoardDropdown(boardText: string): Promise<void> {
  await AntdDropdownUtil.fillSearchableDropdownWithFallback(
    this.page,
    'Board',
    boardText,
    1,
    false
  );
}

async selectYear(year: number): Promise<void> {
  const dialog = this.page.locator('[role="dialog"]');

  const yearInput = dialog
    .locator("input[placeholder='Please Select the year']:not([disabled])")
    .first();

  // 1️⃣ Open picker
  await yearInput.click();

  const picker = this.page.locator('.ant-picker-dropdown:visible');
  await picker.waitFor({ state: 'visible' });

  const yearCell = picker.locator(
    `.ant-picker-cell-inner:text-is("${year}")`
  );

  // 2️⃣ If year already visible (2020–2029 case) → click directly
  if (await yearCell.isVisible()) {
    await yearCell.click();
  } 
  // 3️⃣ Else → navigate via decade panel
  else {
    const decadeStart = Math.floor(year / 10) * 10;
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

  // 4️⃣ Ensure picker closed
  await picker.waitFor({ state: 'hidden' });
}

async fillMarks(marks: string): Promise<void> {
  const dialog = this.page.locator('[role="dialog"]');
  const marksInput = dialog.locator("//span[text()='Marks (percentage) *']/../..//input[@type='text']");
  
  await marksInput.waitFor({ state: 'visible' });
  await marksInput.fill(marks);
}

async clickUpdateButton(): Promise<void> {
  const dialog = this.page.locator('[role="dialog"]');
  const updateButton = dialog.locator("//div[text()='Update']");
  
  await updateButton.waitFor({ state: 'visible' });
  await updateButton.scrollIntoViewIfNeeded();
  await updateButton.click();
}

async clickQualification12thButton(): Promise<void> {
  const dialog = this.page.locator('[role="dialog"]');

  // Click the OUTER clickable container, not the text div
  const container = dialog.locator(
    "div.sc-iLWXdy.iduwOU"
  );

  await container.waitFor({ state: 'visible' });
  await container.scrollIntoViewIfNeeded();

  const box = await container.boundingBox();
  if (!box) {
    throw new Error('12th or Diploma container not found');
  }

  // REAL mouse click (this triggers React synthetic events)
  await this.page.mouse.click(
    box.x + box.width / 2,
    box.y + box.height / 2
  );
}


  
async click12thOption(): Promise<void> {
  const option12th = this.page.locator(
    '.ant-select-dropdown:visible .ant-select-item-option:has-text("12th")'
  );

  // Wait until visible (replaces Thread.sleep)
  await option12th.waitFor({ state: 'visible', timeout: 5000 });

  // Click normally (no force unless absolutely needed)
  await option12th.click();

  console.log('Clicked on 12th option');
}

async clickDiplomaOption(): Promise<void> {
  const optionDiploma = this.page.locator(
    '.ant-select-dropdown:visible .ant-select-item-option:has-text("Diploma")'
  );

  // Wait until visible
  await optionDiploma.waitFor({ state: 'visible', timeout: 5000 });

  // Click
  await optionDiploma.click();

  console.log('Clicked on Diploma option');
}



}
