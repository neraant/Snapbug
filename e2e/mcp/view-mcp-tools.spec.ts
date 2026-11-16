import { expect, test } from "@playwright/test";

import { seedDatabase } from "../shared/seed/seed-database";

test("a member can browse MCP tools and open a tool detail sheet", async ({ page }) => {
  await seedDatabase();
  const email = `mcp-page-${Date.now()}@example.com`;

  await page.goto("/sign-up");
  await page.waitForFunction(() => {
    const form = document.querySelector("form");
    if (!form) return false;
    return Object.getOwnPropertyNames(form).some((name) => name.startsWith("__reactProps$"));
  });
  await page.getByRole("textbox", { name: "Full Name" }).fill("MCP Browser");
  await page.getByRole("textbox", { name: "Work Email" }).fill(email);
  await page.getByRole("textbox", { name: "Password" }).fill("password1");
  await page.getByRole("checkbox", { name: "I accept the Terms of Service" }).check();
  await page.getByRole("button", { name: "Create account" }).click();
  await page.getByRole("button", { name: "Skip onboarding" }).click();
  await expect(page).toHaveURL(/\/overview/, { timeout: 30_000 });

  await page.goto("/mcp");
  await expect(page.getByRole("tab", { name: "Tools" })).toBeVisible({ timeout: 30_000 });
  await expect(page.getByText(/14 tools · 12 read · 2 write/)).toBeVisible({ timeout: 30_000 });

  await page.getByRole("button", { name: /list_tickets/ }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByText("Example prompt")).toBeVisible();
});
