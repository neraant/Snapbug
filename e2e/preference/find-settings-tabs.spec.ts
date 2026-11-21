import { expect, test } from "@playwright/test";

import { seedDatabase } from "../shared/seed/seed-database";

test("settings shows profile, preferences, notifications, and organization tabs", async ({ page }) => {
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

  await page.goto("/settings");
  await expect(page.getByRole("tab", { name: "Profile" })).toBeVisible();
  await expect(page.getByRole("tab", { name: "Preferences" })).toBeVisible();
  await expect(page.getByRole("tab", { name: "Notifications" })).toBeVisible();
  await expect(page.getByRole("tab", { name: "Organization" })).toBeVisible();
  await expect(page.getByRole("tab", { name: "Access tokens" })).toHaveCount(0);
  await expect(page.getByRole("tab", { name: "Appearance" })).toHaveCount(0);

  await page.goto("/settings?tab=tokens");
  await expect(page.getByRole("tab", { name: "Profile" })).toHaveAttribute("data-state", "active");

  await page.goto("/settings?tab=appearance");
  await expect(page.getByRole("tab", { name: "Profile" })).toHaveAttribute("data-state", "active");
});