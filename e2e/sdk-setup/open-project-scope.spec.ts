import { expect, test } from "@playwright/test";

import { signIn } from "../shared/sign-in";
import { seedDatabase } from "../shared/seed/seed-database";

const storeProjectId = "4a8c69a1-1ab1-45a8-8497-eae1e506d9d1";
const selectProjectHint = "Select a project in the sidebar to view install steps and the API key for that project.";

test("SDK setup follows the project slug, the project id, and all projects", async ({ page }) => {
  await seedDatabase();
  await signIn(page, "admin@example.com");

  await page.goto("/sdk?projectId=acme-store");
  await expect(page.getByRole("heading", { name: "Set up the SDK" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "1. Install the package" })).toBeVisible({ timeout: 30_000 });
  await expect(page.getByRole("heading", { name: "Project API Key" })).toBeVisible();
  await expect(page.getByText(selectProjectHint)).toHaveCount(0);

  await page.goto(`/sdk?projectId=${storeProjectId}`);
  await expect(page.getByRole("heading", { name: "1. Install the package" })).toBeVisible({ timeout: 30_000 });
  await expect(page.getByRole("heading", { name: "Project API Key" })).toBeVisible();

  await page.goto("/sdk?projectId=all");
  await expect(page.getByText(selectProjectHint)).toBeVisible();
  await expect(page.getByRole("heading", { name: "1. Install the package" })).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Project API Key" })).toHaveCount(0);
});
