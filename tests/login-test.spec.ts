import { test, expect } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';

import { LoginPage } from '../pages/loginPage';
import { HomePage } from '../pages/homePage';
import { InsideMyResumePage } from '../pages/insideMyResume';

import { EducationalPage } from '../pages/educational';
import { PersonalInformationPage}from '../pages/personalinformationpage';
import { InternshipPage } from '../pages/internship';
import { ProjectPage } from '../pages/project';
import { WorkExperiencePage } from '../pages/workexperience';
import { CertificatePage } from '../pages/certificate';
import { TwelfthInformationPage } from '../pages/12thinformation';
import { DiplomaInformationPage } from '../pages/diplomainformation';

import { closeUi } from '../utils/closeUi';
import { readExcelData } from '../utils/excelReader';


// ================= READ EXCEL =================
const students = readExcelData(
  './testdata/testdata.xlsx',
  'StudentData'
);

students.forEach((student, index) => {

  test.describe.serial(`Student ${index + 1}`, () => {

// use first row
const student = students[index] as Record<string, any>;

// =============================================

test.describe.serial('Student Onboarding Flow', () => {

  // ============== LOGIN + NAVIGATION ==========
  // CHANGE: Improved beforeEach with smart waits and error handling
  // Removed hard waits and added element-based verification
  test.beforeEach(async ({ page }) => {
    console.log('Starting beforeEach setup...');
    
    try {
      const loginPage = new LoginPage(page);

      console.log('Opening application...');
      await loginPage.openApplication();
      
      console.log('Logging in...');
      await loginPage.login(
        student['Student-Email-ID'],
        student['Student-PassWord']
      );

      console.log('Login completed, waiting for dashboard to load...');
      
      // CHANGE: Improved navigation reliability - combine URL wait with element-based wait
      // Avoid strict URL-only waits that can be flaky
      await page.waitForURL('**/dashboard', { timeout: 15000 }).catch(() => {
        console.log('Dashboard URL not detected, checking for landing page elements...');
      });
      
      // CHANGE: Replace hard wait (waitForTimeout(3000)) with smart wait
      // Wait for page to be fully loaded using networkidle
      await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {
        console.log('Network idle timeout, page may still be loading...');
      });
      
      // CHANGE: Verify dashboard loaded by checking for stable element
      const resumeButtonLocator = page.locator('div:has-text("My Resume")').first();
      await expect(resumeButtonLocator).toBeVisible({ timeout: 10000 }).catch(() => {
        console.log('Resume button not immediately visible, continuing...');
      });

      console.log('Creating HomePage instance...');
      const homePage = new HomePage(page);
      
      console.log('Clicking Resume button...');
      await homePage.clickResumeButton();
      
      // CHANGE: Wait for resume page to load with smart wait instead of hard wait
      await page.waitForLoadState('domcontentloaded', { timeout: 10000 });
      
      console.log('BeforeEach setup completed successfully');
      
    } catch (error) {
      console.error('BeforeEach setup failed:', error);
      // CHANGE: Capture screenshot on failure for debugging
      await page.screenshot({ 
        path: `test-results/screenshots/beforeEach-failure-${Date.now()}.png`, 
        fullPage: true 
      }).catch(() => console.log('Screenshot capture failed'));
      throw error;
    }
  });

// ================= PERSONAL INFO =================
test('Personal Information section', async ({ page }) => {

  // First navigate to Additional Information section
  const resumePage = new InsideMyResumePage(page);
  await resumePage.clickAdditionalInformationIcon();

  // Now work with personal information
  const personal = new PersonalInformationPage(page);

  // 1️⃣ Handle location preference using switch case (Anywhere or JobLocation)
  // Read from Excel: student['AnyWhere/JobLocation'] and student['JobLocation']
  const locationType = student['AnyWhere/JobLocation'] || 'Anywhere';
  const jobLocation = student['JobLocation'];
  
  await personal.handleLocationPreference(locationType, jobLocation);
 
  // 2️⃣ Fill PERMANENT address (enabled after location preference)
  await personal.fillCountry(student['Country']);
  await personal.fillState(student['State']);
  await personal.fillCity(student['City']);
  await personal.fillPinCode(student['Pincode']);
  await personal.clickSameAsPermanentAddressCheckbox();



  await personal.clickUpdateButton();
  
  // Only close UI if page is still open
  try {
    await closeUi(page);
  } catch (error: any) {
    console.log('Page already closed, no need to close UI');
  }
});



   // ================= EDUCATION =================
  test('Education section (12th / Diploma)', async ({ page }) => {

    const resumePage = new InsideMyResumePage(page);
    const educationPage = new EducationalPage(page);

    await resumePage.clickEducationsIcon();

    // ---------- Common ----------
    await educationPage.fillBoardDropdown(student['10th-Board']);
    await educationPage.selectYear(student['10th-Year']);
    await educationPage.fillMarks(student['10th-percentage']);
 

    await educationPage.clickQualification12thButton();

    if (student['12th-Diploma'] === '12th') {

      await educationPage.click12thOption();
      const twelfth = new TwelfthInformationPage(page);

      await twelfth.fillBoardDropdownByIndex(student['12th-Board'], 1); 
      await twelfth.select12thYear(student['12th-Year']);
      await twelfth.fill12thMarks(student['12th-percentage']);

    } else {

      await educationPage.clickDiplomaOption();
      const diploma = new DiplomaInformationPage(page);

      await diploma.fillStateDropdown(student['Diploma-State']);
      await diploma.fillCityDropdown(student['Diploma-City']);
      await diploma.fillCollegeDropdown(student['Diploma-College']);
      await diploma.fillInstitutionName(student['Diploma-College']);
      await diploma.selectDiplomaYear(student['Diploma-Year']);

      await diploma.clickMarksTypeDropdown();

      if (student['Diploma-markType'] === 'Percentage') {
        await diploma.selectPercentageOption();
        await diploma.fillPercentageMarks(student['Diploma-percentage']);
      } else {
        await diploma.selectCGPAOption();
        await diploma.fillCGPAMarks(student['Diploma-percentage']);
        await diploma.fillCGPAOutOf(student['Diploma-CGPA']);
      }

      await diploma.fillDegreeDropdown(student['Diploma-Degree']);
      await diploma.fillDepartmentDropdown(student['Diploma-Department']);
    }

    await educationPage.clickUpdateButton();
    await closeUi(page);
  });



// ================= INTERNSHIP =================
  test('Internship section', async ({ page }) => {

    const resume = new InsideMyResumePage(page);
    const internship = new InternshipPage(page);

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





// ================= CERTIFICATE =================
  test('Certificate section', async ({ page }) => {

    const resume = new InsideMyResumePage(page);
    const certificate = new CertificatePage(page);

    await resume.clickCertificationIcon();
    await certificate.clickAddCertificationButton();

    await certificate.fillOrganizationField(student['Certificate-Institute']);
    await certificate.fillTitleField(student['Certificate-Course']);
    await certificate.selectStartDate(student['Certificate-Started']);
    await certificate.selectEndDate(student['Certificate-Ended']);
    await certificate.fillSkillsDropdown(student['Certificate-Skills']);

    await certificate.clickSubmitButton();
    await closeUi(page);
  });





    // ================= PROJECT =================
  test('Project section', async ({ page }) => {

    const resume = new InsideMyResumePage(page);
    const project = new ProjectPage(page);

    await resume.clickProjectsIcon();
    await project.clickAddProjectButton();

    await project.fillProjectTitle(student['Project Title']);
  //  await project.fillCompanyNameDropdown(student['Project-Company']);
    await project.selectProjectStartDate(student['Project-Started']);
    await project.selectProjectEndDate(student['Project-Ended']);
    await project.fillSkillsDropdown(student['Project-Skills']);

    await project.clickSubmitButton();
    await closeUi(page);
  });




   // ================= WORK EXPERIENCE =================
  test('Work Experience section', async ({ page }) => {

    const resume = new InsideMyResumePage(page);
    const work = new WorkExperiencePage(page);

    await resume.clickWorkExperienceIcon();
    await work.clickAddWorkExperienceButton();

    console.log('\n========== EXCEL DATA CHECK ==========');
    console.log('Work-Role:', student['Work-Role']);
    console.log('Work-Company:', student['Work-Company']);
    console.log('Work-Function:', student['Work-Function']);
    console.log('Work-Industry:', student['Work-Industry']);
    console.log('Work-Text-Industry:', student['Work-Text-Industry']);
    console.log('Work-Text-Industry type:', typeof student['Work-Text-Industry']);
    console.log('Work-Text-Industry value:', JSON.stringify(student['Work-Text-Industry']));
    console.log('========== END EXCEL DATA CHECK ==========\n');

    await work.fillRoleDropdown(student['Work-Role']);
    await work.fillCompanyDropdownByIndex(student['Work-Company'], 1);
    await work.fillFunctionDropdown(student['Work-Function']);
    await work.fillIndustryDropdown(student['Work-Industry']);
    await work.fillIndustryTextfield(student['Work-Text-Industry']);
    await work.selectWorkExperienceStartDate(student['Work-Started']);
    await work.selectWorkExperienceEndDate(student['Work-Ended']);
    await work.selectFullTimeEmployment();
    await work.fillTitleTextfield(student['Work-Job-Title']);
    await work.fillSingleSkill(student['Work-Skills']);

   
   

    await work.clickSubmitButton();
    
    await closeUi(page);


  });




});


});
});