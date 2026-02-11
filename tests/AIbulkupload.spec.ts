import { test, expect, Page } from '@playwright/test';
import path from 'path';
import * as XLSX from 'xlsx';
import { AILoginPage } from '../pages/AILoginPage';
import { AIHomePage } from '../pages/AIHomePage';
import { AIInstitutePage } from '../pages/AIInstitutePage';
import { AIStudentPage } from '../pages/AIStudentPage';
import { AIBulkUploadFormPage } from '../pages/AIBulkUploadFormPage';

test.describe('Admin Student Bulk Upload Workflow', () => {
  const DATA_FILE_PATH = path.resolve(__dirname, '../testdata/Read_Data_for_blukupload.xlsx');
  const EXCEL_FILE_PATH = path.resolve(__dirname, '../testdata/bulckupload0.xlsx');




  test('Complete Admin Student Bulk Upload Flow', async ({ page }) => {
    // Read data from Excel file
    const workbook = XLSX.readFile(DATA_FILE_PATH);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);
    
    if (data.length === 0) {
      throw new Error('No data found in Excel file');
    }
    
    const testData = data[0] as any;
    console.log('Excel columns:', Object.keys(testData));
    
    const COLLEGE_NAME = testData['COLLEGE_NAME'] || testData['College Name'] || testData['College'] || testData['COLLEGE'];
    const DEGREE_NAME = testData['DEGREE_NAME'] || testData['Degree Name'] || testData['DEGREE'] || testData['Degree'];
    const DEPARTMENT_NAME = testData['DEPARTMENT_NAME'] || testData['Department Name'] || testData['DEPARTMENT'] || testData['Department'];
    
    console.log('Test Data from Excel:');
    console.log('College Name:', COLLEGE_NAME);
    console.log('Degree Name:', DEGREE_NAME);
    console.log('Department Name:', DEPARTMENT_NAME);
    
    if (!COLLEGE_NAME || !DEGREE_NAME || !DEPARTMENT_NAME) {
      throw new Error(`Missing required data - College: ${COLLEGE_NAME}, Degree: ${DEGREE_NAME}, Department: ${DEPARTMENT_NAME}`);
    }
    
    async function retryAction(
      actionName: string,
      action: () => Promise<void>,
      retries: number = 1
    ): Promise<void> {
      for (let attempt = 1; attempt <= retries + 1; attempt++) {
        try {
          await action();
          return;
        } catch (error: any) {
          if (attempt <= retries) {
            await page.waitForTimeout(2000);
            await page.waitForLoadState('domcontentloaded').catch(() => {});
          } else {
            await page.screenshot({ path: `test-results/failure-${Date.now()}.png`, fullPage: true });
            throw error;
          }
        }
      }
    }

    const loginPage = new AILoginPage(page);
    const homePage = new AIHomePage(page);
    const institutePage = new AIInstitutePage(page);
    const studentPage = new AIStudentPage(page);
    const bulkUploadFormPage = new AIBulkUploadFormPage(page);

    try {
      // Step 1: Login using AILoginPage
      await retryAction('Login', async () => {
        await loginPage.login('Sailesh+001@pluginlive.com', 'Sailesh@2021');
      });

      // Step 2: Navigate to Institutes tab using AIHomePage
      await retryAction('Navigate to Institutes', async () => {
        await homePage.navigateToInstitutes();
      });

      // Step 3: Search for college using AIInstitutePage
      await retryAction('Search college', async () => {
        await institutePage.searchCollege(COLLEGE_NAME);
      });

      // Step 4: Click View button using AIInstitutePage
      await retryAction('Click View button', async () => {
        await institutePage.clickViewButton(COLLEGE_NAME);
      });

      // Step 5: Click Check-in section (if present) using AIInstitutePage
      await retryAction('Click Check-in', async () => {
        await institutePage.clickCheckInIfPresent();
      }).catch(() => {});

      // Step 6: Navigate to Students tab using AIStudentPage
      await retryAction('Navigate to Students', async () => {
        await studentPage.navigateToStudentsTab();
      });

      // Step 7: Open Bulk Upload form using AIStudentPage
      await retryAction('Open Bulk Upload', async () => {
        await studentPage.openBulkUploadForm();
      });

      // Step 8: Select Degree using AIBulkUploadFormPage
      await retryAction('Select Degree', async () => {
        await bulkUploadFormPage.selectDegree(DEGREE_NAME);
      });

      // Step 9: Select Department using AIBulkUploadFormPage
      await retryAction('Select Department', async () => {
        await bulkUploadFormPage.selectDepartment(DEPARTMENT_NAME);
      });

      // Step 10: Upload Excel file using AIBulkUploadFormPage
      await retryAction('Upload file', async () => {
        await bulkUploadFormPage.uploadFile(EXCEL_FILE_PATH);
      });

      // Step 11: Submit upload using AIBulkUploadFormPage
      await retryAction('Submit upload', async () => {
        await bulkUploadFormPage.submitUpload();
      });

    } catch (error: any) {
      await page.screenshot({ path: `test-results/failure-${Date.now()}.png`, fullPage: true });
      throw error;
    }
  });
});