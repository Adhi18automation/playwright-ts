import { Page, expect } from '@playwright/test';
import { BasePage } from './basepage';
import path from 'path';
import fs from 'fs';



export class BulkUploadPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }



  // ================= SELECT DEGREE =================
async fillDegreeDropdown(degreeText: string): Promise<void> {
  const page = this.page;

  // 🔹 Degree selector (click target)
  const degreeSelector = page.locator(
    "//span[normalize-space()='Degree Name *']/../..//div[contains(@class,'ant-select-selector')]"
  );

  // 🔹 Degree input (search box)
  const degreeInput = page.locator(
    "//span[normalize-space()='Degree Name *']/../..//input[@role='combobox']"
  );

  // 1️⃣ Open dropdown
  await degreeSelector.waitFor({ state: 'visible', timeout: 10000 });
  await degreeSelector.click();

  // 2️⃣ Type degree (AntD search)
  await degreeInput.fill(degreeText);

  // 3️⃣ Select matching option from OPEN dropdown
  const option = page.locator(
    ".ant-select-dropdown:not(.ant-select-dropdown-hidden) .ant-select-item-option-content",
    { hasText: degreeText }
  );

  await option.first().waitFor({ state: 'visible', timeout: 5000 });
  await option.first().click();

  // 4️⃣ Verify selected value (AntD correct way)
  await page.locator(
    "//span[normalize-space()='Degree Name *']/../..//span[contains(@class,'ant-select-selection-item')]",
    { hasText: degreeText }
  ).waitFor({ state: 'visible', timeout: 5000 });

  console.log(`Successfully selected Degree: ${degreeText}`);
}


  // ================= SELECT DEPARTMENT =================
async fillDepartmentDropdown(departmentText: string): Promise<void> {
  const page = this.page;

  // 🔹 Department selector (click target)
  const departmentSelector = page.locator(
    "//span[normalize-space()='Department Name *']/../..//div[contains(@class,'ant-select-selector')]"
  );

  // 🔹 Department input (search box)
  const departmentInput = page.locator(
    "//span[normalize-space()='Department Name *']/../..//input[@role='combobox']"
  );

  // 1️⃣ Wait until Department becomes enabled (depends on Degree)
  await departmentSelector.waitFor({ state: 'visible', timeout: 15000 });

  // 2️⃣ Open dropdown
  await departmentSelector.click();

  // 3️⃣ Type department name
  await departmentInput.fill(departmentText);

  // 4️⃣ Select matching option from OPEN dropdown
  const option = page.locator(
    ".ant-select-dropdown:not(.ant-select-dropdown-hidden) .ant-select-item-option-content",
    { hasText: departmentText }
  );

  await option.first().waitFor({ state: 'visible', timeout: 15000 });
  await option.first().click();

  // 5️⃣ Verify selection (AntD correct verification)
  await page.locator(
    "//span[normalize-space()='Department Name *']/../..//span[contains(@class,'ant-select-selection-item')]",
    { hasText: departmentText }
  ).waitFor({ state: 'visible', timeout: 5000 });

  console.log(`Successfully selected Department: ${departmentText}`);
}

// ================= UPLOAD FILE =================
async uploadFile(fileName: string): Promise<void> {
  // ✅ Always resolve from project root
  const filePath = path.resolve(process.cwd(), 'testdata', fileName);

  console.log('Uploading file:', filePath);

  // ✅ Safety check
  if (!fs.existsSync(filePath)) {
    throw new Error(`❌ File not found: ${filePath}`);
  }

  // ✅ Ant Design hidden input
  const fileInput = this.page.locator("span.ant-upload input[type='file']");

  await fileInput.setInputFiles(filePath);

  // ✅ Assertion (Playwright way)
  await expect(fileInput).toHaveValue(/\.xlsx$/);

  console.log(`✅ File uploaded: ${fileName}`);
}


async clickUpload(): Promise<void> {
  const uploadButton = this.page.locator(
    "button[form='bulkUpload'][type='submit']"
  );

  // 1️⃣ Wait until button is visible
  await uploadButton.waitFor({ state: 'visible', timeout: 15000 });

  // 2️⃣ Wait until button is ENABLED (important for AntD)
  await expect(uploadButton).toBeEnabled();

  // 3️⃣ Click
  await uploadButton.click();

  console.log('✅ Upload button clicked');
}



 






 








  

}
