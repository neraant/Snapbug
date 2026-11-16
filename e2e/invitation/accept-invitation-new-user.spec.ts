import { expect, test } from "@playwright/test";

import { seedDatabase } from "../shared/seed/seed-database";
import { waitForReactFormHydration } from "../shared/wait-for-react-form-hydration";

async function adminInviteEmail(page: import("@playwright/test").Page, inviteEmail: string): Promise<string> {
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
  await expect(page.getByText("Invitation link copied.")).toBeVisible();

  return await page.evaluate(async () => await navigator.clipboard.readText());
}

test("a new user creates an account from the invite page and joins the team", async ({ page }) => {
  test.setTimeout(120_000);
  await seedDatabase();

  const inviteEmail = `new-invitee-${Date.now()}@example.com`;
  const inviteUrl = await adminInviteEmail(page, inviteEmail);

  await page.context().clearCookies();
  await page.goto(inviteUrl);
  await expect(page.getByRole("button", { name: "Create account to join" })).toBeVisible({
    timeout: 30_000,
  });
  await expect(page.getByText(inviteEmail)).toBeVisible();
  await waitForReactFormHydration(page);

  await page.getByRole("textbox", { name: "Name" }).fill("New Invitee");
  await page.getByRole("textbox", { name: "Password" }).fill("password123");
  await page.getByRole("checkbox", { name: /terms/i }).check();
  await page.getByRole("button", { name: "Create account to join" }).click();

  await expect(page).toHaveURL(/\/overview/, { timeout: 90_000 });
  await expect(page.getByText(/You joined Acme/)).toBeVisible({ timeout: 15_000 });
});
