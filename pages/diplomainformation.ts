import { BasePage } from './basepage';
import { AntdCollegeUtil } from '../utils/AntdCollegeUtil.ts';
import { AntdDropdownUtil } from '../utils/AntdDropdownUtil.ts';     

export class DiplomaInformationPage extends BasePage {
  
async fillStateDropdown(stateText: string): Promise<void> {
  await AntdDropdownUtil.fillSearchableDropdown(
    this.page,
    'State',
    stateText,
    2,
    true
  );
}

async fillCityDropdown(cityText: string): Promise<void> {
  await AntdDropdownUtil.fillSearchableDropdownWithFallback(
    this.page,
    'City',
    cityText,
    2,
    false
  );
}

  async fillCollegeDropdown(collegeText: string): Promise<void> {
    const dialog = this.page.locator('[role="dialog"]');

    const collegeInput = dialog.locator(
      "(//span[text()='College Name *'])[2]/..//input[@type='search']"
    );

    await AntdCollegeUtil.selectCollegeWithFallback(
      this.page,
      collegeInput,
      collegeText
    );
  }

  async fillInstitutionName(institutionName: string): Promise<void> {
    const institutionInput = this.page.locator("//input[@id='diploma_0_institutionName']");
    await institutionInput.waitFor({ state: 'visible' });
    await institutionInput.fill(institutionName);
  }

  async selectDiplomaYear(year: number | string): Promise<void> {
    // Diploma year input using the specific locator
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

  async clickMarksTypeDropdown(): Promise<void> {
    const dropdown = this.page.locator("(//span[text()='Marks (percentage) *'])[2]/../..//span[@class='ant-select-selection-item']");
    await dropdown.waitFor({ state: 'visible' });
    await dropdown.click();
  }

  async selectPercentageOption(): Promise<void> {
    const percentageOption = this.page.locator("//div[@id='Percentage']");
    await percentageOption.waitFor({ state: 'visible' });
    await percentageOption.click();
  }

  async selectCGPAOption(): Promise<void> {
    const cgpaOption = this.page.locator("//div[@id='CGPA']");
    await cgpaOption.waitFor({ state: 'visible' });
    await cgpaOption.click();
  }

  async fillPercentageMarks(marks: string): Promise<void> {
    const marksInput = this.page.locator("//input[@id='diploma_0_marks']");
    await marksInput.waitFor({ state: 'visible', timeout: 10000 });
    await marksInput.clear();
    await marksInput.fill(marks);
    await marksInput.blur(); // Ensure the input loses focus to trigger any validation
  }

  async fillCGPAMarks(marks: string): Promise<void> {
    const marksInput = this.page.locator("//input[@id='diploma_0_cgpaValue']");
    await marksInput.waitFor({ state: 'visible', timeout: 10000 });
    await marksInput.clear();
    await marksInput.fill(marks);
    await marksInput.blur(); // Ensure the input loses focus to trigger any validation
  }

  async fillCGPAOutOf(cgpaOutOf: string): Promise<void> {
    const cgpaOutOfInput = this.page.locator("//input[@id='diploma_0_cgpaOutof']");
    await cgpaOutOfInput.waitFor({ state: 'visible', timeout: 10000 });
    await cgpaOutOfInput.clear();
    await cgpaOutOfInput.fill(cgpaOutOf);
    await cgpaOutOfInput.blur(); // Ensure the input loses focus to trigger any validation
  }
async fillDegreeDropdown(degreeText: string): Promise<void> {
  await AntdDropdownUtil.fillSearchableDropdown(
    this.page,
    'Degree',
    degreeText,
    2,
    true
  );
}

async fillDepartmentDropdown(departmentText: string): Promise<void> {
  await AntdDropdownUtil.fillDepartmentDropdown(
    this.page,
    departmentText,
    true
  );
}



}
