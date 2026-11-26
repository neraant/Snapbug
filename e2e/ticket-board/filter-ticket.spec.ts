import { expect, test } from "@playwright/test";

import { signIn } from "../shared/sign-in";
import { seedDatabase } from "../shared/seed/seed-database";

const payTitle = "Pay button throws when the cart is empty";
const discountTitle = "Discount code SAVE10 is ignored at checkout";
const marketingTitle = "Hero image overflows on a phone-width screen";

test("filters narrow the board, an empty search is explicit, and another project's tickets stay hidden", async ({
  page,
}) => {
  await seedDatabase();
  await signIn(page, "admin@example.com");
  await page.goto("/tickets?projectId=acme-store");

  const payCard = page.getByRole("button", { name: new RegExp(payTitle) });
  await expect(payCard).toBeVisible({ timeout: 30_000 });
  await expect(page.getByText(marketingTitle)).toHaveCount(0);

  await page.getByRole("button", { name: "Severity" }).click();
  await page.getByRole("button", { name: "Critical", exact: true }).click();
  await expect(page.getByText(payTitle)).toBeVisible();
  await expect(page.getByText(discountTitle)).toHaveCount(0);

  await page.getByRole("button", { name: "Clear filters" }).click();
  await expect(page.getByText(discountTitle)).toBeVisible();

  await page.getByRole("searchbox", { name: "Search tickets" }).fill("zzz-no-such-ticket");
  const emptySearch = page.getByRole("heading", { name: "No tickets match your filters" });
  await expect(emptySearch).toBeVisible();
  await expect(page.getByText(payTitle)).toHaveCount(0);

  await emptySearch.locator("xpath=..").getByRole("button", { name: "Clear filters" }).click();
  await expect(page.getByText(payTitle)).toBeVisible();
  await expect(page.getByText(marketingTitle)).toHaveCount(0);
});
