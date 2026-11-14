import { expect, test } from "@playwright/test";

import { seedDatabase } from "../shared/seed/seed-database";

test("an administrator saves the organization name and retention period", async ({ page }) => {
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
  await expect(page.getByRole("heading", { name: "Organization settings" })).toBeVisible();
  await expect(page.getByText("Days to keep reports for this organization.")).toBeVisible();
  await page.waitForFunction(() => {
    const form = document.querySelector("form");
    if (!form) return false;
    return Object.getOwnPropertyNames(form).some((name) => name.startsWith("__reactProps$"));
  });

  await page.getByRole("textbox", { name: "Name" }).fill("Acme Studio");
  await page.getByRole("textbox", { name: "Retention period" }).fill("45");
  await page.getByRole("button", { name: "Save", exact: true }).click();

  await expect(page.getByText("Organization settings saved")).toBeVisible({ timeout: 30_000 });
  await expect(page.getByRole("textbox", { name: "Name" })).toHaveValue("Acme Studio");
  await expect(page.getByRole("textbox", { name: "Retention period" })).toHaveValue("45");
});
