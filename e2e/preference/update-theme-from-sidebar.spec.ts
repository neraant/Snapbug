import { expect, test } from "@playwright/test";

import { seedDatabase } from "../shared/seed/seed-database";

test("a member switches theme from the sidebar and it persists", async ({ page }) => {
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

  await page.goto("/settings?tab=preferences");
  const preferences = page.getByRole("tabpanel", { name: "Preferences" });
  const light = preferences.getByRole("button", { name: "Light", exact: true });
  if ((await light.getAttribute("aria-pressed")) !== "true") {
    await light.click();
    await expect(preferences.getByText("Saved")).toBeVisible({ timeout: 15_000 });
  }

  await page.getByRole("button", { name: "More options" }).click();
  await page.getByRole("menuitemradio", { name: "Dark" }).click();

  await expect(page.locator("html")).toHaveClass(/dark/, { timeout: 15_000 });

  await page.reload();
  await expect(page.locator("html")).toHaveClass(/dark/, { timeout: 15_000 });

  await page.goto("/settings?tab=preferences");
  await expect(preferences.getByRole("button", { name: "Dark", exact: true })).toHaveAttribute("aria-pressed", "true");
});
