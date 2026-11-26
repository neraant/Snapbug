import { expect, test } from "@playwright/test";

import { pageHeading } from "../shared/page-heading";
import { signIn } from "../shared/sign-in";
import { seedDatabase } from "../shared/seed/seed-database";
import { waitForReactFormHydration } from "../shared/wait-for-react-form-hydration";

test("a visitor can open the sign-in screen", async ({ page }) => {
  await page.goto("/sign-in");
  await expect(page.getByRole("heading", { name: "Welcome back" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Log in" })).toBeVisible();
});

test("a member can sign in and land on overview", async ({ page }) => {
  await seedDatabase();
  await signIn(page, "alice@example.com");
  await expect(pageHeading(page, "Overview")).toBeVisible();
});

test("a wrong password stays on sign-in and does not create a session", async ({ page }) => {
  await seedDatabase();
  await page.goto("/sign-in");
  await waitForReactFormHydration(page);
  await page.getByRole("textbox", { name: "Work Email" }).fill("alice@example.com");
  await page.getByRole("textbox", { name: "Password" }).fill("not-the-password");
  await page.getByRole("button", { name: "Log in" }).click();

  await expect(page.getByText("Invalid email or password")).toBeVisible();
  await expect(page).toHaveURL(/\/sign-in/);
  await expect(page.getByRole("heading", { name: "Welcome back" })).toBeVisible();

  const cookies = await page.context().cookies();
  expect(cookies.some((cookie) => cookie.name.includes("session-token"))).toBe(false);

  await page.goto("/overview");
  await expect(page).toHaveURL(/\/sign-in/);
  await expect(page.getByRole("heading", { name: "Welcome back" })).toBeVisible();
});
