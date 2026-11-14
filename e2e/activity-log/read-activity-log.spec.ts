import { expect, test } from "@playwright/test";

import { seedDatabase } from "../shared/seed/seed-database";

test("an administrator reads the activity log after changing the organization", async ({ page }) => {
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

  await page.goto("/settings");
  await page.waitForFunction(() => {
    const form = document.querySelector("form");
    if (!form) return false;
    return Object.getOwnPropertyNames(form).some((name) => name.startsWith("__reactProps$"));
  });
  await page.getByRole("textbox", { name: "Name" }).fill("Acme Studio");
  await page.getByRole("button", { name: "Save" }).click();
  await expect(page.getByText("Organization settings saved")).toBeVisible({ timeout: 30_000 });

  await page.getByRole("link", { name: "Activity" }).click();
  await expect(page.getByRole("heading", { name: "Activity log" })).toBeVisible();
  await expect(page.getByRole("columnheader", { name: "Who" })).toBeVisible();

  const change = page.getByRole("row").filter({ hasText: "name: Acme → Acme Studio" }).first();
  await expect(change.getByRole("cell", { name: "admin@example.com", exact: true })).toBeVisible();
  await expect(change.getByText("Organization", { exact: true })).toBeVisible();
  await expect(change.getByText("2a8c69a1-1ab1-45a8-8497-eae1e506d9d1", { exact: true })).toBeVisible();
  await expect(change.getByText("Update organization", { exact: true })).toBeVisible();
});
