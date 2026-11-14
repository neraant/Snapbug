import { expect, test } from "@playwright/test";

import { seedDatabase } from "../shared/seed/seed-database";

const ticketTitle = "Pay button throws when the cart is empty";
const commentBody = "The empty cart should not read a price.";

test("a teammate adds an internal comment on the ticket", async ({ page }) => {
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

  await page.goto("/tickets");
  const card = page.getByRole("button", { name: /Pay button throws when the cart is empty/ });
  await expect(card).toBeVisible({ timeout: 30_000 });
  const shortId = ((await card.innerText()).match(/SNB-\d+/) ?? [])[0];
  if (!shortId) {
    throw new Error("The seeded ticket has no short id");
  }
  await page.goto(`/tickets/${shortId}`);
  await expect(page.getByRole("heading", { name: ticketTitle })).toBeVisible({ timeout: 30_000 });
  await expect(page.getByRole("heading", { name: "Comments" })).toBeVisible();
  await page.waitForFunction(() => {
    const button = [...document.querySelectorAll("button")].find(
      (element) => element.textContent?.trim() === "Add comment",
    );
    if (!button) return false;
    return Object.getOwnPropertyNames(button).some((name) => name.startsWith("__reactProps$"));
  });

  const commentBox = page.getByRole("textbox", { name: "Comment" });
  await commentBox.fill(commentBody);
  await page.getByRole("button", { name: "Add comment" }).click();

  await expect(page.getByRole("paragraph").filter({ hasText: commentBody })).toBeVisible({ timeout: 30_000 });
  await expect(page.getByText("Internal notes for the team. The report author does not see them.")).toBeVisible();
});
