import { expect, test } from "@playwright/test";

import { seedDatabase } from "../shared/seed/seed-database";

test("create dialog shows fewer tools for a read-only token", async ({ page }) => {
  await seedDatabase();
  const email = `mcp-read-${Date.now()}@example.com`;

  await page.goto("/sign-up");
  await page.waitForFunction(() => {
    const form = document.querySelector("form");
    if (!form) return false;
    return Object.getOwnPropertyNames(form).some((name) => name.startsWith("__reactProps$"));
  });
  await page.getByRole("textbox", { name: "Full Name" }).fill("MCP Reader");
  await page.getByRole("textbox", { name: "Work Email" }).fill(email);
  await page.getByRole("textbox", { name: "Password" }).fill("password1");
  await page.getByRole("checkbox", { name: "I accept the Terms of Service" }).check();
  await page.getByRole("button", { name: "Create account" }).click();
  await page.getByRole("button", { name: "Skip onboarding" }).click();
  await expect(page).toHaveURL(/\/overview/, { timeout: 30_000 });

  await page.goto("/mcp?tab=tokens");
  await expect(page.getByRole("tab", { name: "Tokens" })).toBeVisible({ timeout: 30_000 });
  await expect(page.getByRole("button", { name: "Create token" })).toBeVisible({ timeout: 30_000 });
  await page.waitForFunction(() => {
    const create = Array.from(document.querySelectorAll("button")).find((button) =>
      button.textContent?.includes("Create token"),
    );
    if (!create) return false;
    return Object.getOwnPropertyNames(create).some((name) => name.startsWith("__reactProps$"));
  });
  await page.getByRole("button", { name: "Create token" }).click();
  const createDialog = page.getByRole("dialog", { name: "Create token" });
  await expect(createDialog).toBeVisible({ timeout: 30_000 });

  const summary = createDialog.getByText(/This token can use \d+ of 14 tools/);
  await expect(summary).toHaveText("This token can use 11 of 14 tools");
  await createDialog.getByRole("button", { name: "Full access" }).click();
  await expect(summary).toHaveText("This token can use 13 of 14 tools");
});
