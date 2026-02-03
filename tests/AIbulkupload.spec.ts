import { test, expect, Page } from '@playwright/test';
import path from 'path';
import * as XLSX from 'xlsx';

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

    async function clickElement(locator: any) {
      await locator.waitFor({ state: 'visible', timeout: 10000 });
      await locator.scrollIntoViewIfNeeded();
      try {
        await locator.click({ timeout: 2000 });
      } catch {
        await locator.click({ force: true });
      }
    }

    async function selectDropdownOption(name: string, value: string, inputIndex: number = 0) {
      await page.waitForTimeout(800);
      
      // Target dropdown within modal, excluding search inputs
      const dropdown = page.locator('[role="dialog"], .ant-modal, .modal')
        .locator(`input[role="combobox"]`).nth(inputIndex)
        .or(page.locator(`#${name}`))
        .or(page.locator('[role="dialog"], .ant-modal, .modal').locator(`input[id*="${name}"]`).first());
      
      await dropdown.waitFor({ state: 'visible', timeout: 10000 });
      await dropdown.scrollIntoViewIfNeeded();
      await dropdown.click();
      await page.waitForTimeout(300);
      await dropdown.clear();
      await page.waitForTimeout(200);
      
      // Type the value to filter options
      await dropdown.pressSequentially(value, { delay: 50 });
      await page.waitForTimeout(1500);
      
      // Wait for dropdown options to appear
      await page.waitForSelector('[role="option"]', { state: 'visible', timeout: 5000 }).catch(() => {});
      await page.waitForTimeout(300);
      
      // Try to find and click the matching option
      const matchingOption = page.locator(`[role="option"]`).filter({ hasText: value }).first();
      const optionExists = await matchingOption.count() > 0;
      
      if (optionExists) {
        try {
          await matchingOption.click({ timeout: 2000 });
          await page.waitForTimeout(500);
        } catch {
          // Fallback: use keyboard navigation
          await page.keyboard.press('ArrowDown');
          await page.waitForTimeout(200);
          await page.keyboard.press('Enter');
          await page.waitForTimeout(500);
        }
      } else {
        // If no exact match, select first option
        await page.keyboard.press('ArrowDown');
        await page.waitForTimeout(200);
        await page.keyboard.press('Enter');
        await page.waitForTimeout(500);
      }
    }

    try {
      // Step 1: Login
      await retryAction('Login', async () => {
        await page.goto('https://auth.uat.pluginlive.com', { waitUntil: 'domcontentloaded', timeout: 30000 });
        await page.waitForTimeout(1000);
        
        const emailInput = page.locator('input[type="email"]').first()
          .or(page.locator('input[type="text"]').first())
          .or(page.getByPlaceholder(/email/i));
        await emailInput.fill('Sailesh+001@pluginlive.com');
        
        const passwordInput = page.locator('input[type="password"]').first();
        await passwordInput.fill('Sailesh@2021');
        
        const checkbox = page.locator('input[type="checkbox"]').first();
        if (!await checkbox.isChecked()) await checkbox.click();
        
        await passwordInput.press('Enter');
        await page.waitForLoadState('networkidle', { timeout: 30000 });
      });

      // Step 2: Navigate to Institutes tab
      await retryAction('Navigate to Institutes', async () => {
        await page.waitForTimeout(2000);
        await clickElement(page.getByText('Institutes', { exact: false }).first());
        await page.waitForTimeout(1000);
      });

      // Step 3: Search for college
      await retryAction('Search college', async () => {
        const searchInput = page.locator('input[type="search"]').first()
          .or(page.locator('input[type="text"]').first());
        await searchInput.fill(COLLEGE_NAME);
        await page.waitForTimeout(1500);
        await page.getByText(COLLEGE_NAME, { exact: false }).waitFor({ state: 'visible', timeout: 10000 });
      });

      // Step 4: Click View button
      await retryAction('Click View button', async () => {
        const viewButton = page.locator(`tr:has-text("${COLLEGE_NAME}") button:has-text("View")`).first()
          .or(page.getByRole('button', { name: /view/i }).first());
        await clickElement(viewButton);
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(2000);
      });

      // Step 5: Click Check-in section (if present)
      await retryAction('Click Check-in', async () => {
        await page.waitForTimeout(500);
        const checkinElement = page.getByText(/check-?in/i)
          .or(page.getByRole('link', { name: /check-?in/i }))
          .or(page.getByRole('button', { name: /check-?in/i }))
          .or(page.locator('[class*="menu"], [class*="nav"], [class*="sidebar"]').getByText(/check-?in/i));
        
        const isVisible = await checkinElement.first().isVisible({ timeout: 2000 }).catch(() => false);
        if (isVisible) {
          await clickElement(checkinElement.first());
          await page.waitForTimeout(500);
        }
      }).catch(() => {});

      // Step 6: Navigate to Students tab
      await retryAction('Navigate to Students', async () => {
        await page.waitForTimeout(1000);
        const studentsTab = page.getByText('Students', { exact: false })
          .or(page.getByRole('link', { name: /students/i }))
          .or(page.getByRole('tab', { name: /students/i }))
          .or(page.locator('[class*="menu"], [class*="nav"], [class*="sidebar"]').getByText('Students', { exact: false }));
        await clickElement(studentsTab.first());
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(2000);
      });

      // Step 7: Open Bulk Upload form
      await retryAction('Open Bulk Upload', async () => {
        await page.waitForTimeout(1000);
        const bulkUploadButton = page.getByRole('button', { name: /bulk upload/i })
          .or(page.getByText('Bulk Upload', { exact: false }))
          .or(page.locator('button:has-text("Bulk Upload")'))
          .or(page.locator('button:has-text("Bulk")').filter({ hasText: /upload/i }))
          .or(page.locator('button').filter({ hasText: /bulk.*upload/i }));
        await clickElement(bulkUploadButton.first());
        await page.waitForTimeout(1000);
        await page.locator('input:visible').first().waitFor({ state: 'visible', timeout: 5000 });
      });

      // Step 8: Select Degree
      await retryAction('Select Degree', async () => {
        await selectDropdownOption('degree', DEGREE_NAME, 0);
      });

      // Step 9: Select Department
      await retryAction('Select Department', async () => {
        await selectDropdownOption('department', DEPARTMENT_NAME, 1);
      });

      // Step 10: Upload Excel file
      await retryAction('Upload file', async () => {
        const fileInput = page.locator('input[type="file"]').first();
        await fileInput.setInputFiles(EXCEL_FILE_PATH);
        await page.waitForTimeout(2000);
      });

      // Step 11: Submit upload
      await retryAction('Submit upload', async () => {
        const uploadButton = page.getByRole('button', { name: /^upload$/i })
          .or(page.locator('button').filter({ hasText: /upload/i }).last());
        await clickElement(uploadButton);
        await page.waitForTimeout(2000);
        await page.getByText(/success|uploaded|completed/i).first().waitFor({ state: 'visible', timeout: 15000 });
      });

    } catch (error: any) {
      await page.screenshot({ path: `test-results/failure-${Date.now()}.png`, fullPage: true });
      throw error;
    }
  });
});