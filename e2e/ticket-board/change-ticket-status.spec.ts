import { expect, test, type Locator, type Page } from "@playwright/test";

import { pageHeading } from "../shared/page-heading";
import { signIn } from "../shared/sign-in";
import { seedAccess } from "../shared/seed/seed-access";
import { seedDatabase } from "../shared/seed/seed-database";

const payTitle = /Pay button throws when the cart is empty/;
const discountTitle = "Discount code SAVE10 is ignored at checkout";

function column(page: Page, label: string): Locator {
  return page
    .getByRole("button", { name: label, exact: true })
    .locator("xpath=ancestor::div[contains(@class,'min-w-80')][1]");
}

function ticketCard(page: Page, title: string | RegExp): Locator {
  return page.getByRole("link", { name: title }).or(page.getByRole("button", { name: title }));
}

test("changing a ticket status keeps it in the new column after reload", async ({ page }) => {
  await seedDatabase();
  const fixture = await seedAccess();
  await signIn(page, "admin@example.com");

  await page.goto(`/tickets/${fixture.discountShortId}?projectId=acme-store`);
  await expect(page.getByRole("heading", { name: discountTitle })).toBeVisible({ timeout: 30_000 });
  const discountUpdated = page.getByText("Last updated", { exact: true }).locator("xpath=..");
  const discountUpdatedBefore = (await discountUpdated.innerText()).replace("Last updated", "").trim();

  await page.goto(`/tickets/${fixture.payShortId}?projectId=acme-store`);
  await expect(page.getByRole("heading", { name: payTitle })).toBeVisible({ timeout: 30_000 });
  const status = page.getByRole("combobox", { name: "Ticket status" });
  await expect(status).toContainText("New");
  await expect(async () => {
    await status.click();
    await expect(page.getByRole("listbox")).toBeVisible({ timeout: 3_000 });
    await page.getByRole("listbox").getByRole("option", { name: "In progress" }).click();
  }).toPass({ timeout: 15_000 });
  await expect(page.getByText("Ticket status updated")).toBeVisible();

  await page.goto("/tickets?projectId=acme-store");
  await expect(column(page, "In progress").getByRole("button", { name: payTitle })).toBeVisible({ timeout: 30_000 });
  await expect(column(page, "New").getByRole("button", { name: payTitle })).toHaveCount(0);

  await page.reload();
  await expect(column(page, "In progress").getByRole("button", { name: payTitle })).toBeVisible({ timeout: 30_000 });
  await expect(column(page, "New").getByRole("button", { name: payTitle })).toHaveCount(0);

  await ticketCard(page, discountTitle).click();
  await expect(page.getByRole("heading", { name: discountTitle })).toBeVisible({ timeout: 30_000 });
  const discountUpdatedAfter = (await page.getByText("Last updated", { exact: true }).locator("xpath=..").innerText())
    .replace("Last updated", "")
    .trim();
  expect(discountUpdatedAfter).toBe(discountUpdatedBefore);

  await page.goto("/activity");
  await expect(pageHeading(page, "Activity log")).toBeVisible();
  await expect(page.getByText("Changed status of").first()).toBeVisible();
});
