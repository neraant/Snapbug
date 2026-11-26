import { expect, test } from "@playwright/test";

import { resetTokenExists } from "../shared/seed/seed-access";
import { seedDatabase } from "../shared/seed/seed-database";
import { waitForReactFormHydration } from "../shared/wait-for-react-form-hydration";

async function requestReset(page: import("@playwright/test").Page, email: string) {
  await page.goto("/forgot-password");
  await waitForReactFormHydration(page);
  await page.getByRole("textbox", { name: "Work Email" }).fill(email);
  await page.getByRole("button", { name: "Send reset link" }).click();
}

test("forgot password gives the same result for a known and an unknown email", async ({ page }) => {
  await seedDatabase();
  const knownEmail = "bob@example.com";
  const unknownEmail = "nobody-xyz@example.com";

  await requestReset(page, knownEmail);
  await expect(page.getByText("Password recovery link sent")).toBeVisible();
  expect(await resetTokenExists(knownEmail)).toBe(true);

  await requestReset(page, unknownEmail);
  await expect(page.getByText(/Password recovery link sent|User not found/)).toBeVisible();
  expect(await resetTokenExists(unknownEmail)).toBe(false);
  await expect(page).toHaveURL(/\/forgot-password/);
});
