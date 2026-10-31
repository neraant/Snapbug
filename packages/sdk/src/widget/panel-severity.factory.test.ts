/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from "vitest";

import { PANEL_SEVERITY_LABEL_ID } from "./panel.const";
import { createSeverityControl } from "./panel-severity.factory";

describe("createSeverityControl", () => {
  it("defaults to low severity", () => {
    const severity = createSeverityControl(PANEL_SEVERITY_LABEL_ID);
    expect(severity.getValue()).toBe("low");
  });

  it("returns the selected severity value", () => {
    const severity = createSeverityControl(PANEL_SEVERITY_LABEL_ID);
    document.body.append(severity.root);

    const high = severity.root.querySelectorAll<HTMLButtonElement>(".snapbug-severity-card")[1];
    high?.click();
    expect(severity.getValue()).toBe("high");

    const critical = severity.root.querySelectorAll<HTMLButtonElement>(".snapbug-severity-card")[2];
    critical?.click();
    expect(severity.getValue()).toBe("critical");

    document.body.removeChild(severity.root);
  });
});
