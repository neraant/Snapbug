import { expect, test } from "@playwright/test";

import { seedDatabase } from "../shared/seed/seed-database";

test("an administrator switches the interface language to Russian", async ({ page }) => {
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
  await expect(page.getByRole("radio", { name: "English" })).toBeVisible();
  await expect(page.getByRole("radio", { name: "Русский" })).toBeVisible();
  await page.waitForFunction(() => {
    const form = document.querySelector("form");
    if (!form) return false;
    return Object.getOwnPropertyNames(form).some((name) => name.startsWith("__reactProps$"));
  });

  await page.getByRole("radio", { name: "Русский" }).check();
  await page.getByRole("button", { name: "Save language" }).click();

  await expect(page.getByRole("heading", { name: "Настройки организации" })).toBeVisible({ timeout: 30_000 });
  await expect(page.getByRole("radio", { name: "Русский" })).toBeChecked();
  await expect(page.getByRole("link", { name: "Настройки" })).toBeVisible();
});
