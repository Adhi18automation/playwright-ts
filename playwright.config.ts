import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',

  fullyParallel: false,
  workers: 1,
  timeout: 180000,

  reporter: 'html',

  use: {
    browserName: 'chromium',
    headless: false,
    trace: 'on-first-retry',
    actionTimeout: 30000,
    navigationTimeout: 30000,
    launchOptions: {
      args: ['--start-maximized'],
    },
    viewport: null,
  },
});
