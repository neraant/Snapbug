import { expect, test } from "@playwright/test";

import { signIn } from "../shared/sign-in";
import { seedDatabase } from "../shared/seed/seed-database";

test("a member who opens an admin URL does not see admin data", async ({ page }) => {
  await seedDatabase();
  await signIn(page, "alice@example.com");

  await page.goto("/projects", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { name: "404 — page not found" })).toBeVisible();
  await expect(page.getByRole("button", { name: "New project" })).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Projects" })).toHaveCount(0);

  await page.goto("/team", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { name: "404 — page not found" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Invite people" })).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Team" })).toHaveCount(0);

  await page.goto("/activity", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { name: "404 — page not found" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Activity log" })).toHaveCount(0);

  await page.goto("/settings?tab=organization");
  await expect(page.getByText("Only admins can change these settings.")).toBeVisible();
  await expect(page.getByRole("button", { name: "Save" })).toHaveCount(0);
  await expect(page.getByRole("textbox", { name: "Name" })).toHaveCount(0);
  await expect(page.getByText("Acme", { exact: true })).toBeVisible();
});
