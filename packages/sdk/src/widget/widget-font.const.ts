import type { ProjectWidgetSettingFontType } from "@workspace/validation/shared/project-widget-setting-font.schema";

export const WIDGET_FONT_STACKS: Record<ProjectWidgetSettingFontType, string> = {
  default: "Inter, system-ui, -apple-system, sans-serif",
  "system-ui": "system-ui, -apple-system, sans-serif",
  georgia: "Georgia, serif",
  monospace: "ui-monospace, SFMono-Regular, Menlo, monospace",
};
