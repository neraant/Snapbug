import { expect, test } from "@playwright/test";

import { callProcedure, procedureDenied } from "../shared/call-procedure";
import { signIn } from "../shared/sign-in";
import { countInvitations, seedAccess } from "../shared/seed/seed-access";
import { seedDatabase } from "../shared/seed/seed-database";

const strangerEmail = "stranger-e2e@example.com";

test("a member cannot invite, rotate a key, change a role, rename the organization, or delete a project", async ({
  page,
}) => {
  await seedDatabase();
  const fixture = await seedAccess();
  await signIn(page, "alice@example.com");

  const invite = await callProcedure(page, "invitation/sendInvitations", {
    organizationId: fixture.acmeOrganizationId,
    emails: [strangerEmail],
    role: "member",
    projectIds: [],
  });
  const rotate = await callProcedure(page, "apiKey/rotateProjectApiKey", { projectId: fixture.storeProjectId });
  const role = await callProcedure(page, "membership/updateMembershipRole", {
    membershipId: fixture.aliceMembershipId,
    role: "admin",
  });
  const rename = await callProcedure(page, "organization/updateOrganization", {
    organizationId: fixture.acmeOrganizationId,
    name: "Hijacked Org",
  });
  const remove = await callProcedure(page, "project/deleteProject", { projectId: fixture.storeProjectId });

  expect(procedureDenied(invite)).toBe(true);
  expect(procedureDenied(rotate)).toBe(true);
  expect(procedureDenied(role)).toBe(true);
  expect(procedureDenied(rename)).toBe(true);
  expect(procedureDenied(remove)).toBe(true);
  expect(await countInvitations(strangerEmail)).toBe(0);

  await page.goto("/overview");
  await expect(page.getByRole("button", { name: "Organization" })).toContainText("Acme");
  await expect(page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "Projects" })).toHaveCount(0);

  await page.goto(`/tickets?projectId=${fixture.storeProjectId}`);
  await expect(page.getByRole("button", { name: /Pay button throws/ })).toBeVisible({ timeout: 30_000 });
});
