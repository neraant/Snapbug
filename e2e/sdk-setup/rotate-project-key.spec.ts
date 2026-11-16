import { expect, test } from "@playwright/test";

import { seedDatabase } from "../shared/seed/seed-database";

const projectId = "4a8c69a1-1ab1-45a8-8497-eae1e506d9d1";
const previousKey = "sb_test_store_active";

test("an administrator sees a rotated project key only once", async ({ page }) => {
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

  await page.goto(`/sdk?projectId=${projectId}`);
  await expect(page.getByRole("heading", { name: "Set up the SDK" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Project API Key" })).toBeVisible();
  await expect(page.getByText(previousKey)).toBeHidden();

  const rotateButton = page.getByRole("button", { name: "Rotate key" });
  await expect(async () => {
    await rotateButton.click();
    await expect(page.getByRole("alertdialog").getByRole("heading", { name: "Rotate project key" })).toBeVisible({
      timeout: 2_000,
    });
  }).toPass({ timeout: 30_000 });

  const confirmDialog = page.getByRole("alertdialog");
  await confirmDialog.getByRole("button", { name: "Rotate key" }).click();
  await expect(confirmDialog).toBeHidden({ timeout: 30_000 });

  const dialog = page.getByRole("dialog");
  await expect(dialog.getByRole("heading", { name: "New API key" })).toBeVisible({ timeout: 30_000 });

  await dialog.getByRole("button", { name: "Show secret" }).click();
  const secretField = dialog.getByRole("textbox");
  await expect(secretField).toHaveValue(/^snb_pk_live_/);
  const secret = (await secretField.inputValue()).trim();
  expect(secret).toMatch(/^snb_pk_live_/);

  await dialog.getByRole("button", { name: "I've copied it" }).click();
  await expect(dialog.getByRole("heading", { name: "New API key" })).toBeHidden();
  await expect(page.getByText(secret)).toBeHidden();
  await expect(page.getByText(previousKey)).toBeHidden();
  await expect(page.getByRole("heading", { name: "Set up the SDK" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Show" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Reveal key" })).toHaveCount(0);
});
