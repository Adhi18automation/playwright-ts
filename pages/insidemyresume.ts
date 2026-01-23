import { Page } from '@playwright/test';
import { BasePage } from './basepage';

export class InsideMyResumePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  private get additionalInformationIcon() {
    return this.page.locator("//h1[normalize-space()='Additional Information']/../..//*[name()='svg' and @class='iconStyle']");
  }

  private get educationsIcon() {
    return this.page.locator("//h1[normalize-space()='Educations']/../..//*[name()='svg' and @class='iconStyle']");
  }

  private get internshipIcon() {
    return this.page.locator("//h1[normalize-space()='Internship']/../..//*[name()='svg' and @class='iconStyle']");
  }

  private get workExperienceIcon() {
    return this.page.locator("//h1[normalize-space()='Work Experience']/../..//*[name()='svg' and @class='iconStyle']");
  }

  private get projectsIcon() {
    return this.page.locator("//h1[normalize-space()='Projects']/../..//*[name()='svg' and @class='iconStyle']");
  }

  private get certificationIcon() {
    return this.page.locator("//h1[normalize-space()='Certification']/../..//*[name()='svg' and @class='iconStyle']");
  }

  async clickAdditionalInformationIcon(): Promise<void> {
    await this.additionalInformationIcon.click();
  }

  async clickEducationsIcon(): Promise<void> {
    await this.educationsIcon.click();
  }

  async clickInternshipIcon(): Promise<void> {
    await this.internshipIcon.click();
  }

  async clickWorkExperienceIcon(): Promise<void> {
    await this.workExperienceIcon.click();
  }

  async clickProjectsIcon(): Promise<void> {
    await this.projectsIcon.click();
  }

  async clickCertificationIcon(): Promise<void> {
    await this.certificationIcon.click();
  }
}
