// api-tests.spec.ts
import { test, expect } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";
export function runCometChatTests() {
  // const appId = "";
  const apiRegion = "eu";
  const apiKey = "";
  test.setTimeout(2000000);
  test.describe.configure({ mode: "serial" });

  test.describe.skip("API Tests with Comet chat", () => {
    // 1. GET - Validate status & response structure
    test.skip("List all the users in comet chat", async ({ request }) => {
      let allResults = [];
      let page = 1;
      while (true) {
        const response = await request.get(
          `https://${appId}.api-${apiRegion}.cometchat.io/v3/users?perPage=1000&page=${page}`,
          {
            headers: {
              apikey: apiKey,
              accept: "application/json",
            },
          },
        );
        expect(response.status()).toBe(200);
        const responseBody = await response.json();
        if (!responseBody.data || responseBody.data.length === 0) {
          break;
        }
        allResults = allResults.concat(responseBody.data);
        console.log(allResults);
        page++;
      }

      // Save allResults to a file
      const resultsFilePath = path.join(
        process.cwd(),
        "assets",
        "comet-chat-users.json",
      );
      fs.writeFileSync(resultsFilePath, JSON.stringify(allResults, null, 2));
      console.log(`Results saved to: ${resultsFilePath}`);
    });

    // 4. DELETE - Remove a resource
    test.skip("DELETE all users from comet chat", async ({ request }) => {
      const resultsFilePath = path.join(
        process.cwd(),
        "assets",
        "comet-chat-users.json",
      );
      const allResults = JSON.parse(fs.readFileSync(resultsFilePath, "utf8"));
      for (const user of allResults) {
        const response = await request.delete(
          `https://${appId}.api-${apiRegion}.cometchat.io/v3/users/${user.uid}`,
          {
            headers: {
              apikey: apiKey,
              accept: "application/json",
            },
            data: { permanent: true },
          },
        );
        expect(response.status()).toBe(200);
        console.log(`Deleted user with UID: ${user.uid}`);
      }
      console.log("All users deleted successfully");
    });

    test.skip("List all the users in comet chat & verify that all users are reuploaded", async ({
      request,
    }) => {
      const results = path.join(
        process.cwd(),
        "assets",
        "comet-chat-users.json",
      );
      const oldResponse = JSON.parse(fs.readFileSync(results, "utf8"));
      let allResults = [];
      let page = 1;
      while (true) {
        const response = await request.get(
          `https://${appId}.api-${apiRegion}.cometchat.io/v3/users?perPage=1000&page=${page}`,
          {
            headers: {
              apikey: apiKey,
              accept: "application/json",
            },
          },
        );
        expect(response.status()).toBe(200);
        const responseBody = await response.json();
        if (!responseBody.data || responseBody.data.length === 0) {
          break;
        }
        allResults = allResults.concat(responseBody.data);
        console.log(allResults);
        page++;
      }
      expect(allResults).toEqual(oldResponse);
    });
  });
}
