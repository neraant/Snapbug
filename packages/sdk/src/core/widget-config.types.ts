import type { ProjectWidgetSettingModelType } from "@workspace/validation/modules/project/dto/project-widget-setting.model";

export type WidgetConfig = {
  apiKey: string;
  host: string;
  position?: ProjectWidgetSettingModelType["position"];
  buttonLabel?: string;
  theme?: ProjectWidgetSettingModelType["theme"];
  accent?: ProjectWidgetSettingModelType["accent"];
  background?: ProjectWidgetSettingModelType["background"];
  text?: ProjectWidgetSettingModelType["text"];
  mutedText?: ProjectWidgetSettingModelType["mutedText"];
  font?: ProjectWidgetSettingModelType["font"];
  privacy?: Partial<ProjectWidgetSettingModelType["privacy"]>;
};

export type ResolvedWidgetOptions = Pick<
  ProjectWidgetSettingModelType,
  "position" | "buttonLabel" | "theme" | "accent" | "privacy" | "background" | "text" | "mutedText" | "font"
>;

export type RemoteWidgetConfig = Pick<
  ProjectWidgetSettingModelType,
  "position" | "buttonLabel" | "theme" | "accent" | "privacy" | "background" | "text" | "mutedText" | "font"
>;
