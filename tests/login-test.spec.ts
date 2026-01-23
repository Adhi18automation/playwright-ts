import { test } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { HomePage } from '../pages/homePage';
import { InsideMyResumePage } from '../pages/insidemyresume';
import { InternshipPage } from '../pages/internship';
import { PersonalInformationPage } from '../pages/personalinformationpage';
import { EducationalPage } from '../pages/educational';
import { TwelfthInformationPage } from '../pages/12thinformation';
import { DiplomaInformationPage } from '../pages/diplomainformation';
import { WorkExperiencePage } from '../pages/workexperience';

import * as fs from 'fs';

const loginData = JSON.parse(fs.readFileSync('./testdata/loginData.json', 'utf8'));
const addressData = JSON.parse(fs.readFileSync('./testdata/address-data.json', 'utf8'));
const marksData = JSON.parse(fs.readFileSync('./testdata/marks-data.json', 'utf8'));
const internshipData = JSON.parse(fs.readFileSync('./testdata/internship-data.json', 'utf8'));
const workExperienceData = JSON.parse(fs.readFileSync('./testdata/workexperience-data.json', 'utf8'));

test('END TO END Student Onboarding', async ({ page }) => {

  for (let i = 0; i < Math.min(loginData.length, addressData.length, marksData.length, internshipData.length, workExperienceData.length); i++) {

    const loginUser = loginData[i];
    const addressUser = addressData[i];
    const marksUser = marksData[i];
    const internshipUser = internshipData[i];
    const workExperienceUser = workExperienceData[i];

    // ================= LOGIN =================
    const loginPage = new LoginPage(page);
    await loginPage.openApplication();
    await loginPage.login(loginUser.STUDENTMAIL, loginUser.PASSWORD);

    const homePage = new HomePage(page);
    await homePage.clickResumeButton();

    const resumePage = new InsideMyResumePage(page);


        // ================= WORK EXPERIENCE =================
    await resumePage.clickWorkExperienceIcon();

    const workExperiencePage = new WorkExperiencePage(page);
    await workExperiencePage.clickAddWorkExperienceButton();
    await workExperiencePage.fillRoleDropdown(workExperienceUser.ROLE);
    await workExperiencePage.fillCompanyNameDropdown(workExperienceUser.COMPANY);
    await workExperiencePage.fillFunctionDropdown(workExperienceUser.FUNCTION);
    await workExperiencePage.fillIndustryDropdown(workExperienceUser.INDUSTRY);
    await workExperiencePage.fillIndustryTextfield(workExperienceUser.INDUSTRY);
    await workExperiencePage.selectWorkExperienceStartDate(workExperienceUser.START_DATE);
    await workExperiencePage.selectWorkExperienceEndDate(workExperienceUser.END_DATE);
    // Employment type selection with if-else statements
    if (workExperienceUser.EMPLOYMENT_TYPE === 'Full-time') {
      await workExperiencePage.selectFullTimeEmployment();
    } else if (workExperienceUser.EMPLOYMENT_TYPE === 'Part-time') {
      await workExperiencePage.selectPartTimeEmployment();
    }
      await workExperiencePage.fillTitleTextfield(workExperienceUser.TITLE);
      await workExperiencePage.fillSkillsDropdown(workExperienceUser.SKILLS);
      await workExperiencePage.clickSubmitButton();
 
  
    // ================= INTERNSHIP =================
    await resumePage.clickInternshipIcon();

    const internshipPage = new InternshipPage(page);
    await internshipPage.clickAddInternshipButton();
    
    await internshipPage.fillRoleDropdown(internshipUser.ROLE);
    await internshipPage.fillCompanyNameDropdown(internshipUser.COMPANY);
    await internshipPage.fillFunctionDropdown(internshipUser.FUNCTION);
    await internshipPage.fillIndustryDropdown(internshipUser.INDUSTRY);
    await internshipPage.selectInternshipStartDate(internshipUser.START_DATE);
    await internshipPage.selectInternshipEndDate(internshipUser.END_DATE);
    await internshipPage.fillSingleSkill(internshipUser.SKILLS);
    await internshipPage.clickUpdateButton();   

 // ================= EDUCATION =================
    await resumePage.clickEducationsIcon();

    const educationPage = new EducationalPage(page);
    await educationPage.fillBoardDropdown("HSC (Higher Secondary Certificate)");
    await educationPage.fillMarks(marksUser.MARKS);
    await educationPage.selectYear(2019);
    await educationPage.clickQualification12thButton();

    if (marksUser.QUALIFICATION === '12th') {

      await educationPage.click12thOption();
      const twelfth = new TwelfthInformationPage(page);
      await twelfth.fill12thBoardDropdown(marksUser.BOARD_12TH);
      await twelfth.select12thYear(marksUser.YEAR_12TH);
      await twelfth.fill12thMarks(marksUser.MARKS_12TH); 

    } else {

      await educationPage.clickDiplomaOption();
      const diploma = new DiplomaInformationPage(page);

      await diploma.fillStateDropdown(marksUser.STATE_DIPLOMA);
      await diploma.fillCityDropdown(marksUser.CITY_DIPLOMA);
      await diploma.fillCollegeDropdown(marksUser.COLLEGE_DIPLOMA);
      await diploma.fillInstitutionName(marksUser.COLLEGE_DIPLOMA);
      await diploma.selectDiplomaYear(marksUser.YEAR_DIPLOMA);

      await diploma.clickMarksTypeDropdown();
      if (marksUser.MARKS_TYPE === 'Percentage') {
        await diploma.selectPercentageOption();
        await diploma.fillPercentageMarks(marksUser.MARKS_DIPLOMA);
      } else {
        await diploma.selectCGPAOption();
        await diploma.fillCGPAMarks(marksUser.MARKS_DIPLOMA);
        await diploma.fillCGPAOutOf(marksUser.CGPA_OUT_OF);
      }

      await diploma.fillDegreeDropdown(marksUser.DEGREE);
      await diploma.fillDepartmentDropdown(marksUser.DEPARTMENT);
    }

    await educationPage.clickUpdateButton();


     // 🔥 MUST WAIT
    await page.locator('[role="dialog"]').waitFor({ state: 'hidden' });
    await page.locator('.ant-select-dropdown').waitFor({ state: 'detached' });
    await page.locator('.ant-picker-dropdown').waitFor({ state: 'detached' });
    await page.waitForTimeout(500);


      // ================= PERSONAL INFO =================
    await resumePage.clickAdditionalInformationIcon();

    const personal = new PersonalInformationPage(page);
    await personal.clickAnywhereCheckbox();
    await personal.clickSameAsPermanentAddressCheckbox();

    await personal.fillCountry(addressUser.COUNTRY);
    await personal.fillState(addressUser.STATE);
    await personal.fillCity(addressUser.CITY);
    await personal.fillPinCode(String(addressUser.POSTALCODE));

    await personal.clickUpdateButton();

      // 🔥 MUST WAIT AGAIN
    await page.locator('[role="dialog"]').waitFor({ state: 'hidden' });
    await page.locator('.ant-select-dropdown').waitFor({ state: 'detached' });
    await page.waitForTimeout(500);

  }
});
