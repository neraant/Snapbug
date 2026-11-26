import { expect, test } from "@playwright/test";

import { signIn, signOut } from "../shared/sign-in";
import { seedAccess } from "../shared/seed/seed-access";
import { seedDatabase } from "../shared/seed/seed-database";
import { waitForReactFormHydration } from "../shared/wait-for-react-form-hydration";

const nextPassword = "replacement-1";

async function submitReset(page: import("@playwright/test").Page, password: string) {
  await waitForReactFormHydration(page);
  await page.getByRole("textbox", { name: "New Password", exact: true }).fill(password);
  await page.getByRole("textbox", { name: "Confirm New Password", exact: true }).fill(password);
  await page.getByRole("button", { name: "Update password & log in" }).click();
}

test("a reset token sets a new password and cannot be reused", async ({ page }) => {
  await seedDatabase();
  const fixture = await seedAccess();

  await page.goto(`/reset-password?token=${fixture.pendingResetToken}`);
  await expect(page.getByRole("heading", { name: "Create new password" })).toBeVisible();
  await submitReset(page, nextPassword);
  await expect(page).toHaveURL(/\/overview/, { timeout: 30_000 });

  await signOut(page);
  await signIn(page, fixture.bobEmail, nextPassword);
  await signOut(page);

  await page.goto("/sign-in");
  await waitForReactFormHydration(page);
  await page.getByRole("textbox", { name: "Work Email" }).fill(fixture.bobEmail);
  await page.getByRole("textbox", { name: "Password" }).fill("password");
  await page.getByRole("button", { name: "Log in" }).click();
  await expect(page.getByText("Invalid email or password")).toBeVisible();
  await expect(page).toHaveURL(/\/sign-in/);

  await page.goto(`/reset-password?token=${fixture.pendingResetToken}`);
  await submitReset(page, "another-password-2");
  await expect(page.getByText("This reset link is invalid or has expired")).toBeVisible();
  await expect(page).not.toHaveURL(/\/overview/);

  await signIn(page, fixture.bobEmail, nextPassword);
});

test("a bad or expired reset token does not change the password", async ({ page }) => {
  await seedDatabase();
  const fixture = await seedAccess();

  await page.goto("/reset-password?token=not-a-uuid");
  await expect(page.getByText("This reset link is invalid or has expired.")).toBeVisible();
  await expect(page.getByRole("button", { name: "Update password & log in" })).toHaveCount(0);

  await page.goto(`/reset-password?token=${fixture.expiredResetToken}`);
  await submitReset(page, "should-not-apply");
  await expect(page.getByText("This reset link is invalid or has expired")).toBeVisible();
  await expect(page).toHaveURL(/\/reset-password/);

  await signIn(page, fixture.aliceEmail);
});
