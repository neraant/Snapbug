import { describe, expect, it } from "vitest";

import {
  MOBILE_PANEL_BOTTOM_INSET_PX,
  TRIGGER_ABOVE_SHEET_GAP_PX,
  triggerBottomAboveSheetPx,
} from "./panel-mobile.const";

describe("triggerBottomAboveSheetPx", () => {
  it("includes mobile panel inset, panel height, and gap", () => {
    expect(triggerBottomAboveSheetPx(400)).toBe(MOBILE_PANEL_BOTTOM_INSET_PX + 400 + TRIGGER_ABOVE_SHEET_GAP_PX);
  });
});
