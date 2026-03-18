import { test, expect } from "@playwright/test";
import { pulse } from "@arghajit/dummy";
import UAParser from "ua-parser-js";

export function runNewTestTests() {
  test.describe("Sanity Tests", async () => {
    test("Wikipedia homepage loads", { tag: "@hello" }, async ({ page }) => {
      pulse.severity("High");
      await page.goto("https://www.wikipedia.org");
      await expect(page).toHaveTitle("Wikipedia");
      await expect(page.getByText("The Free Encyclopedia")).toBeVisible();
      const parser = new UAParser(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Safari/537.36",
      );
      const result = parser.getResult();
      console.log(result);
    });
  });
  test.describe("Home page related Tests", async () => {
    test(
      "English language switch works",
      { tag: ["@new", "@new-tag", "@language", "@hello"] },
      async ({ page }) => {
        pulse.severity("Low");
        await page.goto("https://www.wikipedia.org");
        await page.getByText("English").click();
        await expect(page).toHaveURL(/en\.wikipedia\.org/);
      },
    );

    test(
      "Today on Wikipedia shows exactly 5 featured items",
      {
        annotation: [
          {
            type: "issue",
            description: "Flaky test - Featured content changes",
          },
          {
            type: "intentional",
            description: "This test lies inside the fixme category",
          },
        ],
      },
      { tag: ["@new", "@wikipedia", "@hello"] },
      async ({ page }) => {
        pulse.severity("Medium");
        await page.goto("https://en.wikipedia.org/wiki/Main_Page");
        const items = await page
          .locator("#mp-tfa")
          .getByRole("listitem")
          .count();
        expect(items).toBe(5); // FLAKY: Featured content changes
      },
    );
  });
}
