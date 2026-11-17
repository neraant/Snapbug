import { expect, test } from "@playwright/test";

import { seedDatabase } from "../shared/seed/seed-database";
import { seedUnreadNotification } from "../shared/seed/seed-unread-notification";

test("a member can open a notification from the bell and mark all as read", async ({ page }) => {
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

  await expect(page.getByRole("button", { name: "Notifications" })).toBeVisible();
  await page.getByRole("button", { name: "Notifications" }).click();
  await expect(page.getByText(`Alice assigned you ${ticketShortId}`)).toBeVisible();

  await page.getByRole("link", { name: new RegExp(`Open notification:.*${ticketShortId}`) }).click();
  await expect(page).toHaveURL(new RegExp(`/tickets/${ticketShortId}`), { timeout: 15_000 });

  await page.getByRole("button", { name: "Notifications" }).click();
  await page.getByRole("button", { name: "Mark all as read" }).click();
  await expect(page.getByRole("button", { name: "Notifications" })).toBeVisible();
});