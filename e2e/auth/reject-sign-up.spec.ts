import { expect, test } from "@playwright/test";

import { waitForReactFormHydration } from "../shared/wait-for-react-form-hydration";

async function openSignUp(page: import("@playwright/test").Page) {
  await page.goto("/sign-up");
  await expect(page.getByRole("heading", { name: "Create your Snapbug account" })).toBeVisible();
  await waitForReactFormHydration(page);
}

test("an invalid email shows one format error and does not create an account", async ({ page }) => {
  await openSignUp(page);
  await page.getByRole("textbox", { name: "Full Name" }).fill("Ada Lovelace");
  await page.getByRole("textbox", { name: "Work Email" }).fill("notanemail");
  await page.getByRole("textbox", { name: "Password" }).fill("password1");
  await page.getByRole("checkbox", { name: "I accept the Terms of Service" }).check();
  await page.getByRole("button", { name: "Create account" }).click();

  await expect(page).toHaveURL(/\/sign-up/);
  await expect(page.getByText("Work Email is required")).toHaveCount(0);
  await expect(page.getByText("Signed up successfully")).toHaveCount(0);

  await expect(page.getByText("Enter a valid email")).toHaveCount(1);
});

test("empty sign-up fields are rejected", async ({ page }) => {
  await openSignUp(page);
  await page.getByRole("button", { name: "Create account" }).click();

  await expect(page).toHaveURL(/\/sign-up/);
  await expect(page.getByText("Full Name is required")).toBeVisible();
  await expect(page.getByText("Work Email is required")).toBeVisible();
  await expect(page.getByText("Password must be at least 8 characters long")).toBeVisible();
  await expect(page.getByText("I accept the Terms of Service is required")).toBeVisible();
});
