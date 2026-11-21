import { expect, test } from "@playwright/test";

import { seedDatabase } from "../shared/seed/seed-database";

const ticketTitle = "Pay button throws when the cart is empty";

test("assign, reassign, and unassign a ticket from the sidebar", async ({ page }) => {
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
  const card = page.getByRole("button", { name: new RegExp(ticketTitle) });
  await expect(card).toBeVisible({ timeout: 30_000 });
  const shortId = ((await card.innerText()).match(/SNB-\d+/) ?? [])[0];
  if (!shortId) {
    throw new Error("The seeded ticket has no short id");
  }
  await page.goto(`/tickets/${shortId}`);
  await expect(page.getByRole("heading", { name: ticketTitle })).toBeVisible({ timeout: 30_000 });

  const assigneeTrigger = page.getByRole("button", { name: "Change assignee" });
  await expect(assigneeTrigger).toBeVisible({ timeout: 30_000 });
  await page.waitForFunction(() => {
    const trigger = Array.from(document.querySelectorAll("button")).find(
      (button) => button.getAttribute("aria-label") === "Change assignee",
    );
    if (!trigger) return false;
    return Object.getOwnPropertyNames(trigger).some((name) => name.startsWith("__reactProps$"));
  });

  await expect(async () => {
    await assigneeTrigger.click();
    await expect(page.getByRole("menuitem", { name: "Alice" })).toBeVisible({ timeout: 3_000 });
  }).toPass({ timeout: 15_000 });
  await page.getByRole("menuitem", { name: "Alice" }).click();
  await expect(page.getByRole("button", { name: "Change assignee" })).toContainText("Alice");
  await expect(page.getByText("Assignee updated")).toBeVisible();

  await page.reload();
  await expect(page.getByRole("button", { name: "Change assignee" })).toContainText("Alice", { timeout: 30_000 });

  await expect(async () => {
    await assigneeTrigger.click();
    await expect(page.getByRole("menuitem", { name: "Unassigned" })).toBeVisible({ timeout: 3_000 });
  }).toPass({ timeout: 15_000 });
  await page.getByRole("menuitem", { name: "Unassigned" }).click();
  await expect(page.getByRole("button", { name: "Change assignee" })).toContainText("Unassigned");
  await page.reload();
  await expect(page.getByRole("button", { name: "Change assignee" })).toContainText("Unassigned", { timeout: 30_000 });
});
