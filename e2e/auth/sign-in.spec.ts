import { expect, test } from "@playwright/test";

test("a visitor can open the sign-in screen", async ({ page }) => {
  await page.goto("/sign-in");
  await expect(page.getByRole("heading", { name: "Welcome back" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Log in" })).toBeVisible();
});
