import { Page, Locator } from '@playwright/test';

export class AIBulkUploadFormPage {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async selectDegree(degreeName: string): Promise<void> {
    await this.selectDropdownOption('degree', degreeName, 0);
  }

  async selectDepartment(departmentName: string): Promise<void> {
    await this.selectDropdownOption('department', departmentName, 1);
  }

  async uploadFile(filePath: string): Promise<void> {
    const fileInput = this.page.locator('input[type="file"]').first();
    await fileInput.setInputFiles(filePath);
    await this.page.waitForTimeout(2000);
  }

  async submitUpload(): Promise<void> {
    const uploadButton = this.page.getByRole('button', { name: /^upload$/i })
      .or(this.page.locator('button').filter({ hasText: /upload/i }).last());
    await this.clickElement(uploadButton);
    await this.page.waitForTimeout(2000);
    await this.page.getByText(/success|uploaded|completed/i).first().waitFor({ state: 'visible', timeout: 15000 });
  }

  private async selectDropdownOption(name: string, value: string, inputIndex: number = 0): Promise<void> {
    await this.page.waitForTimeout(800);
    
    const dropdown = this.page.locator('[role="dialog"], .ant-modal, .modal')
      .locator(`input[role="combobox"]`).nth(inputIndex)
      .or(this.page.locator(`#${name}`))
      .or(this.page.locator('[role="dialog"], .ant-modal, .modal').locator(`input[id*="${name}"]`).first());
    
    await dropdown.waitFor({ state: 'visible', timeout: 10000 });
    await dropdown.scrollIntoViewIfNeeded();
    await dropdown.click();
    await this.page.waitForTimeout(300);
    await dropdown.clear();
    await this.page.waitForTimeout(200);
    
    await dropdown.pressSequentially(value, { delay: 50 });
    await this.page.waitForTimeout(1500);
    
    await this.page.waitForSelector('[role="option"]', { state: 'visible', timeout: 5000 }).catch(() => {});
    await this.page.waitForTimeout(300);
    
    const matchingOption = this.page.locator(`[role="option"]`).filter({ hasText: value }).first();
    const optionExists = await matchingOption.count() > 0;
    
    if (optionExists) {
      try {
        await matchingOption.click({ timeout: 2000 });
        await this.page.waitForTimeout(500);
      } catch {
        await this.page.keyboard.press('ArrowDown');
        await this.page.waitForTimeout(200);
        await this.page.keyboard.press('Enter');
        await this.page.waitForTimeout(500);
      }
    } else {
      await this.page.keyboard.press('ArrowDown');
      await this.page.waitForTimeout(200);
      await this.page.keyboard.press('Enter');
      await this.page.waitForTimeout(500);
    }
  }

  private async clickElement(locator: Locator): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout: 10000 });
    await locator.scrollIntoViewIfNeeded();
    try {
      await locator.click({ timeout: 2000 });
    } catch {
      await locator.click({ force: true });
    }
  }
}
