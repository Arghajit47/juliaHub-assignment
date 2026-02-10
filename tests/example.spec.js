const { test, expect } = require("@playwright/test");
import * as fs from "fs";
import { pulse } from "@arghajit/dummy";

const os = require("os");
// const cookies = require("../cookies.json");
const url = `https://www.apple.com/in/`;

test(
  "authentication in github",
  { tag: ["@new", "@toka"] },
  async ({ page }) => {
    await test.step("Navigating to GitHub login page", async () => {
      await page.goto(`${url}`);
      const screenshotPath = `./assets/image.svg`;
      test.info().attachments.push({
        name: "Screenshot",
        path: screenshotPath,
        contentType: "image/png",
      });
    });
    await test.step("Filling in the login form", async () => {
      console.log("Hello test cases!");
      expect(await page.locator("h1")).toBeVisible();
      console.log();
    });
  },
);

test(
  "Github WEB API Access",
  { tag: ["@new", "@new-tag-mech"] },
  async ({ request }) => {
    let response;
    await test.step("Navigating to GitHub login page", async () => {
      response = await request.get(`${url}`);
      console.log(
        `Response status: ${response.status()} - ${response.statusText()}`
      );
      const screenshotPath = `./assets/image.svg`;
      test.info().attachments.push({
        name: "Screenshot",
        path: screenshotPath,
        contentType: "image/png",
      });
    });
    await test.step("Filling in the login form", async () => {
      console.log(`Response : ${response.body()}`);
      // expect(await response.status()).toBe(201);
    });
  }
);

test("internal details", { tag: ["@Os", "@details"] }, async () => {
  await test.step("Worker Details", async () => {
    console.log(`Worker ID: ${test.info().workerIndex}`); // Worker number (0, 1, 2...)
    console.log(`Parallelism: ${test.info().config.workers}`);
    console.log(`Config File Name: ${test.info().config.configFile}`);
    const data = test.info().config.metadata;
    console.log(`Project Meta Data: ${JSON.stringify(data)}`);
  });
  await test.step("Import OS Details", async () => {
    console.log(`OS Details: ${JSON.stringify(getEnvDetails())}`);
  });
});

async function testData(test) {
  return {
    workerId: await test.info().workerIndex,
    totalWorkers: await test.info().config.workers,
    configFile: await test.info().config.configFile,
    metadata: JSON.stringify(await test.info().config.metadata),
  };
}

function getEnvDetails() {
  return {
    host: os.hostname(),
    os: `${os.platform()} ${os.release()}`,
    cpu: {
      model: os.cpus()[0].model,
      cores: os.cpus().length,
    },
    memory: `${(os.totalmem() / 1024 ** 3).toFixed(2)}GB`, // Total RAM in GB
    node: process.version,
    v8: process.versions.v8,
    cwd: process.cwd(),
  };
}
test.describe("Demonstrate the Pulse Static Report's feature", async () => {
  test(
    "should handle multiple attachments at different times",
    {
      annotation: [
        { type: "issue", description: "Flaky test - Featured content changes" },
        {
          type: "intentional",
          description: "This test lies inside the fixme category",
        },
      ],
    },
    async ({ page }) => {
      pulse.severity("Critical");
      // 1. Attach a JSON file at the beginning
      const initialData = { user: "testuser", step: "initial" };
      fs.writeFileSync("assets/initial-data.json", JSON.stringify(initialData));
      await test.info().attach("initial-data.json", {
        path: "assets/initial-data.json",
        contentType: "application/json",
      });

      await page.goto("https://playwright.dev/");
      await test.info().attach("initial-logo.png", {
        path: "assets/pulse.png",
        contentType: "image/png",
      });

      // 2. Attach a video after the first navigation
      await test.info().attach("navigation-video webm", {
        path: "assets/navigation.webm",
        contentType: "video/webm",
      });
      await test.info().attach("navigation-video avi", {
        path: "assets/navigation.avi",
        contentType: "video/avi",
      });
      await test.info().attach("navigation-video mov", {
        path: "assets/navigation.mov",
        contentType: "video/mov",
      });
      await test.info().attach("navigation-video mp4", {
        path: "assets/navigation.mp4",
        contentType: "video/mp4",
      });
      await test.info().attach("navigation-video ogg", {
        path: "assets/navigation.ogg",
        contentType: "video/ogg",
      });
      await test.info().attach("navigation-video wmv", {
        path: "assets/navigation.wmv",
        contentType: "video/wmv",
      });

      await page.getByLabel("Search").click();
      await page.getByPlaceholder("Search docs").fill("reporter");

      // 3. Attach a text log file after an action
      fs.writeFileSync(
        "assets/search-log.txt",
        'User searched for "reporter".',
      );
      await test.info().attach("search-log.txt", {
        path: "assets/search-log.txt",
        contentType: "text/plain",
      });

      // 4. Attach a PDF document
      // (Assuming 'test-plan.pdf' is a file in your project)
      await test.info().attach("test-plan.pdf", {
        path: "assets/test-plan.pdf",
        contentType: "application/pdf",
      });

      await expect(page.locator(".DocSearch-Hit-title").first()).toBeVisible();
      fs.writeFileSync("assets/final-log.txt", "Test completed successfully.");
      await test.info().attach("final-log.txt", {
        path: "assets/final-log.txt",
        contentType: "text/plain",
      });
      fs.writeFileSync(
        "assets/test-results.csv",
        `Test ID,Status,Duration(ms)
      TC001,Passed,125
      TC002,Failed,230
      TC003,Passed,98
      TC004,Passed,156`,
      );
      await test.info().attach("test-results.csv", {
        path: "assets/test-results.csv",
        contentType: "text/csv",
      });
      await test.info().attach("report.html", {
        path: "assets/index.html",
        contentType: "text/html",
      });
      await test.info().attach("result.xml", {
        path: "assets/result.xml",
        contentType: "xml",
      });
      console.log(await testData(test));
    },
  );
  test.only("fails 3 times with different reasons before passing", async ({
    page,
  }, testInfo) => {
    // testInfo.retry starts at 0 for the first run
    const attempt = testInfo.retry;

    console.log(`\n--- Execution Attempt: ${attempt + 1} ---\n`);

    if (attempt === 0) {
      await page.goto("https://www.apple.com/in/");
      await page.goto("https://arghajit47.github.io/playwright-pulse/");
      // Failure Reason 1: Standard Assertion Error
      console.log("Simulating Failure 1: Assertion Mismatch");
      expect(await page.title(), "Run 1 Failure: Title mismatch").toBe(
        "Incorrect Title",
      );
    } else if (attempt === 1) {
      await page.goto("https://arghajit47.github.io/playwright-pulse/");
      await page.goto("https://google.com/");
      // Failure Reason 2: Element Timeout (simulating slow UI)
      console.log("Simulating Failure 2: Element Timeout");
      // Force a strict timeout for this step to fail quickly
      await page.waitForSelector("#non-existent-element", { timeout: 2000 });
    } else if (attempt === 2) {
      await page.goto("https://google.com/");
      await page.goto("https://www.apple.com/in/");
      // Failure Reason 3: Unhandled Exception (simulating code crash)
      console.log("Simulating Failure 3: System Error");
      throw new Error("Run 3 Failure: Critical API connection refused");
    } else if (attempt === 3) {
      // Attempt 3 (The 4th run) will pass
      console.log("Attempt 4: Success!");
      expect(true).toBe(true);
    }
  });
});

