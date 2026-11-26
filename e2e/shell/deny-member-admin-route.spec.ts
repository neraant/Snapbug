import { expect, test } from "@playwright/test";

import { pageHeading } from "../shared/page-heading";
import { signIn } from "../shared/sign-in";
import { seedDatabase } from "../shared/seed/seed-database";

test("a member who opens an admin URL does not see admin data", async ({ page }) => {
  await seedDatabase();
  await signIn(page, "alice@example.com");

  for (const path of ["/projects", "/team", "/activity"]) {
    await page.goto(path, { waitUntil: "commit" });
    await expect(page).toHaveURL(/\/overview/, { timeout: 30_000 });
    await expect(pageHeading(page, "Overview")).toBeVisible();
    await expect(page.getByRole("button", { name: "New project" })).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Invite people" })).toHaveCount(0);
    await expect(page.getByRole("heading", { name: "Activity log" })).toHaveCount(0);
  }

  await page.goto("/settings?tab=organization");
  await expect(page.getByText("Only admins can change these settings.")).toBeVisible();
  await expect(page.getByRole("button", { name: "Save" })).toHaveCount(0);
  await expect(page.getByRole("textbox", { name: "Name" })).toHaveCount(0);
  await expect(page.getByText("Acme", { exact: true })).toBeVisible();
});
