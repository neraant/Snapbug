import type { ResolvedWidgetOptions } from "../core/widget-config.types";
import { bugIcon } from "./bug-icon.factory";
import { BUTTON_ATTR } from "./widget-attribute.const";
import { applyWidgetRootOptions } from "./widget-root.service";

export function createTrigger(options: ResolvedWidgetOptions) {
  const button = document.createElement("button");

  button.type = "button";
  button.className = "snapbug snapbug-trigger";
  applyWidgetRootOptions(button, options);
  button.setAttribute(BUTTON_ATTR, "");
  button.setAttribute("aria-label", options.buttonLabel);
  button.setAttribute("aria-expanded", "false");
  button.title = options.buttonLabel;
  button.append(bugIcon());

  return button;
}
