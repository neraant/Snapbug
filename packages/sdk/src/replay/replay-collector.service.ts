import { record } from "@rrweb/record";

import { widgetState } from "../core/widget-state";
import { BUTTON_ATTR, PANEL_ATTR } from "../widget/widget-attribute.const";
import { REPLAY_CHECKOUT_INTERVAL_MS } from "./replay.const";
import { clearReplayBuffer, pushReplayEvent } from "./replay-buffer";

const WIDGET_ROOT_CLASS = "snapbug";

let stopRecording: (() => void) | undefined;

export function startReplayCollector() {
  if (stopRecording || typeof window === "undefined") return;

  const privacy = widgetState.privacy;
  const blockSelectors = [
    `.${WIDGET_ROOT_CLASS}`,
    `[${PANEL_ATTR}]`,
    `[${BUTTON_ATTR}]`,
    ...(privacy?.blockSelectors ?? []),
  ];

  try {
    stopRecording = record({
      emit: (event, isCheckout) => pushReplayEvent(event, isCheckout),
      checkoutEveryNms: REPLAY_CHECKOUT_INTERVAL_MS,
      maskAllInputs: privacy?.maskInputs ?? true,
      ...(privacy?.maskText ? { maskTextSelector: "*" } : {}),
      blockClass: WIDGET_ROOT_CLASS,
      blockSelector: blockSelectors.join(","),
      ignoreClass: WIDGET_ROOT_CLASS,
    });
  } catch {
    stopRecording = undefined;
  }
}

export function stopReplayCollector() {
  stopRecording?.();
  stopRecording = undefined;
  clearReplayBuffer();
}
