import { expect, test, type Page } from "@playwright/test";

import { signIn } from "../shared/sign-in";
import { seedAccess } from "../shared/seed/seed-access";
import { seedDatabase } from "../shared/seed/seed-database";

const storeTitle = "Pay button throws when the cart is empty";
const marketingTitle = "Hero image overflows on a phone-width screen";

async function expectStoreScope(page: Page, foreignShortId: string) {
  await expect(page.getByText(storeTitle)).toBeVisible({ timeout: 30_000 });
  await expect(page.getByText(marketingTitle)).toHaveCount(0);
  await expect(page.getByText(foreignShortId)).toHaveCount(0);
}

test("a project scope keeps other projects and organizations off the board", async ({ page }) => {
  await seedDatabase();
  const fixture = await seedAccess();
  await signIn(page, "admin@example.com");

  await page.goto("/tickets?projectId=acme-store");
  await expectStoreScope(page, fixture.foreignShortId);
  await page.reload();
  await expectStoreScope(page, fixture.foreignShortId);

  await page.goto(`/tickets?projectId=${fixture.storeProjectId}`);
  await expectStoreScope(page, fixture.foreignShortId);
  await page.reload();
  await expectStoreScope(page, fixture.foreignShortId);
});
