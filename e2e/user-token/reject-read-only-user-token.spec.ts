import { expect, test } from "@playwright/test";

import { callMcpTool } from "../shared/call-mcp";
import { seedAccess } from "../shared/seed/seed-access";
import { seedDatabase } from "../shared/seed/seed-database";

test("a read-only MCP token can list tickets and cannot update one", async ({ request }) => {
  await seedDatabase();
  const fixture = await seedAccess();

  const listed = await callMcpTool(request, fixture.readOnlyMcpToken, "list_tickets", { limit: 5 });
  expect(listed.status).toBeLessThan(400);
  expect(listed.isError).toBe(false);
  expect(listed.text).toContain("Pay button throws");

  const updated = await callMcpTool(request, fixture.readOnlyMcpToken, "update_ticket", {
    id: fixture.payTicketId,
    status: "closed",
  });
  expect(updated.isError).toBe(true);
  expect(updated.text).toContain("tickets:write");

  const revoked = await callMcpTool(request, fixture.revokedMcpToken, "list_tickets", { limit: 1 });
  expect(revoked.status).toBe(401);
  expect(revoked.text.length > 0 || JSON.stringify(revoked.body).length > 0).toBe(true);
});
