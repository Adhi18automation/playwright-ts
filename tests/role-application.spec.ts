import { test, expect } from '@playwright/test';
import * as path from 'path';
import { LoginPage } from '../pages/loginpage';
import { RoleApplicationPage } from '../pages/roleApplicationPage';
import { readExcelData } from '../utils/excelReader';

// ================= READ EXCEL =================
// Try to read RoleApplicationData sheet, fallback to StudentData
let roleApplicationData: any[];
try {
  roleApplicationData = readExcelData(
    './testdata/testdata.xlsx',
    'RoleApplicationData'
  );
} catch (error) {
  console.log('RoleApplicationData sheet not found, using StudentData sheet');
  roleApplicationData = readExcelData(
    './testdata/testdata.xlsx',
    'StudentData'
  );
}

// If no data, use default test data
if (!roleApplicationData || roleApplicationData.length === 0) {
  roleApplicationData = [{
    'Student-Email-ID': 'test@example.com',
    'Student-PassWord': 'TestPass123',
    'Role-Name': 'Flow apprenticeship 1',
    'Skill-Option': '3',
    'Resume-File-Path': 'C:/test-data/resume.pdf'
  }];
}

// LIMIT TO FIRST ROW ONLY for Role Application testing
roleApplicationData = [roleApplicationData[0]];

roleApplicationData.forEach((data, index) => {

  test.describe.serial(`Role Application ${index + 1}`, () => {

    const testData = roleApplicationData[index] as Record<string, any>;
    
    // Add default values for missing columns
    testData['Role-Name'] = testData['Role-Name'] || 'Flow apprenticeship 1';
    testData['Skill-Option'] = testData['Skill-Option'] || '3';
    testData['Resume-File-Path'] = testData['Resume-File-Path'] || 'C:/test-data/resume.pdf';

    test.describe.serial('Role Application Flow', () => {

      let loginPage: LoginPage;
      let roleAppPage: RoleApplicationPage;

      // ============== LOGIN ==============
      test.beforeEach(async ({ page }) => {
        console.log('Starting Role Application Flow...');
        
        loginPage = new LoginPage(page);
        roleAppPage = new RoleApplicationPage(page);

        // Login
        console.log('1. Logging in...');
        await loginPage.openApplication();
        await loginPage.login(testData['Student-Email-ID'], testData['Student-PassWord']);
        
        // Wait for Dashboard
        await page.waitForURL('**/dashboard', { timeout: 15000 });
        console.log('✓ Dashboard loaded');
      });

      // ============== MAIN TEST: E2E Role Application (Single Option Selection) ==============
      test('TC-E2E: Complete Role Application - Single Skill Option', async ({ page }) => {
        const skillOption = String(testData['Skill-Option'] || '3'); // Convert to string and default to Option 3
        console.log(`\n=== E2E Flow: Skill Option ${skillOption} ===`);
        
        // 2. Navigate to Roles
        console.log('2. Navigating to Roles page...');
        await roleAppPage.navigateToRoles();
        console.log('✓ Roles page loaded');

        // 3. Search Role & Check Eligibility
        console.log('3. Searching for role and checking eligibility...');
        await roleAppPage.searchRole(testData['Role-Name']);
        await roleAppPage.clickCheckEligibility(testData['Role-Name']);
        console.log('✓ Eligibility page opened');

        // 4. Add Skill - Choose ONE option based on test data
        console.log(`4. Adding skill via Option ${skillOption}...`);
        await roleAppPage.clickMandatoryAddSkill();
        
        // Select EXACTLY ONE option based on Skill-Option value
        switch(skillOption) {
          case '1': // Academics
            const academicsType = testData['Skill-Academics'] || '10th';
            console.log(`   → Option 1: Academics (${academicsType})`);
            await roleAppPage.selectAcademicsCategory(academicsType as '10th' | '12th' | 'Both');
            break;
            
          case '2': // Internship
            console.log('   → Option 2: Internship');
            await roleAppPage.selectInternshipCategory();
            break;
            
          case '3': // Work Experience
            console.log('   → Option 3: Work Experience');
            await roleAppPage.selectWorkExperienceCategory();
            break;
            
          case '4': // Training Course
            console.log('   → Option 4: Training Course');
            await roleAppPage.selectTrainingCourseCategory();
            break;
            
          case '5': // Project
            console.log('   → Option 5: Project');
            await roleAppPage.selectProjectCategory();
            break;
            
          case '6': // Add Academics
          case '7': // Add Project
          case '8': // Add Internship
          case '9': // Add Certification
          case '10': // Add Work Experience
            console.log(`   → Option ${skillOption}: Add New Entry (Skill Selection Only)`);
            
            // Click the appropriate "Add" option
            if (skillOption === '6') await roleAppPage.clickAddAcademics();
            else if (skillOption === '7') await roleAppPage.clickAddProject();
            else if (skillOption === '8') await roleAppPage.clickAddInternship();
            else if (skillOption === '9') await roleAppPage.clickAddCertification();
            else if (skillOption === '10') await roleAppPage.clickAddWorkExperience();
            
            // Wait for form to open
            await page.waitForTimeout(1000);
            
            // Save with default/minimal data (no detailed form filling)
            const saveButton = page.locator('button:has-text("Save"), button:has-text("Submit"), button:has-text("Update")').first();
            await saveButton.click();
            await page.waitForLoadState('networkidle');
            console.log('   → Form saved (default data)');
            
            // Wait to return to Add Skill page
            await page.waitForTimeout(1000);
            
            // Select the newly created entry checkbox
            const newEntryCheckbox = page.locator('input[type="checkbox"]').first();
            await newEntryCheckbox.check();
            console.log('   → New entry checkbox selected');
            break;
            
          default:
            throw new Error(`Invalid Skill-Option: ${skillOption}. Must be 1-10.`);
        }
        
        await roleAppPage.clickAddAndVerify();
        await roleAppPage.clickUpdateAndApply();
        console.log('✓ Skill added successfully');

        // 5. Apply for Role
        console.log('5. Applying for role...');
        await roleAppPage.clickApplyForRole();
        
        const resumePath = path.resolve(testData['Resume-File-Path']);
        await roleAppPage.uploadResume(resumePath);
        await roleAppPage.clickApplyAndVerify();
        await roleAppPage.closeModal();
        console.log('✓ Application completed successfully');
      });


    });
  });
});
