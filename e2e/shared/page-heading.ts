import type { Page } from "@playwright/test";

export function pageHeading(page: Page, name: string) {
  return page.getByRole("heading", { name, exact: true }).and(page.locator("h1:not([aria-current='page'])"));
}
