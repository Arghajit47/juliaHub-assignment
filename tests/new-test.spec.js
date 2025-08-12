// tests/wikipedia.spec.js
import { test, expect } from "@playwright/test";
import { UAParser } from "ua-parser-js";

// --- Reliable Tests (5) ---
test("Wikipedia homepage loads", async ({ page }) => {
  await page.goto("https://www.wikipedia.org");
  await expect(page).toHaveTitle("Wikipedia");
  await expect(page.getByText("The Free Encyclopedia")).toBeVisible();
});

// test('Search for "Playwright" returns results', async ({ page }) => {
//   await page.goto("https://www.wikipedia.org");
//   await page.getByPlaceholder("Search Wikipedia").fill("Playwright");
//   await page.getByRole("button", { name: "Search" }).click();
//   await expect(page.getByRole("heading", { name: "Playwright" })).toBeVisible();
// });

test("English language switch works", async ({ page }) => {
  await page.goto("https://www.wikipedia.org");
  await page.getByText("English").click();
  await expect(page).toHaveURL(/en\.wikipedia\.org/);
});

// test("Main menu links are visible", async ({ page }) => {
//   await page.goto("https://en.wikipedia.org/wiki/Main_Page");
//   await expect(page.getByRole("link", { name: "Contents" })).toBeVisible();
//   await expect(
//     page.getByRole("link", { name: "Current events" })
//   ).toBeVisible();
// });

// test("Random article button works", async ({ page }) => {
//   await page.goto("https://en.wikipedia.org/wiki/Main_Page");
//   await page.getByRole("link", { name: "Random article" }).click();
//   await expect(page).not.toHaveURL(/Main_Page/);
// });

// --- Flaky Tests (3) ---
test.fixme(
  "Today on Wikipedia shows exactly 5 featured items",
  async ({ page }) => {
    await page.goto("https://en.wikipedia.org/wiki/Main_Page");
    const items = await page.locator("#mp-tfa").getByRole("listitem").count();
    expect(items).toBe(5); // FLAKY: Featured content changes
  }
);

// test("Main page has more than 10 languages", async ({ page }) => {
//   await page.goto("https://www.wikipedia.org");
//   const langCount = await page.locator(".central-featured-lang").count();
//   expect(langCount).toBe(10);
// });

// test("Article edit button exists", async ({ page }) => {
//   await page.goto("https://en.wikipedia.org/wiki/Software_testing");
//   await expect(page.getByRole("link", { name: "Edit" })).toBeVisible(); // FLAKY: May load slowly
// });

// // --- Skipped Tests (2) ---
// test.skip("Donate button redirects properly", async ({ page }) => {
//   await page.goto("https://www.wikipedia.org");
//   await page.getByText("Donate now").click();
//   await expect(page).toHaveURL(/donate\.wikimedia\.org/); // SKIPPED: External site
// });

// test.skip("Article history page loads", async ({ page }) => {
//   await page.goto("https://en.wikipedia.org/wiki/Software_testing");
//   if (await page.getByRole("link", { name: "View history" }).isVisible()) {
//     test.skip();
//   } else {
//     await page.getByRole("link", { name: "View history" }).click();
//   }
//   await expect(page.getByText("Revision history")).toBeVisible(); // SKIPPED: Dynamic content
// });

// function getBrowserInfo(test) {
//   const { userAgent, browserName } = test.info().project.use;
//   const ua = userAgent || "Unknown User Agent";

//   try {
//     const parser = new UAParser(ua);
//     const result = parser.getResult();

//     // 1. Determine browser name
//     let browser = result.browser.name || browserName || "Unknown Browser";

//     // 2. Handle mobile webviews
//     if (result.engine.name === "WebKit" && result.device.type === "mobile") {
//       browser = "Mobile Safari";
//     }

//     // 3. Clean version string
//     const version = result.browser.version
//       ? ` v${result.browser.version.split(".")[0]}`
//       : "";

//     // 4. OS information
//     const osInfo = result.os.name ? ` on ${result.os.name}` : "";
//     const osVersion = result.os.version
//       ? ` ${result.os.version.split(".")[0]}`
//       : "";

//     return `${browser}${version}${osInfo}${osVersion}`.trim();
//   } catch (error) {
//     return browserName || "Unknown Browser";
//   }
// }

// // Usage:
// test("Log browser info", async ({}) => {
//   const browserInfo = getBrowserInfo(test);
//   console.log(browserInfo);
// });

// test("device test", async ({}) => {
//   let browser;
//   const projectConfig = test.info().project.use;
//   const ua = projectConfig.userAgent || "Unknown User Agent";

//   const parser = new UAParser(ua);
//   const result = parser.getResult();
//   //   console.log("Full config: ", result);
//   if (result.browser.name === undefined) {
//     browser = projectConfig.browserName;
//   } else {
//     browser = `${result.browser.name} ${result.os.name} ${result.os.version}`;
//   }
//   console.log(browser);
// });
