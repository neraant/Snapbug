export const MOBILE_PANEL_MAX_WIDTH_PX = 639;
/** Clears a typical fixed bottom submit control on narrow viewports (~4.5rem). */
export const MOBILE_PANEL_BOTTOM_INSET_PX = 72;
export const TRIGGER_ABOVE_SHEET_GAP_PX = 10;

export function triggerBottomAboveSheetPx(panelHeightPx: number): number {
  return MOBILE_PANEL_BOTTOM_INSET_PX + panelHeightPx + TRIGGER_ABOVE_SHEET_GAP_PX;
}
