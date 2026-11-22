import { expect, test } from "@playwright/test";

import { seedDatabase } from "../shared/seed/seed-database";

const ticketTitle = "Pay button throws when the cart is empty";

test("a teammate adds an internal comment on the ticket", async ({ page }) => {
  test.setTimeout(90_000);
  const commentBody = `E2E comment ${Date.now()}`;
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

  await page.goto("/tickets");
  const card = page.getByRole("button", { name: /Pay button throws when the cart is empty/ });
  await expect(card).toBeVisible({ timeout: 30_000 });
  const shortId = ((await card.innerText()).match(/SNB-\d+/) ?? [])[0];
  if (!shortId) {
    throw new Error("The seeded ticket has no short id");
  }
  await page.goto(`/tickets/${shortId}`);
  await expect(page.getByRole("heading", { name: ticketTitle })).toBeVisible({ timeout: 30_000 });
  await expect(page.getByRole("heading", { name: /Comments/ })).toBeVisible();
  await page.waitForFunction(() => {
    const textarea = document.getElementById("commentBody");
    if (!textarea) return false;
    return Object.getOwnPropertyNames(textarea).some((name) => name.startsWith("__reactProps$"));
  });

  const commentsPanel = page
    .getByRole("heading", { name: /Comments/ })
    .locator("xpath=ancestor::*[@data-slot='panel'][1]");
  const commentBox = commentsPanel.getByRole("textbox", { name: "Comment" });
  await commentBox.click();
  await commentBox.fill(commentBody);
  await commentsPanel.getByRole("button", { name: "Comment" }).click();

  await expect(commentsPanel.getByText(commentBody, { exact: true })).toBeVisible({ timeout: 30_000 });
  await expect(commentsPanel.getByRole("textbox", { name: "Comment" })).toHaveValue("");
  await expect(page.getByText("Internal notes for the team.")).toBeVisible();
});
