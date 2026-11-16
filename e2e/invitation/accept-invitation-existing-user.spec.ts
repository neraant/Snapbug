import { expect, test } from "@playwright/test";

import { seedDatabase } from "../shared/seed/seed-database";

test("an existing user signs in from the invite page and joins the team", async ({ page, browser }) => {
  test.setTimeout(150_000);
  await seedDatabase();

  const inviteEmail = `existing-invitee-${Date.now()}@example.com`;
  const password = "password123";

  const signupPage = await browser.newPage();
  await signupPage.goto("/sign-up");
  await signupPage.getByLabel("Name").fill("Existing Invitee");
  await signupPage.getByLabel("Work Email").fill(inviteEmail);
  await signupPage.getByLabel("Password").fill(password);
  await signupPage.getByRole("checkbox", { name: /terms/i }).check();
  await signupPage.getByRole("button", { name: "Create account" }).click();
  await expect(signupPage).toHaveURL(/\/(overview|onboarding)/, { timeout: 60_000 });
  await signupPage.close();

  await page.goto("/sign-in");
  await page.getByRole("textbox", { name: "Work Email" }).fill("admin@example.com");
  await page.getByRole("textbox", { name: "Password" }).fill("password");
  await page.getByRole("button", { name: "Log in" }).click();
  await expect(page).toHaveURL(/\/overview/, { timeout: 30_000 });

  await page.goto("/team");
  const inviteButton = page.getByRole("button", { name: "Invite people" });
  await inviteButton.click();
  const inviteDialog = page.getByRole("dialog", { name: "Invite people" });
  await inviteDialog.getByRole("textbox", { name: "Email addresses" }).fill(inviteEmail);
  await inviteDialog.getByRole("textbox", { name: "Email addresses" }).press("Enter");
  await inviteDialog.getByRole("button", { name: "Send invitations" }).click();

  await page.getByRole("button", { name: `Invitation actions for ${inviteEmail}` }).click();
  await page.context().grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.getByRole("menuitem", { name: "Copy link" }).click();

  const inviteUrl = await page.evaluate(async () => await navigator.clipboard.readText());

  await page.goto("/api/auth/signout");
  await page.goto(inviteUrl);

  await expect(page.getByRole("button", { name: "Sign in to join" })).toBeVisible();
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Sign in to join" }).click();

  await expect(page).toHaveURL(/\/overview/, { timeout: 60_000 });
  await expect(page.getByText("You joined")).toBeVisible();
});