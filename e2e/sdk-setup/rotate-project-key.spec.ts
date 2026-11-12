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
  await expect(page).toHaveURL(/\/overview/);

  await page.goto(`/sdk?projectId=${projectId}`);
  await expect(page.getByRole("heading", { name: "Set up the SDK" })).toBeVisible();
  await expect(page.getByText(previousKey)).toBeHidden();

  await page.getByRole("button", { name: "Rotate key" }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog.getByRole("heading", { name: "Rotate project key" })).toBeVisible();

  await dialog.getByRole("button", { name: "Rotate key" }).click();
  await expect(dialog.getByRole("heading", { name: "New project key" })).toBeVisible();

  const secretText = dialog.getByText(/^snb_pk_live_/);
  await expect(secretText).toBeVisible();
  const secret = (await secretText.innerText()).trim();
  expect(secret).toMatch(/^snb_pk_live_/);

  await dialog.getByRole("button", { name: "Done" }).click();
  await expect(page.getByRole("heading", { name: "New project key" })).toBeHidden();
  await expect(page.getByText(secret)).toBeHidden();
  await expect(page.getByText(previousKey)).toBeHidden();
  await expect(page.getByRole("heading", { name: "Set up the SDK" })).toBeVisible();
});
