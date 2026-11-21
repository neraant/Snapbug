import { expect, test } from "@playwright/test";

import { seedDatabase } from "../shared/seed/seed-database";

test("a member can create a personal MCP token and see the secret once", async ({ page }) => {
  await seedDatabase();
  const email = `mcp-${Date.now()}@example.com`;
  const tokenName = "E2E MCP token";

  await page.goto("/sign-up");
  await page.waitForFunction(() => {
    const form = document.querySelector("form");
    if (!form) return false;
    return Object.getOwnPropertyNames(form).some((name) => name.startsWith("__reactProps$"));
  });
  await page.getByRole("textbox", { name: "Full Name" }).fill("MCP Member");
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
  await createDialog.getByRole("textbox", { name: "Name" }).fill(tokenName);
  await createDialog.getByRole("button", { name: "Create", exact: true }).click();

  const secretDialog = page.getByRole("dialog", { name: "Token created" });
  await expect(secretDialog).toBeVisible({ timeout: 30_000 });
  await expect(secretDialog.getByText("Copy it now. You won't be able to see it again.")).toBeVisible();
  await expect(secretDialog.getByText("How to use")).toHaveCount(0);
  await expect(secretDialog.getByRole("link", { name: "How to connect → MCP · Connect" })).toBeVisible();
  const secretField = secretDialog.getByRole("textbox", { name: "Token created" });
  await expect(secretField).toHaveValue(/^snb_ut_live_/);

  await secretDialog.getByRole("button", { name: "I've copied it" }).click();
  await expect(page.getByText(tokenName)).toBeVisible();
  await page.getByRole("button", { name: "Token actions" }).click();
  await page.getByRole("menuitem", { name: "Revoke" }).click();
  const revokeConfirm = page.getByRole("alertdialog", { name: `Revoke token "${tokenName}"?` });
  await expect(revokeConfirm).toBeVisible();
  await revokeConfirm.getByRole("button", { name: "Revoke" }).click();
  await expect(page.getByText("No tokens yet.")).toBeVisible({ timeout: 30_000 });
});
