import { expect, test } from "@playwright/test";

import { seedDatabase } from "../shared/seed/seed-database";

test("an administrator archives a project from the projects page", async ({ page }) => {
  test.setTimeout(90_000);
  await seedDatabase();

  await page.goto("/sign-in");
  await page.waitForFunction(() => {
    const form = document.querySelector("form");
    if (!form) return false;
    return Object.getOwnPropertyNames(form).some((name) => name.startsWith("__reactProps$"));
  });
  await page.getByRole("textbox", { name: "Work Email" }).fill("admin@example.com");
  await page.getByRole("textbox", { name: "Password" }).fill("password");
  await page.getByRole("button", { name: "Log in" }).click();
  await expect(page).toHaveURL(/\/overview/, { timeout: 30_000 });

  await page.goto("/projects");
  await expect(page.getByRole("button", { name: "New project" })).toBeVisible();

  const marketingCard = page.getByRole("link", { name: "Open tickets for Acme Marketing" });
  const marketingActions = marketingCard.getByRole("button", { name: "Project actions" });

  await expect(async () => {
    await marketingActions.click();
    await expect(page.getByRole("menuitem", { name: "Archive" })).toBeVisible({ timeout: 3_000 });
  }).toPass({ timeout: 15_000 });

  await page.getByRole("menuitem", { name: "Archive" }).click();
  await expect(page.getByRole("heading", { name: 'Archive "Acme Marketing"?' })).toBeVisible();
  await page.getByRole("button", { name: "Archive", exact: true }).click();

  await expect(page.getByText("Project archived.")).toBeVisible({ timeout: 30_000 });

  await page.getByRole("button", { name: "Archived" }).click();
  await expect(marketingCard).toBeVisible();
  await expect(marketingCard.getByText("Archived")).toBeVisible();
});
