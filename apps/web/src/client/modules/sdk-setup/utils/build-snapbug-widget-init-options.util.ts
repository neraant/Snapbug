import type { WidgetConfig } from "@workspace/sdk";
import {
  projectWidgetSettingModelDefaults,
  type ProjectWidgetSettingModelType,
} from "@workspace/validation/modules/project/dto/project-widget-setting.model";

export type SnapbugWidgetInitOptions = Omit<WidgetConfig, "apiKey" | "host">;

function buildPrivacyInitOptions(
  privacy: ProjectWidgetSettingModelType["privacy"],
): WidgetConfig["privacy"] | undefined {
  const defaults = projectWidgetSettingModelDefaults.privacy;
  const patch: NonNullable<WidgetConfig["privacy"]> = {};

  if (privacy.maskText !== defaults.maskText) {
    patch.maskText = privacy.maskText;
  }
  if (privacy.maskInputs !== defaults.maskInputs) {
    patch.maskInputs = privacy.maskInputs;
  }
  if (
    privacy.blockSelectors.length !== defaults.blockSelectors.length ||
    privacy.blockSelectors.some((selector, index) => selector !== defaults.blockSelectors[index])
  ) {
    patch.blockSelectors = privacy.blockSelectors;
  }

  return Object.keys(patch).length > 0 ? patch : undefined;
}

export function buildSnapbugWidgetInitOptions(settings: ProjectWidgetSettingModelType): SnapbugWidgetInitOptions {
  const defaults = projectWidgetSettingModelDefaults;
  const options: SnapbugWidgetInitOptions = {};

  if (settings.position !== defaults.position) {
    options.position = settings.position;
  }
  if (settings.buttonLabel !== defaults.buttonLabel) {
    options.buttonLabel = settings.buttonLabel;
  }
  if (settings.theme !== defaults.theme) {
    options.theme = settings.theme;
  }
  if (settings.accent !== defaults.accent) {
    options.accent = settings.accent;
  }
  if (settings.background !== undefined) {
    options.background = settings.background;
  }
  if (settings.text !== undefined) {
    options.text = settings.text;
  }
  if (settings.mutedText !== undefined) {
    options.mutedText = settings.mutedText;
  }
  if (settings.font !== undefined && settings.font !== "default") {
    options.font = settings.font;
  }

  const privacy = buildPrivacyInitOptions(settings.privacy);
  if (privacy !== undefined) {
    options.privacy = privacy;
  }

  return options;
}
