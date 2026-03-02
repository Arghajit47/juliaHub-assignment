// api-tests.spec.ts
import { test, expect } from "@playwright/test";
import { pulse } from "@arghajit/playwright-pulse-report";
test.describe.configure({ mode: "serial" });

export function runApiTests() {
  test.describe("API Tests with Real Working Endpoints", async () => {
    // 1. GET - Validate status & response structure
    test("GET /posts - Fetch posts", async ({ request }) => {
      pulse.severity("High");
      const response = await request.get(
        "https://jsonplaceholder.typicode.com/posts",
      );
      expect(response.status()).toBe(200);
      const posts = await response.json();
      console.log(posts);
      expect(posts.length).toBeGreaterThan(0);
      expect(posts[0]).toHaveProperty("userId");
      expect(posts[0]).toHaveProperty("title");
    });

    // 2. POST - Create a new resource
    test("POST /posts - Create new post", async ({ request }) => {
      pulse.severity("Low");
      const response = await request.post(
        "https://jsonplaceholder.typicode.com/posts",
        {
          data: {
            title: "Playwright Test",
            body: "This is an API test",
            userId: 1,
          },
        },
      );
      expect(response.status()).toBe(201);
      const createdPost = await response.json();
      console.log(createdPost);
      expect(createdPost.id).toBeDefined();
      expect(createdPost.title).toBe("Playwright Test");
    });

    // 3. PUT - Update existing resource
    test("PUT /posts/1 - Update post", async ({ request }) => {
      pulse.severity("High");
      const response = await request.put(
        "https://jsonplaceholder.typicode.com/posts/1",
        {
          data: {
            id: 1,
            title: "Updated Title",
            body: "Updated content",
            userId: 1,
          },
        },
      );
      expect(response.status()).toBe(200);
      const updatedPost = await response.json();
      console.log(updatedPost);
      expect(updatedPost.title).toBe("Updated Title");
    });

    // 4. DELETE - Remove a resource
    test("DELETE /posts/1 - Delete post", async ({ request }) => {
      pulse.severity("Critical");
      const response = await request.delete(
        "https://jsonplaceholder.typicode.com/posts/1",
      );
      expect(response.status()).toBe(200);
    });

    // 5. Authentication - Test with valid token
    test("POST /api/login - Successful auth", async ({ request }) => {
      const response = await request.post("https://reqres.in/api/login", {
        headers: {
          "x-api-key": "reqres-free-v1",
        },
        data: {
          email: "eve.holt@reqres.in",
          password: "cityslicka",
        },
      });
      console.log(await response.json());
      expect(response.status()).toBe(200);
      expect(await response.json()).toHaveProperty("token");
    });

    // 6. Error Handling - Invalid auth (400)
    test("POST /api/login - Invalid auth", async ({ request }) => {
      const response = await request.post("https://reqres.in/api/login", {
        headers: {
          "x-api-key": "reqres-free-v1",
        },
        data: {
          email: "invalid@email.com",
        },
      });
      expect.soft(response.status()).toBe(400);
      expect.soft(await response.json()).toHaveProperty("error");
    });

    // 7. Response Time Check
    test("GET /posts - Response time < 1000ms", async ({ request }) => {
      const start = Date.now();
      const response = await request.get(
        "https://jsonplaceholder.typicode.com/posts",
      );
      const duration = Date.now() - start;
      expect(response.status()).toBe(200);
      expect(duration).toBeLessThan(1000);
    });

    // 8. Validate Nested JSON Structure
    test("GET /api/users/2 - Validate nested data", async ({ request }) => {
      const response = await request.get("https://reqres.in/api/users/2");
      const user = await response.json();
      await expect(user.data.email).toContain("@reqres.in");
      await expect(user.data.avatar).toMatch(/^https:\/\//);
    });

    // 9. File Upload Simulation (JSONPlaceholder doesn't support uploads - mock test)
    test("POST /upload - Mock file upload", async ({ request }) => {
      // This endpoint doesn't actually exist - just demonstrating the structure
      const response = await request.post(
        "https://jsonplaceholder.typicode.com/upload",
        {
          multipart: {
            file: {
              name: "test.txt",
              mimeType: "text/plain",
              buffer: Buffer.from("Playwright test file content"),
            },
          },
        },
      );
      expect(response.status()).toBe(404); // Expected since endpoint doesn't exist
    });
  });
}
