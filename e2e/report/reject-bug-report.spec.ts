import { expect, test } from "@playwright/test";

import { signIn } from "../shared/sign-in";
import { countTicketsByTitle } from "../shared/seed/seed-access";
import { seedDatabase } from "../shared/seed/seed-database";

const activeKey = "sb_test_store_active";
const projectId = "4a8c69a1-1ab1-45a8-8497-eae1e506d9d1";

test("an oversized body and a report without a title are rejected", async ({ request }) => {
  await seedDatabase();
  const oversizedTitle = "Oversized context must not create a ticket";
  const oversized = await request.post("/api/bug-reports", {
    data: {
      apiKey: activeKey,
      title: oversizedTitle,
      description: "The custom context is larger than the limit.",
      url: "https://store.acme.test/checkout",
      customContext: { note: "x".repeat(40_000) },
    },
  });
  expect(oversized.status()).toBeGreaterThanOrEqual(400);
  expect(oversized.status()).toBeLessThan(500);
  expect(await countTicketsByTitle(oversizedTitle)).toBe(0);

  const missingTitle = await request.post("/api/bug-reports", {
    data: {
      apiKey: activeKey,
      description: "A title is required.",
      url: "https://store.acme.test/checkout",
    },
  });
  expect(missingTitle.status()).toBeGreaterThanOrEqual(400);
  expect(missingTitle.status()).toBeLessThan(500);
});

test("steps to reproduce are stored and the ticket can be opened", async ({ page, request }) => {
  await seedDatabase();
  const title = `Steps report ${Date.now()}`;
  const steps = "1. Open the cart.\n2. Click Pay twice.";
  const createdResponse = await request.post("/api/bug-reports", {
    data: {
      apiKey: activeKey,
      title,
      description: "The pay button can be clicked twice.",
      url: "https://store.acme.test/checkout",
      stepsToReproduce: steps,
    },
  });
  expect(createdResponse.ok()).toBe(true);
  const created = (await createdResponse.json()) as { shortId?: string; stepsToReproduce?: string };
  expect(created.stepsToReproduce).toBe(steps);
  expect(created.shortId).toMatch(/SNB-\d+/);

  await signIn(page, "admin@example.com");
  await page.goto(`/tickets/${created.shortId}?projectId=${projectId}`);
  await expect(page.getByRole("heading", { name: title })).toBeVisible({ timeout: 30_000 });
  await expect(page.getByText("The pay button can be clicked twice.")).toBeVisible();
});
