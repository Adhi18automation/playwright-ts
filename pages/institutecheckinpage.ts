import { Page, expect } from '@playwright/test';
import { BasePage } from './basepage';

export class InstituteCheckinPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // ================= LET'S GO =================
  private get letsGoMenuItem() {
    return this.page.getByRole('menuitem', { name: "Let's Go!" });
  }

  async clickLetsGo(): Promise<void> {
    console.log("Clicking on Let's Go...");
    await this.letsGoMenuItem.click({ noWaitAfter: true });
    console.log("Successfully clicked on Let's Go");
  }

  // ================= STUDENTS =================
  private get studentsMenuItem() {
    return this.page.getByRole('menuitem', { name: 'Students' });
  }

  async clickStudents(): Promise<void> {
    console.log('Clicking on Students...');
    await this.studentsMenuItem.click({ noWaitAfter: true });
    console.log('Successfully clicked on Students');
  }

  // ================= CORPORATE =================
  private get corporateMenuItem() {
    return this.page.getByRole('menuitem', { name: 'Corporate' });
  }

  async clickCorporate(): Promise<void> {
    console.log('Clicking on Corporate...');
    await this.corporateMenuItem.click({ noWaitAfter: true });
    console.log('Successfully clicked on Corporate');
  }

  // ================= PIL ROLES =================
  private get pilRolesMenuItem() {
    return this.page.getByRole('menuitem', { name: 'PIL Roles' });
  }

  async clickPilRoles(): Promise<void> {
    console.log('Clicking on PIL Roles...');
    await this.pilRolesMenuItem.click({ noWaitAfter: true });
    console.log('Successfully clicked on PIL Roles');
  }

  // ================= BATCH FOLDERS =================
  private get batchFoldersMenuItem() {
    return this.page.getByRole('menuitem', { name: 'Batch Folders' });
  }

  async clickBatchFolders(): Promise<void> {
    console.log('Clicking on Batch Folders...');
    await this.batchFoldersMenuItem.click({ noWaitAfter: true });
    console.log('Successfully clicked on Batch Folders');
  }

  // ================= JOB ROLES =================
  private get jobRolesMenuItem() {
    return this.page.getByRole('menuitem', { name: 'Job Roles' });
  }

  async clickJobRoles(): Promise<void> {
    console.log('Clicking on Job Roles...');
    await this.jobRolesMenuItem.click({ noWaitAfter: true });
    console.log('Successfully clicked on Job Roles');
  }

  // ================= EVENTS =================
  private get eventsMenuItem() {
    return this.page.getByRole('menuitem', { name: 'Events' });
  }

  async clickEvents(): Promise<void> {
    console.log('Clicking on Events...');
    await this.eventsMenuItem.click({ noWaitAfter: true });
    console.log('Successfully clicked on Events');
  }

  // ================= USERS =================
  private get usersMenuItem() {
    return this.page.getByRole('menuitem', { name: 'Users' });
  }

  async clickUsers(): Promise<void> {
    console.log('Clicking on Users...');
    await this.usersMenuItem.click({ noWaitAfter: true });
    console.log('Successfully clicked on Users');
  }

  // ================= RULE ENGINE =================
  private get ruleEngineMenuItem() {
    return this.page.getByRole('menuitem', { name: 'Rule Engine' });
  }

  async clickRuleEngine(): Promise<void> {
    console.log('Clicking on Rule Engine...');
    await this.ruleEngineMenuItem.click({ noWaitAfter: true });
    console.log('Successfully clicked on Rule Engine');
  }

  // ================= APPROVALS =================
  private get approvalsMenuItem() {
    return this.page.getByRole('menuitem', { name: 'Approvals' });
  }

  async clickApprovals(): Promise<void> {
    console.log('Clicking on Approvals...');
    await this.approvalsMenuItem.click({ noWaitAfter: true });
    console.log('Successfully clicked on Approvals');
  }

  // ================= REPORTS =================
  private get reportsMenuItem() {
    return this.page.getByRole('menuitem', { name: 'Reports' });
  }

  async clickReports(): Promise<void> {
    console.log('Clicking on Reports...');
    await this.reportsMenuItem.click({ noWaitAfter: true });
    console.log('Successfully clicked on Reports');
  }

  // ================= SETTINGS =================
  private get settingsMenuItem() {
    return this.page.getByRole('menuitem', { name: 'Settings' });
  }

  async clickSettings(): Promise<void> {
    console.log('Clicking on Settings...');
    await this.settingsMenuItem.click({ noWaitAfter: true });
    console.log('Successfully clicked on Settings');
  }

  // ================= COURSES =================
  private get coursesMenuItem() {
    return this.page.getByRole('menuitem', { name: 'Courses' });
  }

  async clickCourses(): Promise<void> {
    console.log('Clicking on Courses...');
    await this.coursesMenuItem.click({ noWaitAfter: true });
    console.log('Successfully clicked on Courses');
  }

  // ================= ASSESSMENT =================
  private get assessmentMenuItem() {
    return this.page.getByRole('menuitem', { name: 'Assessment' });
  }

  async clickAssessment(): Promise<void> {
    console.log('Clicking on Assessment...');
    await this.assessmentMenuItem.click({ noWaitAfter: true });
    console.log('Successfully clicked on Assessment');
  }

  // ================= VERIFY STUDENTS PAGE =================
  async verifyStudentsPageVisible(): Promise<void> {
    console.log('Verifying Students page is visible...');
    await expect(
      this.page.getByRole('heading', { name: 'Students' })
    ).toBeVisible({ timeout: 15000 });
    console.log('Students page is visible');
  }
}
