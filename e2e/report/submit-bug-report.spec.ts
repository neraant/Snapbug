import { expect, test } from "@playwright/test";

import { seedDatabase } from "../shared/seed/seed-database";

const projectId = "4a8c69a1-1ab1-45a8-8497-eae1e506d9d1";
const title = "Checkout map pin is missing";
const description = "The map pin never appears after I confirm the delivery address.";

test("a visitor report shows on the dashboard with its screenshot", async ({ page }) => {
  test.setTimeout(120_000);
  await seedDatabase();

  await page.goto("/report");
  await expect(page.getByRole("heading", { name: "Store checkout" })).toBeVisible();

  await page.getByRole("button", { name: "Report a bug" }).click();
  await expect(page.getByRole("heading", { name: "Found a bug?" })).toBeVisible();
  await page.getByRole("textbox", { name: "Title" }).fill(title);
  await page.getByRole("textbox", { name: "What happened?" }).fill(description);
  await expect(page.getByText("Visual capture attached")).toBeVisible({ timeout: 30_000 });
  await page.getByRole("button", { name: "Send report" }).click();
  await expect(page.getByRole("heading", { name: "Report Received!" })).toBeVisible({ timeout: 30_000 });

  await page.goto("/sign-in");
  await expect(page.getByRole("textbox", { name: "Work Email" })).toBeVisible();
  await page.getByRole("textbox", { name: "Work Email" }).fill("admin@example.com");
  await page.getByRole("textbox", { name: "Password" }).fill("password");
  await page.getByRole("button", { name: "Log in" }).click();
  await expect(page).toHaveURL(/\/overview/, { timeout: 30_000 });

  await page.goto(`/tickets?projectId=${projectId}`);
  const card = page.getByRole("button", { name: new RegExp(title) });
  await expect(card).toBeVisible({ timeout: 30_000 });
  const shortId = ((await card.innerText()).match(/SNB-\d+/) ?? [])[0];
  if (!shortId) {
    throw new Error("The submitted ticket has no short id");
  }
  await page.goto(`/tickets/${shortId}?projectId=${projectId}`);
  await expect(page.getByRole("heading", { name: title })).toBeVisible({ timeout: 30_000 });
  await expect(page.getByText(description)).toBeVisible();
  await expect(page.getByRole("heading", { name: "Screenshot" })).toBeVisible();
  await expect(page.getByRole("img", { name: "Bug report screenshot" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Client environment" })).toBeVisible();
  await expect(page.getByText("Browser")).toBeVisible();
});
