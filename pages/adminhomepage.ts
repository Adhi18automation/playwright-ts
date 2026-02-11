import { Page } from '@playwright/test';
import { BasePage } from './basepage';

export class AdminHomePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // 🔒 Sidebar scope (IMPORTANT)
  private get sidebar() {
    return this.page.getByRole('navigation');
  }

  // ================= MENU LOCATORS =================
  private get corporatesLink() {
    return this.sidebar.getByRole('menuitem', { name: 'Corporates' });
  }

  private get institutesLink() {
    return this.sidebar.getByRole('menuitem', { name: 'Institutes' });
  }

  private get assessmentLink() {
    return this.sidebar.getByRole('menuitem', { name: 'Assessment' });
  }

  private get featureAccessLink() {
    return this.sidebar.getByRole('menuitem', { name: 'Feature Access' });
  }

  private get reportsLink() {
    return this.sidebar.getByRole('menuitem', { name: 'Reports' });
  }

  private get usersLink() {
    return this.sidebar.getByRole('menuitem', { name: 'Users' });
  }

  private get systemConfigLink() {
    return this.sidebar.getByRole('menuitem', { name: 'System Config' });
  }

  private get courseMappingLink() {
    return this.sidebar.getByRole('menuitem', { name: 'Course Mapping' });
  }

  private get eventCatalogueLink() {
    return this.sidebar.getByRole('menuitem', { name: 'Event Catalogue' });
  }

  private get ratingAlgorithmLink() {
    return this.sidebar.getByRole('menuitem', { name: 'Rating Algorithm' });
  }

  // ================= CLICK ACTIONS =================
  async clickCorporates() {
    await this.page.getByRole('menuitem', { name: 'Corporates' })
      .waitFor({ state: 'visible' });

    await this.page.getByRole('menuitem', { name: 'Corporates' })
      .click({ noWaitAfter: true });
  }

  async clickInstitutes() {
    await this.page.getByRole('menuitem', { name: 'Institutes' })
      .waitFor({ state: 'visible' });

    await this.page.getByRole('menuitem', { name: 'Institutes' })
      .click({ noWaitAfter: true });
  }

  async clickAssessment() {
    await this.page.getByRole('menuitem', { name: 'Assessment' })
      .waitFor({ state: 'visible' });

    await this.page.getByRole('menuitem', { name: 'Assessment' })
      .click({ noWaitAfter: true });
  }

  async clickFeatureAccess() {
    await this.page.getByRole('menuitem', { name: 'Feature Access' })
      .waitFor({ state: 'visible' });

    await this.page.getByRole('menuitem', { name: 'Feature Access' })
      .click({ noWaitAfter: true });
  }

  async clickReports() {
    await this.page.getByRole('menuitem', { name: 'Reports' })
      .waitFor({ state: 'visible' });

    await this.page.getByRole('menuitem', { name: 'Reports' })
      .click({ noWaitAfter: true });
  }

  async clickUsers() {
    await this.page.getByRole('menuitem', { name: 'Users' })
      .waitFor({ state: 'visible' });

    await this.page.getByRole('menuitem', { name: 'Users' })
      .click({ noWaitAfter: true });
  }

  async clickSystemConfig() {
    await this.page.getByRole('menuitem', { name: 'System Config' })
      .waitFor({ state: 'visible' });

    await this.page.getByRole('menuitem', { name: 'System Config' })
      .click({ noWaitAfter: true });
  }

  async clickCourseMapping() {
    await this.page.getByRole('menuitem', { name: 'Course Mapping' })
      .waitFor({ state: 'visible' });

    await this.page.getByRole('menuitem', { name: 'Course Mapping' })
      .click({ noWaitAfter: true });
  }

  async clickEventCatalogue() {
    await this.page.getByRole('menuitem', { name: 'Event Catalogue' })
      .waitFor({ state: 'visible' });

    await this.page.getByRole('menuitem', { name: 'Event Catalogue' })
      .click({ noWaitAfter: true });
  }

  async clickRatingAlgorithm() {
    await this.page.getByRole('menuitem', { name: 'Rating Algorithm' })
      .waitFor({ state: 'visible' });

    await this.page.getByRole('menuitem', { name: 'Rating Algorithm' })
      .click({ noWaitAfter: true });
  }
}
