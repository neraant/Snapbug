import { expect, test } from "@playwright/test";

import { seedDatabase } from "../shared/seed/seed-database";

test("create dialog shows fewer tools for a read-only token", async ({ page }) => {
  await seedDatabase();
  const email = `mcp-read-${Date.now()}@example.com`;
  const tokenName = "Read-only E2E token";

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

  const summary = createDialog.getByText(/This token can use \d+ of \d+ tools/);
  await expect(summary).toHaveText("This token can use 12 of 14 tools");
  await expect(createDialog.getByText("update_ticket")).not.toBeVisible();
  await expect(createDialog.getByText("add_comment")).not.toBeVisible();

  await createDialog.getByRole("textbox", { name: "Name" }).fill(tokenName);
  await createDialog.getByRole("button", { name: "Create", exact: true }).click();

  const secretDialog = page.getByRole("dialog", { name: "Token created" });
  await expect(secretDialog).toBeVisible({ timeout: 30_000 });
  await secretDialog.getByRole("button", { name: "I've copied it" }).click();
  await expect(page.getByRole("dialog", { name: "Create token" })).toBeHidden({ timeout: 30_000 });

  const tokensPanel = page.getByRole("tabpanel", { name: "Tokens" });
  const tokenRow = tokensPanel.getByRole("row").filter({ hasText: tokenName });
  await expect(tokenRow).toBeVisible();
  await expect(tokenRow.getByText("Read only", { exact: true })).toBeVisible();
});
