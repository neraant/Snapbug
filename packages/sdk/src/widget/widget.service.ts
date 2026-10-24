import { startCollectors, stopCollectors } from "../collector/collector.service";
import { resolveWidgetOptions } from "../core/widget-config.service";
import type { WidgetConfig } from "../core/widget-config.types";
import { widgetState } from "../core/widget-state";
import { createPanel } from "./panel.factory";
import { createTrigger } from "./trigger.factory";
import { BUTTON_ATTR, PANEL_ATTR, STYLE_ATTR } from "./widget-attribute.const";
import { ensureStyles } from "./widget-style.service";

export function openWidget() {
  const openPanel = widgetState.openPanel;
  if (!isWidgetMounted() || !openPanel) return;

  const panel = widgetPanelElement();
  if (!panel || panel.classList.contains("snapbug-open")) return;

  openPanel();
}

export function closeWidget() {
  const closePanel = widgetState.closePanel;
  if (!isWidgetMounted() || !closePanel) return;

  const panel = widgetPanelElement();
  if (!panel || !panel.classList.contains("snapbug-open")) return;

  closePanel();
}

export function mountWidget(config: WidgetConfig) {
  if (isWidgetMounted()) return;

  const options = resolveWidgetOptions(config);

  widgetState.apiKey = config.apiKey;
  widgetState.host = config.host;
  widgetState.privacy = options.privacy;

  ensureStyles();

  const trigger = createTrigger(options);
  const panel = createPanel(trigger, options);

  document.body.append(trigger, panel);
  startCollectors();
}

export function unmountWidget() {
  stopCollectors();
  const outsideClick = widgetState.takeOutsideClick();
  if (outsideClick) document.removeEventListener("click", outsideClick);
  const hotkeyListener = widgetState.takeHotkeyListener();
  if (hotkeyListener) document.removeEventListener("keydown", hotkeyListener);
  widgetState.openPanel = null;
  widgetState.closePanel = null;
  document.querySelector(`[${BUTTON_ATTR}]`)?.remove();
  document.querySelector(`[${PANEL_ATTR}]`)?.remove();
  document.querySelector(`[${STYLE_ATTR}]`)?.remove();
  widgetState.clearReport();
}

function isWidgetMounted() {
  return document.querySelector(`[${BUTTON_ATTR}]`) !== null;
}

function widgetPanelElement() {
  const element = document.querySelector(`[${PANEL_ATTR}]`);
  return element instanceof HTMLElement ? element : null;
}
