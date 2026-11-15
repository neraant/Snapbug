import { projectWidgetSettingModelDefaults } from "@workspace/validation/modules/project/dto/project-widget-setting.model";
import { describe, expect, it } from "vitest";

import { mergeWidgetConfig, resolveWidgetOptions } from "./widget-config.service";
import type { RemoteWidgetConfig, WidgetConfig } from "./widget-config.types";

const baseConfig: WidgetConfig = {
  apiKey: "test-key",
  host: "https://example.test",
};

describe("resolveWidgetOptions", () => {
  it("defaults collectVisitorEmail to true", () => {
    expect(resolveWidgetOptions(baseConfig).collectVisitorEmail).toBe(true);
  });

  it("honors collectVisitorEmail when set on init config", () => {
    expect(resolveWidgetOptions({ ...baseConfig, collectVisitorEmail: false }).collectVisitorEmail).toBe(false);
  });
});

const remoteDefaults: RemoteWidgetConfig = {
  position: projectWidgetSettingModelDefaults.position,
  buttonLabel: projectWidgetSettingModelDefaults.buttonLabel,
  theme: projectWidgetSettingModelDefaults.theme,
  accent: projectWidgetSettingModelDefaults.accent,
  privacy: projectWidgetSettingModelDefaults.privacy,
};

describe("mergeWidgetConfig", () => {
  it("uses remote collectVisitorEmail when init omits it", () => {
    const merged = mergeWidgetConfig(baseConfig, { ...remoteDefaults, collectVisitorEmail: false });
    expect(resolveWidgetOptions(merged).collectVisitorEmail).toBe(false);
  });

  it("prefers init collectVisitorEmail over remote", () => {
    const merged = mergeWidgetConfig(
      { ...baseConfig, collectVisitorEmail: true },
      { ...remoteDefaults, collectVisitorEmail: false },
    );
    expect(resolveWidgetOptions(merged).collectVisitorEmail).toBe(true);
  });
});
