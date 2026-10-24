import type { ResolvedWidgetOptions } from "../core/widget-config.types";
import { WIDGET_FONT_STACKS } from "./widget-font.const";

export function applyWidgetRootOptions(element: HTMLElement, options: ResolvedWidgetOptions) {
  if (options.position === "bottom-left") {
    element.classList.add("snapbug-position-left");
  }

  if (options.theme === "light") {
    element.classList.add("snapbug-theme-light");
  } else if (options.theme === "dark") {
    element.classList.add("snapbug-theme-dark");
  }

  element.style.setProperty("--primary", options.accent);
  element.style.setProperty("--ring", options.accent);

  if (options.background) {
    element.style.setProperty("--card", options.background);
  }
  if (options.text) {
    element.style.setProperty("--foreground", options.text);
  }
  if (options.mutedText) {
    element.style.setProperty("--muted-foreground", options.mutedText);
  }
  if (options.font) {
    element.style.setProperty("--snapbug-font", WIDGET_FONT_STACKS[options.font]);
  }
}
