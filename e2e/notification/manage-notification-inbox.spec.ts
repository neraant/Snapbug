import { expect, test } from "@playwright/test";

import { seedDatabase } from "../shared/seed/seed-database";
import { seedUnreadNotification } from "../shared/seed/seed-unread-notification";

test("inbox row menu, archive, selection mode, and bulk mark read", async ({ page }) => {
  test.setTimeout(90_000);
  await seedDatabase();
  await seedUnreadNotification();

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

  await page.goto("/notifications");
  await expect(page.getByRole("button", { name: "Select" })).toBeVisible({ timeout: 15_000 });
  await expect(page.getByRole("checkbox")).toHaveCount(0);

  await page.getByRole("button", { name: "All", exact: true }).click();

  const firstRow = page.getByRole("link", { name: /Open notification:/i }).first();
  await expect(firstRow).toBeVisible({ timeout: 15_000 });

  await page.getByRole("button", { name: "Notification actions" }).first().click();
  await page.getByRole("menuitem", { name: "Mark as read" }).click();
  await page.getByRole("button", { name: "Notification actions" }).first().click();
  await page.getByRole("menuitem", { name: "Mark as unread" }).click();

  await page.getByRole("button", { name: "Notification actions" }).first().click();
  await page.getByRole("menuitem", { name: "Archive" }).click();

  await page.getByRole("button", { name: "Select" }).click();
  await expect(page.getByRole("checkbox").first()).toBeVisible({ timeout: 10_000 });

  const selectableRow = page.getByRole("option").first();
  await expect(selectableRow).toBeVisible();
  await selectableRow.click();

  await expect(page.getByText(/\d+ selected/)).toBeVisible();
  await page.getByRole("button", { name: "Mark read", exact: true }).click();
  await expect(page.getByRole("checkbox")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Select" })).toBeVisible();
});
