// @ts-check
import { defineConfig, devices } from "@playwright/test";
import * as path from "path";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: "./tests",
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ["list"],
    ["html"], // Keep the default 'list' reporter or use any other you prefer
    [
      "@arghajit/playwright-pulse-report",
      {
        outputDir: path.resolve(__dirname, "pulse-report"),
      },
    ],
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://127.0.0.1:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    trace: "retain-on-failure",
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "Chrome Project",
      use: { ...devices["Desktop Chrome"] },
      workers: 1,
    },

    {
      name: "Edge Project",
      use: { ...devices["Desktop Edge"] },
      workers: 1,
    },
    {
      name: "Firefox Project",
      use: { ...devices["Desktop Firefox"] },
      workers: 1,
    },

    {
      name: "Webkit Project",
      use: { ...devices["Desktop Safari"] },
      workers: 1,
    },

    {
      name: "Mobile Webkit Project",
      use: { ...devices["iPhone 14"] },
      workers: 1,
    },

    {
      name: "Mobile Chrome Project",
      use: { ...devices["Pixel 5"] },
      workers: 1,
    },

    {
      name: "Chromium Project",
      use: { browserName: "chromium" },
      workers: 1,
    },
    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});

