import { expect, test } from "@playwright/test";

import { seedDatabase } from "../shared/seed/seed-database";

test("an administrator opens a project's tickets from the project card", async ({ page }) => {
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

  await page.getByRole("link", { name: "Open tickets for Acme Store" }).click();
  await expect(page).toHaveURL(/\/tickets\?.*projectId=/, { timeout: 30_000 });
  await expect(page.getByRole("heading", { name: "Tickets" })).toBeVisible();
});