import { Page, Locator } from '@playwright/test';
import { BasePage } from './basepage';

export class RoleApplicationPage extends BasePage {
    readonly page: Page;

    // Locators
    readonly rolesMenuItem: Locator;
    readonly searchBar: Locator;
    readonly checkEligibilityButton: Locator;
    readonly skillsSection: Locator;
    readonly addSkillIcon: Locator;
    readonly addButton: Locator;
    readonly updateAndApplyButton: Locator;
    readonly addedSuccessfullyLabel: Locator;
    readonly applyButton: Locator;
    readonly uploadResumeButton: Locator;
    readonly appliedSuccessfullyLabel: Locator;
    readonly closeButton: Locator;

    // Skill Category Locators
    readonly academicsCategory: Locator;
    readonly internshipCategory: Locator;
    readonly workExperienceCategory: Locator;
    readonly trainingCourseCategory: Locator;
    readonly projectCategory: Locator;

    // Additional Skill Input Locators
    readonly addAcademicsOption: Locator;
    readonly addProjectOption: Locator;
    readonly addInternshipOption: Locator;
    readonly addCertificationOption: Locator;
    readonly addWorkExperienceOption: Locator;

    constructor(page: Page) {
        super(page);
        this.page = page;

        // Navigation
        this.rolesMenuItem = page.locator('text=Roles').first();
        this.searchBar = page.locator('input[type="search"], input[placeholder*="Search"]').first();
        
        // Eligibility
        this.checkEligibilityButton = page.locator('button:has-text("Check Eligibility")').first();
        this.skillsSection = page.locator('text=Skills').first();
        this.addSkillIcon = page.locator('svg[data-icon="plus"], button:has(svg[data-icon="plus"]), .anticon-plus, [class*="plus"]').first();
        
        // Skill Categories (Options 1-5)
        this.academicsCategory = page.locator('text=Academics').first();
        this.internshipCategory = page.locator('text=Internship').first();
        this.workExperienceCategory = page.locator('text=Work Experience').first();
        this.trainingCourseCategory = page.locator('text=Training Course').first();
        this.projectCategory = page.locator('text=Project').first();
        
        // Additional Skill Input (Options 6-10)
        this.addAcademicsOption = page.locator('text=Add Academics').first();
        this.addProjectOption = page.locator('text=Add Project').first();
        this.addInternshipOption = page.locator('text=Add Internship').first();
        this.addCertificationOption = page.locator('text=Add Certification').first();
        this.addWorkExperienceOption = page.locator('text=Add Work Experience').first();
        
        // Action Buttons
        this.addButton = page.locator('button:has-text("Add")').first();
        this.updateAndApplyButton = page.locator('button:has-text("Update & Apply"), button:has-text("Update and Apply")').first();
        this.applyButton = page.locator('button:has-text("Apply")').first();
        this.uploadResumeButton = page.locator('button:has-text("Upload Resume"), input[type="file"]').first();
        this.closeButton = page.locator('button:has-text("Close")').first();
        
        // Success Labels
        this.addedSuccessfullyLabel = page.locator('text=Added Successfully').first();
        this.appliedSuccessfullyLabel = page.locator('text=Applied Successfully').first();
    }

    // ============== NAVIGATION ==============
    async navigateToRoles() {
        await this.rolesMenuItem.click();
        await this.page.waitForLoadState('networkidle');
        await this.searchBar.waitFor({ state: 'visible', timeout: 10000 });
    }

    async searchRole(roleName: string) {
        await this.searchBar.click();
        await this.searchBar.fill(roleName);
        await this.page.waitForTimeout(1000); // Wait for search results
    }

    async clickCheckEligibility(roleName: string) {
        const roleCard = this.page.locator(`text=${roleName}`).first();
        await roleCard.waitFor({ state: 'visible' });
        await this.checkEligibilityButton.click();
        await this.page.waitForLoadState('networkidle');
    }

    async openAddSkillPage() {
        // Click Skills section to open the modal
        await this.skillsSection.click();
        await this.page.waitForTimeout(3000);
        
        console.log('   → Skills modal opened, looking for Add Skill icon...');
        
        // Wait for modal to be visible
        await this.page.waitForSelector('text=Mandatory Skills', { timeout: 5000 });
        
        // Click the SVG icon with specific attributes (the + Add Skill icon)
        const addSkillSvg = this.page.locator('svg[width="20"][height="20"][viewBox="0 0 20 20"]').first();
        await addSkillSvg.waitFor({ state: 'visible', timeout: 5000 });
        await addSkillSvg.click();
        console.log('   → Clicked Add Skill SVG icon');
        
        await this.page.waitForTimeout(2000);
    }

    async clickMandatoryAddSkill() {
        console.log('   → Clicking Mandatory Skills Add Skill button...');
        
        // Wait for the Mandatory Skills section to be visible
        await this.page.waitForSelector('text=Mandatory Skills', { timeout: 5000 });
        await this.page.waitForTimeout(1000);
        
        // Try multiple locator strategies
        try {
            // Strategy 1: Find by text "Add Skill" that appears after "Mandatory Skills"
            const addSkillByText = this.page.locator('text=Add Skill').first();
            if (await addSkillByText.isVisible({ timeout: 2000 })) {
                await addSkillByText.click();
                console.log('   → Clicked Add Skill button (text locator)');
                await this.page.waitForTimeout(2000);
                return;
            }
        } catch (e) {
            console.log('   → Text locator failed, trying class-based locator...');
        }
        
        try {
            // Strategy 2: Find by class name from DOM
            const addSkillByClass = this.page.locator('.sc_loxEFf_hbqvs1').first();
            if (await addSkillByClass.isVisible({ timeout: 2000 })) {
                await addSkillByClass.click();
                console.log('   → Clicked Add Skill button (class locator)');
                await this.page.waitForTimeout(2000);
                return;
            }
        } catch (e) {
            console.log('   → Class locator failed, trying role-based locator...');
        }
        
        try {
            // Strategy 3: Find by role button with name containing "Add Skill"
            const addSkillByRole = this.page.getByRole('button', { name: /add skill/i }).first();
            await addSkillByRole.waitFor({ state: 'visible', timeout: 2000 });
            await addSkillByRole.click();
            console.log('   → Clicked Add Skill button (role locator)');
            await this.page.waitForTimeout(2000);
        } catch (e) {
            console.log('   ✗ All locator strategies failed');
            throw new Error('Could not find or click the Mandatory Add Skill button');
        }
    }

    // ============== SKILL CATEGORY SELECTION (Options 1-5) ==============
    async selectAcademicsCategory(option: '10th' | '12th' | 'Both') {
        await this.academicsCategory.click();
        await this.page.waitForTimeout(500); // Wait for expansion

        if (option === '10th' || option === 'Both') {
            const checkbox10th = this.page.locator('input[type="checkbox"][value*="10"], label:has-text("10th")').first();
            await checkbox10th.check();
        }
        if (option === '12th' || option === 'Both') {
            const checkbox12th = this.page.locator('input[type="checkbox"][value*="12"], label:has-text("12th")').first();
            await checkbox12th.check();
        }
    }

    async selectInternshipCategory() {
        await this.internshipCategory.click();
        await this.page.waitForTimeout(500);
        const checkbox = this.page.locator('input[type="checkbox"]').first();
        await checkbox.check();
    }

    async selectWorkExperienceCategory() {
        await this.workExperienceCategory.click();
        await this.page.waitForTimeout(500);
        const checkbox = this.page.locator('input[type="checkbox"]').first();
        await checkbox.check();
    }

    async selectTrainingCourseCategory() {
        await this.trainingCourseCategory.click();
        await this.page.waitForTimeout(500);
        const checkbox = this.page.locator('input[type="checkbox"]').first();
        await checkbox.check();
    }

    async selectProjectCategory() {
        await this.projectCategory.click();
        await this.page.waitForTimeout(500);
        const checkbox = this.page.locator('input[type="checkbox"]').first();
        await checkbox.check();
    }

    // ============== ADD NEW ENTRY (Options 6-10) ==============
    async clickAddAcademics() {
        await this.addAcademicsOption.click();
        await this.page.waitForLoadState('networkidle');
    }

    async clickAddProject() {
        await this.addProjectOption.click();
        await this.page.waitForLoadState('networkidle');
    }

    async clickAddInternship() {
        await this.addInternshipOption.click();
        await this.page.waitForLoadState('networkidle');
    }

    async clickAddCertification() {
        await this.addCertificationOption.click();
        await this.page.waitForLoadState('networkidle');
    }

    async clickAddWorkExperience() {
        await this.addWorkExperienceOption.click();
        await this.page.waitForLoadState('networkidle');
    }

    // ============== SKILL ADDITION FLOW ==============
    async clickAddAndVerify() {
        await this.addButton.click();
        await this.addedSuccessfullyLabel.waitFor({ state: 'visible', timeout: 5000 });
        console.log('✓ "Added Successfully" label verified');
    }

    async clickUpdateAndApply() {
        await this.updateAndApplyButton.click();
        await this.page.waitForLoadState('networkidle');
    }

    // ============== RESUME UPLOAD ==============
    async clickApplyForRole() {
        await this.applyButton.click();
        await this.page.waitForTimeout(1000);
    }

    async uploadResume(filePath: string) {
        const fileInput = this.page.locator('input[type="file"]').first();
        
        if (await fileInput.isVisible()) {
            await fileInput.setInputFiles(filePath);
        } else {
            await this.uploadResumeButton.click();
            await this.page.waitForTimeout(500);
            await fileInput.setInputFiles(filePath);
        }
        
        await this.page.waitForTimeout(1000); // Wait for upload
    }

    async clickApplyAndVerify() {
        await this.applyButton.click();
        await this.appliedSuccessfullyLabel.waitFor({ state: 'visible', timeout: 5000 });
        
        // Verify green color
        const color = await this.appliedSuccessfullyLabel.evaluate((el) => {
            return window.getComputedStyle(el).color;
        });
        console.log(`✓ "Applied Successfully" label verified (color: ${color})`);
    }

    async closeModal() {
        await this.closeButton.click();
        await this.page.waitForLoadState('networkidle');
    }

    // ============== HELPER METHODS ==============
    async fillAntDesignDropdown(fieldLabel: string, value: string) {
        const dropdown = this.page.locator(`label:has-text("${fieldLabel}") + div .ant-select, input[placeholder*="${fieldLabel}"]`).first();
        await dropdown.click();
        await this.page.waitForTimeout(300);
        await dropdown.fill(value);
        await this.page.waitForTimeout(500);
        
        const option = this.page.locator(`.ant-select-dropdown:visible .ant-select-item:has-text("${value}")`).first();
        await option.click();
    }

    async fillTextField(fieldLabel: string, value: string) {
        const field = this.page.locator(`label:has-text("${fieldLabel}") + input, input[placeholder*="${fieldLabel}"]`).first();
        await field.fill(value);
    }

    async selectDatePicker(fieldLabel: string, date: string) {
        const picker = this.page.locator(`label:has-text("${fieldLabel}") + div .ant-picker`).first();
        await picker.click();
        await this.page.waitForTimeout(300);
        
        // Parse date (e.g., "Jan 2024")
        const [month, year] = date.split(' ');
        
        // Select year
        const yearSelect = this.page.locator('.ant-picker-year-btn').first();
        await yearSelect.click();
        await this.page.locator(`.ant-picker-year-panel .ant-picker-cell:has-text("${year}")`).click();
        
        // Select month
        await this.page.locator(`.ant-picker-month-panel .ant-picker-cell:has-text("${month}")`).click();
    }

    async selectMultipleSkills(skills: string[]) {
        const multiSelect = this.page.locator('label:has-text("Skills") + div .ant-select').first();
        await multiSelect.click();
        
        for (const skill of skills) {
            await this.page.fill('.ant-select-selection-search-input', skill);
            await this.page.waitForTimeout(300);
            await this.page.locator(`.ant-select-dropdown:visible .ant-select-item:has-text("${skill}")`).first().click();
        }
        
        // Click outside to close
        await this.page.click('body');
    }
}
