// @ts-check
const { test, expect } = require("@playwright/test");

test("has title", async ({ page }) => {
  await page.goto("https://playwright.dev/");

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Arghajit/);
});

test("get started link", { tag: "@test" }, async ({ page }) => {
  await page.goto("https://playwright.dev/");

  // Click the get started link.
  await page.getByRole("link", { name: "Get started" }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(
    page.getByRole("heading", { name: "Installation" })
  ).toBeVisible();
});

test(
  "flaky: should display and close modal",
  { tag: "@expected-fail" },
  async ({ page }) => {
    await page.goto("https://nextbnb-three.vercel.app/");

    await page.locator('img[alt="logo"]').isVisible();

    // Click button to open modal
    await page.click('[data-testid="open-settings"]');

    // Flaky part: modal may animate in but not be fully visible yet
    await expect(page.locator('[data-testid="settings-modal"]')).toBeVisible();

    // Close the modal
    await page.click('[data-testid="close-settings"]');

    // Expect it to be gone — may fail if animation still fading out
    await expect(page.locator('[data-testid="settings-modal"]')).toBeHidden();
  }
);
