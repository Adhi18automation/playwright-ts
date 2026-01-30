import { test } from '@playwright/test';

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

// use first row
const student = students[0] as Record<string, any>;


// =============================================

test.describe.serial('Student Onboarding Flow', () => {

  // ============== LOGIN + NAVIGATION ==========
  test.beforeEach(async ({ page }) => {
    console.log('Starting beforeEach setup...');
    
    const loginPage = new LoginPage(page);

    console.log('Opening application...');
    await loginPage.openApplication();
    
    console.log('Logging in...');
    await loginPage.login(
      student['Student-Email-ID'],
      student['Student-PassWord']
    );

    console.log('Login completed, waiting for dashboard to load...');
    // Wait for URL to change to dashboard or home page
    await page.waitForURL('**/dashboard', { timeout: 15000 });
    await page.waitForTimeout(3000);

    console.log('Creating HomePage instance...');
    const homePage = new HomePage(page);
    
    console.log('Clicking Resume button...');
    await homePage.clickResumeButton();
    
    console.log('BeforeEach setup completed successfully');
  });


// ================= PERSONAL INFO =================
test('Personal Information section', async ({ page }) => {

  // First navigate to Additional Information section
  const resumePage = new InsideMyResumePage(page);
  await resumePage.clickAdditionalInformationIcon();

  // Now work with personal information
  const personal = new PersonalInformationPage(page);

  // 1️⃣ Select Anywhere (enables permanent address)
  await personal.clickAnywhereCheckbox();

  
  // 2️⃣ Fill PERMANENT address (enabled at this stage)
  await personal.fillCountry(student['Country']);
  await personal.fillState(student['State']);
  await personal.fillCity(student['City']);
  await personal.fillPinCode(student['Pincode']);



 await personal.clickSameAsPermanentAddressCheckbox();
  
  // Wait a bit to see if form completes
  await page.waitForTimeout(2000);

  await personal.clickUpdateButton();
  
  // Only close UI if page is still open
  try {
    await closeUi(page);
  } catch (error: any) {
    console.log('Page already closed, no need to close UI');
  }
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
    await project.fillCompanyNameDropdown(student['Project-Company']);
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


   

});
