// tests/wikipedia.spec.js
import { test, expect } from "@playwright/test";
import { pulse } from "@arghajit/playwright-pulse-report";
test.describe.only("Sanity Tests", async () => {
  test("Wikipedia homepage loads", async ({ page }) => {
    pulse.severity("High");
    await page.goto("https://www.wikipedia.org");
    await expect(page).toHaveTitle("Wikipedia");
    await expect(page.getByText("The Free Encyclopedia")).toBeVisible();
  });
});
test.describe.only("Home page related Tests", async () => {
  test(
    "English language switch works",
    { tag: ["@new", "@new-tag", "@language"] },
    async ({ page }) => {
      pulse.severity("Low");
      await page.goto("https://www.wikipedia.org");
      await page.getByText("English").click();
      await expect(page).toHaveURL(/en\.wikipedia\.org/);
    }
  );

  test(
    "Today on Wikipedia shows exactly 5 featured items",
    {
      annotation: [
        { type: "issue", description: "Flaky test - Featured content changes" },
        {
          type: "intentional",
          description: "This test lies inside the fixme category",
        },
      ],
    },
    { tag: ["@new", "@wikipedia"] },
    async ({ page }) => {
      pulse.severity("Medium");
      await page.goto("https://en.wikipedia.org/wiki/Main_Page");
      const items = await page.locator("#mp-tfa").getByRole("listitem").count();
      expect(items).toBe(5); // FLAKY: Featured content changes
    }
  );
});
