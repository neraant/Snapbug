/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from "vitest";

import { createDiagnosticControl } from "./panel-diagnostic.factory";

function switchForRow(root: HTMLElement, index: number) {
  return root.querySelectorAll<HTMLButtonElement>(".snapbug-switch")[index];
}

describe("createDiagnosticControl", () => {
  it("defaults all diagnostic toggles to on", () => {
    const diagnostic = createDiagnosticControl();
    expect(diagnostic.getValues()).toEqual({
      replay: true,
      console: true,
      network: true,
      environment: true,
    });
  });

  it("reflects toggled-off rows in getValues", () => {
    const diagnostic = createDiagnosticControl();
    document.body.append(diagnostic.root);

    switchForRow(diagnostic.root, 0)?.click();
    switchForRow(diagnostic.root, 1)?.click();
    switchForRow(diagnostic.root, 2)?.click();
    switchForRow(diagnostic.root, 3)?.click();

    expect(diagnostic.getValues()).toEqual({
      replay: false,
      console: false,
      network: false,
      environment: false,
    });

    document.body.removeChild(diagnostic.root);
  });
});
