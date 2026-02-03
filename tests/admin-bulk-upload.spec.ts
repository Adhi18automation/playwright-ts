import { test, expect } from '@playwright/test';
import { AILoginPage } from '../pages/AILoginPage';
import { AIInstitutesPage } from '../pages/AIInstitutesPage';
import { AIBulkUploadPage } from '../pages/AIBulkUploadPage';

test('Admin Student Bulk Upload', async ({ page }) => {
  const login = new AILoginPage(page);
  const institutes = new AIInstitutesPage(page);
  const bulkUpload = new AIBulkUploadPage(page);

  await login.login('Sailesh+001@pluginlive.com', 'Sailesh@2021');

  await institutes.open();
  await institutes.openCollege('Dhiyan Advik College');
  await institutes.openStudents();

  await bulkUpload.open();
  await bulkUpload.fillForm(
    'Bachelor Of Computer Applications',
    'Computer Science Engineering'
  );
  await bulkUpload.uploadFile('testdata/bulckupload0.xlsx');
  await bulkUpload.submit();

  await expect(page.getByText(/success|uploaded/i)).toBeVisible();
});

