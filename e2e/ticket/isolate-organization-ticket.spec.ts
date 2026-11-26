import { expect, test } from "@playwright/test";

import { callProcedure, procedureDenied } from "../shared/call-procedure";
import { pageHeading } from "../shared/page-heading";
import { signIn } from "../shared/sign-in";
import { readTicket, seedAccess } from "../shared/seed/seed-access";
import { seedDatabase } from "../shared/seed/seed-database";

test("a member cannot read or change another organization's ticket", async ({ page }) => {
  await seedDatabase();
  const fixture = await seedAccess();
  await signIn(page, "alice@example.com");

  await page.goto(`/tickets/${fixture.foreignShortId}`);
  await expect(page.getByRole("heading", { name: "Something broke on our side" })).toBeVisible({ timeout: 30_000 });
  await expect(page.getByText(fixture.foreignTitle)).toHaveCount(0);

  await page.goto("/tickets");
  await expect(pageHeading(page, "Tickets")).toBeVisible();
  await expect(page.getByText(fixture.foreignTitle)).toHaveCount(0);
  await expect(page.getByText(fixture.foreignShortId)).toHaveCount(0);

  const read = await callProcedure(page, "bugReport/findOne", { shortId: fixture.foreignShortId });
  const update = await callProcedure(page, "bugReport/updateBugReport", {
    id: fixture.foreignTicketId,
    status: "closed",
  });
  expect(procedureDenied(read)).toBe(true);
  expect(procedureDenied(update)).toBe(true);
  expect(JSON.stringify(read.body)).not.toContain(fixture.foreignTitle);

  const stored = await readTicket(fixture.foreignTicketId);
  expect(stored.title).toBe(fixture.foreignTitle);
  expect(stored.status).toBe("new");
});
