import { expect, test } from "@playwright/test";

import { seedDatabase } from "../shared/seed/seed-database";

test("a member switches the appearance theme to dark", async ({ page }) => {
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

  await page.goto("/settings?tab=appearance");
  await expect(page).toHaveURL(/tab=appearance/);

  const appearance = page.getByRole("tabpanel", { name: "Appearance" });
  await expect(appearance.getByRole("heading", { name: "Theme" })).toBeVisible();

  const dark = appearance.getByRole("button", { name: "Dark", exact: true });
  if ((await dark.getAttribute("aria-pressed")) === "true") {
    await appearance.getByRole("button", { name: "Light", exact: true }).click();
    await expect(appearance.getByText("Saved")).toBeVisible({ timeout: 15_000 });
  }

  await dark.click();
  await expect(appearance.getByText("Saved")).toBeVisible({ timeout: 15_000 });
});
