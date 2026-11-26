import { expect, test } from "@playwright/test";

import { signIn } from "../shared/sign-in";
import { seedAccess } from "../shared/seed/seed-access";
import { seedDatabase } from "../shared/seed/seed-database";

test("a long unbroken description keeps ticket properties on screen", async ({ page }) => {
  await seedDatabase();
  const fixture = await seedAccess();
  await signIn(page, "admin@example.com");
  await page.goto(`/tickets/${fixture.longTicketShortId}?projectId=acme-store`);

  await expect(page.getByRole("heading", { name: fixture.longTicketTitle })).toBeVisible({ timeout: 30_000 });
  await expect(page.getByRole("heading", { name: "Ticket properties" })).toBeVisible();
});
