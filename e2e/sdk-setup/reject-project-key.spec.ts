import { expect, test } from "@playwright/test";

import { callProcedure } from "../shared/call-procedure";
import { signIn } from "../shared/sign-in";
import { countTicketsByTitle, seedAccess } from "../shared/seed/seed-access";
import { seedDatabase } from "../shared/seed/seed-database";

const activeKey = "sb_test_store_active";
const revokedKey = "sb_test_store_revoked";

async function widgetConfig(request: import("@playwright/test").APIRequestContext, apiKey?: string) {
  const path = apiKey ? `/api/widget-config?apiKey=${encodeURIComponent(apiKey)}` : "/api/widget-config";
  return request.get(path);
}

async function postReport(
  request: import("@playwright/test").APIRequestContext,
  apiKey: string | undefined,
  title: string,
) {
  return request.post("/api/bug-reports", {
    data: {
      ...(apiKey ? { apiKey } : {}),
      title,
      description: "The widget call should be rejected.",
      url: "https://store.acme.test/checkout",
    },
  });
}

test("a missing, malformed, or revoked project key is rejected and creates no ticket", async ({ request }) => {
  await seedDatabase();
  await seedAccess();

  const missingConfig = await widgetConfig(request);
  const malformedConfig = await widgetConfig(request, "not-a-real-key");
  const revokedConfig = await widgetConfig(request, revokedKey);
  expect(missingConfig.status()).toBeGreaterThanOrEqual(400);
  expect(missingConfig.status()).toBeLessThan(500);
  expect(malformedConfig.status()).toBeGreaterThanOrEqual(400);
  expect(malformedConfig.status()).toBeLessThan(500);
  expect(revokedConfig.status()).toBeGreaterThanOrEqual(400);
  expect(revokedConfig.status()).toBeLessThan(500);

  const missingTitle = "Missing key must not create a ticket";
  const malformedTitle = "Malformed key must not create a ticket";
  const revokedTitle = "Revoked key must not create a ticket";
  const missingReport = await postReport(request, undefined, missingTitle);
  const malformedReport = await postReport(request, "not-a-real-key", malformedTitle);
  const revokedReport = await postReport(request, revokedKey, revokedTitle);

  for (const response of [missingReport, malformedReport, revokedReport]) {
    expect(response.status()).toBeGreaterThanOrEqual(400);
    expect(response.status()).toBeLessThan(500);
  }
  expect(await countTicketsByTitle(missingTitle)).toBe(0);
  expect(await countTicketsByTitle(malformedTitle)).toBe(0);
  expect(await countTicketsByTitle(revokedTitle)).toBe(0);
});

test("rotating a project key rejects the previous key on the public API", async ({ page, request }) => {
  await seedDatabase();
  const fixture = await seedAccess();
  await signIn(page, "admin@example.com");

  const rotated = await callProcedure(page, "apiKey/rotateProjectApiKey", { projectId: fixture.storeProjectId });
  expect(rotated.status).toBeLessThan(400);
  const body = rotated.body as { json?: { key?: string } };
  const nextKey = body.json?.key ?? "";
  expect(nextKey).toMatch(/^snb_pk_live_/);

  const previous = await widgetConfig(request, activeKey);
  expect(previous.status()).toBeGreaterThanOrEqual(400);
  expect(previous.status()).toBeLessThan(500);

  const current = await widgetConfig(request, nextKey);
  expect(current.ok()).toBe(true);
});
