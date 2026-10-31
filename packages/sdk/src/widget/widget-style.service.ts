import { STYLE_ATTR } from "./widget-attribute.const";
import { widgetStyleAnnotation } from "./widget-style-annotation.const";
import { widgetStyleBase } from "./widget-style-base.const";
import { widgetStyleDiagnostic } from "./widget-style-diagnostic.const";
import { widgetStylePanel } from "./widget-style-panel.const";

const STYLES = `${widgetStyleBase}${widgetStylePanel}${widgetStyleDiagnostic}${widgetStyleAnnotation}`;

export function ensureStyles() {
  if (document.querySelector(`[${STYLE_ATTR}]`)) return;

  const style = document.createElement("style");
  style.setAttribute(STYLE_ATTR, "");
  style.textContent = STYLES;
  document.head.append(style);
}
