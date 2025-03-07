// @ts-check
const { test, expect, chromium } = require("@playwright/test");
const cookies = require("../cookies.json");
const url = `https://example.com`;
const userName = "Arghajit47";
const password = "Hbp@4711";
const testRepo = "playwright-test-repo";
const bugName = "Bug in feature X";

test("authentication in github", { tag: "@new" }, async () => {
  let page, browserContext;
  await test.step("Setting up the browser", async () => {
    const browser = await chromium.launch({ headless: false }); // Launch browser
    browserContext = await browser.newContext(); // Create a new context
    page = await browserContext.newPage();
  });
  await test.step("Navigating to GitHub login page", async () => {
    await page.goto(`${url}/login`);
  });
  await test.step("Logging in", async () => {
    await page.fill("#login_field", userName);
    await page.fill("#password", password);
    await page.click("input[name='commit']");
    await page.waitForLoadState("networkidle");
  });
  await test.step("Verifying login", async () => {
    const url = await page.url();
    if (url.includes("/dashboard")) {
      console.log("Login successful");
    } else {
      console.log(
        "Login with userName and password is failed! Trying with cookies..."
      );
      // Add cookies to the browser context
      await browserContext.addCookies(cookies);
      // Navigate to the GitHub profile page
      await page.goto(`${url}/dashboard`);
      await page.waitForLoadState("networkidle");
    }
  });
  await test.step("Create a new repository", async () => {
    await page.click('//button[text()="Create Repository"]');
    await page.fill('input[name="repositoryName"]', testRepo);
    await page.click('//button[text()="Create"]');
  });
  await test.step("Verify the repository appears on the dashboard", async () => {
    await expect(page.locator(`//h3[text()='${testRepo}']`)).toBeVisible();
  });
  await test.step("Navigate to the repository page", async () => {
    await page.click(`//h3[text()='${testRepo}']`);
    await page.waitForURL(`<URL>/repo/${userName}/${testRepo}`);
  });
  await test.step("Create an issue in the repository", async () => {
    await page.click('//button[text()="Create Issue"]');
    await page.fill('input[name="issueTitle"]', bugName);
    await page.click('//button[text()="Submit"]');
  });
  await test.step("Verify the issue is created", async () => {
    await expect(page.locator(`//h3[text()='${bugName}']`)).toBeVisible();
  });
  await test.step("Logout", async () => {
    await page.click('//button[text()="Log Out"]');
    await page.waitForLoadState("networkidle");
  });

  await test.step("Verify user is redirected to the login page", async () => {
    await expect(page).toHaveURL(`${url}/login`);
  });
});
