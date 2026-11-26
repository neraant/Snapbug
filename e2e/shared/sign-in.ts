import { expect, type Page } from "@playwright/test";

import { waitForReactFormHydration } from "./wait-for-react-form-hydration";

export async function signIn(page: Page, email: string, password = "password"): Promise<void> {
  await page.goto("/sign-in");
  await waitForReactFormHydration(page);
  await page.getByRole("textbox", { name: "Work Email" }).fill(email);
  await page.getByRole("textbox", { name: "Password" }).fill(password);
  await page.getByRole("button", { name: "Log in" }).click();
  await expect(page).toHaveURL(/\/overview/, { timeout: 30_000 });
}

export async function signOut(page: Page): Promise<void> {
  await page.getByRole("button", { name: "More options" }).click();
  await page.getByRole("menuitem", { name: "Sign out" }).click();
  await expect(page).toHaveURL(/\/sign-in/, { timeout: 30_000 });
}
