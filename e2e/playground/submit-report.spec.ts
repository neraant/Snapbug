import { expect, test } from "@playwright/test";

import { seedDatabase } from "../shared/seed/seed-database";

const ticketTitle = "Checkout pay button does nothing";
const ticketDescription = "I tapped Pay on the checkout page and nothing happened.";

test("the widget submits a report that shows on the ticket with a screenshot", async ({ page }) => {
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

  await page.goto("/playground");
  await page.getByRole("button", { name: "Report a bug" }).click();
  await expect(page.getByRole("heading", { name: "Found a bug?" })).toBeVisible();

  await page.getByRole("textbox", { name: "Title" }).fill(ticketTitle);
  await page.getByRole("textbox", { name: "What happened?" }).fill(ticketDescription);
  await expect(page.getByText("Visual capture attached")).toBeVisible({ timeout: 30_000 });
  await page.getByRole("button", { name: "Send report" }).click();
  await expect(page.getByRole("heading", { name: "Report Received!" })).toBeVisible({ timeout: 30_000 });

  await page.goto("/tickets");
  const card = page.getByRole("button", { name: /Checkout pay button does nothing/ });
  await expect(card).toBeVisible({ timeout: 30_000 });
  const shortId = ((await card.innerText()).match(/SNB-\d+/) ?? [])[0];
  if (!shortId) {
    throw new Error("The submitted ticket has no short id");
  }

  await page.goto(`/tickets/${shortId}`);
  await expect(page.getByRole("heading", { name: ticketTitle })).toBeVisible({ timeout: 30_000 });
  await expect(page.getByText(ticketDescription)).toBeVisible();
  await expect(page.getByRole("heading", { name: "Screenshot" })).toBeVisible();
  await expect(page.getByRole("img", { name: "Bug report screenshot" })).toBeVisible();
});
