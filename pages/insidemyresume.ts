import { Page, Locator } from '@playwright/test';
import { BasePage } from './basepage';

export class InsideMyResumePage extends BasePage {
  private readonly additionalInformationIcon: Locator;
  private readonly educationsIcon: Locator;
  private readonly internshipIcon: Locator;
  private readonly workExperienceIcon: Locator;
  private readonly projectsIcon: Locator;
  private readonly certificationIcon: Locator;

  constructor(page: Page) {
    super(page);
    
    this.additionalInformationIcon = this.page
      .getByTestId('additional-information-icon')
      .or(this.page.getByLabel('Additional Information'))
      .or(this.page.locator('h1:has-text("Additional Information")').locator('..').locator('..').locator('svg.iconStyle'));

    this.educationsIcon = this.page
      .getByTestId('educations-icon')
      .or(this.page.getByLabel('Educations'))
      .or(this.page.locator('h1:has-text("Educations")').locator('..').locator('..').locator('svg.iconStyle'));

    this.internshipIcon = this.page
      .getByTestId('internship-icon')
      .or(this.page.getByLabel('Internship'))
      .or(this.page.locator('h1:has-text("Internship")').locator('..').locator('..').locator('svg.iconStyle'));

    this.workExperienceIcon = this.page
      .getByTestId('work-experience-icon')
      .or(this.page.getByLabel('Work Experience'))
      .or(this.page.locator('h1:has-text("Work Experience")').locator('..').locator('..').locator('svg.iconStyle'));

    this.projectsIcon = this.page
      .getByTestId('projects-icon')
      .or(this.page.getByLabel('Projects'))
      .or(this.page.locator('h1:has-text("Projects")').locator('xpath=../..').locator('svg').first())
      .or(this.page.locator('button').filter({ has: this.page.locator('h1:has-text("Projects")') }).first())
      .or(this.page.locator('[class*="iconStyle"]').filter({ has: this.page.locator('h1:has-text("Projects")') }).first());

    this.certificationIcon = this.page
      .getByTestId('certification-icon')
      .or(this.page.getByLabel('Certification'))
      .or(this.page.locator('h1:has-text("Certification")').locator('..').locator('..').locator('svg.iconStyle'));
  }

  async clickAdditionalInformationIcon(): Promise<void> {
    await this.safeClick(this.additionalInformationIcon, 'Additional Information icon');
  }

  async clickEducationsIcon(): Promise<void> {
    await this.safeClick(this.educationsIcon, 'Educations icon');
  }

  async clickInternshipIcon(): Promise<void> {
    // Wait for page to be ready
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(1000);
    
    // Debug: Check if Internship heading exists
    const internshipHeading = this.page.locator('h1:has-text("Internship")').first();
    const headingExists = await internshipHeading.count();
    console.log(`Internship heading count: ${headingExists}`);
    
    if (headingExists > 0) {
      await internshipHeading.scrollIntoViewIfNeeded().catch(() => {});
      await this.page.waitForTimeout(500);
    }
    
    // Try multiple approaches to find and click the Internship icon/button
    const attempts = [
      // Attempt 1: Original icon locator
      () => this.safeClick(this.internshipIcon, 'Internship icon'),
      // Attempt 2: Look for text "Internship" and click parent container
      () => this.safeClick(
        this.page.locator('text=Internship').first().locator('xpath=../..'),
        'Internship text parent container'
      ),
      // Attempt 3: Any button or svg near Internship heading
      () => this.safeClick(
        this.page.locator('h1:has-text("Internship"), h2:has-text("Internship"), h3:has-text("Internship")').first().locator('xpath=..').locator('button, svg, [role="button"]').first(),
        'Internship button/icon near heading'
      ),
      // Attempt 4: Click the heading itself (might be clickable)
      () => this.safeClick(
        this.page.locator('h1:has-text("Internship"), h2:has-text("Internship"), h3:has-text("Internship")').first(),
        'Internship heading itself'
      ),
      // Attempt 5: Look for any clickable element with Internship text
      () => this.safeClick(
        this.page.locator('button, div[role="button"], [class*="clickable"]').filter({ hasText: 'Internship' }).first(),
        'Any clickable element with Internship text'
      ),
      // Attempt 6: Try broader parent container
      () => this.safeClick(
        this.page.locator('text=Internship').first().locator('xpath=ancestor::div[contains(@class, "card") or contains(@class, "section") or contains(@class, "item")]').first(),
        'Internship card/section container'
      ),
    ];
    
    for (let i = 0; i < attempts.length; i++) {
      try {
        await attempts[i]();
        console.log(`Internship icon clicked successfully using attempt ${i + 1}`);
        return;
      } catch (error) {
        console.log(`Attempt ${i + 1} failed: ${error}`);
        if (i === attempts.length - 1) {
          throw error;
        }
      }
    }
  }

  async clickWorkExperienceIcon(): Promise<void> {
    // Wait for page to be ready
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(1000);
    
    // Debug: Check if Work Experience heading exists
    const workExpHeading = this.page.locator('h1:has-text("Work Experience"), h2:has-text("Work Experience"), h3:has-text("Work Experience")').first();
    const headingExists = await workExpHeading.count();
    console.log(`Work Experience heading count: ${headingExists}`);
    
    if (headingExists > 0) {
      await workExpHeading.scrollIntoViewIfNeeded().catch(() => {});
      await this.page.waitForTimeout(500);
    }
    
    // Try multiple approaches
    const attempts = [
      () => this.safeClick(this.workExperienceIcon, 'Work Experience icon'),
      () => this.safeClick(
        this.page.locator('text=Work Experience').first().locator('xpath=../..'),
        'Work Experience text parent container'
      ),
      () => this.safeClick(
        workExpHeading.locator('xpath=..').locator('button, svg, [role="button"]').first(),
        'Work Experience button/icon near heading'
      ),
      () => this.safeClick(
        workExpHeading,
        'Work Experience heading itself'
      ),
    ];
    
    for (let i = 0; i < attempts.length; i++) {
      try {
        await attempts[i]();
        console.log(`Work Experience icon clicked successfully using attempt ${i + 1}`);
        return;
      } catch (error) {
        console.log(`Attempt ${i + 1} failed: ${error}`);
        if (i === attempts.length - 1) {
          throw error;
        }
      }
    }
  }

  async clickProjectsIcon(): Promise<void> {
    // Wait for page to be ready
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(1000);
    
    // Debug: Check if Projects heading exists
    const projectsHeading = this.page.locator('h1:has-text("Projects")').first();
    const headingExists = await projectsHeading.count();
    console.log(`Projects heading count: ${headingExists}`);
    
    if (headingExists > 0) {
      await projectsHeading.scrollIntoViewIfNeeded().catch(() => {});
      await this.page.waitForTimeout(500);
      
      // Debug: Check what elements are near the heading
      const parent = projectsHeading.locator('xpath=..');
      const parentHtml = await parent.innerHTML().catch(() => 'Could not get HTML');
      console.log(`Projects parent HTML: ${parentHtml.substring(0, 200)}`);
    }
    
    // Try multiple approaches to find and click the Projects icon/button
    const attempts = [
      // Attempt 1: Original icon locator
      () => this.safeClick(this.projectsIcon, 'Projects icon'),
      // Attempt 2: Any button or svg near Projects heading
      () => this.safeClick(
        this.page.locator('h1:has-text("Projects")').locator('xpath=..').locator('button, svg').first(),
        'Projects button/icon near heading'
      ),
      // Attempt 3: Click the parent div of the heading
      () => this.safeClick(
        this.page.locator('h1:has-text("Projects")').locator('xpath=..'),
        'Projects heading parent'
      ),
      // Attempt 4: Just click any svg on the page near "Projects" text
      () => this.safeClick(
        this.page.locator('svg').filter({ hasText: 'Projects' }).first(),
        'Any SVG with Projects text'
      ),
    ];
    
    for (let i = 0; i < attempts.length; i++) {
      try {
        await attempts[i]();
        console.log(`Projects icon clicked successfully using attempt ${i + 1}`);
        return;
      } catch (error) {
        console.log(`Attempt ${i + 1} failed: ${error}`);
        if (i === attempts.length - 1) {
          throw error;
        }
      }
    }
  }

  async clickCertificationIcon(): Promise<void> {
    await this.safeClick(this.certificationIcon, 'Certification icon');
  }
}
