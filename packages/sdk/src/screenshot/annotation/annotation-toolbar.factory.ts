import type { ScreenshotAnnotationLabels } from "./annotation.types";
import { arrowIcon, clearIcon, closeIcon, enlargeIcon, rectangleIcon } from "./annotation-icon.factory";

export function createToolButton(label: string, icon: SVGElement): HTMLButtonElement {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "snapbug-screenshot-tool";
  button.setAttribute("aria-label", label);
  button.title = label;
  button.append(icon);
  return button;
}

export function createAnnotationToolbar(labels: ScreenshotAnnotationLabels) {
  const toolbar = document.createElement("div");
  const rectangleButton = createToolButton(labels.rectangle, rectangleIcon());
  const arrowButton = createToolButton(labels.arrow, arrowIcon());
  const enlargeButton = createToolButton(labels.enlarge, enlargeIcon());
  const clearButton = createToolButton(labels.clear, clearIcon());
  const closeButton = createToolButton(labels.close, closeIcon());

  toolbar.className = "snapbug-screenshot-toolbar";
  closeButton.classList.add("snapbug-annotation-close");

  return { toolbar, rectangleButton, arrowButton, enlargeButton, clearButton, closeButton };
}
