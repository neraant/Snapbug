import { expect, test } from "@playwright/test";

import { seedDatabase } from "../shared/seed/seed-database";

test("playground submit stays on the page and shows the capture", async ({ page }) => {
  test.setTimeout(90_000);
  await seedDatabase();

  const ingestPosts: string[] = [];
  page.on("request", (request) => {
    if (request.method() === "POST" && request.url().includes("/api/bug-reports")) {
      ingestPosts.push(request.url());
    }
  });

  await page.goto("/sign-in");
  await page.getByRole("textbox", { name: "Work Email" }).fill("admin@example.com");
  await page.getByRole("textbox", { name: "Password" }).fill("password");
  await page.getByRole("button", { name: "Log in" }).click();
  await expect(page).toHaveURL(/\/overview/, { timeout: 30_000 });

  await page.goto("/playground");
  await expect(page.getByText("Try the widget on a sample page. Nothing you submit is saved.")).toBeVisible();
  await expect(page.getByText("Sandbox — no data is saved")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Sample checkout" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Captured report" })).toBeVisible();

  await page.getByRole("button", { name: "Report a bug" }).click();
  await page.getByRole("textbox", { name: "Title" }).fill("Pay does nothing");
  await page.getByRole("textbox", { name: "What happened?" }).fill("The pay button did nothing at all");
  await page.getByRole("button", { name: "Send report" }).click();

  await expect(page.getByRole("heading", { name: "Pay does nothing", level: 3 })).toBeVisible({ timeout: 30_000 });
  await expect(page.getByRole("tab", { name: "Overview" })).toBeVisible();
  await expect(page.getByRole("tab", { name: "Screenshot" })).toBeVisible();
  await expect(page.getByText("The pay button did nothing at all")).toBeVisible();
  await expect(page.getByRole("tab", { name: "Environment" })).toBeVisible();
  expect(ingestPosts).toEqual([]);
  await expect(page).toHaveURL(/\/playground/);
});
