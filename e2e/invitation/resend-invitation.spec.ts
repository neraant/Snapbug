import { expect, test } from "@playwright/test";

import { seedDatabase } from "../shared/seed/seed-database";

test("an administrator resends a pending invitation", async ({ page }) => {
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

  await page.goto("/team");
  await expect(page.getByRole("button", { name: "Invite people" })).toBeVisible();

  const inviteEmail = `pending-${Date.now()}@example.com`;
  await page.getByRole("button", { name: "Invite people" }).click();
  await page.getByRole("textbox", { name: "Email addresses" }).fill(inviteEmail);
  await page.getByRole("textbox", { name: "Email addresses" }).press("Enter");
  await page.getByRole("button", { name: "Send invitations" }).click();
  await expect(page.getByText("Invitations sent.")).toBeVisible();

  await expect(page.getByRole("heading", { name: "Pending invitations" })).toBeVisible();
  await expect(page.getByText(inviteEmail)).toBeVisible();

  await page.getByRole("button", { name: `Invitation actions for ${inviteEmail}` }).click();
  await page.getByRole("menuitem", { name: "Resend" }).click();
  await expect(page.getByText("Invitation resent.")).toBeVisible();
});
