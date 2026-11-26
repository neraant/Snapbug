import { expect, test } from "@playwright/test";

import { pageHeading } from "../shared/page-heading";
import { signIn, signOut } from "../shared/sign-in";
import { seedDatabase } from "../shared/seed/seed-database";

test("signing out leaves the overview and sends a protected URL back to sign-in", async ({ page }) => {
  await seedDatabase();
  await signIn(page, "admin@example.com");
  await signOut(page);
  await expect(page.getByRole("heading", { name: "Welcome back" })).toBeVisible();

  await page.goto("/overview");
  await expect(page).toHaveURL(/\/sign-in/);
  await expect(page.getByRole("heading", { name: "Welcome back" })).toBeVisible();
  await expect(pageHeading(page, "Overview")).toHaveCount(0);
});
