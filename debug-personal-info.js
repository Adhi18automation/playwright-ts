const { chromium } = require('playwright');

async function debugPersonalInfo() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    // Navigate to the application
    await page.goto('your-app-url'); // Replace with actual URL
    
    // Wait for page to load
    await page.waitForTimeout(3000);
    
    // Try to find any dropdown elements
    console.log('Looking for Country dropdown...');
    
    // Method 1: Find any input with type search
    const searchInputs = await page.locator('input[type="search"]').count();
    console.log(`Found ${searchInputs} search inputs`);
    
    // Method 2: Find any span containing "Country"
    const countrySpans = await page.locator('span:has-text("Country")').count();
    console.log(`Found ${countrySpans} spans with "Country" text`);
    
    // Method 3: Find any ant-select elements
    const selectElements = await page.locator('.ant-select').count();
    console.log(`Found ${selectElements} ant-select elements`);
    
    // Method 4: Look for any element with "Country" in text
    const countryElements = await page.locator('*:has-text("Country")').count();
    console.log(`Found ${countryElements} elements with "Country" text`);
    
    // Take screenshot
    await page.screenshot({ path: 'debug-personal-info.png', fullPage: true });
    
  } catch (error) {
    console.error('Debug error:', error);
  } finally {
    await browser.close();
  }
}

debugPersonalInfo();
