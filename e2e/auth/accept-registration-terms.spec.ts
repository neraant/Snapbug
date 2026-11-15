import { expect, test } from "@playwright/test";

test("a visitor accepts the terms and creates an account", async ({ page }) => {
  const email = `terms-${Date.now()}@example.com`;

  await page.goto("/sign-up");
  await expect(page.getByRole("heading", { name: "Create your Snapbug account" })).toBeVisible();
  await expect(page.getByRole("checkbox", { name: "I accept the Terms of Service" })).toBeVisible();

  await page.getByRole("textbox", { name: "Full Name" }).fill("Terms Guest");
  await page.getByRole("textbox", { name: "Work Email" }).fill(email);
  await page.getByRole("textbox", { name: "Password" }).fill("password1");
  await page.getByRole("checkbox", { name: "I accept the Terms of Service" }).check();
  await page.getByRole("button", { name: "Create account" }).click();

  await expect(page.getByRole("button", { name: "Skip onboarding" })).toBeVisible({ timeout: 20_000 });
});