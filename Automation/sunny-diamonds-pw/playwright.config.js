/**
 * playwright.config.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Playwright configuration for Sunny Diamonds QA Automation
 * Target: https://qa-sunnydiamonds.webc.in
 * ─────────────────────────────────────────────────────────────────────────────
 */

const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({

  // ── Test discovery ─────────────────────────────────────────────────────────
  testDir : './tests',
  testMatch: '**/*.spec.js',

  // ── Execution settings ─────────────────────────────────────────────────────
  fullyParallel : false,   // Cart tests share session state — run sequentially
  workers       : 1,       // Single worker to preserve login/cart session
  retries       : 1,       // 1 automatic retry on failure
  timeout       : 60000,   // 60s per test
  expect        : { timeout: 10000 },

  // ── Reporter ───────────────────────────────────────────────────────────────
  reporter: [
    ['list'],                                         // Console output
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results/results.json' }],
  ],

  // ── Global settings ────────────────────────────────────────────────────────
  use: {
    baseURL           : 'https://qa-sunnydiamonds.webc.in',
    headless          : false,                         // Run with browser visible
    viewport          : { width: 1280, height: 800 },
    actionTimeout     : 15000,
    navigationTimeout : 30000,
    screenshot        : 'only-on-failure',
    video             : 'retain-on-failure',
    trace             : 'on-first-retry',
    ignoreHTTPSErrors : true,
  },

  // ── Projects (browsers) ────────────────────────────────────────────────────
  projects: [
    {
      name : 'chromium',
      use  : { ...devices['Desktop Chrome'] },
    },
    {
      name : 'firefox',
      use  : { ...devices['Desktop Firefox'] },
    },
    {
      name : 'webkit',
      use  : { ...devices['Desktop Safari'] },
    },
  ],

  // ── Output directories ─────────────────────────────────────────────────────
  outputDir: 'test-results',
});
