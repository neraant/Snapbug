import { expect, test } from "@playwright/test";

import { signIn } from "../shared/sign-in";
import { seedDatabase } from "../shared/seed/seed-database";
import { waitForReactFormHydration } from "../shared/wait-for-react-form-hydration";

test("a new project sheet does not show a required error until submit", async ({ page }) => {
  await seedDatabase();
  await signIn(page, "admin@example.com");
  await page.goto("/projects");
  const newProject = page.getByRole("button", { name: "New project" });
  await expect(newProject).toBeVisible();
  await page.waitForFunction(() => {
    const button = [...document.querySelectorAll("button")].find((element) =>
      element.textContent?.includes("New project"),
    );
    if (!button) return false;
    return Object.getOwnPropertyNames(button).some((name) => name.startsWith("__reactProps$"));
  });
  await newProject.click();
  await expect(page.getByRole("dialog", { name: "New project" })).toBeVisible();
  await waitForReactFormHydration(page);

  const nameField = page.getByRole("textbox", { name: "Project name" });

  await expect(page.getByText("Project name is required")).toHaveCount(0);
  await page.getByRole("button", { name: "Create project" }).click();
  await expect(page.getByRole("dialog", { name: "New project" })).toHaveCount(0);

  await newProject.click();
  await expect(page.getByRole("dialog", { name: "New project" })).toBeVisible();
  await waitForReactFormHydration(page);
  await nameField.fill("");
  await page.getByRole("button", { name: "Create project" }).click();
  await expect(page.getByText("Project name is required")).toBeVisible();
  await expect(page.getByRole("dialog", { name: "New project" })).toBeVisible();
});
