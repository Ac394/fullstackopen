const { test, expect, beforeEach, describe } = require("@playwright/test");
const { loginWith, createBlog } = require("./helper");

describe("Blog app", () => {
  beforeEach(async ({ page, request }) => {
    await request.post("http:localhost:3001/api/testing/reset");
    await request.post("http://localhost:3001/api/users", {
      data: {
        name: "Pan Ag",
        username: "panag",
        password: "Abc123987!",
      },
    });
    await request.post("http://localhost:3001/api/users", {
      data: {
        name: "Un Known",
        username: "unknown",
        password: "12347987!A",
      },
    });

    await page.goto("http://localhost:5173");
  });

  test("Login form is shown", async ({ page }) => {
    const username = await page.getByText("username");
    await expect(username).toBeVisible();
    const password = await page.getByText("username");
    await expect(password).toBeVisible();
  });

  describe("Login", () => {
    test("succeeds with correct credentials", async ({ page }) => {
      await loginWith(page, "panag", "Abc123987!");
      await expect(page.getByText("Pan Ag logged-in")).toBeVisible();
    });

    test("fails with wrong credentials", async ({ page }) => {
      await loginWith(page, "panag", "987654321");
      await expect(page.getByText("wrong username or password")).toBeVisible();
    });
  });

  describe("When logged in", () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, "panag", "Abc123987!");
    });

    test("a new blog can be created", async ({ page }) => {
      await createBlog(
        page,
        "a blog created by playwright",
        "Playwright",
        "https://playwright.dev/"
      );

      await expect(
        page.locator(".blog").getByText("a blog created by playwright")
      ).toBeVisible();
    });

    test("a blog can be deleted by it's creator", async ({ page }) => {
      await createBlog(
        page,
        "a blog created by playwright",
        "Playwright",
        "https://playwright.dev/"
      );
      await page.getByRole("button", { name: "view" }).click();
      page.on("dialog", (dialog) => dialog.accept());
      await page.getByRole("button", { name: "remove" }).click();
      await expect(
        page.locator(".blog").getByText("a blog created by playwright")
      ).not.toBeVisible();
    });

    describe("and several blogs are created", () => {
      beforeEach(async ({ page }) => {
        await createBlog(
          page,
          "a blog created by playwright",
          "Playwright",
          "https://playwright.dev/"
        );
        await createBlog(
          page,
          "a second blog created by playwright",
          "Playwright",
          "https://playwright.dev/"
        );
        await createBlog(
          page,
          "a third blog created by playwright",
          "Playwright",
          "https://playwright.dev/"
        );
      });

      test("a blog can be liked", async ({ page }) => {
        await page.getByRole("button", { name: "view" }).last().click();
        await page.getByRole("button", { name: "like" }).last().click();
        await expect(page.locator(".blog").getByText("1")).toBeVisible();
      });

      test("blogs are sorted by likes", async ({ page }) => {
        await page.getByRole("button", { name: "view" }).last().click();
        await page.getByRole("button", { name: "like" }).last().click();
        await page.getByRole("button", { name: "view" }).first().click();
        await expect(page.locator(".blog").getByText("1")).toBeVisible();
      });

      test("remove button is only visible to the user that added the blog", async ({
        page,
      }) => {
        await page.getByRole("button", { name: "logout" }).click();
        await loginWith(page, "unknown", "12347987!A");
        await page.getByRole("button", { name: "view" }).first().click();
        await expect(page.getByText("remove")).not.toBeVisible();
      });
    });
  });
});
