import type { ProjectWidgetSettingModelType } from "@workspace/validation/modules/project/dto/project-widget-setting.model";
import { projectWidgetSettingAccentValues } from "@workspace/validation/modules/project/dto/project-widget-setting.model";
import { projectWidgetSettingFontValues } from "@workspace/validation/shared/project-widget-setting-font.schema";

export const WIDGET_POSITIONS = new Set<ProjectWidgetSettingModelType["position"]>(["bottom-right", "bottom-left"]);
export const WIDGET_THEMES = new Set<ProjectWidgetSettingModelType["theme"]>(["auto", "light", "dark"]);
export const WIDGET_ACCENTS = new Set<string>(projectWidgetSettingAccentValues);
export const WIDGET_FONTS = new Set<NonNullable<ProjectWidgetSettingModelType["font"]>>(projectWidgetSettingFontValues);
