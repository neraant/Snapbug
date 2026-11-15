import { expect, test } from "@playwright/test";

import { seedDatabase } from "../shared/seed/seed-database";

test("a member can search for an accessible ticket from the header", async ({ page }) => {
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

  await page.getByRole("button", { name: "Open global search" }).click();
  await expect(page.getByRole("dialog", { name: "Search" })).toBeVisible();
  await page
    .getByRole("dialog", { name: "Search" })
    .getByRole("searchbox", { name: "Search tickets, URLs, stack traces..." })
    .fill("Pay button");

  await expect(page.getByRole("link", { name: "Pay button throws when the cart is empty" })).toBeVisible();
});