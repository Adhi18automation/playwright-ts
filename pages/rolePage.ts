import { Page, Locator } from '@playwright/test';
import { BasePage } from './basepage';

export class RolePage extends BasePage {
    private readonly rolesAnchorTag: Locator;
    private readonly searchBar: Locator;
    private readonly applyButton: Locator;

    constructor(page: Page) {
        super(page);
        
        // Using text=Roles locator as requested
        this.rolesAnchorTag = this.page.locator('text=Roles').first();
        
        // Search bar locator as specified
        this.searchBar = this.page.locator('input[type="search"], input[placeholder*="Search"]').first();
        
        // Apply button - button with "Apply" text
        this.applyButton = this.page.locator('button:has-text("Apply")').first();
    }

    /**
     * Click on the Roles anchor tag to navigate to Roles page
     */
    async clickRolesAnchorTag(): Promise<void> {
        this.log('Looking for Roles anchor tag');
        
        try {
            // Wait for the anchor tag to be visible and enabled
            await this.rolesAnchorTag.waitFor({ state: 'visible', timeout: 10000 });
            await this.rolesAnchorTag.waitFor({ state: 'attached', timeout: 5000 });
            
            // Use safeClick from BasePage for reliable clicking
            await this.safeClick(this.rolesAnchorTag, 'Roles anchor tag');
            
            // Wait for page navigation to complete
            await this.page.waitForLoadState('domcontentloaded', { timeout: 15000 });
            await this.page.waitForTimeout(1000); // Additional stabilization
            
            this.log('✓ Successfully clicked Roles anchor tag and navigated to Roles page');
        } catch (error) {
            this.log('Primary locator failed, trying fallback strategies...', 'error');
            
            // Fallback Strategy 1: Try href-based locator
            try {
                const hrefRoles = this.page.locator('a[href="/roles"]').first();
                await hrefRoles.waitFor({ state: 'visible', timeout: 5000 });
                await this.safeClick(hrefRoles, 'Roles href anchor tag');
                this.log('✓ Successfully clicked Roles using href fallback');
            } catch (hrefError) {
                this.log('Href fallback failed, trying text-based strategies...', 'error');
                
                // Fallback Strategy 2: Try case-insensitive text search
                try {
                    const textRoles = this.page.locator('text=/roles/i').first();
                    await textRoles.waitFor({ state: 'visible', timeout: 5000 });
                    await this.safeClick(textRoles, 'Roles text (case-insensitive)');
                    this.log('✓ Successfully clicked Roles using case-insensitive text');
                } catch (textError) {
                    this.log('All locator strategies failed', 'error');
                    await this.captureScreenshot('roles-anchor-click-failure');
                    throw new Error(`Failed to click Roles anchor tag with all strategies: ${error}`);
                }
            }
        }
    }

    /**
     * Simple flow: Only click Roles anchor tag
     */
    async clickRolesSidebar(): Promise<void> {
        this.log('Starting Roles sidebar click flow');
        
        await this.clickRolesAnchorTag();
        
        this.log('✓ Roles sidebar click flow completed');
    }

    /**
     * Search for a role using the search bar
     * @param roleName - The role name to search for (from Excel Role-Name column)
     */
    async searchRole(roleName: string): Promise<void> {
        this.log(`Searching for role: "${roleName}"`);
        
        try {
            // Wait for search bar to be visible
            await this.searchBar.waitFor({ state: 'visible', timeout: 10000 });
            
            // Clear any existing text and fill the role name
            await this.searchBar.clear();
            await this.searchBar.fill(roleName);
            
            // Press Enter to trigger search
            await this.searchBar.press('Enter');
            
            // Wait for search results to load
            await this.page.waitForTimeout(2000);
            
            this.log(`✓ Successfully searched for role: "${roleName}"`);
        } catch (error) {
            this.log(`Failed to search for role: "${roleName}"`, 'error');
            await this.captureScreenshot('role-search-failure');
            throw new Error(`Failed to search for role "${roleName}": ${error}`);
        }
    }

    /**
     * Click on the Apply button (div tag with "Apply" text)
     */
    async clickApplyButton(): Promise<void> {
        this.log('Looking for Apply button');
        
        // Capture screenshot before attempting to click Apply button
        await this.captureScreenshot('before-apply-button-click');
        
        try {
            // Strategy 1: Try the primary locator with enhanced clicking
            this.log('Trying primary locator for Apply button...');
            
            // Wait for the Apply button to be attached to DOM
            await this.applyButton.waitFor({ state: 'attached', timeout: 10000 });
            this.log('Apply button is attached to DOM');
            
            // Wait for it to be visible
            await this.applyButton.waitFor({ state: 'visible', timeout: 5000 });
            this.log('Apply button is visible');
            
            // Scroll into view to ensure it's in viewport
            await this.applyButton.scrollIntoViewIfNeeded();
            this.log('Apply button scrolled into view');
            
            // Capture screenshot just before clicking
            await this.captureScreenshot('apply-button-visible-ready-to-click');
            
            // Try multiple clicking strategies
            let clicked = false;
            
            // Click Strategy 1: Standard click
            try {
                await this.applyButton.click({ timeout: 3000 });
                clicked = true;
                this.log('✓ Apply button clicked with standard click');
            } catch (clickError) {
                this.log(`Standard click failed: ${clickError instanceof Error ? clickError.message : String(clickError)}`, 'error');
            }
            
            // Click Strategy 2: Force click if standard failed
            if (!clicked) {
                try {
                    await this.applyButton.click({ force: true, timeout: 3000 });
                    clicked = true;
                    this.log('✓ Apply button clicked with force click');
                } catch (forceClickError) {
                    this.log(`Force click failed: ${forceClickError instanceof Error ? forceClickError.message : String(forceClickError)}`, 'error');
                }
            }
            
            // Click Strategy 3: Double click
            if (!clicked) {
                try {
                    await this.applyButton.dblclick({ timeout: 3000 });
                    clicked = true;
                    this.log('✓ Apply button clicked with double click');
                } catch (dblClickError) {
                    this.log(`Double click failed: ${dblClickError instanceof Error ? dblClickError.message : String(dblClickError)}`, 'error');
                }
            }
            
            // Click Strategy 4: JavaScript click
            if (!clicked) {
                try {
                    await this.applyButton.evaluate((element: HTMLElement) => element.click());
                    clicked = true;
                    this.log('✓ Apply button clicked with JavaScript click');
                } catch (jsClickError) {
                    this.log(`JavaScript click failed: ${jsClickError instanceof Error ? jsClickError.message : String(jsClickError)}`, 'error');
                }
            }
            
            if (!clicked) {
                throw new Error('All clicking strategies failed for Apply button');
            }
            
            // Capture screenshot after clicking
            await this.captureScreenshot('after-apply-button-click');
            
            // Wait a bit longer to see if any action occurs
            await this.page.waitForTimeout(3000);
            
            // Check for any URL changes or navigation after clicking Apply
            const currentUrl = this.page.url();
            this.log(`Current URL after Apply click: ${currentUrl}`);
            
            // Wait for potential navigation (up to 5 seconds)
            let navigationOccurred = false;
            try {
                await this.page.waitForURL('**/apply,**/application,**/submit,**/success', { timeout: 5000 });
                navigationOccurred = true;
                this.log('✅ Navigation detected after Apply click');
            } catch (e) {
                this.log('No navigation to apply/submit/success pages detected');
            }
            
            // Check for any modal dialogs or popups
            const modalVisible = await this.page.locator('.modal, .dialog, .popup, .overlay').isVisible().catch(() => false);
            if (modalVisible) {
                this.log('Modal/popup detected after Apply click');
                await this.captureScreenshot('apply-button-modal-detected');
            }
            
            // Check for any success messages
            const successMessage = await this.page.locator('text=Applied Successfully, text=Success, text=Application Submitted, text=Thank you').isVisible().catch(() => false);
            if (successMessage) {
                this.log('Success message detected after Apply click');
                await this.captureScreenshot('apply-button-success-message');
            }
            
            // Check for any form validation errors
            const errorMessage = await this.page.locator('text=Error, text=Required, text=Please fill, text=Invalid').isVisible().catch(() => false);
            if (errorMessage) {
                this.log('Error message detected after Apply click');
                await this.captureScreenshot('apply-button-error-message');
            }
            
            // Check if any new tabs or windows opened
            const pages = this.page.context().pages();
            if (pages.length > 1) {
                this.log(`New tab/window detected. Total pages: ${pages.length}`);
                // Switch to new page if available
                const newPage = pages[pages.length - 1];
                const newUrl = newPage.url();
                this.log(`New page URL: ${newUrl}`);
                await this.captureScreenshot('apply-button-new-page');
            }
            
            // Check for any loading spinners or progress indicators
            const loadingVisible = await this.page.locator('.loading, .spinner, .progress').isVisible().catch(() => false);
            if (loadingVisible) {
                this.log('Loading indicator detected after Apply click');
                await this.captureScreenshot('apply-button-loading');
            }
            
            // Final verification - check if page content changed
            const finalUrl = this.page.url();
            if (finalUrl !== currentUrl) {
                this.log(`✅ Page navigation occurred: ${currentUrl} → ${finalUrl}`);
                navigationOccurred = true;
            } else {
                this.log(`❌ No page navigation detected. URL remained: ${currentUrl}`);
            }
            
            // Capture screenshot after wait
            await this.captureScreenshot('after-apply-button-wait');
            
            // Log final status
            if (navigationOccurred) {
                this.log('✅ Apply button successfully triggered navigation/page change');
            } else {
                this.log('⚠️ Apply button clicked but no navigation/page change detected');
                this.log('This might be expected behavior or the button might need additional steps');
            }
            
            this.log('✓ Successfully clicked Apply button with primary locator');
            
        } catch (primaryError) {
            this.log('Primary locator failed, trying alternative strategies...', 'error');
            
            // Capture screenshot when primary locator fails
            await this.captureScreenshot('apply-button-primary-locator-failed');
            
            // Strategy 2: Try different Apply button locators
            let buttonClicked = false;
            
            const alternativeLocators = [
                this.page.locator('button:has-text("Apply")'),
                this.page.locator('[role="button"]:has-text("Apply")'),
                this.page.locator('.apply-button, .btn-apply'),
                this.page.locator('div.apply, div.btn-apply'),
                this.page.locator('text=Apply'),
                this.page.locator('div').filter({ hasText: 'Apply' }).first(),
                this.page.locator('*').filter({ hasText: 'Apply' }).first()
            ];
            
            for (let i = 0; i < alternativeLocators.length; i++) {
                try {
                    this.log(`Trying alternative locator ${i + 1} for Apply button...`);
                    const locator = alternativeLocators[i];
                    
                    // Check if element exists and is visible
                    const count = await locator.count();
                    this.log(`Found ${count} elements with alternative locator ${i + 1}`);
                    
                    if (count > 0) {
                        const element = locator.first();
                        await element.waitFor({ state: 'visible', timeout: 3000 });
                        
                        // Scroll into view
                        await element.scrollIntoViewIfNeeded();
                        
                        // Capture screenshot before clicking with alternative locator
                        await this.captureScreenshot(`apply-button-alternative-${i + 1}-ready-to-click`);
                        
                        // Try multiple click strategies for alternative locator
                        let altClicked = false;
                        
                        try {
                            await element.click({ timeout: 3000 });
                            altClicked = true;
                        } catch {
                            try {
                                await element.click({ force: true });
                                altClicked = true;
                            } catch {
                                try {
                                    await element.evaluate((el: HTMLElement) => el.click());
                                    altClicked = true;
                                } catch {
                                    // All click strategies failed for this locator
                                }
                            }
                        }
                        
                        if (altClicked) {
                            // Capture screenshot after successful click with alternative locator
                            await this.captureScreenshot(`apply-button-alternative-${i + 1}-clicked`);
                            
                            this.log(`✓ Successfully clicked Apply button with alternative locator ${i + 1}`);
                            buttonClicked = true;
                            break;
                        }
                    }
                } catch (altError) {
                    this.log(`Alternative locator ${i + 1} failed: ${altError instanceof Error ? altError.message : String(altError)}`, 'error');
                    
                    // Capture screenshot when alternative locator fails
                    await this.captureScreenshot(`apply-button-alternative-${i + 1}-failed`);
                }
            }
            
            if (!buttonClicked) {
                // Debug: Show all elements that contain "Apply"
                this.log('Debug: Checking for any elements containing "Apply"...', 'error');
                const allApplyElements = this.page.locator('*:has-text("Apply")');
                const applyCount = await allApplyElements.count();
                this.log(`Found ${applyCount} elements containing "Apply" text`, 'error');
                
                // Capture screenshot showing all Apply elements found
                await this.captureScreenshot('apply-button-debug-all-elements');
                
                for (let i = 0; i < Math.min(applyCount, 5); i++) {
                    const element = allApplyElements.nth(i);
                    const tagName = await element.evaluate(el => el.tagName);
                    const text = await element.textContent();
                    const isVisible = await element.isVisible().catch(() => false);
                    const isEnabled = await element.isEnabled().catch(() => false);
                    this.log(`Element ${i + 1}: ${tagName} - "${text}" - Visible: ${isVisible} - Enabled: ${isEnabled}`, 'error');
                }
                
                // Final screenshot before throwing error
                await this.captureScreenshot('apply-button-all-strategies-failed');
                
                throw new Error(`Could not find or click Apply button. Tried ${alternativeLocators.length + 1} different strategies. Original error: ${primaryError instanceof Error ? primaryError.message : String(primaryError)}`);
            }
        }
        
        // Final screenshot after successful Apply button click
        await this.captureScreenshot('apply-button-flow-completed');
        
        this.log('✓ Apply button click flow completed');
    }

    /**
     * Complete flow: Click Roles anchor tag, search role, and click Apply
     * @param roleName - The role name to search for
     */
    async clickRolesSearchAndApply(roleName: string): Promise<void> {
        this.log(`Starting Roles click, search and apply flow for: "${roleName}"`);
        
        await this.clickRolesAnchorTag();
        await this.searchRole(roleName);
        await this.clickApplyButton();
        
        this.log(`✓ Roles click, search and apply flow completed for: "${roleName}"`);
    }
}
