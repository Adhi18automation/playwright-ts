import { test, expect, Page } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { AdminHomePage } from '../pages/adminhomepage';
import { InstitutePage } from '../pages/institutepage';
import { InstituteCheckinPage } from '../pages/institutecheckinpage';
import { StudentsPage } from '../pages/studentspage';
import { BulkUploadPage } from '../pages/bulkuploadpage';

export class NewStudent {
  private page: Page;
  public loginPage: LoginPage;

  constructor(page: Page) {
    this.page = page;
    this.loginPage = new LoginPage(page);
  }
}

test('New Student Login Test', async ({ page }) => {
  const bulkUploadTest = new NewStudent(page);
  
  // Call LoginPage through BulkUploadTest
  await bulkUploadTest.loginPage.openApplication();
  await bulkUploadTest.loginPage.login('Sailesh+001@pluginlive.com', 'Sailesh@2021');
  
  console.log('Login completed successfully through New Student test');
  
  // Create AdminHomePage instance and click Institutes
  const adminHome = new AdminHomePage(page);
  await adminHome.clickInstitutes();
  
  // Create InstitutePage instance and search for institute
  const institutePage = new InstitutePage(page);
  await institutePage.searchInstitute('Sailesh College Of Arts ');
  await institutePage.verifySearchResultsVisible();
  
  // Wait for search results to load completely
  await page.waitForTimeout(3000);
  
  // Find and click on the matching college "Sailesh College Of Arts"
  console.log('Looking for "Sailesh College Of Arts" in search results...');
  
  try {
    // Try to find the exact college name in search results and click it
    const collegeElement = page.locator('text=Sailesh College Of Arts').first();
    await collegeElement.waitFor({ state: 'visible', timeout: 10000 });
    await collegeElement.click();
    console.log('Successfully clicked on "Sailesh College Of Arts" from search results');
    
    // Wait a moment after selecting the college
    await page.waitForTimeout(2000);
  } catch (error) {
    console.log('Could not find exact college name, proceeding with first result...');
  }
  
  // Click on View span
  await institutePage.clickFirstView();
  
  // Click on Checkin div
  await institutePage.clickCheckin();
  
  // Wait a moment for page to load
  await page.waitForTimeout(2000);
  
  // Verify which page is displayed after checkin click
  const currentUrl = page.url();
  const pageTitle = await page.title();
  
  console.log(`After checkin click - Current URL: ${currentUrl}`);
  console.log(`After checkin click - Page Title: ${pageTitle}`);
  
  // Take screenshot to verify checkin click
  await page.screenshot({ path: 'test-results/checkin-page-verification.png', fullPage: true });
  console.log('Screenshot taken: checkin-page-verification.png');
  
  // Create InstituteCheckinPage instance and click Students
  const instituteCheckinPage = new InstituteCheckinPage(page);

  await instituteCheckinPage.clickStudents();
  
  // Create StudentsPage instance and click New Student
  const studentsPage = new StudentsPage(page);
  await studentsPage.verifyStudentsPageVisible();
  await studentsPage.clickNewStudent();
  
  // Take screenshot to verify search results
  await page.screenshot({ path: 'test-results/institute-search-results.png', fullPage: true });
  console.log('Screenshot taken: institute-search-results.png');
  
  console.log('Successfully completed New Student test');
});
