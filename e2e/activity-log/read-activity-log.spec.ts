import { expect, test } from "@playwright/test";

import { seedDatabase } from "../shared/seed/seed-database";

test("an administrator reads the activity log after changing the organization", async ({ page }) => {
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

  await page.goto("/settings");
  await page.waitForFunction(() => {
    const form = document.querySelector("form");
    if (!form) return false;
    return Object.getOwnPropertyNames(form).some((name) => name.startsWith("__reactProps$"));
  });
  await page.getByRole("textbox", { name: "Name" }).fill("Acme Studio");
  await page.getByRole("button", { name: "Save", exact: true }).click();
  await expect(page.getByText("Organization settings saved")).toBeVisible({ timeout: 30_000 });

  await page.getByRole("link", { name: "Activity" }).click();
  await expect(page.getByRole("heading", { name: "Activity log" })).toBeVisible();
  await expect(page.getByRole("columnheader", { name: "Event" })).toBeVisible();

  const change = page.getByRole("button", { name: /Update organization/i }).first();
  await expect(change).toBeVisible();
  await expect(change).toContainText("Acme Studio");
  await expect(change).toContainText("Organization");

  await change.click();
  const detail = page.getByRole("dialog", { name: /Update organization Acme Studio/i });
  await expect(detail.getByRole("heading", { name: /Update organization Acme Studio/i })).toBeVisible();
  await expect(detail.getByRole("cell", { name: "name", exact: true })).toBeVisible();
  await expect(detail.getByRole("cell", { name: "Acme", exact: true })).toBeVisible();
  await expect(detail.getByRole("cell", { name: "Acme Studio", exact: true })).toBeVisible();
  await expect(detail.getByRole("link", { name: "Acme Studio" })).toHaveAttribute("href", "/settings");
});
