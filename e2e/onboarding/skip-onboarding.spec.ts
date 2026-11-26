import { expect, test } from "@playwright/test";

import { pageHeading } from "../shared/page-heading";
import { signIn } from "../shared/sign-in";
import { seedDatabase } from "../shared/seed/seed-database";
import { waitForReactFormHydration } from "../shared/wait-for-react-form-hydration";

test("skipping onboarding still lands in a usable organization", async ({ page }) => {
  const email = `skip-${Date.now()}@example.com`;
  await page.goto("/sign-up");
  await waitForReactFormHydration(page);
  await page.getByRole("textbox", { name: "Full Name" }).fill("Skip User");
  await page.getByRole("textbox", { name: "Work Email" }).fill(email);
  await page.getByRole("textbox", { name: "Password" }).fill("password1");
  await page.getByRole("checkbox", { name: "I accept the Terms of Service" }).check();
  await page.getByRole("button", { name: "Create account" }).click();

  await expect(page.getByRole("heading", { name: "Name your organization" })).toBeVisible({ timeout: 30_000 });
  await page.getByRole("button", { name: "Skip onboarding" }).click();
  await expect(page).toHaveURL(/\/overview/, { timeout: 30_000 });
  await expect(pageHeading(page, "Overview")).toBeVisible();
  await page.getByRole("button", { name: "Project" }).click();
  await expect(page.getByRole("menuitemradio", { name: /Default project/ })).toBeVisible({ timeout: 30_000 });

  await page.goto("/tickets");
  await expect(pageHeading(page, "Tickets")).toBeVisible();
  await expect(page.getByText("No bug reports yet")).toBeVisible();
});

test("an onboarded user who opens onboarding is sent to overview", async ({ page }) => {
  await seedDatabase();
  await signIn(page, "admin@example.com");
  await page.goto("/onboarding");
  await expect(page).toHaveURL(/\/overview/, { timeout: 30_000 });
  await expect(pageHeading(page, "Overview")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Name your organization" })).toHaveCount(0);
});
