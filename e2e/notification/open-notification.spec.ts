import { expect, test } from "@playwright/test";

import { seedDatabase } from "../shared/seed/seed-database";
import { seedUnreadNotification } from "../shared/seed/seed-unread-notification";

test("a member sees the unread badge, opens a notification from the bell, and clears the rest", async ({ page }) => {
  test.setTimeout(90_000);
  await seedDatabase();
  const { ticketShortId } = await seedUnreadNotification();

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

  const bell = page.getByRole("button", { name: "Notifications, 2 unread" });
  await expect(bell).toBeVisible({ timeout: 30_000 });

  await bell.click();
  const assignedRow = page.getByRole("link", {
    name: new RegExp(`Open notification:.*assigned you.*${ticketShortId}`, "i"),
  });
  await expect(assignedRow).toBeVisible({ timeout: 30_000 });
  await assignedRow.click();
  await expect(page).toHaveURL(new RegExp(`/tickets/${ticketShortId}`), { timeout: 15_000 });
  await expect(page.getByRole("button", { name: "Notifications, 1 unread" })).toBeVisible({ timeout: 15_000 });

  await page.goto("/overview");
  await expect(page.getByRole("button", { name: "Notifications, 1 unread" })).toBeVisible({ timeout: 15_000 });

  await page.getByRole("button", { name: "Notifications, 1 unread" }).click();
  await page.getByRole("button", { name: "Mark all as read" }).click();
  await expect(page.getByRole("button", { name: "Notifications", exact: true })).toBeVisible({ timeout: 15_000 });
});
