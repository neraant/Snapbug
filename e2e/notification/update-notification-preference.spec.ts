import { expect, test } from "@playwright/test";

import { seedDatabase } from "../shared/seed/seed-database";

test("an admin updates notification preferences", async ({ page }) => {
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

  await page.goto("/settings?tab=notifications");
  await expect(page).toHaveURL(/tab=notifications/);

  const panel = page.getByRole("tabpanel", { name: "Notifications" });
  await expect(panel.getByText("Assigned to me")).toBeVisible();
  await expect(panel.getByRole("heading", { name: "Notification types" })).toBeVisible();

  const emailSwitch = panel.getByRole("switch", { name: "Email: New tickets in my projects" });
  await emailSwitch.click();
  await expect(panel.getByText("Saved")).toBeVisible({ timeout: 15_000 });
});