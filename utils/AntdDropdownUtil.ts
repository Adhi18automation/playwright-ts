import { Page, Locator } from '@playwright/test';

export class AntdDropdownUtil {
  
  /**
   * Standard method to handle Ant Design dropdown with search input
   * Uses the pattern: (//span[text()='Label *'])[index]/..//input[@type='search']
   */
  static async fillSearchableDropdown(
    page: Page,
    labelText: string,
    searchText: string,
    index: number = 1,
    useDialog: boolean = false
  ): Promise<void> {
    const context = useDialog ? page.locator('[role="dialog"]') : page;
    
    // Build the XPath selector similar to the Department pattern
    const xpath = `(//span[text()='${labelText} *'])[${index}]/..//input[@type='search']`;
    const input = context.locator(xpath);

    // 1️⃣ Click & type
    await input.waitFor({ state: 'visible' });
    await input.click();
    await input.fill(searchText);

    // 2️⃣ Wait for dropdown
    const dropdown = page.locator('.ant-select-dropdown:visible');
    await dropdown.waitFor({ state: 'visible' });

    // 3️⃣ Click EXACT matching option
    const option = dropdown.locator(
      `.ant-select-item-option:has-text("${searchText}")`
    );

    await option.waitFor({ state: 'visible' });
    await option.click();

    // 4️⃣ Ensure dropdown closed
    await dropdown.waitFor({ state: 'hidden' });
  }

  /**
   * Alternative method with fallback to keyboard selection
   */
  static async fillSearchableDropdownWithFallback(
    page: Page,
    labelText: string,
    searchText: string,
    index: number = 1,
    useDialog: boolean = false
  ): Promise<void> {
    const context = useDialog ? page.locator('[role="dialog"]') : page;
    
    // Build the XPath selector
    const xpath = `(//span[text()='${labelText} *'])[${index}]/..//input[@type='search']`;
    const input = context.locator(xpath);

    // 1️⃣ Click & type
    await input.waitFor({ state: 'visible' });
    await input.click();
    await input.fill(searchText);

    // 2️⃣ Wait for dropdown
    const dropdown = page.locator('.ant-select-dropdown:visible');
    await dropdown.waitFor({ state: 'visible' });

    // 3️⃣ Try exact match first
    try {
      const option = dropdown.locator(
        `.ant-select-item-option:has-text("${searchText}")`
      );
      await option.waitFor({ state: 'visible', timeout: 3000 });
      await option.click();
    } catch (error) {
      // Fallback: Use keyboard selection
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('Enter');
    }

    // 4️⃣ Ensure dropdown closed
    await dropdown.waitFor({ state: 'hidden' });
  }

  /**
   * Method for dropdowns without asterisk (non-required fields)
   */
  static async fillSearchableDropdownNoAsterisk(
    page: Page,
    labelText: string,
    searchText: string,
    index: number = 1,
    useDialog: boolean = false
  ): Promise<void> {
    const context = useDialog ? page.locator('[role="dialog"]') : page;
    
    // Build XPath without asterisk
    const xpath = `(//span[text()='${labelText}'])[${index}]/..//input[@type='search']`;
    const input = context.locator(xpath);

    // 1️⃣ Click & type
    await input.waitFor({ state: 'visible' });
    await input.click();
    await input.fill(searchText);

    // 2️⃣ Wait for dropdown
    const dropdown = page.locator('.ant-select-dropdown:visible');
    await dropdown.waitFor({ state: 'visible' });

    // 3️⃣ Click EXACT matching option
    const option = dropdown.locator(
      `.ant-select-item-option:has-text("${searchText}")`
    );

    await option.waitFor({ state: 'visible' });
    await option.click();

    // 4️⃣ Ensure dropdown closed
    await dropdown.waitFor({ state: 'hidden' });
  }

  /**
   * Method for general Ant Design dropdowns (not necessarily search type)
   */
  static async fillGeneralDropdown(
    page: Page,
    labelText: string,
    searchText: string,
    index: number = 1,
    useDialog: boolean = false
  ): Promise<void> {
    const context = useDialog ? page.locator('[role="dialog"]') : page;
    
    // Build XPath for general dropdown input
    const xpath = `(//span[text()='${labelText} *'])[${index}]/..//input[@type='search'] | (//span[text()='${labelText}'])[${index}]/..//input[@type='search']`;
    const input = context.locator(xpath);

    // 1️⃣ Click & type
    await input.waitFor({ state: 'visible' });
    await input.click();
    await input.fill(searchText);

    // 2️⃣ Wait for dropdown
    const dropdown = page.locator('.ant-select-dropdown:visible');
    await dropdown.waitFor({ state: 'visible' });

    // 3️⃣ Try exact match first, fallback to keyboard
    try {
      const option = dropdown.locator(
        `.ant-select-item-option:has-text("${searchText}")`
      );
      await option.waitFor({ state: 'visible', timeout: 5000 });
      await option.click();
    } catch (error) {
      // Fallback: Use keyboard selection but ensure we select the right one
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('Enter');
    }

    // 4️⃣ Ensure dropdown closed
    await dropdown.waitFor({ state: 'hidden' });
  }

  /**
   * Specialized method for Department dropdown (as mentioned in the request)
   */
  static async fillDepartmentDropdown(
    page: Page,
    departmentText: string,
    useDialog: boolean = true
  ): Promise<void> {
    // Use the exact pattern from your request
    const xpath = `(//span[text()='Department *'])[2]/..//input[@type='search']`;
    const context = useDialog ? page.locator('[role="dialog"]') : page;
    const input = context.locator(xpath);

    // 1️⃣ Click & type
    await input.waitFor({ state: 'visible' });
    await input.click();
    await input.fill(departmentText);

    // 2️⃣ Wait for dropdown
    const dropdown = page.locator('.ant-select-dropdown:visible');
    await dropdown.waitFor({ state: 'visible' });

    // 3️⃣ Click EXACT matching option
    const option = dropdown.locator(
      `.ant-select-item-option:has-text("${departmentText}")`
    );

    await option.waitFor({ state: 'visible' });
    await option.click();

    // 4️⃣ Ensure dropdown closed
    await dropdown.waitFor({ state: 'hidden' });
  }

  /**
   * Specialized method for Company dropdown with improved text matching
   */
  static async fillCompanyDropdown(
    page: Page,
    searchText: string,
    index: number = 1,
    useDialog: boolean = false
  ): Promise<void> {
    const context = useDialog ? page.locator('[role="dialog"]') : page;
    
    // Trim whitespace from search text
    const trimmedText = searchText.trim();
    
    // Build the XPath selector
    const xpath = `(//span[text()='Company Name *'])[${index}]/..//input[@type='search']`;
    const input = context.locator(xpath);

    // 1️⃣ Wait for input to be visible and interact
    await input.waitFor({ state: 'visible', timeout: 10000 });
    await input.click();
    await input.clear();
    
    // Type with delay to trigger search
    await input.fill(trimmedText);
    await page.waitForTimeout(200);

    // 2️⃣ Wait for dropdown to appear
    const dropdown = page.locator('.ant-select-dropdown:visible');
    await dropdown.waitFor({ state: 'visible', timeout: 5000 });

    // 3️⃣ Wait a bit for options to load
    await page.waitForTimeout(1000);

    // 4️⃣ Try multiple selection strategies for company names
    try {
      // Strategy 1: Exact match with trimmed text
      const exactOption = dropdown.locator(
        `.ant-select-item-option-content:has-text("${trimmedText}")`
      );
      if (await exactOption.isVisible()) {
        await exactOption.click();
        return;
      }
    } catch (error) {
      console.log('Exact match failed, trying strategy 2');
    }

    try {
      // Strategy 2: Partial match (first few words)
      const words = trimmedText.split(' ').slice(0, 2).join(' ');
      const partialOption = dropdown.locator(
        `.ant-select-item-option-content:has-text("${words}")`
      );
      if (await partialOption.isVisible()) {
        await partialOption.click();
        return;
      }
    } catch (error) {
      console.log('Partial match failed, trying strategy 3');
    }

    try {
      // Strategy 3: Contains text (case insensitive)
      const containsOption = dropdown.locator(
        `.ant-select-item-option-content`
      ).filter({ hasText: trimmedText });
      
      const count = await containsOption.count();
      if (count > 0) {
        await containsOption.first().click();
        return;
      }
    } catch (error) {
      console.log('Contains match failed, trying strategy 4');
    }

    try {
      // Strategy 4: Match any part of the company name
      const mainWords = trimmedText.split(' ').filter(word => word.length > 3);
      for (const word of mainWords) {
        const wordOption = dropdown.locator(
          `.ant-select-item-option-content:has-text("${word}")`
        );
        if (await wordOption.isVisible()) {
          await wordOption.click();
          return;
        }
      }
    } catch (error) {
      console.log('Word match failed, using keyboard fallback');
    }

    // Fallback: Use keyboard navigation
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');

    // 5️⃣ Verify dropdown closed
    await dropdown.waitFor({ state: 'hidden', timeout: 3000 });
  }

  /**
   * Specialized method for Function dropdown with improved selection
   */
  static async fillFunctionDropdown(
    page: Page,
    searchText: string,
    index: number = 1,
    useDialog: boolean = false
  ): Promise<void> {
    const context = useDialog ? page.locator('[role="dialog"]') : page;
    
    try {
      // Build the XPath selector using the exact pattern
      const xpath = `(//span[text()='Function *'])[${index}]/..//input[@type='search']`;
      const input = context.locator(xpath);

      // 1️⃣ Wait for input to be visible and interact
      await input.waitFor({ state: 'visible', timeout: 10000 });
      console.log('Function input found and visible');
      
      await input.click();
      await input.clear();
      
      // Type with delay to trigger search
      console.log(`Typing: "${searchText}"`);
      await input.type(searchText, { delay: 100 });

      // 2️⃣ Wait for dropdown to appear
      const dropdown = page.locator('.ant-select-dropdown:visible');
      await dropdown.waitFor({ state: 'visible', timeout: 5000 });
      console.log('Dropdown appeared');

      // 3️⃣ Wait a bit for options to load
      await page.waitForTimeout(1500);

      // 4️⃣ Debug: Log available options
      const allOptions = dropdown.locator('.ant-select-item-option-content');
      const optionCount = await allOptions.count();
      console.log(`Found ${optionCount} options for Function dropdown`);
      
      for (let i = 0; i < Math.min(optionCount, 5); i++) {
        const optionText = await allOptions.nth(i).textContent();
        console.log(`Option ${i + 1}: "${optionText}"`);
      }

      // 5️⃣ Try multiple selection strategies
      try {
        // Strategy 1: Exact match with option-content
        const exactOption = dropdown.locator(
          `.ant-select-item-option-content:has-text("${searchText}")`
        );
        if (await exactOption.isVisible()) {
          console.log('Using exact match strategy');
          await exactOption.click();
          return;
        }
      } catch (error) {
        console.log('Exact match failed, trying strategy 2');
      }

      try {
        // Strategy 2: Case insensitive contains
        const containsOption = dropdown.locator(
          `.ant-select-item-option-content`
        ).filter({ hasText: searchText });
        
        const count = await containsOption.count();
        if (count > 0) {
          console.log('Using case insensitive contains strategy');
          await containsOption.first().click();
          return;
        }
      } catch (error) {
        console.log('Contains match failed, trying strategy 3');
      }

      try {
        // Strategy 3: Partial word matching
        const words = searchText.toLowerCase().split(' ');
        for (const word of words) {
          if (word.length > 2) { // Skip very short words
            const wordOption = dropdown.locator(
              `.ant-select-item-option-content:text-is("${word}")`
            );
            if (await wordOption.isVisible()) {
              console.log(`Using word match strategy with word: "${word}"`);
              await wordOption.click();
              return;
            }
          }
        }
      } catch (error) {
        console.log('Word match failed, trying strategy 4');
      }

      try {
        // Strategy 4: First available option (as last resort)
        const firstOption = dropdown.locator('.ant-select-item-option').first();
        if (await firstOption.isVisible()) {
          console.log('Using first available option as fallback');
          await firstOption.click();
          return;
        }
      } catch (error) {
        console.log('First option failed, using keyboard fallback');
      }

      // Fallback: Use keyboard navigation
      console.log('Using keyboard navigation fallback');
      await page.keyboard.press('ArrowDown');
      await page.waitForTimeout(500);
      await page.keyboard.press('Enter');

      // 6️⃣ Verify dropdown closed
      await dropdown.waitFor({ state: 'hidden', timeout: 3000 });
      
    } catch (error) {
      console.error('Function dropdown failed:', error);
      // Try alternative approach
      await this.fillFunctionDropdownAlternative(page, searchText, index, useDialog);
    }
  }

  /**
   * Alternative method for Function dropdown with different locator strategy
   */
  static async fillFunctionDropdownAlternative(
    page: Page,
    searchText: string,
    index: number = 1,
    useDialog: boolean = false
  ): Promise<void> {
    const context = useDialog ? page.locator('[role="dialog"]') : page;
    
    console.log('Trying alternative Function dropdown approach');
    
    try {
      // Alternative locator strategy
      const alternativeXpath = `//span[contains(text(),'Function')]/..//input[@type='search']`;
      const input = context.locator(alternativeXpath);

      await input.waitFor({ state: 'visible', timeout: 5000 });
      await input.click();
      await input.clear();
      await input.type(searchText, { delay: 100 });

      // Wait and select first option
      await page.waitForTimeout(1000);
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('Enter');
      
    } catch (error) {
      console.error('Alternative Function dropdown also failed:', error);
      throw error;
    }
  }

  /**
   * Generic method for any dropdown using the Function pattern
   * Can be used for Role, Company, Department, etc.
   */
  static async fillGenericSearchDropdown(
    page: Page,
    labelText: string,
    searchText: string,
    index: number = 1,
    useDialog: boolean = false
  ): Promise<void> {
    const context = useDialog ? page.locator('[role="dialog"]') : page;
    
    // Build the XPath selector using the pattern
    const xpath = `(//span[text()='${labelText} *'])[${index}]/..//input[@type='search']`;
    const input = context.locator(xpath);

    // 1️⃣ Wait for input to be visible and interact
    await input.waitFor({ state: 'visible', timeout: 10000 });
    await input.click();
    await input.clear();
    await input.fill(searchText);

    // 2️⃣ Wait for dropdown
    const dropdown = page.locator('.ant-select-dropdown:visible');
    await dropdown.waitFor({ state: 'visible', timeout: 5000 });

    // 3️⃣ Select matching option with fallback
    try {
      const option = dropdown.locator(
        `.ant-select-item-option:has-text("${searchText}")`
      );
      await option.waitFor({ state: 'visible', timeout: 3000 });
      await option.click();
    } catch (error) {
      // Keyboard fallback
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('Enter');
    }

    // 4️⃣ Verify dropdown closed
    await dropdown.waitFor({ state: 'hidden', timeout: 3000 });
  }

  /**
   * Specialized method for PersonalInformationPage dropdowns (Country, State, City)
   * Uses the exact selectors from the original implementation
   */
  static async fillPersonalInfoDropdown(
    page: Page,
    labelText: string,
    searchText: string,
    index: number = 1
  ): Promise<void> {
    // Build the exact selector pattern used in PersonalInformationPage
    const selector = page.locator(
      `(//span[text()='${labelText} *'])[${index}]/..//div[contains(@class,'ant-select-selector')]`
    );
    
    const input = page.locator(
      `(//span[text()='${labelText} *'])[${index}]/..//input[contains(@class,'ant-select-selection-search')]`
    );

    const options = page.locator(
      ".ant-select-dropdown:visible .ant-select-item-option-content"
    );

    // 1️⃣ Wait for dependency
    await input.waitFor({ state: 'visible', timeout: 15000 });

    // 2️⃣ Open dropdown
    await selector.click();

    // 3️⃣ Focus & clear
    await input.focus();
    await page.keyboard.press('Control+A');
    await page.keyboard.press('Backspace');

    // 4️⃣ Type
    await page.keyboard.type(searchText, { delay: 50 });

    // 5️⃣ Wait for options
    await options.first().waitFor({ state: 'visible' });

    // 6️⃣ Select EXACT matching option instead of random
    try {
      const exactOption = page.locator(
        `.ant-select-dropdown:visible .ant-select-item-option-content:has-text("${searchText}")`
      );
      await exactOption.waitFor({ state: 'visible', timeout: 3000 });
      await exactOption.click();
    } catch (error) {
      // Fallback to keyboard selection
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('Enter');
    }

    // 7️⃣ Wait for dropdown to close
    await page
      .locator('.ant-select-dropdown:visible')
      .waitFor({ state: 'hidden' });
  }
}
