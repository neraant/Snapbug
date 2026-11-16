import { expect, test } from "@playwright/test";

import { seedDatabase } from "../shared/seed/seed-database";
import { waitForReactFormHydration } from "../shared/wait-for-react-form-hydration";

test("a signed-in member opening someone else's invite sees the wrong-account screen", async ({ page }) => {
  test.setTimeout(120_000);
  await seedDatabase();

  const inviteEmail = `invitee-${Date.now()}@example.com`;

  await page.goto("/sign-in");
  await waitForReactFormHydration(page);
  await page.getByRole("textbox", { name: "Work Email" }).fill("admin@example.com");
  await page.getByRole("textbox", { name: "Password" }).fill("password");
  await page.getByRole("button", { name: "Log in" }).click();
  await expect(page).toHaveURL(/\/overview/, { timeout: 30_000 });

  await page.goto("/team");
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
  await page.getByRole("button", { name: "View" }).click();
  await expect(page).toHaveURL(/tab=invitations/);
  await expect(page.getByText(inviteEmail)).toBeVisible();

  await page.getByRole("button", { name: `Invitation actions for ${inviteEmail}` }).click();
  await page.context().grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.getByRole("menuitem", { name: "Copy link" }).click();
  await expect(page.getByText("Invitation link copied.")).toBeVisible({ timeout: 15_000 });

  const inviteUrl = await page.evaluate(async () => await navigator.clipboard.readText());

  await page.goto(inviteUrl);
  await expect(page.getByText("Wrong account")).toBeVisible({ timeout: 30_000 });
  await expect(page.getByText(/admin@example.com/i)).toBeVisible();
  await expect(page.getByRole("button", { name: /Sign out and continue/i })).toBeVisible();
});
