import { expect, test } from "@playwright/test";

import { seedDatabase } from "../shared/seed/seed-database";

const projectId = "4a8c69a1-1ab1-45a8-8497-eae1e506d9d1";
const title = "Checkout map pin is missing";
const description = "The map pin never appears after I confirm the delivery address.";
const logMarker = "Snapbug e2e ingest marker";

test("a visitor report shows on the dashboard with screenshot, environment, logs, and replay", async ({ page }) => {
  test.setTimeout(120_000);
  await seedDatabase();

  await page.goto("/report");
  await expect(page.getByRole("heading", { name: "Store checkout" })).toBeVisible();
  const reportButton = page.getByRole("button", { name: "Report a bug" });
  await expect(reportButton).toBeVisible();
  await page.evaluate((message) => {
    console.info(message);
  }, logMarker);
  await page.evaluate(() => {
    void fetch("/sign-in", { method: "HEAD" });
  });

  await reportButton.click();
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
  await expect(page.getByText("Browser", { exact: true })).toBeVisible();
  await expect(page.getByText("OS", { exact: true })).toBeVisible();
  await expect(page.getByText("Device", { exact: true })).toBeVisible();
  await expect(page.getByText(/^Chrome \d+$/)).toBeVisible();
  await expect(page.getByText(/^(macOS|Linux|Windows)$/)).toBeVisible();
  await expect(page.getByText("desktop", { exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Session replay" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Play session replay" })).toBeVisible({ timeout: 30_000 });
  await expect(page.getByRole("heading", { name: "Technical diagnostics" })).toBeVisible();
  await expect(page.getByText(logMarker)).toBeVisible({ timeout: 30_000 });
  await page.getByRole("button", { name: "Network" }).click();
  await expect(page.getByText("/sign-in")).toBeVisible({ timeout: 30_000 });
});
