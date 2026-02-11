import { Page, Locator } from '@playwright/test';
import { BasePage } from './basepage';

export class ApplyPage extends BasePage {
    private readonly applyButton: Locator;
    private readonly uploadNewResumeButton: Locator;

    constructor(page: Page) {
        super(page);
        
        // Apply button locator (changed from Check Eligibility)
        this.applyButton = this.page.locator('button:has-text("Apply")').first();
        
        // Upload New Resume button - div with "Upload New Resume" text
        this.uploadNewResumeButton = this.page.locator('div:has-text("Upload New Resume")').first();
    }

    /**
     * Click on the Apply button
     */
    async clickApply(): Promise<void> {
        this.log('Looking for Apply button');
        
        // Capture screenshot before attempting to click
        await this.captureScreenshot('before-apply-click');
        
        let buttonClicked = false;
        
        // Strategy 1: Try primary locator
        try {
            this.log('Trying primary locator for Apply button...');
            await this.applyButton.waitFor({ state: 'attached', timeout: 5000 });
            this.log('Apply button is attached to DOM');
            
            await this.applyButton.waitFor({ state: 'visible', timeout: 5000 });
            this.log('Apply button is visible');
            
            await this.applyButton.scrollIntoViewIfNeeded();
            this.log('Apply button scrolled into view');
            
            await this.captureScreenshot('apply-ready-to-click');
            
            await this.applyButton.click({ timeout: 3000 });
            buttonClicked = true;
            this.log('✓ Apply button clicked with primary locator');
            
        } catch (primaryError) {
            this.log('Primary locator failed, trying alternative strategies...', 'error');
            await this.captureScreenshot('apply-primary-failed');
            
            // Strategy 2: Try alternative locators
            const alternativeLocators = [
                this.page.locator('button:has-text("Apply")'),
                this.page.locator('[role="button"]:has-text("Apply")'),
                this.page.locator('.apply, .btn-apply'),
                this.page.locator('text=Apply'),
                this.page.locator('div').filter({ hasText: 'Apply' }).first(),
                this.page.locator('*').filter({ hasText: 'Apply' }).first(),
                this.page.locator('button').filter({ hasText: 'Apply' }).first()
            ];
            
            for (let i = 0; i < alternativeLocators.length; i++) {
                try {
                    this.log(`Trying alternative locator ${i + 1} for Apply button...`);
                    const locator = alternativeLocators[i];
                    
                    const count = await locator.count();
                    this.log(`Found ${count} elements with alternative locator ${i + 1}`);
                    
                    if (count > 0) {
                        const element = locator.first();
                        await element.waitFor({ state: 'visible', timeout: 3000 });
                        
                        await element.scrollIntoViewIfNeeded();
                        await this.captureScreenshot(`apply-alternative-${i + 1}-ready-to-click`);
                        
                        await element.click({ timeout: 3000 });
                        buttonClicked = true;
                        this.log(`✓ Apply button clicked with alternative locator ${i + 1}`);
                        await this.captureScreenshot(`apply-alternative-${i + 1}-clicked`);
                        break;
                    }
                } catch (altError) {
                    this.log(`Alternative locator ${i + 1} failed: ${altError instanceof Error ? altError.message : String(altError)}`, 'error');
                    await this.captureScreenshot(`apply-alternative-${i + 1}-failed`);
                }
            }
            
            if (!buttonClicked) {
                // Debug: Show all elements that contain "Apply"
                this.log('Debug: Checking for any elements containing "Apply"...', 'error');
                const allElements = this.page.locator('*:has-text("Apply")');
                const elementCount = await allElements.count();
                this.log(`Found ${elementCount} elements containing "Apply" text`, 'error');
                
                await this.captureScreenshot('apply-debug-all-elements');
                
                for (let i = 0; i < Math.min(elementCount, 5); i++) {
                    const element = allElements.nth(i);
                    const tagName = await element.evaluate(el => el.tagName);
                    const text = await element.textContent();
                    const isVisible = await element.isVisible().catch(() => false);
                    const isEnabled = await element.isEnabled().catch(() => false);
                    this.log(`Element ${i + 1}: ${tagName} - "${text}" - Visible: ${isVisible} - Enabled: ${isEnabled}`, 'error');
                }
                
                await this.captureScreenshot('apply-all-strategies-failed');
                
                throw new Error(`Could not find or click Apply button. Tried ${alternativeLocators.length + 1} different strategies. Original error: ${primaryError instanceof Error ? primaryError.message : String(primaryError)}`);
            }
        }
        
        if (buttonClicked) {
            // Capture screenshot after clicking
            await this.captureScreenshot('after-apply-click');
            
            // Wait a bit to see if any action occurs
            await this.page.waitForTimeout(3000);
            
            // Check for any URL changes or navigation
            const currentUrl = this.page.url();
            this.log(`Current URL after Apply click: ${currentUrl}`);
            
            // Wait for potential navigation (up to 5 seconds)
            let navigationOccurred = false;
            try {
                await this.page.waitForURL('**/apply,**/submit,**/success', { timeout: 5000 });
                navigationOccurred = true;
                this.log('✅ Navigation detected after Apply click');
            } catch (e) {
                this.log('No navigation to apply/submit/success pages detected');
            }
            
            // Check for any modal dialogs or popups
            const modalVisible = await this.page.locator('.modal, .dialog, .popup, .overlay').isVisible().catch(() => false);
            if (modalVisible) {
                this.log('Modal/popup detected after Apply click');
                await this.captureScreenshot('apply-modal-detected');
            }
            
            // Enhanced popup detection - check for various popup patterns
            const popupSelectors = [
                '.modal', '.dialog', '.popup', '.overlay',
                '[role="dialog"]', '[role="modal"]', '[role="alertdialog"]',
                '.modal-dialog', '.popup-dialog', '.modal-content',
                '.modal-backdrop', '.popup-backdrop',
                '.ant-modal', '.ant-modal-content', '.ant-modal-body',
                '.ui-modal', '.ui-dialog', '.ui-popup',
                '[class*="modal"]', '[class*="popup"]', '[class*="dialog"]',
                '[id*="modal"]', '[id*="popup"]', '[id*="dialog"]'
            ];
            
            let popupFound = false;
            for (const selector of popupSelectors) {
                try {
                    const popup = this.page.locator(selector);
                    const count = await popup.count();
                    if (count > 0) {
                        const isVisible = await popup.first().isVisible().catch(() => false);
                        if (isVisible) {
                            this.log(`Popup detected with selector: ${selector}`);
                            await this.captureScreenshot(`apply-popup-${selector.replace(/[^\w]/g, '-')}`);
                            popupFound = true;
                            
                            // Get popup content for debugging
                            const popupText = await popup.first().textContent().catch(() => '') || '';
                            this.log(`Popup content: "${popupText.substring(0, 100)}..."`);
                            break;
                        }
                    }
                } catch (e) {
                    // Continue checking other selectors
                }
            }
            
            // Check for any new elements that appeared after click
            const allVisibleElements = await this.page.locator('*:visible').count();
            this.log(`Total visible elements after Apply click: ${allVisibleElements}`);
            
            // Check for any elements with z-index that might be overlays
            const overlayElements = await this.page.locator('[style*="z-index"], [style*="position: fixed"], [style*="position: absolute"]').count();
            if (overlayElements > 0) {
                this.log(`Found ${overlayElements} elements with positioning/z-index (possible overlays)`);
                await this.captureScreenshot('apply-overlay-elements');
            }
            
            // Check for any elements that became visible recently
            await this.page.waitForTimeout(1000); // Wait a bit more for delayed popups
            
            // Re-check for popups after additional wait
            const delayedModalVisible = await this.page.locator('.modal, .dialog, .popup, .overlay').isVisible().catch(() => false);
            if (delayedModalVisible && !modalVisible) {
                this.log('Delayed popup detected after additional wait');
                await this.captureScreenshot('apply-delayed-popup');
            }
            
            // Check for any success messages
            const successMessage = await this.page.locator('text=Applied Successfully, text=Success, text=Application Submitted, text=Thank you').isVisible().catch(() => false);
            if (successMessage) {
                this.log('Success message detected after Apply click');
                await this.captureScreenshot('apply-success-message');
            }
            
            // Check for any error messages
            const errorMessage = await this.page.locator('text=Error, text=Required, text=Please fill, text=Invalid').isVisible().catch(() => false);
            if (errorMessage) {
                this.log('Error message detected after Apply click');
                await this.captureScreenshot('apply-error-message');
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
            await this.captureScreenshot('after-apply-wait');
            
            // Log final status
            if (navigationOccurred) {
                this.log('✅ Apply button successfully triggered navigation/page change');
            } else {
                this.log('⚠️ Apply button clicked but no navigation/page change detected');
                this.log('This might be expected behavior or the button might need additional steps');
            }
            
            this.log('✓ Successfully clicked Apply button');
        }
    }

    /**
     * Click on Upload New Resume button and upload a file
     */
    async uploadNewResume(filePath: string): Promise<void> {
        this.log('Looking for Upload New Resume button');
        
        // Capture screenshot before attempting to click
        await this.captureScreenshot('before-upload-resume-click');
        
        try {
            // First, wait for any popup/dialog to appear after Apply button click
            await this.page.waitForTimeout(2000);
            
            // Check if there's a popup dialog
            const popupDialog = this.page.locator('[role="dialog"]');
            const popupVisible = await popupDialog.isVisible().catch(() => false);
            
            if (popupVisible) {
                this.log('Popup dialog detected, looking for Upload New Resume button inside popup');
                await this.captureScreenshot('upload-resume-popup-detected');
                
                // Look for Upload New Resume button inside the popup
                const uploadButtonInPopup = popupDialog.locator('div:has-text("Upload New Resume")').first();
                
                // Wait for the button to be visible inside the popup
                await uploadButtonInPopup.waitFor({ state: 'visible', timeout: 10000 });
                this.log('Upload New Resume button found inside popup');
                
                // Scroll into view to ensure it's in viewport
                await uploadButtonInPopup.scrollIntoViewIfNeeded();
                this.log('Upload New Resume button scrolled into view');
                
                // Capture screenshot just before clicking
                await this.captureScreenshot('upload-resume-ready-to-click');
                
                // Click the Upload New Resume button
                await uploadButtonInPopup.click({ timeout: 3000 });
                this.log('✓ Upload New Resume button clicked inside popup');
                
            } else {
                // Try the original approach if no popup is found
                this.log('No popup detected, looking for Upload New Resume button on main page');
                
                // Wait for the Upload New Resume button to be attached to DOM
                await this.uploadNewResumeButton.waitFor({ state: 'attached', timeout: 10000 });
                this.log('Upload New Resume button is attached to DOM');
                
                // Wait for it to be visible
                await this.uploadNewResumeButton.waitFor({ state: 'visible', timeout: 5000 });
                this.log('Upload New Resume button is visible');
                
                // Scroll into view to ensure it's in viewport
                await this.uploadNewResumeButton.scrollIntoViewIfNeeded();
                this.log('Upload New Resume button scrolled into view');
                
                // Capture screenshot just before clicking
                await this.captureScreenshot('upload-resume-ready-to-click');
                
                // Click the Upload New Resume button
                await this.uploadNewResumeButton.click({ timeout: 3000 });
                this.log('✓ Upload New Resume button clicked');
            }
            
            // Capture screenshot after clicking
            await this.captureScreenshot('after-upload-resume-click');
            
            // Wait for file input to appear (usually appears after clicking upload button)
            await this.page.waitForTimeout(2000);
            
            // Look for file input element (could be in popup or on main page)
            const fileInput = this.page.locator('input[type="file"]');
            
            // File inputs are often hidden, so we don't wait for visibility
            const fileInputExists = await fileInput.count() > 0;
            if (fileInputExists) {
                this.log('File input element found (may be hidden)');
                
                // Upload the file directly to the hidden input
                await fileInput.setInputFiles(filePath);
                this.log(`✓ File uploaded: ${filePath}`);
                
            } else {
                throw new Error('File input element not found');
            }
            
            // Capture screenshot after file upload
            await this.captureScreenshot('after-file-upload');
            
            // Wait a bit to see if any action occurs
            await this.page.waitForTimeout(3000);
            
            // Check for any success messages
            const successMessage = await this.page.locator('text=Uploaded Successfully, text=Resume Uploaded, text=File Uploaded, text=Success').isVisible().catch(() => false);
            if (successMessage) {
                this.log('Success message detected after file upload');
                await this.captureScreenshot('upload-resume-success-message');
            }
            
            // Check for any error messages
            const errorMessage = await this.page.locator('text=Upload Failed, text=Error, text=Invalid File, text=File too large').isVisible().catch(() => false);
            if (errorMessage) {
                this.log('Error message detected after file upload');
                await this.captureScreenshot('upload-resume-error-message');
            }
            
            // Check for any progress indicators
            const progressVisible = await this.page.locator('.progress, .uploading, .loading').isVisible().catch(() => false);
            if (progressVisible) {
                this.log('Upload progress indicator detected');
                await this.captureScreenshot('upload-resume-progress');
            }
            
            // Final screenshot
            await this.captureScreenshot('upload-resume-completed');
            
            this.log('✓ Successfully uploaded new resume');
            
        } catch (error) {
            this.log('Failed to upload new resume', 'error');
            await this.captureScreenshot('upload-resume-failure');
            throw new Error(`Failed to upload new resume: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
}
