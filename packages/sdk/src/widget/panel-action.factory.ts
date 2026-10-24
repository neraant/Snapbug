import type { PanelSession } from "./panel.types";
import { hidePanelFieldError } from "./panel-field-error.util";
import { clearPanelScreenshot } from "./panel-screenshot.factory";
import { showPanelForm } from "./panel-view.factory";

const MOBILE_PANEL_MAX_WIDTH_PX = 639;
const TRIGGER_ABOVE_SHEET_GAP_PX = 10;

export function bindPanelActions(session: PanelSession) {
  session.openPanel = () => openPanel(session);
  session.closePanel = () => closePanel(session);

  session.cancel.addEventListener("click", () => {
    session.closePanel();
  });
  session.done.addEventListener("click", () => {
    resetPanelForm(session);
    session.closePanel();
  });
  session.tryAgain.addEventListener("click", () => {
    showPanelForm(session);
    session.title.focus();
  });
  session.panel.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    event.preventDefault();
    session.closePanel();
  });
  session.trigger.addEventListener("click", () => {
    if (session.panel.classList.contains("snapbug-open")) session.closePanel();
    else session.openPanel();
  });
}

function openPanel(session: PanelSession) {
  showPanelForm(session);
  session.panel.inert = false;
  session.panel.setAttribute("aria-hidden", "false");
  session.trigger.setAttribute("aria-expanded", "true");
  requestAnimationFrame(() => {
    session.panel.classList.add("snapbug-open");
    session.title.focus();
    if (isMobilePanelViewport()) {
      positionTriggerAboveSheet(session);
    }
  });
}

function closePanel(session: PanelSession) {
  session.attempt += 1;
  if (!session.success.hidden) resetPanelForm(session);
  session.panel.classList.remove("snapbug-open");
  session.panel.setAttribute("aria-hidden", "true");
  session.panel.inert = true;
  session.trigger.setAttribute("aria-expanded", "false");
  resetTriggerAboveSheet(session);
  session.trigger.focus();
}

function isMobilePanelViewport(): boolean {
  return window.matchMedia(`(max-width: ${MOBILE_PANEL_MAX_WIDTH_PX}px)`).matches;
}

function positionTriggerAboveSheet(session: PanelSession) {
  session.trigger.classList.add("snapbug-trigger-above-sheet");
  updateTriggerAboveSheetBottom(session);

  if (!session.triggerAboveSheetObserver) {
    session.triggerAboveSheetObserver = new ResizeObserver(() => {
      if (!session.panel.classList.contains("snapbug-open")) return;
      updateTriggerAboveSheetBottom(session);
    });
    session.triggerAboveSheetObserver.observe(session.panel);
  }
}

function updateTriggerAboveSheetBottom(session: PanelSession) {
  const panelHeight = session.panel.offsetHeight;
  session.trigger.style.bottom = `${panelHeight + TRIGGER_ABOVE_SHEET_GAP_PX}px`;
}

function resetTriggerAboveSheet(session: PanelSession) {
  session.trigger.classList.remove("snapbug-trigger-above-sheet");
  session.trigger.style.bottom = "";
  session.triggerAboveSheetObserver?.disconnect();
  session.triggerAboveSheetObserver = undefined;
}

function resetPanelForm(session: PanelSession) {
  session.title.value = "";
  session.description.clear();
  hidePanelFieldError(session.title, session.titleError);
  hidePanelFieldError(session.description.editable, session.descriptionError);
  clearPanelScreenshot(session);
  showPanelForm(session);
}
