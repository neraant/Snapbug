import { expect, test } from "@playwright/test";

import { countTicketsByTitle, seedAccess } from "../shared/seed/seed-access";
import { seedDatabase } from "../shared/seed/seed-database";

const marketingKey = "sb_test_marketing_active";

test("widget calls succeed only from an allowed origin", async ({ request }) => {
  await seedDatabase();
  const fixture = await seedAccess();
  const allowedOrigin = `https://${fixture.allowedWidgetHost}`;
  const blockedOrigin = "https://evil.example";

  const preflight = await request.fetch("/api/bug-reports", {
    method: "OPTIONS",
    headers: { origin: allowedOrigin, "access-control-request-method": "POST" },
  });
  expect(preflight.status()).toBe(204);
  expect(preflight.headers()["access-control-allow-origin"]).toBeTruthy();

  const blockedConfig = await request.get(`/api/widget-config?apiKey=${marketingKey}`, {
    headers: { origin: blockedOrigin },
  });
  expect(blockedConfig.status()).toBe(403);

  const allowedConfig = await request.get(`/api/widget-config?apiKey=${marketingKey}`, {
    headers: { origin: allowedOrigin },
  });
  expect(allowedConfig.ok()).toBe(true);
  const config = (await allowedConfig.json()) as { buttonLabel?: string };
  expect(config.buttonLabel).toBe("Report a bug");

  const blockedTitle = "Blocked origin must not create a ticket";
  const blockedReport = await request.post("/api/bug-reports", {
    headers: { origin: blockedOrigin },
    data: {
      apiKey: marketingKey,
      title: blockedTitle,
      description: "This origin is not allowed.",
      url: "https://acme.test/contact",
    },
  });
  expect(blockedReport.status()).toBe(403);
  expect(await countTicketsByTitle(blockedTitle)).toBe(0);

  const allowedTitle = `Allowed origin report ${Date.now()}`;
  const allowedReport = await request.post("/api/bug-reports", {
    headers: { origin: allowedOrigin },
    data: {
      apiKey: marketingKey,
      title: allowedTitle,
      description: "This origin is on the allow list.",
      url: "https://acme.test/contact",
      stepsToReproduce: "1. Open contact.\n2. Send the report.",
    },
  });
  expect(allowedReport.ok()).toBe(true);
  const created = (await allowedReport.json()) as { title?: string; stepsToReproduce?: string };
  expect(created.title).toBe(allowedTitle);
  expect(created.stepsToReproduce).toContain("Open contact");
});
