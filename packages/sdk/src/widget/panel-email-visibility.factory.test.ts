/**
 * @vitest-environment jsdom
 */
import { projectWidgetSettingModelDefaults } from "@workspace/validation/modules/project/dto/project-widget-setting.model";
import { describe, expect, it } from "vitest";

import type { ResolvedWidgetOptions } from "../core/widget-config.types";
import { createPanel } from "./panel.factory";

function resolvedOptions(collectVisitorEmail: boolean): ResolvedWidgetOptions {
  return { ...projectWidgetSettingModelDefaults, collectVisitorEmail };
}

describe("createPanel email visibility", () => {
  it("includes the email field when collectVisitorEmail is true", () => {
    const trigger = document.createElement("button");
    const panel = createPanel(trigger, resolvedOptions(true));
    document.body.append(trigger, panel);

    expect(panel.querySelector("#snapbug-email")).not.toBeNull();

    panel.remove();
    trigger.remove();
  });

  it("omits the email field when collectVisitorEmail is false", () => {
    const trigger = document.createElement("button");
    const panel = createPanel(trigger, resolvedOptions(false));
    document.body.append(trigger, panel);

    expect(panel.querySelector("#snapbug-email")).toBeNull();

    panel.remove();
    trigger.remove();
  });
});
