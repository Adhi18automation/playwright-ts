import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { HomePage } from '../pages/homePage';
import { InsideMyResumePage } from '../pages/insideMyResume';
import { InternshipPage } from '../pages/internship';
import { closeUi } from '../utils/closeUi';
import { readExcelData } from '../utils/excelReader';

const students = readExcelData('./testdata/testdata.xlsx', 'StudentData');
const student = students[0] as Record<string, any>;

test.describe('Internship Standalone Test', () => {
  test('Internship section', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    const resume = new InsideMyResumePage(page);
    const internship = new InternshipPage(page);

    await loginPage.openApplication();
    await loginPage.login(student['Student-Email-ID'], student['Student-PassWord']);
    
    await homePage.clickResumeButton();
    
    // Wait for resume page to fully load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Debug: Check what's on the page
    const pageContent = await page.content();
    console.log('Page has Internship text:', pageContent.includes('Internship'));
    
    await resume.clickInternshipIcon();
    await internship.clickAddInternshipButton();

    await internship.fillRoleDropdown(student['Intern-Role']);
    await internship.fillCompanyDropdownByIndex(student['Intern-Company'], 1);
    await internship.fillFunctionDropdown(student['Intern-Function']);
    await internship.fillIndustryDropdown(student['Intern-Industry']);
    await internship.fillIndustryTextfield(student['Intern-Text-Industry']);

    await internship.selectInternshipStartDate(student['Intern-Started']);
    await internship.selectInternshipEndDate(student['Intern-Ended']);
    await internship.fillSingleSkill(student['Intern-Skills']);
    await internship.clickUpdateButton();
    await closeUi(page);
  });
});
