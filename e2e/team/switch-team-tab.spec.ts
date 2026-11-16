import { expect, test } from "@playwright/test";

import { seedDatabase } from "../shared/seed/seed-database";

test("an administrator switches between team tabs", async ({ page }) => {
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

  await page.goto("/team");
  await expect(page.getByRole("tab", { name: /Members/ })).toBeVisible();
  await expect(page.getByRole("tab", { name: /Invitations/ })).toBeVisible();
  await expect(page.getByRole("button", { name: "Invite people" })).toBeVisible();
  await expect(page.getByRole("columnheader", { name: "Member" })).toBeVisible();

  await page.getByRole("tab", { name: /Invitations/ }).click();
  await expect(page).toHaveURL(/tab=invitations/);
  await expect(page.getByText("No pending invitations")).toBeVisible();

  await page.getByRole("tab", { name: /Members/ }).click();
  await expect(page).toHaveURL(/tab=members/);
  await expect(page.getByRole("columnheader", { name: "Member" })).toBeVisible();
});
