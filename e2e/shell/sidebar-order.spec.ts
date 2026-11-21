import { expect, test } from "@playwright/test";

import { seedDatabase } from "../shared/seed/seed-database";

async function signIn(page: import("@playwright/test").Page, email: string) {
  await page.goto("/sign-in");
  await page.waitForFunction(() => {
    const form = document.querySelector("form");
    if (!form) return false;
    return Object.getOwnPropertyNames(form).some((name) => name.startsWith("__reactProps$"));
  });
  await page.getByRole("textbox", { name: "Work Email" }).fill(email);
  await page.getByRole("textbox", { name: "Password" }).fill("password");
  await page.getByRole("button", { name: "Log in" }).click();
  await expect(page).toHaveURL(/\/overview/, { timeout: 30_000 });
}

function sidebarLinks(page: import("@playwright/test").Page) {
  return page.getByRole("navigation", { name: "Main" }).getByRole("link");
}

test("admin sidebar groups list links in work, setup, organization, then settings", async ({ page }) => {
  test.setTimeout(90_000);
  await seedDatabase();
  await signIn(page, "admin@example.com");

  const nav = page.getByRole("navigation", { name: "Main" });
  await expect(nav.getByText("Work", { exact: true })).toBeVisible();
  await expect(nav.getByText("Setup", { exact: true })).toBeVisible();
  await expect(nav.getByText("Organization", { exact: true })).toBeVisible();

  const adminOrder = [
    "Overview",
    "Tickets",
    "Playground",
    "Projects",
    "SDK Setup",
    "MCP",
    "Team",
    "Activity",
    "Settings",
  ];
  const links = sidebarLinks(page);
  await expect(links).toHaveCount(adminOrder.length);
  for (let index = 0; index < adminOrder.length; index += 1) {
    await expect(links.nth(index)).toHaveText(adminOrder[index]!);
  }
});

test("member sidebar omits admin-only links but keeps the same group order", async ({ page }) => {
  test.setTimeout(90_000);
  await seedDatabase();
  await signIn(page, "alice@example.com");

  const nav = page.getByRole("navigation", { name: "Main" });
  await expect(nav.getByText("Work", { exact: true })).toBeVisible();
  await expect(nav.getByText("Setup", { exact: true })).toBeVisible();
  await expect(nav.getByText("Organization", { exact: true })).toBeHidden();

  const memberOrder = ["Overview", "Tickets", "Playground", "SDK Setup", "MCP", "Settings"];
  const links = sidebarLinks(page);
  await expect(links).toHaveCount(memberOrder.length);
  for (let index = 0; index < memberOrder.length; index += 1) {
    await expect(links.nth(index)).toHaveText(memberOrder[index]!);
  }
});
