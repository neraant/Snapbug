import type { Page } from "@playwright/test";

/** Wait until a client form has React event handlers (avoids native GET submit before hydration). */
export async function waitForReactFormHydration(page: Page): Promise<void> {
  await page.waitForFunction(() => {
    const form = document.querySelector("form");
    if (!form) return false;
    return Object.getOwnPropertyNames(form).some((name) => name.startsWith("__reactProps$"));
  });
}
