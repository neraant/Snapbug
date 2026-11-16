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
  await expect(page.getByRole("tablist", { name: "Settings sections" })).toBeVisible();
  await page.getByRole("tab", { name: "Organization" }).click();
  await expect(page).toHaveURL(/tab=organization/);
  await page.waitForFunction(() => {
    const form = document.querySelector("form");
    if (!form) return false;
    return Object.getOwnPropertyNames(form).some((name) => name.startsWith("__reactProps$"));
  });

  await page.getByRole("textbox", { name: "Name" }).fill("Acme Studio");
  await page.getByRole("combobox", { name: "Retention period" }).click();
  await page.getByRole("option", { name: "45 days" }).click();
  await page.getByRole("button", { name: "Save", exact: true }).click();

  await expect(page.getByText("Saved")).toBeVisible({ timeout: 30_000 });
  await expect(page.getByRole("textbox", { name: "Name" })).toHaveValue("Acme Studio");
  await expect(page.getByRole("combobox", { name: "Retention period" })).toContainText("45 days");
});
