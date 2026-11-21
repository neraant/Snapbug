import { expect, test } from "@playwright/test";

import { seedDatabase } from "../shared/seed/seed-database";

test("a member switches the interface language to Russian", async ({ page }) => {
  test.setTimeout(90_000);
  await seedDatabase();

  await page.goto("/sign-in");
  await page.waitForFunction(() => {
    const form = document.querySelector("form");
    if (!form) return false;
    return Object.getOwnPropertyNames(form).some((name) => name.startsWith("__reactProps$"));
  });
  await page.getByRole("textbox", { name: "Work Email" }).fill("alice@example.com");
  await page.getByRole("textbox", { name: "Password" }).fill("password");
  await page.getByRole("button", { name: "Log in" }).click();
  await expect(page).toHaveURL(/\/overview/, { timeout: 30_000 });

  await page.getByRole("link", { name: "Settings" }).click();
  await expect(page).toHaveURL(/\/settings/);

  await page.goto("/settings?tab=preferences");
  await expect(page.getByRole("tab", { name: "Preferences" })).toBeVisible();
  await page.waitForFunction(() => {
    const control = document.querySelector("[aria-label='Interface language']");
    if (!control) return false;
    return Object.getOwnPropertyNames(control).some((name) => name.startsWith("__reactProps$"));
  });
  await expect(page.getByRole("heading", { name: "Interface language" })).toBeVisible();

  await page.getByRole("button", { name: "Русский" }).click();

  await expect(page.getByRole("heading", { name: "Язык интерфейса" })).toBeVisible({ timeout: 30_000 });
  await expect(page.getByRole("button", { name: "Русский" })).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("link", { name: "Настройки" })).toBeVisible();

  await page.reload();
  await expect(page.getByRole("link", { name: "Настройки" })).toBeVisible({ timeout: 30_000 });
});