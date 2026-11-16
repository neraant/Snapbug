import { expect, test } from "@playwright/test";

import { seedDatabase } from "../shared/seed/seed-database";
import { waitForReactFormHydration } from "../shared/wait-for-react-form-hydration";

test("an administrator resends a pending invitation", async ({ page }) => {
  test.setTimeout(90_000);
  await seedDatabase();

  await page.goto("/sign-in");
  await waitForReactFormHydration(page);
  await page.getByRole("textbox", { name: "Work Email" }).fill("admin@example.com");
  await page.getByRole("textbox", { name: "Password" }).fill("password");
  await page.getByRole("button", { name: "Log in" }).click();
  await expect(page).toHaveURL(/\/overview/, { timeout: 30_000 });

  await page.goto("/team");
  await expect(page.getByRole("button", { name: "Invite people" })).toBeVisible();

  const inviteEmail = `pending-${Date.now()}@example.com`;
  const inviteButton = page.getByRole("button", { name: "Invite people" });
  await expect(async () => {
    await inviteButton.click();
    await expect(page.getByRole("dialog", { name: "Invite people" })).toBeVisible({ timeout: 2_000 });
  }).toPass({ timeout: 30_000 });

  const inviteDialog = page.getByRole("dialog", { name: "Invite people" });
  await inviteDialog.getByRole("textbox", { name: "Email addresses" }).fill(inviteEmail);
  await inviteDialog.getByRole("textbox", { name: "Email addresses" }).press("Enter");
  await inviteDialog.getByRole("button", { name: "Send invitations" }).click();
  await expect(page.getByText(/invitation sent/i)).toBeVisible({ timeout: 30_000 });
  await expect(page.getByRole("button", { name: "View" })).toBeVisible();
  await page.getByRole("button", { name: "View" }).click();

  await expect(page).toHaveURL(/tab=invitations/);
  await expect(page.getByText(inviteEmail)).toBeVisible();

  await page.getByRole("button", { name: `Invitation actions for ${inviteEmail}` }).click();
  await page.getByRole("menuitem", { name: "Resend" }).click();
  await expect(page.getByText("Invitation resent.")).toBeVisible();
});
