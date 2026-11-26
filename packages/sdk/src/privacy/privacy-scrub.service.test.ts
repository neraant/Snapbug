/**
 * @vitest-environment jsdom
 */
import { projectWidgetSettingModelDefaults } from "@workspace/validation/modules/project/dto/project-widget-setting.model";
import { describe, expect, it } from "vitest";

import { scrubAutomaticData } from "./privacy-scrub.service";

describe("scrubAutomaticData", () => {
  it("keeps the page url parseable when maskText collects fragments that appear in the href", () => {
    document.body.textContent = "Configure your http client";

    const privacy = {
      ...projectWidgetSettingModelDefaults.privacy,
      maskText: true,
      maskInputs: false,
    };
    const pageUrl = "https://snapbug-staging-playground.vercel.app/#apiKey=sb_test_key";

    const result = scrubAutomaticData(privacy, {
      url: pageUrl,
      consoleLogs: [],
      networkLogs: [],
    });

    expect(() => new URL(result.url)).not.toThrow();
    expect(result.url.startsWith("https://")).toBe(true);
    expect(result.url).not.toContain("[REDACTED]s://");
  });
});
