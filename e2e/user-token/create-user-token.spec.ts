import { expect, test } from "@playwright/test";

test("a member can create a personal MCP token and see the secret once", async ({ page }) => {
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

  await expect(async () => {
    await page.goto("/mcp");
    await expect(page.getByRole("button", { name: "Create token" })).toBeVisible();
    await expect(page.getByText("A project key is not accepted.")).toBeVisible();
  }).toPass({ timeout: 20_000 });

  await page.getByRole("button", { name: "Create token" }).click();
  const createDialog = page.getByRole("dialog", { name: "Create token" });
  await expect(createDialog).toBeVisible();
  await createDialog.getByRole("textbox", { name: "Name" }).fill(tokenName);
  await createDialog.getByRole("button", { name: "Create", exact: true }).click();

  const secretDialog = page.getByRole("dialog", { name: "Copy this token" });
  await expect(secretDialog).toBeVisible();
  await expect(secretDialog.getByText("This token is shown once.")).toBeVisible();
  await expect(secretDialog.getByText(/snb_ut_live_/)).toBeVisible();

  await page.getByRole("button", { name: "Close" }).click();
  await expect(page.getByText(tokenName)).toBeVisible();
  await page.getByRole("button", { name: "Revoke" }).click();
  await expect(page.getByText("Revoked", { exact: true })).toBeVisible({ timeout: 30_000 });
});