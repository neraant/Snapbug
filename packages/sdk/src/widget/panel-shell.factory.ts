import { widgetState } from "../core/widget-state";
import { isEditableFocusTarget } from "./keyboard.util";
import type { PanelSession } from "./panel.types";

export function bindPanelShell(session: PanelSession) {
  const outsideClick = (event: MouseEvent) => {
    if (!session.panel.classList.contains("snapbug-open")) return;
    const target = event.target;
    if (!(target instanceof Node)) return;
    if (!target.isConnected) return;
    if (target instanceof Element && target.closest(".snapbug-annotation-overlay")) return;
    if (session.panel.contains(target) || session.trigger.contains(target)) return;
    session.closePanel();
  };
  widgetState.outsideClick = outsideClick;
  document.addEventListener("click", outsideClick);

  widgetState.openPanel = session.openPanel;
  widgetState.closePanel = session.closePanel;

  const hotkeyListener = (event: KeyboardEvent) => {
    if (event.defaultPrevented) return;
    if (!event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (event.code !== "KeyS" && event.key !== "s" && event.key !== "S") return;

    const active = document.activeElement;
    if (active instanceof Element && isEditableFocusTarget(active)) return;
    if (event.target instanceof Element && isEditableFocusTarget(event.target)) return;

    event.preventDefault();
    if (session.panel.classList.contains("snapbug-open")) session.closePanel();
    else session.openPanel();
  };
  widgetState.hotkeyListener = hotkeyListener;
  document.addEventListener("keydown", hotkeyListener);
}
